import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trophy, ExternalLink, Box } from 'lucide-react';

const MiniBoard = ({ board, n }) => {
  return (
    <div 
      className="grid gap-px bg-white/5 border border-white/10 rounded-sm overflow-hidden"
      style={{ 
        gridTemplateColumns: `repeat(${n}, 1fr)`,
        aspectRatio: '1/1',
        width: '100%'
      }}
    >
      {board.map((row, r) => 
        row.map((cell, c) => (
          <div 
            key={`${r}-${c}`}
            className={`
              ${(r + c) % 2 === 0 ? 'bg-white/5' : 'bg-transparent'}
              flex items-center justify-center p-0.5
            `}
          >
            {cell === 1 && (
              <div className="w-full h-full bg-primary rounded-full shadow-[0_0_8px_#00f2fe]" />
            )}
          </div>
        ))
      )}
    </div>
  );
};

const SolutionVault = ({ isOpen, onClose, solutions, onSelect, n }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
          />

          {/* Side Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md glass-panel border-l border-white/10 z-[70] flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/20 rounded-lg">
                  <Box className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-bold tracking-tight text-white/90">Solution Vault</h2>
                  <p className="text-xs text-white/40 uppercase tracking-widest font-medium">Historical Records</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/60 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
              {solutions.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-40">
                  <Trophy className="w-12 h-12" />
                  <p className="text-sm">No solutions captured yet.<br/>Run the AI solver to fill the vault.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  {solutions.map((sol, idx) => (
                    <motion.div
                      key={idx}
                      whileHover={{ scale: 1.02, y: -4 }}
                      onClick={() => onSelect(sol)}
                      className="group cursor-pointer space-y-2"
                    >
                      <div className="relative glass-panel p-2 border-white/5 group-hover:border-primary/30 transition-all">
                        <MiniBoard board={sol} n={n} />
                        <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-all rounded-glass flex items-center justify-center opacity-0 group-hover:opacity-100">
                          <ExternalLink className="w-6 h-6 text-primary" />
                        </div>
                      </div>
                      <div className="flex items-center justify-between px-1">
                        <span className="text-[10px] font-mono text-white/40 uppercase tracking-tighter">Solution #{idx + 1}</span>
                        <div className="h-1 w-8 bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full bg-primary/40 w-full" />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-white/10 bg-black/20">
              <p className="text-[10px] text-white/30 text-center uppercase tracking-[0.2em]">
                Verified Algorithm Output • N={n}
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SolutionVault;
