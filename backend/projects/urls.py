from django.urls import path
from . import views
urlpatterns = [
    path('', views.ProjectListView.as_view(), name='project_list'),
    path('categories/', views.ProjectCategoryListView.as_view(), name='project_categories'),
    path('<slug:slug>/', views.ProjectDetailView.as_view(), name='project_detail'),
]
