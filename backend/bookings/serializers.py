"""
Bookings serializers.
"""

from rest_framework import serializers
from .models import Booking, BookingHistory


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
            "created_at",
        ]
        read_only_fields = ["user"]


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
            "history",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["user", "status", "approved_by", "qr_code"]


class BookingCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = ["equipment", "date", "start_time", "end_time", "purpose"]

    def validate(self, attrs):
        # Check for time conflicts
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
