from django.urls import path
from . import views

urlpatterns = [
    path("", views.NotificationListView.as_view(), name="notification_list"),
    path("unread-count/", views.UnreadCountView.as_view(), name="unread_count"),
    path("<uuid:pk>/read/", views.NotificationMarkReadView.as_view(), name="mark_read"),
    path(
        "mark-all-read/",
        views.NotificationMarkAllReadView.as_view(),
        name="mark_all_read",
    ),
]
