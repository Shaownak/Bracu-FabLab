"""
Bookings views.
"""

import io
import qrcode
from django.core.files.base import ContentFile
from django.utils import timezone
from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from accounts.permissions import IsAdminUser, IsOwnerOrAdmin
from notifications.models import Notification
from .models import Booking, BookingHistory, BookingWaitlist
from .serializers import (
    BookingListSerializer,
    BookingDetailSerializer,
    BookingCreateSerializer,
    BookingApprovalSerializer,
    BookingWaitlistSerializer,
    BookingWaitlistCreateSerializer,
)


def trigger_waitlist_notifications(booking):
    """Notify users on the waitlist when a slot opens up."""
    waitlisted = BookingWaitlist.objects.filter(
        equipment=booking.equipment,
        date=booking.date,
        start_time__lt=booking.end_time,
        end_time__gt=booking.start_time,
    )
    for w in waitlisted:
        Notification.objects.create(
            user=w.user,
            title="Waitlist Slot Available!",
            message=f"The time slot for {booking.equipment.name} on {booking.date} ({booking.start_time}-{booking.end_time}) has opened up due to a cancellation or no-show. Book now before it gets taken!",
            notification_type=Notification.NotificationType.BOOKING,
            action_url="/bookings/create",
        )



class BookingListCreateView(generics.ListCreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ["status", "equipment", "date"]
    search_fields = ["equipment__name", "purpose"]
    ordering_fields = ["date", "created_at", "status"]

    def get_queryset(self):
        user = self.request.user
        if user.role == "admin" or user.is_superuser:
            return Booking.objects.select_related("user", "equipment").all()
        return Booking.objects.select_related("user", "equipment").filter(user=user)

    def get_serializer_class(self):
        if self.request.method == "POST":
            return BookingCreateSerializer
        return BookingListSerializer


class BookingDetailView(generics.RetrieveUpdateAPIView):
    queryset = Booking.objects.select_related("user", "equipment").prefetch_related(
        "history"
    )
    serializer_class = BookingDetailSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrAdmin]


class BookingApproveView(APIView):
    """Approve a booking (admin only)."""

    permission_classes = [IsAdminUser]

    def post(self, request, pk):
        try:
            booking = Booking.objects.get(pk=pk, status=Booking.Status.PENDING)
        except Booking.DoesNotExist:
            return Response(
                {"error": "Booking not found or not pending."},
                status=status.HTTP_404_NOT_FOUND,
            )

        serializer = BookingApprovalSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        old_status = booking.status
        booking.status = Booking.Status.APPROVED
        booking.approved_by = request.user
        booking.admin_notes = serializer.validated_data.get("admin_notes", "")

        # Generate QR code
        qr_data = f"FABLAB-BOOKING:{booking.id}|{booking.equipment.name}|{booking.date}|{booking.start_time}-{booking.end_time}"
        qr = qrcode.make(qr_data)
        buffer = io.BytesIO()
        qr.save(buffer, format="PNG")
        booking.qr_code.save(
            f"qr_{booking.id}.png", ContentFile(buffer.getvalue()), save=False
        )

        booking.save()

        BookingHistory.objects.create(
            booking=booking,
            changed_by=request.user,
            old_status=old_status,
            new_status=booking.status,
            notes=f"Approved by {request.user.get_full_name()}",
        )

        return Response(BookingDetailSerializer(booking).data)


class BookingRejectView(APIView):
    """Reject a booking (admin only)."""

    permission_classes = [IsAdminUser]

    def post(self, request, pk):
        try:
            booking = Booking.objects.get(pk=pk, status=Booking.Status.PENDING)
        except Booking.DoesNotExist:
            return Response(
                {"error": "Booking not found or not pending."},
                status=status.HTTP_404_NOT_FOUND,
            )

        serializer = BookingApprovalSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        old_status = booking.status
        booking.status = Booking.Status.REJECTED
        booking.admin_notes = serializer.validated_data.get("admin_notes", "")
        booking.save()

        BookingHistory.objects.create(
            booking=booking,
            changed_by=request.user,
            old_status=old_status,
            new_status=booking.status,
            notes=f"Rejected: {booking.admin_notes}",
        )

        trigger_waitlist_notifications(booking)

        return Response(BookingDetailSerializer(booking).data)


