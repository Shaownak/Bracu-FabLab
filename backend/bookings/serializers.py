"""
Bookings serializers.
"""

from datetime import datetime, date, timedelta
from rest_framework import serializers
from certifications.models import Certificate
from .models import Booking, BookingHistory, BookingWaitlist


class BookingHistorySerializer(serializers.ModelSerializer):
    changed_by_name = serializers.CharField(
        source="changed_by.get_full_name", read_only=True
    )

    class Meta:
        model = BookingHistory
        fields = [
            "id",
            "old_status",
            "new_status",
            "notes",
            "changed_by_name",
            "timestamp",
        ]


class BookingListSerializer(serializers.ModelSerializer):
    equipment_name = serializers.CharField(source="equipment.name", read_only=True)
    user_name = serializers.CharField(source="user.get_full_name", read_only=True)

    class Meta:
        model = Booking
        fields = [
            "id",
            "user",
            "user_name",
            "equipment",
            "equipment_name",
            "date",
            "start_time",
            "end_time",
            "status",
            "actual_start_time",
            "actual_end_time",
            "created_at",
        ]
        read_only_fields = ["user", "actual_start_time", "actual_end_time"]


class BookingDetailSerializer(serializers.ModelSerializer):
    equipment_name = serializers.CharField(source="equipment.name", read_only=True)
    user_name = serializers.CharField(source="user.get_full_name", read_only=True)
    history = BookingHistorySerializer(many=True, read_only=True)

    class Meta:
        model = Booking
        fields = [
            "id",
            "user",
            "user_name",
            "equipment",
            "equipment_name",
            "date",
            "start_time",
            "end_time",
            "purpose",
            "status",
            "admin_notes",
            "approved_by",
            "qr_code",
            "actual_start_time",
            "actual_end_time",
            "history",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["user", "status", "approved_by", "qr_code", "actual_start_time", "actual_end_time"]


class BookingCreateSerializer(serializers.ModelSerializer):
    purpose = serializers.CharField(required=False, allow_blank=True, default="General fabrication project")

    class Meta:
        model = Booking
        fields = ["equipment", "date", "start_time", "end_time", "purpose"]

    def validate(self, attrs):
        if attrs["start_time"] >= attrs["end_time"]:
            raise serializers.ValidationError("End time must be after start time.")

        user = self.context["request"].user
        equipment = attrs["equipment"]

        # 1. Prerequisite check
        if equipment.requires_training and equipment.required_certification:
            cert = Certificate.objects.filter(
                user=user,
                course=equipment.required_certification,
                is_revoked=False,
            ).first()
            if not cert or not cert.is_valid:
                raise serializers.ValidationError(
                    f"You must hold a valid safety certificate for '{equipment.required_certification.title}' before booking this equipment."
                )

        # 2. Duration check (Max 4 hours per single booking)
        start_dt = datetime.combine(date.min, attrs["start_time"])
        end_dt = datetime.combine(date.min, attrs["end_time"])
        duration_hours = (end_dt - start_dt).total_seconds() / 3600.0
        if duration_hours > 4.0:
            raise serializers.ValidationError("A single booking cannot exceed 4 hours.")

        # 3. Quota check (Max 4 hrs/day and 12 hrs/week per category for non-admins)
        if user.role != "admin" and not user.is_superuser:
            # Check daily quota
            daily_bookings = Booking.objects.filter(
                user=user,
                equipment__category=equipment.category,
                date=attrs["date"],
                status__in=[Booking.Status.PENDING, Booking.Status.APPROVED],
            )
            daily_hours = duration_hours
            for b in daily_bookings:
                b_start = datetime.combine(date.min, b.start_time)
                b_end = datetime.combine(date.min, b.end_time)
                daily_hours += (b_end - b_start).total_seconds() / 3600.0
            if daily_hours > 4.0:
                raise serializers.ValidationError(
                    f"Daily quota exceeded: You can book at most 4 hours per day for this equipment category (Current total: {daily_hours:.1f} hrs)."
                )

            # Check weekly quota (current week Monday to Sunday)
            start_of_week = attrs["date"] - timedelta(days=attrs["date"].weekday())
            end_of_week = start_of_week + timedelta(days=6)
            weekly_bookings = Booking.objects.filter(
                user=user,
                equipment__category=equipment.category,
                date__range=[start_of_week, end_of_week],
                status__in=[Booking.Status.PENDING, Booking.Status.APPROVED],
            )
            weekly_hours = duration_hours
            for b in weekly_bookings:
                b_start = datetime.combine(date.min, b.start_time)
                b_end = datetime.combine(date.min, b.end_time)
                weekly_hours += (b_end - b_start).total_seconds() / 3600.0
            if weekly_hours > 12.0:
                raise serializers.ValidationError(
                    f"Weekly quota exceeded: You can book at most 12 hours per week for this equipment category (Current total: {weekly_hours:.1f} hrs)."
                )

        # 4. Check for time conflicts
        overlapping = Booking.objects.filter(
            equipment=attrs["equipment"],
            date=attrs["date"],
            status__in=["pending", "approved"],
            start_time__lt=attrs["end_time"],
            end_time__gt=attrs["start_time"],
        )
        if overlapping.exists():
            raise serializers.ValidationError(
                "This time slot conflicts with an existing booking."
            )
        return attrs

    def create(self, validated_data):
        validated_data["user"] = self.context["request"].user
        return super().create(validated_data)


class BookingApprovalSerializer(serializers.Serializer):
    admin_notes = serializers.CharField(required=False, allow_blank=True, default="")


class BookingWaitlistSerializer(serializers.ModelSerializer):
    equipment_name = serializers.CharField(source="equipment.name", read_only=True)
    user_name = serializers.CharField(source="user.get_full_name", read_only=True)

    class Meta:
        model = BookingWaitlist
        fields = [
            "id",
            "user",
            "user_name",
            "equipment",
            "equipment_name",
            "date",
            "start_time",
            "end_time",
            "created_at",
        ]
        read_only_fields = ["user"]


class BookingWaitlistCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = BookingWaitlist
        fields = ["equipment", "date", "start_time", "end_time"]

    def validate(self, attrs):
        if attrs["start_time"] >= attrs["end_time"]:
            raise serializers.ValidationError("End time must be after start time.")
        return attrs

    def create(self, validated_data):
        validated_data["user"] = self.context["request"].user
        return super().create(validated_data)

