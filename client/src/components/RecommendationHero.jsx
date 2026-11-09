import React from 'react';
import { Star, Clock, MapPin, Tag, Flame, Plus, Check, AlertTriangle, ShieldCheck, ChevronRight } from 'lucide-react';

export default function RecommendationHero({ recommendation, hasExactMatch, onAddToCart }) {
  if (!recommendation || !recommendation.item) return null;

  const { item, explanation } = recommendation;
  const isExact = hasExactMatch !== false && item.isExactMatch !== false;

  return (
    <div className="mb-10">
      {/* Alert Banner when NO EXACT MATCH found */}
      {!isExact && (
        <div className="mb-4 p-4 rounded-2xl bg-amber-500/10 border-2 border-amber-500/30 text-amber-200 flex items-start space-x-3 shadow-lg">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm">
            <span className="font-bold text-amber-300 block text-sm sm:text-base mb-0.5">
              No exact match found for your exact criteria
            </span>
            <p className="text-slate-300 leading-relaxed">
              We couldn't find any option that meets all your strict limits (e.g. price or delivery time). 
              However, <strong>FLOUNA found the closest similar high-rated options</strong> nearby for you:
            </p>
          </div>
        </div>
      )}

      {/* Flagship Recommendation Card */}
      <div className="relative rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 p-6 sm:p-8 border border-slate-700 shadow-2xl overflow-hidden">
        {/* Top Highlight Tag */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-2.5">
            <div className={`p-2 rounded-xl ${isExact ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'}`}>
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                  isExact
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                    : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                }`}>
                  {isExact ? '✓ Best Fit Recommendation' : '⚡ Top Similar Match'}
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  via {item.providerTag}
                </span>
              </div>
              <h2 className="text-xl sm:text-3xl font-extrabold text-white mt-1">
                {item.dishName}
              </h2>
            </div>
          </div>

          {/* Price & Add to Cart Action */}
          <div className="flex items-center space-x-4 bg-slate-950/80 px-5 py-3 rounded-2xl border border-slate-800">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Offer Price</span>
              <div className="flex items-baseline space-x-1.5">
                <span className="text-2xl font-black text-emerald-400">₹{item.price}</span>
                {item.originalPrice && item.originalPrice > item.price && (
                  <span className="text-xs text-slate-500 line-through">₹{item.originalPrice}</span>
                )}
              </div>
            </div>

            <button
              onClick={() => onAddToCart && onAddToCart(item)}
              className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs sm:text-sm shadow-lg shadow-orange-500/20 flex items-center space-x-1.5 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add to Cart</span>
            </button>
          </div>
        </div>

        {/* Restaurant & Key Details Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 mb-6">
          {/* Restaurant */}
          <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800">
            <span className="text-[11px] font-medium text-slate-400 block mb-0.5">Restaurant</span>
            <span className="text-sm font-bold text-slate-100 block truncate">
              {item.restaurantName}
            </span>
            <div className="flex items-center text-xs text-slate-400 mt-1">
              <MapPin className="w-3 h-3 text-orange-400 mr-1 shrink-0" />
              <span className="truncate">{item.location} ({item.distanceKm} km)</span>
            </div>
          </div>

          {/* Delivery Time */}
          <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800">
            <span className="text-[11px] font-medium text-slate-400 block mb-0.5">Delivery Time</span>
            <div className="flex items-center space-x-1.5 text-slate-100 mt-0.5">
              <Clock className="w-4 h-4 text-blue-400" />
              <span className="text-base font-bold">{item.deliveryTimeMinutes} mins</span>
            </div>
            <span className="text-[10px] text-emerald-400 mt-0.5 block font-medium">Fast door delivery</span>
          </div>

          {/* Customer Rating */}
          <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800">
            <span className="text-[11px] font-medium text-slate-400 block mb-0.5">Rating</span>
            <div className="flex items-center space-x-1 mt-0.5">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span className="text-base font-bold text-slate-100">{item.rating}</span>
              <span className="text-xs text-slate-400">({item.reviewCount.toLocaleString()} reviews)</span>
            </div>
            <span className="text-[10px] text-slate-400 mt-0.5 block capitalize">{item.dietTag.toLowerCase()}</span>
          </div>

          {/* Special Deal / Savings */}
          <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800">
            <span className="text-[11px] font-medium text-slate-400 block mb-0.5">Active Deal</span>
            <span className="text-xs font-bold text-amber-400 block truncate mt-0.5">
              {item.discountText || item.specialOffer || 'Best Available Price'}
            </span>
            <span className="text-[10px] text-slate-400 mt-0.5 block">Applied automatically</span>
          </div>
        </div>

        {/* Why this is recommended - Consumer friendly explanation */}
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs sm:text-sm">
          <div className="flex items-center space-x-2 text-xs font-bold text-orange-400 uppercase tracking-wider mb-2">
            <span>Why we chose this for you:</span>
          </div>

          <p className="text-slate-200 leading-relaxed mb-3">
            {explanation.summary}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
            {explanation.reasons.map((r, i) => (
              <div key={i} className="flex items-start space-x-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>{r}</span>
              </div>
            ))}
          </div>

          {explanation.contrastiveInsight && (
            <div className="mt-3 pt-3 border-t border-slate-800 text-xs text-amber-300/90 bg-amber-500/5 p-2.5 rounded-xl">
              <strong>Price vs Quality comparison: </strong> {explanation.contrastiveInsight}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
