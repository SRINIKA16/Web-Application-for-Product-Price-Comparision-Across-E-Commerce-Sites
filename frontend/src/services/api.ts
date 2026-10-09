import axios from 'axios';
import {
  Product, Category, ProductOffer, PriceHistoryResponse,
  Wishlist, PriceAlert, RecommendationResult, User, AnalyticsData
} from '../types';

const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('pw_auth_token');
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
});

export const productService = {
  getProducts: async (params?: Record<string, any>): Promise<Product[]> => {
    const response = await api.get('/products/', { params });
    return response.data;
  },
  getProduct: async (id: number): Promise<Product> => {
    const response = await api.get(`/products/${id}/`);
    return response.data;
  },
  getCategories: async (): Promise<Category[]> => {
    const response = await api.get('/products/categories/');
    return response.data;
  },
  getProductOffers: async (id: number): Promise<ProductOffer[]> => {
    const response = await api.get(`/products/${id}/offers/`);
    return response.data;
  },
  getPriceHistory: async (id: number, days: number = 180): Promise<PriceHistoryResponse> => {
    const response = await api.get(`/products/${id}/price-history/`, { params: { days } });
    return response.data;
  },
  getRecommendations: async (preferences: Record<string, any>): Promise<RecommendationResult[]> => {
    const response = await api.post('/recommendations/', preferences);
    return response.data.recommendations;
  },
};

export const wishlistService = {
  getWishlist: async (): Promise<Wishlist[]> => {
    const response = await api.get('/wishlist/');
    return response.data;
  },
  addToWishlist: async (productId: number): Promise<Wishlist> => {
    const response = await api.post('/wishlist/', { product: productId });
    return response.data;
  },
  removeFromWishlist: async (id: number): Promise<void> => {
    await api.delete(`/wishlist/${id}/`);
  },
};

export const alertService = {
  getAlerts: async (): Promise<PriceAlert[]> => {
    const response = await api.get('/alerts/');
    return response.data;
  },
  createAlert: async (productId: number, targetPrice: number): Promise<PriceAlert> => {
    const response = await api.post('/alerts/', { product: productId, target_price: targetPrice });
    return response.data;
  },
  deleteAlert: async (id: number): Promise<void> => {
    await api.delete(`/alerts/${id}/`);
  },
};

export const authService = {
  login: async (credentials: Record<string, any>) => {
    const response = await api.post('/auth/login/', credentials);
    if (response.data.token) {
      localStorage.setItem('pw_auth_token', response.data.token);
    }
    return response.data;
  },
  register: async (userData: Record<string, any>) => {
    const response = await api.post('/auth/register/', userData);
    if (response.data.token) {
      localStorage.setItem('pw_auth_token', response.data.token);
    }
    return response.data;
  },
  getProfile: async (): Promise<User> => {
    const response = await api.get('/auth/profile/');
    return response.data;
  },
  logout: async () => {
    try {
      await api.post('/auth/logout/');
    } finally {
      localStorage.removeItem('pw_auth_token');
    }
  },
};

export const adminService = {
  getAnalytics: async (): Promise<AnalyticsData> => {
    const response = await api.get('/admin/analytics/');
    return response.data;
  },
};

export const offersService = {
  getOffers: async (): Promise<any[]> => {
    const response = await api.get('/offers/');
    return response.data;
  },
  deleteOffer: async (id: number): Promise<void> => {
    await api.delete(`/offers/${id}/`);
  },
};

export const storesService = {
  getStores: async (): Promise<any[]> => {
    const response = await api.get('/stores/');
    return response.data;
  },
};

export const productAdminService = {
  createProduct: async (data: Record<string, any>): Promise<any> => {
    const response = await api.post('/products/', data);
    return response.data;
  },
  deleteProduct: async (id: number): Promise<void> => {
    await api.delete(`/products/${id}/`);
  },
};

export default api;
