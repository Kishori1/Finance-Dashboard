import React from 'react';
import { useFinanceStore } from '../store/useFinanceStore';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, 
  X, 
  AlertTriangle, 
  CheckCircle2, 
  Trash2, 
  PlusCircle, 
  TrendingDown, 
  Sparkles,
  Zap
} from 'lucide-react';

export const NotificationCenter = ({ isOpen, onClose }) => {
  const { notifications, dismissNotification } = useFinanceStore();

  const getIcon = (type) => {
    switch (type) {
      case 'warning': return <AlertTriangle className="w-5 h-5 text-amber-500" />;
      case 'success': return <Sparkles className="w-5 h-5 text-emerald-500" />;
      case 'info': return <PlusCircle className="w-5 h-5 text-blue-500" />;
      default: return <Bell className="w-5 h-5 text-slate-400" />;
    }
  };

  const getBg = (type) => {
    switch (type) {
      case 'warning': return 'bg-amber-500/10 border-amber-500/20';
      case 'success': return 'bg-emerald-500/10 border-emerald-500/20';
      case 'info': return 'bg-blue-500/10 border-blue-500/20';
      default: return 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 md:absolute md:inset-auto md:top-16 md:right-0 md:p-0 md:block md:w-96 md:mt-2">
      {/* Backdrop for mobile */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm md:hidden"
      />

      <motion.div 
        initial={{ opacity: 0, y: -20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.95 }}
        className="relative w-full max-w-md bg-white/95 dark:bg-slate-950/95 backdrop-blur-2xl rounded-[32px] md:rounded-[24px] p-6 shadow-2xl overflow-y-auto max-h-[90vh] border border-white/20 dark:border-slate-800/50"
      >
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-50 tracking-tight">Smart Alerts</h3>
            <span className="px-2 py-0.5 bg-blue-500 text-white text-[10px] font-bold rounded-full">{notifications.length}</span>
          </div>
          <button onClick={onClose} className="p-3 -mr-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors" aria-label="Close">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <div className="space-y-4 max-h-[450px] overflow-y-auto pr-1">
          <AnimatePresence mode="popLayout">
            {notifications.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-10"
              >
                <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8 text-slate-300" />
                </div>
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">All clear!</p>
                <p className="text-xs text-slate-500 mt-1">No new alerts at the moment.</p>
              </motion.div>
            ) : (
              notifications.map((n) => (
                <motion.div 
                  layout
                  key={n.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className={`p-4 rounded-2xl border ${getBg(n.type)} flex gap-4 relative group shadow-sm overflow-hidden`}
                >
                  <div className="flex-shrink-0">
                    <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 shadow-sm">
                      {getIcon(n.type)}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1 pr-7">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-slate-50 leading-tight">
                        {n.title}
                      </h4>
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tight whitespace-nowrap ml-2">{n.timestamp}</span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-normal">
                      {n.message}
                    </p>
                  </div>
                  
                  <button 
                    onClick={() => dismissNotification(n.id)}
                    className="absolute top-2 right-2 p-1.5 opacity-0 group-hover:opacity-100 transition-all hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-slate-400 hover:text-rose-500" />
                  </button>

                  {/* Decorative line for warning */}
                  {n.type === 'warning' && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-amber-500/20" />
                  )}
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>

        {notifications.length > 0 && (
          <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
             <button className="w-full py-3 bg-slate-900 dark:bg-slate-50 text-white dark:text-slate-900 rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:opacity-90 transition-opacity">
                Settings & Preferences
             </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};
