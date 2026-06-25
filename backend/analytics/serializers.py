"""Analytics serializers."""

from rest_framework import serializers
from .models import ContactMessage, AuditLog


class ContactMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = ["id", "name", "email", "subject", "message", "created_at"]


class AuditLogSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(
        source="user.get_full_name", read_only=True, default="System"
    )

    class Meta:
        model = AuditLog
        fields = [
            "id",
            "user",
            "user_name",
            "action",
            "model_name",
            "object_id",
            "details",
            "ip_address",
            "timestamp",
        ]
