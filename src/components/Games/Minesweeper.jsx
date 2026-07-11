import { useState, useCallback } from 'react';

const SIZE = 8;
const MINE_COUNT = 10;

function buildBoard() {
  const cells = Array.from({ length: SIZE * SIZE }, (_, i) => ({
    index: i,
    x: i % SIZE,
    y: Math.floor(i / SIZE),
    mine: false,
    revealed: false,
    flagged: false,
    adjacent: 0,
  }));

  let placed = 0;
  while (placed < MINE_COUNT) {
    const idx = Math.floor(Math.random() * cells.length);
    if (!cells[idx].mine) {
      cells[idx].mine = true;
      placed++;
    }
  }

  const neighborsOf = (cell) =>
    cells.filter((c) => Math.abs(c.x - cell.x) <= 1 && Math.abs(c.y - cell.y) <= 1 && c.index !== cell.index);

  cells.forEach((cell) => {
    cell.adjacent = neighborsOf(cell).filter((n) => n.mine).length;
  });

  return cells;
}

/**
 * Minesweeper
 * Classic click-to-reveal / right-click-to-flag Minesweeper on an 8x8
 * grid with 10 mines — small enough to be quick fun inside an XP popup
 * window.
 */
export default function Minesweeper() {
  const [board, setBoard] = useState(buildBoard);
  const [status, setStatus] = useState('playing'); // playing | won | lost

  const reveal = useCallback(
    (index) => {
      if (status !== 'playing') return;
      setBoard((prev) => {
        const next = prev.map((c) => ({ ...c }));
        const cell = next[index];
        if (cell.revealed || cell.flagged) return prev;

        const floodReveal = (i) => {
          const c = next[i];
          if (c.revealed || c.flagged) return;
          c.revealed = true;
          if (c.adjacent === 0 && !c.mine) {
            next
              .filter((n) => Math.abs(n.x - c.x) <= 1 && Math.abs(n.y - c.y) <= 1 && n.index !== c.index)
              .forEach((n) => floodReveal(n.index));
          }
        };

        floodReveal(index);

        if (cell.mine) {
          setStatus('lost');
          next.forEach((c) => {
            if (c.mine) c.revealed = true;
          });
        } else {
          const allSafeRevealed = next.filter((c) => !c.mine).every((c) => c.revealed);
          if (allSafeRevealed) setStatus('won');
        }

        return next;
      });
    },
    [status]
  );

  const toggleFlag = useCallback(
    (e, index) => {
      e.preventDefault();
      if (status !== 'playing') return;
      setBoard((prev) => {
        const next = prev.map((c) => ({ ...c }));
        if (!next[index].revealed) next[index].flagged = !next[index].flagged;
        return next;
      });
    },
    [status]
  );

  const restart = () => {
    setBoard(buildBoard());
    setStatus('playing');
  };

  return (
    <div className="flex flex-col items-center p-3 font-tahoma">
      <div className="mb-2 text-sm font-bold text-xpDarkBlue">
        {status === 'playing' && 'Left click: reveal · Right click: flag 🚩'}
        {status === 'won' && '🎉 You cleared the field!'}
        {status === 'lost' && '💥 Boom! You hit a mine.'}
      </div>
      <div
        className="grid border-2 border-gray-500"
        style={{ gridTemplateColumns: `repeat(${SIZE}, 28px)` }}
      >
        {board.map((cell) => (
          <button
            key={cell.index}
            onClick={() => reveal(cell.index)}
            onContextMenu={(e) => toggleFlag(e, cell.index)}
            className={`w-7 h-7 text-xs font-bold flex items-center justify-center border ${
              cell.revealed
                ? 'bg-gray-200 border-gray-400'
                : 'bg-gray-400 border-gray-500 hover:bg-gray-300 active:bg-gray-300'
            }`}
          >
            {cell.revealed
              ? cell.mine
                ? '💣'
                : cell.adjacent > 0
                ? cell.adjacent
                : ''
              : cell.flagged
              ? '🚩'
              : ''}
          </button>
        ))}
      </div>
      {status !== 'playing' && (
        <button onClick={restart} className="aero-button px-3 py-1 text-xpDarkBlue text-sm mt-3">
          New Game
        </button>
      )}
    </div>
  );
}
