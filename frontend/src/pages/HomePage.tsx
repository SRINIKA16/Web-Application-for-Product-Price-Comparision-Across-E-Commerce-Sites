import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Search, Smartphone, Laptop, Headphones, Watch, Tv, Camera, Home as HomeIcon,
  Sparkles, TrendingUp, ShieldCheck, ArrowRight, Zap, Award
} from 'lucide-react';
import { productService } from '../services/api';
import { Product } from '../types';
import { ProductCard } from '../components/ProductCard';

export const HomePage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [trendingProducts, setTrendingProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const data = await productService.getProducts({ sort: 'highest_rating' });
        setTrendingProducts(data.slice(0, 8));
      } catch {
        setTrendingProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchTrending();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const categories = [
    { name: 'Mobiles', slug: 'mobiles', icon: Smartphone, count: '10+ Deals', color: 'bg-blue-50 text-blue-600 border-blue-200' },
    { name: 'Laptops', slug: 'laptops', icon: Laptop, count: '8+ Deals', color: 'bg-indigo-50 text-indigo-600 border-indigo-200' },
    { name: 'Headphones', slug: 'headphones', icon: Headphones, count: '6+ Deals', color: 'bg-purple-50 text-purple-600 border-purple-200' },
    { name: 'Smart Watches', slug: 'smart-watches', icon: Watch, count: '5+ Deals', color: 'bg-rose-50 text-rose-600 border-rose-200' },
    { name: 'Smart TVs', slug: 'tvs', icon: Tv, count: '4+ Deals', color: 'bg-amber-50 text-amber-600 border-amber-200' },
    { name: 'Cameras', slug: 'cameras', icon: Camera, count: '4+ Deals', color: 'bg-emerald-50 text-emerald-600 border-emerald-200' },
    { name: 'Home Appliances', slug: 'home-appliances', icon: HomeIcon, count: '5+ Deals', color: 'bg-sky-50 text-sky-600 border-sky-200' },
  ];

  return (
    <div className="space-y-16 pb-16">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-sky-900 via-slate-900 to-slate-900 text-white pt-16 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]"></div>
        
        <div className="max-w-5xl mx-auto text-center relative z-10">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-500/10 border border-sky-400/20 text-sky-300 text-xs font-bold mb-6">
            <Sparkles className="w-4 h-4 text-sky-400" />
            <span>AI-Powered E-Commerce Comparison Engine</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Compare Prices. <span className="bg-gradient-to-r from-sky-400 via-indigo-300 to-emerald-400 bg-clip-text text-transparent">Shop Smarter.</span>
          </h1>

          <p className="mt-4 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto">
            Find the best available price across Amazon, Flipkart, Croma, Reliance Digital, and Myntra in one unified assistant.
          </p>

          {/* Search Box */}
          <form onSubmit={handleSearchSubmit} className="mt-8 max-w-3xl mx-auto">
            <div className="bg-white p-2 rounded-2xl shadow-2xl flex flex-col sm:flex-row items-center gap-2 border border-slate-200">
              <div className="flex-1 flex items-center gap-2 px-3 w-full">
                <Search className="w-5 h-5 text-slate-400 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Search for products, brands or model numbers... (e.g., Samsung Galaxy S25)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full py-3 text-slate-800 text-sm focus:outline-none placeholder-slate-400"
                />
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="submit"
                  className="w-full sm:w-auto bg-sky-600 hover:bg-sky-700 text-white font-bold text-sm px-6 py-3.5 rounded-xl transition-all shadow-md shadow-sky-600/30 whitespace-nowrap"
                >
                  Search & Compare
                </button>
              </div>
            </div>
          </form>

          {/* Quick search tags */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-400">
            <span className="font-semibold text-slate-500">Popular Searches:</span>
            {['Samsung S25', 'iPhone 16 Pro', 'MacBook Air M3', 'Sony WH-1000XM5', 'LG OLED TV'].map((tag) => (
              <button
                key={tag}
                onClick={() => navigate(`/search?q=${encodeURIComponent(tag)}`)}
                className="hover:text-sky-300 bg-slate-800/80 px-2.5 py-1 rounded-md border border-slate-700/60 transition-colors"
              >
                {tag}
              </button>
            ))}
          </div>

        </div>
      </section>

      {/* Popular Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-20">
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900">Explore Popular Categories</h2>
              <p className="text-xs text-slate-500 mt-0.5">Browse deals categorized by electronics, fashion & appliances</p>
            </div>
            <Link to="/search" className="text-xs font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1">
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
            {categories.map((cat) => {
              const IconComp = cat.icon;
              return (
                <Link
                  key={cat.slug}
                  to={`/search?category=${cat.slug}`}
                  className="p-4 rounded-2xl border border-slate-200/80 bg-slate-50/50 hover:bg-white hover:shadow-md hover:border-sky-300 transition-all flex flex-col items-center text-center group"
                >
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-3 ${cat.color} group-hover:scale-110 transition-transform`}>
                    <IconComp className="w-6 h-6" />
                  </div>
                  <span className="font-bold text-slate-800 text-xs line-clamp-1">{cat.name}</span>
                  <span className="text-[10px] font-semibold text-slate-400 mt-0.5">{cat.count}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Trending Products Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="inline-flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-full mb-1 border border-amber-200">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Trending Deals</span>
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900">Top Rated Products Across Stores</h2>
          </div>

          <Link
            to="/search?sort=highest_rating"
            className="text-xs font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1"
          >
            See All Products <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-80 bg-slate-100 rounded-2xl animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {trendingProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Feature Highlight Callout */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-indigo-900 to-sky-900 rounded-3xl p-8 sm:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-400/20 text-sky-300 text-xs font-bold mb-3 border border-sky-400/30">
              <Zap className="w-4 h-4 text-sky-300" />
              <span>Smart Recommendation Engine</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Unsure which product fits your budget and specs?
            </h3>
            <p className="text-slate-300 text-sm mt-3 leading-relaxed">
              Use our AI Shopping Assistant to input your max budget, camera preferences, battery requirements, and preferred brand to get instantaneous ranked suggestions with transparent rationale.
            </p>
          </div>

          <Link
            to="/recommendations"
            className="flex-shrink-0 bg-white hover:bg-slate-100 text-indigo-950 font-extrabold text-sm px-7 py-4 rounded-2xl transition-all shadow-lg flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span>Launch AI Assistant</span>
          </Link>
        </div>
      </section>

    </div>
  );
};
