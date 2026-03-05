import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Play, 
  RotateCcw, 
  ChevronRight, 
  AlertCircle,
  CheckCircle2,
  Trophy,
  Info
} from 'lucide-react';
import { PayoffChart } from './PayoffChart';

interface Scenario {
  id: number;
  title: string;
  description: string;
  asset: string;
  currentPrice: number;
  outlook: 'bullish' | 'bearish' | 'volatile';
  actualPriceChange: number;
  explanation: string;
}

const SCENARIOS: Scenario[] = [
  {
    id: 1,
    title: "Oil Supply Crunch",
    description: "Tensions in the Middle East suggest a possible supply disruption. Analysts expect oil prices to surge in the next month.",
    asset: "Crude Oil",
    currentPrice: 80,
    outlook: 'bullish',
    actualPriceChange: 15, // Price goes to 95
    explanation: "As expected, supply fears drove prices up. A Long Call or Long Future would have been highly profitable here."
  },
  {
    id: 2,
    title: "Tech Sector Bubble?",
    description: "The 'Global Tech Index' has reached all-time highs, but earnings reports are coming out next week and they look weak.",
    asset: "Tech Index",
    currentPrice: 150,
    outlook: 'bearish',
    actualPriceChange: -20, // Price goes to 130
    explanation: "Weak earnings caused a massive sell-off. A Long Put or Short Future was the right move to hedge against this drop."
  },
  {
    id: 3,
    title: "Stable Gold",
    description: "Inflation is steady and there are no major economic shocks. Gold is expected to remain very stable around its current price.",
    asset: "Gold",
    currentPrice: 2000,
    outlook: 'volatile', // Actually neutral in this context
    actualPriceChange: 2, // Price goes to 2002
    explanation: "With little movement, paying high premiums for options would have resulted in a loss due to time decay. Forwards would have been neutral."
  }
];

