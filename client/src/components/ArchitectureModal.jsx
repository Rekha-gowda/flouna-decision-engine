import React from 'react';
import { X, CheckCircle, ShieldCheck, Database, Cpu, Layers, GitCompare } from 'lucide-react';

export default function ArchitectureModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl bg-slate-900 border border-slate-700 shadow-2xl p-6 sm:p-8 text-slate-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-3 rounded-2xl bg-orange-500/20 text-orange-400 border border-orange-500/30">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white">
              Mini FLOUNA Decision Engine — System Architecture
            </h2>
            <p className="text-xs text-slate-400">
              Designed & Built by <span className="text-orange-400 font-semibold">G. Rekha</span> (Rekha-gowda) for Algorithic Technical Evaluation
            </p>
          </div>
        </div>

        {/* Content Sections */}
        <div className="space-y-6 text-xs sm:text-sm">
          {/* Section 1: NLP Entity Extraction */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
            <div className="flex items-center space-x-2 text-cyan-400 font-bold mb-2">
              <Cpu className="w-4 h-4" />
              <span>1. Semantic Entity Extraction (Zero Hallucination)</span>
            </div>
            <p className="text-slate-300 leading-relaxed mb-2">
              Extracts food item, diet tag (VEG/NON_VEG), budget constraint, delivery SLA, rating threshold, and Bangalore localities from free-form natural language.
            </p>
            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 font-mono text-[11px] text-emerald-400">
              Strict Principle: Missing information is kept strictly as null and never invented or hallucinated.
            </div>
          </div>

          {/* Section 2: Resilient Aggregation */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
            <div className="flex items-center space-x-2 text-rose-400 font-bold mb-2">
              <Database className="w-4 h-4" />
              <span>2. Multi-Provider Aggregation & Fault Tolerance</span>
            </div>
            <p className="text-slate-300 leading-relaxed mb-3">
              Aggregates across 3 distinct data sources with heterogeneous schemas:
            </p>
            <ul className="space-y-1.5 text-xs text-slate-400 mb-3 list-disc pl-5">
              <li><strong className="text-slate-200">ZestyBites API:</strong> Nested restaurant/menu payload with promotional percentages.</li>
              <li><strong className="text-slate-200">QuickFeast Express:</strong> Flat quick-commerce item inventory with travel minutes and coupon codes.</li>
              <li><strong className="text-slate-200">UrbanKitchen Network:</strong> ONDC distributed protocol schema with cloud kitchen listings.</li>
            </ul>
            <p className="text-slate-300 leading-relaxed">
              Implemented using <code className="text-orange-400 bg-slate-900 px-1 py-0.5 rounded">Promise.allSettled</code> with 2500ms SLA timeouts. If any provider experiences 503/504 gateway errors or socket timeouts, the decision engine degrades gracefully and continues serving recommendations from surviving providers.
            </p>
          </div>

          {/* Section 3: Deduplication */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
            <div className="flex items-center space-x-2 text-purple-400 font-bold mb-2">
              <GitCompare className="w-4 h-4" />
              <span>3. Cross-Platform Deduplication & Arbitrage</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              Uses Jaccard token overlap similarity on restaurant names and dish titles to detect duplicate offerings listed on multiple food aggregators. Groups identical items and highlights instant consumer savings (e.g. Behrouz Biryani cheaper on UrbanKitchen vs ZestyBites).
            </p>
          </div>

          {/* Section 4: Multi-Criteria Utility Ranking */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
            <div className="flex items-center space-x-2 text-amber-400 font-bold mb-2">
              <ShieldCheck className="w-4 h-4" />
              <span>4. Multi-Attribute Utility Ranking (Quality &gt; Dirt Cheap)</span>
            </div>
            <p className="text-slate-300 leading-relaxed mb-2">
              Balances 4 key utility dimensions with dynamic weights tailored to the user's explicit query:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3 text-center text-xs">
              <div className="p-2 rounded bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Quality & Trust</span>
                <span className="font-bold text-orange-400">35% - 45%</span>
              </div>
              <div className="p-2 rounded bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Delivery Speed</span>
                <span className="font-bold text-blue-400">25% - 35%</span>
              </div>
              <div className="p-2 rounded bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Price & Value</span>
                <span className="font-bold text-emerald-400">15% - 25%</span>
              </div>
              <div className="p-2 rounded bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Intent Match</span>
                <span className="font-bold text-purple-400">20%</span>
              </div>
            </div>
            <p className="text-slate-300 text-xs">
              Prevents the trap of naive cheapness: a low-cost ₹140 biryani with 3.4★ rating and 45-min ETA is rightfully beaten by a superior 4.8★ option at ₹290 arriving in 20 minutes!
            </p>
          </div>

          {/* Footer note */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-800 text-xs text-slate-500">
            <span>Author: G. Rekha | Algorithic Private Limited Evaluation</span>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold"
            >
              Close Specifications
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
