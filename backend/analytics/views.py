"""Analytics views - Dashboard statistics and contact form."""
from django.utils import timezone
from django.db.models import Count
from django.db.models.functions import TruncMonth
from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from accounts.permissions import IsAdminUser
from .models import ContactMessage
from .serializers import ContactMessageSerializer

class ContactFormView(generics.CreateAPIView):
    queryset = ContactMessage.objects.all()
    serializer_class = ContactMessageSerializer
    permission_classes = [permissions.AllowAny]

class DashboardStatsView(APIView):
    """Admin dashboard statistics."""
    permission_classes = [IsAdminUser]

    def get(self, request):
        from django.contrib.auth import get_user_model
        from facilities.models import Equipment
        from bookings.models import Booking
        from events.models import Event, EventRegistration
        from projects.models import Project
        from certifications.models import Certificate

        User = get_user_model()
        now = timezone.now()

        stats = {
            'users': {
                'total': User.objects.count(),
                'students': User.objects.filter(role='student').count(),
                'faculty': User.objects.filter(role='faculty').count(),
                'verified': User.objects.filter(is_verified=True).count(),
            },
            'equipment': {
                'total': Equipment.objects.count(),
                'available': Equipment.objects.filter(status='available').count(),
                'in_use': Equipment.objects.filter(status='in_use').count(),
                'maintenance': Equipment.objects.filter(status='maintenance').count(),
            },
            'bookings': {
                'total': Booking.objects.count(),
                'pending': Booking.objects.filter(status='pending').count(),
                'approved': Booking.objects.filter(status='approved').count(),
                'completed': Booking.objects.filter(status='completed').count(),
            },
            'events': {
                'total': Event.objects.count(),
                'upcoming': Event.objects.filter(status='upcoming').count(),
                'registrations': EventRegistration.objects.count(),
            },
            'projects': {
                'total': Project.objects.count(),
                'published': Project.objects.filter(status='published').count(),
            },
            'certificates': {
                'total': Certificate.objects.count(),
                'valid': Certificate.objects.filter(is_revoked=False).count(),
            },
        }
        return Response(stats)

class BookingAnalyticsView(APIView):
    """Monthly booking analytics."""
    permission_classes = [IsAdminUser]

    def get(self, request):
        from bookings.models import Booking
        monthly = (
            Booking.objects.filter(created_at__year=timezone.now().year)
            .annotate(month=TruncMonth('created_at'))
            .values('month')
            .annotate(count=Count('id'))
            .order_by('month')
        )
        return Response(list(monthly))

class EquipmentAnalyticsView(APIView):
    """Equipment utilization analytics."""
    permission_classes = [IsAdminUser]

    def get(self, request):
        from bookings.models import Booking
        utilization = (
            Booking.objects.filter(status__in=['approved', 'completed'])
            .values('equipment__name')
            .annotate(booking_count=Count('id'))
            .order_by('-booking_count')[:10]
        )
        return Response(list(utilization))

class PublicStatsView(APIView):
    """Public statistics for the homepage."""
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        from django.contrib.auth import get_user_model
        from facilities.models import Equipment
        from projects.models import Project
        from events.models import Event

        User = get_user_model()

        return Response({
            'total_machines': Equipment.objects.count(),
            'active_members': User.objects.filter(is_active=True).count(),
            'completed_projects': Project.objects.filter(status='published').count(),
            'workshops_conducted': Event.objects.filter(status='completed').count(),
        })
