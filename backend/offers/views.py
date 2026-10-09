from rest_framework import generics
from .models import ProductOffer
from products.serializers import ProductOfferSerializer

class OfferListCreateView(generics.ListCreateAPIView):
    queryset = ProductOffer.objects.all().select_related('store', 'product')
    serializer_class = ProductOfferSerializer
    permission_classes = []

class OfferDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = ProductOffer.objects.all()
    serializer_class = ProductOfferSerializer
    permission_classes = []
