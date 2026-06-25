"""
Trainings app - Training courses, lessons, and quizzes.
"""

import uuid
from django.db import models
from django.conf import settings


class TrainingCourse(models.Model):
    """Training course for equipment certification."""

    class Category(models.TextChoices):
        SAFETY = "safety", "Lab Safety"
        PRINTING_3D = "3d_printing", "3D Printing"
        LASER = "laser", "Laser Cutter Operation"
        CNC = "cnc", "CNC Operation"
        ELECTRONICS = "electronics", "Electronics Prototyping"
        PCB = "pcb", "PCB Fabrication"
        ROBOTICS = "robotics", "Robotics"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=300)
    slug = models.SlugField(unique=True)
    description = models.TextField()
    category = models.CharField(max_length=20, choices=Category.choices)
    thumbnail = models.ImageField(
        upload_to="training/thumbnails/", blank=True, null=True
    )
    duration_hours = models.PositiveIntegerField(default=1)
    is_required = models.BooleanField(default=False)
    order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["order", "title"]
        verbose_name = "Training Course"
        verbose_name_plural = "Training Courses"

    def __str__(self):
        return self.title

    @property
    def total_lessons(self):
        return self.lessons.count()


class Lesson(models.Model):
    """Individual lesson within a training course."""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    course = models.ForeignKey(
        TrainingCourse, on_delete=models.CASCADE, related_name="lessons"
    )
    title = models.CharField(max_length=300)
    content = models.TextField()
    video_url = models.URLField(blank=True)
    order = models.PositiveIntegerField(default=0)
    duration_minutes = models.PositiveIntegerField(default=10)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["order"]
        verbose_name = "Lesson"
        verbose_name_plural = "Lessons"

    def __str__(self):
        return f"{self.course.title} - {self.title}"


class Quiz(models.Model):
    """Quiz for a training course."""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    course = models.OneToOneField(
        TrainingCourse, on_delete=models.CASCADE, related_name="quiz"
    )
    title = models.CharField(max_length=300)
    passing_score = models.PositiveIntegerField(default=70)
    questions = models.JSONField(
        default=list,
        help_text="List of question objects: [{question, options: [], correct_answer: int}]",
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Quiz"
        verbose_name_plural = "Quizzes"

    def __str__(self):
        return f"Quiz: {self.title}"


class UserTrainingProgress(models.Model):
    """Tracks a user's progress through a training course."""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="training_progress",
    )
    course = models.ForeignKey(
        TrainingCourse, on_delete=models.CASCADE, related_name="user_progress"
    )
    completed_lessons = models.ManyToManyField(
        Lesson, blank=True, related_name="completions"
    )
    quiz_score = models.PositiveIntegerField(null=True, blank=True)
    quiz_passed = models.BooleanField(default=False)
    started_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        unique_together = ["user", "course"]
        verbose_name = "Training Progress"
        verbose_name_plural = "Training Progress"

    def __str__(self):
        return f"{self.user.get_full_name()} - {self.course.title}"

    @property
    def progress_percentage(self):
        total = self.course.total_lessons
        if total == 0:
            return 0
        completed = self.completed_lessons.count()
        return int((completed / total) * 100)
