from django.urls import path
from . import views

urlpatterns = [
    path("dashboard/", views.DashboardStatsView.as_view(), name="dashboard_stats"),
    path("bookings/", views.BookingAnalyticsView.as_view(), name="booking_analytics"),
    path(
        "equipment/", views.EquipmentAnalyticsView.as_view(), name="equipment_analytics"
    ),
    path("public-stats/", views.PublicStatsView.as_view(), name="public_stats"),
    path("contact/", views.ContactFormView.as_view(), name="contact_form"),
]
