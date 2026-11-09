import React, { useState } from 'react';
import { Flame, MapPin, ShoppingBag, Shield, ChevronDown, User, LogOut, Package, Users, Tag, Utensils, LogIn } from 'lucide-react';

export default function Navbar({
  cartCount = 0,
  currentUser,
  onLogout,
  onOpenAuth,
  onOpenCart,
  onOpenOrders,
  onOpenOffers,
  onOpenRestaurants,
  onOpenAdminUsers
}) {
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

        {/* Right Nav: Offers, Restaurants, Cart, User Account */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* Top Offers Tab */}
          <button
            onClick={onOpenOffers}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl hover:bg-slate-800 text-xs font-semibold text-slate-300 hover:text-orange-400 transition-colors cursor-pointer"
          >
            <Tag className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Top Offers</span>
          </button>

          {/* Restaurants Tab */}
          <button
            onClick={onOpenRestaurants}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl hover:bg-slate-800 text-xs font-semibold text-slate-300 hover:text-orange-400 transition-colors cursor-pointer"
          >
            <Utensils className="w-3.5 h-3.5 text-orange-400" />
            <span className="hidden sm:inline">Restaurants</span>
          </button>

          {/* Orders Quick Tab */}
          <button
            onClick={onOpenOrders}
            className="hidden sm:flex items-center space-x-1 px-3 py-1.5 rounded-xl hover:bg-slate-800 text-xs font-semibold text-slate-300 hover:text-orange-400 transition-colors cursor-pointer"
          >
            <Package className="w-3.5 h-3.5 text-blue-400" />
            <span>Orders</span>
          </button>

          {/* Cart Button */}
          <button
            onClick={onOpenCart}
            className="relative p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors flex items-center justify-center cursor-pointer shadow-sm"
          >
            <ShoppingBag className="w-4 h-4 text-orange-400" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-orange-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                {cartCount}
              </span>
            )}
          </button>

          {/* User Authentication / Profile Area */}
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-200 transition-all cursor-pointer"
              >
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-white font-bold text-xs shadow-sm ${
                  currentUser.role === 'admin'
                    ? 'bg-gradient-to-tr from-orange-500 to-amber-600'
                    : 'bg-gradient-to-tr from-blue-500 to-indigo-600'
                }`}>
                  {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="text-left hidden sm:block">
                  <span className="text-xs font-bold text-slate-100 block leading-tight truncate max-w-[90px]">
                    {currentUser.name}
                  </span>
                  <span className={`text-[10px] font-semibold uppercase tracking-wider block leading-none ${
                    currentUser.role === 'admin' ? 'text-emerald-400' : 'text-blue-400'
                  }`}>
                    {currentUser.role}
                  </span>
                </div>
                <ChevronDown className="w-3 h-3 text-slate-400 hidden sm:block" />
              </button>

              {/* Profile Dropdown */}
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl py-2 z-50 text-xs">
                  <div className="px-4 py-2 border-b border-slate-800">
                    <p className="font-bold text-slate-100">{currentUser.name}</p>
                    <p className="text-[11px] text-slate-400 truncate">{currentUser.email}</p>
                    <span className={`inline-block mt-1 text-[9px] font-bold px-2 py-0.2 rounded-full uppercase border ${
                      currentUser.role === 'admin'
                        ? 'bg-orange-500/10 text-orange-400 border-orange-500/20'
                        : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                    }`}>
                      {currentUser.role} Account
                    </span>
                  </div>

                  <div className="py-1">
                    <button
                      onClick={() => { setShowProfileMenu(false); onOpenOrders(); }}
                      className="w-full text-left px-4 py-2 text-slate-300 hover:bg-slate-800 hover:text-white flex items-center space-x-2 cursor-pointer"
                    >
                      <Package className="w-3.5 h-3.5 text-blue-400" />
                      <span>My Orders</span>
                    </button>

                    {/* Admin Portal option only if Admin */}
                    {currentUser.role === 'admin' && (
                      <button
                        onClick={() => { setShowProfileMenu(false); onOpenAdminUsers(); }}
                        className="w-full text-left px-4 py-2 text-orange-400 hover:bg-orange-500/10 font-semibold flex items-center space-x-2 cursor-pointer"
                      >
                        <Users className="w-3.5 h-3.5" />
                        <span>Admin: View Registered Users</span>
                      </button>
                    )}

                    <button
                      onClick={() => { setShowProfileMenu(false); onLogout(); }}
                      className="w-full text-left px-4 py-2 text-rose-400 hover:bg-slate-800 flex items-center space-x-2 cursor-pointer border-t border-slate-800/80 mt-1"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs shadow-md shadow-orange-500/20 flex items-center space-x-1.5 transition-all cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
