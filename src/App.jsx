import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import Background from './components/Background';
import ChessBoard from './components/ChessBoard';
import ControlPanel from './components/ControlPanel';
import CodeVisualizer from './components/CodeVisualizer';
import StatsPanel from './components/StatsPanel';
import { ChevronLeft, ChevronRight, Trophy, History, MousePointer2 } from 'lucide-react';
import { solveNQueens, pseudocode, lineMap, isSafe } from './AlgorithmEngine';
import SolutionVault from './components/SolutionVault';

// Audio Context for synthetic sounds
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
const playSound = (freq, type = 'sine', duration = 0.1) => {
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
  gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start();
  osc.stop(audioCtx.currentTime + duration);
};

function App() {
  const [n, setN] = useState(8);
  const [speed, setSpeed] = useState(100);
  const [board, setBoard] = useState(Array(8).fill(null).map(() => Array(8).fill(0)));
  const [steps, setSteps] = useState(0);
  const [backtracks, setBacktracks] = useState(0);
  const [time, setTime] = useState(0);
  const [solutions, setSolutions] = useState([]);
  const [currentSolutionIdx, setCurrentSolutionIdx] = useState(-1);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentPos, setCurrentPos] = useState(null);
  const [conflictPos, setConflictPos] = useState(null);
  const [line, setLine] = useState(-1);
  const [showAllSolutions, setShowAllSolutions] = useState(false);
  const [showConflicts, setShowConflicts] = useState(true);
  const [isManualMode, setIsManualMode] = useState(false);
  const [manualBoard, setManualBoard] = useState(Array(8).fill(null).map(() => Array(8).fill(0)));
  const [vaultOpen, setVaultOpen] = useState(false);
  const [manualConflicts, setManualConflicts] = useState([]);

  const solverRef = useRef(null);
  const timerRef = useRef(null);

  const reset = useCallback(() => {
    setIsRunning(false);
    setIsPaused(false);
    setBoard(Array(n).fill(null).map(() => Array(n).fill(0)));
    setSteps(0);
    setBacktracks(0);
    setTime(0);
    setSolutions([]);
    setCurrentSolutionIdx(-1);
    setCurrentPos(null);
    setConflictPos(null);
    setLine(-1);
    solverRef.current = null;
    if (timerRef.current) clearInterval(timerRef.current);
  }, [n]);

  useEffect(() => {
    reset();
    setManualBoard(Array(n).fill(null).map(() => Array(n).fill(0)));
    setManualConflicts([]);
  }, [n, reset]);


  // Auto-boost speed for large N so the solver doesn't stall forever
  const effectiveSpeed = n >= 10 ? Math.min(speed, 5) : n >= 8 ? Math.min(speed, 20) : speed;

  const step = useCallback(() => {
    if (!solverRef.current) {
      solverRef.current = solveNQueens(n);
    }

    const { value, done } = solverRef.current.next();

    if (done) {
      setIsRunning(false);
      return;
    }

    // FINISHED event has no board — just stop cleanly
    if (value.type === 'FINISHED') {
      setIsRunning(false);
      playSound(880, 'sine', 0.3);
      return;
    }

    // Update board state (every step has a board except FINISHED)
    setBoard(value.board);
    setSteps(value.steps);
    setBacktracks(value.backtracks);
    setTime(value.time);
    setLine(lineMap[value.type] || -1);

    if (value.type === 'TRY_PLACE') {
      setCurrentPos([value.row, value.col]);
      setConflictPos(null);
      if (n <= 12) playSound(440, 'triangle', 0.05);
    } else if (value.type === 'PLACED') {
      setCurrentPos(null);
      if (n <= 12) playSound(660, 'sine', 0.1);
    } else if (value.type === 'CONFLICT') {
      setConflictPos(value.conflict);
      if (n <= 12) playSound(220, 'sawtooth', 0.1);
    } else if (value.type === 'BACKTRACK') {
      if (n <= 12) playSound(330, 'square', 0.05);
    } else if (value.type === 'SOLUTION') {
      setSolutions(value.solutions);
      setCurrentSolutionIdx(value.solutions.length - 1);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#00f2ff', '#7000ff', '#ff007a']
      });
      playSound(1200, 'sine', 0.5);
      if (!showAllSolutions) {
        setIsRunning(false);
      }
    }
  }, [n, showAllSolutions]);

  useEffect(() => {
    if (isRunning && !isPaused) {
      timerRef.current = setInterval(step, effectiveSpeed);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isRunning, isPaused, effectiveSpeed, step]);

  const startSolving = () => {
    if (isPaused) {
      setIsPaused(false);
    } else {
      reset();
      setIsRunning(true);
    }
    if (audioCtx.state === 'suspended') audioCtx.resume();
  };

  const pauseSolving = () => setIsPaused(true);

  const navigateSolutions = (dir) => {
    const nextIdx = currentSolutionIdx + dir;
    if (nextIdx >= 0 && nextIdx < solutions.length) {
      setBoard(solutions[nextIdx]);
      setCurrentSolutionIdx(nextIdx);
    }
  };

  const toggleManualMode = () => {
    setIsManualMode(!isManualMode);
    if (!isManualMode) {
      // Entering manual mode
      reset();
      setManualBoard(Array(n).fill(null).map(() => Array(n).fill(0)));
      setManualConflicts([]);
    }
  };

  const handleCellClick = (row, col) => {
    if (!isManualMode || isRunning) return;

    const newBoard = manualBoard.map(r => [...r]);
    newBoard[row][col] = newBoard[row][col] === 1 ? 0 : 1;
    setManualBoard(newBoard);

    // Recalculate conflicts for ALL queens in manual mode
    const conflicts = [];
    for (let r = 0; r < n; r++) {
      for (let c = 0; c < n; c++) {
        if (newBoard[r][c] === 1) {
          const { safe, conflict } = isSafe(r, c, newBoard, n);
          if (!safe) {
            conflicts.push({ pos: [r, c], conflict });
          }
        }
      }
    }
    setManualConflicts(conflicts);

    if (conflicts.length === 0) {
      const queenCount = newBoard.flat().filter(x => x === 1).length;
      if (queenCount === n) {
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#00f2fe', '#4facfe', '#7000FF']
        });
        playSound(1200, 'sine', 0.5);
      }
    }
    playSound(440, 'sine', 0.05);
  };

  const loadVaultSolution = (sol) => {
    setIsManualMode(false);
    setBoard(sol);
    setSolutions([sol]);
    setCurrentSolutionIdx(0);
    setVaultOpen(false);
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 lg:p-8 gap-12 overflow-hidden bg-background">
      <Background />

      <SolutionVault
        isOpen={vaultOpen}
        onClose={() => setVaultOpen(false)}
        solutions={solutions}
        onSelect={loadVaultSolution}
        n={n}
      />

      {/* Main Content Container */}
      <div className="flex flex-col lg:flex-row items-center justify-center gap-12 max-w-[1400px] w-full z-10">

        {/* Visualizer Side */}
        <div className="flex-1 flex flex-col gap-6 items-center max-h-[calc(100vh-4rem)] overflow-y-auto overflow-x-hidden pr-2 custom-scrollbar">
          {/* Solution Navigator (Only if multiple solutions) */}
          <AnimatePresence>
            {solutions.length > 0 && !isRunning && (
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="glass-panel p-4 flex items-center justify-between border-success/30"
              >
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-success/20 rounded-full text-success">
                    <Trophy className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-widest text-success">Optimal Patterns Detected</h3>
                    <p className="text-xs text-white/40">Exploring solution space for N = {n}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs font-mono text-white/60">
                    {currentSolutionIdx + 1} / {solutions.length}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => navigateSolutions(-1)}
                      disabled={currentSolutionIdx <= 0}
                      className="p-2 hover:bg-white/10 rounded-full disabled:opacity-20 transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => navigateSolutions(1)}
                      disabled={currentSolutionIdx >= solutions.length - 1}
                      className="p-2 hover:bg-white/10 rounded-full disabled:opacity-20 transition-colors"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <ChessBoard
            n={n}
            board={isManualMode ? manualBoard : board}
            currentPos={currentPos}
            conflictPos={conflictPos}
            showConflicts={showConflicts}
            manualConflicts={isManualMode ? manualConflicts.map(c => c.pos) : []}
            isManualMode={isManualMode}
            onCellClick={handleCellClick}
          />
        </div>

        {/* Control Side */}
        <div className="flex flex-col gap-6 w-[400px] max-h-[calc(100vh-4rem)] overflow-y-auto pr-2 overflow-x-hidden custom-scrollbar">
          <div className="flex items-center justify-between mb-2">
            <button
              onClick={() => setVaultOpen(true)}
              className="flex items-center gap-2 px-4 py-2 glass-panel border-primary/20 hover:border-primary/50 text-primary text-xs font-bold uppercase tracking-wider transition-all"
            >
              <History className="w-4 h-4" />
              Open Vault
            </button>

            {/* Capsule Toggle for Puzzle Mode */}
            <button
              onClick={toggleManualMode}
              className="flex items-center gap-3 group"
              aria-label="Toggle Puzzle Mode"
            >
              <span className={`text-xs font-bold uppercase tracking-wider transition-colors ${isManualMode ? 'text-accent' : 'text-white/40'}`}>
                Puzzle Mode
              </span>
              <div
                className={`relative w-12 h-6 rounded-full transition-all duration-300 ${isManualMode
                    ? 'bg-accent shadow-[0_0_12px_rgba(168,85,247,0.6)]'
                    : 'bg-white/10 group-hover:bg-white/20'
                  }`}
              >
                <motion.div
                  layout
                  animate={{ x: isManualMode ? 24 : 2 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-md"
                />
              </div>
            </button>
          </div>

          <ControlPanel
            n={n}
            setN={setN}
            speed={speed}
            setSpeed={setSpeed}
            isRunning={isRunning}
            isPaused={isPaused}
            onStart={startSolving}
            onPause={pauseSolving}
            onReset={reset}
            onNext={step}
            showAllSolutions={showAllSolutions}
            setShowAllSolutions={setShowAllSolutions}
            showConflicts={showConflicts}
            setShowConflicts={setShowConflicts}
          />

          <StatsPanel
            steps={steps}
            backtracks={backtracks}
            time={time}
            solutionsFound={solutions.length}
          />

          <div className="h-[320px] flex-shrink-0">
            <CodeVisualizer
              code={pseudocode}
              activeLine={line}
            />
          </div>
        </div>
      </div>

      {/* Page Load Animation Mask */}
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
        className="fixed inset-0 bg-background z-[100] pointer-events-none flex items-center justify-center"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-t-2 border-primary rounded-full"
        />
      </motion.div>
    </div>
  );
}

export default App;
