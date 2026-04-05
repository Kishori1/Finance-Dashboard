import { TrendingUp, TrendingDown } from 'lucide-react';
import { motion } from 'framer-motion';

export const StatCard = ({ title, value, icon: Icon, trend, trendValue, colorClass }) => {
  const isPositive = trend === 'up';
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3, scale: 1.01 }}
      className={`bg-bg-card dark:bg-slate-900/40 backdrop-blur-xl rounded-2xl p-4 sm:p-5 border border-border-color ${colorClass} flex flex-col gap-4 relative overflow-hidden transition-all duration-300 shadow-lg`}
    >
      <div className="flex justify-between items-start relative z-10">
        <div className="p-2.5 rounded-xl bg-bg-surface dark:bg-slate-800/80 backdrop-blur-md shadow-sm border border-border-color">
          <Icon className="w-5 h-5 text-text-primary" />
        </div>
        <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full bg-bg-main dark:bg-slate-800/60 backdrop-blur-sm text-[10px] font-bold tracking-tight border border-border-color ${isPositive ? 'text-emerald-500' : 'text-rose-500'}`}>
          {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          <span>{trendValue}</span>
        </div>
      </div>
      
      <div className="relative z-10">
        <p className="text-text-secondary text-[10px] font-black uppercase tracking-widest opacity-80 mb-0.5">
          {title}
        </p>
      <h3 className="text-xl font-black text-text-primary tracking-tight truncate">
        {value}
      </h3>
      </div>
      
      {/* Dynamic background glow */}
      <div className="absolute -right-6 -top-6 w-20 h-20 rounded-full bg-white/10 dark:bg-slate-50/5 blur-[30px] pointer-events-none" />
      <div className="absolute -left-6 -bottom-6 w-20 h-20 rounded-full bg-blue-500/5 blur-[35px] pointer-events-none" />
    </motion.div>
  );
};
