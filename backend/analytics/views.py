from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth.models import User
from django.db.models import Count
from products.models import Product, Category
from stores.models import Store
from offers.models import ProductOffer, PriceHistory
from alerts.models import PriceAlert
from analytics.models import SearchHistory

class AdminAnalyticsView(APIView):
    permission_classes = []

    def get(self, request):
        total_products = Product.objects.count()
        total_stores = Store.objects.count()
        total_offers = ProductOffer.objects.count()
        registered_users = User.objects.count()
        active_alerts = PriceAlert.objects.filter(active=True).count()

        # Popular categories distribution
        category_counts = Category.objects.annotate(
            product_count=Count('products')
        ).values('name', 'product_count')

        # Most searched queries
        popular_searches = SearchHistory.objects.values('search_query').annotate(
            count=Count('search_query')
        ).order_by('-count')[:5]

        # Top compared products
        top_compared = Product.objects.annotate(
            offer_count=Count('offers')
        ).order_by('-offer_count')[:5].values('id', 'name', 'brand', 'offer_count', 'rating')

        # Price history trend snapshot
        recent_price_logs = PriceHistory.objects.order_by('-recorded_at')[:10].values(
            'product__name', 'store__name', 'price', 'recorded_at'
        )

        return Response({
            'metrics': {
                'total_products': total_products,
                'total_stores': total_stores,
                'total_offers': total_offers,
                'registered_users': registered_users,
                'active_alerts': active_alerts,
            },
            'popular_categories': list(category_counts),
            'popular_searches': list(popular_searches),
            'top_compared': list(top_compared),
            'recent_price_logs': list(recent_price_logs)
        })
