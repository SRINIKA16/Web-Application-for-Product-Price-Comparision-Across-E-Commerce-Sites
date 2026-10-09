import React from 'react';
import { User, Heart, Bell, History, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { useAlerts } from '../context/AlertsContext';

export const UserDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { wishlist } = useWishlist();
  const { alerts } = useAlerts();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-sky-900 to-indigo-900 rounded-3xl p-8 text-white shadow-lg flex items-center gap-6">
        <div className="w-16 h-16 rounded-2xl bg-sky-500/20 text-sky-300 font-extrabold text-2xl flex items-center justify-center border border-sky-400/30">
          {user?.username ? user.username.slice(0, 2).toUpperCase() : 'US'}
        </div>
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">
            Welcome back, {user?.first_name || user?.username || 'Shopper'}!
          </h1>
          <p className="text-xs text-sky-200 mt-1">
            {user?.email || 'demo@pricewise.com'} • Active PriceWise Member
          </p>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase">Saved Products</span>
            <div className="text-2xl font-extrabold text-slate-900 mt-1">{wishlist.length}</div>
            <Link to="/wishlist" className="text-xs font-bold text-sky-600 hover:underline mt-2 inline-block">
              View Wishlist →
            </Link>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <Heart className="w-6 h-6 fill-current" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase">Active Price Alerts</span>
            <div className="text-2xl font-extrabold text-slate-900 mt-1">{alerts.length}</div>
            <Link to="/alerts" className="text-xs font-bold text-amber-600 hover:underline mt-2 inline-block">
              Manage Alerts →
            </Link>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Bell className="w-6 h-6 fill-current" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase">AI Recommendations</span>
            <div className="text-2xl font-extrabold text-slate-900 mt-1">Ready</div>
            <Link to="/recommendations" className="text-xs font-bold text-indigo-600 hover:underline mt-2 inline-block">
              Launch Assistant →
            </Link>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <History className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* Quick Access Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Saved Wishlist Snippet */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Heart className="w-4 h-4 text-rose-500 fill-current" />
              <span>Recently Saved Products</span>
            </h3>
            <Link to="/wishlist" className="text-xs font-bold text-sky-600 hover:underline">
              View All
            </Link>
          </div>

          {wishlist.length === 0 ? (
            <p className="text-xs text-slate-400 py-4 text-center">No saved products yet.</p>
          ) : (
            <div className="space-y-3">
              {wishlist.slice(0, 3).map((item) => {
                const prod = item.product_details;
                if (!prod) return null;
                return (
                  <div key={item.id} className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <img src={prod.image_url} alt={prod.name} className="w-10 h-10 object-contain" />
                      <div>
                        <h4 className="font-bold text-xs text-slate-900 line-clamp-1">{prod.name}</h4>
                        <span className="text-[11px] text-slate-500">From ₹{prod.lowest_price?.toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                    <Link to={`/product/${prod.id}`} className="text-xs font-bold text-sky-600 hover:underline">
                      Compare
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Active Alerts Snippet */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Bell className="w-4 h-4 text-amber-500 fill-current" />
              <span>Active Price Drop Monitoring</span>
            </h3>
            <Link to="/alerts" className="text-xs font-bold text-amber-600 hover:underline">
              View All
            </Link>
          </div>

          {alerts.length === 0 ? (
            <p className="text-xs text-slate-400 py-4 text-center">No active alerts set.</p>
          ) : (
            <div className="space-y-3">
              {alerts.slice(0, 3).map((alertItem) => {
                const prod = alertItem.product_details;
                if (!prod) return null;
                return (
                  <div key={alertItem.id} className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl">
                    <div>
                      <h4 className="font-bold text-xs text-slate-900 line-clamp-1">{prod.name}</h4>
                      <span className="text-[11px] text-amber-700 font-semibold">Target: ₹{alertItem.target_price?.toLocaleString('en-IN')}</span>
                    </div>
                    <span className="text-xs font-extrabold text-slate-900">
                      Current: ₹{alertItem.current_price?.toLocaleString('en-IN')}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
