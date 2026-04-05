import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const generateMockTransactions = () => {
    const baseTransactions = [
      { id: '1', date: '2026-03-31', description: 'Grocery Store — Whole Foods', category: 'Food & Dining', amount: -124.50, type: 'Expense' },
      { id: '2', date: '2026-03-30', description: 'Freelance Payment — Acme Corp', category: 'Income', amount: 1200.00, type: 'Income' },
      { id: '3', date: '2026-03-29', description: 'Electric Bill — March', category: 'Utilities', amount: -89.00, type: 'Expense' },
      { id: '4', date: '2026-03-28', description: 'Netflix Subscription', category: 'Entertainment', amount: -15.99, type: 'Expense' },
      { id: '5', date: '2026-03-27', description: 'Uber Ride — Airport', category: 'Transportation', amount: -42.00, type: 'Expense' },
      { id: '6', date: '2026-03-26', description: 'Salary Deposit — TechCo Inc.', category: 'Income', amount: 6000.00, type: 'Income' },
      { id: '7', date: '2026-03-25', description: 'Rent Payment — March', category: 'Housing', amount: -1400.00, type: 'Expense' },
      { id: '8', date: '2026-03-24', description: 'Amazon — Headphones', category: 'Shopping', amount: -79.99, type: 'Expense' },
      { id: '9', date: '2026-03-23', description: 'Pharmacy — CVS', category: 'Healthcare', amount: -32.50, type: 'Expense' },
      { id: '10', date: '2026-03-22', description: 'Coffee — Starbucks', category: 'Food & Dining', amount: -6.75, type: 'Expense' },
    ];
    
    // Generate up to 156 items for demo purpose
    const extra = Array.from({ length: 146 }, (_, i) => {
      const dates = ['2026-03-01', '2026-03-05', '2026-03-10', '2026-03-15', '2026-03-20'];
      const categories = ['Food & Dining', 'Transportation', 'Shopping', 'Entertainment', 'Healthcare'];
      return {
        id: `extra-${i}`,
        date: dates[i % dates.length],
        description: `Recurring ${categories[i % categories.length]} Expense`,
        category: categories[i % categories.length],
        amount: -(Math.random() * 50 + 10).toFixed(2),
        type: 'Expense'
      };
    });

    return [...baseTransactions, ...extra];
};

const mockStats = {
  totalBalance: 24850.00,
  balanceTrend: [
    { month: 'Oct 2025', balance: 18200 },
    { month: 'Nov 2025', balance: 19450 },
    { month: 'Dec 2025', balance: 17800 },
    { month: 'Jan 2026', balance: 20100 },
    { month: 'Feb 2026', balance: 22600 },
    { month: 'Mar 2026', balance: 24850 },
  ],
  spendingBreakdown: [
    { name: 'Housing/Rent', value: 32, amount: 1400, color: '#3b82f6' },
    { name: 'Food & Dining', value: 18, amount: 788, color: '#10b981' },
    { name: 'Transportation', value: 12, amount: 525, color: '#f59e0b' },
    { name: 'Shopping', value: 10, amount: 438, color: '#8b5cf6' },
    { name: 'Utilities', value: 8, amount: 350, color: '#ef4444' },
    { name: 'Entertainment', value: 7, amount: 307, color: '#ec4899' },
    { name: 'Healthcare', value: 6, amount: 263, color: '#06b6d4' },
    { name: 'Others', value: 7, amount: 309, color: '#64748b' },
  ],
  monthlyComparison: [
    { month: 'Oct 2025', income: 6800, expenses: 4600, savingsRate: 32.4 },
    { month: 'Nov 2025', income: 7000, expenses: 4250, savingsRate: 39.3 },
    { month: 'Dec 2025', income: 7000, expenses: 5750, savingsRate: 17.9 },
    { month: 'Jan 2026', income: 7200, expenses: 4500, savingsRate: 37.5 },
    { month: 'Feb 2026', income: 7200, expenses: 4100, savingsRate: 43.1 },
    { month: 'Mar 2026', income: 7200, expenses: 4380, savingsRate: 39.2 },
  ]
};

export const useFinanceStore = create(
  persist(
    (set, get) => ({
      user: {
        firstName: 'Alex',
        role: 'Admin', // 'Admin' | 'Viewer'
      },
      transactions: generateMockTransactions(),
      stats: mockStats,
      selectedTransactionId: null,
      isAddEditModalOpen: false,
      isDetailOpen: false,
      isDark: false,
      
      // Budgets & Notifications State
      budgets: [
        { category: 'Food & Dining', limit: 1200, icon: 'utensils' },
        { category: 'Housing', limit: 1500, icon: 'home' },
        { category: 'Transportation', limit: 600, icon: 'car' },
        { category: 'Shopping', limit: 10000, icon: 'shopping-cart' },
        { category: 'Utilities', limit: 400, icon: 'zap' },
        { category: 'Entertainment', limit: 400, icon: 'film' },
        { category: 'Healthcare', limit: 500, icon: 'heart' },
      ],
      notifications: [
        { 
          id: '1', 
          type: 'warning', 
          title: 'Heads Up on Your Budget!', 
          message: 'You may go over your budget at the current rate of spending. Let\'s review and avoid overspending.',
          timestamp: 'now',
          read: false
        },
        { 
          id: '2', 
          type: 'success', 
          title: 'You\'re Crushing It!', 
          message: 'You spent 30% less than last week! Treat yourself to something special this weekend!',
          timestamp: '5m',
          read: false
        }
      ],
      
      // Actions
      setRole: (role) => set((state) => ({ 
        user: { ...state.user, role } 
      })),
      
      setSelectedTransaction: (id) => set({ selectedTransactionId: id }),
      openAddEditModal: () => set({ isAddEditModalOpen: true }),
      closeAddEditModal: () => set({ isAddEditModalOpen: false, selectedTransactionId: null }),
      openDetail: (id) => set({ isDetailOpen: true, selectedTransactionId: id }),
      closeDetail: () => set({ isDetailOpen: false, selectedTransactionId: null }),

      // Budget & Notification Actions
      setBudget: (category, limit) => set((state) => ({
        budgets: state.budgets.map(b => b.category === category ? { ...b, limit } : b)
      })),
      
      dismissNotification: (id) => set((state) => ({
        notifications: state.notifications.filter(n => n.id !== id)
      })),

      addTransaction: (transaction) => set((state) => ({
        transactions: [transaction, ...state.transactions],
      })),
      
      deleteTransaction: (id) => set((state) => ({
        transactions: state.transactions.filter((t) => t.id !== id),
        isDetailOpen: state.selectedTransactionId === id ? false : state.isDetailOpen,
        selectedTransactionId: state.selectedTransactionId === id ? null : state.selectedTransactionId
      })),
      
      updateTransaction: (updated) => set((state) => ({
        transactions: state.transactions.map((t) => t.id === updated.id ? updated : t),
      })),

      toggleDarkMode: () => set((state) => ({ isDark: !state.isDark })),
      
      // Global Modal States
      isNotificationsOpen: false,
      isRoleSwitcherOpen: false,
      
      setNotificationsOpen: (isOpen) => set({ isNotificationsOpen: isOpen }),
      setRoleSwitcherOpen: (isOpen) => set({ isRoleSwitcherOpen: isOpen }),
    }),
    {
      name: 'finance-storage-v3',
    }
  )
);
