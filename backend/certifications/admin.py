"""
Certifications admin configuration.
"""

from django.contrib import admin
from .models import Certificate


@admin.register(Certificate)
class CertificateAdmin(admin.ModelAdmin):
    list_display = [
        "user",
        "course",
        "certificate_id",
        "is_valid",
        "is_revoked",
        "issued_at",
    ]
    list_filter = ["is_revoked", "course", "issued_at"]
    search_fields = [
        "user__email",
        "user__first_name",
        "course__title",
        "certificate_id",
    ]
    readonly_fields = ["certificate_id", "issued_at"]

    actions = ["revoke_certificates"]

    @admin.action(description="Revoke selected certificates")
    def revoke_certificates(self, request, queryset):
        updated = queryset.update(is_revoked=True, revoked_reason="Revoked by admin")
        self.message_user(request, f"{updated} certificate(s) revoked.")

    def is_valid(self, obj):
        return obj.is_valid

    is_valid.boolean = True
    is_valid.short_description = "Valid"
