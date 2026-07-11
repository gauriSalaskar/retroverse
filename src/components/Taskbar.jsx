import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Howler } from 'howler';

const START_MENU_ITEMS = [
  { id: 'ie', label: 'Internet Explorer', icon: '🌐' },
  { id: 'orkut', label: 'Orkut', icon: '👥' },
  { id: 'messenger', label: 'Yahoo Messenger', icon: '💬' },
  { id: 'email', label: 'Inbox', icon: '📧' },
  { id: 'winamp', label: 'Winamp', icon: '🎵' },
  { id: 'photos', label: 'Photos', icon: '📸' },
  { id: 'downloads', label: 'Downloads', icon: '📁' },
  { id: 'games', label: 'Games', icon: '🎮' },
  { id: 'achievements', label: 'Achievements', icon: '🏆' },
  { id: 'chronoai', label: 'AI_2026.exe', icon: '🤖' },
];

/**
 * Taskbar
 * Bottom Windows XP taskbar: Start button + menu, running-window
 * buttons (click to restore a minimized window), a live clock, the
 * cyber café countdown timer, and a mute toggle for all sound effects.
 */
export default function Taskbar({ openWindows, onOpenApp, onRestoreWindow, cafeSecondsLeft }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [now, setNow] = useState(new Date());
  const [muted, setMuted] = useState(() => window.localStorage.getItem('retroverse_muted') === 'true');

  // Sync Howler's global mute with our persisted preference. One-shot
  // sounds (useSound) check localStorage at play-time, but the looping
  // CRT ambience needs a live mute so toggling instantly silences it.
  useEffect(() => {
    Howler.mute(muted);
  }, [muted]);

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000 * 30);
    return () => clearInterval(interval);
  }, []);

  const toggleMute = () => {
    const next = !muted;
    setMuted(next);
    window.localStorage.setItem('retroverse_muted', String(next));
  };

  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const cafeMinutes = Math.floor(cafeSecondsLeft / 60);
  const cafeSeconds = cafeSecondsLeft % 60;
  const cafeExpired = cafeSecondsLeft <= 0;

  return (
    <>
      {/* Start menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-9 left-0 w-64 bg-white border border-xpDarkBlue rounded-t-md shadow-xpWindow z-[9997] overflow-hidden"
          >
            <div className="bg-xp-titlebar text-white px-3 py-2 font-bold text-sm">RetroVerse User</div>
            <div className="py-1">
              {START_MENU_ITEMS.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    onOpenApp(item.id);
                    setMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-1.5 text-sm text-xpDarkBlue hover:bg-skyBlue/30"
                >
                  <span>{item.icon}</span>
                  {item.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Taskbar bar */}
      <div className="fixed bottom-0 left-0 right-0 h-9 bg-xp-titlebar flex items-center px-1 z-[9996] font-tahoma text-white text-xs">
        <button
          onClick={() => setMenuOpen((m) => !m)}
          className="flex items-center gap-1 bg-gradient-to-b from-green-400 to-green-700 rounded px-3 py-1 font-bold italic mr-2"
        >
          🏁 start
        </button>

        {/* Running windows */}
        <div className="flex-1 flex gap-1 overflow-x-auto">
          {openWindows.map((w) => (
            <button
              key={w.id}
              onClick={() => onRestoreWindow(w.id)}
              className="bg-white/20 hover:bg-white/30 rounded px-2 py-1 text-[11px] truncate max-w-[120px]"
            >
              {w.icon} {w.title}
            </button>
          ))}
        </div>

        {/* Cyber café timer */}
        <div
          className={`px-2 py-0.5 rounded mr-2 font-mono ${
            cafeExpired ? 'bg-red-600 animate-pulse' : 'bg-black/30'
          }`}
          title="Internet Time Remaining"
        >
          {cafeExpired ? 'Please recharge ₹20/hour' : `⏱ ${cafeMinutes}:${String(cafeSeconds).padStart(2, '0')}`}
        </div>

        {/* Mute toggle */}
        <button onClick={toggleMute} className="mr-2 px-1" title="Toggle sound">
          {muted ? '🔇' : '🔊'}
        </button>

        {/* Clock */}
        <div className="bg-black/20 px-2 py-0.5 rounded">{timeStr}</div>
      </div>
    </>
  );
}
