from django.urls import path
from . import views
urlpatterns = [
    path('', views.ResourceListView.as_view(), name='resource_list'),
    path('categories/', views.ResourceCategoryListView.as_view(), name='resource_categories'),
    path('<uuid:pk>/download/', views.ResourceDownloadView.as_view(), name='resource_download'),
]
