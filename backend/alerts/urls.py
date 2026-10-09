from django.urls import path
from .views import PriceAlertListCreateView, PriceAlertDetailView

urlpatterns = [
    path('', PriceAlertListCreateView.as_view(), name='alert-list'),
    path('<int:pk>/', PriceAlertDetailView.as_view(), name='alert-detail'),
]
