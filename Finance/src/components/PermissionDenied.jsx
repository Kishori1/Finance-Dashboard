import { Lock, Shield, ArrowLeft } from 'lucide-react';
import { useFinanceStore } from '../store/useFinanceStore';
import { motion } from 'framer-motion';

export const PermissionDenied = () => {
  const { setRole } = useFinanceStore();

  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[500px] p-8">
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="glass rounded-[40px] p-12 text-center max-w-md shadow-2xl relative overflow-hidden"
      >
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-600/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-rose-600/5 rounded-full blur-3xl" />
        
        <div className="relative z-10 space-y-8">
          <div className="mx-auto w-20 h-20 bg-rose-500/10 rounded-3xl flex items-center justify-center border border-rose-500/20 shadow-lg shadow-rose-500/10 animate-float">
            <Lock className="w-10 h-10 text-rose-500" />
          </div>
          
          <div className="space-y-3">
             <h2 className="text-3xl font-black text-slate-900 dark:text-slate-50 tracking-tight">Admin Only</h2>
             <p className="text-slate-500 font-bold tracking-tight">You're currently in Viewer mode. Switch to Admin to perform this action.</p>
          </div>

          <div className="flex flex-col gap-4">
             <button 
               onClick={() => setRole('Admin')}
               className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-blue-500/20 transition-all active:scale-95 flex items-center justify-center gap-2 group"
             >
               <Shield className="w-4 h-4 group-hover:rotate-12 transition-transform" />
               Switch to Admin
             </button>
             <button 
               className="w-full py-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 text-sm font-black uppercase tracking-widest rounded-2xl transition-all flex items-center justify-center gap-2"
             >
               <ArrowLeft className="w-4 h-4" />
               Go Back
             </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
