"""
Facilities views.
"""

from rest_framework import generics, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from accounts.permissions import ReadOnlyOrAdmin
from .models import EquipmentCategory, Equipment
from .serializers import (
    EquipmentCategorySerializer, EquipmentListSerializer,
    EquipmentDetailSerializer, EquipmentCreateUpdateSerializer,
)


class EquipmentCategoryListView(generics.ListAPIView):
    queryset = EquipmentCategory.objects.all()
    serializer_class = EquipmentCategorySerializer
    permission_classes = [permissions.AllowAny]
    pagination_class = None


class EquipmentListView(generics.ListCreateAPIView):
    queryset = Equipment.objects.select_related('category').prefetch_related('images')
    permission_classes = [ReadOnlyOrAdmin]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['category', 'status', 'requires_training', 'is_featured']
    search_fields = ['name', 'description', 'location']
    ordering_fields = ['name', 'created_at', 'status']

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return EquipmentCreateUpdateSerializer
        return EquipmentListSerializer


class EquipmentDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Equipment.objects.select_related('category').prefetch_related('images')
    permission_classes = [ReadOnlyOrAdmin]
    lookup_field = 'slug'

    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return EquipmentCreateUpdateSerializer
        return EquipmentDetailSerializer


class EquipmentAvailabilityView(APIView):
    """Check equipment availability for a specific date."""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, pk):
        from bookings.models import Booking
        date = request.query_params.get('date')
        if not date:
            return Response({'error': 'Date parameter is required.'}, status=400)

        bookings = Booking.objects.filter(
            equipment_id=pk,
            date=date,
            status__in=['pending', 'approved']
        ).values('start_time', 'end_time', 'status')

        return Response({
            'equipment_id': str(pk),
            'date': date,
            'booked_slots': list(bookings)
        })
