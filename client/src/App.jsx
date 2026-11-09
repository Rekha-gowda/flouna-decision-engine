import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HeroSearch from './components/HeroSearch';
import RecommendationHero from './components/RecommendationHero';
import ComparisonTable from './components/ComparisonTable';
import ScenarioPicker from './components/ScenarioPicker';
import SimulationControls from './components/SimulationControls';
import { Sparkles, SlidersHorizontal, X, AlertCircle, ShoppingBag, Check } from 'lucide-react';

export default function App() {
  const [query, setQuery] = useState('can i find pizza under 100 rupees');
  const [simulationOptions, setSimulationOptions] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [decisionData, setDecisionData] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [toastMessage, setToastMessage] = useState(null);

  // Hidden / Discreet Reviewer Test Console Drawer
  const [showDevConsole, setShowDevConsole] = useState(false);
  const [activeScenarioId, setActiveScenarioId] = useState(null);

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
        throw new Error(data.error || 'Failed to search restaurants');
      }

      setDecisionData(data);
    } catch (err) {
      console.error('Decision API Error:', err);
      setError(err.message || 'Could not connect to food service');
    } finally {
      setIsLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    runDecision(query, {});
  }, []);

  const handleAddToCart = (item) => {
    setCartCount(prev => prev + 1);
    setToastMessage(`Added "${item.dishName}" to your cart!`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSelectScenario = (scenario) => {
    setActiveScenarioId(scenario.id);
    setQuery(scenario.query);
    setSimulationOptions(scenario.simulationOptions);
    runDecision(scenario.query, scenario.simulationOptions);
    setShowDevConsole(false);
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col font-sans selection:bg-orange-500 selection:text-white">
      {/* Real-World Header */}
      <Navbar cartCount={cartCount} />

      {/* Floating Notification Toast */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-emerald-500 text-white font-semibold text-xs px-4 py-2.5 rounded-xl shadow-2xl flex items-center space-x-2 animate-bounce">
          <Check className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Real-World Food Discovery Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Search Hero */}
        <HeroSearch
          query={query}
          setQuery={setQuery}
          onSearch={(q) => runDecision(q, simulationOptions)}
          isLoading={isLoading}
        />

        {/* Error Notification */}
        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-950/40 border border-rose-500/40 text-rose-300 flex items-center justify-between">
            <div className="flex items-center space-x-3 text-xs sm:text-sm">
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
              <span>{error}</span>
            </div>
            <button
              onClick={() => runDecision(query, simulationOptions)}
              className="px-3 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 text-xs font-semibold cursor-pointer"
            >
              Retry
            </button>
          </div>
        )}

        {/* Best Fit / Similar Recommendation Card */}
        {decisionData && decisionData.recommendation && (
          <RecommendationHero
            recommendation={decisionData.recommendation}
            hasExactMatch={decisionData.hasExactMatch}
            onAddToCart={handleAddToCart}
          />
        )}

        {/* All Available Restaurants Comparison Grid */}
        {decisionData && decisionData.allOptions && (
          <ComparisonTable
            options={decisionData.allOptions}
            onAddToCart={handleAddToCart}
          />
        )}
      </main>

      {/* Real-World Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950/80 py-10 px-4 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <span className="font-extrabold text-xl text-white">FLOUNA</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Smart food discovery across Bengaluru. Best taste, verified ratings, and guaranteed best prices.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-slate-200 mb-3">Popular Cuisines</h4>
            <ul className="space-y-1.5 text-slate-400">
              <li>Biryani & Rice Bowls</li>
              <li>Artisanal Pizzas</li>
              <li>North Indian Thalis</li>
              <li>Gourmet Burgers</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-200 mb-3">Delivery Areas</h4>
            <ul className="space-y-1.5 text-slate-400">
              <li>Koramangala</li>
              <li>Indiranagar</li>
              <li>HSR Layout</li>
              <li>BTM & Whitefield</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-200 mb-3">Platform Administration</h4>
            <p className="text-slate-400 mb-2">System Admin: <strong className="text-slate-200">Rekha</strong></p>
            <p className="text-[11px] text-emerald-400">✓ All delivery network gateways active</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-6 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-400">
          <p>© 2026 FLOUNA Technologies Pvt. Ltd. All rights reserved.</p>
          <p>Managed by Admin Rekha</p>
        </div>
      </footer>

      {/* Discreet Evaluator Drawer Button (Bottom Right) */}
      <div className="fixed bottom-5 right-5 z-40">
        <button
          onClick={() => setShowDevConsole(!showDevConsole)}
          className="px-3.5 py-2 rounded-full bg-slate-900 hover:bg-slate-850 text-slate-300 hover:text-white border border-slate-700 shadow-2xl text-xs font-semibold flex items-center space-x-2 transition-all cursor-pointer opacity-85 hover:opacity-100"
          title="Reviewer & Evaluator Test Scenarios"
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-orange-400" />
          <span>Evaluation Test Suite</span>
        </button>
      </div>

      {/* Evaluator Modal / Drawer */}
      {showDevConsole && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-4xl max-h-[85vh] overflow-y-auto rounded-3xl bg-slate-900 border border-slate-700 p-6 sm:p-8 shadow-2xl">
            <button
              onClick={() => setShowDevConsole(false)}
              className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-white mb-2">
              Evaluator Test Suite (6 Mandatory Scenarios)
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Select any test case to verify the decision engine's edge cases and fault tolerance
            </p>

            <ScenarioPicker
              onSelectScenario={handleSelectScenario}
              activeScenarioId={activeScenarioId}
            />

            <div className="mt-6 pt-4 border-t border-slate-800">
              <SimulationControls
                simulationOptions={simulationOptions}
                setSimulationOptions={setSimulationOptions}
                onApply={() => runDecision(query, simulationOptions)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
