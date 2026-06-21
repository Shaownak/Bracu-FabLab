"""
Bookings app - Equipment booking and approval workflow.
"""

import uuid
from django.db import models
from django.conf import settings
from django.core.exceptions import ValidationError


class Booking(models.Model):
    """Equipment booking request with approval workflow."""

    class Status(models.TextChoices):
        PENDING = 'pending', 'Pending'
        APPROVED = 'approved', 'Approved'
        REJECTED = 'rejected', 'Rejected'
        CANCELLED = 'cancelled', 'Cancelled'
        COMPLETED = 'completed', 'Completed'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='bookings'
    )
    equipment = models.ForeignKey(
        'facilities.Equipment', on_delete=models.CASCADE, related_name='bookings'
    )
    date = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField()
    purpose = models.TextField()
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING)
    admin_notes = models.TextField(blank=True)
    approved_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL,
        null=True, blank=True, related_name='approved_bookings'
    )
    qr_code = models.ImageField(upload_to='bookings/qrcodes/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-date', '-start_time']
        verbose_name = 'Booking'
        verbose_name_plural = 'Bookings'
        indexes = [
            models.Index(fields=['date', 'equipment']),
            models.Index(fields=['user', 'status']),
        ]

    def __str__(self):
        return f"{self.user.get_full_name()} - {self.equipment.name} ({self.date})"

    def clean(self):
        """Validate booking time and check for conflicts."""
        if self.start_time and self.end_time and self.start_time >= self.end_time:
            raise ValidationError('End time must be after start time.')

        # Check for overlapping bookings
        if self.date and self.equipment_id:
            overlapping = Booking.objects.filter(
                equipment=self.equipment,
                date=self.date,
                status__in=[self.Status.PENDING, self.Status.APPROVED],
                start_time__lt=self.end_time,
                end_time__gt=self.start_time,
            ).exclude(pk=self.pk)

            if overlapping.exists():
                raise ValidationError('This time slot conflicts with an existing booking.')


class BookingHistory(models.Model):
    """Audit trail for booking status changes."""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    booking = models.ForeignKey(Booking, on_delete=models.CASCADE, related_name='history')
    changed_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True
    )
    old_status = models.CharField(max_length=20, blank=True)
    new_status = models.CharField(max_length=20)
    notes = models.TextField(blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-timestamp']
        verbose_name = 'Booking History'
        verbose_name_plural = 'Booking History'

    def __str__(self):
        return f"{self.booking} - {self.old_status} → {self.new_status}"
