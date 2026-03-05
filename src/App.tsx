import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, 
  TrendingUp, 
  Zap, 
  ArrowRight, 
  Info, 
  Calculator, 
  MessageSquare,
  ChevronRight,
  Globe,
  BarChart3,
  ShieldCheck,
  Gamepad2
} from 'lucide-react';
import { PayoffChart } from './components/PayoffChart';
import { AITutor } from './components/AITutor';
import { DerivativesGame } from './components/DerivativesGame';

type Tab = 'overview' | 'forwards' | 'futures' | 'options' | 'calculator' | 'game';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BookOpen },
    { id: 'forwards', label: 'Forwards', icon: Globe },
    { id: 'futures', label: 'Futures', icon: TrendingUp },
    { id: 'options', label: 'Options', icon: Zap },
    { id: 'calculator', label: 'Playground', icon: Calculator },
    { id: 'game', label: 'Trading Game', icon: Gamepad2 },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="bg-emerald-600 p-2 rounded-lg">
                <BarChart3 className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight">Derivatives Academy</h1>
                <p className="text-[10px] text-slate-500 uppercase tracking-[0.2em] font-bold">Financial Engineering 101</p>
              </div>
            </div>
            <nav className="hidden md:flex space-x-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as Tab)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                    activeTab === tab.id 
                      ? 'bg-emerald-50 text-emerald-700' 
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <tab.icon size={16} />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {activeTab === 'overview' && <OverviewSection onNavigate={setActiveTab} />}
                {activeTab === 'forwards' && <ForwardSection />}
                {activeTab === 'futures' && <FutureSection />}
                {activeTab === 'options' && <OptionSection />}
                {activeTab === 'calculator' && <CalculatorSection />}
                {activeTab === 'game' && <DerivativesGame />}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-8">
            <section>
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <MessageSquare size={14} /> AI Learning Assistant
              </h2>
              <AITutor />
            </section>

            <section className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl overflow-hidden relative">
              <div className="relative z-10">
                <h3 className="text-lg font-bold mb-2">Quick Quiz</h3>
                <p className="text-slate-400 text-sm mb-4">Test your knowledge on derivatives basics.</p>
                <button className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-white rounded-xl font-bold transition-colors flex items-center justify-center gap-2">
                  Start Quiz <ChevronRight size={18} />
                </button>
              </div>
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl"></div>
            </section>
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-slate-200 py-12 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-slate-400 text-sm">© 2024 Derivatives Academy. Built for Educational Purposes.</p>
        </div>
      </footer>
    </div>
  );
}

