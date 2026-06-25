"""Projects views."""

from rest_framework import generics, permissions
from accounts.permissions import ReadOnlyOrAdmin
from .models import ProjectCategory, Project
from .serializers import (
    ProjectCategorySerializer,
    ProjectListSerializer,
    ProjectDetailSerializer,
    ProjectCreateSerializer,
)


class ProjectCategoryListView(generics.ListAPIView):
    queryset = ProjectCategory.objects.all()
    serializer_class = ProjectCategorySerializer
    permission_classes = [permissions.AllowAny]
    pagination_class = None


class ProjectListView(generics.ListCreateAPIView):
    permission_classes = [ReadOnlyOrAdmin]
    filterset_fields = ["category", "status", "is_featured"]
    search_fields = ["title", "description", "technologies"]
    ordering_fields = ["created_at", "title"]

    def get_queryset(self):
        qs = Project.objects.select_related("category", "supervisor").prefetch_related(
            "images", "team_members"
        )
        if not (
            self.request.user.is_authenticated
            and (self.request.user.role == "admin" or self.request.user.is_superuser)
        ):
            qs = qs.filter(status="published")
        return qs

    def get_serializer_class(self):
        if self.request.method == "POST":
            return ProjectCreateSerializer
        return ProjectListSerializer


class ProjectDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Project.objects.select_related(
        "category", "supervisor"
    ).prefetch_related("images", "team_members")
    permission_classes = [ReadOnlyOrAdmin]
    lookup_field = "slug"

    def get_serializer_class(self):
        if self.request.method in ["PUT", "PATCH"]:
            return ProjectCreateSerializer
        return ProjectDetailSerializer
