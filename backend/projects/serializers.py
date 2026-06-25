"""Projects serializers."""

from rest_framework import serializers
from .models import ProjectCategory, Project, ProjectImage


class ProjectImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectImage
        fields = ["id", "image", "caption", "order"]


class ProjectCategorySerializer(serializers.ModelSerializer):
    project_count = serializers.SerializerMethodField()

    class Meta:
        model = ProjectCategory
        fields = ["id", "name", "slug", "description", "project_count"]

    def get_project_count(self, obj):
        return obj.projects.filter(status="published").count()


class ProjectListSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source="category.name", read_only=True)
    primary_image = serializers.SerializerMethodField()
    team_count = serializers.SerializerMethodField()

    class Meta:
        model = Project
        fields = [
            "id",
            "title",
            "slug",
            "category",
            "category_name",
            "technologies",
            "is_featured",
            "status",
            "primary_image",
            "team_count",
            "created_at",
            "description",
        ]

    def get_primary_image(self, obj):
        img = obj.images.first()
        return ProjectImageSerializer(img).data if img else None

    def get_team_count(self, obj):
        return obj.team_members.count()


class ProjectDetailSerializer(serializers.ModelSerializer):
    category = ProjectCategorySerializer(read_only=True)
    images = ProjectImageSerializer(many=True, read_only=True)
    team_members_data = serializers.SerializerMethodField()
    supervisor_name = serializers.CharField(
        source="supervisor.get_full_name", read_only=True, default=None
    )

    class Meta:
        model = Project
        fields = [
            "id",
            "title",
            "slug",
            "category",
            "description",
            "team_members_data",
            "supervisor",
            "supervisor_name",
            "technologies",
            "videos",
            "awards",
            "is_featured",
            "status",
            "images",
            "created_at",
            "updated_at",
        ]

    def get_team_members_data(self, obj):
        return [
            {"id": str(m.id), "name": m.get_full_name(), "email": m.email}
            for m in obj.team_members.all()
        ]


class ProjectCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = [
            "title",
            "slug",
            "category",
            "description",
            "team_members",
            "supervisor",
            "technologies",
            "videos",
            "awards",
            "is_featured",
            "status",
        ]
