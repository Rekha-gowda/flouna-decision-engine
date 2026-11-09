import React, { useState } from 'react';
import { Cpu, ChevronDown, ChevronUp, Check, AlertCircle, ShieldCheck } from 'lucide-react';

export default function ExtractedIntentCard({ userRequirements }) {
  const [showJson, setShowJson] = useState(false);

  if (!userRequirements) return null;

  const {
    food_item,
    dietary_preference,
    max_budget,
    max_delivery_time,
    min_rating,
    location,
    explicit_preferences = []
  } = userRequirements;

  return (
    <div className="mb-8 p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-cyan-500/20 to-blue-500/20 text-cyan-400 border border-cyan-500/30">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                Step 1: Extracted User Requirements (NLP)
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center space-x-1">
                <ShieldCheck className="w-3 h-3" />
                <span>Zero Hallucination</span>
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Parsed from natural language query into structured schema (null for unstated attributes)
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowJson(!showJson)}
          className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center space-x-1 px-2.5 py-1 rounded bg-slate-800/80 border border-slate-700"
        >
          <span>{showJson ? 'Hide JSON' : 'View JSON'}</span>
          {showJson ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Structured Extracted Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
        {/* Food Item */}
        <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
          <span className="text-[10px] uppercase font-semibold text-slate-400 block mb-0.5">Dish / Food</span>
          <span className="text-xs font-bold text-slate-200 capitalize">
            {food_item || <span className="text-slate-600 font-mono">null (Any)</span>}
          </span>
        </div>

        {/* Dietary Tag */}
        <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
          <span className="text-[10px] uppercase font-semibold text-slate-400 block mb-0.5">Dietary Tag</span>
          <span className={`text-xs font-bold ${
            dietary_preference === 'VEG' ? 'text-emerald-400' :
            dietary_preference === 'NON_VEG' ? 'text-rose-400' : 'text-slate-600 font-mono'
          }`}>
            {dietary_preference || 'null (No filter)'}
          </span>
        </div>

        {/* Max Budget */}
        <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
          <span className="text-[10px] uppercase font-semibold text-slate-400 block mb-0.5">Budget Cap</span>
          <span className="text-xs font-bold text-amber-400">
            {max_budget ? `₹${max_budget}` : <span className="text-slate-600 font-mono">null (Flexible)</span>}
          </span>
        </div>

        {/* Max Delivery Time */}
        <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
          <span className="text-[10px] uppercase font-semibold text-slate-400 block mb-0.5">Delivery SLA</span>
          <span className="text-xs font-bold text-blue-400">
            {max_delivery_time ? `≤ ${max_delivery_time} mins` : <span className="text-slate-600 font-mono">null (Any time)</span>}
          </span>
        </div>

        {/* Min Rating */}
        <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
          <span className="text-[10px] uppercase font-semibold text-slate-400 block mb-0.5">Rating Preference</span>
          <span className="text-xs font-bold text-orange-400">
            {min_rating ? `≥ ${min_rating}★` : <span className="text-slate-600 font-mono">null (Standard)</span>}
          </span>
        </div>

        {/* Location */}
        <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
          <span className="text-[10px] uppercase font-semibold text-slate-400 block mb-0.5">Area / Locality</span>
          <span className="text-xs font-bold text-purple-400">
            {location || <span className="text-slate-600 font-mono">null (All City)</span>}
          </span>
        </div>
      </div>

      {/* Raw JSON viewer */}
      {showJson && (
        <div className="mt-4 p-3 rounded-xl bg-slate-950 border border-slate-800">
          <pre className="text-xs font-mono text-cyan-300 overflow-x-auto">
            {JSON.stringify(userRequirements, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
