"""
Events admin configuration.
"""

from django.contrib import admin
from import_export.admin import ExportActionMixin
from .models import Event, EventRegistration


class EventRegistrationInline(admin.TabularInline):
    model = EventRegistration
    extra = 0
    readonly_fields = ['registered_at']


@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    inlines = [EventRegistrationInline]
    list_display = ['title', 'event_type', 'date', 'venue', 'status', 'registered_count', 'is_featured']
    list_filter = ['event_type', 'status', 'is_featured', 'date']
    search_fields = ['title', 'description', 'venue']
    prepopulated_fields = {'slug': ('title',)}
    list_editable = ['status', 'is_featured']
    date_hierarchy = 'date'
    readonly_fields = ['created_at', 'updated_at']

    def registered_count(self, obj):
        return obj.registered_count
    registered_count.short_description = 'Registrations'


@admin.register(EventRegistration)
class EventRegistrationAdmin(ExportActionMixin, admin.ModelAdmin):
    list_display = ['user', 'event', 'status', 'registered_at']
    list_filter = ['status', 'event']
    search_fields = ['user__email', 'user__first_name', 'event__title']
    list_editable = ['status']

    actions = ['mark_attended']

    @admin.action(description='Mark as attended')
    def mark_attended(self, request, queryset):
        from django.utils import timezone
        updated = queryset.update(status='attended', attended_at=timezone.now())
        self.message_user(request, f'{updated} registration(s) marked as attended.')
