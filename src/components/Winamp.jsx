import { useState } from 'react';
import { motion } from 'framer-motion';
import { WINAMP_PLAYLIST } from '../utils/constants';

/**
 * Winamp
 * Classic Winamp-skinned player: playlist, play/pause toggle, a fake
 * progress bar, and a bouncing-bars equalizer animation. No real audio
 * is bundled (copyright); this simulates playback state/UI only.
 */
export default function Winamp() {
  const [trackIndex, setTrackIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const track = WINAMP_PLAYLIST[trackIndex];

  return (
    <div className="font-mssans bg-gradient-to-b from-gray-700 to-gray-900 text-limeGreen p-3">
      {/* LCD-style display */}
      <div className="bg-black border border-limeGreen/50 rounded p-2 mb-2">
        <p className="text-xs font-mono truncate">
          {track.title} — {track.artist}
        </p>
        <p className="text-[10px] text-limeGreen/70 font-mono">{track.duration}</p>

        {/* Equalizer bars */}
        <div className="flex items-end gap-0.5 h-6 mt-1">
          {Array.from({ length: 16 }).map((_, i) => (
            <motion.div
              key={i}
              className="w-1 bg-limeGreen"
              animate={playing ? { height: [4, Math.random() * 20 + 4, 4] } : { height: 4 }}
              transition={{ repeat: playing ? Infinity : 0, duration: 0.4 + Math.random() * 0.3 }}
            />
          ))}
        </div>
      </div>

      {/* Transport controls */}
      <div className="flex justify-center gap-2 mb-2">
        <button
          onClick={() => setTrackIndex((i) => (i - 1 + WINAMP_PLAYLIST.length) % WINAMP_PLAYLIST.length)}
          className="bg-gray-600 text-white w-8 h-8 rounded text-xs"
        >
          ⏮
        </button>
        <button onClick={() => setPlaying((p) => !p)} className="bg-limeGreen text-black w-8 h-8 rounded text-xs font-bold">
          {playing ? '⏸' : '▶'}
        </button>
        <button
          onClick={() => setTrackIndex((i) => (i + 1) % WINAMP_PLAYLIST.length)}
          className="bg-gray-600 text-white w-8 h-8 rounded text-xs"
        >
          ⏭
        </button>
      </div>

      {/* Playlist */}
      <div className="bg-black/60 rounded max-h-28 overflow-y-auto">
        {WINAMP_PLAYLIST.map((t, i) => (
          <button
            key={t.id}
            onClick={() => setTrackIndex(i)}
            className={`w-full text-left px-2 py-1 text-[11px] font-mono ${
              i === trackIndex ? 'bg-limeGreen/20 text-limeGreen' : 'text-gray-300 hover:bg-white/5'
            }`}
          >
            {i + 1}. {t.title} - {t.artist} ({t.duration})
          </button>
        ))}
      </div>
    </div>
  );
}
