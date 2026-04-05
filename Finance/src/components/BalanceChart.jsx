import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { useFinanceStore } from '../store/useFinanceStore';

export const BalanceChart = () => {
  const { stats, isDark } = useFinanceStore();
  
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-3 rounded-xl border border-slate-200 dark:border-slate-700/50 shadow-2xl">
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-1">{label}</p>
          <p className="text-lg font-bold text-slate-900 dark:text-slate-50">
            ₹{payload[0].value.toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
  };

  const gridColor = isDark ? 'rgba(255, 255, 255, 0.05)' : '#E2E8F0';
  const tickColor = isDark ? '#64748b' : '#94a3b8';

  return (
    <div className="h-[280px] md:h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={stats.balanceTrend} margin={{ top: 10, right: 10, left: 0, bottom: 50 }}>
            <defs>
              <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={isDark ? 0.4 : 0.3}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
            <XAxis 
              dataKey="month" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: tickColor, fontSize: 10 }}
              dy={10}
              height={60}
            />
            <YAxis 
              width={45}
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: tickColor, fontSize: 10 }}
              tickFormatter={(value) => `₹${value / 1000}k`}
            />
          <Tooltip content={<CustomTooltip />} />
          <Area 
            type="monotone" 
            dataKey="balance" 
            stroke="#3b82f6" 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorBalance)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
