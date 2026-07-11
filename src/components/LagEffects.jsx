import { useEffect } from 'react';

/**
 * LagEffects
 * Simulates the general jankiness of browsing on 2006-era hardware,
 * site-wide:
 *   - random full-screen "freeze frame" stutters (like an old CPU
 *     choking for a split second)
 *   - a brief hourglass/wait cursor flash on every click - purely
 *     visual, the real click handler still fires immediately
 *     underneath, so games (Snake, Minesweeper, TicTacToe) and window
 *     dragging stay fully responsive; this only makes it *look* laggy
 * Mount once at the Desktop level - it doesn't render anything itself.
 */
export default function LagEffects() {
  // Random periodic freeze-frame stutter.
  useEffect(() => {
    let timer;
    const scheduleNext = () => {
      const delay = 6000 + Math.random() * 9000; // every 6-15s
      timer = setTimeout(() => {
        document.body.classList.add('retro-freeze');
        setTimeout(() => {
          document.body.classList.remove('retro-freeze');
          scheduleNext();
        }, 120 + Math.random() * 160);
      }, delay);
    };
    scheduleNext();
    return () => clearTimeout(timer);
  }, []);

  // Brief "wait" cursor flash on every click.
  useEffect(() => {
    const handleClick = () => {
      document.body.classList.add('retro-wait-cursor');
      setTimeout(() => {
        document.body.classList.remove('retro-wait-cursor');
      }, 180 + Math.random() * 220);
    };
    window.addEventListener('mousedown', handleClick, true);
    return () => window.removeEventListener('mousedown', handleClick, true);
  }, []);

  return null;
}