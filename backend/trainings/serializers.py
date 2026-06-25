"""Trainings serializers."""

from rest_framework import serializers
from .models import TrainingCourse, Lesson, Quiz, UserTrainingProgress


class LessonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lesson
        fields = ["id", "title", "content", "video_url", "order", "duration_minutes"]


class QuizSerializer(serializers.ModelSerializer):
    class Meta:
        model = Quiz
        fields = ["id", "title", "passing_score", "questions"]


class TrainingCourseListSerializer(serializers.ModelSerializer):
    total_lessons = serializers.IntegerField(read_only=True)
    user_progress = serializers.SerializerMethodField()

    class Meta:
        model = TrainingCourse
        fields = [
            "id",
            "title",
            "slug",
            "description",
            "category",
            "thumbnail",
            "duration_hours",
            "is_required",
            "total_lessons",
            "user_progress",
        ]

    def get_user_progress(self, obj):
        request = self.context.get("request")
        if request and request.user.is_authenticated:
            try:
                progress = UserTrainingProgress.objects.get(
                    user=request.user, course=obj
                )
                return {
                    "progress": progress.progress_percentage,
                    "quiz_passed": progress.quiz_passed,
                    "completed": progress.completed_at is not None,
                }
            except UserTrainingProgress.DoesNotExist:
                pass
        return None


class TrainingCourseDetailSerializer(serializers.ModelSerializer):
    lessons = LessonSerializer(many=True, read_only=True)
    quiz = QuizSerializer(read_only=True)
    total_lessons = serializers.IntegerField(read_only=True)

    class Meta:
        model = TrainingCourse
        fields = [
            "id",
            "title",
            "slug",
            "description",
            "category",
            "thumbnail",
            "duration_hours",
            "is_required",
            "total_lessons",
            "lessons",
            "quiz",
        ]


class UserTrainingProgressSerializer(serializers.ModelSerializer):
    course_title = serializers.CharField(source="course.title", read_only=True)
    progress_percentage = serializers.IntegerField(read_only=True)

    class Meta:
        model = UserTrainingProgress
        fields = [
            "id",
            "course",
            "course_title",
            "progress_percentage",
            "quiz_score",
            "quiz_passed",
            "started_at",
            "completed_at",
        ]


class QuizSubmissionSerializer(serializers.Serializer):
    answers = serializers.ListField(child=serializers.IntegerField())
