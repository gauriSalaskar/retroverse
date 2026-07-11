import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useSound from '../hooks/useSound';

const STAGES = ['Dialing...', 'Authenticating...', 'Connecting...', 'Connected at 56 kbps.'];

/**
 * DialUpScreen
 * Recreates the iconic dial-up modem connection sequence: staged status
 * text, an animated progress bar, and the modem sound. Advances through
 * STAGES automatically, then calls onComplete().
 */
export default function DialUpScreen({ onComplete }) {
  const [stageIndex, setStageIndex] = useState(0);
  const { play } = useSound('/src/assets/sounds/dialup.mp3', { volume: 0.5 });

  useEffect(() => {
    play(); // the legendary modem handshake screech
  }, [play]);

  useEffect(() => {
    if (stageIndex >= STAGES.length - 1) {
      const timeout = setTimeout(onComplete, 1200);
      return () => clearTimeout(timeout);
    }
    const timeout = setTimeout(() => setStageIndex((i) => i + 1), 1100);
    return () => clearTimeout(timeout);
  }, [stageIndex, onComplete]);

  return (
    <div className="w-screen h-screen bg-xpDarkBlue flex items-center justify-center font-tahoma">
      <div className="glass-panel w-96 p-8 flex flex-col items-center text-center">
        <motion.div
          animate={{ rotate: [0, -8, 8, -8, 0] }}
          transition={{ repeat: Infinity, duration: 1.4 }}
          className="text-5xl mb-4"
        >
          🌐
        </motion.div>

        <h2 className="text-xpDarkBlue font-bold text-lg mb-4">RetroVerse Dial-Up Networking</h2>

        <AnimatePresence mode="wait">
          <motion.p
            key={stageIndex}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="text-xpBlue font-semibold mb-4"
          >
            {STAGES[stageIndex]}
          </motion.p>
        </AnimatePresence>

        <div className="w-full h-3 bg-white/50 border border-xpBlue/40 rounded overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-aquaBlue to-xpBlue"
            initial={{ width: '0%' }}
            animate={{ width: `${((stageIndex + 1) / STAGES.length) * 100}%` }}
            transition={{ duration: 0.6 }}
          />
        </div>

        {stageIndex === STAGES.length - 1 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-4 bg-white border border-limeGreen rounded px-3 py-2 text-sm text-green-700 font-semibold shadow"
          >
            ✅ Connection successful!
          </motion.div>
        )}
      </div>
    </div>
  );
}
