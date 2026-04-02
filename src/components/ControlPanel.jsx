import React from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw, SkipForward, Settings2, Sliders } from 'lucide-react';

const ControlPanel = ({ 
  onStart, 
  onPause, 
  onReset, 
  onNext, 
  isRunning, 
  isPaused,
  speed, 
  setSpeed, 
  n, 
  setN,
  showAllSolutions,
  setShowAllSolutions,
  showConflicts,
  setShowConflicts
}) => {
  return (
    <motion.div 
      initial={{ x: 50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="glass-panel p-6 w-[350px] shadow-2xl border-primary/20 flex flex-col gap-8"
    >
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 bg-primary/20 rounded-lg">
          <Settings2 className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h1 className="text-xl font-black tracking-tighter uppercase italic">Checkmate AI</h1>
          <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">N-Queens Solver Engine</p>
        </div>
      </div>

      {/* Main Controls */}
      <div className="grid grid-cols-2 gap-3">
        {!isRunning || isPaused ? (
          <button 
            onClick={onStart} 
            className="col-span-2 btn-primary flex items-center justify-center gap-2 group"
          >
            <Play className="w-4 h-4 fill-current group-hover:scale-110 transition-transform" />
            {isPaused ? 'Resume Solving' : 'Initiate Solver'}
          </button>
        ) : (
          <button 
            onClick={onPause} 
            className="col-span-2 btn-secondary flex items-center justify-center gap-2 group"
          >
            <Pause className="w-4 h-4 fill-current group-hover:scale-110 transition-transform" />
            Pause
          </button>
        )}
        
        <button 
          onClick={onNext} 
          disabled={isRunning && !isPaused}
          className="btn-secondary py-3 flex items-center justify-center gap-2 disabled:opacity-30"
        >
          <SkipForward className="w-4 h-4" />
          Step
        </button>

        <button 
          onClick={onReset} 
          className="bg-white/5 border border-white/10 rounded-full py-3 flex items-center justify-center gap-2 hover:bg-white/10 transition-all font-bold"
        >
          <RotateCcw className="w-4 h-4" />
          Reset
        </button>
      </div>

      {/* Parameters */}
      <div className="space-y-6">
        {/* Speed Slider */}
        <div className="space-y-3">
          <div className="flex justify-between items-center text-[10px] uppercase font-bold tracking-widest text-white/50">
            <span className="flex items-center gap-1"><Sliders className="w-3 h-3" /> Execution Speed</span>
            <span className="text-primary">{speed}ms</span>
          </div>
          <input 
            type="range" 
            min="10" 
            max="1000" 
            step="10"
            value={speed}
            onChange={(e) => setSpeed(parseInt(e.target.value))}
            className="w-full accent-primary bg-white/10 h-1.5 rounded-full appearance-none cursor-pointer"
          />
        </div>

        {/* Board Size */}
        <div className="space-y-3">
          <div className="flex justify-between items-center text-[10px] uppercase font-bold tracking-widest text-white/50">
            <span>Board Dimension (N)</span>
            <span className="text-secondary">{n} × {n}</span>
          </div>
          <div className="flex gap-2">
            {[4, 8, 10, 12].map(val => (
              <button
                key={val}
                onClick={() => setN(val)}
                className={`
                  flex-1 py-1 text-xs rounded-md transition-all font-mono
                  ${n === val ? 'bg-secondary text-white shadow-[0_0_15px_rgba(112,0,255,0.4)]' : 'bg-white/5 text-white/40 hover:bg-white/10 border border-white/5'}
                `}
              >
                {val}
              </button>
            ))}
          </div>
        </div>

        {/* Algorithm Toggles */}
        <div className="space-y-4 pt-4 border-t border-white/5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white/60">Show All Solutions</span>
            <input 
              type="checkbox" 
              checked={showAllSolutions} 
              onChange={() => setShowAllSolutions(!showAllSolutions)}
              className="w-10 h-5 accent-primary cursor-pointer"
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white/60">Conflict Matrix Highlight</span>
            <input 
              type="checkbox" 
              checked={showConflicts} 
              onChange={() => setShowConflicts(!showConflicts)}
              className="w-10 h-5 accent-primary cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Footer Branding */}
      <div className="mt-auto pt-4 text-center">
        <p className="text-[8px] text-white/20 uppercase tracking-[0.3em] font-mono">
          System Status: <span className="text-success">Nominal</span>
        </p>
      </div>
    </motion.div>
  );
};

export default ControlPanel;
