from rest_framework import generics, status
from rest_framework.response import Response
from .models import PriceAlert
from .serializers import PriceAlertSerializer
from django.contrib.auth.models import User
from products.models import Product

class PriceAlertListCreateView(generics.ListCreateAPIView):
    serializer_class = PriceAlertSerializer
    permission_classes = []

    def get_queryset(self):
        if self.request.user.is_authenticated:
            return PriceAlert.objects.filter(user=self.request.user)
        demo_user = User.objects.filter(username='demouser').first()
        if demo_user:
            return PriceAlert.objects.filter(user=demo_user)
        return PriceAlert.objects.all()

    def perform_create(self, serializer):
        user = self.request.user
        if not user.is_authenticated:
            user, _ = User.objects.get_or_create(username='demouser', email='demo@pricewise.com')
        
        product_id = self.request.data.get('product')
        product = Product.objects.get(pk=product_id)
        offers = product.offers.all()
        current = min(o.final_price for o in offers) if offers else 0

        serializer.save(user=user, current_price=current)

class PriceAlertDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = PriceAlert.objects.all()
    serializer_class = PriceAlertSerializer
    permission_classes = []
