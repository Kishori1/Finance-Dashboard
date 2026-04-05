import React, { useMemo } from 'react';
import { useFinanceStore } from '../store/useFinanceStore';
import { motion } from 'framer-motion';
import {
  Target, ShoppingBag, Home, Truck, Zap, Film, HeartPulse, Utensils,
  TrendingDown, TrendingUp, AlertCircle, ArrowUpRight, ArrowDownRight,
  PieChart, BarChart3, Wallet, ShieldCheck, AlertTriangle, CheckCircle2,
  Flame, Calendar
} from 'lucide-react';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell,
  PieChart as RePieChart, Pie, Legend
} from 'recharts';

/* ── Category Icon Resolver ── */
const CategoryIcon = ({ icon, className }) => {
  const icons = {
    'utensils': Utensils,  'home': Home, 'car': Truck,
    'shopping-cart': ShoppingBag, 'zap': Zap, 'film': Film, 'heart': HeartPulse,
  };
  const IC = icons[icon] || Target;
  return <IC className={className} />;
};

/* ── Custom Tooltip ── */
const ChartTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="bg-slate-900 text-white text-xs px-3 py-2 rounded-xl shadow-xl border border-slate-700">
      <p className="font-bold">{d.name || d.category}</p>
      <p className="text-slate-300">Spent: ₹{(d.spent ?? d.value ?? 0).toLocaleString()}</p>
      {d.limit && <p className="text-slate-400">Limit: ₹{d.limit.toLocaleString()}</p>}
    </div>
  );
};

/* ── Color palette ── */
const COLORS = ['#3b82f6','#10b981','#f59e0b','#8b5cf6','#ef4444','#ec4899','#06b6d4'];

/* ═══════════════════════════════════════════
   SECTION 1 — Hero Overview
   ═══════════════════════════════════════════ */
