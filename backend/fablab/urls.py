"""
BRAC University FabLab - URL Configuration
"""

from django.contrib import admin
from django.conf import settings
from django.conf.urls.static import static
from django.urls import path, include
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView

# Customize admin site
admin.site.site_header = "BRAC University FabLab Administration"
admin.site.site_title = "FabLab Admin"
admin.site.index_title = "FabLab Management Dashboard"

urlpatterns = [
    # Admin
    path("admin/", admin.site.urls),
    # API endpoints
    path("api/auth/", include("accounts.urls")),
    path("api/equipment/", include("facilities.urls")),
    path("api/bookings/", include("bookings.urls")),
    path("api/projects/", include("projects.urls")),
    path("api/events/", include("events.urls")),
    path("api/training/", include("trainings.urls")),
    path("api/certificates/", include("certifications.urls")),
    path("api/resources/", include("resources.urls")),
    path("api/notifications/", include("notifications.urls")),
    path("api/analytics/", include("analytics.urls")),
    # API Documentation
    path("api/schema/", SpectacularAPIView.as_view(), name="schema"),
    path(
        "api/docs/",
        SpectacularSwaggerView.as_view(url_name="schema"),
        name="swagger-ui",
    ),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
