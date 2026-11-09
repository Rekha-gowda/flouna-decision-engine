import React from 'react';
import { ShieldAlert, RefreshCcw, WifiOff, Clock, FileWarning, CheckCircle } from 'lucide-react';

export default function SimulationControls({
  simulationOptions,
  setSimulationOptions,
  onApply
}) {
  const handleToggle = (key, value) => {
    setSimulationOptions(prev => {
      const next = { ...prev };
      if (next[key] === value) {
        delete next[key];
      } else {
        next[key] = value;
      }
      return next;
    });
  };

  const resetAll = () => {
    setSimulationOptions({});
  };

  const isSimulating = Object.keys(simulationOptions).length > 0;

  return (
    <div className="mb-8 p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-orange-500/10 text-orange-400">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              Fault Injection & Edge Case Simulator
            </h3>
            <p className="text-[11px] text-slate-400">
              Test system resilience against network timeouts, HTTP 500s, and corrupt payload fields
            </p>
          </div>
        </div>

        {isSimulating && (
          <button
            onClick={resetAll}
            className="flex items-center space-x-1 text-xs text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-800 border border-slate-700"
          >
            <RefreshCcw className="w-3 h-3" />
            <span>Reset Normal</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Fail Provider */}
        <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
          <div className="flex items-center space-x-2 mb-2 text-xs font-semibold text-rose-400">
            <WifiOff className="w-3.5 h-3.5" />
            <span>Simulate Provider Failure</span>
          </div>
          <div className="space-y-1.5">
            {['UrbanKitchen', 'QuickFeast', 'ZestyBites'].map((p) => {
              const active = simulationOptions.failProvider === p;
              return (
                <button
                  key={p}
                  onClick={() => handleToggle('failProvider', p)}
                  className={`w-full text-left px-2.5 py-1.5 rounded text-xs transition-all flex items-center justify-between ${
                    active
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 font-semibold'
                      : 'bg-slate-900/80 text-slate-400 hover:bg-slate-800 border border-slate-800'
                  }`}
                >
                  <span>{p} (503 / 504 Fail)</span>
                  {active && <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>}
                </button>
              );
            })}
          </div>
        </div>

        {/* Timeout Provider */}
        <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
          <div className="flex items-center space-x-2 mb-2 text-xs font-semibold text-amber-400">
            <Clock className="w-3.5 h-3.5" />
            <span>Simulate Network SLA Timeout</span>
          </div>
          <div className="space-y-1.5">
            {['UrbanKitchen', 'QuickFeast'].map((p) => {
              const active = simulationOptions.timeoutProvider === p;
              return (
                <button
                  key={p}
                  onClick={() => handleToggle('timeoutProvider', p)}
                  className={`w-full text-left px-2.5 py-1.5 rounded text-xs transition-all flex items-center justify-between ${
                    active
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-semibold'
                      : 'bg-slate-900/80 text-slate-400 hover:bg-slate-800 border border-slate-800'
                  }`}
                >
                  <span>{p} (3000ms SLA Breach)</span>
                  {active && <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>}
                </button>
              );
            })}
          </div>
        </div>

        {/* Corrupted Incomplete Data */}
        <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
          <div className="flex items-center space-x-2 mb-2 text-xs font-semibold text-purple-400">
            <FileWarning className="w-3.5 h-3.5" />
            <span>Corrupt / Incomplete Data</span>
          </div>
          <div className="space-y-1.5">
            {['QuickFeast'].map((p) => {
              const active = simulationOptions.corruptProvider === p;
              return (
                <button
                  key={p}
                  onClick={() => handleToggle('corruptProvider', p)}
                  className={`w-full text-left px-2.5 py-1.5 rounded text-xs transition-all flex items-center justify-between ${
                    active
                      ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 font-semibold'
                      : 'bg-slate-900/80 text-slate-400 hover:bg-slate-800 border border-slate-800'
                  }`}
                >
                  <span>{p} (Null Ratings & ETAs)</span>
                  {active && <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
