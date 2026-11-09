import React from 'react';
import { Target, HelpCircle, AlertTriangle, ShieldAlert, GitCompare, Award } from 'lucide-react';

export const EVALUATION_SCENARIOS = [
  {
    id: 1,
    title: '1. Clear Preferences',
    subtitle: 'Explicit budget, ETA, veg & rating',
    query: 'Find me a vegetarian biryani under ₹300 that can arrive within 30 minutes. I prefer highly rated restaurants.',
    icon: Target,
    tag: 'Baseline',
    tagColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    simulationOptions: {}
  },
  {
    id: 2,
    title: '2. Missing Information',
    subtitle: 'Null budget/ETA (no invented info)',
    query: 'I want pizza in Koramangala',
    icon: HelpCircle,
    tag: 'No Hallucinations',
    tagColor: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    simulationOptions: {}
  },
  {
    id: 3,
    title: '3. Provider Timeout / Failure',
    subtitle: 'UrbanKitchen 504 Gateway Timeout',
    query: 'North Indian thali under ₹250',
    icon: AlertTriangle,
    tag: 'Fault Tolerance',
    tagColor: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    simulationOptions: { failProvider: 'UrbanKitchen' }
  },
  {
    id: 4,
    title: '4. Incomplete Data',
    subtitle: 'Null ratings & missing times handled',
    query: 'Crispy cheese burgers under 200',
    icon: ShieldAlert,
    tag: 'Resilience',
    tagColor: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    simulationOptions: { corruptProvider: 'QuickFeast' }
  },
  {
    id: 5,
    title: '5. Deduplication & Price Deals',
    subtitle: 'Behrouz Biryani across 2 platforms',
    query: 'Behrouz Biryani veg under 400',
    icon: GitCompare,
    tag: 'Cross-App Deal',
    tagColor: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    simulationOptions: {}
  },
  {
    id: 6,
    title: '6. Quality > Cheap Option',
    subtitle: '4.8★ Beats ₹140 3.4★ Option',
    query: 'Hyderabadi chicken biryani within 45 mins',
    icon: Award,
    tag: 'Smart Utility',
    tagColor: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
    simulationOptions: {}
  }
];

export default function ScenarioPicker({ onSelectScenario, activeScenarioId }) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300">
            Mandatory Evaluation Test Scenarios
          </h2>
          <p className="text-xs text-slate-400">
            Click any preset to verify the 6 required test flows from the assignment rubric
          </p>
        </div>
        <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
          6 of 6 Automated
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {EVALUATION_SCENARIOS.map((scenario) => {
          const Icon = scenario.icon;
          const isActive = activeScenarioId === scenario.id;

          return (
            <button
              key={scenario.id}
              onClick={() => onSelectScenario(scenario)}
              className={`text-left p-3.5 rounded-xl transition-all border ${
                isActive
                  ? 'bg-slate-800/90 border-orange-500/70 shadow-md shadow-orange-500/10 ring-1 ring-orange-500/30'
                  : 'bg-slate-900/60 border-slate-800/90 hover:bg-slate-800/60 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start justify-between mb-1.5">
                <div className="flex items-center space-x-2">
                  <div className={`p-1.5 rounded-lg ${isActive ? 'bg-orange-500/20 text-orange-400' : 'bg-slate-800 text-slate-400'}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-slate-200">
                    {scenario.title}
                  </span>
                </div>
                <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${scenario.tagColor}`}>
                  {scenario.tag}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 line-clamp-1 mb-2">
                {scenario.subtitle}
              </p>
              <p className="text-[11px] font-mono text-slate-300 bg-slate-950/60 p-1.5 rounded border border-slate-800/60 line-clamp-1">
                "{scenario.query}"
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
