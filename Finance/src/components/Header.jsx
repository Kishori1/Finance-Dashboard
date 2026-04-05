import { ChevronDown, User, Shield, Eye, Bell, Moon, Sun, CheckCircle } from 'lucide-react';
import { useFinanceStore } from '../store/useFinanceStore';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NotificationCenter } from './NotificationCenter';

export const Header = () => {
  const { user, setRole, notifications, isDark, toggleDarkMode } = useFinanceStore();
  const [isOpen, setIsOpen] = useState(false); // For local banner/misc logic if needed
  const { isNotificationsOpen, setNotificationsOpen, isRoleSwitcherOpen, setRoleSwitcherOpen } = useFinanceStore();
  const [banner, setBanner] = useState(null);

  const unreadCount = notifications.length;


  const roles = [
    { name: 'Admin', icon: Shield, desc: 'Full access — can add, edit, and delete', color: 'text-blue-500' },
    { name: 'Viewer', icon: Eye, desc: 'Read-only — can view data and insights', color: 'text-slate-400' },
  ];

  const handleRoleChange = (roleName) => {
    setRole(roleName);
    setIsOpen(false);
    setBanner({
      text: roleName === 'Admin' ? 'Switched to Admin mode — full access enabled' : 'Switched to Viewer mode — restricted access',
      type: roleName === 'Admin' ? 'success' : 'info'
    });
    setTimeout(() => setBanner(null), 3000);
  };

  return (
    <div className="relative pt-6 md:pt-8 mb-6 z-[60]">
      {/* Role Change Banner */}
      <AnimatePresence>
        {banner && (
          <motion.div 
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className={`fixed top-4 left-1/2 -translate-x-1/2 z-[100] px-5 py-2.5 rounded-xl shadow-2xl backdrop-blur-xl border flex items-center gap-3 ${
              banner.type === 'success' 
              ? 'bg-emerald-500/90 border-emerald-400/20 text-white' 
              : 'bg-amber-500/90 border-amber-400/20 text-white'
            }`}
          >
            <CheckCircle className="w-4 h-4" />
            <p className="text-xs font-bold tracking-tight">{banner.text}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-white/60 dark:bg-slate-900/40 bg-gradient-to-br from-violet-500/10 via-transparent to-indigo-500/10 backdrop-blur-xl rounded-[32px] border border-border-color shadow-sm p-4 md:p-6 overflow-hidden relative group">
        {/* Subtle Decorative Gradient Glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-violet-500/20 blur-[80px] rounded-full group-hover:bg-violet-500/30 transition-all duration-700" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-indigo-500/20 blur-[80px] rounded-full group-hover:bg-indigo-500/30 transition-all duration-700" />
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left">
            <h1 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-slate-50 tracking-tight leading-tight">
              Good morning, {user.firstName}! 👋
            </h1>
            <p className="text-slate-400 dark:text-slate-500 text-xs font-semibold tracking-tight mt-0.5">
              Thursday, 3 April 2026
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={toggleDarkMode}
              className="p-2.5 rounded-xl bg-white/50 dark:bg-slate-800/50 hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-all shadow-sm border border-white/50 dark:border-slate-700"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-500" />}
            </button>
            
            <button 
              onClick={() => setNotificationsOpen(!isNotificationsOpen)}
              className="p-2.5 rounded-xl bg-white/50 dark:bg-slate-800/50 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-all shadow-sm relative overflow-hidden border border-white/50 dark:border-slate-700"
            >
              <Bell className="w-4 h-4 text-slate-500 hover:text-emerald-500 transition-colors" />
              {unreadCount > 0 && (
                <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-rose-500 rounded-full border border-white dark:border-slate-900" />
              )}
            </button>
            
            {/* Global modals moved to App.jsx */}

            <div className="relative">
              <button 
                onClick={() => setRoleSwitcherOpen(!isRoleSwitcherOpen)}
                className="flex items-center gap-2.5 pl-1.5 pr-3 py-1.5 rounded-xl bg-bg-surface dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all shadow-sm group border border-border-color"
              >
                <div className={`p-1.5 rounded-lg transition-all ${user.role === 'Admin' ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'}`}>
                  {user.role === 'Admin' ? <Shield className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </div>
                <div className="text-left hidden md:block">
                  <p className="text-[9px] font-bold uppercase text-slate-400 leading-none">Role</p>
                  <p className="text-xs font-bold text-slate-900 dark:text-slate-100 leading-tight flex items-center gap-1 mt-0.5">
                    {user.role}
                    <ChevronDown className={`w-2.5 h-2.5 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                  </p>
                </div>
              </button>

              {/* Global modals moved to App.jsx */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
