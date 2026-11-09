import React, { useState, useEffect } from 'react';
import { X, Utensils, Star, Clock, MapPin, Plus, Check, ChevronDown, ChevronUp } from 'lucide-react';

export default function RestaurantsModal({ isOpen, onClose, onAddToCart }) {
  const [restaurants, setRestaurants] = useState([]);
  const [selectedResId, setSelectedResId] = useState(null);

  useEffect(() => {
    if (isOpen) {
      fetch('/api/restaurants')
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setRestaurants(data.restaurants);
            if (data.restaurants.length > 0 && !selectedResId) {
              setSelectedResId(data.restaurants[0].id);
            }
          }
        })
        .catch(err => console.error('Failed to load restaurants:', err));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const activeRes = restaurants.find(r => r.id === selectedResId) || restaurants[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[90vh] rounded-3xl bg-slate-900 border border-slate-700 shadow-2xl p-6 sm:p-8 flex flex-col text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-orange-500/20 text-orange-400">
              <Utensils className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-white">Partner Restaurants & Live Menus</h3>
              <p className="text-xs text-slate-400">Explore full menus and add dishes directly to your cart</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Layout: Left Restaurants list, Right Menu list */}
        <div className="flex-1 overflow-hidden grid grid-cols-1 md:grid-cols-12 gap-5 pt-4">
          {/* Restaurant Selector Tabs */}
          <div className="md:col-span-4 overflow-y-auto space-y-2 pr-1">
            {restaurants.map((res) => {
              const isSelected = res.id === selectedResId;
              return (
                <button
                  key={res.id}
                  onClick={() => setSelectedResId(res.id)}
                  className={`w-full text-left p-3 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-slate-800 border-orange-500 shadow-md ring-1 ring-orange-500/30'
                      : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xs text-white truncate">{res.name}</span>
                    <span className="text-sm">{res.imageEmoji}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-1">{res.cuisine.join(', ')}</p>
                  <div className="flex items-center space-x-2 text-[10px] text-slate-400 mt-1.5">
                    <span className="text-amber-400 font-bold flex items-center">
                      <Star className="w-3 h-3 fill-amber-400 mr-0.5" /> {res.rating}
                    </span>
                    <span>•</span>
                    <span className="flex items-center text-blue-400">
                      <Clock className="w-3 h-3 mr-0.5" /> {res.etaMinutes}m
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Restaurant Menu Items */}
          <div className="md:col-span-8 overflow-y-auto space-y-3 pr-1">
            {activeRes && (
              <div>
                <div className="mb-4 p-4 rounded-2xl bg-gradient-to-r from-slate-950 to-slate-900 border border-slate-800">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-base font-extrabold text-white">{activeRes.name}</h4>
                    <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
                      {activeRes.activeOffer}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 flex items-center">
                    <MapPin className="w-3 h-3 text-orange-400 mr-1" />
                    {activeRes.location} • ₹{activeRes.priceForTwo} for two
                  </p>
                </div>

                <div className="space-y-3">
                  {activeRes.menu.map((dish) => (
                    <div
                      key={dish.id}
                      className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-center justify-between gap-4 hover:border-slate-700 transition-all"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className={`w-2.5 h-2.5 rounded-full ${dish.isVeg ? 'bg-emerald-400' : 'bg-rose-400'}`}></span>
                          <span className="text-xs font-bold text-white">{dish.name}</span>
                          <span className="text-[10px] text-amber-400 font-bold flex items-center">
                            <Star className="w-2.5 h-2.5 fill-amber-400 mr-0.5" /> {dish.rating}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 line-clamp-2">{dish.description}</p>
                        <span className="text-xs font-black text-emerald-400 block pt-0.5">₹{dish.price}</span>
                      </div>

                      <button
                        onClick={() => onAddToCart({
                          id: `${activeRes.id}_${dish.id}`,
                          dishName: dish.name,
                          restaurantName: activeRes.name,
                          price: dish.price,
                          location: activeRes.location
                        })}
                        className="px-3.5 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs flex items-center space-x-1 shrink-0 shadow-md shadow-orange-500/20 transition-all cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
