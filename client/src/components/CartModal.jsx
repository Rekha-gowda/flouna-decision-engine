import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, CheckCircle, Tag, MapPin, Loader2 } from 'lucide-react';

export default function CartModal({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  currentUser,
  onOrderPlaced,
  appliedCoupon,
  setAppliedCoupon
}) {
  const [address, setAddress] = useState('Flat 402, Green Glen Layout, Koramangala, Bengaluru');
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState(null);
  const [couponSuccess, setCouponSuccess] = useState(null);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  if (!isOpen) return null;

  // Calculate pricing
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  // Discount logic
  let discount = 0;
  if (appliedCoupon === 'FLOUNA50') {
    discount = Math.min(Math.round(subtotal * 0.5), 100);
  } else if (appliedCoupon === 'FREESHIP') {
    discount = 25;
  } else if (appliedCoupon === 'ZESTY20') {
    discount = Math.min(Math.round(subtotal * 0.2), 60);
  } else if (appliedCoupon === 'PIZZA40') {
    discount = Math.min(40, subtotal);
  }

  const deliveryFee = (subtotal >= 199 || appliedCoupon === 'FREESHIP') ? 0 : 25;
  const grandTotal = Math.max(0, subtotal - discount + deliveryFee);

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    setCouponError(null);
    setCouponSuccess(null);
    const code = couponInput.trim().toUpperCase();

    const validCoupons = ['FLOUNA50', 'FREESHIP', 'ZESTY20', 'PIZZA40', 'ONDC10'];
    if (validCoupons.includes(code)) {
      setAppliedCoupon(code);
      setCouponSuccess(`Coupon "${code}" applied successfully!`);
    } else {
      setCouponError('Invalid coupon code. Try FLOUNA50 or FREESHIP');
    }
  };

  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) return;
    setIsPlacingOrder(true);

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cartItems,
          userEmail: currentUser ? currentUser.email : 'guest@flouna.com',
          userName: currentUser ? currentUser.name : 'Guest User',
          subtotal,
          discount,
          deliveryFee,
          total: grandTotal,
          deliveryAddress: address
        })
      });

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || 'Failed to place order');
      }

      onClearCart();
      onOrderPlaced(data.order);
      onClose();
    } catch (err) {
      alert(err.message || 'Error placing order');
    } finally {
      setIsPlacingOrder(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md h-full bg-slate-900 border-l border-slate-700 shadow-2xl flex flex-col text-slate-100">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-orange-500/20 text-orange-400">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white">Your Cart</h3>
              <p className="text-xs text-slate-400">{cartItems.length} items from restaurants</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3.5">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
              <ShoppingBag className="w-12 h-12 text-slate-600 mb-3" />
              <p className="text-sm font-semibold text-slate-300">Your cart is empty</p>
              <p className="text-xs text-slate-500 mt-1">Explore delicious dishes and add them to your cart!</p>
            </div>
          ) : (
            cartItems.map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-center justify-between gap-3"
              >
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs sm:text-sm font-bold text-white truncate">{item.dishName}</h4>
                  <p className="text-[11px] text-slate-400 truncate">{item.restaurantName}</p>
                  <span className="text-xs font-black text-emerald-400 mt-0.5 block">
                    ₹{item.price * item.quantity}
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1.5 bg-slate-900 border border-slate-700/80 rounded-lg p-1">
                    <button
                      onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                      className="p-1 hover:text-orange-400 text-slate-300 transition-colors cursor-pointer"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-xs font-bold px-1.5 text-slate-100">{item.quantity}</span>
                    <button
                      onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                      className="p-1 hover:text-orange-400 text-slate-300 transition-colors cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  <button
                    onClick={() => onRemoveItem(item.id)}
                    className="p-1.5 text-slate-500 hover:text-rose-400 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}

          {cartItems.length > 0 && (
            <>
              {/* Delivery Address */}
              <div className="mt-4 p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 text-xs">
                <div className="flex items-center space-x-1.5 text-orange-400 font-semibold mb-1.5">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Delivery Address</span>
                </div>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-200 text-xs focus:border-orange-500 focus:outline-none"
                />
              </div>

              {/* Coupon Section */}
              <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 text-xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-slate-300 flex items-center space-x-1">
                    <Tag className="w-3.5 h-3.5 text-amber-400" />
                    <span>Apply Coupon</span>
                  </span>
                  {appliedCoupon && (
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      {appliedCoupon} APPLIED
                    </span>
                  )}
                </div>

                <form onSubmit={handleApplyCoupon} className="flex space-x-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder="e.g. FLOUNA50"
                    className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 uppercase text-xs focus:border-orange-500 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs cursor-pointer"
                  >
                    Apply
                  </button>
                </form>

                {couponError && <p className="text-[10px] text-rose-400 mt-1">{couponError}</p>}
                {couponSuccess && <p className="text-[10px] text-emerald-400 mt-1">{couponSuccess}</p>}
              </div>

              {/* Bill Details */}
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs space-y-2">
                <div className="flex justify-between text-slate-400">
                  <span>Item Subtotal</span>
                  <span className="text-slate-200 font-semibold">₹{subtotal}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-emerald-400 font-semibold">
                    <span>Coupon Discount</span>
                    <span>-₹{discount}</span>
                  </div>
                )}

                <div className="flex justify-between text-slate-400">
                  <span>Delivery Partner Fee</span>
                  <span className={deliveryFee === 0 ? "text-emerald-400 font-semibold" : "text-slate-200 font-semibold"}>
                    {deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}
                  </span>
                </div>

                <div className="pt-2 border-t border-slate-800 flex justify-between text-sm font-black text-white">
                  <span>Total Amount</span>
                  <span className="text-emerald-400 text-base">₹{grandTotal}</span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer: Order Button */}
        {cartItems.length > 0 && (
          <div className="p-5 border-t border-slate-800 bg-slate-950">
            <button
              onClick={handlePlaceOrder}
              disabled={isPlacingOrder}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black text-sm shadow-xl shadow-orange-500/25 flex items-center justify-center space-x-2 transition-all cursor-pointer disabled:opacity-50"
            >
              {isPlacingOrder ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Confirming Order...</span>
                </>
              ) : (
                <>
                  <span>Place Order • ₹{grandTotal}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
