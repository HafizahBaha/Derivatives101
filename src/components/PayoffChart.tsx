import React from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  ReferenceLine,
  Area,
  AreaChart
} from 'recharts';

interface PayoffChartProps {
  type: 'forward' | 'call' | 'put';
  position: 'long' | 'short';
  strike: number;
  premium: number;
  spotRange: [number, number];
}

export const PayoffChart: React.FC<PayoffChartProps> = ({ 
  type, 
  position, 
  strike, 
  premium, 
  spotRange 
}) => {
  const data = [];
  const step = (spotRange[1] - spotRange[0]) / 50;

  for (let spot = spotRange[0]; spot <= spotRange[1]; spot += step) {
    let profit = 0;
    if (type === 'forward') {
      profit = position === 'long' ? (spot - strike) : (strike - spot);
    } else if (type === 'call') {
      const payoff = Math.max(0, spot - strike);
      profit = position === 'long' ? (payoff - premium) : (premium - payoff);
    } else if (type === 'put') {
      const payoff = Math.max(0, strike - spot);
      profit = position === 'long' ? (payoff - premium) : (premium - payoff);
    }

    data.push({
      spot: parseFloat(spot.toFixed(2)),
      profit: parseFloat(profit.toFixed(2)),
    });
  }

  return (
    <div className="w-full h-[300px] bg-white p-4 rounded-xl border border-black/5 shadow-sm">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorLoss" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis 
            dataKey="spot" 
            label={{ value: 'Spot Price ($)', position: 'insideBottomRight', offset: -5, fontSize: 12 }}
            tick={{ fontSize: 10 }}
          />
          <YAxis 
            label={{ value: 'Profit / Loss ($)', angle: -90, position: 'insideLeft', fontSize: 12 }}
            tick={{ fontSize: 10 }}
          />
          <Tooltip 
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            formatter={(value: number) => [`$${value}`, 'Profit/Loss']}
          />
          <ReferenceLine y={0} stroke="#94a3b8" strokeWidth={1} />
          <ReferenceLine x={strike} stroke="#64748b" strokeDasharray="3 3" label={{ value: 'Strike', position: 'top', fontSize: 10 }} />
          <Area 
            type="monotone" 
            dataKey="profit" 
            stroke="#10b981" 
            fillOpacity={1} 
            fill="url(#colorProfit)" 
            strokeWidth={2}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
