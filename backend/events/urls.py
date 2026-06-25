from django.urls import path
from . import views

urlpatterns = [
    path("", views.EventListView.as_view(), name="event_list"),
    path("my/", views.MyEventsView.as_view(), name="my_events"),
    path("<slug:slug>/", views.EventDetailView.as_view(), name="event_detail"),
    path(
        "<uuid:pk>/register/", views.EventRegisterView.as_view(), name="event_register"
    ),
    path(
        "<uuid:pk>/registrations/",
        views.EventRegistrationListView.as_view(),
        name="event_registrations",
    ),
]
