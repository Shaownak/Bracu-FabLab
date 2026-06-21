"""Certifications views."""
from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from accounts.permissions import IsAdminUser
from .models import Certificate
from .serializers import CertificateSerializer

class CertificateListView(generics.ListAPIView):
    serializer_class = CertificateSerializer
    permission_classes = [permissions.IsAuthenticated]
    def get_queryset(self):
        user = self.request.user
        if user.role == 'admin' or user.is_superuser:
            return Certificate.objects.select_related('user', 'course').all()
        return Certificate.objects.select_related('user', 'course').filter(user=user)

class CertificateVerifyView(APIView):
    permission_classes = [permissions.AllowAny]
    def get(self, request, certificate_id):
        try:
            cert = Certificate.objects.select_related('user', 'course').get(certificate_id=certificate_id)
            return Response({
                'valid': cert.is_valid,
                'user': cert.user.get_full_name(),
                'course': cert.course.title,
                'issued_at': cert.issued_at,
                'is_revoked': cert.is_revoked,
            })
        except Certificate.DoesNotExist:
            return Response({'error': 'Certificate not found.'}, status=status.HTTP_404_NOT_FOUND)

class IssueCertificateView(APIView):
    permission_classes = [IsAdminUser]
    def post(self, request):
        user_id = request.data.get('user_id')
        course_id = request.data.get('course_id')
        if not user_id or not course_id:
            return Response({'error': 'user_id and course_id are required.'}, status=status.HTTP_400_BAD_REQUEST)
        cert, created = Certificate.objects.get_or_create(user_id=user_id, course_id=course_id)
        if not created:
            return Response({'error': 'Certificate already exists.'}, status=status.HTTP_400_BAD_REQUEST)
        return Response(CertificateSerializer(cert).data, status=status.HTTP_201_CREATED)
