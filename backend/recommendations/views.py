from rest_framework.views import APIView
from rest_framework.response import Response
from .engine import AIRecommendationEngine

class RecommendationView(APIView):
    permission_classes = []

    def post(self, request):
        preferences = request.data
        results = AIRecommendationEngine.recommend(preferences)
        return Response({'recommendations': results})
