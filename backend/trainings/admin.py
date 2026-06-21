"""
Trainings admin configuration.
"""

from django.contrib import admin
from .models import TrainingCourse, Lesson, Quiz, UserTrainingProgress


class LessonInline(admin.TabularInline):
    model = Lesson
    extra = 1
    fields = ['title', 'order', 'duration_minutes', 'video_url']


class QuizInline(admin.StackedInline):
    model = Quiz
    extra = 0
    max_num = 1


@admin.register(TrainingCourse)
class TrainingCourseAdmin(admin.ModelAdmin):
    inlines = [LessonInline, QuizInline]
    list_display = ['title', 'category', 'duration_hours', 'is_required', 'total_lessons', 'order']
    list_filter = ['category', 'is_required']
    search_fields = ['title', 'description']
    prepopulated_fields = {'slug': ('title',)}
    list_editable = ['order', 'is_required']

    def total_lessons(self, obj):
        return obj.total_lessons
    total_lessons.short_description = 'Lessons'


@admin.register(UserTrainingProgress)
class UserTrainingProgressAdmin(admin.ModelAdmin):
    list_display = ['user', 'course', 'progress_percentage', 'quiz_passed', 'started_at', 'completed_at']
    list_filter = ['quiz_passed', 'course']
    search_fields = ['user__email', 'user__first_name', 'course__title']
    readonly_fields = ['started_at']

    def progress_percentage(self, obj):
        return f"{obj.progress_percentage}%"
    progress_percentage.short_description = 'Progress'
