from rest_framework import generics, status
from rest_framework.response import Response
from .models import Wishlist
from .serializers import WishlistSerializer
from django.contrib.auth.models import User

class WishlistListCreateView(generics.ListCreateAPIView):
    serializer_class = WishlistSerializer
    permission_classes = []

    def get_queryset(self):
        if self.request.user.is_authenticated:
            return Wishlist.objects.filter(user=self.request.user)
        # Fallback for demo user
        demo_user = User.objects.filter(username='demouser').first()
        if demo_user:
            return Wishlist.objects.filter(user=demo_user)
        return Wishlist.objects.none()

    def perform_create(self, serializer):
        user = self.request.user
        if not user.is_authenticated:
            user, _ = User.objects.get_or_create(username='demouser', email='demo@pricewise.com')
        serializer.save(user=user)

class WishlistDetailView(generics.DestroyAPIView):
    queryset = Wishlist.objects.all()
    serializer_class = WishlistSerializer
    permission_classes = []
