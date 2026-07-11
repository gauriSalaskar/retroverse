import { useEffect, useRef, useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Window from './Window';
import Taskbar from './Taskbar';
import Popups from './Popups';
import EasterEggs from './EasterEggs';
import InternetExplorer from './InternetExplorer';
import Orkut from './Orkut';
import Messenger from './Messenger';
import Winamp from './Winamp';
import Downloads from './Downloads';
import EmailInbox from './EmailInbox';
import PhotoGallery from './PhotoGallery';
import GamesFolder from './GamesFolder';
import Achievements from './Achievements';
import ChronoAI from './ChronoAI';
import useAchievements from '../hooks/useAchievements';
import useSound from '../hooks/useSound';
import { getWallpaperStyle } from '../utils/constants';

const DESKTOP_ICONS = [
  { id: 'mycomputer', label: 'My Computer', icon: '🖥' },
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

const APP_META = {
  ie: { title: 'RetroVerse Portal - Internet Explorer', icon: '🌐' },
  orkut: { title: 'Orkut', icon: '👥' },
  messenger: { title: 'Yahoo Messenger', icon: '💬' },
  email: { title: 'Inbox - Outlook Express', icon: '📧' },
  winamp: { title: 'Winamp', icon: '🎵' },
  photos: { title: 'My Photos', icon: '📸' },
  downloads: { title: 'Downloads', icon: '📁' },
  games: { title: 'Games', icon: '🎮' },
  achievements: { title: 'Achievements', icon: '🏆' },
  chronoai: { title: 'AI_2026.exe', icon: '🤖' },
};

const CAFE_START_SECONDS = 60 * 60; // 60 minutes, spec shows "59:59" ticking down

/**
 * Desktop
 * The heart of RetroVerse: the full Windows XP desktop with draggable
 * icons, a window manager (open/close/minimize/focus), the taskbar, the
 * cyber café countdown, cursor sparkle trail, and the AI_2026.exe
 * "unknown software" jump-scare that leads into ChronoAI.
 */
export default function Desktop({ identity }) {
  const [openWindows, setOpenWindows] = useState([]);
  const [zCounter, setZCounter] = useState(10);
  const [sparkles, setSparkles] = useState([]);
  const [mycomputerClicks, setMycomputerClicks] = useState(0);
  const [secretPageOpen, setSecretPageOpen] = useState(false);
  const [aiConfirmOpen, setAiConfirmOpen] = useState(false);
  const [glitching, setGlitching] = useState(false);
  const [cafeSecondsLeft, setCafeSecondsLeft] = useState(CAFE_START_SECONDS);
  const [latestAchievement, setLatestAchievement] = useState(null);
  const [screenShake, setScreenShake] = useState(false);
  const sparkleId = useRef(0);

  const { unlocked, unlock, allAchievements } = useAchievements();
  const { play: playAmbience, stop: stopAmbience } = useSound('/src/assets/sounds/crt-hum.mp3', {
    volume: 0.15,
    loop: true,
  });

  // CRT humming ambience: starts as soon as the desktop loads, loops for
  // the whole session, respects the taskbar mute toggle (see useSound).
  useEffect(() => {
    playAmbience();
    return () => stopAmbience();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Messenger's Buzz button shakes the ENTIRE screen (per spec) - it
  // dispatches this event since it has no direct reference to the
  // desktop root.
  useEffect(() => {
    const handleBuzz = () => {
      setScreenShake(true);
      setTimeout(() => setScreenShake(false), 500);
    };
    window.addEventListener('retroverse:buzz', handleBuzz);
    return () => window.removeEventListener('retroverse:buzz', handleBuzz);
  }, []);

  // Unlock "Connected To Internet" the moment the desktop mounts (dial-up
  // already happened before we got here).
  useEffect(() => {
    const a = unlock('connected');
    if (a) setLatestAchievement(a);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Cyber café countdown
  useEffect(() => {
    const interval = setInterval(() => {
      setCafeSecondsLeft((s) => Math.max(0, s - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Cursor sparkle trail
  useEffect(() => {
    const handleMove = (e) => {
      if (Math.random() > 0.7) return; // throttle density
      const id = sparkleId.current++;
      setSparkles((prev) => [...prev.slice(-15), { id, x: e.clientX, y: e.clientY, char: Math.random() > 0.5 ? '✨' : '⭐' }]);
      setTimeout(() => {
        setSparkles((prev) => prev.filter((s) => s.id !== id));
      }, 600);
    };
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  const fireAchievement = useCallback(
    (id) => {
      const a = unlock(id);
      if (a) setLatestAchievement(a);
    },
    [unlock]
  );

  const openApp = useCallback((id) => {
    setOpenWindows((prev) => {
      const existing = prev.find((w) => w.id === id);
      if (existing) {
        return prev.map((w) => (w.id === id ? { ...w, minimized: false } : w));
      }
      const meta = APP_META[id];
      return [...prev, { id, ...meta, minimized: false }];
    });
    setZCounter((z) => z + 1);
  }, []);

  const closeApp = (id) => setOpenWindows((prev) => prev.filter((w) => w.id !== id));
  const minimizeApp = (id) =>
    setOpenWindows((prev) => prev.map((w) => (w.id === id ? { ...w, minimized: true } : w)));
  const focusApp = () => setZCounter((z) => z + 1);

  const handleIconClick = (id) => {
    if (id === 'mycomputer') {
      const next = mycomputerClicks + 1;
      setMycomputerClicks(next);
      if (next >= 10) {
        setSecretPageOpen(true);
        fireAchievement('mycomputer');
        setMycomputerClicks(0);
      }
      return;
    }
    if (id === 'chronoai') {
      setAiConfirmOpen(true);
      return;
    }
    openApp(id);
  };

  const confirmOpenAI = (open) => {
    setAiConfirmOpen(false);
    if (!open) return;
    setGlitching(true);
    setTimeout(() => {
      setGlitching(false);
      openApp('chronoai');
    }, 900);
  };

  const wallpaperStyle = getWallpaperStyle(identity?.wallpaper);

  return (
    <motion.div
      animate={screenShake ? { x: [0, -14, 14, -14, 14, -8, 8, 0] } : { x: 0 }}
      transition={{ duration: 0.5 }}
      className="crt w-screen h-screen relative overflow-hidden font-tahoma cursor-default"
      style={wallpaperStyle}
    >
      {/* Cursor sparkle trail */}
      {sparkles.map((s) => (
        <span key={s.id} className="sparkle" style={{ left: s.x, top: s.y }}>
          {s.char}
        </span>
      ))}

      {/* Desktop icons */}
      <div className="grid grid-cols-1 gap-4 p-4 w-24 absolute top-0 left-0">
        {DESKTOP_ICONS.map((icon) => (
          <button
            key={icon.id}
            onDoubleClick={() => handleIconClick(icon.id)}
            className="flex flex-col items-center gap-1 group"
          >
            <span className="text-3xl drop-shadow-lg group-active:scale-95 transition">{icon.icon}</span>
            <span className="text-white text-[11px] xp-icon-label text-center leading-tight">{icon.label}</span>
          </button>
        ))}
      </div>

      {/* Welcome banner */}
      {identity && (
        <div className="absolute top-3 right-3 glass-panel px-3 py-1.5 text-xs text-xpDarkBlue font-semibold">
          {identity.avatar} Welcome back, {identity.username}!
        </div>
      )}

      {/* Open windows */}
      <AnimatePresence>
        {openWindows.map((w, i) => (
          <Window
            key={w.id}
            title={w.title}
            icon={w.icon}
            minimized={w.minimized}
            zIndex={10 + i}
            initialPosition={{ x: 140 + i * 24, y: 60 + i * 24 }}
            width={w.id === 'messenger' ? 420 : w.id === 'chronoai' ? 520 : 480}
            onClose={() => closeApp(w.id)}
            onMinimize={() => minimizeApp(w.id)}
            onFocus={focusApp}
          >
            {w.id === 'ie' && <InternetExplorer />}
            {w.id === 'orkut' && <Orkut identity={identity} onFirstScrap={() => fireAchievement('scrap')} />}
            {w.id === 'messenger' && <Messenger />}
            {w.id === 'email' && <EmailInbox onRead={() => fireAchievement('spam')} />}
            {w.id === 'winamp' && <Winamp />}
            {w.id === 'photos' && <PhotoGallery />}
            {w.id === 'downloads' && <Downloads />}
            {w.id === 'games' && <GamesFolder onSnakeScore={() => fireAchievement('snake')} />}
            {w.id === 'achievements' && <Achievements allAchievements={allAchievements} unlocked={unlocked} />}
            {w.id === 'chronoai' && (
              <ChronoAI onOpenAchievement={() => fireAchievement('chronoai')} onEnding={() => closeApp('chronoai')} />
            )}
          </Window>
        ))}
      </AnimatePresence>

      {/* "Unknown software" confirmation before launching AI_2026.exe */}
      <AnimatePresence>
        {aiConfirmOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9997]"
          >
            <div className="bg-white border-2 border-red-600 rounded shadow-xpWindow w-72">
              <div className="bg-red-600 text-white text-xs font-bold px-2 py-1">⚠ Security Warning</div>
              <div className="p-3 text-sm text-xpDarkBlue">
                <p className="font-bold mb-1">UNKNOWN SOFTWARE DETECTED</p>
                <p className="text-xs text-gray-600">AI_2026.exe was not signed by a trusted publisher.</p>
              </div>
              <div className="p-2 flex justify-end gap-2">
                <button onClick={() => confirmOpenAI(false)} className="aero-button px-3 py-1 text-xs text-xpDarkBlue">
                  NO
                </button>
                <button onClick={() => confirmOpenAI(true)} className="bg-red-600 text-white px-3 py-1 rounded text-xs font-bold">
                  YES
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Glitch transition overlay */}
      <AnimatePresence>
        {glitching && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0.3, 1, 0] }}
            transition={{ duration: 0.9 }}
            className="fixed inset-0 bg-chronoBlack z-[9998] mix-blend-difference"
          />
        )}
      </AnimatePresence>

      <Popups latestAchievement={latestAchievement} />

      <EasterEggs
        onDevModeUnlock={() => fireAchievement('devmode')}
        secretPageOpen={secretPageOpen}
        onCloseSecretPage={() => setSecretPageOpen(false)}
      />

      <Taskbar
        openWindows={openWindows}
        onOpenApp={handleIconClick}
        onRestoreWindow={(id) => openApp(id)}
        cafeSecondsLeft={cafeSecondsLeft}
      />
    </motion.div>
  );
}
