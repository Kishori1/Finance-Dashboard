import { Search, Filter, MoreVertical, Edit2, Trash2, ArrowUpRight, ArrowDownLeft, ChevronLeft, ChevronRight, X, Eye, Download, Layers, ChevronDown, ChevronUp, TrendingUp, TrendingDown } from 'lucide-react';
import { useFinanceStore } from '../store/useFinanceStore';
import { useState, useMemo, Fragment } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { exportToCSV, exportToJSON } from '../utils/ExportUtils';

export const TransactionTable = () => {
  const { transactions, user, deleteTransaction, openDetail, openAddEditModal, setSelectedTransaction } = useFinanceStore();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });
  const [groupBy, setGroupBy] = useState('None'); // 'None' | 'Category' | 'Type'
  const [expandedGroups, setExpandedGroups] = useState({});
  
  const itemsPerPage = 8;

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const matchesSearch = t.description.toLowerCase().includes(search.toLowerCase()) || 
                           t.category.toLowerCase().includes(search.toLowerCase());
      const matchesType = typeFilter === 'All' || t.type === typeFilter;
      return matchesSearch && matchesType;
    });
  }, [transactions, search, typeFilter]);

  const sortedTransactions = useMemo(() => {
    const items = [...filteredTransactions];
    if (sortConfig.key) {
      items.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return items;
  }, [filteredTransactions, sortConfig]);

  const groupedTransactions = useMemo(() => {
    if (groupBy === 'None') return { 'All Transactions': sortedTransactions };
    
    return sortedTransactions.reduce((acc, t) => {
      const key = t[groupBy.toLowerCase()];
      if (!acc[key]) acc[key] = [];
      acc[key].push(t);
      return acc;
    }, {});
  }, [sortedTransactions, groupBy]);

  const toggleGroup = (key) => {
    setExpandedGroups(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const totals = useMemo(() => {
    return filteredTransactions.reduce((acc, t) => {
      if (t.type === 'Income') acc.income += Math.abs(t.amount);
      else acc.expenses += Math.abs(t.amount);
      return acc;
    }, { income: 0, expenses: 0 });
  }, [filteredTransactions]);

  const handleExport = (format) => {
    const dateStr = new Date().toISOString().split('T')[0];
    const filename = `transactions_${search ? 'filtered_' : ''}${dateStr}`;
    if (format === 'csv') exportToCSV(filteredTransactions, `${filename}.csv`);
    else exportToJSON(filteredTransactions, `${filename}.json`);
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Food & Dining': 'bg-emerald-500',
      'Income': 'bg-blue-500',
      'Utilities': 'bg-red-500',
      'Entertainment': 'bg-pink-500',
      'Transportation': 'bg-amber-500',
      'Housing': 'bg-indigo-500',
      'Shopping': 'bg-purple-500',
      'Healthcare': 'bg-cyan-500',
    };
    return colors[category] || 'bg-slate-500';
  };

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  
  const netMovement = totals.income - totals.expenses;
  
  const paginatedTransactions = useMemo(() => {
    return sortedTransactions.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
  }, [sortedTransactions, currentPage]);

  return (
    <div className="w-full space-y-6">
      {/* Advanced Controls Bar */}
      <div className="flex flex-col xl:flex-row gap-6 justify-between items-center bg-bg-card dark:bg-slate-900/40 p-4 rounded-[28px] border border-border-color backdrop-blur-xl shadow-lg">
        <div className="relative w-full xl:w-[450px] group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary group-focus-within:text-blue-500 transition-colors" />
          <input 
            type="text" 
            placeholder="Search transactions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 bg-bg-surface border border-border-color rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium shadow-sm text-text-primary outline-none"
          />
        </div>
        
        <div className="flex flex-wrap items-center gap-4 w-full xl:w-auto">
          {/* Type Filter */}
          <div className="flex items-center gap-1.5 p-1 bg-bg-surface border border-border-color rounded-xl shadow-sm">
            {['All', 'Income', 'Expense'].map((type) => (
              <button
                key={type}
                onClick={() => setTypeFilter(type)}
                className={`flex-1 sm:flex-none px-3 sm:px-4 py-1.5 sm:py-2 text-[9px] sm:text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${
                  typeFilter === type ? 'bg-blue-600 text-white shadow-lg' : 'text-text-secondary hover:text-text-primary hover:bg-bg-main'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          {/* Group By */}
          <div className="flex items-center gap-2 px-4 py-2 bg-bg-surface border border-border-color rounded-xl shadow-sm">
             <Layers className="w-4 h-4 text-text-secondary" />
             <select 
               value={groupBy}
               onChange={(e) => setGroupBy(e.target.value)}
               className="bg-transparent text-xs font-bold text-text-primary focus:outline-none appearance-none cursor-pointer pr-4"
             >
                <option value="None" className="dark:bg-slate-900">No Grouping</option>
                <option value="Category" className="dark:bg-slate-900">Group by Category</option>
                <option value="Type" className="dark:bg-slate-900">Group by Type</option>
             </select>
          </div>

          {/* Export Actions */}
          <div className="flex items-center gap-2">
             <button 
               onClick={() => handleExport('csv')}
               className="flex items-center gap-2 px-4 py-2.5 bg-bg-surface border border-border-color rounded-xl text-xs font-bold text-text-secondary hover:shadow-md transition-all active:scale-95"
             >
                <Download className="w-4 h-4" />
                CSV
             </button>
             <button 
                onClick={() => handleExport('json')}
                className="flex items-center gap-2 px-4 py-2.5 bg-bg-surface border border-border-color rounded-xl text-xs font-bold text-text-secondary hover:shadow-md transition-all active:scale-95"
             >
                <Download className="w-4 h-4" />
                JSON
             </button>
          </div>
        </div>
      </div>

      {/* Table Container */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-bg-card dark:bg-slate-900/40 backdrop-blur-xl rounded-[32px] border border-border-color shadow-xl overflow-hidden"
      >
      {/* Table Content */}
      <div className="overflow-x-auto hidden sm:block">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-bg-main dark:bg-slate-800/40 border-b border-border-color">
                <th onClick={() => handleSort('date')} className="px-6 py-4 text-[10px] font-black uppercase text-text-secondary tracking-widest cursor-pointer hover:text-blue-500 transition-colors">
                  <div className="flex items-center gap-2">Date {sortConfig.key === 'date' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</div>
                </th>
                <th onClick={() => handleSort('description')} className="px-6 py-4 text-[10px] font-black uppercase text-text-secondary tracking-widest cursor-pointer hover:text-blue-500 transition-colors">
                  <div className="flex items-center gap-2">Description {sortConfig.key === 'description' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</div>
                </th>
                <th className="px-6 py-4 text-[10px] font-black uppercase text-text-secondary tracking-widest text-center">Category</th>
                <th onClick={() => handleSort('amount')} className="px-6 py-4 text-[10px] font-black uppercase text-text-secondary tracking-widest text-right cursor-pointer hover:text-blue-500 transition-colors">
                  <div className="flex items-center justify-end gap-2">Amount {sortConfig.key === 'amount' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</div>
                </th>
                <th className="px-6 py-4 text-[10px] font-black uppercase text-text-secondary tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-color/50">
              <AnimatePresence>
                {Object.keys(groupedTransactions).map(groupKey => (
                  <Fragment key={groupKey}>
                    {groupBy !== 'None' && (
                      <tr 
                         onClick={() => toggleGroup(groupKey)}
                         className="bg-bg-main/50 dark:bg-slate-800/50 cursor-pointer group"
                      >
                        <td colSpan={5} className="px-6 py-2.5">
                           <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                 {expandedGroups[groupKey] ? <ChevronUp className="w-3.5 h-3.5 text-text-secondary" /> : <ChevronDown className="w-3.5 h-3.5 text-text-secondary" />}
                                 <span className="text-[10px] font-black uppercase tracking-widest text-text-primary">{groupKey}</span>
                                 <span className="text-[9px] font-bold text-text-secondary/60">({groupedTransactions[groupKey].length})</span>
                              </div>
                              <span className="text-[10px] font-black text-text-secondary/80 tracking-tight">
                                 Group Total: ₹{groupedTransactions[groupKey].reduce((sum, t) => sum + Math.abs(t.amount), 0).toLocaleString()}
                              </span>
                           </div>
                        </td>
                      </tr>
                    )}
                    {(!expandedGroups[groupKey] || groupBy === 'None') && (groupBy === 'None' ? paginatedTransactions : groupedTransactions[groupKey]).map((t, idx) => (
                      <motion.tr 
                        layout
                        key={t.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        component="tr"
                        className="group hover:bg-bg-main/50 transition-all cursor-pointer"
                        onClick={() => openDetail(t.id)}
                      >
                        <td className="px-6 py-5 text-xs font-bold text-text-secondary whitespace-nowrap">{t.date}</td>
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-4">
                             <div className={`p-3 rounded-2xl ${t.type === 'Income' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                                {t.type === 'Income' ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                             </div>
                             <div>
                                <p className="text-sm font-bold text-text-primary group-hover:text-blue-600 transition-colors">{t.description}</p>
                                <p className="text-[10px] font-medium text-text-secondary/60 italic">Ref: {t.id.slice(0, 8)}...</p>
                             </div>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex justify-center">
                            <span className="px-3 py-1 bg-bg-surface dark:bg-slate-800 border border-border-color rounded-full text-[10px] font-black text-text-secondary uppercase tracking-widest shadow-sm">
                              {t.category}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-5 text-right">
                          <span className={`text-sm font-black ${t.amount >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                            {t.amount >= 0 ? '+' : '-'}₹{Math.abs(t.amount).toLocaleString()}
                          </span>
                        </td>
                        <td className="px-6 py-5 text-right">
                          <div className="flex justify-end gap-2 transition-all">
                             <button 
                              onClick={(e) => { e.stopPropagation(); openDetail(t.id); }}
                              className="p-2.5 bg-bg-surface hover:bg-bg-main rounded-xl text-text-secondary hover:text-blue-500 transition-all border border-border-color shadow-sm"
                              title="View Details"
                             >
                                <Eye className="w-4 h-4" />
                             </button>
                             {user.role === 'Admin' && (
                               <button 
                                onClick={(e) => { e.stopPropagation(); setSelectedTransaction(t); openAddEditModal(); }}
                                className="p-2.5 bg-bg-surface hover:bg-bg-main rounded-xl text-text-secondary hover:text-emerald-500 transition-all border border-border-color shadow-sm"
                                title="Edit Transaction"
                               >
                                  <Edit2 className="w-4 h-4" />
                               </button>
                             )}
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </Fragment>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Mobile Views - Card based */}
        <div className="block sm:hidden">
          <AnimatePresence>
            <div className="divide-y divide-border-color/50">
              {paginatedTransactions.map((t) => (
                <motion.div 
                  key={t.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  onClick={() => openDetail(t.id)}
                  className="p-4 flex flex-col gap-3 active:bg-bg-main/50"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                       <div className={`p-2.5 rounded-xl ${t.type === 'Income' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                          {t.type === 'Income' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                       </div>
                       <div>
                          <p className="text-sm font-bold text-text-primary leading-tight">{t.description}</p>
                          <p className="text-[10px] font-medium text-text-secondary/60">{t.date}</p>
                       </div>
                    </div>
                    <span className={`text-base font-black ${t.amount >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                      {t.amount >= 0 ? '+' : '-'}₹{Math.abs(t.amount).toLocaleString()}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="px-2.5 py-0.5 bg-bg-main border border-border-color rounded-full text-[9px] font-black text-text-secondary uppercase tracking-widest">
                      {t.category}
                    </span>
                    <div className="flex gap-2">
                       <button 
                        onClick={(e) => { e.stopPropagation(); openDetail(t.id); }}
                        className="p-2 bg-bg-surface rounded-lg text-text-secondary border border-border-color"
                       >
                          <Eye className="w-3.5 h-3.5" />
                       </button>
                       {user.role === 'Admin' && (
                         <button 
                          onClick={(e) => { e.stopPropagation(); setSelectedTransaction(t); openAddEditModal(); }}
                          className="p-2 bg-bg-surface rounded-lg text-text-secondary border border-border-color"
                         >
                            <Edit2 className="w-3.5 h-3.5" />
                         </button>
                       )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
        </div>

        {/* Pagination */}
        <div className="p-6 bg-bg-main/30 border-t border-border-color flex justify-between items-center">
           <p className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">
              Showing {Math.min(filteredTransactions.length, (currentPage-1)*itemsPerPage + 1)} to {Math.min(filteredTransactions.length, currentPage*itemsPerPage)} of {filteredTransactions.length}
           </p>
           <div className="flex gap-2">
              <button 
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="p-2.5 bg-bg-surface border border-border-color rounded-xl disabled:opacity-30 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
              >
                <ChevronLeft className="w-4 h-4 text-text-primary" />
              </button>
              <button 
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="p-2.5 bg-bg-surface border border-border-color rounded-xl disabled:opacity-30 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
              >
                <ChevronRight className="w-4 h-4 text-text-primary" />
              </button>
           </div>
        </div>
      </motion.div>
      
      {/* Summary Footer Row (Previously Master Ledger style) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-900 dark:bg-slate-950 p-6 rounded-[32px] shadow-2xl text-white">
        <div className="flex flex-col gap-1 px-4 border-r border-slate-800 last:border-0">
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Income</span>
          <span className="text-2xl font-black text-emerald-400">₹{totals.income.toLocaleString()}</span>
        </div>
        <div className="flex flex-col gap-1 px-4 border-r border-slate-800 last:border-0">
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Expenses</span>
          <span className="text-2xl font-black text-rose-400">₹{totals.expenses.toLocaleString()}</span>
        </div>
        <div className="flex flex-col gap-1 px-4 text-right">
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Net Position</span>
          <span className={`text-2xl font-black ${netMovement >= 0 ? 'text-blue-400' : 'text-amber-400'}`}>
            {netMovement >= 0 ? '+' : ''}₹{netMovement.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
};
