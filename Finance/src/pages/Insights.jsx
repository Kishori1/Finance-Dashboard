import { 
  Lightbulb, TrendingDown, Target, Zap, Repeat, BarChart2, 
  ShieldCheck, Flame, Trophy, ChevronRight, CalendarDays,
  ArrowUpRight, ArrowDownRight, Activity, Wallet, PiggyBank
} from 'lucide-react';
import { useFinanceStore } from '../store/useFinanceStore';
import { motion } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell, 
  AreaChart, Area, CartesianGrid,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';

/* ─────────────────────────────────────────────
   Animated Counter Hook
   ───────────────────────────────────────────── */
const useAnimatedCounter = (target, duration = 1.5) => {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let startTime = null;
    let animFrame;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      // easeOut cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) {
        animFrame = requestAnimationFrame(step);
      }
    };
    animFrame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animFrame);
  }, [target, duration]);
  return value;
};

/* ─────────────────────────────────────────────
   1. FINANCIAL HEALTH SCORE — Hero Gauge
   ───────────────────────────────────────────── */
const HealthScoreGauge = ({ score }) => {
  const { isDark } = useFinanceStore();
  const animatedScore = useAnimatedCounter(score, 2);
  const radius = 90;
  const circumference = 2 * Math.PI * radius * 0.75; // 270-degree arc
  const offset = circumference - (circumference * (score / 100));

  const getGrade = (s) => {
    if (s >= 90) return { grade: 'A+', color: '#10b981', label: 'Excellent' };
    if (s >= 80) return { grade: 'A', color: '#22c55e', label: 'Great' };
    if (s >= 70) return { grade: 'B+', color: '#84cc16', label: 'Good' };
    if (s >= 60) return { grade: 'B', color: '#eab308', label: 'Fair' };
    if (s >= 50) return { grade: 'C', color: '#f97316', label: 'Needs Work' };
    return { grade: 'D', color: '#ef4444', label: 'Poor' };
  };

  const { grade, color, label } = getGrade(score);

  const factors = [
    { name: 'Savings Rate', value: 39.2, max: 50, icon: PiggyBank },
    { name: 'Budget Adherence', value: 85, max: 100, icon: Target },
    { name: 'Spending Trend', value: 72, max: 100, icon: TrendingDown },
    { name: 'Income Stability', value: 95, max: 100, icon: Activity },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-[32px] p-6 md:p-10 relative overflow-hidden"
    >
      {/* Decorative blurs */}
      <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full blur-[100px] pointer-events-none" style={{ background: `${color}20` }} />
      <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-violet-500/10 rounded-full blur-[80px] pointer-events-none" />

      <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
        {/* Gauge */}
        <div className="relative flex-shrink-0">
          <svg width="220" height="200" viewBox="0 0 220 200" className="drop-shadow-xl">
            <defs>
              <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={color} />
                <stop offset="100%" stopColor="#8b5cf6" />
              </linearGradient>
            </defs>
            {/* Background arc */}
            <circle 
              cx="110" cy="120" r={radius}
              fill="none"
              stroke={isDark ? '#1e293b' : '#e2e8f0'}
              strokeWidth="14"
              strokeDasharray={circumference}
              strokeDashoffset={circumference * 0.25}
              strokeLinecap="round"
              transform="rotate(135 110 120)"
            />
            {/* Active arc */}
            <motion.circle 
              cx="110" cy="120" r={radius}
              fill="none"
              stroke="url(#gaugeGrad)"
              strokeWidth="14"
              strokeDasharray={circumference}
              strokeLinecap="round"
              transform="rotate(135 110 120)"
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: offset }}
              transition={{ duration: 2, ease: 'easeOut' }}
              style={{ filter: `drop-shadow(0 0 8px ${color}40)` }}
            />
          </svg>
          {/* Center text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ top: '20px' }}>
            <span className="text-5xl font-black tracking-tight text-text-primary">{animatedScore}</span>
            <span className="text-xs font-bold uppercase tracking-widest mt-0.5" style={{ color }}>{grade} — {label}</span>
          </div>
        </div>

        {/* Factor breakdown */}
        <div className="flex-1 w-full space-y-5">
          <div>
            <h3 className="text-xl md:text-2xl font-bold text-text-primary tracking-tight">Financial Health Score</h3>
            <p className="text-text-secondary text-xs font-medium mt-1">Composite score based on your spending habits, savings, and budget discipline</p>
          </div>
          <div className="space-y-3.5">
            {factors.map((f) => {
              const pct = Math.min((f.value / f.max) * 100, 100);
              return (
                <div key={f.name} className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <f.icon className="w-3.5 h-3.5 text-text-secondary" />
                      <span className="text-xs font-bold text-text-secondary">{f.name}</span>
                    </div>
                    <span className="text-xs font-black text-text-primary">{f.value}{f.max === 100 ? '%' : '%'}</span>
                  </div>
                  <div className="h-2 w-full bg-bg-main dark:bg-slate-800/60 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${pct}%` }}
                      transition={{ duration: 1.2, delay: 0.2 }}
                      className="h-full rounded-full"
                      style={{ background: `linear-gradient(90deg, ${color}, #8b5cf6)` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

/* ─────────────────────────────────────────────
   2. INCOME vs EXPENSES TREND (6-Month)
   ───────────────────────────────────────────── */
const IncomeVsExpenses = () => {
  const { stats, isDark } = useFinanceStore();
  const data = stats.monthlyComparison.map(m => ({
    ...m,
    month: m.month.replace('2025', "'25").replace('2026', "'26"),
    savings: m.income - m.expenses,
  }));

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="bg-slate-900/95 dark:bg-slate-800/95 backdrop-blur-xl rounded-xl px-4 py-3 shadow-2xl border border-white/10 text-white min-w-[160px]">
        <p className="text-[10px] font-bold uppercase tracking-widest text-white/50 mb-2">{label}</p>
        {payload.map((p, i) => (
          <div key={i} className="flex justify-between items-center gap-4 text-xs font-bold">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
              {p.name}
            </span>
            <span>₹{p.value.toLocaleString()}</span>
          </div>
        ))}
      </div>
    );
  };

  const latestSavings = data[data.length - 1].savings;
  const prevSavings = data[data.length - 2].savings;
  const savingsDelta = ((latestSavings - prevSavings) / prevSavings * 100).toFixed(1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      className="glass rounded-[32px] p-6 md:p-8 relative overflow-hidden"
    >
      <div className="absolute -top-16 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-[80px] pointer-events-none" />
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h3 className="text-xl font-bold text-text-primary tracking-tight">Income vs Expenses</h3>
          <p className="text-text-secondary text-xs font-medium mt-0.5">6-month cash flow overview</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-text-secondary">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> Income
            </span>
            <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-text-secondary">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Expenses
            </span>
          </div>
          <div className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-black ${
            savingsDelta >= 0 
              ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600' 
              : 'bg-rose-100 dark:bg-rose-900/30 text-rose-600'
          }`}>
            {savingsDelta >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
            {Math.abs(savingsDelta)}%
          </div>
        </div>
      </div>

      <div className="h-[260px] md:h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#1e293b' : '#f1f5f9'} />
            <XAxis 
              dataKey="month" 
              tick={{ fontSize: 10, fontWeight: 700, fill: isDark ? '#64748b' : '#94a3b8' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis 
              tick={{ fontSize: 10, fontWeight: 700, fill: isDark ? '#64748b' : '#94a3b8' }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `₹${(v/1000).toFixed(0)}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="income" name="Income" stroke="#3b82f6" fill="url(#incomeGrad)" strokeWidth={2.5} dot={{ r: 4, fill: '#3b82f6', stroke: '#fff', strokeWidth: 2 }} />
            <Area type="monotone" dataKey="expenses" name="Expenses" stroke="#f43f5e" fill="url(#expenseGrad)" strokeWidth={2.5} dot={{ r: 4, fill: '#f43f5e', stroke: '#fff', strokeWidth: 2 }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Mini stat cards below chart */}
      <div className="grid grid-cols-3 gap-3 mt-6">
        {[
          { label: 'Avg Income', value: `₹${(data.reduce((s,d)=>s+d.income,0)/data.length/1000).toFixed(1)}k`, color: 'text-blue-500' },
          { label: 'Avg Expenses', value: `₹${(data.reduce((s,d)=>s+d.expenses,0)/data.length/1000).toFixed(1)}k`, color: 'text-rose-500' },
          { label: 'Avg Savings', value: `₹${(data.reduce((s,d)=>s+d.savings,0)/data.length/1000).toFixed(1)}k`, color: 'text-emerald-500' },
        ].map((s) => (
          <div key={s.label} className="bg-bg-main dark:bg-slate-800/40 rounded-2xl p-3 text-center border border-border-color">
            <p className="text-[9px] font-black uppercase tracking-widest text-text-secondary mb-1">{s.label}</p>
            <p className={`text-lg font-black ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

/* ─────────────────────────────────────────────
   3. SPENDING VELOCITY METER
   ───────────────────────────────────────────── */
const SpendingVelocity = () => {
  const monthlyBudget = 5000;
  const spent = 4380;
  const daysInMonth = 31;
  const daysPassed = 28;
  const dailyRate = spent / daysPassed;
  const budgetPace = monthlyBudget / daysInMonth;
  const projected = dailyRate * daysInMonth;
  const pctUsed = (spent / monthlyBudget) * 100;
  const pctPace = (daysPassed / daysInMonth) * 100;

  const status = projected <= monthlyBudget 
    ? { label: 'On Track', color: '#10b981', bg: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600' }
    : projected <= monthlyBudget * 1.1 
    ? { label: 'Caution', color: '#f59e0b', bg: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600' }
    : { label: 'Over Budget', color: '#ef4444', bg: 'bg-rose-100 dark:bg-rose-900/30 text-rose-600' };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      className="glass rounded-[32px] p-6 md:p-8 relative overflow-hidden"
    >
      <div className="absolute -bottom-16 -right-16 w-48 h-48 rounded-full blur-[80px] pointer-events-none" style={{ background: `${status.color}15` }} />
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-bg-main dark:bg-slate-800 border border-border-color shadow-sm">
            <Flame className="w-5 h-5" style={{ color: status.color }} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-text-primary tracking-tight">Spending Velocity</h3>
            <p className="text-text-secondary text-xs font-medium">₹{dailyRate.toFixed(0)}/day — Projected ₹{projected.toFixed(0)}/month</p>
          </div>
        </div>
        <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${status.bg}`}>
          {status.label}
        </span>
      </div>

      {/* Main velocity bar */}
      <div className="relative mb-4">
        <div className="h-5 w-full bg-bg-main dark:bg-slate-800/60 rounded-full overflow-hidden shadow-inner">
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: `${Math.min(pctUsed, 100)}%` }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            className="h-full rounded-full relative"
            style={{ background: `linear-gradient(90deg, ${status.color}88, ${status.color})` }}
          >
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white shadow-lg border-2" style={{ borderColor: status.color }} />
          </motion.div>
        </div>
        {/* Budget pace marker */}
        <div 
          className="absolute top-0 h-5 border-r-2 border-dashed border-slate-400 dark:border-slate-500"
          style={{ left: `${pctPace}%` }}
        >
          <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[8px] font-bold text-text-secondary whitespace-nowrap">
            Day {daysPassed}/{daysInMonth}
          </span>
        </div>
      </div>

      <div className="flex justify-between text-[10px] font-bold text-text-secondary mb-6">
        <span>₹0</span>
        <span>Budget: ₹{monthlyBudget.toLocaleString()}</span>
      </div>

      {/* Velocity stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Daily Rate', value: `₹${dailyRate.toFixed(0)}`, sub: 'per day' },
          { label: 'Budget Pace', value: `₹${budgetPace.toFixed(0)}`, sub: 'per day' },
          { label: 'Spent So Far', value: `₹${spent.toLocaleString()}`, sub: `${pctUsed.toFixed(0)}% of budget` },
          { label: 'Remaining', value: `₹${(monthlyBudget - spent).toLocaleString()}`, sub: `${daysInMonth - daysPassed} days left` },
        ].map((s) => (
          <div key={s.label} className="bg-bg-main dark:bg-slate-800/40 rounded-2xl p-3 border border-border-color">
            <p className="text-[9px] font-black uppercase tracking-widest text-text-secondary mb-1">{s.label}</p>
            <p className="text-base font-black text-text-primary">{s.value}</p>
            <p className="text-[9px] font-medium text-text-secondary">{s.sub}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

/* ─────────────────────────────────────────────
   4. AI SMART TIP CARD
   ───────────────────────────────────────────── */
const InsightCard = ({ icon: Icon, title, detail, color, trendData, type = 'bar', index = 0 }) => {
  const { isDark } = useFinanceStore();
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      whileHover={{ y: -4, scale: 1.02 }}
      className={`bg-bg-card dark:bg-slate-900/50 backdrop-blur-xl rounded-2xl p-5 border border-border-color border-l-4 ${color} relative overflow-hidden shadow-lg`}
    >
      <div className="flex gap-3 mb-4">
        <div className="p-2.5 rounded-xl bg-bg-main dark:bg-slate-800 shadow-sm border border-border-color">
          <Icon className="w-4 h-4 text-[var(--accent-primary)]" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-text-primary tracking-tight leading-tight mb-0.5">{title}</h4>
          <p className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">{detail.subtitle || 'Insight'}</p>
        </div>
      </div>
      
      <p className="text-xs font-medium text-text-secondary leading-relaxed mb-4">
        {detail.text}
      </p>

      {trendData && (
        <div className="h-20 w-full">
          <ResponsiveContainer width="100%" height="100%">
            {type === 'bar' ? (
              <BarChart data={trendData}>
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {trendData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color || '#3b82f6'} fillOpacity={0.8} />
                  ))}
                </Bar>
              </BarChart>
            ) : (
              <AreaChart data={trendData}>
                <Area type="monotone" dataKey="value" stroke="var(--accent-primary)" fill="var(--accent-primary)" fillOpacity={isDark ? 0.2 : 0.1} strokeWidth={2} />
              </AreaChart>
            )}
          </ResponsiveContainer>
        </div>
      )}
    </motion.div>
  );
};

/* ─────────────────────────────────────────────
   5. SAVINGS MILESTONES TIMELINE
   ───────────────────────────────────────────── */
const SavingsMilestones = () => {
  const milestones = [
    { amount: 5000, date: 'Oct 2025', reached: true, label: 'First ₹5k saved' },
    { amount: 10000, date: 'Dec 2025', reached: true, label: 'Hit ₹10k milestone' },
    { amount: 14820, date: 'Mar 2026', reached: true, label: 'Current savings', current: true },
    { amount: 20000, date: 'Jul 2026', reached: false, label: 'Next goal — ₹20k' },
    { amount: 50000, date: 'Mar 2027', reached: false, label: 'Long-term target' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      className="glass rounded-[32px] p-6 md:p-8 relative overflow-hidden"
    >
      <div className="absolute -top-16 -left-16 w-48 h-48 bg-emerald-500/10 rounded-full blur-[80px] pointer-events-none" />
      
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2.5 rounded-xl bg-emerald-600 text-white shadow-lg shadow-emerald-500/20">
          <Trophy className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-text-primary tracking-tight">Savings Milestones</h3>
          <p className="text-text-secondary text-xs font-medium">Your journey to financial freedom</p>
        </div>
      </div>

      <div className="relative ml-4 md:ml-8">
        {/* Vertical line */}
        <div className="absolute left-3 top-2 bottom-2 w-0.5 bg-gradient-to-b from-emerald-500 via-emerald-300 to-slate-200 dark:to-slate-700" />
        
        <div className="space-y-6">
          {milestones.map((m, i) => (
            <motion.div
              key={m.amount}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.12 }}
              className="relative flex items-start gap-5 pl-2"
            >
              {/* Node */}
              <div className={`relative z-10 flex-shrink-0 w-6 h-6 rounded-full border-[3px] flex items-center justify-center ${
                m.current 
                  ? 'bg-emerald-500 border-emerald-300 shadow-lg shadow-emerald-500/30 ring-4 ring-emerald-500/20' 
                  : m.reached 
                  ? 'bg-emerald-500 border-emerald-300' 
                  : 'bg-bg-surface dark:bg-slate-800 border-slate-300 dark:border-slate-600'
              }`}>
                {m.reached && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
              </div>

              {/* Content */}
              <div className={`flex-1 pb-2 ${m.current ? '' : ''}`}>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-1">
                  <div>
                    <p className={`text-sm font-bold tracking-tight ${m.reached ? 'text-text-primary' : 'text-text-secondary'}`}>
                      {m.label}
                    </p>
                    <p className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">{m.date}</p>
                  </div>
                  <span className={`text-base font-black ${
                    m.current ? 'text-emerald-500' : m.reached ? 'text-text-primary' : 'text-text-secondary'
                  }`}>
                    ₹{m.amount.toLocaleString()}
                  </span>
                </div>
                {m.current && (
                  <div className="mt-2 px-3 py-1.5 bg-emerald-100 dark:bg-emerald-900/20 rounded-lg inline-flex items-center gap-1.5">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                    </span>
                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">You are here</span>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

/* ─────────────────────────────────────────────
   6. CATEGORY DEEP DIVE (with Radar chart)
   ───────────────────────────────────────────── */
const CategoryDeepDive = () => {
  const { isDark } = useFinanceStore();

  const categories = [
    { name: 'Groceries', value: 44, amount: 347.20, color: 'bg-blue-500' },
    { name: 'Restaurants', value: 28, amount: 218.40, color: 'bg-emerald-500' },
    { name: 'Coffee', value: 11, amount: 87.25, color: 'bg-amber-500' },
    { name: 'Delivery', value: 12, amount: 98.30, color: 'bg-rose-500' },
    { name: 'Snacks/Other', value: 5, amount: 37.00, color: 'bg-indigo-500' },
  ];

  const radarData = [
    { category: 'Housing', thisMonth: 1400, lastMonth: 1400 },
    { category: 'Food', thisMonth: 788, lastMonth: 850 },
    { category: 'Transport', thisMonth: 525, lastMonth: 480 },
    { category: 'Shopping', thisMonth: 438, lastMonth: 650 },
    { category: 'Utilities', thisMonth: 350, lastMonth: 320 },
    { category: 'Fun', thisMonth: 307, lastMonth: 370 },
    { category: 'Health', thisMonth: 263, lastMonth: 230 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      className="glass rounded-[32px] p-6 md:p-8"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-3">
        <div>
          <h3 className="text-xl font-bold text-text-primary tracking-tight">Category Deep Dive</h3>
          <p className="text-text-secondary text-xs font-medium mt-0.5">Food & Dining breakdown + comparison radar</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-1.5 bg-bg-surface dark:bg-slate-800 border border-border-color rounded-xl text-[10px] font-bold text-text-primary uppercase tracking-widest shadow-sm">
          <CalendarDays className="w-3 h-3" />
          March 2026
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10">
        {/* Bar breakdown */}
        <div className="space-y-4">
          <h4 className="text-[10px] font-black uppercase text-text-secondary tracking-widest ml-1">Food & Dining Breakdown</h4>
          {categories.map((cat, i) => (
            <motion.div 
              key={cat.name} 
              className="space-y-1.5"
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              <div className="flex justify-between items-end">
                <span className="text-xs font-bold text-text-secondary">{cat.name}</span>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-text-secondary">{cat.value}%</span>
                  <span className="text-xs font-bold text-text-primary">₹{cat.amount}</span>
                </div>
              </div>
              <div className="h-2.5 w-full bg-bg-main dark:bg-slate-800/50 rounded-full overflow-hidden shadow-inner">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${cat.value}%` }}
                  transition={{ duration: 1, delay: i * 0.1 }}
                  className={`h-full ${cat.color} rounded-full shadow-lg`}
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Radar chart */}
        <div>
          <h4 className="text-[10px] font-black uppercase text-text-secondary tracking-widest ml-1 mb-4">This Month vs Last Month</h4>
          <div className="flex items-center gap-4 mb-2 ml-1">
            <span className="flex items-center gap-1.5 text-[10px] font-bold text-text-secondary">
              <span className="w-2 h-2 rounded-full bg-blue-500" /> March
            </span>
            <span className="flex items-center gap-1.5 text-[10px] font-bold text-text-secondary">
              <span className="w-2 h-2 rounded-full bg-violet-500" /> February
            </span>
          </div>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke={isDark ? '#334155' : '#e2e8f0'} />
                <PolarAngleAxis 
                  dataKey="category" 
                  tick={{ fontSize: 10, fontWeight: 700, fill: isDark ? '#94a3b8' : '#64748b' }} 
                />
                <Radar name="March" dataKey="thisMonth" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} strokeWidth={2} />
                <Radar name="February" dataKey="lastMonth" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.1} strokeWidth={2} strokeDasharray="4 4" />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

/* ─────────────────────────────────────────────
   7. DAILY SPENDING HEATMAP (Enhanced)
   ───────────────────────────────────────────── */
const DailyHeatmap = () => {
  const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  // Generate mock daily spending data for 31 days
  const dailyData = Array.from({ length: 31 }, (_, i) => {
    const day = i + 1;
    // Create realistic spending patterns
    const baseAmount = [1,5,8,15,22,25].includes(day) ? 450 + Math.random() * 200  // High spend days 
      : [2,6,9,16,23,26].includes(day) ? 200 + Math.random() * 150  // Medium spend days
      : [7,14,21,28].includes(day) ? 50 + Math.random() * 50  // Low spend (weekends/rest)
      : 100 + Math.random() * 100;  // Normal days
    return { day, amount: Math.round(baseAmount) };
  });

  const maxSpend = Math.max(...dailyData.map(d => d.amount));

  const getIntensity = (amount) => {
    const ratio = amount / maxSpend;
    if (ratio > 0.75) return { bg: 'bg-rose-500', ring: 'ring-rose-500/20', label: 'High' };
    if (ratio > 0.5) return { bg: 'bg-amber-500', ring: 'ring-amber-500/20', label: 'Medium' };
    if (ratio > 0.25) return { bg: 'bg-emerald-400 dark:bg-emerald-500', ring: 'ring-emerald-400/20', label: 'Low' };
    return { bg: 'bg-emerald-200 dark:bg-emerald-700', ring: '', label: 'Minimal' };
  };

  const [hoveredDay, setHoveredDay] = useState(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      className="glass rounded-[32px] p-6 md:p-8"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-bg-main dark:bg-slate-800 border border-border-color shadow-sm">
            <CalendarDays className="w-5 h-5 text-blue-500" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-text-primary tracking-tight">Daily Spending Heatmap</h3>
            <p className="text-text-secondary text-xs font-medium">March 2026 — spending intensity by day</p>
          </div>
        </div>
        {/* Legend */}
        <div className="flex items-center gap-2">
          <span className="text-[9px] font-bold text-text-secondary">Less</span>
          <div className="flex gap-1">
            <div className="w-4 h-4 rounded bg-emerald-200 dark:bg-emerald-700" />
            <div className="w-4 h-4 rounded bg-emerald-400 dark:bg-emerald-500" />
            <div className="w-4 h-4 rounded bg-amber-500" />
            <div className="w-4 h-4 rounded bg-rose-500" />
          </div>
          <span className="text-[9px] font-bold text-text-secondary">More</span>
        </div>
      </div>

      {/* Day labels */}
      <div className="grid grid-cols-7 gap-1.5 mb-1.5">
        {dayLabels.map(d => (
          <div key={d} className="text-center text-[8px] font-black uppercase text-text-secondary tracking-widest">{d}</div>
        ))}
      </div>

      {/* Heatmap grid */}
      <div className="grid grid-cols-7 gap-1.5 relative">
        {/* Empty cells for offset (March 2026 starts on Sunday = 6 empty Mon-Sat) */}
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={`empty-${i}`} className="aspect-square rounded-lg" />
        ))}
        {dailyData.map((d) => {
          const intensity = getIntensity(d.amount);
          return (
            <motion.div
              key={d.day}
              className={`aspect-square rounded-lg ${intensity.bg} cursor-pointer relative transition-all duration-200 ${
                hoveredDay === d.day ? `scale-110 ring-4 ${intensity.ring} z-10 shadow-lg` : 'shadow-sm'
              }`}
              onMouseEnter={() => setHoveredDay(d.day)}
              onMouseLeave={() => setHoveredDay(null)}
              whileHover={{ scale: 1.15 }}
            >
              {/* Day number */}
              <span className="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-white/80">{d.day}</span>
              
              {/* Tooltip */}
              {hoveredDay === d.day && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute -top-12 left-1/2 -translate-x-1/2 bg-slate-900/95 text-white rounded-lg px-3 py-1.5 text-[10px] font-bold whitespace-nowrap z-50 shadow-xl"
                >
                  Day {d.day} — ₹{d.amount}
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-2 h-2 bg-slate-900/95 rotate-45" />
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Week labels */}
      <div className="flex justify-between pt-3 text-[9px] font-black uppercase text-text-secondary tracking-tighter px-1">
        <span>Week 1</span>
        <span>Week 2</span>
        <span>Week 3</span>
        <span>Week 4</span>
        <span>Week 5</span>
      </div>
    </motion.div>
  );
};

/* ─────────────────────────────────────────────
   MAIN INSIGHTS PAGE
   ───────────────────────────────────────────── */
export const Insights = () => {
  const housingData = [
    { name: 'Housing', value: 32, color: '#3b82f6' },
    { name: 'Other', value: 68, color: '#e2e8f0' }
  ];

  const foodTrend = [
    { value: 702 }, { value: 750 }, { value: 788 }, { value: 880 }
  ];

  const insightCards = [
    {
      icon: BarChart2,
      title: "Housing is your biggest expense",
      color: "border-blue-500",
      detail: { subtitle: "Budget Allocation", text: "Housing costs account for 32% of your total spending—₹1,400 this month. This is within the recommended 30–35% range." },
      trendData: housingData,
    },
    {
      icon: TrendingDown,
      title: "Spending is down 5.4%",
      color: "border-emerald-500",
      detail: { subtitle: "Monthly Progress", text: "March expenses: ₹4,380 vs. February: ₹4,632. Your biggest reduction was in Shopping (-₹210)." },
      trendData: [{ value: 4632 }, { value: 4380 }],
    },
    {
      icon: Zap,
      title: "Food spending is trending up",
      color: "border-amber-500",
      detail: { subtitle: "Alert", text: "Your Food & Dining expenses have increased 12% over the last 3 months. At this rate, you'll spend ₹880 next month." },
      trendData: foodTrend,
      type: "area",
    },
    {
      icon: Target,
      title: "₹20k Savings Milestone",
      color: "border-emerald-500",
      detail: { subtitle: "Achievement", text: "Total savings since Oct 2025: ₹14,820. At your current rate, you'll hit ₹20,000 by July 2026." },
      trendData: [{ value: 14820 }],
    },
    {
      icon: Repeat,
      title: "Subscription Review",
      color: "border-violet-500",
      detail: { subtitle: "Recurring Costs", text: "You have 6 active subscriptions totalling ₹142/month. Consider reviewing if all are still needed." },
    },
  ];

  return (
    <div className="space-y-8 py-4 pb-20">
      {/* Page Header */}
      <div className="flex items-center gap-3">
        <div className="p-2.5 bg-gradient-to-br from-amber-500 to-orange-600 text-white rounded-xl shadow-lg shadow-amber-500/20">
          <Lightbulb className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-text-primary tracking-tight">Financial Insights</h2>
          <p className="text-text-secondary text-xs font-semibold tracking-tight">AI-powered analytics and patterns from your activity</p>
        </div>
      </div>

      {/* 1. Financial Health Score */}
      <HealthScoreGauge score={78} />

      {/* 2. Income vs Expenses */}
      <IncomeVsExpenses />

      {/* 3. Spending Velocity */}
      <SpendingVelocity />

      {/* 4. AI Smart Tips — Horizontal scroll on mobile, grid on desktop */}
      <div className="overflow-hidden">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-500" />
            <h3 className="text-lg font-bold text-text-primary tracking-tight">Smart Insights</h3>
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest text-text-secondary">{insightCards.length} tips</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {insightCards.map((card, i) => (
            <InsightCard key={i} {...card} index={i} />
          ))}
        </div>
      </div>

      {/* 5. Savings Milestones */}
      <SavingsMilestones />

      {/* 6. Category Deep Dive + Radar */}
      <CategoryDeepDive />

      {/* 7. Daily Heatmap */}
      <DailyHeatmap />
    </div>
  );
};
