"""Events serializers."""

from rest_framework import serializers
from .models import Event, EventRegistration


class EventListSerializer(serializers.ModelSerializer):
    registered_count = serializers.IntegerField(read_only=True)
    spots_remaining = serializers.IntegerField(read_only=True)

    class Meta:
        model = Event
        fields = [
            "id",
            "title",
            "slug",
            "event_type",
            "image",
            "date",
            "start_time",
            "end_time",
            "venue",
            "max_participants",
            "registered_count",
            "spots_remaining",
            "is_featured",
            "status",
            "created_at",
            "description",
        ]


class EventDetailSerializer(serializers.ModelSerializer):
    registered_count = serializers.IntegerField(read_only=True)
    spots_remaining = serializers.IntegerField(read_only=True)
    is_registered = serializers.SerializerMethodField()

    class Meta:
        model = Event
        fields = [
            "id",
            "title",
            "slug",
            "event_type",
            "description",
            "image",
            "date",
            "start_time",
            "end_time",
            "venue",
            "max_participants",
            "registration_deadline",
            "registered_count",
            "spots_remaining",
            "is_featured",
            "status",
            "is_registered",
            "created_at",
            "updated_at",
        ]

    def get_is_registered(self, obj):
        request = self.context.get("request")
        if request and request.user.is_authenticated:
            return obj.registrations.filter(
                user=request.user, status__in=["registered", "attended"]
            ).exists()
        return False


class EventCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = [
            "title",
            "slug",
            "event_type",
            "description",
            "image",
            "date",
            "start_time",
            "end_time",
            "venue",
            "max_participants",
            "registration_deadline",
            "is_featured",
            "status",
        ]


class EventRegistrationSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source="user.get_full_name", read_only=True)
    user_email = serializers.CharField(source="user.email", read_only=True)
    event_title = serializers.CharField(source="event.title", read_only=True)

    class Meta:
        model = EventRegistration
        fields = [
            "id",
            "event",
            "user",
            "user_name",
            "user_email",
            "event_title",
            "status",
            "registered_at",
            "attended_at",
        ]
        read_only_fields = ["user"]
