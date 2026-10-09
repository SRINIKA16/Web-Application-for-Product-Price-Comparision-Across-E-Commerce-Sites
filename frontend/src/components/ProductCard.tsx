import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Heart, ArrowRight, Store } from 'lucide-react';
import { Product } from '../types';
import { useWishlist } from '../context/WishlistContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const saved = isInWishlist(product.id);

  // Extract specs badges like "256GB | 5G" or "16GB RAM"
  const specs = product.specifications || {};
  const specsBadge = [
    specs.storage || specs.ram,
    specs.display ? specs.display.split(' ')[0] : (specs.camera ? 'Pro Camera' : null)
  ].filter(Boolean).join(' | ');

  const formattedLowest = product.lowest_price
    ? `₹${product.lowest_price.toLocaleString('en-IN')}`
    : 'N/A';

  const formattedSavings = product.max_savings > 0
    ? `Save up to ₹${product.max_savings.toLocaleString('en-IN')}`
    : null;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200 flex flex-col justify-between overflow-hidden group">
      
      {/* Top Image Container */}
      <div className="relative p-4 bg-slate-50/50 aspect-square flex items-center justify-center overflow-hidden">
        <img
          src={product.image_url}
          alt={product.name}
          className="max-h-44 object-contain group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        
        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-sm transition-all shadow-sm ${
            saved
              ? 'bg-rose-50 text-rose-600 border border-rose-200'
              : 'bg-white/80 text-slate-400 hover:text-rose-500 hover:bg-white'
          }`}
          title={saved ? 'Remove from wishlist' : 'Save product'}
        >
          <Heart className={`w-4 h-4 ${saved ? 'fill-current' : ''}`} />
        </button>

        {/* Savings Tag */}
        {formattedSavings && (
          <span className="absolute bottom-3 left-3 bg-emerald-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-md shadow-sm">
            {formattedSavings}
          </span>
        )}
      </div>

      {/* Content Container */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-wider text-sky-600 mb-1">
            {product.brand}
          </div>
          <h3 className="font-semibold text-slate-900 text-sm line-clamp-2 leading-snug group-hover:text-sky-600 transition-colors">
            {product.name}
          </h3>

          {specsBadge && (
            <p className="text-xs text-slate-500 font-medium mt-1">
              {specsBadge}
            </p>
          )}

          {/* Rating */}
          <div className="flex items-center gap-1.5 mt-2">
            <div className="flex items-center gap-1 bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded text-xs font-bold border border-amber-200">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span>{product.rating}</span>
            </div>
            <span className="text-[11px] text-slate-400">
              ({product.review_count.toLocaleString('en-IN')} reviews)
            </span>
          </div>
        </div>

        {/* Price & Action Footer */}
        <div className="mt-4 pt-3 border-t border-slate-100">
          <div className="flex items-baseline justify-between mb-2">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">From</span>
              <span className="text-lg font-extrabold text-slate-900">{formattedLowest}</span>
            </div>
            
            <div className="flex items-center gap-1 text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full font-medium">
              <Store className="w-3 h-3 text-slate-400" />
              <span>{product.stores_count} stores</span>
            </div>
          </div>

          <Link
            to={`/product/${product.id}`}
            className="w-full flex items-center justify-center gap-1.5 bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs py-2.5 rounded-xl transition-all shadow-sm group-hover:shadow-sky-500/20"
          >
            <span>Compare Prices</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

      </div>

    </div>
  );
};
