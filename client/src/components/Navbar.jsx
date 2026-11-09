import React, { useState } from 'react';
import { Flame, MapPin, ShoppingBag, Shield, ChevronDown, User, Heart } from 'lucide-react';

export default function Navbar({ cartCount = 0 }) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 py-3 flex items-center justify-between">
        {/* Brand / Logo + Location */}
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2.5 cursor-pointer">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center shadow-lg shadow-orange-500/20">
              <Flame className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="font-extrabold text-2xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-orange-400 bg-clip-text text-transparent">
                FLOUNA
              </span>
              <span className="text-[10px] block font-semibold text-orange-400 -mt-1 tracking-wider uppercase">
                Food Decision Engine
              </span>
            </div>
          </div>

          {/* Location Selector */}
          <div className="hidden md:flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs text-slate-300 hover:border-slate-600 cursor-pointer transition-colors">
            <MapPin className="w-3.5 h-3.5 text-orange-400" />
            <span className="font-semibold text-slate-200">Koramangala, Bengaluru</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </div>
        </div>

        {/* Right Nav: Offers, Cart, and Admin Rekha Profile */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          <div className="hidden sm:flex items-center space-x-4 text-xs font-medium text-slate-300 mr-2">
            <span className="cursor-pointer hover:text-orange-400 transition-colors">Top Offers</span>
            <span className="cursor-pointer hover:text-orange-400 transition-colors">Restaurants</span>
          </div>

          {/* Cart Button */}
          <button className="relative p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors flex items-center justify-center">
            <ShoppingBag className="w-4 h-4 text-orange-400" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-orange-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                {cartCount}
              </span>
            )}
          </button>

          {/* Admin Rekha Profile */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-slate-800 to-slate-800/80 hover:bg-slate-750 border border-slate-700 text-slate-200 transition-all cursor-pointer"
            >
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-orange-500 to-amber-600 flex items-center justify-center text-white font-bold text-xs shadow-sm">
                R
              </div>
              <div className="text-left hidden sm:block">
                <span className="text-xs font-bold text-slate-100 block leading-tight">Rekha</span>
                <span className="text-[10px] font-semibold text-emerald-400 uppercase tracking-wider block leading-none">Admin</span>
              </div>
              <ChevronDown className="w-3 h-3 text-slate-400 hidden sm:block" />
            </button>

            {/* Dropdown Menu */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl py-2 z-50 text-xs">
                <div className="px-4 py-2 border-b border-slate-800">
                  <p className="font-bold text-slate-200">Rekha</p>
                  <p className="text-[11px] text-emerald-400 font-semibold">Administrator</p>
                </div>
                <div className="py-1">
                  <a href="#orders" className="block px-4 py-2 text-slate-300 hover:bg-slate-800 hover:text-white">My Orders</a>
                  <a href="#favorites" className="block px-4 py-2 text-slate-300 hover:bg-slate-800 hover:text-white">Saved Restaurants</a>
                  <a href="#settings" className="block px-4 py-2 text-slate-300 hover:bg-slate-800 hover:text-white">Account Settings</a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
