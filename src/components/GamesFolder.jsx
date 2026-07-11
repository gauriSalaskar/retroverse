import { useState } from 'react';
import Snake from './Games/Snake';
import Minesweeper from './Games/Minesweeper';
import TicTacToe from './Games/TicTacToe';

const GAMES = [
  { id: 'snake', label: 'Snake', icon: '🐍' },
  { id: 'minesweeper', label: 'Minesweeper', icon: '💣' },
  { id: 'tictactoe', label: 'Tic Tac Toe', icon: '⭕' },
];

/**
 * GamesFolder
 * Renders inside the "Games" desktop window. Shows a simple icon menu;
 * clicking a game swaps in the corresponding playable component.
 */
export default function GamesFolder({ onSnakeScore }) {
  const [active, setActive] = useState(null);

  if (active === 'snake') return <Snake onFirstScore={onSnakeScore} />;
  if (active === 'minesweeper') return <Minesweeper />;
  if (active === 'tictactoe') return <TicTacToe />;

  return (
    <div className="p-4 grid grid-cols-3 gap-4 font-tahoma">
      {GAMES.map((g) => (
        <button
          key={g.id}
          onClick={() => setActive(g.id)}
          className="flex flex-col items-center gap-1 p-3 rounded hover:bg-white/60"
        >
          <span className="text-3xl">{g.icon}</span>
          <span className="text-xs text-xpDarkBlue font-semibold">{g.label}</span>
        </button>
      ))}
    </div>
  );
}
