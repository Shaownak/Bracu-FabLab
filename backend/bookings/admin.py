"""
Bookings admin configuration.
"""

from django.contrib import admin
from .models import Booking, BookingHistory


class BookingHistoryInline(admin.TabularInline):
    model = BookingHistory
    extra = 0
    readonly_fields = ['changed_by', 'old_status', 'new_status', 'notes', 'timestamp']


@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    inlines = [BookingHistoryInline]
    list_display = ['user', 'equipment', 'date', 'start_time', 'end_time', 'status', 'created_at']
    list_filter = ['status', 'date', 'equipment__category']
    search_fields = ['user__email', 'user__first_name', 'equipment__name', 'purpose']
    list_editable = ['status']
    date_hierarchy = 'date'
    readonly_fields = ['qr_code', 'created_at', 'updated_at']

    actions = ['approve_bookings', 'reject_bookings']

    @admin.action(description='Approve selected bookings')
    def approve_bookings(self, request, queryset):
        updated = queryset.filter(status=Booking.Status.PENDING).update(
            status=Booking.Status.APPROVED, approved_by=request.user
        )
        self.message_user(request, f'{updated} booking(s) approved.')

    @admin.action(description='Reject selected bookings')
    def reject_bookings(self, request, queryset):
        updated = queryset.filter(status=Booking.Status.PENDING).update(
            status=Booking.Status.REJECTED
        )
        self.message_user(request, f'{updated} booking(s) rejected.')
