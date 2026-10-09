import React from 'react';
import { ExternalLink, Star, CheckCircle, AlertCircle, Info, ShieldCheck } from 'lucide-react';
import { ProductOffer } from '../types';

interface PriceComparisonTableProps {
  offers: ProductOffer[];
}

export const PriceComparisonTable: React.FC<PriceComparisonTableProps> = ({ offers }) => {
  if (!offers || offers.length === 0) {
    return (
      <div className="p-8 text-center text-slate-500 bg-slate-50 rounded-2xl border border-slate-200">
        No active offers available for this product at the moment.
      </div>
    );
  }

  // Sort offers by final price ascending
  const sortedOffers = [...offers].sort((a, b) => a.final_price - b.final_price);
  const lowestPrice = sortedOffers[0].final_price;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
            <span>Multi-Store Offers Comparison</span>
            <span className="text-xs bg-sky-100 text-sky-800 font-semibold px-2.5 py-0.5 rounded-full">
              {sortedOffers.length} Stores Available
            </span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Calculated as: <strong className="text-slate-700">Final Price = Base Price − Discount + Delivery Charge</strong>
          </p>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl font-medium border border-emerald-200">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Lowest Net Price Guaranteed</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-100/60 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <th className="py-3 px-4">Store</th>
              <th className="py-3 px-4 text-right">Base Price</th>
              <th className="py-3 px-4 text-right">Discount</th>
              <th className="py-3 px-4 text-right">Delivery</th>
              <th className="py-3 px-4 text-right">Final Price</th>
              <th className="py-3 px-4 text-center">Rating</th>
              <th className="py-3 px-4 text-center">Availability</th>
              <th className="py-3 px-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {sortedOffers.map((offer, idx) => {
              const isLowest = offer.final_price === lowestPrice;

              return (
                <tr
                  key={offer.id}
                  className={`hover:bg-sky-50/40 transition-colors ${
                    isLowest ? 'bg-emerald-50/30' : ''
                  }`}
                >
                  {/* Store Name & Offer Badge */}
                  <td className="py-4 px-4 font-semibold text-slate-900">
                    <div className="flex items-center gap-2">
                      <span>{offer.store.name}</span>
                      {isLowest && (
                        <span className="text-[10px] uppercase tracking-wider font-extrabold bg-emerald-600 text-white px-2 py-0.5 rounded">
                          Best Deal
                        </span>
                      )}
                    </div>
                    {offer.is_conditional_offer && offer.offer_details && (
                      <div className="flex items-center gap-1 text-[11px] font-normal text-amber-700 bg-amber-50 px-2 py-0.5 rounded mt-1 border border-amber-200/60 inline-flex">
                        <Info className="w-3 h-3 text-amber-600 flex-shrink-0" />
                        <span>{offer.offer_details}</span>
                      </div>
                    )}
                  </td>

                  {/* Base Price */}
                  <td className="py-4 px-4 text-right font-medium text-slate-600">
                    ₹{Number(offer.price).toLocaleString('en-IN')}
                  </td>

                  {/* Discount */}
                  <td className="py-4 px-4 text-right text-emerald-600 font-semibold">
                    {offer.discount > 0 ? `-₹${Number(offer.discount).toLocaleString('en-IN')}` : '—'}
                  </td>

                  {/* Delivery Charge */}
                  <td className="py-4 px-4 text-right text-slate-600 font-medium">
                    {offer.delivery_charge == 0 ? (
                      <span className="text-emerald-600 font-bold text-xs uppercase">Free</span>
                    ) : (
                      `+₹${Number(offer.delivery_charge).toLocaleString('en-IN')}`
                    )}
                  </td>

                  {/* Final Calculated Price */}
                  <td className="py-4 px-4 text-right">
                    <span
                      className={`text-base font-extrabold ${
                        isLowest ? 'text-emerald-600' : 'text-slate-900'
                      }`}
                    >
                      ₹{offer.final_price.toLocaleString('en-IN')}
                    </span>
                  </td>

                  {/* Store Rating */}
                  <td className="py-4 px-4 text-center">
                    <div className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-xs font-semibold">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span>{offer.rating || offer.store.rating}</span>
                    </div>
                  </td>

                  {/* Stock Status */}
                  <td className="py-4 px-4 text-center">
                    {offer.availability === 'In Stock' ? (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-100/70 px-2.5 py-1 rounded-full">
                        <CheckCircle className="w-3.5 h-3.5" />
                        In Stock
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 bg-amber-100/70 px-2.5 py-1 rounded-full">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {offer.availability}
                      </span>
                    )}
                  </td>

                  {/* Redirect Action */}
                  <td className="py-4 px-4 text-center">
                    <a
                      href={offer.product_url || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-semibold text-xs transition-all shadow-sm ${
                        isLowest
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                          : 'bg-sky-600 hover:bg-sky-700 text-white'
                      }`}
                    >
                      <span>View Deal</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="p-3 bg-slate-50 border-t border-slate-200 text-[11px] text-slate-500 text-center">
        * Prices and discounts are fetched from permitted demo sources and subject to merchant offer terms.
      </div>
    </div>
  );
};
