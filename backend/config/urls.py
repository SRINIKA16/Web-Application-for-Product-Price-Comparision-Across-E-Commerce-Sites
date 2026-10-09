from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/products/', include('products.urls')),
    path('api/stores/', include('stores.urls')),
    path('api/offers/', include('offers.urls')),
    path('api/recommendations/', include('recommendations.urls')),
    path('api/alerts/', include('alerts.urls')),
    path('api/wishlist/', include('wishlist.urls')),
    path('api/auth/', include('users.urls')),
    path('api/admin/analytics/', include('analytics.urls')),
]
