from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db.models import Q
from datetime import timedelta
from django.utils import timezone

from .models import Category, Product
from .serializers import (
    CategorySerializer, ProductListSerializer, ProductDetailSerializer,
    ProductOfferSerializer, PriceHistorySerializer
)
from offers.models import ProductOffer, PriceHistory
from analytics.models import SearchHistory
from .matching import MatchingService

class CategoryListView(generics.ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = []

class ProductListView(generics.ListAPIView):
    serializer_class = ProductListSerializer
    permission_classes = []

    def get_queryset(self):
        queryset = Product.objects.all().prefetch_related('offers')
        query = self.request.query_params.get('search', '').strip()
        category = self.request.query_params.get('category', '').strip()
        brand = self.request.query_params.get('brand', '').strip()
        min_price = self.request.query_params.get('min_price')
        max_price = self.request.query_params.get('max_price')
        min_rating = self.request.query_params.get('min_rating')
        sort_by = self.request.query_params.get('sort', 'relevance')

        if query:
            # Log search history if search term present
            if self.request.user.is_authenticated:
                SearchHistory.objects.create(user=self.request.user, search_query=query)
            else:
                SearchHistory.objects.create(search_query=query)

            queryset = queryset.filter(
                Q(name__icontains=query) |
                Q(brand__icontains=query) |
                Q(model_number__icontains=query) |
                Q(category__name__icontains=query)
            )

        if category:
            queryset = queryset.filter(category__slug=category)

        if brand:
            queryset = queryset.filter(brand__iexact=brand)

        if min_rating:
            queryset = queryset.filter(rating__gte=float(min_rating))

        # Filter by price range & sort
        products_list = list(queryset)

        if min_price or max_price:
            filtered = []
            for p in products_list:
                low = p.offers.all()
                if not low:
                    continue
                lowest_val = min(o.final_price for o in low)
                if min_price and lowest_val < float(min_price):
                    continue
                if max_price and lowest_val > float(max_price):
                    continue
                filtered.append(p)
            products_list = filtered

        # Sorting logic
        if sort_by == 'lowest_price':
            products_list.sort(key=lambda p: min([o.final_price for o in p.offers.all()] or [0]))
        elif sort_by == 'highest_discount':
            products_list.sort(key=lambda p: max([o.discount for o in p.offers.all()] or [0]), reverse=True)
        elif sort_by == 'highest_rating':
            products_list.sort(key=lambda p: p.rating, reverse=True)

        return products_list

class ProductDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Product.objects.all().prefetch_related('offers__store', 'category')
    serializer_class = ProductDetailSerializer
    permission_classes = []

class ProductCreateView(generics.CreateAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductDetailSerializer
    permission_classes = []

class ProductOffersView(APIView):
    permission_classes = []

    def get(self, request, pk):
        try:
            product = Product.objects.get(pk=pk)
            offers = ProductOffer.objects.filter(product=product).select_related('store')
            serializer = ProductOfferSerializer(offers, many=True)
            return Response(serializer.data)
        except Product.DoesNotExist:
            return Response({'error': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)

class ProductPriceHistoryView(APIView):
    permission_classes = []

    def get(self, request, pk):
        days = int(request.query_params.get('days', 180))
        since_date = timezone.now() - timedelta(days=days)
        history = PriceHistory.objects.filter(product_id=pk, recorded_at__gte=since_date).select_related('store')
        serializer = PriceHistorySerializer(history, many=True)

        prices = [float(h.price) for h in history]
        current_price = prices[-1] if prices else 0
        lowest_price = min(prices) if prices else 0
        highest_price = max(prices) if prices else 0
        avg_price = round(sum(prices) / len(prices), 2) if prices else 0

        return Response({
            'history': serializer.data,
            'summary': {
                'current_price': current_price,
                'lowest_price': lowest_price,
                'highest_price': highest_price,
                'average_price': avg_price,
            }
        })

class ProductMatchView(APIView):
    permission_classes = []

    def post(self, request):
        target = request.data.get('product')
        if not target:
            return Response({'error': 'Target product data required'}, status=status.HTTP_400_BAD_REQUEST)

        all_products = Product.objects.all()
        matches = []

        for p in all_products:
            prod_dict = {
                'name': p.name,
                'brand': p.brand,
                'model_number': p.model_number,
                'specifications': p.specifications
            }
            score_data = MatchingService.calculate_match_score(target, prod_dict)
            if score_data['is_match']:
                matches.append({
                    'product_id': p.id,
                    'product_name': p.name,
                    'brand': p.brand,
                    'match_details': score_data
                })

        return Response({'matches': matches})