function OverviewSection({ onNavigate }: { onNavigate: (tab: Tab) => void }) {
  return (
    <div className="space-y-8">
      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm overflow-hidden relative">
        <div className="max-w-2xl relative z-10">
          <h2 className="text-4xl font-serif italic mb-4">What are Derivatives?</h2>
          <p className="text-lg text-slate-600 leading-relaxed mb-6">
            A derivative is a financial contract whose value is "derived" from an underlying asset, such as a stock, bond, commodity, or currency.
          </p>
          <div className="flex flex-wrap gap-4">
            <div className="bg-emerald-50 border border-emerald-100 px-4 py-2 rounded-lg flex items-center gap-2 text-emerald-700 text-sm font-medium">
              <ShieldCheck size={16} /> Hedging Risk
            </div>
            <div className="bg-blue-50 border border-blue-100 px-4 py-2 rounded-lg flex items-center gap-2 text-blue-700 text-sm font-medium">
              <TrendingUp size={16} /> Speculation
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-emerald-50/50 to-transparent hidden lg:block"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { id: 'forwards', title: 'Forwards', desc: 'Customizable OTC contracts to buy/sell at a future date.', color: 'bg-orange-500' },
          { id: 'futures', title: 'Futures', desc: 'Standardized exchange-traded contracts with daily settlement.', color: 'bg-blue-500' },
          { id: 'options', title: 'Options', desc: 'The right, but not the obligation, to trade an asset.', color: 'bg-emerald-500' },
        ].map((item) => (
          <button 
            key={item.id}
            onClick={() => onNavigate(item.id as Tab)}
            className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all text-left group"
          >
            <div className={`w-12 h-12 ${item.color} rounded-xl mb-4 flex items-center justify-center text-white shadow-lg shadow-current/20`}>
              <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
            </div>
            <h3 className="text-xl font-bold mb-2">{item.title}</h3>
            <p className="text-sm text-slate-500">{item.desc}</p>
          </button>
        ))}
      </div>

      <div className="bg-slate-900 text-white p-8 rounded-3xl">
        <h3 className="text-2xl font-bold mb-6">Core Concepts</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-emerald-400 font-bold shrink-0">1</div>
              <div>
                <h4 className="font-bold mb-1">Underlying Asset</h4>
                <p className="text-sm text-slate-400">The asset on which the derivative's value is based (e.g., Apple stock, Gold, Oil).</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-emerald-400 font-bold shrink-0">2</div>
              <div>
                <h4 className="font-bold mb-1">Expiration Date</h4>
                <p className="text-sm text-slate-400">The date when the contract must be settled or expires.</p>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-emerald-400 font-bold shrink-0">3</div>
              <div>
                <h4 className="font-bold mb-1">Strike Price</h4>
                <p className="text-sm text-slate-400">The pre-agreed price at which the asset will be traded.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-emerald-400 font-bold shrink-0">4</div>
              <div>
                <h4 className="font-bold mb-1">Notional Value</h4>
                <p className="text-sm text-slate-400">The total value of the underlying asset controlled by the contract.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ForwardSection() {
  return (
    <div className="space-y-8">
      <div className="prose prose-slate max-w-none">
        <h2 className="text-3xl font-bold mb-4">Forward Contracts</h2>
        <p className="text-lg text-slate-600">
          A forward contract is a customized, private agreement between two parties to buy or sell an asset at a specified price on a future date.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200">
          <h3 className="font-bold mb-4 flex items-center gap-2"><Info className="text-emerald-500" size={18} /> Key Characteristics</h3>
          <ul className="space-y-3 text-sm text-slate-600">
            <li className="flex gap-2"><span>•</span> <strong>OTC:</strong> Traded Over-the-Counter, not on an exchange.</li>
            <li className="flex gap-2"><span>•</span> <strong>Customizable:</strong> Parties decide all terms (amount, date, price).</li>
            <li className="flex gap-2"><span>•</span> <strong>No Daily Settlement:</strong> Profit/Loss is realized only at expiration.</li>
            <li className="flex gap-2"><span>•</span> <strong>Counterparty Risk:</strong> Risk that one party defaults on the agreement.</li>
          </ul>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200">
          <h3 className="font-bold mb-4">Payoff Visualization (Long)</h3>
          <PayoffChart type="forward" position="long" strike={100} premium={0} spotRange={[50, 150]} />
          <p className="text-[10px] text-slate-400 mt-2 text-center italic">Profit = Spot Price - Forward Price</p>
        </div>
      </div>
    </div>
  );
}

function FutureSection() {
  return (
    <div className="space-y-8">
      <div className="prose prose-slate max-w-none">
        <h2 className="text-3xl font-bold mb-4">Futures Contracts</h2>
        <p className="text-lg text-slate-600">
          Futures are standardized contracts traded on exchanges. They are similar to forwards but with key differences that make them safer and more liquid.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 col-span-1">
          <h3 className="font-bold mb-4">The Clearinghouse</h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            The exchange acts as an intermediary (Clearinghouse), becoming the buyer to every seller and the seller to every buyer, virtually eliminating counterparty risk.
          </p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 col-span-2">
          <h3 className="font-bold mb-4">Mark-to-Market</h3>
          <p className="text-sm text-slate-600 leading-relaxed mb-4">
            Unlike forwards, futures are "settled" daily. Profits and losses are credited or debited from your margin account every single day.
          </p>
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
            <p className="text-xs font-mono text-slate-500">Example: If you are long a gold future and the price rises by $10 today, $10 is added to your account today.</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200">
        <h3 className="font-bold mb-4">Payoff Visualization (Short)</h3>
        <PayoffChart type="forward" position="short" strike={100} premium={0} spotRange={[50, 150]} />
        <p className="text-[10px] text-slate-400 mt-2 text-center italic">Profit = Future Price - Spot Price</p>
      </div>
    </div>
  );
}

