import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Memoized Cell Component for Performance
const BoardCell = React.memo(({ 
  r, c, isDark, hasQueen, highlighted, conflict, placing, onMouseEnter, onMouseLeave, onClick, isManualMode, isManualConflict 
}) => {
  return (
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
      className={`
        relative flex items-center justify-center rounded-sm transition-all duration-300
        ${isManualMode ? 'cursor-pointer hover:bg-white/10' : 'cursor-crosshair'}
        aspect-square overflow-hidden
        ${isDark ? 'bg-surface/60' : 'bg-white/5'}
        ${highlighted ? 'bg-primary/10 shadow-[inset_0_0_15px_rgba(0,242,255,0.15)]' : ''}
        ${conflict ? 'bg-error/30 shadow-[inset_0_0_20px_rgba(255,51,51,0.4)]' : ''}
        ${isManualConflict ? 'bg-error/40 ring-2 ring-error animate-pulse' : ''}
        ${placing ? 'bg-success/20 animate-pulse' : ''}
      `}
      style={{
        transition: 'background-color 200ms ease-in-out, box-shadow 200ms ease-in-out',
        willChange: 'background-color, box-shadow'
      }}
    >
      {/* Diagonal Highlight Lines */}
      {highlighted && (
        <div className="absolute inset-0 border border-primary/5 pointer-events-none" />
      )}

      <AnimatePresence mode="wait">
        {hasQueen && (
          <motion.div
            initial={{ scale: 0, opacity: 0, rotate: -45 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            exit={{ scale: 0, opacity: 0, rotate: 45 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="absolute inset-0 flex items-center justify-center z-10 drop-shadow-[0_0_10px_rgba(0,242,255,0.8)]"
          >
            {/* Queen Icon Container */}
            <div className="w-4/5 h-4/5 flex items-center justify-center">
              <svg
                viewBox="0 0 24 24"
                className="w-full h-full text-primary fill-current"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M18,3L15,7H9L6,3L10,5L12,2L14,5L18,3M4,9L6,11H18L20,9L18,13V18H6V13L4,9M6,19V21H18V19H6Z" />
              </svg>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Conflict X Marker */}
      {(conflict || isManualConflict) && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute inset-0 flex items-center justify-center text-error font-bold text-2xl z-20 pointer-events-none"
        >
          ×
        </motion.div>
      )}
    </div>
  );
});

BoardCell.displayName = 'BoardCell';

const ChessBoard = ({ 
  n = 8, 
  board = [], 
  currentPos = null, 
  conflictPos = null, 
  showConflicts = true,
  manualConflicts = [],
  isManualMode = false,
  onCellClick = null
}) => {
  const [hoveredCell, setHoveredCell] = useState(null);

  const isHighlighted = (r, c) => {
    if (!hoveredCell) return false;
    const [hr, hc] = hoveredCell;
    if (r === hr || c === hc) return true;
    if (Math.abs(r - hr) === Math.abs(c - hc)) return true;
    return false;
  };

  const isConflict = (r, c) => {
    if (!showConflicts) return false;
    if (conflictPos && conflictPos[0] === r && conflictPos[1] === c) return true;
    return false;
  };

  const isManualConflict = (r, c) => {
    if (!showConflicts) return false;
    return manualConflicts.some(pos => pos[0] === r && pos[1] === c);
  };

  const isPlacing = (r, c) => {
    if (currentPos && currentPos[0] === r && currentPos[1] === c) return true;
    return false;
  }

  return (
    <div className="relative flex items-center justify-center p-8">
      {/* 3D Tilt Container */}
      <motion.div
        style={{
          perspective: 1000,
        }}
        animate={{
          rotateX: hoveredCell ? (hoveredCell[0] - n/2) * 2 : 5,
          rotateY: hoveredCell ? (hoveredCell[1] - n/2) * -2 : 0,
        }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className="glass-panel p-4 shadow-2xl border-primary/20"
      >
        <div 
          className="grid gap-1"
          style={{ 
            gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))`,
            gridTemplateRows: `repeat(${n}, minmax(0, 1fr))`,
            width: 'min(75vh, 85vw)',
            height: 'min(75vh, 85vw)',
          }}
        >
          {Array.from({ length: n * n }).map((_, i) => {
            const r = Math.floor(i / n);
            const c = i % n;
            return (
              <BoardCell
                key={`${r}-${c}`}
                r={r}
                c={c}
                isDark={(r + c) % 2 === 1}
                hasQueen={board[r] && board[r][c] === 1}
                highlighted={isHighlighted(r, c)}
                conflict={isConflict(r, c)}
                isManualConflict={isManualConflict(r, c)}
                isManualMode={isManualMode}
                onClick={() => onCellClick && onCellClick(r, c)}
                placing={isPlacing(r, c)}
                onMouseEnter={() => setHoveredCell([r, c])}
                onMouseLeave={() => setHoveredCell(null)}
              />
            );
          })}
        </div>
      </motion.div>

      {/* Grid Coordinates */}
      <div className="absolute -left-2 top-0 bottom-0 flex flex-col justify-between py-12 text-xs text-white/30 uppercase tracking-widest pointer-events-none">
        {Array.from({ length: n }).map((_, i) => <span key={i}>{n - i}</span>)}
      </div>
      <div className="absolute -bottom-2 left-0 right-0 flex justify-between px-12 text-xs text-white/30 uppercase tracking-widest pointer-events-none">
        {Array.from({ length: n }).map((_, i) => <span key={i}>{String.fromCharCode(65 + i)}</span>)}
      </div>
    </div>
  );
};

export default ChessBoard;
