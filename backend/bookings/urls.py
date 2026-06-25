"""
Bookings URL configuration.
"""

from django.urls import path
from . import views

urlpatterns = [
    path("", views.BookingListCreateView.as_view(), name="booking_list_create"),
    path("calendar/", views.BookingCalendarView.as_view(), name="booking_calendar"),
    path("<uuid:pk>/", views.BookingDetailView.as_view(), name="booking_detail"),
    path(
        "<uuid:pk>/approve/", views.BookingApproveView.as_view(), name="booking_approve"
    ),
    path("<uuid:pk>/reject/", views.BookingRejectView.as_view(), name="booking_reject"),
    path("<uuid:pk>/cancel/", views.BookingCancelView.as_view(), name="booking_cancel"),
]
