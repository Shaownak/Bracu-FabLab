"""
Facilities app - Equipment catalog and categories.
"""

import uuid
from django.db import models


class EquipmentCategory(models.Model):
    """Category for grouping equipment."""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)
    description = models.TextField(blank=True)
    icon = models.ImageField(upload_to="categories/icons/", blank=True, null=True)
    order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["order", "name"]
        verbose_name = "Equipment Category"
        verbose_name_plural = "Equipment Categories"

    def __str__(self):
        return self.name


class Equipment(models.Model):
    """Individual piece of equipment in the FabLab."""

    class Status(models.TextChoices):
        AVAILABLE = "available", "Available"
        IN_USE = "in_use", "In Use"
        MAINTENANCE = "maintenance", "Under Maintenance"
        RETIRED = "retired", "Retired"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=200)
    slug = models.SlugField(unique=True)
    category = models.ForeignKey(
        EquipmentCategory, on_delete=models.CASCADE, related_name="equipment"
    )
    description = models.TextField()
    specifications = models.JSONField(default=dict, blank=True)
    status = models.CharField(
        max_length=20, choices=Status.choices, default=Status.AVAILABLE
    )
    image = models.ImageField(upload_to="equipment/images/", blank=True, null=True)
    user_manual = models.FileField(
        upload_to="equipment/manuals/", blank=True, null=True
    )
    requires_training = models.BooleanField(default=False)
    required_certification = models.ForeignKey(
        "trainings.TrainingCourse",
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
        related_name="required_for_equipment",
    )
    hourly_rate = models.DecimalField(
        max_digits=10, decimal_places=2, null=True, blank=True
    )
    location = models.CharField(max_length=100, blank=True)
    is_featured = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["category", "name"]
        verbose_name = "Equipment"
        verbose_name_plural = "Equipment"

    def __str__(self):
        return f"{self.name} ({self.get_status_display()})"

    @property
    def is_available(self):
        return self.status == self.Status.AVAILABLE


class EquipmentImage(models.Model):
    """Image gallery for equipment."""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    equipment = models.ForeignKey(
        Equipment, on_delete=models.CASCADE, related_name="images"
    )
    image = models.ImageField(upload_to="equipment/images/")
    caption = models.CharField(max_length=200, blank=True)
    is_primary = models.BooleanField(default=False)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order"]
        verbose_name = "Equipment Image"
        verbose_name_plural = "Equipment Images"

    def __str__(self):
        return f"Image for {self.equipment.name}"
