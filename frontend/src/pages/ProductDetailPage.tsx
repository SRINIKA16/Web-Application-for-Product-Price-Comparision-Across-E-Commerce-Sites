import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, Heart, Bell, ShieldCheck, Tag, Store, CheckCircle, ArrowLeft, Layers } from 'lucide-react';
import { productService } from '../services/api';
import { Product, ProductOffer } from '../types';
import { PriceComparisonTable } from '../components/PriceComparisonTable';
import { PriceHistoryChart } from '../components/PriceHistoryChart';
import { PriceAlertModal } from '../components/PriceAlertModal';
import { useWishlist } from '../context/WishlistContext';

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const productId = Number(id);

  const [product, setProduct] = useState<Product | null>(null);
  const [offers, setOffers] = useState<ProductOffer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [alertModalOpen, setAlertModalOpen] = useState<boolean>(false);

  const { isInWishlist, toggleWishlist } = useWishlist();
  const isSaved = product ? isInWishlist(product.id) : false;

  useEffect(() => {
    const fetchProductData = async () => {
      setLoading(true);
      try {
        const prod = await productService.getProduct(productId);
        const offerList = await productService.getProductOffers(productId);
        setProduct(prod);
        setOffers(offerList);
      } catch {
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };
    if (productId) {
      fetchProductData();
    }
  }, [productId]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="h-96 bg-slate-100 rounded-3xl animate-pulse"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-slate-900">Product not found</h2>
        <p className="text-xs text-slate-500 mt-2">The product you requested could not be located.</p>
        <Link to="/" className="mt-4 inline-block px-4 py-2 bg-sky-600 text-white text-xs font-semibold rounded-xl">
          Back to Home
        </Link>
      </div>
    );
  }

  const lowestPrice = product.lowest_price || (offers.length > 0 ? Math.min(...offers.map(o => o.final_price)) : 0);
  const highestPrice = product.highest_price || (offers.length > 0 ? Math.max(...offers.map(o => o.final_price)) : 0);
  const potentialSaving = Math.max(0, highestPrice - lowestPrice);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* Back button */}
      <Link to="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-sky-600">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Comparison</span>
      </Link>

      {/* Top Product Hero Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 lg:p-8 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          
          {/* Product Image Container */}
          <div className="md:col-span-5 bg-slate-50 p-6 rounded-2xl border border-slate-100 flex items-center justify-center">
            <img
              src={product.image_url}
              alt={product.name}
              className="max-h-72 object-contain"
            />
          </div>

          {/* Product Specs & Info */}
          <div className="md:col-span-7 space-y-4">
            
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-sky-600 bg-sky-50 px-3 py-1 rounded-md border border-sky-200">
                {product.brand}
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleWishlist(product.id)}
                  className={`p-2.5 rounded-xl border transition-all ${
                    isSaved
                      ? 'bg-rose-50 text-rose-600 border-rose-200'
                      : 'bg-white text-slate-600 hover:bg-slate-50 border-slate-200'
                  }`}
                  title={isSaved ? 'Saved in Wishlist' : 'Save to Wishlist'}
                >
                  <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                </button>

                <button
                  onClick={() => setAlertModalOpen(true)}
                  className="flex items-center gap-1.5 px-3.5 py-2.5 bg-amber-50 text-amber-700 hover:bg-amber-100 font-bold text-xs rounded-xl border border-amber-200 transition-colors"
                >
                  <Bell className="w-4 h-4 text-amber-600" />
                  <span>Set Price Alert</span>
                </button>
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug">
              {product.name}
            </h1>

            {product.model_number && (
              <p className="text-xs text-slate-500 font-mono">
                Model: {product.model_number}
              </p>
            )}

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-amber-50 text-amber-800 px-2 py-0.5 rounded-md text-xs font-bold border border-amber-200">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{product.rating}</span>
              </div>
              <span className="text-xs text-slate-400">
                ({product.review_count?.toLocaleString('en-IN')} verified reviews)
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {product.description}
            </p>

            {/* Comparison Highlights Banner (Requirement 20) */}
            <div className="grid grid-cols-3 gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200/80 pt-4 mt-4">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Lowest Price</span>
                <span className="text-xl font-extrabold text-emerald-600">
                  ₹{lowestPrice.toLocaleString('en-IN')}
                </span>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Potential Saving</span>
                <span className="text-xl font-extrabold text-sky-600">
                  ₹{potentialSaving.toLocaleString('en-IN')}
                </span>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Stores Compared</span>
                <span className="text-xl font-extrabold text-slate-900">
                  {offers.length || product.stores_count} Stores
                </span>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Specifications Grid */}
      {product.specifications && Object.keys(product.specifications).length > 0 && (
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 lg:p-8 shadow-sm">
          <h3 className="font-bold text-slate-900 text-base mb-4 flex items-center gap-2">
            <Layers className="w-4 h-4 text-sky-600" />
            <span>Technical Specifications</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(product.specifications).map(([key, val]) => (
              <div key={key} className="p-3 bg-slate-50 rounded-xl border border-slate-200/60">
                <span className="text-[11px] font-bold uppercase text-slate-400 block">{key}</span>
                <span className="text-xs font-semibold text-slate-800">{String(val)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Multi-Store Comparison Table */}
      <PriceComparisonTable offers={offers} />

      {/* Interactive Price History Chart */}
      <PriceHistoryChart productId={product.id} />

      {/* Price Alert Modal */}
      {alertModalOpen && (
        <PriceAlertModal
          product={product}
          isOpen={alertModalOpen}
          onClose={() => setAlertModalOpen(false)}
        />
      )}

    </div>
  );
};
