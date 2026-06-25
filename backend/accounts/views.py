"""
Accounts views - Registration, authentication, and user management.
"""

from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth import get_user_model
from .serializers import (
    UserSerializer,
    UserRegistrationSerializer,
    UserProfileUpdateSerializer,
    CustomTokenObtainPairSerializer,
    UserListSerializer,
    PasswordResetRequestSerializer,
)
from .permissions import IsAdminUser

User = get_user_model()


class RegisterView(generics.CreateAPIView):
    """User registration endpoint."""

    queryset = User.objects.all()
    serializer_class = UserRegistrationSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response(
            {
                "message": "Registration successful. Please verify your email.",
                "user": UserSerializer(user).data,
            },
            status=status.HTTP_201_CREATED,
        )


class CustomTokenObtainPairView(TokenObtainPairView):
    """Custom login endpoint that returns user data with tokens."""

    serializer_class = CustomTokenObtainPairSerializer


class ProfileView(generics.RetrieveUpdateAPIView):
    """Get or update the current user's profile."""

    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_class(self):
        if self.request.method in ["PUT", "PATCH"]:
            return UserProfileUpdateSerializer
        return UserSerializer

    def get_object(self):
        return self.request.user


class UserListView(generics.ListAPIView):
    """List all users (admin only)."""

    queryset = User.objects.all()
    serializer_class = UserListSerializer
    permission_classes = [IsAdminUser]
    filterset_fields = ["role", "is_verified", "department"]
    search_fields = ["email", "first_name", "last_name", "student_id"]
    ordering_fields = ["date_joined", "first_name", "email"]


class UserDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Get, update, or delete a user (admin only)."""

    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAdminUser]


class UserRoleUpdateView(APIView):
    """Update a user's role (admin only)."""

    permission_classes = [IsAdminUser]

    def put(self, request, pk):
        try:
            user = User.objects.get(pk=pk)
        except User.DoesNotExist:
            return Response(
                {"error": "User not found."}, status=status.HTTP_404_NOT_FOUND
            )

        role = request.data.get("role")
        if role not in dict(User.Role.choices):
            return Response(
                {"error": "Invalid role."}, status=status.HTTP_400_BAD_REQUEST
            )

        user.role = role
        user.save()
        return Response(UserSerializer(user).data)


class PasswordResetRequestView(APIView):
    """Request a password reset email."""

    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = PasswordResetRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        # In production, send email with reset token
        return Response({"message": "If the email exists, a reset link has been sent."})
