"""
Management command to check and mark no-show bookings.
"""

from datetime import datetime, timedelta
from django.core.management.base import BaseCommand
from django.utils import timezone
from bookings.models import Booking, BookingHistory
from bookings.views import trigger_waitlist_notifications
from notifications.models import Notification


class Command(BaseCommand):
    help = "Check for approved bookings where the user failed to check in within 20 minutes of start time and mark them as NO_SHOW."

    def add_arguments(self, parser):
        parser.add_argument(
            "--grace-minutes",
            type=int,
            default=20,
            help="Grace period in minutes before marking as no-show (default: 20)",
        )

    def handle(self, *args, **options):
        grace_minutes = options["grace_minutes"]
        now = timezone.localtime()
        today = now.date()

        # Find approved bookings for today or earlier that have not been checked in
        candidates = Booking.objects.select_related("user", "equipment").filter(
            status=Booking.Status.APPROVED,
            actual_start_time__isnull=True,
            date__lte=today,
        )

        count = 0
        for booking in candidates:
            # Combine booking date and start_time
            start_dt = timezone.make_aware(
                datetime.combine(booking.date, booking.start_time)
            )
            # If start_dt + grace period has passed
            if now >= start_dt + timedelta(minutes=grace_minutes):
                old_status = booking.status
                booking.status = Booking.Status.NO_SHOW
                booking.save()

                BookingHistory.objects.create(
                    booking=booking,
                    changed_by=None,
                    old_status=old_status,
                    new_status=booking.status,
                    notes=f"Automatically marked as No-Show (failed to check in within {grace_minutes} minutes)",
                )

                # Send in-app notification to the user
                Notification.objects.create(
                    user=booking.user,
                    title="Booking Marked as No-Show",
                    message=f"Your booking for {booking.equipment.name} on {booking.date} at {booking.start_time} was automatically cancelled because you did not check in within {grace_minutes} minutes.",
                    notification_type=Notification.NotificationType.BOOKING,
                )

                # Trigger notifications to waitlisted users
                trigger_waitlist_notifications(booking)

                self.stdout.write(
                    self.style.WARNING(
                        f"Marked booking {booking.id} ({booking.user.get_full_name()} - {booking.equipment.name}) as NO_SHOW."
                    )
                )
                count += 1

        self.stdout.write(
            self.style.SUCCESS(
                f"No-show check complete. Total bookings marked as NO_SHOW: {count}"
            )
        )
