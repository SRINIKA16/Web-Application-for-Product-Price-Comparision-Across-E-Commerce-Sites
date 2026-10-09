import React, { useState } from 'react';
import { Bell, X, Check } from 'lucide-react';
import { useAlerts } from '../context/AlertsContext';
import { Product } from '../types';

interface PriceAlertModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

export const PriceAlertModal: React.FC<PriceAlertModalProps> = ({ product, isOpen, onClose }) => {
  const { createAlert } = useAlerts();
  const [targetPrice, setTargetPrice] = useState<string>(
    product.lowest_price ? (product.lowest_price * 0.95).toFixed(0) : ''
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetPrice) return;
    setLoading(true);
    try {
      await createAlert(product.id, parseFloat(targetPrice));
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1500);
    } catch {
      alert('Failed to set price alert');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-md w-full p-6 relative">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 text-slate-400 hover:text-slate-600 rounded-lg"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base">Set Price Drop Alert</h3>
            <p className="text-xs text-slate-500">Get notified as soon as price reaches your target</p>
          </div>
        </div>

        {/* Product Summary */}
        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200/80 mb-4">
          <img src={product.image_url} alt={product.name} className="w-12 h-12 object-contain" />
          <div>
            <h4 className="font-semibold text-slate-900 text-xs line-clamp-1">{product.name}</h4>
            <p className="text-xs text-slate-500">
              Current Lowest: <strong className="text-slate-800">₹{product.lowest_price?.toLocaleString('en-IN')}</strong>
            </p>
          </div>
        </div>

        {success ? (
          <div className="py-6 text-center text-emerald-600 font-semibold flex flex-col items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
              <Check className="w-6 h-6 text-emerald-600" />
            </div>
            <span>Price alert created successfully!</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Target Price (₹)
              </label>
              <input
                type="number"
                value={targetPrice}
                onChange={(e) => setTargetPrice(e.target.value)}
                placeholder="Enter target price"
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500"
                required
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Suggested 5% discount target: ₹{((product.lowest_price || 0) * 0.95).toFixed(0)}
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-semibold text-xs rounded-xl transition-all shadow-sm disabled:opacity-50"
              >
                {loading ? 'Setting Alert...' : 'Create Price Alert'}
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
