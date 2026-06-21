"""Trainings views."""
from django.utils import timezone
from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import TrainingCourse, Lesson, UserTrainingProgress
from .serializers import TrainingCourseListSerializer, TrainingCourseDetailSerializer, UserTrainingProgressSerializer, QuizSubmissionSerializer

class TrainingCourseListView(generics.ListAPIView):
    queryset = TrainingCourse.objects.all()
    serializer_class = TrainingCourseListSerializer
    permission_classes = [permissions.AllowAny]
    filterset_fields = ['category', 'is_required']
    search_fields = ['title', 'description']

class TrainingCourseDetailView(generics.RetrieveAPIView):
    queryset = TrainingCourse.objects.prefetch_related('lessons', 'quiz')
    serializer_class = TrainingCourseDetailSerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = 'slug'

class UpdateProgressView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def post(self, request, pk):
        lesson_id = request.data.get('lesson_id')
        if not lesson_id:
            return Response({'error': 'lesson_id is required.'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            lesson = Lesson.objects.get(pk=lesson_id, course_id=pk)
        except Lesson.DoesNotExist:
            return Response({'error': 'Lesson not found.'}, status=status.HTTP_404_NOT_FOUND)
        progress, created = UserTrainingProgress.objects.get_or_create(user=request.user, course_id=pk)
        progress.completed_lessons.add(lesson)
        return Response(UserTrainingProgressSerializer(progress).data)

class SubmitQuizView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def post(self, request, pk):
        try:
            course = TrainingCourse.objects.get(pk=pk)
            quiz = course.quiz
        except (TrainingCourse.DoesNotExist, Exception):
            return Response({'error': 'Course or quiz not found.'}, status=status.HTTP_404_NOT_FOUND)
        serializer = QuizSubmissionSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        answers = serializer.validated_data['answers']
        questions = quiz.questions
        if len(answers) != len(questions):
            return Response({'error': 'Answer count does not match question count.'}, status=status.HTTP_400_BAD_REQUEST)
        correct = sum(1 for q, a in zip(questions, answers) if q.get('correct_answer') == a)
        score = int((correct / len(questions)) * 100) if questions else 0
        passed = score >= quiz.passing_score
        progress, created = UserTrainingProgress.objects.get_or_create(user=request.user, course=course)
        progress.quiz_score = score
        progress.quiz_passed = passed
        if passed:
            progress.completed_at = timezone.now()
        progress.save()
        return Response({'score': score, 'passed': passed, 'passing_score': quiz.passing_score, 'correct': correct, 'total': len(questions)})

class MyTrainingProgressView(generics.ListAPIView):
    serializer_class = UserTrainingProgressSerializer
    permission_classes = [permissions.IsAuthenticated]
    def get_queryset(self):
        return UserTrainingProgress.objects.filter(user=self.request.user).select_related('course')
