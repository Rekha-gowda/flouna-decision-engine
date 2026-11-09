import React from 'react';
import { Search, Sparkles, SlidersHorizontal, ArrowRight, Loader2, RefreshCw } from 'lucide-react';

export default function HeroSearch({
  query,
  setQuery,
  onSearch,
  isLoading,
  showSimControls,
  setShowSimControls,
  simulationOptions
}) {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query, simulationOptions);
    }
  };

  const activeSimCount = Object.keys(simulationOptions || {}).filter(k => simulationOptions[k]).length;

  return (
    <div className="relative mb-8">
      {/* Search Container */}
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative flex items-center">
          <div className="absolute left-4 pointer-events-none text-slate-400">
            <Search className="w-5 h-5 text-orange-400" />
          </div>

          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. Find me a vegetarian biryani under ₹300 that can arrive within 30 minutes..."
            className="w-full pl-12 pr-36 sm:pr-44 py-4 rounded-2xl bg-slate-900/90 text-slate-100 placeholder-slate-500 border border-slate-700/80 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 shadow-2xl transition-all text-sm sm:text-base"
          />

          <div className="absolute right-2 flex items-center space-x-1.5 sm:space-x-2">
            {/* Simulation controls toggle */}
            <button
              type="button"
              onClick={() => setShowSimControls(!showSimControls)}
              title="Toggle Failure & Network Simulation Controls"
              className={`p-2.5 rounded-xl border transition-all flex items-center space-x-1 ${
                activeSimCount > 0
                  ? 'bg-rose-500/10 border-rose-500/40 text-rose-400'
                  : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-slate-200'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              {activeSimCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
              )}
            </button>

            {/* Run Decision button */}
            <button
              type="submit"
              disabled={isLoading || !query.trim()}
              className="px-4 sm:px-6 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-orange-500/25 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="hidden sm:inline">Evaluating...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Decide</span>
                  <ArrowRight className="w-4 h-4 hidden sm:inline" />
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Popular Query Chips */}
      <div className="flex items-center flex-wrap gap-2 mt-3 text-xs">
        <span className="text-slate-500 font-medium">Try asking:</span>
        {[
          'Paneer biryani under ₹300 in 30 mins',
          'Spicy Pizza in Koramangala',
          'North Indian Thali under 250',
          'Hyderabadi chicken biryani in 45 mins'
        ].map((chip) => (
          <button
            key={chip}
            type="button"
            onClick={() => {
              setQuery(chip);
              onSearch(chip, simulationOptions);
            }}
            className="px-2.5 py-1 rounded-lg bg-slate-900/60 hover:bg-slate-800 text-slate-400 hover:text-orange-400 border border-slate-800 transition-all"
          >
            {chip}
          </button>
        ))}
      </div>
    </div>
  );
}
