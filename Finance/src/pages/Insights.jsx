import { Lightbulb, TrendingDown, Target, Zap, Repeat, ArrowRight, BarChart2 } from 'lucide-react';
import { useFinanceStore } from '../store/useFinanceStore';
import { motion } from 'framer-motion';
import { ResponsiveContainer, BarChart, Bar, XAxis, Tooltip, Cell, AreaChart, Area } from 'recharts';

export const InsightCard = ({ icon: Icon, title, detail, color, trendData, type = 'bar' }) => {
  const { isDark } = useFinanceStore();
  
  return (
    <motion.div 
      whileHover={{ y: -3 }}
      className={`bg-bg-card dark:bg-slate-900/40 backdrop-blur-xl rounded-2xl p-5 border border-border-color border-l-4 ${color} relative overflow-hidden shadow-lg`}
    >
      <div className="flex gap-3 mb-4">
        <div className={`p-2.5 rounded-xl bg-bg-main dark:bg-slate-800 shadow-sm border border-border-color`}>
          <Icon className="w-4 h-4 text-[var(--accent-primary)]" />
        </div>
        <div>
          <h4 className="text-base font-bold text-slate-900 dark:text-slate-50 tracking-tight leading-none mb-1">{title}</h4>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{detail.subtitle || 'Insight'}</p>
        </div>
      </div>
      
      <p className="text-xs font-medium text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
        {detail.text}
      </p>

      {trendData && (
        <div className="h-24 w-full">
          <ResponsiveContainer width="100%" height="100%">
            {type === 'bar' ? (
              <BarChart data={trendData}>
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {trendData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color || '#3b82f6'} fillOpacity={0.8} />
                  ))}
                </Bar>
                <Tooltip cursor={{ fill: 'transparent' }} content={() => null} />
              </BarChart>
            ) : (
              <AreaChart data={trendData}>
                <Area type="monotone" dataKey="value" stroke="var(--accent-primary)" fill="var(--accent-primary)" fillOpacity={isDark ? 0.2 : 0.1} strokeWidth={2} />
              </AreaChart>
            )}
          </ResponsiveContainer>
        </div>
      )}
    </motion.div>
  );
};

