from django.urls import path
from . import views
urlpatterns = [
    path('', views.CertificateListView.as_view(), name='certificate_list'),
    path('verify/<uuid:certificate_id>/', views.CertificateVerifyView.as_view(), name='certificate_verify'),
    path('issue/', views.IssueCertificateView.as_view(), name='certificate_issue'),
]
