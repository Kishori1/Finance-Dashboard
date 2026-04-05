import { X, Calendar, IndianRupee, List, Tag, Save } from 'lucide-react';
import { useFinanceStore } from '../store/useFinanceStore';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const TransactionModal = () => {
  const { 
    isAddEditModalOpen, 
    closeAddEditModal, 
    transactions, 
    selectedTransactionId,
    addTransaction,
    updateTransaction
  } = useFinanceStore();

  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: 'Food & Dining',
    type: 'Expense',
    date: new Date().toISOString().split('T')[0]
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (selectedTransactionId) {
      const t = transactions.find(t => t.id === selectedTransactionId);
      if (t) {
        setFormData({
          description: t.description,
          amount: Math.abs(t.amount).toString(),
          category: t.category,
          type: t.type,
          date: t.date
        });
      }
    } else {
      setFormData({
        description: '',
        amount: '',
        category: 'Food & Dining',
        type: 'Expense',
        date: new Date().toISOString().split('T')[0]
      });
    }
  }, [selectedTransactionId, isAddEditModalOpen]);

  const validate = () => {
    const newErrors = {};
    if (!formData.description) newErrors.description = 'Description is required';
    if (!formData.amount || isNaN(formData.amount)) newErrors.amount = 'Valid amount is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    
    const amount = formData.type === 'Expense' ? -Math.abs(formData.amount) : Math.abs(formData.amount);
    
    const transaction = {
      id: selectedTransactionId || `new-${Date.now()}`,
      ...formData,
      amount: parseFloat(amount)
    };

    if (selectedTransactionId) {
      updateTransaction(transaction);
    } else {
      addTransaction(transaction);
    }
    closeAddEditModal();
  };

  const categories = {
    Income: ['Salary', 'Freelance', 'Investment', 'Other Income'],
    Expense: ['Food & Dining', 'Housing', 'Transportation', 'Shopping', 'Utilities', 'Entertainment', 'Healthcare', 'Others']
  };

  if (!isAddEditModalOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeAddEditModal}
          className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 15 }}
          className="relative w-full max-w-md bg-bg-card dark:bg-slate-900 border border-border-color backdrop-blur-2xl rounded-3xl p-6 shadow-2xl overflow-hidden"
        >
          <div className="flex justify-between items-center mb-6">
            <div>
               <h2 className="text-xl font-bold text-text-primary tracking-tight">
                {selectedTransactionId ? 'Edit Transaction' : 'Add Transaction'}
              </h2>
              <p className="text-text-secondary text-xs font-medium">Record your financial movement</p>
            </div>
            <button onClick={closeAddEditModal} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors group">
              <X className="w-5 h-5 text-slate-400 group-hover:text-text-primary" />
            </button>
          </div>

          <div className="space-y-6">
            {/* Type Toggle */}
            <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl w-fit mx-auto shadow-inner">
               <button 
                onClick={() => setFormData({...formData, type: 'Income', category: 'Salary'})}
                className={`px-8 py-2.5 text-sm font-bold rounded-xl transition-all ${formData.type === 'Income' ? 'bg-emerald-500 text-white shadow-lg' : 'text-slate-500'}`}
              >
                Income
              </button>
              <button 
                onClick={() => setFormData({...formData, type: 'Expense', category: 'Food & Dining'})}
                className={`px-8 py-2.5 text-sm font-bold rounded-xl transition-all ${formData.type === 'Expense' ? 'bg-rose-500 text-white shadow-lg' : 'text-slate-500'}`}
              >
                Expense
              </button>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase text-text-secondary ml-1">Description</label>
              <div className="relative group">
                <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                <input 
                  type="text"
                  placeholder="e.g. Weekly Groceries"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className={`w-full pl-12 pr-4 py-3 bg-bg-main dark:bg-slate-800/40 border-2 rounded-xl focus:ring-0 focus:outline-none transition-all font-medium text-sm text-text-primary ${errors.description ? 'border-red-500' : 'border-border-color focus:border-blue-500/50'}`}
                />
              </div>
            </div>

            {/* Amount & Date */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase text-text-secondary ml-1">Amount</label>
                <div className="relative group">
                  <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                  <input 
                    type="number"
                    placeholder="0.00"
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: e.target.value})}
                    className={`w-full pl-12 pr-4 py-3 bg-bg-main dark:bg-slate-800/40 border-2 rounded-xl focus:ring-0 focus:outline-none transition-all font-bold text-sm text-text-primary ${errors.amount ? 'border-red-500' : 'border-border-color focus:border-blue-500/50'}`}
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase text-text-secondary ml-1">Date</label>
                <div className="relative group">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                  <input 
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    className="w-full pl-12 pr-4 py-3 bg-bg-main dark:bg-slate-800/40 border-2 border-border-color focus:border-blue-500/50 rounded-xl focus:ring-0 focus:outline-none transition-all font-medium text-sm text-text-primary"
                  />
                </div>
              </div>
            </div>

            {/* Category */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase text-[var(--text-secondary)] ml-1">Category</label>
              <div className="relative group">
                <List className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                <select 
                   value={formData.category}
                   onChange={(e) => setFormData({...formData, category: e.target.value})}
                   className="w-full pl-12 pr-4 py-3 bg-[var(--bg-main)] dark:bg-slate-800/40 border-2 border-[var(--border-color)] focus:border-blue-500/50 rounded-xl focus:ring-0 focus:outline-none transition-all font-semibold text-sm appearance-none text-[var(--text-primary)]"
                >
                  {categories[formData.type].map(cat => (
                    <option key={cat} value={cat} className="dark:bg-slate-900">{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-3 pt-3">
               <button 
                onClick={closeAddEditModal}
                className="flex-1 py-3 text-xs font-bold uppercase tracking-widest text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={handleSave}
                className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-widest rounded-xl shadow-xl shadow-blue-500/20 transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <Save className="w-3.5 h-3.5" />
                {selectedTransactionId ? 'Update' : 'Save'}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
