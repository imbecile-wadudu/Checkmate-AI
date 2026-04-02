import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Code2 } from 'lucide-react';

const CodeVisualizer = ({ code = [], activeLine = -1 }) => {
  return (
    <div className="glass-panel p-6 flex flex-col gap-4 overflow-hidden border-secondary/20 h-full">
      <div className="flex items-center gap-2 mb-2 text-secondary font-bold uppercase tracking-widest text-xs">
        <Code2 className="w-4 h-4" />
        Algorithm Execution Sync
      </div>
      
      <div className="font-mono text-sm space-y-1 relative overflow-y-auto custom-scrollbar flex-grow pr-2">
        {code.map((line, idx) => (
          <div key={idx} className="relative group flex items-center gap-3">
            {/* Line Number */}
            <span className="w-4 text-white/20 text-[10px] text-right">{idx + 1}</span>
            
            {/* Active Line Highlight Background */}
            <AnimatePresence mode="wait">
              {activeLine === idx && (
                <motion.div
                  layoutId="activeLine"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="absolute inset-y-0 -left-6 -right-6 bg-secondary/10 border-l-2 border-secondary z-0"
                />
              )}
            </AnimatePresence>

            {/* Line Content */}
            <pre className={`
              relative z-10 py-0.5 transition-colors duration-200
              ${activeLine === idx ? 'text-secondary drop-shadow-[0_0_8px_rgba(112,0,255,0.4)] font-bold' : 'text-white/60'}
            `}>
              {line}
            </pre>
          </div>
        ))}
      </div>

      {/* Decorative Binary/Code Noise */}
      <div className="mt-auto pt-4 border-t border-white/5 opacity-20 font-mono text-[8px] overflow-hidden whitespace-nowrap">
        {Array(5).fill('01100010 01100001 01100011 01101011 01110100 01110010 01100001 01100011 01101011').join(' ')}
      </div>
    </div>
  );
};

export default CodeVisualizer;
