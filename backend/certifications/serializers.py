"""Certifications serializers."""

from rest_framework import serializers
from .models import Certificate


class CertificateSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source="user.get_full_name", read_only=True)
    course_title = serializers.CharField(source="course.title", read_only=True)
    is_valid = serializers.BooleanField(read_only=True)

    class Meta:
        model = Certificate
        fields = [
            "id",
            "user",
            "user_name",
            "course",
            "course_title",
            "certificate_id",
            "pdf_file",
            "qr_code",
            "issued_at",
            "expires_at",
            "is_revoked",
            "is_valid",
        ]
