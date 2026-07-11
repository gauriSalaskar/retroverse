import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { POPUP_MESSAGES } from '../utils/constants';
import useSound from '../hooks/useSound';

/**
 * Popups
 * Two responsibilities, both rendered as floating overlays:
 *  1. Random nostalgic ad/warning popups that appear periodically
 *     (spec: "Install Flash?", "Computer may be infected", etc.)
 *  2. Achievement unlock toasts — pass the latest unlocked achievement
 *     via `latestAchievement` (e.g. from useAchievements().unlock())
 *     and it will render briefly then auto-dismiss.
 */
export default function Popups({ latestAchievement }) {
  const [activePopup, setActivePopup] = useState(null);
  const [toast, setToast] = useState(null);
  const { play: playError } = useSound('/src/assets/sounds/error.mp3', { volume: 0.35 });
  const { play: playAchievement } = useSound('/src/assets/sounds/achievement.mp3', { volume: 0.45 });

  // Randomly spawn a nostalgic popup every 25-45s
  useEffect(() => {
    const spawn = () => {
      const msg = POPUP_MESSAGES[Math.floor(Math.random() * POPUP_MESSAGES.length)];
      setActivePopup(msg);
      playError();
    };
    const schedule = () => {
      const delay = 25000 + Math.random() * 20000;
      return setTimeout(() => {
        spawn();
        timeoutRef = schedule();
      }, delay);
    };
    let timeoutRef = schedule();
    return () => clearTimeout(timeoutRef);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Show achievement toast when a new one unlocks
  useEffect(() => {
    if (!latestAchievement) return;
    setToast(latestAchievement);
    playAchievement();
    const timeout = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [latestAchievement]);

  return (
    <>
      {/* Nostalgic random popup */}
      <AnimatePresence>
        {activePopup && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed top-1/3 left-1/2 -translate-x-1/2 z-[9990] w-72"
          >
            <div className="bg-white border-2 border-xpDarkBlue rounded shadow-xpWindow">
              <div className="bg-xp-titlebar text-white text-xs font-bold px-2 py-1 flex justify-between">
                <span>Internet Explorer</span>
                <button onClick={() => setActivePopup(null)}>✕</button>
              </div>
              <div className="p-3 flex items-center gap-2 text-sm">
                <span className="text-2xl">{activePopup.icon}</span>
                <p className="text-xpDarkBlue">{activePopup.text}</p>
              </div>
              <div className="p-2 flex justify-end gap-2">
                <button
                  onClick={() => setActivePopup(null)}
                  className="aero-button px-3 py-1 text-xs text-xpDarkBlue"
                >
                  No Thanks
                </button>
                <button onClick={() => setActivePopup(null)} className="bg-limeGreen px-3 py-1 rounded text-xs font-bold">
                  OK
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Achievement toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className="fixed bottom-16 right-4 z-[9995] bg-gradient-to-r from-orangeHighlight to-pinkAccent text-white px-4 py-2 rounded shadow-lg flex items-center gap-2"
          >
            <span className="text-2xl">{toast.icon}</span>
            <div>
              <p className="text-xs font-bold">Achievement Unlocked!</p>
              <p className="text-xs">{toast.label}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
