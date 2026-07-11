import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import useSound from '../hooks/useSound';

const LOADING_MESSAGES = [
  'Connecting to server...',
  'Packet loss detected...',
  'Reconnecting...',
  'Signal weak...',
  'Establishing connection...',
  'Buffering...',
  'Timed out. Retrying...',
];

/**
 * Window
 * Generic draggable Windows XP-style window chrome (title bar with
 * gradient, minimize/maximize/close buttons, drag handle). Every app
 * (Internet Explorer, Orkut, Messenger, etc.) renders inside one of
 * these so the desktop feels consistent.
 *
 * Dragging is powered by Framer Motion's `drag` prop — no extra
 * dependency needed.
 *
 * The window chrome (title bar) appears instantly on open, but the
 * body content fakes a crackly, glitchy "bad connection" loading
 * sequence before rendering: static noise burst, a stepped progress
 * bar that stalls/jumps backward, screen-tear flicker, RGB-split
 * loading text, and rotating connection-drop flavor text - then the
 * real content snaps in abruptly rather than fading in smoothly.
 */
export default function Window({
  title,
  icon = '🪟',
  onClose,
  onMinimize,
  onFocus,
  zIndex = 10,
  minimized = false,
  initialPosition = { x: 120, y: 80 },
  width = 480,
  children,
}) {
  const { play: playOpen } = useSound('/src/assets/sounds/folder-open.mp3', { volume: 0.35 });
  const [loading, setLoading] = useState(true);
  const [staticBurst, setStaticBurst] = useState(true);
  const [tearLines, setTearLines] = useState([]);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState(
    LOADING_MESSAGES[Math.floor(Math.random() * LOADING_MESSAGES.length)]
  );
  const progressRef = useRef(0);

  // Play the folder/window-open blip once when this window first mounts.
  useEffect(() => {
    playOpen();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Static noise burst right as the window opens (like a CRT losing
  // signal for a moment) before the glitchy loading sequence begins.
  useEffect(() => {
    const t = setTimeout(() => setStaticBurst(false), 220 + Math.random() * 160);
    return () => clearTimeout(t);
  }, []);

  // Stepped, glitchy "progress" - jumps forward in uneven chunks,
  // occasionally stalls, and occasionally jumps backward like a
  // dropped packet forcing a re-send. Deliberately NOT a smooth
  // continuous fill.
  useEffect(() => {
    let cancelled = false;

    const tick = () => {
      if (cancelled) return;

      const roll = Math.random();
      if (roll < 0.12) {
        // Stall - no progress this tick, just re-schedule.
      } else if (roll < 0.22) {
        // Dropped packet - jump backward slightly.
        progressRef.current = Math.max(0, progressRef.current - (5 + Math.random() * 10));
        setMessage(LOADING_MESSAGES[Math.floor(Math.random() * LOADING_MESSAGES.length)]);
      } else {
        // Chunky forward jump.
        progressRef.current = Math.min(100, progressRef.current + (8 + Math.random() * 22));
      }
      setProgress(progressRef.current);

      // Random screen-tear line flash alongside a progress tick.
      if (Math.random() < 0.35) {
        const y = Math.random() * 100;
        const id = Date.now() + Math.random();
        setTearLines((prev) => [...prev, { id, y }]);
        setTimeout(() => {
          setTearLines((prev) => prev.filter((l) => l.id !== id));
        }, 90 + Math.random() * 90);
      }

      if (progressRef.current >= 100) {
        // One last static flash right before the abrupt reveal.
        setStaticBurst(true);
        setTimeout(() => {
          setStaticBurst(false);
          setLoading(false);
        }, 140);
        return;
      }

      const nextDelay = 90 + Math.random() * 260;
      setTimeout(tick, nextDelay);
    };

    const start = setTimeout(tick, 150);
    return () => {
      cancelled = true;
      clearTimeout(start);
    };
  }, []);

  if (minimized) return null;

  return (
    <motion.div
      drag
      dragMomentum={false}
      dragElastic={0}
      onMouseDown={onFocus}
      initial={{ opacity: 0, scale: 0.92, x: initialPosition.x, y: initialPosition.y }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      style={{ position: 'absolute', width, zIndex }}
      className="shadow-xpWindow rounded-t-md overflow-hidden border border-xpDarkBlue select-none"
    >
      {/* Title bar - drag handle */}
      <div className="bg-xp-titlebar text-white flex items-center justify-between px-2 py-1.5 cursor-move">
        <div className="flex items-center gap-2 text-sm font-bold truncate">
          <span>{icon}</span>
          <span className="truncate">{title}</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={onMinimize}
            className="w-5 h-5 bg-silverChrome text-xpDarkBlue text-xs font-bold rounded-sm hover:brightness-95"
            aria-label="Minimize"
          >
            _
          </button>
          <button
            onClick={onClose}
            className="w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-sm hover:brightness-95"
            aria-label="Close"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="bg-silverChrome max-h-[70vh] overflow-y-auto choppy-scroll relative">
        {loading ? (
          <div className="relative flex flex-col items-center justify-center gap-3 py-12 px-4 min-h-[180px] overflow-hidden bg-black">
            {/* Static noise burst overlay */}
            {staticBurst && <div className="absolute inset-0 static-noise z-20" />}

            {/* Screen-tear lines */}
            {tearLines.map((l) => (
              <div
                key={l.id}
                className="absolute left-0 right-0 h-[3px] bg-white/70 mix-blend-difference z-10"
                style={{ top: `${l.y}%`, transform: `translateX(${Math.random() > 0.5 ? '6px' : '-6px'})` }}
              />
            ))}

            <span className="text-3xl relative z-0">{icon}</span>
            <p className="text-xs text-limeGreen font-mono glitch-text relative z-0" data-text={message}>
              {message}
            </p>
            <div className="w-40 h-3 bg-gray-900 border border-gray-600 rounded-sm overflow-hidden relative z-0">
              <div
                className="h-full bg-limeGreen"
                style={{ width: `${progress}%`, transition: 'none' }}
              />
            </div>
            <p className="text-[10px] text-gray-500 font-mono relative z-0">{Math.round(progress)}%</p>
          </div>
        ) : (
          <div className="relative">
            {staticBurst && <div className="absolute inset-0 static-noise z-20" />}
            {children}
          </div>
        )}
      </div>
    </motion.div>
  );
}