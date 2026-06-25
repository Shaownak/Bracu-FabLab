from django.urls import path
from . import views

urlpatterns = [
    path("courses/", views.TrainingCourseListView.as_view(), name="training_list"),
    path(
        "courses/<slug:slug>/",
        views.TrainingCourseDetailView.as_view(),
        name="training_detail",
    ),
    path(
        "courses/<uuid:pk>/progress/",
        views.UpdateProgressView.as_view(),
        name="update_progress",
    ),
    path("courses/<uuid:pk>/quiz/", views.SubmitQuizView.as_view(), name="submit_quiz"),
    path("my-progress/", views.MyTrainingProgressView.as_view(), name="my_progress"),
]
