export interface Category {
  id: number;
  name: string;
  slug: string;
  icon: string;
}

export interface Store {
  id: number;
  name: string;
  logo: string;
  website: string;
  active: boolean;
  rating: number;
}

export interface ProductOffer {
  id: number;
  store: Store;
  price: number;
  discount: number;
  delivery_charge: number;
  final_price: number;
  availability: 'In Stock' | 'Out of Stock' | 'Limited Stock' | 'Pre-Order';
  rating: number;
  product_url: string;
  is_conditional_offer: boolean;
  offer_details: string;
  last_updated: string;
}

export interface Product {
  id: number;
  name: string;
  brand: string;
  model_number: string;
  category_name: string;
  category?: Category;
  description?: string;
  image_url: string;
  specifications: Record<string, string>;
  rating: number;
  review_count: number;
  lowest_price: number;
  highest_price: number;
  stores_count: number;
  max_savings: number;
  offers?: ProductOffer[];
}

export interface PriceHistoryRecord {
  id: number;
  store_name: string;
  price: number;
  recorded_at: string;
}

export interface PriceHistorySummary {
  current_price: number;
  lowest_price: number;
  highest_price: number;
  average_price: number;
}

export interface PriceHistoryResponse {
  history: PriceHistoryRecord[];
  summary: PriceHistorySummary;
}

export interface Wishlist {
  id: number;
  user: number;
  product: number;
  product_details: Product;
  created_at: string;
}

export interface PriceAlert {
  id: number;
  user: number;
  product: number;
  product_details: Product;
  target_price: number;
  current_price: number;
  active: boolean;
  is_triggered: boolean;
  created_at: string;
}

export interface RecommendationResult {
  id: number;
  name: string;
  brand: string;
  model_number: string;
  category: string;
  image_url: string;
  rating: number;
  review_count: number;
  lowest_price: number;
  store_count: number;
  specifications: Record<string, string>;
  recommendation_score: number;
  reasons: string[];
}

export interface User {
  id: number;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
  is_staff?: boolean;
}

export interface AnalyticsMetrics {
  total_products: number;
  total_stores: number;
  total_offers: number;
  registered_users: number;
  active_alerts: number;
}

export interface AnalyticsData {
  metrics: AnalyticsMetrics;
  popular_categories: Array<{ name: string; product_count: number }>;
  popular_searches: Array<{ search_query: string; count: number }>;
  top_compared: Array<{ id: number; name: string; brand: string; offer_count: number; rating: number }>;
  recent_price_logs: Array<{ product__name: string; store__name: string; price: number; recorded_at: string }>;
}
