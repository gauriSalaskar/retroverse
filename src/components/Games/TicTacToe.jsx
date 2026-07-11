import { useState, useEffect } from 'react';

const LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function getWinner(cells) {
  for (const [a, b, c] of LINES) {
    if (cells[a] && cells[a] === cells[b] && cells[a] === cells[c]) return cells[a];
  }
  return cells.every(Boolean) ? 'draw' : null;
}

/**
 * TicTacToe
 * Human (X) vs a simple computer opponent (O) that plays a random
 * available square after a short delay — enough for a nostalgic "play
 * against the computer at the cyber café" feel without heavy AI logic.
 */
export default function TicTacToe() {
  const [cells, setCells] = useState(Array(9).fill(null));
  const [turn, setTurn] = useState('X');
  const winner = getWinner(cells);

  useEffect(() => {
    if (turn === 'O' && !winner) {
      const timeout = setTimeout(() => {
        const available = cells.map((c, i) => (c ? null : i)).filter((i) => i !== null);
        if (available.length === 0) return;
        const choice = available[Math.floor(Math.random() * available.length)];
        setCells((prev) => {
          const next = [...prev];
          next[choice] = 'O';
          return next;
        });
        setTurn('X');
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [turn, cells, winner]);

  const play = (index) => {
    if (cells[index] || winner || turn !== 'X') return;
    const next = [...cells];
    next[index] = 'X';
    setCells(next);
    setTurn('O');
  };

  const restart = () => {
    setCells(Array(9).fill(null));
    setTurn('X');
  };

  return (
    <div className="flex flex-col items-center p-4 font-tahoma">
      <p className="text-sm font-bold text-xpDarkBlue mb-3">
        {winner === 'draw' && "It's a draw!"}
        {winner === 'X' && 'You win! 🎉'}
        {winner === 'O' && 'Computer wins!'}
        {!winner && (turn === 'X' ? 'Your turn (X)' : 'Computer thinking...')}
      </p>
      <div className="grid grid-cols-3 gap-1 bg-gray-500 p-1">
        {cells.map((cell, i) => (
          <button
            key={i}
            onClick={() => play(i)}
            className="w-16 h-16 bg-white text-2xl font-bold flex items-center justify-center hover:bg-gray-100"
          >
            {cell === 'X' && <span className="text-xpBlue">X</span>}
            {cell === 'O' && <span className="text-pinkAccent">O</span>}
          </button>
        ))}
      </div>
      {winner && (
        <button onClick={restart} className="aero-button px-3 py-1 text-xpDarkBlue text-sm mt-3">
          Play Again
        </button>
      )}
    </div>
  );
}
