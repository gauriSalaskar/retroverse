import { useState } from 'react';
import { motion } from 'framer-motion';
import { AVATARS, WALLPAPERS } from '../utils/constants';

/**
 * InternetIdentity
 * The spec explicitly calls for NO login page — instead, users craft a
 * playful "Internet Identity" (username, mood, favorite song, avatar,
 * wallpaper). Saved via onCreate(), which the parent persists to
 * localStorage.
 */
export default function InternetIdentity({ onCreate }) {
  const [username, setUsername] = useState('');
  const [mood, setMood] = useState('');
  const [song, setSong] = useState('');
  const [avatar, setAvatar] = useState(AVATARS[0]);
  const [wallpaper, setWallpaper] = useState(WALLPAPERS[0].id);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username.trim()) return;
    onCreate({ username: username.trim(), mood, song, avatar, wallpaper });
  };

  return (
    <div className="w-screen h-screen bg-gradient-to-b from-aquaBlue to-xpBlue flex items-center justify-center font-tahoma p-4">
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass-panel w-full max-w-md p-6"
      >
        <h1 className="text-xpDarkBlue text-xl font-bold text-center mb-1">
          ━━━ Create Your Internet Identity ━━━
        </h1>
        <p className="text-center text-sm text-xpDarkBlue/70 mb-5">No login. No password. Just vibes.</p>

        <label className="block text-sm font-semibold text-xpDarkBlue mb-1">Username</label>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="xX_CoolUser_Xx"
          required
          className="w-full mb-3 px-3 py-2 rounded border border-xpBlue/40 bg-white/80 focus:outline-none focus:ring-2 focus:ring-xpBlue"
        />

        <label className="block text-sm font-semibold text-xpDarkBlue mb-1">Mood</label>
        <input
          value={mood}
          onChange={(e) => setMood(e.target.value)}
          placeholder="feeling awesome today!!"
          className="w-full mb-3 px-3 py-2 rounded border border-xpBlue/40 bg-white/80 focus:outline-none focus:ring-2 focus:ring-xpBlue"
        />

        <label className="block text-sm font-semibold text-xpDarkBlue mb-1">Favorite Song</label>
        <input
          value={song}
          onChange={(e) => setSong(e.target.value)}
          placeholder="Numb - Linkin Park"
          className="w-full mb-4 px-3 py-2 rounded border border-xpBlue/40 bg-white/80 focus:outline-none focus:ring-2 focus:ring-xpBlue"
        />

        <label className="block text-sm font-semibold text-xpDarkBlue mb-2">Choose Avatar</label>
        <div className="flex gap-2 mb-4">
          {AVATARS.map((a) => (
            <button
              type="button"
              key={a}
              onClick={() => setAvatar(a)}
              className={`text-2xl w-11 h-11 rounded-full flex items-center justify-center border-2 transition ${
                avatar === a ? 'border-pinkAccent bg-white scale-110' : 'border-transparent bg-white/50'
              }`}
            >
              {a}
            </button>
          ))}
        </div>

        <label className="block text-sm font-semibold text-xpDarkBlue mb-2">Choose Wallpaper</label>
        <div className="flex gap-2 mb-6 flex-wrap">
          {WALLPAPERS.map((w) => (
            <button
              type="button"
              key={w.id}
              onClick={() => setWallpaper(w.id)}
              className={`px-3 py-2 rounded text-sm border-2 flex items-center gap-1 transition ${
                wallpaper === w.id ? 'border-pinkAccent bg-white' : 'border-transparent bg-white/50'
              }`}
            >
              <span>{w.emoji}</span> {w.label}
            </button>
          ))}
        </div>

        <button type="submit" className="aero-button w-full py-2.5 font-bold text-xpDarkBlue">
          Enter RetroVerse →
        </button>
      </motion.form>
    </div>
  );
}
