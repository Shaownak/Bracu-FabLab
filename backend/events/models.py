"""
Events app - Event management and registration.
"""

import uuid
from django.db import models
from django.conf import settings


class Event(models.Model):
    """FabLab event (workshop, hackathon, competition, etc.)."""

    class EventType(models.TextChoices):
        WORKSHOP = "workshop", "Workshop"
        HACKATHON = "hackathon", "Hackathon"
        COMPETITION = "competition", "Competition"
        LECTURE = "lecture", "Guest Lecture"
        MAKER_FAIR = "maker_fair", "Maker Fair"

    class Status(models.TextChoices):
        UPCOMING = "upcoming", "Upcoming"
        ONGOING = "ongoing", "Ongoing"
        COMPLETED = "completed", "Completed"
        CANCELLED = "cancelled", "Cancelled"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=300)
    slug = models.SlugField(unique=True)
    event_type = models.CharField(max_length=20, choices=EventType.choices)
    description = models.TextField()
    image = models.ImageField(upload_to="events/images/", blank=True, null=True)
    date = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField()
    venue = models.CharField(max_length=200)
    max_participants = models.PositiveIntegerField(null=True, blank=True)
    registration_deadline = models.DateTimeField(null=True, blank=True)
    is_featured = models.BooleanField(default=False)
    status = models.CharField(
        max_length=20, choices=Status.choices, default=Status.UPCOMING
    )
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name="created_events",
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-date"]
        verbose_name = "Event"
        verbose_name_plural = "Events"

    def __str__(self):
        return f"{self.title} ({self.date})"

    @property
    def registered_count(self):
        return self.registrations.filter(status__in=["registered", "attended"]).count()

    @property
    def spots_remaining(self):
        if self.max_participants:
            return max(0, self.max_participants - self.registered_count)
        return None


class EventRegistration(models.Model):
    """Registration for an event by a user."""

    class Status(models.TextChoices):
        REGISTERED = "registered", "Registered"
        ATTENDED = "attended", "Attended"
        ABSENT = "absent", "Absent"
        CANCELLED = "cancelled", "Cancelled"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    event = models.ForeignKey(
        Event, on_delete=models.CASCADE, related_name="registrations"
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="event_registrations",
    )
    status = models.CharField(
        max_length=20, choices=Status.choices, default=Status.REGISTERED
    )
    registered_at = models.DateTimeField(auto_now_add=True)
    attended_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        unique_together = ["event", "user"]
        ordering = ["-registered_at"]

    def __str__(self):
        return f"{self.user.get_full_name()} → {self.event.title}"
