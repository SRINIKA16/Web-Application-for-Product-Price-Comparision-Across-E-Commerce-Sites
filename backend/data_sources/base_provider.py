from abc import ABC, abstractmethod

class BaseDataProvider(ABC):
    """
    Abstract Base Class for store data providers.
    Enables future plug-and-play integration of real REST APIs, affiliate feeds,
    or permitted data connectors without modifying core application logic.
    """

    def __init__(self, store_name: str):
        self.store_name = store_name

    @abstractmethod
    def search_products(self, query: str) -> list:
        """Search products in the provider data source."""
        pass

    @abstractmethod
    def get_product_details(self, product_id: str) -> dict:
        """Fetch detailed specifications and metadata for a product."""
        pass

    @abstractmethod
    def get_price(self, product_id: str) -> dict:
        """Fetch current price, discount, delivery charges, and availability status."""
        pass
