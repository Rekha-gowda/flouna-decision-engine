import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import ScenarioPicker, { EVALUATION_SCENARIOS } from './components/ScenarioPicker';
import HeroSearch from './components/HeroSearch';
import SimulationControls from './components/SimulationControls';
import ExtractedIntentCard from './components/ExtractedIntentCard';
import RecommendationHero from './components/RecommendationHero';
import ComparisonTable from './components/ComparisonTable';
import ArchitectureModal from './components/ArchitectureModal';
import { Sparkles, AlertCircle, RefreshCw, Code2, Heart } from 'lucide-react';

const GithubIcon = () => (
  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
  </svg>
);

export default function App() {
  const [query, setQuery] = useState(
    'Find me a vegetarian biryani under ₹300 that can arrive within 30 minutes. I prefer highly rated restaurants.'
  );
  const [activeScenarioId, setActiveScenarioId] = useState(1);
  const [simulationOptions, setSimulationOptions] = useState({});
  const [showSimControls, setShowSimControls] = useState(false);
  const [showArchitecture, setShowArchitecture] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [decisionData, setDecisionData] = useState(null);

  const runDecision = async (searchQuery, simOpts = simulationOptions) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/decision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: searchQuery,
          simulationOptions: simOpts
        })
      });

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || 'Failed to process decision request');
      }

      setDecisionData(data);
    } catch (err) {
      console.error('Decision API Error:', err);
      setError(err.message || 'Network connection failed to decision server');
    } finally {
      setIsLoading(false);
    }
  };

  // Initial run on mount with baseline scenario
  useEffect(() => {
    runDecision(query, {});
  }, []);

  const handleSelectScenario = (scenario) => {
    setActiveScenarioId(scenario.id);
    setQuery(scenario.query);
    setSimulationOptions(scenario.simulationOptions);
    if (Object.keys(scenario.simulationOptions).length > 0) {
      setShowSimControls(true);
    }
    runDecision(scenario.query, scenario.simulationOptions);
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col font-sans selection:bg-orange-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar onOpenArchitecture={() => setShowArchitecture(true)} />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {/* Hero Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20 text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Mini FLOUNA AI Decision Engine</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white mb-4">
            Smart Food Decisions,{' '}
            <span className="bg-gradient-to-r from-orange-400 via-amber-300 to-rose-400 bg-clip-text text-transparent">
              Zero Guesswork.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Enter your natural language craving. FLOUNA simultaneously queries multiple food providers, normalizes diverse schemas, deduplicates cross-platform deals, and recommends the mathematically optimal choice.
          </p>
        </div>

        {/* 1-Click Mandatory Evaluation Scenario Picker */}
        <ScenarioPicker
          onSelectScenario={handleSelectScenario}
          activeScenarioId={activeScenarioId}
        />

        {/* Natural Language Search Input */}
        <HeroSearch
          query={query}
          setQuery={setQuery}
          onSearch={(q, sim) => runDecision(q, sim)}
          isLoading={isLoading}
          showSimControls={showSimControls}
          setShowSimControls={setShowSimControls}
          simulationOptions={simulationOptions}
        />

        {/* Fault & Edge Case Simulation Controls (Collapsible) */}
        {showSimControls && (
          <SimulationControls
            simulationOptions={simulationOptions}
            setSimulationOptions={setSimulationOptions}
            onApply={() => runDecision(query, simulationOptions)}
          />
        )}

        {/* Error State */}
        {error && (
          <div className="mb-8 p-4 rounded-2xl bg-rose-950/40 border border-rose-500/40 text-rose-300 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
              <div>
                <p className="font-semibold text-sm">Failed to evaluate decision request</p>
                <p className="text-xs text-rose-400/80">{error}</p>
              </div>
            </div>
            <button
              onClick={() => runDecision(query, simulationOptions)}
              className="px-3 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 text-xs font-semibold"
            >
              Retry
            </button>
          </div>
        )}

        {/* Step 1: Extracted User Requirements */}
        {decisionData && decisionData.userRequirements && (
          <ExtractedIntentCard userRequirements={decisionData.userRequirements} />
        )}

        {/* Step 2: The #1 Recommended Best Match */}
        {decisionData && decisionData.recommendation && (
          <RecommendationHero recommendation={decisionData.recommendation} />
        )}

        {/* Step 3: Full Normalized Comparison Table */}
        {decisionData && decisionData.allOptions && (
          <ComparisonTable
            options={decisionData.allOptions}
            telemetry={decisionData.telemetry}
          />
        )}
      </main>

      {/* System Architecture Specs Modal */}
      <ArchitectureModal
        isOpen={showArchitecture}
        onClose={() => setShowArchitecture(false)}
      />

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950/60 py-8 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <span className="font-extrabold text-slate-200 tracking-tight">FLOUNA Decision Engine</span>
            <span>•</span>
            <span>Algorithic 24h Technical Assessment</span>
          </div>

          <div className="flex items-center space-x-1 text-slate-400">
            <span>Built & Engineered with precision by</span>
            <a
              href="https://github.com/Rekha-gowda"
              target="_blank"
              rel="noreferrer"
              className="font-bold text-orange-400 hover:text-orange-300 underline underline-offset-2 ml-1"
            >
              G. Rekha
            </a>
          </div>

          <div className="flex items-center space-x-3">
            <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[11px] font-mono">
              Render Deploy Ready 🚀
            </span>
            <a
              href="https://github.com/Rekha-gowda"
              target="_blank"
              rel="noreferrer"
              className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
            >
              <GithubIcon />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
