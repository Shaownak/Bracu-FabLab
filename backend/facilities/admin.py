"""
Facilities admin configuration.
"""

from django.contrib import admin
from .models import EquipmentCategory, Equipment, EquipmentImage


class EquipmentImageInline(admin.TabularInline):
    model = EquipmentImage
    extra = 1


@admin.register(EquipmentCategory)
class EquipmentCategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug', 'order']
    prepopulated_fields = {'slug': ('name',)}
    list_editable = ['order']


@admin.register(Equipment)
class EquipmentAdmin(admin.ModelAdmin):
    inlines = [EquipmentImageInline]
    list_display = ['name', 'category', 'status', 'requires_training', 'is_featured', 'location']
    list_filter = ['category', 'status', 'requires_training', 'is_featured']
    search_fields = ['name', 'description', 'location']
    prepopulated_fields = {'slug': ('name',)}
    list_editable = ['status', 'is_featured']
    readonly_fields = ['created_at', 'updated_at']
