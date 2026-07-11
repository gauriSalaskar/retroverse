import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const KONAMI_CODE = [
  'ArrowUp',
  'ArrowUp',
  'ArrowDown',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowLeft',
  'ArrowRight',
  'b',
  'a',
];

/**
 * EasterEggs
 * Invisible-by-default component mounted once at the app root. Listens
 * globally for the Konami Code (unlocks "Developer Mode" — a debug
 * overlay showing build info) and renders whatever secret-page overlay
 * is requested via the `secretPageOpen` prop (triggered elsewhere by
 * clicking "My Computer" 10 times).
 */
export default function EasterEggs({ onDevModeUnlock, secretPageOpen, onCloseSecretPage }) {
  const [buffer, setBuffer] = useState([]);
  const [devMode, setDevMode] = useState(false);

  useEffect(() => {
    const handleKey = (e) => {
      setBuffer((prev) => {
        const next = [...prev, e.key].slice(-KONAMI_CODE.length);
        if (next.join(',') === KONAMI_CODE.join(',')) {
          setDevMode(true);
          onDevModeUnlock?.();
        }
        return next;
      });
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onDevModeUnlock]);

  return (
    <>
      {/* Developer Mode badge, unlocked by the Konami Code */}
      <AnimatePresence>
        {devMode && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="fixed top-2 left-1/2 -translate-x-1/2 z-[9999] bg-black text-limeGreen font-mono text-xs px-3 py-1 rounded border border-limeGreen"
          >
            🥚 DEVELOPER MODE UNLOCKED — Konami Code accepted.
            <button className="ml-3 underline" onClick={() => setDevMode(false)}>
              dismiss
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hidden secret page, unlocked by clicking My Computer 10x */}
      <AnimatePresence>
        {secretPageOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9998] bg-black/90 flex items-center justify-center font-mono text-limeGreen p-4"
          >
            <div className="text-center max-w-md">
              <p className="text-2xl mb-3">🥚 SECRET PAGE FOUND 🥚</p>
              <p className="text-sm mb-4">
                You clicked "My Computer" 10 times, just like a bored kid at the cyber café waiting for a slow page
                to load. Some things about 2006 never change.
              </p>
              <button onClick={onCloseSecretPage} className="border border-limeGreen px-4 py-1 hover:bg-limeGreen/10">
                Close
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
