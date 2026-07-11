import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import useSound from '../hooks/useSound';

/**
 * BootScreen
 * The very first thing the user sees: a Windows XP style boot logo with
 * an animated loading bar. Auto-advances to onComplete() after ~3.5s,
 * matching the spec's "3–4 seconds" boot duration.
 */
export default function BootScreen({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const { play } = useSound('/src/assets/sounds/xp-startup.mp3', { volume: 0.4 });

  useEffect(() => {
    play(); // Windows XP startup chime
    const interval = setInterval(() => {
      setProgress((p) => Math.min(p + 4, 100));
    }, 120);

    const timeout = setTimeout(() => {
      onComplete();
    }, 3500);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="crt w-screen h-screen bg-black flex flex-col items-center justify-center font-tahoma">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="flex flex-col items-center"
      >
        {/* Stylized "Windows" flag logo using colored bars, avoiding trademarked art assets */}
        <div className="grid grid-cols-2 gap-1 mb-6">
          <div className="w-10 h-10 bg-red-500 rounded-tl-3xl" />
          <div className="w-10 h-10 bg-limeGreen rounded-tr-3xl" />
          <div className="w-10 h-10 bg-skyBlue rounded-bl-3xl" />
          <div className="w-10 h-10 bg-orangeHighlight rounded-br-3xl" />
        </div>
        <h1 className="text-white text-3xl tracking-wide mb-1">retroVerse XP</h1>
        <p className="text-silverChrome text-sm mb-10">Professional Nostalgia Edition</p>

        {/* Loading bar */}
        <div className="w-56 h-3 bg-gray-800 border border-gray-600 rounded overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-skyBlue to-xpBlue"
            style={{ width: `${progress}%` }}
          />
        </div>
      </motion.div>

      <p className="absolute bottom-8 text-gray-500 text-xs">
        Copyright © RetroVerse Corporation. All rights reserved (nostalgically).
      </p>
    </div>
  );
}
