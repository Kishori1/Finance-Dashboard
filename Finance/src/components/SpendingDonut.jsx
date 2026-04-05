import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useFinanceStore } from '../store/useFinanceStore';

export const SpendingDonut = () => {
  const { stats, isDark } = useFinanceStore();

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-3 rounded-xl border border-slate-200 dark:border-slate-700/50 shadow-2xl">
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-1">{payload[0].name}</p>
          <p className="text-lg font-bold text-slate-900 dark:text-slate-50">
            ₹{payload[0].value.toLocaleString()} ({payload[0].payload.value}%)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-[300px] w-full flex flex-col items-center">
      <ResponsiveContainer width="100%" height="80%">
        <PieChart>
          <Pie
            data={stats.spendingBreakdown}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="amount"
            nameKey="name"
            stroke="none"
          >
            {stats.spendingBreakdown.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 mt-4 text-[10px] sm:text-xs w-full px-4 overflow-y-auto max-h-[100px]">
        {stats.spendingBreakdown.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
            <span className="text-slate-500 font-medium truncate">{item.name}</span>
            <span className="text-slate-900 dark:text-slate-300 font-bold ml-auto">{item.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};