class BookingCancelView(APIView):
    """Cancel a booking (owner only)."""

    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        try:
            booking = Booking.objects.get(
                pk=pk, user=request.user, status__in=["pending", "approved"]
            )
        except Booking.DoesNotExist:
            return Response(
                {"error": "Booking not found or cannot be cancelled."},
                status=status.HTTP_404_NOT_FOUND,
            )

        old_status = booking.status
        booking.status = Booking.Status.CANCELLED
        booking.save()

        BookingHistory.objects.create(
            booking=booking,
            changed_by=request.user,
            old_status=old_status,
            new_status=booking.status,
            notes="Cancelled by user",
        )

        trigger_waitlist_notifications(booking)

        return Response(BookingDetailSerializer(booking).data)


class BookingCalendarView(APIView):
    """Get booking calendar data for a date range."""

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        start_date = request.query_params.get("start_date")
        end_date = request.query_params.get("end_date")
        equipment_id = request.query_params.get("equipment")

        queryset = Booking.objects.filter(status__in=["approved", "pending"])

        if start_date:
            queryset = queryset.filter(date__gte=start_date)
        if end_date:
            queryset = queryset.filter(date__lte=end_date)
        if equipment_id:
            queryset = queryset.filter(equipment_id=equipment_id)

        data = BookingListSerializer(queryset, many=True).data
        is_admin = request.user.role == "admin" or request.user.is_superuser
        if not is_admin:
            for item in data:
                if str(item.get("user")) != str(request.user.id):
                    item["user"] = None
                    item["user_name"] = "Reserved Slot"
        return Response(data)


class BookingQRVerifyView(APIView):
    """Verify QR code data and return booking details (admin/lab staff only)."""

    permission_classes = [IsAdminUser]

    def post(self, request):
        qr_data = request.data.get("qr_data", "")
        booking_id = request.data.get("booking_id", "")

        if qr_data and qr_data.startswith("FABLAB-BOOKING:"):
            parts = qr_data.split(":")
            if len(parts) > 1:
                id_part = parts[1].split("|")[0]
                booking_id = id_part

        if not booking_id:
            return Response(
                {"error": "Please provide valid qr_data or booking_id."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            booking = Booking.objects.select_related("user", "equipment").get(
                pk=booking_id
            )
        except (Booking.DoesNotExist, ValueError):
            return Response(
                {"error": "Booking not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        data = BookingDetailSerializer(booking).data
        data["can_check_in"] = booking.status == Booking.Status.APPROVED
        data["can_check_out"] = (
            booking.status == Booking.Status.APPROVED
            and booking.actual_start_time is not None
        )
        return Response(data)


class BookingCheckInView(APIView):
    """Check in a user at the machine using QR scan (admin/lab staff only)."""

    permission_classes = [IsAdminUser]

    def post(self, request, pk):
        try:
            booking = Booking.objects.get(pk=pk)
        except Booking.DoesNotExist:
            return Response(
                {"error": "Booking not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        if booking.status != Booking.Status.APPROVED:
            return Response(
                {"error": f"Cannot check in booking with status '{booking.status}'."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        booking.actual_start_time = timezone.now()
        booking.save()

        BookingHistory.objects.create(
            booking=booking,
            changed_by=request.user,
            old_status=booking.status,
            new_status=booking.status,
            notes=f"Checked in at machine by {request.user.get_full_name()}",
        )

        return Response(BookingDetailSerializer(booking).data)


class BookingCheckOutView(APIView):
    """Check out a user upon completing session (admin/lab staff only)."""

    permission_classes = [IsAdminUser]

    def post(self, request, pk):
        try:
            booking = Booking.objects.get(pk=pk)
        except Booking.DoesNotExist:
            return Response(
                {"error": "Booking not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        old_status = booking.status
        booking.actual_end_time = timezone.now()
        booking.status = Booking.Status.COMPLETED
        booking.save()

        BookingHistory.objects.create(
            booking=booking,
            changed_by=request.user,
            old_status=old_status,
            new_status=booking.status,
            notes=f"Checked out and completed session by {request.user.get_full_name()}",
        )

        return Response(BookingDetailSerializer(booking).data)


class BookingWaitlistListCreateView(generics.ListCreateAPIView):
    """List or subscribe to waitlists for fully booked slots."""

    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == "admin" or user.is_superuser:
            return BookingWaitlist.objects.select_related("user", "equipment").all()
        return BookingWaitlist.objects.select_related("user", "equipment").filter(
            user=user
        )

    def get_serializer_class(self):
        if self.request.method == "POST":
            return BookingWaitlistCreateSerializer
        return BookingWaitlistSerializer


class BookingWaitlistDeleteView(generics.DestroyAPIView):
    """Remove self from waitlist or admin remove waitlist entry."""

    permission_classes = [permissions.IsAuthenticated, IsOwnerOrAdmin]
    queryset = BookingWaitlist.objects.all()

