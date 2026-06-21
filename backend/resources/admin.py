"""
Resources admin configuration.
"""

from django.contrib import admin
from .models import ResourceCategory, Resource


@admin.register(ResourceCategory)
class ResourceCategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug']
    prepopulated_fields = {'slug': ('name',)}


@admin.register(Resource)
class ResourceAdmin(admin.ModelAdmin):
    list_display = ['title', 'category', 'resource_type', 'file_size_display', 'download_count', 'created_at']
    list_filter = ['resource_type', 'category']
    search_fields = ['title', 'description']
    readonly_fields = ['download_count', 'created_at', 'updated_at']

    def file_size_display(self, obj):
        return obj.file_size_display
    file_size_display.short_description = 'File Size'
