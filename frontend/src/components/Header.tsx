import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Heart, Bell, User, ShoppingBag, Sparkles, LayoutDashboard } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useAlerts } from '../context/AlertsContext';
import { useAuth } from '../context/AuthContext';

export const Header: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { wishlist } = useWishlist();
  const { alerts } = useAlerts();
  const { user, logout } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-sky-500/20 group-hover:scale-105 transition-transform">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-bold bg-gradient-to-r from-sky-600 to-indigo-700 bg-clip-text text-transparent">
                PriceWise
              </span>
              <span className="block text-[10px] uppercase tracking-wider font-semibold text-emerald-600 -mt-1">
                AI Comparison
              </span>
            </div>
          </Link>

          {/* Search Bar */}
          <form onSubmit={handleSearchSubmit} className="flex-1 max-w-2xl relative hidden md:block">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for products, brands or model numbers... (e.g. Samsung Galaxy S25)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-24 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <button
                type="submit"
                className="absolute right-1.5 top-1.5 bottom-1.5 px-4 bg-sky-600 hover:bg-sky-700 text-white font-medium text-xs rounded-lg transition-colors"
              >
                Search
              </button>
            </div>
          </form>

          {/* Nav Actions */}
          <div className="flex items-center gap-3">
            <Link
              to="/recommendations"
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Assistant</span>
            </Link>

            <Link
              to="/wishlist"
              className="p-2 text-slate-600 hover:text-rose-600 rounded-lg hover:bg-slate-100 relative transition-colors"
              title="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </Link>

            <Link
              to="/alerts"
              className="p-2 text-slate-600 hover:text-amber-600 rounded-lg hover:bg-slate-100 relative transition-colors"
              title="Price Alerts"
            >
              <Bell className="w-5 h-5" />
              {alerts.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-amber-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center">
                  {alerts.length}
                </span>
              )}
            </Link>

            {user?.is_staff && (
              <Link
                to="/admin"
                className="p-2 text-slate-600 hover:text-sky-600 rounded-lg hover:bg-slate-100 transition-colors"
                title="Admin Dashboard"
              >
                <LayoutDashboard className="w-5 h-5" />
              </Link>
            )}

            {/* Profile Dropdown */}
            <div className="relative" ref={profileRef}>
              {user ? (
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-100 text-sm font-medium text-slate-700"
                >
                  <div className="w-8 h-8 rounded-full bg-sky-100 text-sky-700 font-bold flex items-center justify-center text-xs border border-sky-200">
                    {user.username.slice(0, 2).toUpperCase()}
                  </div>
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    to="/login"
                    className="text-xs font-medium text-slate-700 hover:text-sky-600 px-3 py-2"
                  >
                    Log In
                  </Link>
                  <Link
                    to="/register"
                    className="text-xs font-medium bg-sky-600 text-white px-3.5 py-2 rounded-lg hover:bg-sky-700 transition-colors"
                  >
                    Sign Up
                  </Link>
                </div>
              )}

              {profileOpen && user && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-lg py-1 z-50 text-xs">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="font-semibold text-slate-900">{user.username}</p>
                    <p className="text-slate-500 text-[11px] truncate">{user.email}</p>
                  </div>
                  <Link
                    to="/dashboard"
                    onClick={() => setProfileOpen(false)}
                    className="block px-4 py-2 text-slate-700 hover:bg-slate-50"
                  >
                    My Dashboard
                  </Link>
                  <Link
                    to="/wishlist"
                    onClick={() => setProfileOpen(false)}
                    className="block px-4 py-2 text-slate-700 hover:bg-slate-50"
                  >
                    Saved Products ({wishlist.length})
                  </Link>
                  <Link
                    to="/alerts"
                    onClick={() => setProfileOpen(false)}
                    className="block px-4 py-2 text-slate-700 hover:bg-slate-50"
                  >
                    Price Drop Alerts ({alerts.length})
                  </Link>
                  {user.is_staff && (
                    <Link
                      to="/admin"
                      onClick={() => setProfileOpen(false)}
                      className="block px-4 py-2 text-sky-700 font-semibold hover:bg-sky-50"
                    >
                      Admin Console
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      logout();
                      setProfileOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-rose-600 hover:bg-rose-50 font-medium"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Mobile Search Bar */}
        <form onSubmit={handleSearchSubmit} className="py-2 pb-3 md:hidden">
          <div className="relative">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-16 py-2 bg-slate-100 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <button
              type="submit"
              className="absolute right-1 top-1 bottom-1 px-3 bg-sky-600 text-white text-[11px] font-medium rounded transition-colors"
            >
              Search
            </button>
          </div>
        </form>
      </div>
    </header>
  );
};
