import { X, Calendar, Tag, Trash2, Edit2, TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';
import { useFinanceStore } from '../store/useFinanceStore';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';

export const TransactionDetail = () => {
  const { 
    isDetailOpen, 
    closeDetail, 
    transactions, 
    selectedTransactionId,
    deleteTransaction,
    openAddEditModal,
    user
  } = useFinanceStore();

  const transaction = transactions.find(t => t.id === selectedTransactionId);

  const similarTransactions = transaction 
    ? transactions
        .filter(t => t.category === transaction.category && t.id !== transaction.id)
        .slice(0, 3)
    : [];

  if (!isDetailOpen || !transaction) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[70] overflow-hidden">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeDetail}
          className="absolute inset-0 bg-slate-900/20 backdrop-blur-[2px]"
        />
        
        <motion.div 
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-bg-card dark:bg-slate-950 border-l border-border-color shadow-2xl flex flex-col backdrop-blur-2xl"
        >
          {/* Header */}
          <div className="p-6 flex justify-between items-start">
            <button onClick={closeDetail} className="p-2.5 bg-[var(--bg-surface)] hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all shadow-sm border border-[var(--border-color)]">
                <X className="w-5 h-5 text-slate-400" />
            </button>
            <div className="flex gap-2">
              {user.role === 'Admin' && (
                <>
                  <button 
                    onClick={() => { openAddEditModal(); }}
                    className="p-2.5 bg-bg-surface hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all shadow-sm border border-border-color text-slate-400 hover:text-blue-500"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => { deleteTransaction(transaction.id); }}
                    className="p-2.5 bg-rose-500/10 text-rose-500 rounded-xl transition-all shadow-sm border border-rose-500/20 hover:bg-rose-500/20"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-8">
            {/* Amount & Category */}
            <div className="text-center space-y-2">
              <div className={`mx-auto w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg ${transaction.type === 'Income' ? 'bg-emerald-500 text-white shadow-emerald-500/20' : 'bg-rose-500 text-white shadow-rose-500/20'}`}>
                {transaction.type === 'Income' ? <TrendingUp className="w-6 h-6" /> : <TrendingDown className="w-6 h-6" />}
              </div>
              <h1 className={`text-3xl font-bold tracking-tight ${transaction.type === 'Income' ? 'text-emerald-500' : 'text-rose-500'}`}>
                {transaction.type === 'Income' ? '+' : '-'}₹{Math.abs(transaction.amount).toLocaleString()}
              </h1>
               <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-bg-surface dark:bg-slate-800 border border-border-color rounded-full">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">{transaction.category}</span>
              </div>
            </div>

            {/* Details List */}
            <div className="space-y-4">
               <div className="p-5 rounded-2xl bg-bg-surface border border-border-color space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold uppercase text-text-secondary">Date</span>
                    <span className="text-xs font-bold text-text-primary">{transaction.date}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold uppercase text-text-secondary">Description</span>
                    <span className="text-xs font-bold text-text-primary">{transaction.description}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold uppercase text-text-secondary">Reference ID</span>
                    <span className="text-[10px] font-mono text-slate-400">{transaction.id}</span>
                  </div>
               </div>

               {/* Notes section placeholder */}
               <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase text-text-secondary ml-1">Notes</label>
                  <div className="p-3.5 rounded-xl bg-bg-surface dark:bg-slate-900 border border-dashed border-border-color">
                    <p className="text-xs text-slate-400 italic">No notes added to this transaction.</p>
                  </div>
               </div>
            </div>

            {/* Similar Transactions */}
            <div className="space-y-3">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1 flex items-center gap-2">
                Similar Patterns
                <ArrowRight className="w-3.5 h-3.5 text-slate-300" />
              </h3>
              <div className="space-y-2">
                {similarTransactions.map((t) => (
                  <div key={t.id} className="p-3.5 rounded-xl bg-bg-surface dark:bg-slate-900 border border-border-color flex justify-between items-center group hover:border-blue-500/30 transition-all shadow-sm">
                    <div>
                      <p className="text-xs font-bold text-text-primary">{t.description}</p>
                      <p className="text-[9px] font-semibold text-text-secondary uppercase tracking-tighter">{t.date}</p>
                    </div>
                    <p className={`text-xs font-bold ${t.type === 'Income' ? 'text-emerald-500' : 'text-rose-500'}`}>
                       {t.type === 'Income' ? '+' : '-'}₹{Math.abs(t.amount)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