export const DerivativesGame: React.FC = () => {
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'result' | 'summary'>('intro');
  const [currentScenarioIdx, setCurrentScenarioIdx] = useState(0);
  const [balance, setBalance] = useState(10000);
  const [selectedTrade, setSelectedTrade] = useState<{
    type: 'forward' | 'call' | 'put';
    position: 'long' | 'short';
    amount: number;
    strike: number;
    premium: number;
  } | null>(null);
  const [history, setHistory] = useState<{ scenario: string; profit: number }[]>([]);

  const currentScenario = SCENARIOS[currentScenarioIdx];

  const startTrade = (type: 'forward' | 'call' | 'put', position: 'long' | 'short') => {
    const premium = type === 'forward' ? 0 : 5; // Simplified premium
    setSelectedTrade({
      type,
      position,
      amount: 100, // Fixed contract size for simplicity
      strike: currentScenario.currentPrice,
      premium
    });
  };

  const executeTrade = () => {
    if (!selectedTrade) return;

    const finalPrice = currentScenario.currentPrice + currentScenario.actualPriceChange;
    let profit = 0;

    if (selectedTrade.type === 'forward') {
      profit = selectedTrade.position === 'long' 
        ? (finalPrice - selectedTrade.strike) * selectedTrade.amount
        : (selectedTrade.strike - finalPrice) * selectedTrade.amount;
    } else if (selectedTrade.type === 'call') {
      const payoff = Math.max(0, finalPrice - selectedTrade.strike);
      profit = selectedTrade.position === 'long'
        ? (payoff - selectedTrade.premium) * selectedTrade.amount
        : (selectedTrade.premium - payoff) * selectedTrade.amount;
    } else if (selectedTrade.type === 'put') {
      const payoff = Math.max(0, selectedTrade.strike - finalPrice);
      profit = selectedTrade.position === 'long'
        ? (payoff - selectedTrade.premium) * selectedTrade.amount
        : (selectedTrade.premium - payoff) * selectedTrade.amount;
    }

    setBalance(prev => prev + profit);
    setHistory(prev => [...prev, { scenario: currentScenario.title, profit }]);
    setGameState('result');
  };

  const nextScenario = () => {
    if (currentScenarioIdx < SCENARIOS.length - 1) {
      setCurrentScenarioIdx(prev => prev + 1);
      setSelectedTrade(null);
      setGameState('playing');
    } else {
      setGameState('summary');
    }
  };

  const resetGame = () => {
    setBalance(10000);
    setCurrentScenarioIdx(0);
    setSelectedTrade(null);
    setHistory([]);
    setGameState('intro');
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden min-h-[600px] flex flex-col">
      {/* Game Header */}
      <div className="p-6 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-600 p-2 rounded-lg text-white">
            <Trophy size={20} />
          </div>
          <h2 className="font-bold text-lg">Trading Simulator</h2>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Current Balance</p>
            <p className={`text-xl font-mono font-bold ${balance >= 10000 ? 'text-emerald-600' : 'text-red-600'}`}>
              ${balance.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 p-8 relative">
        <AnimatePresence mode="wait">
          {gameState === 'intro' && (
            <motion.div 
              key="intro"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-xl mx-auto text-center space-y-6 pt-12"
            >
              <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Play size={40} fill="currentColor" />
              </div>
              <h3 className="text-3xl font-serif italic">Ready to Trade?</h3>
              <p className="text-slate-600">
                You have <strong>$10,000</strong> in virtual capital. We will present you with 3 market scenarios. 
                Choose the right derivative strategy to grow your portfolio or hedge your risks.
              </p>
              <button 
                onClick={() => setGameState('playing')}
                className="px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold transition-all shadow-lg shadow-emerald-600/20"
              >
                Start Simulation
              </button>
            </motion.div>
          )}

          {gameState === 'playing' && (
            <motion.div 
              key="playing"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-12"
            >
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-wider">
                  Scenario {currentScenarioIdx + 1} of {SCENARIOS.length}
                </div>
                <h3 className="text-3xl font-bold leading-tight">{currentScenario.title}</h3>
                <p className="text-slate-600 leading-relaxed text-lg">
                  {currentScenario.description}
                </p>
                
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-400 uppercase font-bold">Asset</p>
                    <p className="font-bold">{currentScenario.asset}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-400 uppercase font-bold">Current Price</p>
                    <p className="font-mono font-bold text-xl">${currentScenario.currentPrice}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Choose Your Strategy</p>
                  <div className="grid grid-cols-2 gap-3">
                    <button 
                      onClick={() => startTrade('forward', 'long')}
                      className={`p-4 rounded-xl border transition-all text-left ${selectedTrade?.type === 'forward' && selectedTrade.position === 'long' ? 'border-emerald-500 bg-emerald-50 ring-2 ring-emerald-500/20' : 'border-slate-200 hover:border-slate-300'}`}
                    >
                      <p className="font-bold text-sm">Long Future</p>
                      <p className="text-xs text-slate-500">Profit if price rises</p>
                    </button>
                    <button 
                      onClick={() => startTrade('forward', 'short')}
                      className={`p-4 rounded-xl border transition-all text-left ${selectedTrade?.type === 'forward' && selectedTrade.position === 'short' ? 'border-red-500 bg-red-50 ring-2 ring-red-500/20' : 'border-slate-200 hover:border-slate-300'}`}
                    >
                      <p className="font-bold text-sm">Short Future</p>
                      <p className="text-xs text-slate-500">Profit if price falls</p>
                    </button>
                    <button 
                      onClick={() => startTrade('call', 'long')}
                      className={`p-4 rounded-xl border transition-all text-left ${selectedTrade?.type === 'call' && selectedTrade.position === 'long' ? 'border-emerald-500 bg-emerald-50 ring-2 ring-emerald-500/20' : 'border-slate-200 hover:border-slate-300'}`}
                    >
                      <p className="font-bold text-sm">Buy Call Option</p>
                      <p className="text-xs text-slate-500">Limited risk, high upside</p>
                    </button>
                    <button 
                      onClick={() => startTrade('put', 'long')}
                      className={`p-4 rounded-xl border transition-all text-left ${selectedTrade?.type === 'put' && selectedTrade.position === 'long' ? 'border-red-500 bg-red-50 ring-2 ring-red-500/20' : 'border-slate-200 hover:border-slate-300'}`}
                    >
                      <p className="font-bold text-sm">Buy Put Option</p>
                      <p className="text-xs text-slate-500">Profit from market crash</p>
                    </button>
                  </div>
                </div>

                <button 
                  disabled={!selectedTrade}
                  onClick={executeTrade}
                  className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  Confirm Trade & Advance Time <ChevronRight size={20} />
                </button>
              </div>

              <div className="hidden lg:block bg-slate-50 rounded-3xl p-8 border border-slate-100">
                <h4 className="font-bold mb-4 flex items-center gap-2 text-slate-400 uppercase text-xs tracking-widest">
                  <Info size={14} /> Strategy Preview
                </h4>
                {selectedTrade ? (
                  <div className="space-y-6">
                    <PayoffChart 
                      type={selectedTrade.type}
                      position={selectedTrade.position}
                      strike={selectedTrade.strike}
                      premium={selectedTrade.premium}
                      spotRange={[currentScenario.currentPrice - 50, currentScenario.currentPrice + 50]}
                    />
                    <div className="bg-white p-4 rounded-xl border border-slate-200 text-sm space-y-2">
                      <p className="flex justify-between">
                        <span className="text-slate-500">Strategy:</span>
                        <span className="font-bold capitalize">{selectedTrade.position} {selectedTrade.type}</span>
                      </p>
                      <p className="flex justify-between">
                        <span className="text-slate-500">Cost (Premium):</span>
                        <span className="font-bold">${selectedTrade.premium * selectedTrade.amount}</span>
                      </p>
                      <p className="text-xs text-slate-400 italic mt-2">
                        {selectedTrade.type === 'forward' 
                          ? "Futures have no upfront cost but carry unlimited risk." 
                          : "Options cost a premium but limit your maximum loss."}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-40">
                    <TrendingUp size={48} />
                    <p className="text-sm">Select a strategy to see the payoff diagram</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {gameState === 'result' && (
            <motion.div 
              key="result"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="max-w-2xl mx-auto space-y-8 pt-6"
            >
              <div className="text-center space-y-2">
                <h3 className="text-4xl font-bold">The Results are In!</h3>
                <p className="text-slate-500">One month has passed...</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 text-center">
                  <p className="text-xs text-slate-400 uppercase font-bold mb-1">Old Price</p>
                  <p className="text-2xl font-mono font-bold">${currentScenario.currentPrice}</p>
                </div>
                <div className="bg-slate-900 text-white p-6 rounded-2xl text-center">
                  <p className="text-xs text-slate-400 uppercase font-bold mb-1">New Price</p>
                  <p className="text-2xl font-mono font-bold">${currentScenario.currentPrice + currentScenario.actualPriceChange}</p>
                </div>
              </div>

              <div className={`p-8 rounded-3xl border-2 flex items-center gap-6 ${history[history.length - 1].profit >= 0 ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'}`}>
                <div className={`w-16 h-16 rounded-full flex items-center justify-center shrink-0 ${history[history.length - 1].profit >= 0 ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'}`}>
                  {history[history.length - 1].profit >= 0 ? <CheckCircle2 size={32} /> : <AlertCircle size={32} />}
                </div>
                <div>
                  <h4 className="text-xl font-bold mb-1">
                    {history[history.length - 1].profit >= 0 ? 'Nice Trade!' : 'Rough Market...'}
                  </h4>
                  <p className={`text-2xl font-bold ${history[history.length - 1].profit >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                    {history[history.length - 1].profit >= 0 ? '+' : ''}${history[history.length - 1].profit.toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200">
                <h5 className="font-bold mb-2 flex items-center gap-2 text-slate-400 uppercase text-xs tracking-widest">
                  <BookOpen size={14} className="inline" /> Lecturer's Note
                </h5>
                <p className="text-slate-600 leading-relaxed italic">
                  "{currentScenario.explanation}"
                </p>
              </div>

              <button 
                onClick={nextScenario}
                className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 transition-all flex items-center justify-center gap-2"
              >
                Next Scenario <ChevronRight size={20} />
              </button>
            </motion.div>
          )}

          {gameState === 'summary' && (
            <motion.div 
              key="summary"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-xl mx-auto text-center space-y-8 pt-12"
            >
              <div className="w-24 h-24 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Trophy size={48} />
              </div>
              <h3 className="text-4xl font-serif italic">Simulation Complete!</h3>
              
              <div className="space-y-4">
                <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100">
                  <p className="text-slate-400 uppercase font-bold text-xs mb-2">Final Portfolio Value</p>
                  <p className={`text-5xl font-mono font-bold ${balance >= 10000 ? 'text-emerald-600' : 'text-red-600'}`}>
                    ${balance.toLocaleString()}
                  </p>
                  <p className="text-sm text-slate-500 mt-4">
                    {balance > 10000 
                      ? "Excellent work! You've successfully navigated the derivatives market." 
                      : "A tough round, but a great learning experience. Derivatives are complex!"}
                  </p>
                </div>

                <div className="text-left space-y-2">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest px-2">Performance History</p>
                  {history.map((h, i) => (
                    <div key={i} className="flex justify-between items-center p-3 bg-white border border-slate-100 rounded-xl text-sm">
                      <span className="text-slate-600">{h.scenario}</span>
                      <span className={`font-bold ${h.profit >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                        {h.profit >= 0 ? '+' : ''}${h.profit.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <button 
                onClick={resetGame}
                className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2 mx-auto"
              >
                <RotateCcw size={20} /> Try Again
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// Helper components for the game
const BookOpen = ({ size, className }: { size: number; className?: string }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M2 3h6a4 4 0 0 1 4 4v14a4 4 0 0 0-4-4H2z" />
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a4 4 0 0 1 4-4h6z" />
  </svg>
);
