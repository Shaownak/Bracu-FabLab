"""
Certifications app - Certificate generation and verification.
"""

import uuid
from django.db import models
from django.conf import settings


class Certificate(models.Model):
    """Certificate issued upon training completion."""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="certificates"
    )
    course = models.ForeignKey(
        "trainings.TrainingCourse",
        on_delete=models.CASCADE,
        related_name="certificates",
    )
    certificate_id = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    pdf_file = models.FileField(upload_to="certificates/pdfs/", blank=True, null=True)
    qr_code = models.ImageField(
        upload_to="certificates/qrcodes/", blank=True, null=True
    )
    issued_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField(null=True, blank=True)
    is_revoked = models.BooleanField(default=False)
    revoked_reason = models.TextField(blank=True, null=True)

    class Meta:
        ordering = ["-issued_at"]
        unique_together = ["user", "course"]
        verbose_name = "Certificate"
        verbose_name_plural = "Certificates"

    def __str__(self):
        return f"Certificate: {self.user.get_full_name()} - {self.course.title}"

    @property
    def is_valid(self):
        if self.is_revoked:
            return False
        if self.expires_at:
            from django.utils import timezone

            return timezone.now() < self.expires_at
        return True
