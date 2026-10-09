import React, { useState } from 'react';
import { Sparkles, Sliders, CheckCircle2, Star, ArrowRight, Store } from 'lucide-react';
import { Link } from 'react-router-dom';
import { productService } from '../services/api';
import { RecommendationResult } from '../types';

export const RecommendationWizard: React.FC = () => {
  const [category, setCategory] = useState('mobiles');
  const [maxBudget, setMaxBudget] = useState('80000');
  const [brand, setBrand] = useState('');
  const [minRating, setMinRating] = useState('4.0');
  const [storage, setStorage] = useState('');
  const [ram, setRam] = useState('');

  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<RecommendationResult[] | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const prefs: Record<string, any> = {
        category,
        max_budget: maxBudget ? parseFloat(maxBudget) : null,
        brand: brand || null,
        min_rating: minRating ? parseFloat(minRating) : null,
        storage: storage || null,
        ram: ram || null,
      };
      const recs = await productService.getRecommendations(prefs);
      setResults(recs);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 lg:p-8">
      
      {/* Wizard Header */}
      <div className="max-w-2xl mx-auto text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold mb-3 border border-indigo-200">
          <Sparkles className="w-4 h-4 text-indigo-600" />
          <span>AI Shopping Assistant</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Find Your Perfect Product Fit
        </h2>
        <p className="text-sm text-slate-600 mt-2">
          Tell us your budget, requirements, and preferred features. Our recommendation engine will rank products specifically for you.
        </p>
      </div>

      {/* Preferences Form */}
      <form onSubmit={handleSubmit} className="bg-slate-50 p-6 rounded-2xl border border-slate-200/80 mb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          
          {/* Category */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="mobiles">Smartphones</option>
              <option value="laptops">Laptops</option>
              <option value="headphones">Headphones & Audio</option>
              <option value="smart-watches">Smart Watches</option>
              <option value="tvs">Smart TVs</option>
              <option value="cameras">Cameras</option>
              <option value="home-appliances">Home Appliances</option>
            </select>
          </div>

          {/* Max Budget */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Max Budget (₹)</label>
            <input
              type="number"
              placeholder="e.g. 50000"
              value={maxBudget}
              onChange={(e) => setMaxBudget(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Preferred Brand */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Preferred Brand</label>
            <input
              type="text"
              placeholder="e.g. Samsung, Apple, Sony"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Storage — only for mobiles & laptops */}
          {(category === 'mobiles' || category === 'laptops') && (
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Required Storage</label>
            <select
              value={storage}
              onChange={(e) => setStorage(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Any Storage</option>
              <option value="128GB">128GB</option>
              <option value="256GB">256GB</option>
              <option value="512GB">512GB / 1TB</option>
            </select>
          </div>
          )}

          {/* RAM — only for mobiles & laptops */}
          {(category === 'mobiles' || category === 'laptops') && (
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Required RAM</label>
            <select
              value={ram}
              onChange={(e) => setRam(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Any RAM</option>
              <option value="8GB">8GB</option>
              <option value="12GB">12GB</option>
              <option value="16GB">16GB+</option>
            </select>
          </div>
          )}

          {/* Minimum Rating */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Min Rating</label>
            <select
              value={minRating}
              onChange={(e) => setMinRating(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="4.5">4.5★ & Above</option>
              <option value="4.0">4.0★ & Above</option>
              <option value="3.5">3.5★ & Above</option>
            </select>
          </div>

        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-semibold text-sm transition-all shadow-md shadow-indigo-500/20 disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4" />
            <span>{loading ? 'Analyzing Criteria...' : 'Get Personalized Recommendations'}</span>
          </button>
        </div>
      </form>

      {/* Recommendation Results */}
      {results && (
        <div>
          <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-200">
            <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
              <span>Recommended for You</span>
              <span className="text-xs bg-indigo-100 text-indigo-800 px-2.5 py-0.5 rounded-full font-bold">
                {results.length} Matches Found
              </span>
            </h3>
            <p className="text-xs text-slate-500">
              Ranked dynamically by criterion score weighting
            </p>
          </div>

          {results.length === 0 ? (
            <div className="p-8 text-center text-slate-500 bg-slate-50 rounded-2xl border border-slate-200">
              No products found matching all criteria. Try broadening your budget or filters.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map((rec, idx) => (
                <div
                  key={rec.id}
                  className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between relative overflow-hidden"
                >
                  {/* Top Rank Badge */}
                  <div className="absolute top-3 left-3 bg-indigo-600 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-md">
                    #{idx + 1} Recommendation ({rec.recommendation_score} pts)
                  </div>

                  {/* Product Content */}
                  <div className="pt-6">
                    <div className="h-40 flex items-center justify-center p-2 mb-3">
                      <img src={rec.image_url} alt={rec.name} className="max-h-36 object-contain" />
                    </div>

                    <div className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 mb-1">
                      {rec.brand}
                    </div>
                    <h4 className="font-bold text-slate-900 text-base line-clamp-2 leading-snug">
                      {rec.name}
                    </h4>

                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center gap-1 bg-amber-50 text-amber-700 px-2 py-0.5 rounded text-xs font-bold border border-amber-200">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span>{rec.rating}</span>
                      </div>
                      <span className="text-xs text-slate-500 font-semibold">
                        From ₹{rec.lowest_price.toLocaleString('en-IN')}
                      </span>
                    </div>

                    {/* Why Recommended Section */}
                    <div className="mt-4 pt-3 border-t border-slate-100">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700 block mb-2">
                        Why Recommended:
                      </span>
                      <ul className="space-y-1.5">
                        {rec.reasons.map((reason, rIdx) => (
                          <li key={rIdx} className="flex items-start gap-1.5 text-xs text-slate-700">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                            <span>{reason}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Compare Button */}
                  <div className="mt-5 pt-3 border-t border-slate-100">
                    <Link
                      to={`/product/${rec.id}`}
                      className="w-full flex items-center justify-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs py-2.5 rounded-xl transition-all"
                    >
                      <span>View Offers & Compare</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
};