const BudgetHero = ({ totalBudget, totalSpent, availableBudget, percentUsed, overCategories, healthLabel }) => {
  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const strokeDash = (percentUsed / 100) * circumference;
  const statusColor = percentUsed > 90 ? '#ef4444' : percentUsed > 70 ? '#f59e0b' : '#10b981';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-[32px] p-6 md:p-10 relative overflow-hidden"
    >
      {/* Background glow */}
      <div className="absolute -top-32 -right-32 w-80 h-80 rounded-full blur-[120px] pointer-events-none" style={{ background: `${statusColor}15` }} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        {/* Left — KPIs */}
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-bold text-text-primary mb-1">March, 2026</h3>
            <p className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">Monthly Budget Performance</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-500/10 to-blue-600/[0.02] border border-blue-500/20 shadow-sm relative overflow-hidden group/kpi">
              <div className="absolute -right-4 -top-4 w-12 h-12 bg-blue-500/10 rounded-full blur-xl group-hover/kpi:bg-blue-500/20 transition-colors" />
              <span className="text-[10px] font-black uppercase tracking-widest text-blue-500/80 mb-1 block">Total Budget</span>
              <p className="text-2xl font-bold text-text-primary">₹{totalBudget.toLocaleString()}</p>
            </div>
            <div className="p-4 rounded-2xl bg-gradient-to-br from-violet-500/10 to-violet-600/[0.02] border border-violet-500/20 shadow-sm relative overflow-hidden group/kpi">
              <div className="absolute -right-4 -top-4 w-12 h-12 bg-violet-500/10 rounded-full blur-xl group-hover/kpi:bg-violet-500/20 transition-colors" />
              <span className="text-[10px] font-black uppercase tracking-widest text-violet-500/80 mb-1 block">Total Spent</span>
              <p className="text-2xl font-bold text-text-primary">₹{Math.round(totalSpent).toLocaleString()}</p>
            </div>
            <div className={`p-4 rounded-2xl bg-gradient-to-br ${availableBudget >= 0 ? 'from-emerald-500/10 to-emerald-600/[0.02] border-emerald-500/20' : 'from-rose-500/10 to-rose-600/[0.02] border-rose-500/20'} border shadow-sm relative overflow-hidden group/kpi`}>
              <div className={`absolute -right-4 -top-4 w-12 h-12 ${availableBudget >= 0 ? 'bg-emerald-500/10' : 'bg-rose-500/10'} rounded-full blur-xl group-hover/kpi:opacity-100 transition-opacity opacity-50`} />
              <span className={`text-[10px] font-black uppercase tracking-widest mb-1 block ${availableBudget >= 0 ? 'text-emerald-500/80' : 'text-rose-500/80'}`}>Available</span>
              <p className={`text-2xl font-bold ${availableBudget >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                ₹{Math.abs(Math.round(availableBudget)).toLocaleString()}
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/10 to-orange-600/[0.02] border border-amber-500/20 shadow-sm relative overflow-hidden group/kpi">
              <div className="absolute -right-4 -top-4 w-12 h-12 bg-amber-500/10 rounded-full blur-xl group-hover/kpi:bg-amber-500/20 transition-colors" />
              <span className="text-[10px] font-black uppercase tracking-widest text-amber-500/80 mb-1 block">Alerts</span>
              <p className="text-2xl font-bold text-amber-500">{overCategories}</p>
            </div>
          </div>

          <div className={`flex items-center gap-2 p-3 rounded-2xl w-fit border ${
            percentUsed > 90 ? 'bg-rose-500/10 border-rose-500/20' : percentUsed > 70 ? 'bg-amber-500/10 border-amber-500/20' : 'bg-emerald-500/10 border-emerald-500/20'
          }`}>
            {percentUsed > 90 ? <AlertTriangle className="w-4 h-4 text-rose-500" /> :
             percentUsed > 70 ? <AlertCircle className="w-4 h-4 text-amber-500" /> :
             <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
            <p className="text-xs font-semibold text-text-secondary">{healthLabel}</p>
          </div>
        </div>

        {/* Right — Ring Gauge */}
        <div className="flex justify-center">
          <div className="relative w-52 h-52 md:w-60 md:h-60">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
              <circle cx="100" cy="100" r={radius} fill="none" strokeWidth="14"
                className="text-slate-100 dark:text-slate-800" stroke="currentColor" />
              <motion.circle
                cx="100" cy="100" r={radius} fill="none" strokeWidth="14"
                strokeLinecap="round" stroke={statusColor}
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset: circumference - strokeDash }}
                transition={{ duration: 1.5, ease: 'easeOut' }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-bold text-text-primary">{Math.round(percentUsed)}%</span>
              <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">Used</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

/* ═══════════════════════════════════════════
   SECTION 2 — Budget vs Actual Bar Chart
   ═══════════════════════════════════════════ */
const BudgetVsActual = ({ chartData }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    className="glass rounded-[32px] p-6 md:p-8"
  >
    <div className="flex items-center gap-2 mb-2">
      <BarChart3 className="w-4 h-4 text-blue-500" />
      <h3 className="text-lg font-bold text-text-primary tracking-tight">Budget vs Actual</h3>
    </div>
    <p className="text-xs text-text-secondary mb-6">Compare your planned budget against actual spending per category</p>

    <div className="flex gap-6 mb-4 text-[10px] font-bold uppercase tracking-widest text-text-secondary">
      <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-blue-500 inline-block" /> Budget</span>
      <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-emerald-500 inline-block" /> Actual</span>
    </div>

    <div className="h-[280px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} barGap={4} barCategoryGap="22%">
          <XAxis dataKey="short" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
          <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(100,116,139,0.06)' }} />
          <Bar dataKey="limit" radius={[6,6,0,0]} fill="#3b82f6" opacity={0.25} />
          <Bar dataKey="spent" radius={[6,6,0,0]}>
            {chartData.map((d, i) => (
              <Cell key={i} fill={d.spent > d.limit ? '#ef4444' : '#10b981'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  </motion.div>
);

/* ═══════════════════════════════════════════
   SECTION 3 — Spending Allocation Donut
   ═══════════════════════════════════════════ */
const SpendingAllocation = ({ chartData, totalSpent }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    className="glass rounded-[32px] p-6 md:p-8"
  >
    <div className="flex items-center gap-2 mb-2">
      <PieChart className="w-4 h-4 text-violet-500" />
      <h3 className="text-lg font-bold text-text-primary tracking-tight">Spending Allocation</h3>
    </div>
    <p className="text-xs text-text-secondary mb-6">Where your money is going this month</p>

    <div className="h-[260px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RePieChart>
          <Pie
            data={chartData}
            cx="50%" cy="50%"
            innerRadius={65} outerRadius={100}
            paddingAngle={3}
            dataKey="value"
          >
            {chartData.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<ChartTooltip />} />
        </RePieChart>
      </ResponsiveContainer>
    </div>

    <div className="grid grid-cols-2 gap-2 mt-4">
      {chartData.map((d, i) => (
        <div key={i} className="flex items-center gap-2 text-xs">
          <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: COLORS[i % COLORS.length] }} />
          <span className="text-text-secondary truncate">{d.name}</span>
          <span className="ml-auto font-bold text-text-primary">{d.pct}%</span>
        </div>
      ))}
    </div>
  </motion.div>
);

/* ═══════════════════════════════════════════
   SECTION 4 — Month-over-Month Spending Trend
   ═══════════════════════════════════════════ */
const MonthlyTrend = ({ stats }) => {
  const data = stats.monthlyComparison.map(m => ({
    month: m.month.split(' ')[0].slice(0, 3),
    expenses: m.expenses,
    budget: 14600, // total monthly budget
    savings: m.income - m.expenses,
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      className="glass rounded-[32px] p-6 md:p-8"
    >
      <div className="flex items-center gap-2 mb-2">
        <TrendingDown className="w-4 h-4 text-emerald-500" />
        <h3 className="text-lg font-bold text-text-primary tracking-tight">6-Month Spending Trend</h3>
      </div>
      <p className="text-xs text-text-secondary mb-6">Track your monthly expenses against your budget ceiling</p>

      <div className="h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barGap={2}>
            <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
            <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(100,116,139,0.06)' }} />
            <Bar dataKey="expenses" radius={[6,6,0,0]} fill="#8b5cf6" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Savings trend mini cards */}
      <div className="grid grid-cols-3 gap-3 mt-6">
        {data.slice(-3).map((m, i) => (
          <div key={i} className="p-3 rounded-xl bg-bg-surface border border-border-color text-center">
            <span className="text-[9px] font-black uppercase tracking-widest text-text-secondary">{m.month}</span>
            <p className={`text-sm font-bold mt-1 ${m.savings > 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
              {m.savings > 0 ? '+' : ''}₹{m.savings.toLocaleString()}
            </p>
            <span className="text-[9px] text-text-secondary">saved</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

/* ═══════════════════════════════════════════
   SECTION 5 — Budget Health Summary Cards
   ═══════════════════════════════════════════ */
const BudgetHealthCards = ({ budgetItems }) => {
  const overBudget = budgetItems.filter(b => b.progress > 100);
  const nearLimit = budgetItems.filter(b => b.progress > 80 && b.progress <= 100);
  const onTrack = budgetItems.filter(b => b.progress <= 80);

  const groups = [
    { label: 'Over Budget', items: overBudget, color: 'rose', icon: AlertTriangle, emptyMsg: 'No items over budget 🎉' },
    { label: 'Near Limit', items: nearLimit, color: 'amber', icon: AlertCircle, emptyMsg: 'No items near limit' },
    { label: 'On Track', items: onTrack, color: 'emerald', icon: CheckCircle2, emptyMsg: 'No items on track' },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}>
      <div className="flex items-center gap-2 mb-2">
        <ShieldCheck className="w-4 h-4 text-blue-500" />
        <h3 className="text-lg font-bold text-text-primary tracking-tight">Budget Health</h3>
      </div>
      <p className="text-xs text-text-secondary mb-5">Categorized status of your budget performance</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {groups.map(g => (
          <div key={g.label} className={`rounded-2xl p-5 border bg-gradient-to-br ${
            g.color === 'rose' ? 'from-rose-500/10 to-rose-600/[0.02] border-rose-500/20' :
            g.color === 'amber' ? 'from-amber-500/10 to-amber-600/[0.02] border-amber-500/20' :
            'from-emerald-500/10 to-emerald-600/[0.02] border-emerald-500/20'
          }`}>
            <div className="flex items-center gap-2 mb-4">
              <g.icon className={`w-4 h-4 text-${g.color}-500`} />
              <span className={`text-[10px] font-black uppercase tracking-widest text-${g.color}-500`}>{g.label}</span>
              <span className="ml-auto text-xs font-bold text-text-secondary">{g.items.length}</span>
            </div>
            {g.items.length === 0 ? (
              <p className="text-xs text-text-secondary italic">{g.emptyMsg}</p>
            ) : (
              <div className="space-y-3">
                {g.items.map(b => (
                  <div key={b.category} className="flex items-center gap-3">
                    <div className="p-1.5 rounded-lg bg-bg-surface border border-border-color">
                      <CategoryIcon icon={b.icon} className="w-3.5 h-3.5 text-text-secondary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-text-primary truncate">{b.category}</p>
                      <div className="h-1.5 w-full bg-bg-main rounded-full overflow-hidden mt-1">
                        <div className={`h-full rounded-full bg-${g.color}-500`} style={{ width: `${Math.min(b.progress, 100)}%` }} />
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-text-secondary">{Math.round(b.progress)}%</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
};

/* ═══════════════════════════════════════════
   SECTION 6 — Category Cards (Enhanced)
   ═══════════════════════════════════════════ */
const CategoryCards = ({ budgetItems }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}>
    <div className="flex justify-between items-end mb-5 px-1">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Wallet className="w-4 h-4 text-amber-500" />
          <h3 className="text-lg font-bold text-text-primary tracking-tight">Category Breakdown</h3>
        </div>
        <p className="text-xs text-text-secondary">Detailed view of each budgeted category</p>
      </div>
      <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">{budgetItems.length} categories</span>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {budgetItems.map((b, i) => {
        const isOver = b.spent > b.limit;
        const remaining = b.limit - b.spent;
        const dailyBurn = b.spent / 28;

        return (
          <motion.div
            key={b.category}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            whileHover={{ y: -3, transition: { duration: 0.2 } }}
            className={`rounded-2xl p-5 border shadow-sm group relative overflow-hidden bg-gradient-to-br ${
              i % 4 === 0 ? 'from-blue-500/[0.08] to-indigo-600/[0.02] border-blue-500/10' :
              i % 4 === 1 ? 'from-emerald-500/[0.08] to-teal-600/[0.02] border-emerald-500/10' :
              i % 4 === 2 ? 'from-amber-500/[0.08] to-orange-600/[0.02] border-amber-500/10' :
              'from-violet-500/[0.08] to-purple-600/[0.02] border-violet-500/10'
            }`}
          >
            {/* Over-budget glow */}
            {isOver && <div className="absolute -top-10 -right-10 w-24 h-24 bg-rose-500/10 rounded-full blur-2xl pointer-events-none" />}

            <div className="flex justify-between items-start mb-4 relative z-10">
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl shadow-inner border border-border-color transition-colors ${
                  isOver ? 'bg-rose-500/10' : 'bg-bg-main dark:bg-slate-800/80 group-hover:bg-blue-500/10'
                }`}>
                  <CategoryIcon icon={b.icon} className={`w-5 h-5 ${isOver ? 'text-rose-500' : 'text-text-secondary group-hover:text-blue-500'}`} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-text-primary">{b.category}</h4>
                  <p className="text-[10px] font-bold text-text-secondary">Limit: ₹{b.limit.toLocaleString()}</p>
                </div>
              </div>
              <div className="text-right">
                <span className={`text-sm font-bold ${isOver ? 'text-rose-500' : 'text-text-primary'}`}>
                  ₹{Math.round(b.spent).toLocaleString()}
                </span>
                <p className="text-[9px] font-bold text-text-secondary">{Math.round(b.progress)}% used</p>
              </div>
            </div>

            <div className="space-y-3 relative z-10">
              {/* Progress bar */}
              <div className="h-2.5 w-full bg-bg-main dark:bg-slate-800/50 rounded-full overflow-hidden shadow-inner border border-border-color">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(b.progress, 100)}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  className={`h-full rounded-full ${isOver ? 'bg-rose-500' : b.progress > 80 ? 'bg-amber-500' : 'bg-emerald-500'} shadow-sm`}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  {isOver ? <AlertCircle className="w-3.5 h-3.5 text-rose-500" /> :
                   <TrendingDown className="w-3.5 h-3.5 text-emerald-500" />}
                  <p className={`text-[10px] font-bold ${isOver ? 'text-rose-500' : 'text-text-secondary'}`}>
                    {isOver ? `₹${Math.abs(Math.round(remaining)).toLocaleString()} over` : `₹${Math.round(remaining).toLocaleString()} left`}
                  </p>
                </div>
                <div className="flex items-center gap-1 text-[9px] text-text-secondary font-bold">
                  <Flame className="w-3 h-3" />
                  ₹{Math.round(dailyBurn)}/day
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  </motion.div>
);

/* ═══════════════════════════════════════════
   MAIN EXPORT
   ═══════════════════════════════════════════ */
export const Budgets = () => {
  const { budgets, transactions, stats } = useFinanceStore();

  const currentMonth = '2026-03';
  const categorySpending = useMemo(() =>
    transactions.reduce((acc, t) => {
      if (t.date.startsWith(currentMonth) && t.type === 'Expense') {
        acc[t.category] = (acc[t.category] || 0) + Math.abs(parseFloat(t.amount));
      }
      return acc;
    }, {}), [transactions]
  );

  const totalBudget = budgets.reduce((sum, b) => sum + b.limit, 0);
  const totalSpent = Object.values(categorySpending).reduce((sum, s) => sum + s, 0);
  const availableBudget = totalBudget - totalSpent;
  const percentUsed = Math.min(100, Math.round((totalSpent / totalBudget) * 100));

  const budgetItems = budgets.map(b => {
    const spent = categorySpending[b.category] || 0;
    return { ...b, spent, progress: Math.round((spent / b.limit) * 100) };
  });

  const overCount = budgetItems.filter(b => b.progress > 100).length;

  const healthLabel =
    percentUsed > 90 ? 'Budget critical — reduce spending now!' :
    percentUsed > 70 ? 'Approaching your budget ceiling. Be cautious.' :
    'Great job! Your spending is well within budget.';

  // Chart data for Budget vs Actual
  const barChartData = budgetItems.map(b => ({
    name: b.category,
    short: b.category.split(' ')[0].slice(0, 6),
    limit: b.limit,
    spent: Math.round(b.spent),
  }));

  // Donut data
  const donutData = budgetItems.filter(b => b.spent > 0).map(b => ({
    name: b.category,
    value: Math.round(b.spent),
    pct: Math.round((b.spent / totalSpent) * 100),
  }));

  return (
    <div className="space-y-8 py-4 pb-20">
      {/* Page Header */}
      <div className="flex items-center gap-3">
        <div className="p-2.5 bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-xl shadow-lg shadow-emerald-500/20">
          <Target className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-text-primary tracking-tight">Budget Analysis</h2>
          <p className="text-text-secondary text-xs font-semibold tracking-tight uppercase">March 2026 • Performance Dashboard</p>
        </div>
      </div>

      {/* 1. Hero Overview */}
      <BudgetHero
        totalBudget={totalBudget}
        totalSpent={totalSpent}
        availableBudget={availableBudget}
        percentUsed={percentUsed}
        overCategories={overCount}
        healthLabel={healthLabel}
      />

      {/* 2 & 3. Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BudgetVsActual chartData={barChartData} />
        <SpendingAllocation chartData={donutData} totalSpent={totalSpent} />
      </div>

      {/* 4. Monthly Trend */}
      <MonthlyTrend stats={stats} />

      {/* 5. Budget Health Summary */}
      <BudgetHealthCards budgetItems={budgetItems} />

      {/* 6. Detailed Category Cards */}
      <CategoryCards budgetItems={budgetItems} />
    </div>
  );
};
