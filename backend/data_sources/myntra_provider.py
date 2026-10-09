from .base_provider import BaseDataProvider

class MyntraProvider(BaseDataProvider):
    def __init__(self):
        super().__init__("Myntra")

    def search_products(self, query: str) -> list:
        return []

    def get_product_details(self, product_id: str) -> dict:
        return {}

    def get_price(self, product_id: str) -> dict:
        return {}
