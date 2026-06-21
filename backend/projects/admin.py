"""
Projects admin configuration.
"""

from django.contrib import admin
from .models import ProjectCategory, Project, ProjectImage


class ProjectImageInline(admin.TabularInline):
    model = ProjectImage
    extra = 1


@admin.register(ProjectCategory)
class ProjectCategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug']
    prepopulated_fields = {'slug': ('name',)}


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    inlines = [ProjectImageInline]
    list_display = ['title', 'category', 'supervisor', 'status', 'is_featured', 'created_at']
    list_filter = ['category', 'status', 'is_featured']
    search_fields = ['title', 'description']
    prepopulated_fields = {'slug': ('title',)}
    list_editable = ['status', 'is_featured']
    filter_horizontal = ['team_members']
    readonly_fields = ['created_at', 'updated_at']
