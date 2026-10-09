import React from 'react';
import { Bell, Trash2, ArrowRight, TrendingDown, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAlerts } from '../context/AlertsContext';

export const AlertsPage: React.FC = () => {
  const { alerts, loading, removeAlert } = useAlerts();

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
            <Bell className="w-6 h-6 text-amber-500 fill-current" />
            <span>Price Drop Alerts</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Automated alerts triggering as soon as store price reaches or drops below your target
          </p>
        </div>
        <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-full">
          {alerts.length} Active Alerts
        </span>
      </div>

      {alerts.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 max-w-md mx-auto my-8">
          <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center mx-auto mb-4 border border-amber-100">
            <Bell className="w-8 h-8" />
          </div>
          <h3 className="font-bold text-slate-900 text-lg">No Active Price Alerts</h3>
          <p className="text-xs text-slate-500 mt-2 leading-relaxed">
            Set target price alerts on product detail pages to get notified when prices drop!
          </p>
          <Link
            to="/search"
            className="mt-6 inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs px-5 py-3 rounded-xl transition-all shadow-md"
          >
            <span>Browse Products</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Product</th>
                  <th className="py-3 px-4 text-right">Current Price</th>
                  <th className="py-3 px-4 text-right">Target Price</th>
                  <th className="py-3 px-4 text-right">Price Difference</th>
                  <th className="py-3 px-4 text-center">Alert Status</th>
                  <th className="py-3 px-4 text-center">Created Date</th>
                  <th className="py-3 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
                {alerts.map((alertItem) => {
                  const product = alertItem.product_details;
                  if (!product) return null;

                  const diff = alertItem.current_price - alertItem.target_price;
                  const isReached = alertItem.is_triggered || alertItem.current_price <= alertItem.target_price;

                  return (
                    <tr key={alertItem.id} className="hover:bg-slate-50/60 transition-colors">
                      
                      {/* Product */}
                      <td className="py-3.5 px-4 font-semibold text-slate-900">
                        <Link to={`/product/${product.id}`} className="flex items-center gap-3 hover:text-sky-600">
                          <img src={product.image_url} alt={product.name} className="w-10 h-10 object-contain" />
                          <div>
                            <p className="line-clamp-1 text-xs font-bold">{product.name}</p>
                            <p className="text-[10px] text-slate-400 font-normal">{product.brand}</p>
                          </div>
                        </Link>
                      </td>

                      {/* Current Price */}
                      <td className="py-3.5 px-4 text-right font-bold text-slate-900">
                        ₹{Number(alertItem.current_price).toLocaleString('en-IN')}
                      </td>

                      {/* Target Price */}
                      <td className="py-3.5 px-4 text-right font-bold text-amber-600">
                        ₹{Number(alertItem.target_price).toLocaleString('en-IN')}
                      </td>

                      {/* Price Difference */}
                      <td className="py-3.5 px-4 text-right">
                        {diff <= 0 ? (
                          <span className="text-emerald-600 font-bold">
                            Target Met! (₹{Math.abs(diff).toLocaleString('en-IN')} below target)
                          </span>
                        ) : (
                          <span className="text-slate-500">
                            Needs ₹{diff.toLocaleString('en-IN')} drop
                          </span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 text-center">
                        {isReached ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-200">
                            <CheckCircle className="w-3 h-3 text-emerald-600" />
                            Triggered
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full">
                            Active Monitoring
                          </span>
                        )}
                      </td>

                      {/* Created Date */}
                      <td className="py-3.5 px-4 text-center text-slate-400">
                        {new Date(alertItem.created_at).toLocaleDateString('en-IN')}
                      </td>

                      {/* Action */}
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => removeAlert(alertItem.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Delete Alert"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
