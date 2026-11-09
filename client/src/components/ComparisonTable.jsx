import React, { useState } from 'react';
import { Star, Clock, MapPin, Tag, Plus, Check, Filter } from 'lucide-react';

export default function ComparisonTable({ options = [], onAddToCart }) {
  const [activeFilter, setActiveFilter] = useState('ALL'); // 'ALL', 'VEG', 'FAST', 'UNDER300'
  const [sortBy, setSortBy] = useState('BEST'); // 'BEST', 'PRICE_ASC', 'RATING_DESC', 'TIME_ASC'

  const filtered = options.filter((item) => {
    if (activeFilter === 'VEG') return item.isVeg;
    if (activeFilter === 'FAST') return item.deliveryTimeMinutes <= 25;
    if (activeFilter === 'UNDER300') return item.price <= 300;
    return true;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'BEST') return b.compositeScore - a.compositeScore;
    if (sortBy === 'PRICE_ASC') return a.price - b.price;
    if (sortBy === 'RATING_DESC') return b.rating - a.rating;
    if (sortBy === 'TIME_ASC') return a.deliveryTimeMinutes - b.deliveryTimeMinutes;
    return 0;
  });

  return (
    <div className="mb-16">
      {/* Real-World Food Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-xl sm:text-2xl font-black text-white">
            All Available Restaurants & Dishes ({sorted.length})
          </h3>
          <p className="text-xs sm:text-sm text-slate-400">
            Compare prices, delivery speeds, and verified ratings across food apps
          </p>
        </div>

        {/* Filter and Sort Tabs */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div className="flex items-center space-x-1 p-1 bg-slate-900 rounded-xl border border-slate-800">
            {[
              { id: 'ALL', label: 'All' },
              { id: 'VEG', label: 'Pure Veg 🟢' },
              { id: 'FAST', label: '⚡ <25 mins' },
              { id: 'UNDER300', label: 'Under ₹300' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id)}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                  activeFilter === tab.id
                    ? 'bg-orange-500 text-white font-bold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-orange-500 text-xs cursor-pointer"
          >
            <option value="BEST">Best Match First</option>
            <option value="PRICE_ASC">Price: Low to High</option>
            <option value="RATING_DESC">Rating: High to Low</option>
            <option value="TIME_ASC">Fastest Delivery</option>
          </select>
        </div>
      </div>

      {/* Restaurant Food Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {sorted.map((item, index) => {
          const isTop = index === 0;
          const hasCrossDeal = item.isDeduplicated && item.crossPlatformDeals;

          return (
            <div
              key={item.id}
              className={`rounded-2xl bg-slate-900/90 border transition-all hover:border-slate-700 hover:shadow-xl p-5 flex flex-col justify-between ${
                isTop ? 'border-orange-500/40 ring-1 ring-orange-500/20' : 'border-slate-800'
              }`}
            >
              <div>
                {/* Header: Diet Tag & Provider */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-1.5">
                    <span className={`w-3 h-3 rounded-full border flex items-center justify-center ${
                      item.isVeg ? 'border-emerald-500 bg-emerald-500/20' : 'border-rose-500 bg-rose-500/20'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${item.isVeg ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                    </span>
                    <span className="text-[11px] font-semibold text-slate-400 capitalize">
                      {item.isVeg ? 'Pure Veg' : 'Non-Veg'}
                    </span>
                  </div>

                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                    {item.providerTag}
                  </span>
                </div>

                {/* Dish Name & Restaurant */}
                <h4 className="text-base font-bold text-slate-100 line-clamp-1 mb-1">
                  {item.dishName}
                </h4>
                <p className="text-xs text-slate-400 flex items-center mb-3">
                  <MapPin className="w-3 h-3 text-orange-400 mr-1 shrink-0" />
                  <span className="truncate">{item.restaurantName} • {item.location}</span>
                </p>

                {/* Inexact match note if applicable */}
                {item.isExactMatch === false && item.unmetConstraints && item.unmetConstraints.length > 0 && (
                  <div className="mb-3 p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-300">
                    Similar option: {item.unmetConstraints.map(c => c.message).join(', ')}
                  </div>
                )}

                {/* Price Arbitrage Note */}
                {hasCrossDeal && item.crossPlatformDeals.potentialSavingsInr > 0 && (
                  <div className="mb-3 p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-300 font-semibold">
                    🎉 Save ₹{item.crossPlatformDeals.potentialSavingsInr} ordering here vs other apps!
                  </div>
                )}
              </div>

              {/* Bottom Row: Rating, Time, Price, Add to Cart */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-2 text-xs mb-1">
                    <span className="flex items-center text-amber-400 font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-400 mr-0.5" />
                      {item.rating}
                    </span>
                    <span className="text-slate-500">•</span>
                    <span className="text-slate-300 flex items-center">
                      <Clock className="w-3 h-3 text-blue-400 mr-1" />
                      {item.deliveryTimeMinutes}m
                    </span>
                  </div>

                  <div className="flex items-baseline space-x-1.5">
                    <span className="text-lg font-black text-white">₹{item.price}</span>
                    {item.originalPrice && item.originalPrice > item.price && (
                      <span className="text-xs text-slate-500 line-through">₹{item.originalPrice}</span>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => onAddToCart && onAddToCart(item)}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-orange-500 text-slate-200 hover:text-white font-bold text-xs transition-all flex items-center space-x-1 cursor-pointer border border-slate-700 hover:border-orange-500 shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
