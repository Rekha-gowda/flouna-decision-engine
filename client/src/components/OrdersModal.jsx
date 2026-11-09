import React, { useState, useEffect } from 'react';
import { X, Package, Clock, CheckCircle2, MapPin, ChefHat, Bike, Loader2, ArrowRight } from 'lucide-react';

export default function OrdersModal({ isOpen, onClose, currentUser }) {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const email = currentUser ? currentUser.email : '';
      const role = currentUser ? currentUser.role : '';
      const res = await fetch(`/api/orders?email=${encodeURIComponent(email)}&role=${role}`);
      const data = await res.json();
      if (data.success) {
        setOrders(data.orders || []);
      }
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchOrders();
    }
  }, [isOpen, currentUser]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[85vh] rounded-3xl bg-slate-900 border border-slate-700 shadow-2xl p-6 sm:p-8 flex flex-col text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-orange-500/20 text-orange-400">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-white">Your Orders</h3>
              <p className="text-xs text-slate-400">
                {currentUser ? `Tracking live orders for ${currentUser.name}` : 'All recent orders'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Orders List */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
          {isLoading ? (
            <div className="py-12 flex flex-col items-center justify-center text-slate-400">
              <Loader2 className="w-8 h-8 animate-spin text-orange-400 mb-2" />
              <p className="text-xs">Loading order status...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <Package className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="text-sm font-semibold text-slate-300">No orders placed yet</p>
              <p className="text-xs text-slate-500 mt-1">Once you order, track your food delivery here in real-time!</p>
            </div>
          ) : (
            orders.map((ord) => (
              <div
                key={ord.id}
                className="p-4 sm:p-5 rounded-2xl bg-slate-950/70 border border-slate-800 shadow-md"
              >
                {/* Order Top Bar */}
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3 pb-3 border-b border-slate-800/80">
                  <div>
                    <span className="text-xs font-mono font-bold text-orange-400">{ord.id}</span>
                    <span className="text-slate-500 text-xs ml-2">
                      {new Date(ord.createdAt).toLocaleDateString()} at {new Date(ord.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${
                    ord.status.includes('Delivered')
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      : 'bg-orange-500/10 text-orange-400 border-orange-500/30 animate-pulse'
                  }`}>
                    ● {ord.status}
                  </span>
                </div>

                {/* Items */}
                <div className="space-y-1.5 mb-3 text-xs">
                  {ord.items?.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-slate-300">
                      <span>
                        <strong className="text-white">{item.quantity}x</strong> {item.dishName}
                        <span className="text-slate-500 text-[11px] ml-1">({item.restaurantName})</span>
                      </span>
                      <span className="font-semibold text-slate-200">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>

                {/* Tracking Progress */}
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 mb-3 text-[11px]">
                  <div className="flex items-center justify-between text-slate-400 mb-2">
                    <span className="flex items-center text-orange-400 font-semibold">
                      <ChefHat className="w-3.5 h-3.5 mr-1" /> Kitchen Prep
                    </span>
                    <span className="flex items-center text-blue-400 font-semibold">
                      <Bike className="w-3.5 h-3.5 mr-1" /> On The Way
                    </span>
                    <span className="flex items-center text-emerald-400 font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Delivered
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-orange-500 to-emerald-500 h-full rounded-full" style={{ width: ord.status.includes('Delivered') ? '100%' : '65%' }}></div>
                  </div>
                </div>

                {/* Total and Address */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 text-xs">
                  <div className="flex items-center text-slate-400">
                    <MapPin className="w-3 h-3 text-orange-400 mr-1 shrink-0" />
                    <span className="truncate max-w-[240px]">{ord.deliveryAddress}</span>
                  </div>

                  <div className="text-right">
                    <span className="text-slate-400 mr-2">Paid:</span>
                    <span className="text-sm font-black text-emerald-400">₹{ord.total}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
