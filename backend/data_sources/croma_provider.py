from .base_provider import BaseDataProvider

class CromaProvider(BaseDataProvider):
    def __init__(self):
        super().__init__("Croma")

    def search_products(self, query: str) -> list:
        return []

    def get_product_details(self, product_id: str) -> dict:
        return {}

    def get_price(self, product_id: str) -> dict:
        return {}
