import { Shield, Eye, CheckCircle } from 'lucide-react';
import { useFinanceStore } from '../store/useFinanceStore';
import { motion, AnimatePresence } from 'framer-motion';

export const RoleSwitcher = () => {
  const { user, setRole, isRoleSwitcherOpen, setRoleSwitcherOpen } = useFinanceStore();

  const roles = [
    { name: 'Admin', icon: Shield, desc: 'Full access — can add, edit, and delete', color: 'text-blue-500' },
    { name: 'Viewer', icon: Eye, desc: 'Read-only — can view data and insights', color: 'text-slate-400' },
  ];

  const handleRoleChange = (roleName) => {
    setRole(roleName);
    setRoleSwitcherOpen(false);
  };

  if (!isRoleSwitcherOpen) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 md:absolute md:inset-auto md:right-4 md:top-24 md:p-0 md:block md:w-72">
      {/* Backdrop for mobile */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setRoleSwitcherOpen(false)}
        className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm md:hidden"
      />

      <motion.div 
        initial={{ opacity: 0, y: 15, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 15, scale: 0.95 }}
        className="relative w-full max-w-md bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl rounded-[32px] md:rounded-[24px] p-2 shadow-2xl border border-slate-200 dark:border-slate-800/50 overflow-hidden"
      >
        <div className="px-4 py-3 mb-2 border-b border-slate-100 dark:border-slate-800">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 font-sans">Switch Perspective</p>
        </div>
        {roles.map((role) => (
          <button
            key={role.name}
            onClick={() => handleRoleChange(role.name)}
            className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all ${user.role === role.name ? 'bg-blue-600/10 text-blue-600 ring-1 ring-blue-500/10' : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100'}`}
          >
            <role.icon className={`w-6 h-6 ${user.role === role.name ? 'text-blue-600' : 'text-slate-400'}`} />
            <div className="text-left font-sans">
              <p className="text-sm font-bold tracking-tight mb-0.5">{role.name}</p>
              <p className="text-[10px] font-medium opacity-60 leading-tight">{role.desc}</p>
            </div>
          </button>
        ))}
      </motion.div>
    </div>
  );
};
