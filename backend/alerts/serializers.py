from rest_framework import serializers
from .models import PriceAlert
from products.serializers import ProductListSerializer

class PriceAlertSerializer(serializers.ModelSerializer):
    product_details = ProductListSerializer(source='product', read_only=True)
    is_triggered = serializers.ReadOnlyField()

    class Meta:
        model = PriceAlert
        fields = [
            'id', 'user', 'product', 'product_details', 'target_price',
            'current_price', 'active', 'is_triggered', 'created_at'
        ]
        read_only_fields = ['user', 'current_price']
