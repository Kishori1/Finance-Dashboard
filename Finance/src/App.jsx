import { Wallet, ArrowUpCircle, ArrowDownCircle, Pi, Plus, Download, LayoutDashboard, Lightbulb, Target } from 'lucide-react';
import { useFinanceStore } from './store/useFinanceStore';
import { exportToCSV } from './utils/ExportUtils';
import { StatCard } from './components/StatCard';
import { BalanceChart } from './components/BalanceChart';
import { SpendingDonut } from './components/SpendingDonut';
import { ComparisonChart } from './components/ComparisonChart';
import { TransactionTable } from './components/TransactionTable';
import { TransactionModal } from './components/TransactionModal';
import { TransactionDetail } from './components/TransactionDetail';
import { Insights } from './pages/Insights';
import { Budgets } from './pages/Budgets';
import { Header } from './components/Header';
import { NotificationCenter } from './components/NotificationCenter';
import { RoleSwitcher } from './components/RoleSwitcher';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

function App() {
  const { user, openAddEditModal, transactions, isDark, toggleDarkMode, isNotificationsOpen, setNotificationsOpen, isRoleSwitcherOpen, setRoleSwitcherOpen } = useFinanceStore();
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' | 'insights' | 'budgets'

  useEffect(() => {
    // Sync theme with document
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  // Update document title based on active tab
  useEffect(() => {
    const titles = {
      dashboard: 'Dashboard — Finance',
      budgets: 'Budget Analysis — Finance',
      insights: 'Financial Insights — Finance',
    };
    document.title = titles[activeTab] || 'Finance Dashboard';
  }, [activeTab]);

  return (
    <div id="app" role="main" className="min-h-screen bg-bg-main text-text-primary main-container transition-colors duration-500 font-sans selection:bg-blue-500/20">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <Header />

        {/* Tab Navigation (Desktop Only) */}
        <nav aria-label="Main navigation" className="hidden md:flex p-1 bg-white/30 dark:bg-slate-800/30 backdrop-blur-2xl rounded-2xl w-fit mb-8 shadow-inner border border-white/40 dark:border-slate-700/50 mx-auto">
           <button 
            id="tab-dashboard"
            aria-label="Dashboard tab"
            className={`flex items-center gap-2 px-5 md:px-6 py-2.5 rounded-xl text-[10px] md:text-xs font-black uppercase tracking-widest transition-all duration-300 ${activeTab === 'dashboard' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25 scale-105' : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-white/50 dark:hover:bg-slate-700/50'}`}
          >
            <LayoutDashboard className={`w-4 h-4 ${activeTab === 'dashboard' ? 'animate-pulse' : ''}`} />
            <span className="hidden sm:inline">Dashboard</span>
          </button>
          <button 
            id="tab-budgets"
            aria-label="Budgets tab"
            onClick={() => setActiveTab('budgets')}
            className={`flex items-center gap-2 px-5 md:px-6 py-2.5 rounded-xl text-[10px] md:text-xs font-black uppercase tracking-widest transition-all duration-300 ${activeTab === 'budgets' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/25 scale-105' : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-white/50 dark:hover:bg-slate-700/50'}`}
          >
            <Target className={`w-4 h-4 ${activeTab === 'budgets' ? 'animate-pulse' : ''}`} />
            <span className="hidden sm:inline">Budgets</span>
          </button>
          <button 
            id="tab-insights"
            aria-label="Insights tab"
            onClick={() => setActiveTab('insights')}
            className={`flex items-center gap-2 px-5 md:px-6 py-2.5 rounded-xl text-[10px] md:text-xs font-black uppercase tracking-widest transition-all duration-300 ${activeTab === 'insights' ? 'bg-amber-600 text-white shadow-lg shadow-amber-500/25 scale-105' : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-white/50 dark:hover:bg-slate-700/50'}`}
          >
            <Lightbulb className={`w-4 h-4 ${activeTab === 'insights' ? 'animate-pulse' : ''}`} />
            <span className="hidden sm:inline">Insights</span>
          </button>
        </nav>

        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && (
            <motion.div 
              key="dashboard"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              {/* Summary Cards Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
                <StatCard 
                  title="Total Balance" 
                  value="₹24,850.00" 
                  icon={Wallet} 
                  trend="up" 
                  trendValue="8.2%"
                  colorClass="card-gradient-blue"
                />
                <StatCard 
                  title="Monthly Income" 
                  value="₹7,200.00" 
                  icon={ArrowUpCircle} 
                  trend="up" 
                  trendValue="3.1%"
                  colorClass="card-gradient-green"
                />
                 <StatCard 
                  title="Monthly Expenses" 
                  value="₹4,380.00" 
                  icon={ArrowDownCircle} 
                  trend="down" 
                  trendValue="5.4%"
                  colorClass="card-gradient-red"
                />
                <StatCard 
                  title="Savings Rate" 
                  value="39.2%" 
                  icon={Pi} 
                  trend="up" 
                  trendValue="4.4%"
                  colorClass="card-gradient-amber"
                />
              </div>

              {/* Charts Row */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
                <div className="lg:col-span-2 glass rounded-3xl p-5 md:p-8 shadow-lg overflow-hidden relative group bg-gradient-to-br from-sky-500/5 via-white/60 to-cyan-500/5 dark:from-sky-500/10 dark:via-slate-900/60 dark:to-cyan-500/10">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-sky-400/10 rounded-full blur-[80px] pointer-events-none" />
                  <div className="flex justify-between items-center mb-6 relative z-10">
                    <div>
                      <h3 className="text-lg md:text-xl font-bold text-slate-900 dark:text-slate-50 tracking-tight">Balance Trend</h3>
                      <p className="text-[9px] md:text-xs font-semibold text-slate-400 mt-0.5 uppercase tracking-widest">Efficiency over time</p>
                    </div>
                    <select className="bg-slate-100 dark:bg-slate-800 border-none rounded-lg md:rounded-xl text-[9px] md:text-[10px] font-bold px-3 md:px-4 py-1.5 md:py-2 focus:ring-4 focus:ring-blue-500/10 shadow-sm appearance-none cursor-pointer">
                      <option>Last 6 Months</option>
                      <option>Last 12 Months</option>
                    </select>
                  </div>
                  <div className="h-[250px] md:h-[300px]">
                    <BalanceChart />
                  </div>
                </div>
                
                <div className="glass rounded-3xl p-5 md:p-8 flex flex-col shadow-lg bg-gradient-to-br from-rose-500/5 via-white/60 to-pink-500/5 dark:from-rose-500/10 dark:via-slate-900/60 dark:to-pink-500/10">
                  <h3 className="text-lg md:text-xl font-bold text-slate-900 dark:text-slate-50 tracking-tight mb-1">Spending</h3>
                  <p className="text-[9px] md:text-xs font-semibold text-slate-400 mb-6 md:mb-8 uppercase tracking-widest">Categorical Breakdown</p>
                  <div className="flex-1 flex items-center justify-center min-h-[220px] md:min-h-[260px]">
                    <SpendingDonut />
                  </div>
                </div>
              </div>

              {/* Monthly Comparison */}
              <div className="glass rounded-3xl p-5 md:p-8 shadow-lg relative overflow-hidden bg-gradient-to-br from-emerald-500/5 via-white/60 to-teal-500/5 dark:from-emerald-500/10 dark:via-slate-900/60 dark:to-teal-500/10">
                 <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-emerald-400/10 rounded-full blur-[100px] pointer-events-none" />
                 <ComparisonChart />
              </div>

              {/* Transactions Table Section */}
              <div className="glass rounded-3xl p-5 md:p-8 mb-20 relative shadow-lg overflow-hidden border border-white/20 dark:border-slate-800/50 bg-gradient-to-br from-violet-500/5 via-white/60 to-indigo-500/5 dark:from-violet-500/10 dark:via-slate-900/60 dark:to-indigo-500/10">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                  <div>
                    <h3 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-slate-50 tracking-tight leading-none">Master Ledger</h3>
                    <p className="text-slate-400 font-semibold mt-1.5 uppercase tracking-widest text-[10px]">All recorded activity for March 2026</p>
                  </div>
                  {user.role === 'Admin' && (
                    <button 
                      onClick={openAddEditModal}
                      className="flex items-center gap-2 px-5 md:px-6 py-2.5 md:py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs shadow-xl shadow-blue-500/20 transition-all active:scale-95 group"
                    >
                      <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" />
                      Add Entry
                    </button>
                  )}
                </div>
                <div className="table-container">
                    <TransactionTable />
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'budgets' && (
            <motion.div 
              key="budgets"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Budgets />
            </motion.div>
          )}

          {activeTab === 'insights' && (
            <motion.div 
               key="insights"
               initial={{ opacity: 0, scale: 0.98 }}
               animate={{ opacity: 1, scale: 1 }}
               exit={{ opacity: 0, scale: 0.98 }}
            >
               <Insights />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Global Components */}
        <TransactionModal />
        <TransactionDetail />
        
        {/* Global Navigation & Notification Overlays */}
        <AnimatePresence>
          {isNotificationsOpen && (
            <NotificationCenter 
              isOpen={isNotificationsOpen} 
              onClose={() => setNotificationsOpen(false)} 
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isRoleSwitcherOpen && (
            <RoleSwitcher />
          )}
        </AnimatePresence>

        {/* Quick Actions Floating Bar — Desktop bar / Mobile FABs (Admin Only) */}
        {user.role === 'Admin' && ( activeTab !== 'insights' ) && (
          <>
            {/* Desktop: Combined floating bar */}
            <motion.div 
              initial={{ y: 100 }}
              animate={{ y: 0 }}
              className="hidden md:flex fixed bottom-10 left-1/2 -translate-x-1/2 items-center gap-3 p-3 bg-slate-900/95 dark:bg-slate-800/95 rounded-[28px] shadow-2xl z-[40] ring-1 ring-white/10 backdrop-blur-2xl"
            >
              <button 
                onClick={() => exportToCSV(transactions, `finance_report_${new Date().toISOString().split('T')[0]}.csv`)}
                className="flex items-center justify-center gap-3 px-8 py-3.5 text-white/70 rounded-[20px] font-black text-xs uppercase tracking-widest hover:bg-white/10 hover:text-white transition-all"
              >
                <Download className="w-4 h-4" />
                Export
              </button>
              <div className="w-[1px] h-6 bg-white/10" />
              <button 
                onClick={openAddEditModal}
                className="flex items-center justify-center gap-3 px-8 py-3.5 bg-blue-600 text-white rounded-[20px] font-black text-xs uppercase tracking-widest hover:bg-blue-500 transition-all shadow-2xl shadow-blue-500/20 active:scale-95"
              >
                <Plus className="w-4 h-4" />
                New Entry
              </button>
            </motion.div>

            {/* Mobile: Two separate FABs */}
            <div className="md:hidden fixed bottom-[80px] right-4 z-[40] flex flex-col items-center gap-3">
              <motion.button
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1 }}
                onClick={() => exportToCSV(transactions, `finance_report_${new Date().toISOString().split('T')[0]}.csv`)}
                className="w-12 h-12 rounded-full bg-slate-800/95 dark:bg-slate-700/95 backdrop-blur-2xl text-white/80 flex items-center justify-center shadow-xl ring-1 ring-white/10 active:scale-90 transition-transform"
                aria-label="Export CSV"
              >
                <Download className="w-5 h-5" />
              </motion.button>
              <motion.button
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0 }}
                onClick={openAddEditModal}
                className="w-14 h-14 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-2xl shadow-blue-500/30 active:scale-90 transition-transform"
                aria-label="New Entry"
              >
                <Plus className="w-6 h-6" strokeWidth={2.5} />
              </motion.button>
            </div>
          </>
        )}
        {/* Mobile Fixed Navigation Bar */}
        <nav aria-label="Mobile navigation" className="md:hidden fixed bottom-0 left-0 right-0 h-[64px] bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl border-t border-slate-200 dark:border-slate-800 flex items-center justify-around px-8 z-[50]">
          {/* Left — Budget */}
          <button 
            id="mobile-tab-budgets"
            aria-label="Budget tab"
            onClick={() => setActiveTab('budgets')}
            className={`flex flex-col items-center gap-0.5 ${activeTab === 'budgets' ? 'text-emerald-500' : 'text-slate-400'}`}
          >
            <Target className="w-5 h-5" />
            <span className="text-[9px] font-black uppercase tracking-tighter">Budget</span>
          </button>

          {/* Center — Home (Raised FAB) */}
          <button 
            id="mobile-tab-home"
            aria-label="Home tab"
            onClick={() => setActiveTab('dashboard')}
            className="relative -mt-10 flex flex-col items-center"
          >
            <div className={`w-14 h-14 rounded-full flex items-center justify-center shadow-xl transition-all duration-300 ${
              activeTab === 'dashboard' 
                ? 'bg-blue-600 text-white shadow-blue-500/30 scale-105' 
                : 'bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 shadow-slate-200/50 dark:shadow-slate-900/50 border border-slate-200 dark:border-slate-700'
            }`}>
              <LayoutDashboard className="w-6 h-6" />
            </div>
            <span className={`text-[9px] font-black uppercase tracking-tighter mt-1 ${
              activeTab === 'dashboard' ? 'text-blue-500' : 'text-slate-400'
            }`}>Home</span>
          </button>

          {/* Right — Insights */}
          <button 
            id="mobile-tab-insights"
            aria-label="Insights tab"
            onClick={() => setActiveTab('insights')}
            className={`flex flex-col items-center gap-0.5 ${activeTab === 'insights' ? 'text-amber-500' : 'text-slate-400'}`}
          >
            <Lightbulb className="w-5 h-5" />
            <span className="text-[9px] font-black uppercase tracking-tighter">Insights</span>
          </button>
        </nav>
      </div>
    </div>
  );
}

export default App;
