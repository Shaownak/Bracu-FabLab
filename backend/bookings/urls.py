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
    path("verify-qr/", views.BookingQRVerifyView.as_view(), name="booking_verify_qr"),
    path("<uuid:pk>/check-in/", views.BookingCheckInView.as_view(), name="booking_check_in"),
    path("<uuid:pk>/check-out/", views.BookingCheckOutView.as_view(), name="booking_check_out"),
    path("waitlist/", views.BookingWaitlistListCreateView.as_view(), name="booking_waitlist_list_create"),
    path("waitlist/<uuid:pk>/", views.BookingWaitlistDeleteView.as_view(), name="booking_waitlist_delete"),
]
