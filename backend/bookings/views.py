"""
Bookings views.
"""

import io
import qrcode
from django.core.files.base import ContentFile
from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from accounts.permissions import IsAdminUser, IsOwnerOrAdmin
from .models import Booking, BookingHistory
from .serializers import (
    BookingListSerializer,
    BookingDetailSerializer,
    BookingCreateSerializer,
    BookingApprovalSerializer,
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

        return Response(BookingListSerializer(queryset, many=True).data)
