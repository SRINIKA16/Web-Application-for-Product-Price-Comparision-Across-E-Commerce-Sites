from django.urls import path
from .views import (
    CategoryListView, ProductListView, ProductDetailView,
    ProductOffersView, ProductPriceHistoryView, ProductMatchView,
    ProductCreateView
)

urlpatterns = [
    path('categories/', CategoryListView.as_view(), name='category-list'),
    path('', ProductListView.as_view(), name='product-list'),
    path('create/', ProductCreateView.as_view(), name='product-create'),
    path('<int:pk>/', ProductDetailView.as_view(), name='product-detail'),
    path('<int:pk>/offers/', ProductOffersView.as_view(), name='product-offers'),
    path('<int:pk>/price-history/', ProductPriceHistoryView.as_view(), name='product-price-history'),
    path('match/', ProductMatchView.as_view(), name='product-match'),
]
