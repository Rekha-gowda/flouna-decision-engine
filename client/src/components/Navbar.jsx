import React from 'react';
import { Sparkles, Layers, CheckCircle2, ShieldCheck, Code2 } from 'lucide-react';

const GithubIcon = () => (
  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
  </svg>
);

export default function Navbar({ onOpenArchitecture }) {
  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand / Logo */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-500 via-amber-500 to-rose-500 flex items-center justify-center shadow-lg shadow-orange-500/20">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                FLOUNA
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20">
                Decision Engine
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Algorithic 24h Technical Evaluation
            </p>
          </div>
        </div>

        {/* Candidate & Action Bar */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          {/* Candidate Badge */}
          <div className="hidden md:flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
            <div className="text-xs">
              <span className="text-slate-400">Candidate: </span>
              <span className="font-semibold text-slate-200">G. Rekha</span>
            </div>
          </div>

          {/* System Architecture Button */}
          <button
            onClick={onOpenArchitecture}
            className="flex items-center space-x-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700/60 transition-all hover:border-orange-500/40"
          >
            <Layers className="w-3.5 h-3.5 text-orange-400" />
            <span className="hidden sm:inline">System Architecture</span>
            <span className="sm:hidden">Specs</span>
          </button>

          {/* GitHub Profile */}
          <a
            href="https://github.com/Rekha-gowda"
            target="_blank"
            rel="noreferrer"
            className="flex items-center space-x-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-500 text-white shadow-sm shadow-orange-600/30 transition-all"
          >
            <GithubIcon />
            <span>Rekha-gowda</span>
          </a>
        </div>
      </div>
    </header>
  );
}
