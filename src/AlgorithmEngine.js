/**
 * Generator-based N-Queens Engine — Row-by-Row Backtracking
 *
 * Strategy: place exactly one queen per ROW, trying each column.
 * isSafe() only looks at already-placed rows above the current row.
 * This guarantees no row conflicts by construction and eliminates
 * false-conflict bugs from checking empty future rows.
 */

/**
 * isSafe — used only by manual (puzzle) mode.
 * Checks all eight directions from (row, col) against the full board.
 */
export function isSafe(row, col, board, n) {
  // Check same row
  for (let c = 0; c < n; c++) {
    if (c !== col && board[row][c] === 1) return { safe: false, conflict: [row, c] };
  }
  // Check same column
  for (let r = 0; r < n; r++) {
    if (r !== row && board[r][col] === 1) return { safe: false, conflict: [r, col] };
  }
  // Diagonals — all four directions
  for (let i = row - 1, j = col - 1; i >= 0 && j >= 0; i--, j--) {
    if (board[i][j] === 1) return { safe: false, conflict: [i, j] };
  }
  for (let i = row + 1, j = col - 1; i < n && j >= 0; i++, j--) {
    if (board[i][j] === 1) return { safe: false, conflict: [i, j] };
  }
  for (let i = row - 1, j = col + 1; i >= 0 && j < n; i--, j++) {
    if (board[i][j] === 1) return { safe: false, conflict: [i, j] };
  }
  for (let i = row + 1, j = col + 1; i < n && j < n; i++, j++) {
    if (board[i][j] === 1) return { safe: false, conflict: [i, j] };
  }
  return { safe: true };
}

/**
 * isSafeRow — used by the solver only.
 * Only checks ABOVE rows (rows 0..row-1) since lower rows are empty.
 * This is O(row) and never produces false conflicts.
 */
function isSafeRow(row, col, queens) {
  // queens[r] holds the column of the queen placed in row r (or -1 if none)
  for (let r = 0; r < row; r++) {
    const c = queens[r];
    if (c === -1) continue;
    // Same column
    if (c === col) return { safe: false, conflict: [r, c] };
    // Diagonals
    if (Math.abs(r - row) === Math.abs(c - col)) return { safe: false, conflict: [r, c] };
  }
  return { safe: true };
}

function boardSnapshot(queens, n) {
  const board = Array(n).fill(null).map(() => Array(n).fill(0));
  for (let r = 0; r < n; r++) {
    if (queens[r] >= 0) board[r][queens[r]] = 1;
  }
  return board;
}

export function* solveNQueens(n) {
  // queens[r] = column of queen in row r, -1 = empty
  const queens = Array(n).fill(-1);
  const solutions = [];
  let steps = 0;
  let backtracks = 0;
  const startTime = performance.now();

  function* backtrack(row) {
    if (row === n) {
      // Full solution found
      const snap = boardSnapshot(queens, n);
      solutions.push(snap);
      yield {
        type: 'SOLUTION',
        board: snap,
        solutions: solutions.map(s => s.map(r => [...r])),
        steps,
        backtracks,
        time: performance.now() - startTime
      };
      console.log(`[N-Queens] SOLUTION #${solutions.length} found. Steps: ${steps}`);
      return;
    }

    for (let col = 0; col < n; col++) {
      steps++;

      // Visualization: trying this cell
      yield {
        type: 'TRY_PLACE',
        row,
        col,
        board: boardSnapshot(queens, n),
        steps,
        backtracks,
        time: performance.now() - startTime
      };

      const { safe, conflict } = isSafeRow(row, col, queens);

      if (safe) {
        queens[row] = col;
        console.log(`[N-Queens] Placed queen at row ${row}, col ${col}`);

        yield {
          type: 'PLACED',
          row,
          col,
          board: boardSnapshot(queens, n),
          steps,
          backtracks,
          time: performance.now() - startTime
        };

        // Recurse to next row
        yield* backtrack(row + 1);

        // Backtrack: remove queen from this row
        queens[row] = -1;
        backtracks++;
        console.log(`[N-Queens] BACKTRACK from row ${row}, col ${col}. Total backtracks: ${backtracks}`);

        yield {
          type: 'BACKTRACK',
          row,
          col,
          board: boardSnapshot(queens, n),
          steps,
          backtracks,
          time: performance.now() - startTime
        };
      } else {
        console.log(`[N-Queens] Conflict at row ${row}, col ${col} — conflicts with [${conflict}]`);
        yield {
          type: 'CONFLICT',
          row,
          col,
          conflict,
          board: boardSnapshot(queens, n),
          steps,
          backtracks,
          time: performance.now() - startTime
        };
      }
    }
  }

  yield* backtrack(0);

  console.log(`[N-Queens] FINISHED. Total solutions: ${solutions.length}, Steps: ${steps}, Backtracks: ${backtracks}`);
  yield {
    type: 'FINISHED',
    solutions,
    steps,
    backtracks,
    totalSolutions: solutions.length,
    time: performance.now() - startTime
  };
}

export const pseudocode = [
  "function solve(row):",
  "  if row == N: record solution",
  "  for col from 0 to N-1:",
  "    if isSafe(row, col):",
  "      place Queen at (row, col)",
  "      solve(row + 1)",
  "      remove Queen (backtrack)",
  "  return"
];

export const lineMap = {
  'TRY_PLACE': 2,
  'CONFLICT':  3,
  'PLACED':    4,
  'BACKTRACK': 6,
  'SOLUTION':  1
};