function OptionSection() {
  return (
    <div className="space-y-8">
      <div className="prose prose-slate max-w-none">
        <h2 className="text-3xl font-bold mb-4">Options</h2>
        <p className="text-lg text-slate-600">
          Options give the holder the <strong>right</strong>, but not the obligation, to buy or sell an asset. This "right" comes at a cost called the <strong>Premium</strong>.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 border-l-4 border-l-emerald-500">
            <h3 className="font-bold text-emerald-700 mb-2">Call Option</h3>
            <p className="text-sm text-slate-600 mb-4">The right to <strong>BUY</strong> an asset at the strike price. You profit if the price goes UP.</p>
            <PayoffChart type="call" position="long" strike={100} premium={10} spotRange={[50, 150]} />
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 border-l-4 border-l-orange-500">
            <h3 className="font-bold text-orange-700 mb-2">Put Option</h3>
            <p className="text-sm text-slate-600 mb-4">The right to <strong>SELL</strong> an asset at the strike price. You profit if the price goes DOWN.</p>
            <PayoffChart type="put" position="long" strike={100} premium={10} spotRange={[50, 150]} />
          </div>
        </div>

        <div className="bg-slate-900 text-white p-8 rounded-3xl h-fit sticky top-24">
          <h3 className="text-xl font-bold mb-6">Option Terminology</h3>
          <div className="space-y-6">
            <div>
              <h4 className="text-emerald-400 font-bold text-sm uppercase tracking-wider mb-2">In-the-Money (ITM)</h4>
              <p className="text-sm text-slate-400">The option has intrinsic value. Exercising it would result in a profit (excluding premium).</p>
            </div>
            <div>
              <h4 className="text-orange-400 font-bold text-sm uppercase tracking-wider mb-2">Out-of-the-Money (OTM)</h4>
              <p className="text-sm text-slate-400">The option has no intrinsic value. It would not be exercised.</p>
            </div>
            <div>
              <h4 className="text-blue-400 font-bold text-sm uppercase tracking-wider mb-2">At-the-Money (ATM)</h4>
              <p className="text-sm text-slate-400">The strike price is equal to the current market price.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CalculatorSection() {
  const [type, setType] = useState<'forward' | 'call' | 'put'>('call');
  const [position, setPosition] = useState<'long' | 'short'>('long');
  const [strike, setStrike] = useState(100);
  const [premium, setPremium] = useState(10);

  return (
    <div className="space-y-8">
      <div className="prose prose-slate max-w-none">
        <h2 className="text-3xl font-bold mb-4">Payoff Playground</h2>
        <p className="text-lg text-slate-600">
          Experiment with different parameters to see how they affect the profit and loss of a derivative position.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white p-6 rounded-2xl border border-slate-200 space-y-6">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Contract Type</label>
            <div className="grid grid-cols-3 gap-2">
              {(['forward', 'call', 'put'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setType(t)}
                  className={`py-2 rounded-lg text-xs font-bold capitalize transition-all ${
                    type === t ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Position</label>
            <div className="grid grid-cols-2 gap-2">
              {(['long', 'short'] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setPosition(p)}
                  className={`py-2 rounded-lg text-xs font-bold capitalize transition-all ${
                    position === p ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Strike Price: ${strike}</label>
            <input 
              type="range" min="50" max="150" step="1" 
              value={strike} onChange={(e) => setStrike(Number(e.target.value))}
              className="w-full accent-emerald-600"
            />
          </div>

          {type !== 'forward' && (
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Premium: ${premium}</label>
              <input 
                type="range" min="0" max="30" step="1" 
                value={premium} onChange={(e) => setPremium(Number(e.target.value))}
                className="w-full accent-emerald-600"
              />
            </div>
          )}

          <div className="pt-4 border-t border-slate-100">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-slate-500">Break-even:</span>
              <span className="font-bold">
                ${type === 'forward' ? strike : (type === 'call' ? strike + premium : strike - premium)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Max Loss:</span>
              <span className="font-bold text-red-500">
                {type === 'forward' ? 'Unlimited' : (position === 'long' ? `$${premium}` : 'Unlimited')}
              </span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 bg-white p-8 rounded-2xl border border-slate-200 flex flex-col justify-center">
          <h3 className="text-xl font-bold mb-6 text-center">
            {position.charAt(0).toUpperCase() + position.slice(1)} {type.charAt(0).toUpperCase() + type.slice(1)} Payoff
          </h3>
          <PayoffChart 
            type={type} 
            position={position} 
            strike={strike} 
            premium={type === 'forward' ? 0 : premium} 
            spotRange={[50, 150]} 
          />
        </div>
      </div>
    </div>
  );
}
