"""
Projects app - Project showcase and gallery.
"""

import uuid
from django.db import models
from django.conf import settings


class ProjectCategory(models.Model):
    """Category for projects."""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)
    description = models.TextField(blank=True)

    class Meta:
        ordering = ["name"]
        verbose_name = "Project Category"
        verbose_name_plural = "Project Categories"

    def __str__(self):
        return self.name


class Project(models.Model):
    """Student/Faculty project showcase."""

    class Status(models.TextChoices):
        DRAFT = "draft", "Draft"
        PUBLISHED = "published", "Published"
        ARCHIVED = "archived", "Archived"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=300)
    slug = models.SlugField(unique=True)
    category = models.ForeignKey(
        ProjectCategory, on_delete=models.CASCADE, related_name="projects"
    )
    description = models.TextField()
    team_members = models.ManyToManyField(
        settings.AUTH_USER_MODEL, related_name="projects", blank=True
    )
    supervisor = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="supervised_projects",
    )
    technologies = models.JSONField(default=list, blank=True)
    videos = models.JSONField(default=list, blank=True)
    awards = models.TextField(blank=True)
    is_featured = models.BooleanField(default=False)
    status = models.CharField(
        max_length=20, choices=Status.choices, default=Status.DRAFT
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Project"
        verbose_name_plural = "Projects"

    def __str__(self):
        return self.title


class ProjectImage(models.Model):
    """Image gallery for projects."""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    project = models.ForeignKey(
        Project, on_delete=models.CASCADE, related_name="images"
    )
    image = models.ImageField(upload_to="projects/images/")
    caption = models.CharField(max_length=200, blank=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order"]

    def __str__(self):
        return f"Image for {self.project.title}"
