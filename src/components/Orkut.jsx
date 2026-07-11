import { useEffect, useMemo, useState } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import useSound from '../hooks/useSound';
import { FAKE_FRIENDS } from '../utils/constants';

const GLITTER_EMOJI = ['✨', '💖', '⭐', '💫', '🌟'];

/**
 * Orkut
 * Recreates the Orkut/MySpace social-profile experience: profile photo,
 * mood + relationship status, a "Top 8" friends list, and a scrapbook
 * where the user can post scraps (persisted to localStorage). Posting a
 * scrap fires onFirstScrap() to unlock the matching achievement.
 */
export default function Orkut({ identity, onFirstScrap }) {
  const [scraps, setScraps] = useState([
    { from: 'CoolGirl2006', text: 'heyyy add me back!! 💕', },
    { from: 'Rahul007', text: 'happy bday bro 🎂🎉' },
  ]);
  const [draft, setDraft] = useState('');
  const [visitorCount] = useLocalStorage('retroverse_orkut_visitors', () => Math.floor(Math.random() * 500) + 100);
  const [glitterOn, setGlitterOn] = useState(false);
  const [musicOn, setMusicOn] = useState(false);
  const { play: playTheme, stop: stopTheme } = useSound('/src/assets/sounds/orkut-theme.mp3', {
    volume: 0.3,
    loop: true,
  });

  const glitterPieces = useMemo(
    () =>
      Array.from({ length: 18 }, (_, i) => ({
        id: i,
        emoji: GLITTER_EMOJI[i % GLITTER_EMOJI.length],
        left: Math.random() * 100,
        delay: Math.random() * 4,
        duration: 3 + Math.random() * 3,
      })),
    []
  );

  const toggleMusic = () => {
    const next = !musicOn;
    setMusicOn(next);
    if (next) playTheme();
    else stopTheme();
  };

  useEffect(() => stopTheme, [stopTheme]);

  const postScrap = () => {
    if (!draft.trim()) return;
    setScraps((prev) => [{ from: identity?.username ?? 'You', text: draft.trim() }, ...prev]);
    setDraft('');
    onFirstScrap?.();
  };

  return (
    <div className="relative font-tahoma bg-gradient-to-b from-purple-100 to-blue-50 p-3 text-sm">
      {/* Glitter theme overlay */}
      {glitterOn && (
        <div className="orkut-glitter">
          {glitterPieces.map((p) => (
            <span
              key={p.id}
              style={{ left: `${p.left}%`, animationDelay: `${p.delay}s`, animationDuration: `${p.duration}s` }}
            >
              {p.emoji}
            </span>
          ))}
        </div>
      )}

      {/* Theme controls */}
      <div className="flex justify-end gap-2 mb-2 relative z-10">
        <button
          onClick={() => setGlitterOn((g) => !g)}
          className={`text-[11px] px-2 py-1 rounded border font-semibold ${
            glitterOn
              ? 'bg-pinkAccent text-white border-pinkAccent'
              : 'bg-white text-pinkAccent border-pinkAccent/40'
          }`}
        >
          ✨ Glitter Theme
        </button>
        <button
          onClick={toggleMusic}
          className={`text-[11px] px-2 py-1 rounded border font-semibold ${
            musicOn
              ? 'bg-purpleNeon text-white border-purpleNeon'
              : 'bg-white text-purpleNeon border-purpleNeon/40'
          }`}
        >
          {musicOn ? '🔊 Playing Profile Song' : '🎵 Play Profile Song'}
        </button>
      </div>

      <div className="flex gap-3 mb-3 bg-white border border-purpleNeon/40 rounded p-2">
        <div className="w-16 h-16 rounded bg-gradient-to-br from-purpleNeon to-pinkAccent flex items-center justify-center text-3xl">
          {identity?.avatar ?? '😎'}
        </div>
        <div>
          <p className="font-bold text-purpleNeon">{identity?.username ?? 'Guest_User'}</p>
          <p className="text-xs text-gray-600">Mood: {identity?.mood || 'feeling nostalgic'}</p>
          <p className="text-xs text-gray-600">Relationship: It's complicated</p>
          <p className="text-xs text-gray-500">👁 Profile views: {visitorCount}</p>
        </div>
      </div>

      {/* Top 8 friends */}
      <div className="mb-3">
        <p className="font-bold text-purpleNeon mb-1">⭐ Top Friends</p>
        <div className="grid grid-cols-4 gap-2">
          {FAKE_FRIENDS.map((f) => (
            <div key={f.name} className="bg-white border border-purpleNeon/30 rounded p-1 text-center">
              <div className="text-2xl">{f.avatar}</div>
              <p className="text-[10px] truncate font-semibold text-xpDarkBlue">{f.name}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Testimonials */}
      <div className="mb-3">
        <p className="font-bold text-purpleNeon mb-1">💬 Testimonials</p>
        <div className="bg-white border border-purpleNeon/30 rounded p-2 text-xs italic text-gray-700">
          "{identity?.username ?? 'This person'} is literally the coolest person I've met online! 10/10 would scrap
          again." — CoolGirl2006
        </div>
      </div>

      {/* Scrapbook */}
      <div>
        <p className="font-bold text-purpleNeon mb-1">📝 Scrapbook</p>
        <div className="flex gap-1 mb-2">
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && postScrap()}
            placeholder="Write a scrap..."
            className="flex-1 px-2 py-1 border border-purpleNeon/40 rounded text-xs"
          />
          <button onClick={postScrap} className="aero-button px-3 text-xs text-xpDarkBlue font-bold">
            Post
          </button>
        </div>
        <div className="space-y-1 max-h-40 overflow-y-auto">
          {scraps.map((s, i) => (
            <div key={i} className="bg-white border border-purpleNeon/20 rounded p-1.5">
              <span className="font-bold text-pinkAccent">{s.from}: </span>
              <span className="text-gray-700">{s.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
