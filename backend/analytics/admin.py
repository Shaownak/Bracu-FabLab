"""
Analytics admin configuration.
"""

from django.contrib import admin
from .models import AuditLog, ContactMessage


@admin.register(AuditLog)
class AuditLogAdmin(admin.ModelAdmin):
    list_display = [
        "user",
        "action",
        "model_name",
        "object_id",
        "ip_address",
        "timestamp",
    ]
    list_filter = ["action", "model_name", "timestamp"]
    search_fields = ["user__email", "action", "model_name"]
    readonly_fields = [
        "user",
        "action",
        "model_name",
        "object_id",
        "details",
        "ip_address",
        "timestamp",
    ]
    date_hierarchy = "timestamp"

    def has_add_permission(self, request):
        return False

    def has_change_permission(self, request, obj=None):
        return False


@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ["name", "email", "subject", "is_read", "created_at", "replied_at"]
    list_filter = ["is_read", "created_at"]
    search_fields = ["name", "email", "subject", "message"]
    list_editable = ["is_read"]
    readonly_fields = ["name", "email", "subject", "message", "created_at"]
    date_hierarchy = "created_at"
