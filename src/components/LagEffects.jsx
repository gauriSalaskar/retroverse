import { useEffect } from 'react';

/**
 * LagEffects
 * Simulates the general jankiness of browsing on 2006-era hardware,
 * site-wide:
 *   - random REAL freeze-frame stutters: briefly blocks the main
 *     thread with a busy-wait, so the cursor, animations, and clicks
 *     all genuinely stutter for a moment (a CSS-only pause doesn't
 *     touch Framer Motion's JS-driven animations, so this blocks the
 *     thread directly instead)
 *   - a brief hourglass/wait cursor flash on every click
 * Mount once at the Desktop level - it doesn't render anything itself.
 */
export default function LagEffects() {
  // Real main-thread freeze: blocks JS execution (and therefore all
  // rendering/animation/input) for a short random burst, at random
  // intervals. This is what actually makes it *feel* like an old,
  // struggling CPU rather than a smooth modern one.
  useEffect(() => {
    let timer;
    const scheduleNext = () => {
      const delay = 5000 + Math.random() * 6000; // every 5-11s
      timer = setTimeout(() => {
        const freezeMs = 150 + Math.random() * 250; // 150-400ms
        const until = performance.now() + freezeMs;
        // eslint-disable-next-line no-empty
        while (performance.now() < until) {}
        scheduleNext();
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