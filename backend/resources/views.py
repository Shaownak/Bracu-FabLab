"""Resources views."""

from django.db.models import F
from rest_framework import generics, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from django.http import FileResponse
from accounts.permissions import ReadOnlyOrAdmin
from .models import ResourceCategory, Resource
from .serializers import (
    ResourceCategorySerializer,
    ResourceSerializer,
    ResourceCreateSerializer,
)


class ResourceCategoryListView(generics.ListAPIView):
    queryset = ResourceCategory.objects.all()
    serializer_class = ResourceCategorySerializer
    permission_classes = [permissions.AllowAny]
    pagination_class = None


class ResourceListView(generics.ListCreateAPIView):
    queryset = Resource.objects.select_related("category").all()
    permission_classes = [ReadOnlyOrAdmin]
    filterset_fields = ["category", "resource_type"]
    search_fields = ["title", "description"]
    ordering_fields = ["created_at", "download_count", "title"]

    def get_serializer_class(self):
        if self.request.method == "POST":
            return ResourceCreateSerializer
        return ResourceSerializer


class ResourceDownloadView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, pk):
        try:
            resource = Resource.objects.get(pk=pk)
        except Resource.DoesNotExist:
            return Response({"error": "Resource not found."}, status=404)
        Resource.objects.filter(pk=pk).update(download_count=F("download_count") + 1)
        return FileResponse(
            resource.file.open("rb"),
            as_attachment=True,
            filename=resource.file.name.split("/")[-1],
        )
