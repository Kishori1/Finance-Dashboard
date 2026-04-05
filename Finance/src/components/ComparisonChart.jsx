import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { useFinanceStore } from '../store/useFinanceStore';
import { useState } from 'react';

export const ComparisonChart = () => {
  const { stats, isDark } = useFinanceStore();
  const [view, setView] = useState('absolute'); // 'absolute' | 'percentage'
  
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl p-4 rounded-2xl border border-slate-200 dark:border-slate-700/50 shadow-2xl">
          <p className="text-sm font-bold text-slate-500 dark:text-slate-400 mb-2">{label}</p>
          <div className="space-y-1.5">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-emerald-500" />
              <span className="text-sm text-slate-600 dark:text-slate-300">Income:</span>
              <span className="text-sm font-bold ml-auto">₹{payload[0].value.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-rose-500" />
              <span className="text-sm text-slate-600 dark:text-slate-300">Expenses:</span>
              <span className="text-sm font-bold ml-auto">₹{payload[1].value.toLocaleString()}</span>
            </div>
            <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Savings:</span>
              <span className="text-sm font-bold ml-auto">₹{(payload[0].value - payload[1].value).toLocaleString()}</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  const gridColor = isDark ? 'rgba(255, 255, 255, 0.05)' : '#E2E8F0';
  const tickColor = isDark ? '#64748b' : '#94a3b8';

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-50 tracking-tight">
          Income vs. Expenses
        </h3>
        <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl w-full sm:w-auto">
          <button 
            onClick={() => setView('absolute')}
            className={`flex-1 sm:flex-none px-3 py-1.5 text-[10px] sm:text-xs font-bold rounded-lg transition-all ${view === 'absolute' ? 'bg-white dark:bg-slate-700 shadow-sm text-blue-600' : 'text-slate-500'}`}
          >
            Absolute
          </button>
          <button 
            onClick={() => setView('percentage')}
            className={`flex-1 sm:flex-none px-3 py-1.5 text-[10px] sm:text-xs font-bold rounded-lg transition-all ${view === 'percentage' ? 'bg-white dark:bg-slate-700 shadow-sm text-blue-600' : 'text-slate-500'}`}
          >
            Percentage
          </button>
        </div>
      </div>

      <div className="h-[350px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            data={stats.monthlyComparison} 
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            barGap={8}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
            <XAxis 
              dataKey="month" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: tickColor, fontSize: 12 }}
              dy={10}
            />
            <YAxis 
              width={40}
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: tickColor, fontSize: 10 }}
              tickFormatter={(value) => view === 'absolute' ? `₹${value}` : `${(value/7200 * 100).toFixed(0)}%`}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)' }} />
            <Bar 
              dataKey="income" 
              fill="#10b981" 
              radius={[6, 6, 0, 0]} 
              barSize={view === 'percentage' ? 40 : 20}
              stackId={view === 'percentage' ? "a" : undefined}
            />
            <Bar 
              dataKey="expenses" 
              fill="#f43f5e" 
              radius={[6, 6, 0, 0]} 
              barSize={view === 'percentage' ? 40 : 20}
              stackId={view === 'percentage' ? "a" : undefined}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
          <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-1">Best Month</p>
          <div className="flex items-end gap-2">
            <span className="text-xl font-bold text-slate-900 dark:text-slate-50">February</span>
            <span className="text-sm font-semibold text-emerald-600 mb-0.5">43.1% savings rate</span>
          </div>
        </div>
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20">
          <p className="text-xs font-bold text-amber-600 uppercase tracking-wider mb-1">Watch Out</p>
          <div className="flex items-end gap-2">
            <span className="text-xl font-bold text-slate-900 dark:text-slate-50">December</span>
            <span className="text-sm font-semibold text-amber-600 mb-0.5">17.9% savings rate</span>
          </div>
          <p className="text-[10px] text-amber-600/70 mt-1 font-medium italic">"Holiday season spending spike"</p>
        </div>
      </div>
    </div>
  );
};
