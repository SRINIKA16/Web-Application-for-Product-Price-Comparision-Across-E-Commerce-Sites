import React from 'react';
import { Heart, Trash2, Bell, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';

export const WishlistPage: React.FC = () => {
  const { wishlist, loading, toggleWishlist } = useWishlist();

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="h-64 bg-slate-100 rounded-3xl animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <Heart className="w-6 h-6 text-rose-500 fill-current" />
            <span>My Saved Wishlist</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Keep track of products you are watching across stores
          </p>
        </div>
        <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-full">
          {wishlist.length} Saved Items
        </span>
      </div>

      {wishlist.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 max-w-md mx-auto my-8">
          <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mx-auto mb-4 border border-rose-100">
            <Heart className="w-8 h-8" />
          </div>
          <h3 className="font-bold text-slate-900 text-lg">Your Wishlist is Empty</h3>
          <p className="text-xs text-slate-500 mt-2 leading-relaxed">
            Click the heart icon on any product card to save it for easy comparison later.
          </p>
          <Link
            to="/search"
            className="mt-6 inline-flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs px-5 py-3 rounded-xl transition-all shadow-md"
          >
            <span>Browse Products</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {wishlist.map((item) => {
            const product = item.product_details;
            if (!product) return null;

            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-44 bg-slate-50 rounded-xl p-3 flex items-center justify-center mb-3">
                    <img src={product.image_url} alt={product.name} className="max-h-36 object-contain" />
                    <button
                      onClick={() => toggleWishlist(product.id)}
                      className="absolute top-2 right-2 p-1.5 bg-white text-rose-600 rounded-full shadow-sm hover:bg-rose-50"
                      title="Remove from wishlist"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <span className="text-[10px] font-bold uppercase text-sky-600 tracking-wider">
                    {product.brand}
                  </span>
                  <h3 className="font-bold text-slate-900 text-sm line-clamp-2 mt-0.5">
                    {product.name}
                  </h3>

                  <div className="mt-3 pt-3 border-t border-slate-100 flex items-baseline justify-between">
                    <span className="text-xs text-slate-400">Lowest Price:</span>
                    <span className="text-base font-extrabold text-slate-900">
                      ₹{product.lowest_price?.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex gap-2">
                  <Link
                    to={`/product/${product.id}`}
                    className="flex-1 bg-sky-600 hover:bg-sky-700 text-white text-center py-2.5 rounded-xl font-bold text-xs transition-colors"
                  >
                    Compare Prices
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
