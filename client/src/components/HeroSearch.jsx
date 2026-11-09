import React from 'react';
import { Search, Sparkles, Flame, Clock, IndianRupee, Leaf, Loader2 } from 'lucide-react';

export default function HeroSearch({
  query,
  setQuery,
  onSearch,
  isLoading
}) {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
    }
  };

  const popularCravings = [
    { label: 'Paneer Biryani < ₹300', query: 'Vegetarian paneer biryani under ₹300 within 30 minutes' },
    { label: 'Spicy Pizza', query: 'Spicy cheese pizza in Koramangala' },
    { label: 'North Indian Thali', query: 'Deluxe North Indian veg thali under 250' },
    { label: 'Chicken Biryani in 45m', query: 'Hyderabadi chicken biryani within 45 mins' },
    { label: 'Cheese Burgers', query: 'Crispy cheese burgers under 200' }
  ];

  return (
    <div className="mb-10 text-center max-w-4xl mx-auto pt-4">
      {/* Real-World Consumer Headline */}
      <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-3">
        Order food you love, <br className="hidden sm:inline" />
        <span className="bg-gradient-to-r from-orange-400 via-amber-400 to-rose-400 bg-clip-text text-transparent">
          at the best price & speed.
        </span>
      </h1>
      
      <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto mb-6">
        Tell FLOUNA what you feel like eating. We instantly search restaurants across top food delivery networks to recommend the highest rated, fastest, and best value options.
      </p>

      {/* Modern Search Bar */}
      <form onSubmit={handleSubmit} className="relative max-w-3xl mx-auto mb-4">
        <div className="relative flex items-center shadow-2xl">
          <div className="absolute left-4.5 pointer-events-none text-orange-400">
            <Search className="w-5 h-5" />
          </div>

          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. Can I find pizza under 100 rupees, or vegetarian biryani under ₹300..."
            className="w-full pl-13 pr-36 sm:pr-44 py-4 sm:py-4.5 rounded-2xl bg-slate-900 text-slate-100 placeholder-slate-500 border-2 border-slate-700/80 focus:border-orange-500 focus:outline-none focus:ring-4 focus:ring-orange-500/15 text-sm sm:text-base transition-all"
          />

          <button
            type="submit"
            disabled={isLoading || !query.trim()}
            className="absolute right-2 px-5 sm:px-7 py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs sm:text-sm shadow-md shadow-orange-500/25 flex items-center space-x-2 disabled:opacity-50 transition-all cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="hidden sm:inline">Searching...</span>
              </>
            ) : (
              <>
                <Flame className="w-4 h-4 fill-white" />
                <span>Search</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Popular Craving Chips */}
      <div className="flex items-center justify-center flex-wrap gap-2 text-xs">
        <span className="text-slate-400 font-medium">Popular:</span>
        {popularCravings.map((item) => (
          <button
            key={item.label}
            type="button"
            onClick={() => {
              setQuery(item.query);
              onSearch(item.query);
            }}
            className="px-3 py-1.5 rounded-full bg-slate-800/80 hover:bg-slate-750 text-slate-300 hover:text-orange-400 border border-slate-700/80 hover:border-orange-500/40 transition-all cursor-pointer"
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}
