from .amazon_provider import AmazonProvider
from .flipkart_provider import FlipkartProvider
from .croma_provider import CromaProvider
from .reliance_provider import RelianceProvider
from .myntra_provider import MyntraProvider

class DataProviderManager:
    def __init__(self):
        self.providers = {
            'Amazon': AmazonProvider(),
            'Flipkart': FlipkartProvider(),
            'Croma': CromaProvider(),
            'Reliance Digital': RelianceProvider(),
            'Myntra': MyntraProvider(),
        }

    def get_provider(self, store_name: str):
        return self.providers.get(store_name)

    def search_all(self, query: str) -> dict:
        results = {}
        for name, provider in self.providers.items():
            results[name] = provider.search_products(query)
        return results
