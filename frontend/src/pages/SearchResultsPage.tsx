import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, SlidersHorizontal, ArrowUpDown, SearchX } from 'lucide-react';
import { productService } from '../services/api';
import { Product, Category } from '../types';
import { ProductCard } from '../components/ProductCard';

export const SearchResultsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const categoryParam = searchParams.get('category') || '';

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [brand, setBrand] = useState('');
  const [minRating, setMinRating] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sort, setSort] = useState('relevance');

  useEffect(() => {
    const fetchMeta = async () => {
      try {
        const cats = await productService.getCategories();
        setCategories(cats);
      } catch {
        setCategories([]);
      }
    };
    fetchMeta();
  }, []);

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        const params: Record<string, any> = {
          search: query,
          category: selectedCategory,
          brand,
          min_rating: minRating || undefined,
          max_price: maxPrice || undefined,
          sort,
        };
        const data = await productService.getProducts(params);
        setProducts(data);
      } catch {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [query, selectedCategory, brand, minRating, maxPrice, sort]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Header & Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {query ? `Search Results for "${query}"` : 'All Products & Store Offers'}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Showing {products.length} products compared across Amazon, Flipkart, Croma, Reliance Digital, and Myntra.
          </p>
        </div>

        {/* Sort dropdown */}
        <div className="flex items-center gap-2">
          <ArrowUpDown className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-bold text-slate-700">Sort By:</span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
          >
            <option value="relevance">Most Relevant</option>
            <option value="lowest_price">Lowest Price</option>
            <option value="highest_discount">Highest Savings / Discount</option>
            <option value="highest_rating">Highest Rated</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Sidebar Filters */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/90 h-fit space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
              <SlidersHorizontal className="w-4 h-4 text-sky-600" />
              <span>Filter Results</span>
            </div>
            <button
              onClick={() => {
                setSelectedCategory('');
                setBrand('');
                setMinRating('');
                setMaxPrice('');
                setSort('relevance');
                setSearchParams({});
              }}
              className="text-[11px] font-semibold text-sky-600 hover:underline"
            >
              Reset All
            </button>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-xs font-bold uppercase text-slate-700 mb-2">Category</label>
            <div className="space-y-1.5 text-xs">
              <button
                onClick={() => setSelectedCategory('')}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg transition-colors font-medium ${
                  selectedCategory === '' ? 'bg-sky-50 text-sky-700 font-bold' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                All Categories
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.slug)}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg transition-colors font-medium ${
                    selectedCategory === cat.slug ? 'bg-sky-50 text-sky-700 font-bold' : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Max Price Filter */}
          <div>
            <label className="block text-xs font-bold uppercase text-slate-700 mb-2">Max Price (₹)</label>
            <input
              type="number"
              placeholder="e.g. 100000"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          {/* Brand Filter */}
          <div>
            <label className="block text-xs font-bold uppercase text-slate-700 mb-2">Brand</label>
            <input
              type="text"
              placeholder="e.g. Samsung, Apple, Sony"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          {/* Minimum Rating Filter */}
          <div>
            <label className="block text-xs font-bold uppercase text-slate-700 mb-2">Minimum Rating</label>
            <select
              value={minRating}
              onChange={(e) => setMinRating(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="">Any Rating</option>
              <option value="4.5">4.5★ & Above</option>
              <option value="4.0">4.0★ & Above</option>
              <option value="3.5">3.5★ & Above</option>
            </select>
          </div>

        </div>

        {/* Results Grid */}
        <div className="lg:col-span-3">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-80 bg-slate-100 rounded-2xl animate-pulse"></div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 max-w-md mx-auto my-8">
              <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4">
                <SearchX className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-slate-900 text-lg">No products found</h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Try searching using a different product name, brand, or model number.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
