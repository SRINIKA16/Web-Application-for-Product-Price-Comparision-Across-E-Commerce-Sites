from .base_provider import BaseDataProvider

class AmazonProvider(BaseDataProvider):
    def __init__(self):
        super().__init__("Amazon")

    def search_products(self, query: str) -> list:
        # Mock/Demo provider logic. Can be replaced with official Amazon Product Advertising API
        return []

    def get_product_details(self, product_id: str) -> dict:
        return {}

    def get_price(self, product_id: str) -> dict:
        return {}
