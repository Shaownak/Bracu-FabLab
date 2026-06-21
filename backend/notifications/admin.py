"""
Notifications admin configuration.
"""

from django.contrib import admin
from .models import Notification


@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ['title', 'user', 'notification_type', 'is_read', 'created_at']
    list_filter = ['notification_type', 'is_read']
    search_fields = ['title', 'message', 'user__email']
    list_editable = ['is_read']

    actions = ['mark_as_read']

    @admin.action(description='Mark as read')
    def mark_as_read(self, request, queryset):
        queryset.update(is_read=True)
