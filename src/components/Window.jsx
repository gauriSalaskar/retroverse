import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import useSound from '../hooks/useSound';

const LOADING_MESSAGES = [
  'Connecting to server...',
  'Buffering...',
  'Establishing connection...',
  'Downloading data...',
  'Please wait...',
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
 * body content fakes a brief old-internet "buffering" delay before
 * rendering — a nod to how slow everything felt on 2006-era
 * connections/hardware.
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
  const [loadingMessage] = useState(
    LOADING_MESSAGES[Math.floor(Math.random() * LOADING_MESSAGES.length)]
  );

  // Play the folder/window-open blip once when this window first mounts.
  // Window stays mounted (just hidden) while minimized - see Desktop.jsx,
  // which keeps closed windows out of state entirely and only flips
  // `minimized` for the minimize button - so this still only fires once
  // per actual open, not on every minimize/restore.
  useEffect(() => {
    playOpen();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fake old-internet buffering delay before content appears. Randomized
  // so it doesn't feel mechanical across different app opens.
  useEffect(() => {
    const delay = 500 + Math.random() * 900; // 500-1400ms
    const timer = setTimeout(() => setLoading(false), delay);
    return () => clearTimeout(timer);
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
      <div className="bg-silverChrome max-h-[70vh] overflow-y-auto">
        {loading ? (
          <div className="flex flex-col items-center justify-center gap-3 py-12 px-4">
            <span className="text-3xl animate-pulse">{icon}</span>
            <p className="text-xs text-xpDarkBlue font-mssans">{loadingMessage}</p>
            <div className="w-40 h-3 bg-white border border-gray-400 rounded-sm overflow-hidden">
              <div className="h-full bg-xpBlue animate-[loadingBar_1.2s_ease-in-out_infinite]" />
            </div>
          </div>
        ) : (
          children
        )}
      </div>
    </motion.div>
  );
}