export const Insights = () => {
    const { stats } = useFinanceStore();

    const housingData = [
        { name: 'Housing', value: 32, color: '#3b82f6' },
        { name: 'Other', value: 68, color: '#e2e8f0' }
    ];

    const foodTrend = [
        { value: 702 }, { value: 750 }, { value: 788 }, { value: 880 }
    ];

    return (
        <div className="space-y-8 py-4">
            <div className="flex items-center gap-2">
                <div className="p-2.5 bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-500/20">
                    <Lightbulb className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                   <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50 tracking-tight">Financial Insights</h2>
                   <p className="text-slate-500 text-xs font-semibold tracking-tight">Patterns and observations from your recent activity</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <InsightCard 
                    icon={BarChart2}
                    title="Housing is your biggest expense"
                    color="border-blue-500"
                    detail={{
                        subtitle: "Budget Allocation",
                        text: "Housing costs account for 32% of your total spending—₹1,400 this month. This is within the recommended 30–35% range."
                    }}
                    trendData={housingData}
                />
                
                <InsightCard 
                    icon={TrendingDown}
                    title="Spending is down 5.4%"
                    color="border-emerald-500"
                    detail={{
                        subtitle: "Monthly Progress",
                        text: "March expenses: ₹4,380 vs. February: ₹4,632. Your biggest reduction was in Shopping (-₹210)."
                    }}
                    trendData={[{ value: 4632 }, { value: 4380 }]}
                />

                <InsightCard 
                    icon={Zap}
                    title="Food spending is trending up"
                    color="border-amber-500"
                    detail={{
                        subtitle: "Alert",
                        text: "Your Food & Dining expenses have increased 12% over the last 3 months. At this rate, you'll spend ₹880 next month."
                    }}
                    trendData={foodTrend}
                    type="area"
                />

                <InsightCard 
                    icon={Target}
                    title="₹20k Savings Milestone"
                    color="border-emerald-500"
                    detail={{
                        subtitle: "Achievement",
                        text: "Total savings since Oct 2025: ₹14,820. At your current rate, you'll hit ₹20,000 by July 2026."
                    }}
                    trendData={[{ value: 14820 }]}
                />

                <InsightCard 
                    icon={Repeat}
                    title="Subscription Review"
                    color="border-blue-400"
                    detail={{
                        subtitle: "Recurring Costs",
                        text: "You have 6 active subscriptions totalling ₹142/month. Consider reviewing if all are still needed."
                    }}
                />
            </div>

            {/* Category Deep Dive Section */}
            <motion.div 
               initial={{ opacity: 0, y: 15 }}
               whileInView={{ opacity: 1, y: 0 }}
               className="glass rounded-[32px] p-6 md:p-8 mt-12"
            >
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <h3 className="text-xl font-bold text-text-primary tracking-tight">Category Deep Dive</h3>
                        <p className="text-text-secondary text-sm font-medium mt-0.5">Detailed breakdown of Food & Dining</p>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-1.5 bg-bg-surface border border-border-color rounded-xl text-[10px] font-bold text-text-primary uppercase tracking-widest shadow-sm">
                         March 2026
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10">
                   <div className="space-y-4">
                       {[
                           { name: 'Groceries', value: 44, amount: 347.20, color: 'bg-blue-500' },
                           { name: 'Restaurants', value: 28, amount: 218.40, color: 'bg-emerald-500' },
                           { name: 'Coffee', value: 11, amount: 87.25, color: 'bg-amber-500' },
                           { name: 'Delivery', value: 12, amount: 98.30, color: 'bg-rose-500' },
                           { name: 'Snacks/Other', value: 5, amount: 37.00, color: 'bg-indigo-500' },
                       ].map((cat) => (
                           <div key={cat.name} className="space-y-1.5">
                               <div className="flex justify-between items-end">
                                   <span className="text-xs font-bold text-text-secondary">{cat.name}</span>
                                   <span className="text-xs font-bold text-text-primary">₹{cat.amount}</span>
                               </div>
                               <div className="h-2 w-full bg-bg-main dark:bg-slate-800/50 rounded-full overflow-hidden shadow-inner">
                                   <motion.div 
                                       initial={{ width: 0 }}
                                       whileInView={{ width: `${cat.value}%` }}
                                       className={`h-full ${cat.color} rounded-full shadow-lg`} 
                                   />
                               </div>
                           </div>
                       ))}
                   </div>

                   <div className="space-y-4">
                        <h4 className="text-[10px] font-bold uppercase text-slate-400 tracking-widest ml-1">Daily Heatmap</h4>
                        <div className="grid grid-cols-7 gap-1.5">
                            {Array.from({ length: 31 }).map((_, i) => (
                                <div 
                                    key={i} 
                                    className={`aspect-square rounded-md shadow-sm border border-white/5 ${
                                        [1, 5, 8, 15, 22].includes(i+1) 
                                        ? 'bg-emerald-500 scale-105 ring-4 ring-emerald-500/20' 
                                        : [2, 6, 9, 16, 23].includes(i+1) 
                                        ? 'bg-emerald-300 dark:bg-emerald-400/80' 
                                        : 'bg-bg-main dark:bg-slate-800/50'
                                    }`} 
                                    title={`Day ${i+1}`}
                                />
                            ))}
                        </div>
                        <div className="flex justify-between pt-4 text-[10px] font-black uppercase text-slate-400 tracking-tighter">
                            <span>Week 1</span>
                            <span>Week 2</span>
                            <span>Week 3</span>
                            <span>Week 4</span>
                        </div>
                   </div>
                </div>
            </motion.div>
        </div>
    );
};
