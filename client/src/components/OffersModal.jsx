import React, { useState, useEffect } from 'react';
import { X, Tag, Sparkles, Copy, Check, Clock, ArrowRight } from 'lucide-react';

export default function OffersModal({ isOpen, onClose, onApplyCoupon }) {
  const [offers, setOffers] = useState([]);
  const [copiedCode, setCopiedCode] = useState(null);

  useEffect(() => {
    if (isOpen) {
      fetch('/api/offers')
        .then(res => res.json())
        .then(data => {
          if (data.success) setOffers(data.offers);
        })
        .catch(err => console.error('Failed to load offers:', err));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCopyAndApply = (code) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    if (onApplyCoupon) {
      onApplyCoupon(code);
    }
    setTimeout(() => setCopiedCode(null), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[85vh] rounded-3xl bg-slate-900 border border-slate-700 shadow-2xl p-6 sm:p-8 flex flex-col text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-orange-500/20 text-orange-400">
              <Tag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-white">Top Offers & Promo Coupons</h3>
              <p className="text-xs text-slate-400">Exclusive food delivery deals in Bengaluru</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Offers Grid */}
        <div className="flex-1 overflow-y-auto py-4 space-y-3 pr-1">
          {offers.map((offer) => (
            <div
              key={offer.id}
              className="p-4 sm:p-5 rounded-2xl bg-slate-950/70 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-slate-700 transition-all"
            >
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-black uppercase tracking-wider text-orange-400">
                    {offer.title}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                    {offer.badge}
                  </span>
                </div>
                <p className="text-xs text-slate-300">{offer.description}</p>
                <div className="flex items-center space-x-3 text-[11px] text-slate-400 pt-1">
                  <span>Min order: ₹{offer.minOrder}</span>
                  <span>•</span>
                  <span className="flex items-center text-amber-400">
                    <Clock className="w-3 h-3 mr-1" /> {offer.validTill}
                  </span>
                </div>
              </div>

              {/* Action Button */}
              <div className="flex items-center space-x-2 shrink-0">
                <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 font-mono text-xs font-bold text-white tracking-widest">
                  {offer.code}
                </div>

                <button
                  onClick={() => handleCopyAndApply(offer.code)}
                  className={`px-3.5 py-1.5 rounded-xl font-bold text-xs flex items-center space-x-1.5 transition-all cursor-pointer ${
                    copiedCode === offer.code
                      ? 'bg-emerald-500 text-white'
                      : 'bg-orange-500 hover:bg-orange-600 text-white shadow-md shadow-orange-500/20'
                  }`}
                >
                  {copiedCode === offer.code ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Applied!</span>
                    </>
                  ) : (
                    <span>Apply Coupon</span>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
