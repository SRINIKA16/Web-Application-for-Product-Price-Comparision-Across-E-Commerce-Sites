import re
from difflib import SequenceMatcher

class MatchingService:
    """
    Intelligent product matching engine.
    Calculates match confidence (0.0 to 1.0) between product titles and attributes.
    """

    @staticmethod
    def normalize_text(text: str) -> str:
        if not text:
            return ""
        text = text.lower()
        text = re.sub(r'[^a-z0-9\s]', ' ', text)
        return " ".join(text.split())

    @staticmethod
    def extract_storage(text: str):
        match = re.search(r'(\d+)\s*(gb|tb)', text, re.IGNORECASE)
        if match:
            val, unit = match.groups()
            return f"{val}{unit.lower()}"
        return None

    @staticmethod
    def extract_ram(text: str):
        match = re.search(r'(\d+)\s*gb\s*ram', text, re.IGNORECASE)
        if match:
            return f"{match.group(1)}gb"
        return None

    @classmethod
    def calculate_match_score(cls, prod_a: dict, prod_b: dict) -> dict:
        """
        Compare two products (dicts with name, brand, model_number, specs)
        and return match score details and composite score (0.0 to 1.0).
        """
        brand_a = cls.normalize_text(prod_a.get('brand', ''))
        brand_b = cls.normalize_text(prod_b.get('brand', ''))
        brand_match = brand_a == brand_b if (brand_a and brand_b) else True

        model_a = cls.normalize_text(prod_a.get('model_number', ''))
        model_b = cls.normalize_text(prod_b.get('model_number', ''))
        model_match = model_a == model_b if (model_a and model_b) else (brand_match and True)

        name_a = cls.normalize_text(prod_a.get('name', ''))
        name_b = cls.normalize_text(prod_b.get('name', ''))

        storage_a = cls.extract_storage(name_a) or cls.extract_storage(str(prod_a.get('specifications', {})))
        storage_b = cls.extract_storage(name_b) or cls.extract_storage(str(prod_b.get('specifications', {})))
        storage_match = (storage_a == storage_b) if (storage_a and storage_b) else True

        ram_a = cls.extract_ram(name_a) or cls.extract_ram(str(prod_a.get('specifications', {})))
        ram_b = cls.extract_ram(name_b) or cls.extract_ram(str(prod_b.get('specifications', {})))
        ram_match = (ram_a == ram_b) if (ram_a and ram_b) else True

        title_sim = SequenceMatcher(None, name_a, name_b).ratio()

        # Weighted calculation
        brand_score = 1.0 if brand_match else 0.0
        model_score = 1.0 if model_match else 0.4
        specs_score = 1.0 if (storage_match and ram_match) else 0.3

        composite_score = round(
            (brand_score * 0.25) +
            (model_score * 0.25) +
            (specs_score * 0.20) +
            (title_sim * 0.30),
            2
        )

        return {
            'brand_match': brand_match,
            'model_match': model_match,
            'storage_match': storage_match,
            'ram_match': ram_match,
            'title_similarity': round(title_sim * 100, 1),
            'confidence_score': composite_score,
            'is_match': composite_score >= 0.75
        }
