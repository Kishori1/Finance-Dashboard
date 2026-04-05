import React from 'react';
import { useFinanceStore } from '../store/useFinanceStore';
import { motion } from 'framer-motion';
import { 
  ChevronLeft, 
  Target, 
  ShoppingBag, 
  Home, 
  Truck, 
  Zap, 
  Film, 
  HeartPulse, 
  Utensils,
  ArrowUpRight,
  TrendingDown,
  TrendingUp,
  AlertCircle
} from 'lucide-react';

const CategoryIcon = ({ icon, className }) => {
  const icons = {
    'utensils': Utensils,
    'home': Home,
    'car': Truck,
    'shopping-cart': ShoppingBag,
    'zap': Zap,
    'film': Film,
    'heart': HeartPulse,
  };
  const IconComponent = icons[icon] || Target;
  return <IconComponent className={className} />;
};

export const Budgets = () => {
  const { budgets, transactions } = useFinanceStore();

  // Calculate actual spending per category for current month (March 2026)
  const currentMonth = '2026-03';
  const categorySpending = transactions.reduce((acc, t) => {
    if (t.date.startsWith(currentMonth) && t.type === 'Expense') {
      acc[t.category] = (acc[t.category] || 0) + Math.abs(parseFloat(t.amount));
    }
    return acc;
  }, {});

  const totalBudget = budgets.reduce((sum, b) => sum + b.limit, 0);
  const totalSpent = Object.values(categorySpending).reduce((sum, s) => sum + s, 0);
  const availableBudget = totalBudget - totalSpent;
  const percentLeft = Math.max(0, Math.round((availableBudget / totalBudget) * 100));

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-3 bg-amber-500 text-white rounded-2xl shadow-xl shadow-amber-500/20">
          <Target className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50 tracking-tight">Budget Analysis</h2>
          <p className="text-slate-500 text-xs font-semibold tracking-tight uppercase">March 2026 • Performance</p>
        </div>
      </div>

      {/* Overview Card (Image 2 style) */}
      <div className="bg-[var(--bg-card)] dark:bg-slate-900/40 backdrop-blur-xl rounded-[32px] p-6 md:p-10 border border-[var(--border-color)] shadow-xl relative overflow-hidden group">
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-amber-500/5 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="space-y-8">
            <div>
               <h3 className="text-xl font-bold text-slate-900 dark:text-slate-50 mb-1">March, 2026</h3>
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Total Budget: ₹{totalBudget.toLocaleString()}</p>
            </div>

            <div className="space-y-6">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Spent</span>
                <span className="text-3xl font-bold text-slate-900 dark:text-slate-50">₹{totalSpent.toLocaleString()}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Available Budget</span>
                <span className="text-2xl font-bold text-slate-500 dark:text-slate-400">₹{availableBudget.toLocaleString()}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 p-3 bg-[var(--bg-main)] dark:bg-slate-800/50 rounded-2xl w-fit border border-[var(--border-color)]">
              <TrendingDown className="w-4 h-4 text-emerald-500" />
              <p className="text-xs font-semibold text-[var(--text-secondary)]">Great job! You are under your budget.</p>
            </div>
          </div>

          <div className="flex justify-center md:justify-end">
            <div className="relative w-48 h-48 md:w-56 md:h-56">
                {/* Circular Progress (Image 2 style) */}
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="50%"
                    cy="50%"
                    r="45%"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="12"
                    className="text-slate-100 dark:text-slate-800"
                  />
                  <circle
                    cx="50%"
                    cy="50%"
                    r="45%"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="12"
                    strokeDasharray="283"
                    strokeDashoffset={283 - (283 * (100 - percentLeft)) / 100}
                    strokeLinecap="round"
                    className="text-emerald-500"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center transform rotate-0">
                  <span className="text-4xl font-bold text-slate-900 dark:text-slate-50">{percentLeft}%</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Left</span>
                </div>
            </div>
          </div>
        </div>
      </div>

      {/* Budgeted Categories (Image 2 style) */}
      <div className="space-y-4">
        <div className="flex justify-between items-end px-2">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Budgeted categories</h3>
            <span className="text-[10px] font-bold text-slate-400">{budgets.length} categories</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {budgets.map((b) => {
            const spent = categorySpending[b.category] || 0;
            const remaining = b.limit - spent;
            const progress = Math.min(100, (spent / b.limit) * 100);
            const isOver = spent > b.limit;

            return (
              <motion.div 
                key={b.category}
                whileHover={{ y: -2 }}
                className="bg-bg-card dark:bg-slate-900/40 backdrop-blur-xl rounded-2xl p-5 border border-border-color shadow-sm group"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-bg-main dark:bg-slate-800/80 shadow-inner group-hover:bg-blue-500/10 transition-colors border border-border-color">
                      <CategoryIcon icon={b.icon} className="w-5 h-5 text-text-secondary group-hover:text-blue-500" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-slate-50">{b.category}</h4>
                      <p className="text-[10px] font-bold text-slate-400">Limit: ₹{b.limit.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold text-slate-900 dark:text-slate-50">₹{Math.round(spent).toLocaleString()}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="h-2 w-full bg-[var(--bg-main)] dark:bg-slate-800/50 rounded-full overflow-hidden shadow-inner border border-[var(--border-color)]">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      className={`h-full rounded-full ${isOver ? 'bg-rose-500' : progress > 80 ? 'bg-amber-500' : 'bg-emerald-500'} shadow-sm`}
                    />
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {isOver ? (
                      <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
                    ) : (
                      <TrendingDown className="w-3.5 h-3.5 text-emerald-500" />
                    )}
                    <p className={`text-[10px] font-bold flex items-center gap-1 ${isOver ? 'text-rose-500' : 'text-slate-500'}`}>
                      {isOver 
                        ? `You are ₹${Math.abs(remaining).toLocaleString()} over your limit`
                        : `You are ₹${remaining.toLocaleString()} under your limit`
                      }
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
