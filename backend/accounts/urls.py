"""
Accounts URL configuration.
"""

from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from . import views

urlpatterns = [
    path("register/", views.RegisterView.as_view(), name="register"),
    path("login/", views.CustomTokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("profile/", views.ProfileView.as_view(), name="profile"),
    path(
        "password-reset/",
        views.PasswordResetRequestView.as_view(),
        name="password_reset",
    ),
    path("users/", views.UserListView.as_view(), name="user_list"),
    path("users/<uuid:pk>/", views.UserDetailView.as_view(), name="user_detail"),
    path(
        "users/<uuid:pk>/role/",
        views.UserRoleUpdateView.as_view(),
        name="user_role_update",
    ),
]
