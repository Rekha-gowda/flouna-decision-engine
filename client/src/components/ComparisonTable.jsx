import React, { useState } from 'react';
import { Star, Clock, MapPin, Tag, ArrowUpDown, Filter, Layers, CheckCircle2, AlertCircle } from 'lucide-react';

export default function ComparisonTable({ options = [], telemetry }) {
  const [selectedProvider, setSelectedProvider] = useState('ALL');
  const [sortBy, setSortBy] = useState('SCORE'); // 'SCORE', 'PRICE_ASC', 'RATING_DESC', 'TIME_ASC'

  const filteredOptions = options.filter(opt => {
    if (selectedProvider === 'ALL') return true;
    return opt.provider === selectedProvider;
  });

  const sortedOptions = [...filteredOptions].sort((a, b) => {
    if (sortBy === 'SCORE') return b.compositeScore - a.compositeScore;
    if (sortBy === 'PRICE_ASC') return a.price - b.price;
    if (sortBy === 'RATING_DESC') return b.rating - a.rating;
    if (sortBy === 'TIME_ASC') return a.deliveryTimeMinutes - b.deliveryTimeMinutes;
    return 0;
  });

  const providers = ['ALL', 'ZestyBites', 'QuickFeast', 'UrbanKitchen'];

  return (
    <div className="mb-12 rounded-2xl bg-slate-900/80 border border-slate-800 p-6 shadow-xl">
      {/* Header and Telemetry */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200">
              Normalized Multi-Provider Candidate Pool
            </h3>
            <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
              {options.length} Normalized Candidates
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time normalized comparison across heterogeneous schemas and ONDC networks
          </p>
        </div>

        {/* Telemetry Pills */}
        {telemetry && (
          <div className="flex items-center flex-wrap gap-2 text-[11px] font-mono">
            {telemetry.providers?.map((p) => (
              <div
                key={p.provider}
                className={`px-2.5 py-1 rounded-lg border flex items-center space-x-1.5 ${
                  p.status === 'SUCCESS'
                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                    : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${p.status === 'SUCCESS' ? 'bg-emerald-400' : 'bg-rose-400'}`}></span>
                <span>{p.provider}: {p.status === 'SUCCESS' ? `${p.count} items (${p.latencyMs}ms)` : 'Degraded (Fallback)'}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Filter and Sort Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        {/* Provider Filter Tabs */}
        <div className="flex items-center space-x-1 p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs">
          {providers.map((p) => (
            <button
              key={p}
              onClick={() => setSelectedProvider(p)}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                selectedProvider === p
                  ? 'bg-orange-500 text-white font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {p}
            </button>
          ))}
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center space-x-2 text-xs">
          <span className="text-slate-400">Sort By:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-orange-500"
          >
            <option value="SCORE">FLOUNA Match Score (High to Low)</option>
            <option value="PRICE_ASC">Price: Lowest First</option>
            <option value="RATING_DESC">Rating: Highest First</option>
            <option value="TIME_ASC">Delivery Time: Fastest First</option>
          </select>
        </div>
      </div>

      {/* Comparison Grid / Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-800/80 text-slate-400 font-semibold bg-slate-950/40">
              <th className="py-3 px-3">Rank / Match</th>
              <th className="py-3 px-3">Dish & Restaurant</th>
              <th className="py-3 px-3">Provider Source</th>
              <th className="py-3 px-3">Price</th>
              <th className="py-3 px-3">Rating</th>
              <th className="py-3 px-3">ETA</th>
              <th className="py-3 px-3">Special Deals & Cross-Platform</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {sortedOptions.map((opt, index) => {
              const isTop = index === 0;
              const hasCrossDeal = opt.isDeduplicated && opt.crossPlatformDeals;

              return (
                <tr
                  key={opt.id}
                  className={`hover:bg-slate-800/40 transition-colors ${
                    isTop ? 'bg-orange-500/5' : ''
                  }`}
                >
                  {/* Rank & Score */}
                  <td className="py-3.5 px-3">
                    <div className="flex items-center space-x-2">
                      <span className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-[11px] ${
                        isTop ? 'bg-orange-500 text-white' : 'bg-slate-800 text-slate-400'
                      }`}>
                        #{index + 1}
                      </span>
                      <span className="font-bold text-slate-200">
                        {opt.compositeScore}
                        <span className="text-[10px] text-slate-500 font-normal">/100</span>
                      </span>
                    </div>
                  </td>

                  {/* Dish & Restaurant */}
                  <td className="py-3.5 px-3">
                    <div>
                      <span className="font-semibold text-slate-100 block">
                        {opt.dishName}
                      </span>
                      <span className="text-slate-400 text-[11px]">
                        {opt.restaurantName} • {opt.location}
                      </span>
                      {opt.hasIncompleteData && (
                        <span className="inline-block mt-0.5 text-[10px] text-amber-400 bg-amber-500/10 px-1.5 py-0.2 rounded border border-amber-500/20">
                          Handled incomplete data ({opt.missingFields.join(', ')})
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Provider */}
                  <td className="py-3.5 px-3">
                    <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-slate-800/90 text-slate-300 border border-slate-700">
                      {opt.providerTag}
                    </span>
                  </td>

                  {/* Price */}
                  <td className="py-3.5 px-3">
                    <div>
                      <span className="font-bold text-emerald-400 text-sm">
                        ₹{opt.price}
                      </span>
                      {opt.originalPrice && opt.originalPrice > opt.price && (
                        <span className="text-[10px] text-slate-500 line-through ml-1.5">
                          ₹{opt.originalPrice}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Rating */}
                  <td className="py-3.5 px-3">
                    <div className="flex items-center space-x-1">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span className="font-bold text-slate-200">{opt.rating}</span>
                      <span className="text-[10px] text-slate-500">({opt.reviewCount})</span>
                    </div>
                  </td>

                  {/* ETA */}
                  <td className="py-3.5 px-3">
                    <div className="flex items-center space-x-1 text-slate-300">
                      <Clock className="w-3.5 h-3.5 text-blue-400" />
                      <span>{opt.deliveryTimeMinutes}m</span>
                    </div>
                  </td>

                  {/* Deals & Cross-Platform Savings */}
                  <td className="py-3.5 px-3">
                    {hasCrossDeal ? (
                      <div className="inline-block bg-purple-500/10 border border-purple-500/30 rounded-lg p-1.5">
                        <span className="text-purple-300 font-semibold block text-[10px]">
                          Duplicate on {opt.duplicateCount} platforms
                        </span>
                        {opt.crossPlatformDeals.potentialSavingsInr > 0 ? (
                          <span className="text-emerald-400 text-[10px] font-bold block">
                            Save ₹{opt.crossPlatformDeals.potentialSavingsInr} on {opt.crossPlatformDeals.cheapestProvider}!
                          </span>
                        ) : (
                          <span className="text-slate-400 text-[10px] block">
                            Identical pricing across sources
                          </span>
                        )}
                      </div>
                    ) : opt.specialOffer ? (
                      <span className="text-amber-300 text-[11px] font-medium">
                        {opt.specialOffer}
                      </span>
                    ) : (
                      <span className="text-slate-500 text-[11px]">-</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
