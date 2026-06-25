"""
Facilities URL configuration.
"""

from django.urls import path
from . import views

urlpatterns = [
    path("", views.EquipmentListView.as_view(), name="equipment_list"),
    path(
        "categories/",
        views.EquipmentCategoryListView.as_view(),
        name="equipment_categories",
    ),
    path("<slug:slug>/", views.EquipmentDetailView.as_view(), name="equipment_detail"),
    path(
        "<uuid:pk>/availability/",
        views.EquipmentAvailabilityView.as_view(),
        name="equipment_availability",
    ),
]
