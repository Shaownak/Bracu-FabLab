"""Events views."""
from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from accounts.permissions import ReadOnlyOrAdmin, IsAdminUser
from .models import Event, EventRegistration
from .serializers import EventListSerializer, EventDetailSerializer, EventCreateSerializer, EventRegistrationSerializer

class EventListView(generics.ListCreateAPIView):
    queryset = Event.objects.all()
    permission_classes = [ReadOnlyOrAdmin]
    filterset_fields = ['event_type', 'status', 'is_featured']
    search_fields = ['title', 'description', 'venue']
    ordering_fields = ['date', 'created_at']
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return EventCreateSerializer
        return EventListSerializer

class EventDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Event.objects.all()
    permission_classes = [ReadOnlyOrAdmin]
    lookup_field = 'slug'
    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return EventCreateSerializer
        return EventDetailSerializer

class EventRegisterView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def post(self, request, pk):
        try:
            event = Event.objects.get(pk=pk)
        except Event.DoesNotExist:
            return Response({'error': 'Event not found.'}, status=status.HTTP_404_NOT_FOUND)
        if event.status != 'upcoming':
            return Response({'error': 'Registration is closed.'}, status=status.HTTP_400_BAD_REQUEST)
        if event.max_participants and event.registered_count >= event.max_participants:
            return Response({'error': 'Event is full.'}, status=status.HTTP_400_BAD_REQUEST)
        registration, created = EventRegistration.objects.get_or_create(event=event, user=request.user, defaults={'status': 'registered'})
        if not created:
            return Response({'error': 'Already registered.'}, status=status.HTTP_400_BAD_REQUEST)
        return Response(EventRegistrationSerializer(registration).data, status=status.HTTP_201_CREATED)

class EventRegistrationListView(generics.ListAPIView):
    serializer_class = EventRegistrationSerializer
    permission_classes = [IsAdminUser]
    def get_queryset(self):
        return EventRegistration.objects.filter(event_id=self.kwargs['pk']).select_related('user', 'event')

class MyEventsView(generics.ListAPIView):
    serializer_class = EventRegistrationSerializer
    permission_classes = [permissions.IsAuthenticated]
    def get_queryset(self):
        return EventRegistration.objects.filter(user=self.request.user).select_related('event')
