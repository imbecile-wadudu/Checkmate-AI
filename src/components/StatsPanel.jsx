import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Clock, RotateCcw, Target } from 'lucide-react';

const StatsPanel = ({ steps = 0, backtracks = 0, time = 0, solutionsFound = 0 }) => {
  const stats = [
    { label: 'Steps', value: steps, icon: <Activity className="w-4 h-4" />, color: 'var(--color-primary)' },
    { label: 'Backtracks', value: backtracks, icon: <RotateCcw className="w-4 h-4" />, color: 'var(--color-accent)' },
    { label: 'Solns Found', value: solutionsFound, icon: <Target className="w-4 h-4" />, color: 'var(--color-success)' },
    { label: 'Time', value: `${(time / 1000).toFixed(2)}s`, icon: <Clock className="w-4 h-4" />, color: 'var(--color-secondary)' },
  ];

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-2">Live Algorithm Insights</h2>
      {stats.map((stat, idx) => (
        <motion.div
          key={stat.label}
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: idx * 0.1 }}
          className="glass-panel p-3 flex items-center gap-4 group hover:border-primary/40 transition-colors"
        >
          <div 
            className="p-2 rounded-lg bg-surface flex items-center justify-center"
            style={{ color: stat.color, boxShadow: `0 0 10px ${stat.color}33` }}
          >
            {stat.icon}
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-tighter text-white/40">{stat.label}</div>
            <div className="text-lg font-mono font-bold">{stat.value}</div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default StatsPanel;
