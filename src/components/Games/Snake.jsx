import { useEffect, useRef, useState, useCallback } from 'react';
import useLocalStorage from '../../hooks/useLocalStorage';

const GRID_SIZE = 15;
const CELL_PX = 18;
const INITIAL_SNAKE = [{ x: 7, y: 7 }];
const TICK_MS = 140;

function randomFood(snake) {
  let pos;
  do {
    pos = { x: Math.floor(Math.random() * GRID_SIZE), y: Math.floor(Math.random() * GRID_SIZE) };
  } while (snake.some((s) => s.x === pos.x && s.y === pos.y));
  return pos;
}

/**
 * Snake
 * Classic arrow-key snake game rendered on a CSS grid. Score is kept in
 * localStorage as a high score, and onWin() fires once (first food eaten)
 * so the parent can unlock the "Played Snake" achievement.
 */
export default function Snake({ onFirstScore }) {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [food, setFood] = useState(() => randomFood(INITIAL_SNAKE));
  const [direction, setDirection] = useState({ x: 1, y: 0 });
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useLocalStorage('retroverse_snake_highscore', 0);
  const directionRef = useRef(direction);
  directionRef.current = direction;

  const handleKey = useCallback((e) => {
    const map = {
      ArrowUp: { x: 0, y: -1 },
      ArrowDown: { x: 0, y: 1 },
      ArrowLeft: { x: -1, y: 0 },
      ArrowRight: { x: 1, y: 0 },
    };
    const next = map[e.key];
    if (!next) return;
    // prevent reversing directly into itself
    if (next.x === -directionRef.current.x && next.y === -directionRef.current.y) return;
    setDirection(next);
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [handleKey]);

  useEffect(() => {
    if (gameOver) return;
    const interval = setInterval(() => {
      setSnake((prev) => {
        const head = { x: prev[0].x + directionRef.current.x, y: prev[0].y + directionRef.current.y };

        const hitWall = head.x < 0 || head.y < 0 || head.x >= GRID_SIZE || head.y >= GRID_SIZE;
        const hitSelf = prev.some((s) => s.x === head.x && s.y === head.y);
        if (hitWall || hitSelf) {
          setGameOver(true);
          return prev;
        }

        const ateFood = head.x === food.x && head.y === food.y;
        const newSnake = [head, ...prev];
        if (!ateFood) {
          newSnake.pop();
        } else {
          setScore((s) => {
            const newScore = s + 10;
            setHighScore((h) => Math.max(h, newScore));
            return newScore;
          });
          setFood(randomFood(newSnake));
          onFirstScore?.();
        }
        return newSnake;
      });
    }, TICK_MS);
    return () => clearInterval(interval);
  }, [food, gameOver, onFirstScore, setHighScore]);

  const restart = () => {
    setSnake(INITIAL_SNAKE);
    setFood(randomFood(INITIAL_SNAKE));
    setDirection({ x: 1, y: 0 });
    setScore(0);
    setGameOver(false);
  };

  return (
    <div className="flex flex-col items-center p-3 font-tahoma">
      <div className="flex justify-between w-full mb-2 text-sm font-bold text-xpDarkBlue">
        <span>Score: {score}</span>
        <span>High Score: {highScore}</span>
      </div>
      <div
        className="relative bg-white border-2 border-xpDarkBlue"
        style={{ width: GRID_SIZE * CELL_PX, height: GRID_SIZE * CELL_PX }}
      >
        {snake.map((s, i) => (
          <div
            key={i}
            className={i === 0 ? 'absolute bg-limeGreen rounded-sm' : 'absolute bg-green-600 rounded-sm'}
            style={{ width: CELL_PX - 2, height: CELL_PX - 2, left: s.x * CELL_PX, top: s.y * CELL_PX }}
          />
        ))}
        <div
          className="absolute bg-red-500 rounded-full"
          style={{ width: CELL_PX - 4, height: CELL_PX - 4, left: food.x * CELL_PX + 2, top: food.y * CELL_PX + 2 }}
        />
        {gameOver && (
          <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center text-white">
            <p className="font-bold mb-2">Game Over!</p>
            <button onClick={restart} className="aero-button px-3 py-1 text-xpDarkBlue text-sm">
              Play Again
            </button>
          </div>
        )}
      </div>
      <p className="text-xs text-gray-600 mt-2">Use arrow keys to move</p>
    </div>
  );
}
