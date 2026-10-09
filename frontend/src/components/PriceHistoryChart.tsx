import React, { useState, useEffect } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Calendar, TrendingDown, TrendingUp, DollarSign, Activity } from 'lucide-react';
import { productService } from '../services/api';
import { PriceHistoryResponse } from '../types';

interface PriceHistoryChartProps {
  productId: number;
}

export const PriceHistoryChart: React.FC<PriceHistoryChartProps> = ({ productId }) => {
  const [days, setDays] = useState<number>(180);
  const [data, setData] = useState<PriceHistoryResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      try {
        const res = await productService.getPriceHistory(productId, days);
        setData(res);
      } catch {
        setData(null);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [productId, days]);

  if (loading) {
    return (
      <div className="h-64 bg-slate-100 animate-pulse rounded-2xl flex items-center justify-center text-slate-400">
        Loading price history chart...
      </div>
    );
  }

  if (!data || !data.history || data.history.length === 0) {
    return (
      <div className="p-8 text-center text-slate-500 bg-slate-50 rounded-2xl border border-slate-200">
        Price history records not available.
      </div>
    );
  }

  // Format history for Recharts
  const chartPoints = data.history.map((h) => ({
    date: new Date(h.recorded_at).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
    price: Number(h.price),
    store: h.store_name,
  }));

  const { current_price, lowest_price, highest_price, average_price } = data.summary;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
      
      {/* Header and timeframe toggle */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
            <Activity className="w-5 h-5 text-sky-600" />
            <span>Price History & Trend Analysis</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Historical price logs tracked over time across all stores
          </p>
        </div>

        {/* Timeframe buttons */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
          {[
            { label: '30 Days', val: 30 },
            { label: '90 Days', val: 90 },
            { label: '180 Days', val: 180 },
            { label: '1 Year', val: 365 },
          ].map((item) => (
            <button
              key={item.val}
              onClick={() => setDays(item.val)}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                days === item.val
                  ? 'bg-white text-sky-700 shadow-sm font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mb-1">
            <DollarSign className="w-3.5 h-3.5 text-sky-600" />
            <span>Current Price</span>
          </div>
          <div className="text-lg font-bold text-slate-900">
            ₹{current_price.toLocaleString('en-IN')}
          </div>
        </div>

        <div className="bg-emerald-50/60 p-3.5 rounded-xl border border-emerald-200/80">
          <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-medium mb-1">
            <TrendingDown className="w-3.5 h-3.5 text-emerald-600" />
            <span>Lowest Recorded</span>
          </div>
          <div className="text-lg font-bold text-emerald-700">
            ₹{lowest_price.toLocaleString('en-IN')}
          </div>
        </div>

        <div className="bg-rose-50/60 p-3.5 rounded-xl border border-rose-200/80">
          <div className="flex items-center gap-1.5 text-xs text-rose-700 font-medium mb-1">
            <TrendingUp className="w-3.5 h-3.5 text-rose-600" />
            <span>Highest Recorded</span>
          </div>
          <div className="text-lg font-bold text-rose-700">
            ₹{highest_price.toLocaleString('en-IN')}
          </div>
        </div>

        <div className="bg-indigo-50/60 p-3.5 rounded-xl border border-indigo-200/80">
          <div className="flex items-center gap-1.5 text-xs text-indigo-700 font-medium mb-1">
            <Calendar className="w-3.5 h-3.5 text-indigo-600" />
            <span>Average Price</span>
          </div>
          <div className="text-lg font-bold text-indigo-700">
            ₹{average_price.toLocaleString('en-IN')}
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartPoints} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis
              dataKey="date"
              stroke="#94a3b8"
              fontSize={11}
              tickLine={false}
              interval="preserveStartEnd"
              tick={{ angle: -30, textAnchor: 'end', dy: 4 }}
              height={40}
            />
            <YAxis
              stroke="#94a3b8"
              fontSize={11}
              tickLine={false}
              tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
            />
            <Tooltip
              formatter={(value: any) => [`₹${Number(value).toLocaleString('en-IN')}`, 'Price']}
              contentStyle={{
                backgroundColor: '#0f172a',
                color: '#fff',
                borderRadius: '12px',
                border: 'none',
                fontSize: '12px',
              }}
              itemStyle={{ color: '#38bdf8' }}
            />
            <Line
              type="monotone"
              dataKey="price"
              stroke="#0284c7"
              strokeWidth={3}
              dot={{ fill: '#0284c7', r: 4 }}
              activeDot={{ r: 6, fill: '#38bdf8', stroke: '#0284c7', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
};
