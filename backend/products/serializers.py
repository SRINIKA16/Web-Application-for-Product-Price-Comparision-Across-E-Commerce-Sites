from rest_framework import serializers
from .models import Category, Product
from stores.models import Store
from offers.models import ProductOffer, PriceHistory

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'icon']

class StoreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Store
        fields = ['id', 'name', 'logo', 'website', 'active', 'rating']

class ProductOfferSerializer(serializers.ModelSerializer):
    store = StoreSerializer(read_only=True)
    final_price = serializers.ReadOnlyField()

    class Meta:
        model = ProductOffer
        fields = [
            'id', 'store', 'price', 'discount', 'delivery_charge',
            'final_price', 'availability', 'rating', 'product_url',
            'is_conditional_offer', 'offer_details', 'last_updated'
        ]

class PriceHistorySerializer(serializers.ModelSerializer):
    store_name = serializers.CharField(source='store.name', read_only=True)

    class Meta:
        model = PriceHistory
        fields = ['id', 'store_name', 'price', 'recorded_at']

class ProductListSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    lowest_price = serializers.SerializerMethodField()
    highest_price = serializers.SerializerMethodField()
    stores_count = serializers.SerializerMethodField()
    max_savings = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'brand', 'model_number', 'category_name',
            'image_url', 'rating', 'review_count', 'lowest_price',
            'highest_price', 'stores_count', 'max_savings', 'specifications'
        ]

    def get_lowest_price(self, obj):
        offers = obj.offers.all()
        if not offers:
            return 0
        return min(o.final_price for o in offers)

    def get_highest_price(self, obj):
        offers = obj.offers.all()
        if not offers:
            return 0
        return max(o.final_price for o in offers)

    def get_stores_count(self, obj):
        return obj.offers.count()

    def get_max_savings(self, obj):
        highest = self.get_highest_price(obj)
        lowest = self.get_lowest_price(obj)
        return max(0, highest - lowest)

class ProductDetailSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    offers = ProductOfferSerializer(many=True, read_only=True)
    lowest_price = serializers.SerializerMethodField()
    highest_price = serializers.SerializerMethodField()
    max_savings = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'brand', 'model_number', 'category', 'description',
            'image_url', 'specifications', 'rating', 'review_count',
            'lowest_price', 'highest_price', 'max_savings', 'offers',
            'created_at', 'updated_at'
        ]

    def get_lowest_price(self, obj):
        offers = obj.offers.all()
        if not offers:
            return 0
        return min(o.final_price for o in offers)

    def get_highest_price(self, obj):
        offers = obj.offers.all()
        if not offers:
            return 0
        return max(o.final_price for o in offers)

    def get_max_savings(self, obj):
        highest = self.get_highest_price(obj)
        lowest = self.get_lowest_price(obj)
        return max(0, highest - lowest)
