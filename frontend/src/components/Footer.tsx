import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ShieldCheck, Zap, TrendingDown } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-12 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Value props */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-10 border-b border-slate-800">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm">Unbiased Comparison</h4>
              <p className="text-xs text-slate-400 mt-0.5">We scan multi-store offers to reveal true net final prices.</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center flex-shrink-0">
              <TrendingDown className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm">Price Drop Alerts</h4>
              <p className="text-xs text-slate-400 mt-0.5">Never overpay. Get notified when your target product drops.</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center flex-shrink-0">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm">AI Shopping Assistant</h4>
              <p className="text-xs text-slate-400 mt-0.5">Enter your specs & budget to get custom recommendations.</p>
            </div>
          </div>
        </div>

        {/* Links grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-sky-600 flex items-center justify-center text-white">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <span className="text-lg font-bold text-white">PriceWise</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              AI-Powered E-Commerce Price Comparison & Shopping Assistant platform. Find the best price across online retailers in India.
            </p>
          </div>

          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Popular Stores</h5>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><a href="https://www.amazon.in" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Amazon India</a></li>
              <li><a href="https://www.flipkart.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Flipkart</a></li>
              <li><a href="https://www.croma.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Croma</a></li>
              <li><a href="https://www.reliancedigital.in" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Reliance Digital</a></li>
              <li><a href="https://www.myntra.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Myntra</a></li>
            </ul>
          </div>

          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Categories</h5>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><Link to="/search?category=mobiles" className="hover:text-white transition-colors">Smartphones</Link></li>
              <li><Link to="/search?category=laptops" className="hover:text-white transition-colors">Laptops & Computers</Link></li>
              <li><Link to="/search?category=headphones" className="hover:text-white transition-colors">Headphones & Audio</Link></li>
              <li><Link to="/search?category=smart-watches" className="hover:text-white transition-colors">Smart Watches</Link></li>
              <li><Link to="/search?category=tvs" className="hover:text-white transition-colors">Smart TVs</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Quick Links</h5>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><Link to="/recommendations" className="hover:text-white transition-colors">AI Shopping Assistant</Link></li>
              <li><Link to="/wishlist" className="hover:text-white transition-colors">My Saved Wishlist</Link></li>
              <li><Link to="/alerts" className="hover:text-white transition-colors">Price Drop Alerts</Link></li>
              <li><Link to="/admin" className="hover:text-white transition-colors">Admin Dashboard</Link></li>
            </ul>
          </div>
        </div>

        {/* Disclaimer & Bottom Bar */}
        <div className="pt-8 border-t border-slate-800 text-center md:flex md:justify-between items-center text-xs text-slate-500">
          <p>© {new Date().getFullYear()} PriceWise Inc. All rights reserved. Fictional/demo links marked appropriately.</p>
          <p className="mt-2 md:mt-0">Built with React, TypeScript & Django REST Framework.</p>
        </div>

      </div>
    </footer>
  );
};
