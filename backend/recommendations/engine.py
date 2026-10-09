from products.models import Product

class AIRecommendationEngine:
    """
    Intelligent Recommendation Engine scoring products based on explicit user constraints
    and dynamic preference weights.
    """

    @classmethod
    def recommend(cls, preferences: dict) -> list:
        category_slug = preferences.get('category')
        max_budget = preferences.get('max_budget')
        preferred_brand = preferences.get('brand')
        min_rating = preferences.get('min_rating', 0.0)
        req_storage = preferences.get('storage')
        req_ram = preferences.get('ram')

        queryset = Product.objects.all().prefetch_related('offers')

        if category_slug:
            queryset = queryset.filter(category__slug=category_slug)
        if min_rating:
            queryset = queryset.filter(rating__gte=float(min_rating))

        results = []

        for prod in queryset:
            offers = prod.offers.filter(availability='In Stock')
            if not offers.exists():
                offers = prod.offers.all()
            if not offers.exists():
                continue

            lowest_offer = min(offers, key=lambda o: o.final_price)
            lowest_price = lowest_offer.final_price

            # Budget check
            if max_budget and lowest_price > float(max_budget):
                continue

            score = 0.0
            reasons = []

            # Rating weight (up to 30 pts)
            score += (prod.rating / 5.0) * 30
            if prod.rating >= 4.3:
                reasons.append(f"High user rating ({prod.rating}★)")

            # Budget efficiency weight (up to 25 pts)
            if max_budget:
                budget_ratio = (float(max_budget) - lowest_price) / float(max_budget)
                score += max(0, budget_ratio * 25)
                savings = float(max_budget) - lowest_price
                if savings > 0:
                    reasons.append(f"Within budget (Save ₹{int(savings):,})")

            # Brand weight (20 pts)
            if preferred_brand and preferred_brand.lower() in prod.brand.lower():
                score += 20
                reasons.append(f"Matches preferred brand ({prod.brand})")

            # Specifications weight (up to 25 pts)
            specs = prod.specifications or {}
            
            # Storage check
            if req_storage and req_storage.lower() in str(specs).lower():
                score += 10
                reasons.append(f"Meets storage requirement ({req_storage})")

            # RAM check
            if req_ram and req_ram.lower() in str(specs).lower():
                score += 10
                reasons.append(f"Meets RAM requirement ({req_ram})")

            # Camera / Battery checks — only surface if user asked for these preferences
            req_camera = preferences.get('camera')
            req_battery = preferences.get('battery')
            if req_camera and (specs.get('camera') or 'camera' in str(specs).lower()):
                reasons.append("High-resolution camera specs")
            if req_battery and (specs.get('battery') or 'battery' in str(specs).lower()):
                reasons.append("Long-lasting battery capacity")

            results.append({
                'id': prod.id,
                'name': prod.name,
                'brand': prod.brand,
                'model_number': prod.model_number,
                'category': prod.category.name,
                'image_url': prod.image_url,
                'rating': prod.rating,
                'review_count': prod.review_count,
                'lowest_price': lowest_price,
                'store_count': prod.offers.count(),
                'specifications': prod.specifications,
                'recommendation_score': round(score, 1),
                'reasons': reasons[:4] if reasons else ["Top value choice in category"]
            })

        results.sort(key=lambda x: x['recommendation_score'], reverse=True)
        return results
