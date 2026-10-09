import React, { useState, useEffect, useRef } from 'react';
import {
  LayoutDashboard, ShoppingBag, Store, Tag, Users, Bell,
  TrendingUp, Search, Plus, Trash2, X, Check, AlertTriangle, RefreshCw
} from 'lucide-react';
import { adminService, productService, offersService, storesService, productAdminService } from '../services/api';
import { AnalyticsData, Product } from '../types';

// ---------- Add Product Modal ----------
interface AddProductModalProps {
  onClose: () => void;
  onCreated: () => void;
}
const AddProductModal: React.FC<AddProductModalProps> = ({ onClose, onCreated }) => {
  const [form, setForm] = useState({
    name: '', brand: '', model_number: '', description: '', image_url: '', rating: '4.0',
  });
  const [categoryId, setCategoryId] = useState('');
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    productService.getCategories().then(setCategorions).catch(() => {});
  }, []);

  function setCategorions(cats: any[]) { setCategories(cats); if (cats.length) setCategoryId(String(cats[0].id)); }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.brand || !form.image_url || !categoryId) {
      setError('Name, brand, image URL and category are required.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await productAdminService.createProduct({
        ...form,
        rating: parseFloat(form.rating),
        category: parseInt(categoryId),
        specifications: {},
      });
      onCreated();
      onClose();
    } catch (err: any) {
      setError(err?.response?.data?.detail || 'Failed to create product. Check all fields.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg border border-slate-200 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
            <Plus className="w-4 h-4 text-sky-600" />
            Add New Product
          </h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="flex items-start gap-2 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-medium">
              <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Product Name *</label>
              <input
                className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                placeholder="e.g. Galaxy S25 Ultra"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Brand *</label>
              <input
                className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                placeholder="e.g. Samsung"
                value={form.brand}
                onChange={(e) => setForm({ ...form, brand: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Model Number</label>
              <input
                className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                placeholder="e.g. SM-S928B"
                value={form.model_number}
                onChange={(e) => setForm({ ...form, model_number: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Category *</label>
              <select
                className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Initial Rating</label>
              <input
                type="number" min="1" max="5" step="0.1"
                className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                value={form.rating}
                onChange={(e) => setForm({ ...form, rating: e.target.value })}
              />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Image URL *</label>
              <input
                className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                placeholder="https://..."
                value={form.image_url}
                onChange={(e) => setForm({ ...form, image_url: e.target.value })}
              />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Description</label>
              <textarea
                rows={2}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 resize-none"
                placeholder="Short product description..."
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors">
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-colors disabled:opacity-50"
            >
              {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
              {loading ? 'Creating...' : 'Create Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ---------- Main Admin Dashboard ----------
export const AdminDashboardPage: React.FC = () => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [offers, setOffers] = useState<any[]>([]);
  const [stores, setStores] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'analytics' | 'products' | 'stores' | 'offers'>('analytics');
  const [loading, setLoading] = useState<boolean>(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [deletingProductId, setDeletingProductId] = useState<number | null>(null);
  const [deletingOfferId, setDeletingOfferId] = useState<number | null>(null);
  const [offersFilter, setOffersFilter] = useState('');

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [analytics, prods, offerList, storeList] = await Promise.all([
        adminService.getAnalytics(),
        productService.getProducts(),
        offersService.getOffers(),
        storesService.getStores(),
      ]);
      setData(analytics);
      setProducts(prods);
      setOffers(offerList);
      setStores(storeList);
    } catch {
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const handleDeleteProduct = async (id: number) => {
    if (!window.confirm('Delete this product and all its offers/history? This cannot be undone.')) return;
    setDeletingProductId(id);
    try {
      await productAdminService.deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch {
      alert('Failed to delete product.');
    } finally {
      setDeletingProductId(null);
    }
  };

  const handleDeleteOffer = async (id: number) => {
    if (!window.confirm('Remove this store offer?')) return;
    setDeletingOfferId(id);
    try {
      await offersService.deleteOffer(id);
      setOffers((prev) => prev.filter((o) => o.id !== id));
    } catch {
      alert('Failed to delete offer.');
    } finally {
      setDeletingOfferId(null);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="h-96 bg-slate-100 rounded-3xl animate-pulse"></div>
      </div>
    );
  }

  const metrics = data?.metrics || {
    total_products: products.length,
    total_stores: stores.length,
    total_offers: offers.length,
    registered_users: 0,
    active_alerts: 0,
  };

  const filteredOffers = offersFilter
    ? offers.filter((o) =>
        o.store?.name?.toLowerCase().includes(offersFilter.toLowerCase()) ||
        o.product?.name?.toLowerCase().includes(offersFilter.toLowerCase())
      )
    : offers;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">

      {showAddModal && (
        <AddProductModal onClose={() => setShowAddModal(false)} onCreated={fetchAll} />
      )}

      {/* Admin Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-sky-50 text-sky-700 text-xs font-bold mb-2 border border-sky-200">
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Administrator Control Console</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">Compario Admin Dashboard</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitor system metrics, manage store providers, update offers & review analytics.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchAll}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 border border-slate-200 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh
          </button>

          {/* Tab selector */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold">
            {[
              { id: 'analytics', label: 'Analytics' },
              { id: 'products', label: 'Products' },
              { id: 'stores', label: 'Stores' },
              { id: 'offers', label: 'Offers' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-lg transition-all ${
                  activeTab === tab.id
                    ? 'bg-white text-sky-700 shadow-sm font-extrabold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {[
          { label: 'Total Products', value: metrics.total_products.toLocaleString('en-IN'), icon: ShoppingBag, color: 'text-sky-600' },
          { label: 'Active Stores', value: metrics.total_stores, icon: Store, color: 'text-indigo-600' },
          { label: 'Total Offers', value: metrics.total_offers.toLocaleString('en-IN'), icon: Tag, color: 'text-emerald-600' },
          { label: 'Registered Users', value: metrics.registered_users.toLocaleString('en-IN'), icon: Users, color: 'text-purple-600' },
          { label: 'Active Alerts', value: metrics.active_alerts, icon: Bell, color: 'text-amber-600' },
        ].map((card) => (
          <div key={card.label} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{card.label}</span>
              <card.icon className={`w-4 h-4 ${card.color}`} />
            </div>
            <div className="text-2xl font-extrabold text-slate-900">{card.value}</div>
          </div>
        ))}
      </div>

      {/* ──── Analytics Tab ──── */}
      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-900 text-sm mb-4 flex items-center gap-2">
              <Search className="w-4 h-4 text-sky-600" />
              <span>Most Searched Products & Brands</span>
            </h3>
            <div className="space-y-2.5">
              {(data?.popular_searches?.length ? data.popular_searches : [
                { search_query: 'Samsung Galaxy S25', count: 42 },
                { search_query: 'iPhone 16 Pro Max', count: 38 },
                { search_query: 'MacBook Air M3', count: 29 },
                { search_query: 'Sony WH-1000XM5', count: 24 },
                { search_query: 'LG OLED TV', count: 18 },
              ]).map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl text-xs">
                  <span className="font-bold text-slate-800">{item.search_query}</span>
                  <span className="bg-sky-100 text-sky-800 font-bold px-2.5 py-0.5 rounded-full">
                    {item.count} searches
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-900 text-sm mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              <span>Popular Categories Distribution</span>
            </h3>
            <div className="space-y-2.5">
              {(data?.popular_categories?.length ? data.popular_categories : [
                { name: 'Mobiles', product_count: 6 },
                { name: 'Laptops', product_count: 5 },
                { name: 'Headphones', product_count: 4 },
                { name: 'Smart Watches', product_count: 3 },
                { name: 'Smart TVs', product_count: 3 },
              ]).map((cat, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl text-xs">
                  <span className="font-bold text-slate-800">{cat.name}</span>
                  <span className="bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full">
                    {cat.product_count} products
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Compared Products */}
          {data?.top_compared && data.top_compared.length > 0 && (
            <div className="md:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="font-bold text-slate-900 text-sm mb-4 flex items-center gap-2">
                <Tag className="w-4 h-4 text-indigo-600" />
                <span>Top Compared Products (by Offer Count)</span>
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 uppercase font-bold border-b border-slate-200">
                      <th className="p-3">Product</th>
                      <th className="p-3">Brand</th>
                      <th className="p-3 text-center">Rating</th>
                      <th className="p-3 text-center">Store Offers</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {data.top_compared.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50">
                        <td className="p-3 font-bold text-slate-900">{p.name}</td>
                        <td className="p-3 text-slate-600">{p.brand}</td>
                        <td className="p-3 text-center text-amber-600 font-bold">★ {p.rating}</td>
                        <td className="p-3 text-center font-bold text-sky-700">{p.offer_count}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ──── Products Tab ──── */}
      {activeTab === 'products' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-900 text-base">
              Product Inventory
              <span className="ml-2 text-xs font-semibold text-slate-400">({products.length} total)</span>
            </h3>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-1.5 bg-sky-600 text-white px-3.5 py-2 rounded-xl text-xs font-bold hover:bg-sky-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Product</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-100 text-slate-600 uppercase font-bold border-b border-slate-200">
                  <th className="p-3">ID</th>
                  <th className="p-3">Product Name</th>
                  <th className="p-3">Brand</th>
                  <th className="p-3">Category</th>
                  <th className="p-3 text-center">Rating</th>
                  <th className="p-3 text-right">Lowest Price</th>
                  <th className="p-3 text-center">Stores</th>
                  <th className="p-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50">
                    <td className="p-3 font-mono text-slate-400">#{p.id}</td>
                    <td className="p-3 font-bold text-slate-900 max-w-[200px] truncate">{p.name}</td>
                    <td className="p-3 text-slate-600 font-semibold">{p.brand}</td>
                    <td className="p-3 text-slate-500">{p.category_name}</td>
                    <td className="p-3 text-center text-amber-700 font-bold">★ {p.rating}</td>
                    <td className="p-3 text-right font-extrabold text-slate-900">
                      {p.lowest_price ? `₹${p.lowest_price.toLocaleString('en-IN')}` : '—'}
                    </td>
                    <td className="p-3 text-center font-bold">{p.stores_count}</td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => handleDeleteProduct(p.id)}
                        disabled={deletingProductId === p.id}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors disabled:opacity-40"
                        title="Delete product"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ──── Stores Tab ──── */}
      {activeTab === 'stores' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h3 className="font-bold text-slate-900 text-base mb-4">
            Configured Store Data Connectors
            <span className="ml-2 text-xs font-semibold text-slate-400">({stores.length} stores)</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {stores.map((store) => (
              <div key={store.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={store.logo}
                    alt={store.name}
                    className="w-10 h-10 object-contain rounded-lg bg-white border border-slate-200 p-1"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">{store.name}</h4>
                    <div className="flex items-center gap-1 text-[11px] text-amber-600 font-semibold mt-0.5">
                      <span>★ {store.rating}</span>
                      <span className="text-slate-300 mx-1">•</span>
                      <span className={store.active ? 'text-emerald-600' : 'text-rose-500'}>
                        {store.active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <a
                      href={store.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-sky-600 hover:underline mt-0.5 block truncate max-w-[150px]"
                    >
                      {store.website.replace('https://', '')}
                    </a>
                  </div>
                </div>
                <span className="w-3 h-3 rounded-full flex-shrink-0 bg-emerald-500 shadow-sm shadow-emerald-500/50"></span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ──── Offers Tab ──── */}
      {activeTab === 'offers' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <h3 className="font-bold text-slate-900 text-base">
              All Store Offers
              <span className="ml-2 text-xs font-semibold text-slate-400">({filteredOffers.length} of {offers.length})</span>
            </h3>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Filter by store or product..."
                value={offersFilter}
                onChange={(e) => setOffersFilter(e.target.value)}
                className="pl-8 pr-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-sky-500 w-64"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-100 text-slate-600 uppercase font-bold border-b border-slate-200">
                  <th className="p-3">Product</th>
                  <th className="p-3">Store</th>
                  <th className="p-3 text-right">Price</th>
                  <th className="p-3 text-right">Discount</th>
                  <th className="p-3 text-right">Delivery</th>
                  <th className="p-3 text-right font-extrabold text-emerald-700">Final Price</th>
                  <th className="p-3 text-center">Availability</th>
                  <th className="p-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredOffers.slice(0, 50).map((offer) => {
                  const finalPrice = Math.max(
                    0,
                    parseFloat(offer.price || 0) - parseFloat(offer.discount || 0) + parseFloat(offer.delivery_charge || 0)
                  );
                  const availColor = offer.availability === 'In Stock'
                    ? 'bg-emerald-100 text-emerald-800'
                    : offer.availability === 'Out of Stock'
                    ? 'bg-rose-100 text-rose-800'
                    : 'bg-amber-100 text-amber-800';

                  return (
                    <tr key={offer.id} className="hover:bg-slate-50">
                      <td className="p-3 font-bold text-slate-900 max-w-[180px]">
                        <span className="line-clamp-1">{offer.product?.name || `Product #${offer.product}`}</span>
                      </td>
                      <td className="p-3 text-slate-600 font-semibold">
                        {offer.store?.name || `Store #${offer.store}`}
                      </td>
                      <td className="p-3 text-right text-slate-800">₹{parseFloat(offer.price).toLocaleString('en-IN')}</td>
                      <td className="p-3 text-right text-emerald-700">
                        {parseFloat(offer.discount) > 0 ? `- ₹${parseFloat(offer.discount).toLocaleString('en-IN')}` : '—'}
                      </td>
                      <td className="p-3 text-right text-slate-500">
                        {parseFloat(offer.delivery_charge) > 0 ? `+ ₹${parseFloat(offer.delivery_charge).toLocaleString('en-IN')}` : 'Free'}
                      </td>
                      <td className="p-3 text-right font-extrabold text-slate-900">
                        ₹{finalPrice.toLocaleString('en-IN')}
                      </td>
                      <td className="p-3 text-center">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${availColor}`}>
                          {offer.availability}
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        <button
                          onClick={() => handleDeleteOffer(offer.id)}
                          disabled={deletingOfferId === offer.id}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors disabled:opacity-40"
                          title="Remove offer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {filteredOffers.length === 0 && (
              <div className="py-10 text-center text-sm text-slate-400">No offers match your filter.</div>
            )}
            {filteredOffers.length > 50 && (
              <div className="py-3 text-center text-xs text-slate-400">
                Showing first 50 of {filteredOffers.length} offers. Use the filter to narrow results.
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
