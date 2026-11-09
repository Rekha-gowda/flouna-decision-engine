import React, { useState } from 'react';
import { Star, Clock, Tag, MapPin, Award, CheckCircle, TrendingUp, Info, ChevronRight, BarChart3 } from 'lucide-react';

export default function RecommendationHero({ recommendation }) {
  const [showBreakdown, setShowBreakdown] = useState(false);

  if (!recommendation || !recommendation.item) return null;

  const { item, explanation } = recommendation;
  const breakdown = item.scoreBreakdown || {};

  return (
    <div className="mb-10 relative">
      {/* Outer Glow */}
      <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 via-amber-500 to-rose-500 rounded-3xl blur-xl opacity-20 pointer-events-none"></div>

      <div className="relative rounded-2xl bg-gradient-to-br from-slate-900/95 via-slate-900/90 to-slate-950 p-6 sm:p-8 border border-orange-500/30 shadow-2xl">
        {/* Header Ribbon */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-orange-500/20 text-orange-400 border border-orange-500/40">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold uppercase tracking-widest text-orange-400">
                  FLOUNA #1 Recommended Best-Fit Match
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                  {item.providerTag}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white">
                {item.dishName}
              </h2>
            </div>
          </div>

          {/* Composite Score Circle */}
          <div className="flex items-center space-x-3 bg-slate-950/80 px-4 py-2.5 rounded-2xl border border-slate-800">
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Match Score</span>
              <span className="text-2xl font-black bg-gradient-to-r from-orange-400 to-amber-300 bg-clip-text text-transparent">
                {item.compositeScore}
              </span>
              <span className="text-xs text-slate-500">/100</span>
            </div>
          </div>
        </div>

        {/* Restaurant & Key Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {/* Restaurant & Location */}
          <div className="p-3.5 rounded-xl bg-slate-950/50 border border-slate-800/80">
            <span className="text-[11px] font-semibold text-slate-400 block mb-1">Restaurant</span>
            <span className="text-sm font-bold text-slate-100 block truncate">
              {item.restaurantName}
            </span>
            <div className="flex items-center text-xs text-slate-400 mt-1">
              <MapPin className="w-3 h-3 text-orange-400 mr-1 shrink-0" />
              <span className="truncate">{item.location} ({item.distanceKm} km)</span>
            </div>
          </div>

          {/* Price & Offers */}
          <div className="p-3.5 rounded-xl bg-slate-950/50 border border-slate-800/80">
            <span className="text-[11px] font-semibold text-slate-400 block mb-1">Price</span>
            <div className="flex items-baseline space-x-1.5">
              <span className="text-lg font-black text-emerald-400">₹{item.price}</span>
              {item.originalPrice && item.originalPrice > item.price && (
                <span className="text-xs text-slate-500 line-through">₹{item.originalPrice}</span>
              )}
            </div>
            {item.discountText ? (
              <span className="text-[10px] font-medium text-amber-300 mt-1 block truncate">
                {item.discountText}
              </span>
            ) : (
              <span className="text-[10px] text-slate-500 mt-1 block">Best direct rate</span>
            )}
          </div>

          {/* Delivery ETA */}
          <div className="p-3.5 rounded-xl bg-slate-950/50 border border-slate-800/80">
            <span className="text-[11px] font-semibold text-slate-400 block mb-1">Delivery Time</span>
            <div className="flex items-center space-x-1 text-slate-100">
              <Clock className="w-4 h-4 text-blue-400" />
              <span className="text-lg font-bold">{item.deliveryTimeMinutes}</span>
              <span className="text-xs text-slate-400">mins</span>
            </div>
            <span className="text-[10px] text-emerald-400 mt-1 block">Standard arrival</span>
          </div>

          {/* Rating & Trust */}
          <div className="p-3.5 rounded-xl bg-slate-950/50 border border-slate-800/80">
            <span className="text-[11px] font-semibold text-slate-400 block mb-1">Customer Rating</span>
            <div className="flex items-center space-x-1.5">
              <div className="flex items-center text-amber-400">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="text-lg font-bold ml-1 text-slate-100">{item.rating}</span>
              </div>
              <span className="text-xs text-slate-400">({item.reviewCount.toLocaleString()})</span>
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block capitalize">{item.dietTag} option</span>
          </div>
        </div>

        {/* Grounded Explanation Box */}
        <div className="p-4 rounded-xl bg-orange-950/20 border border-orange-500/20 mb-6">
          <div className="flex items-center space-x-2 text-xs font-bold uppercase text-orange-400 mb-2">
            <Info className="w-4 h-4" />
            <span>Why FLOUNA Recommends This (Explainable AI Engine)</span>
          </div>
          
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed mb-3">
            {explanation.summary}
          </p>

          {/* Key Bullet Reasons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
            {explanation.reasons.map((reason, idx) => (
              <div key={idx} className="flex items-start space-x-2 text-xs text-slate-300">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>{reason}</span>
              </div>
            ))}
          </div>

          {/* Contrastive Insight (Why it beat the cheap option or runner up) */}
          {explanation.contrastiveInsight && (
            <div className="mt-3 pt-3 border-t border-orange-500/20 text-xs text-amber-200/90 flex items-start space-x-2 bg-orange-500/5 p-2.5 rounded-lg">
              <TrendingUp className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-orange-300">Decision Contrast Insight: </span>
                <span>{explanation.contrastiveInsight}</span>
              </div>
            </div>
          )}
        </div>

        {/* Score Breakdown Toggle */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={() => setShowBreakdown(!showBreakdown)}
            className="flex items-center space-x-2 text-xs text-slate-400 hover:text-white transition-all px-3 py-1.5 rounded-lg bg-slate-800/60 border border-slate-700/60"
          >
            <BarChart3 className="w-3.5 h-3.5 text-orange-400" />
            <span>{showBreakdown ? 'Hide Scoring Weights' : 'Inspect Multi-Criteria Weights Breakdown'}</span>
          </button>

          <span className="text-[11px] text-slate-500 font-mono">
            Provider Raw Id: {item.id}
          </span>
        </div>

        {/* Detailed Weights Breakdown */}
        {showBreakdown && breakdown && (
          <div className="mt-4 pt-4 border-t border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
              <div className="flex justify-between text-slate-400 mb-1">
                <span>Quality Score</span>
                <span className="text-orange-400 font-bold">{breakdown.qualityScore}/100</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-orange-500 h-full rounded-full" style={{ width: `${breakdown.qualityScore}%` }}></div>
              </div>
              <span className="text-[10px] text-slate-500 mt-1 block">Weight: {((breakdown.weightsApplied?.quality || 0.35) * 100)}%</span>
            </div>

            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
              <div className="flex justify-between text-slate-400 mb-1">
                <span>Delivery Speed</span>
                <span className="text-blue-400 font-bold">{breakdown.speedScore}/100</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-blue-500 h-full rounded-full" style={{ width: `${breakdown.speedScore}%` }}></div>
              </div>
              <span className="text-[10px] text-slate-500 mt-1 block">Weight: {((breakdown.weightsApplied?.speed || 0.25) * 100)}%</span>
            </div>

            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
              <div className="flex justify-between text-slate-400 mb-1">
                <span>Value & Price</span>
                <span className="text-emerald-400 font-bold">{breakdown.valueScore}/100</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${breakdown.valueScore}%` }}></div>
              </div>
              <span className="text-[10px] text-slate-500 mt-1 block">Weight: {((breakdown.weightsApplied?.value || 0.20) * 100)}%</span>
            </div>

            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
              <div className="flex justify-between text-slate-400 mb-1">
                <span>Intent Match</span>
                <span className="text-purple-400 font-bold">{breakdown.matchScore}/100</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-purple-500 h-full rounded-full" style={{ width: `${breakdown.matchScore}%` }}></div>
              </div>
              <span className="text-[10px] text-slate-500 mt-1 block">Weight: {((breakdown.weightsApplied?.match || 0.20) * 100)}%</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
