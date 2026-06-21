"""
Resources app - Tutorials, manuals, and downloadable resources.
"""

import uuid
from django.db import models
from django.conf import settings


class ResourceCategory(models.Model):
    """Category for resources."""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)
    description = models.TextField(blank=True)

    class Meta:
        ordering = ['name']
        verbose_name = 'Resource Category'
        verbose_name_plural = 'Resource Categories'

    def __str__(self):
        return self.name


class Resource(models.Model):
    """Downloadable resource (tutorial, manual, SOP, etc.)."""

    class ResourceType(models.TextChoices):
        TUTORIAL = 'tutorial', 'Tutorial'
        MANUAL = 'manual', 'User Manual'
        SOP = 'sop', 'Standard Operating Procedure'
        SAFETY = 'safety', 'Safety Guideline'
        OTHER = 'other', 'Other'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=300)
    category = models.ForeignKey(
        ResourceCategory, on_delete=models.CASCADE, related_name='resources'
    )
    description = models.TextField(blank=True)
    file = models.FileField(upload_to='resources/files/')
    resource_type = models.CharField(max_length=20, choices=ResourceType.choices)
    file_size = models.PositiveIntegerField(default=0, help_text='File size in bytes')
    download_count = models.PositiveIntegerField(default=0)
    uploaded_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Resource'
        verbose_name_plural = 'Resources'

    def __str__(self):
        return self.title

    @property
    def file_size_display(self):
        """Human-readable file size."""
        size = self.file_size
        for unit in ['B', 'KB', 'MB', 'GB']:
            if size < 1024:
                return f"{size:.1f} {unit}"
            size /= 1024
        return f"{size:.1f} TB"
