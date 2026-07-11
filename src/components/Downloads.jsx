import { useState } from 'react';
import { DOWNLOAD_FILES } from '../utils/constants';

const FILE_MESSAGES = {
  1: 'NarutoWallpaper.zip extracted! 47 wallpapers added to My Pictures.',
  2: 'Movie.3gp is corrupted. (It was never real, sorry.)',
  3: 'Now playing: LinkinPark.mp3 🎵 (imaginary audio, but you know the vibe)',
  4: 'GTA_Cheats.txt:\nHESOYAM - Health, Armor, Money\nAEZAKMI - Never Wanted',
  5: '⚠ FunnyVideo.exe cannot be opened — Windows protected your PC (good call, this one was sketchy).',
};

/**
 * Downloads
 * A folder of nostalgically sketchy downloaded files. Double-clicking
 * one shows a corresponding funny popup rather than doing anything real.
 */
export default function Downloads() {
  const [popup, setPopup] = useState(null);

  return (
    <div className="p-3 font-tahoma text-sm relative">
      <div className="grid grid-cols-3 gap-3">
        {DOWNLOAD_FILES.map((f) => (
          <button
            key={f.id}
            onDoubleClick={() => setPopup(f.id)}
            className="flex flex-col items-center gap-1 p-2 rounded hover:bg-white/60 text-center"
          >
            <span className="text-3xl">{f.icon}</span>
            <span className="text-[10px] text-xpDarkBlue font-semibold break-all">{f.name}</span>
            <span className="text-[9px] text-gray-500">{f.size}</span>
          </button>
        ))}
      </div>
      <p className="text-[10px] text-gray-500 mt-3">Double-click a file to open it.</p>

      {popup && (
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white border-2 border-xpDarkBlue rounded shadow-xpWindow w-64">
            <div className="bg-xp-titlebar text-white text-xs font-bold px-2 py-1 flex justify-between">
              <span>System Notice</span>
              <button onClick={() => setPopup(null)}>✕</button>
            </div>
            <p className="p-3 text-xs whitespace-pre-line">{FILE_MESSAGES[popup]}</p>
            <div className="p-2 text-right">
              <button onClick={() => setPopup(null)} className="aero-button px-3 py-1 text-xs text-xpDarkBlue">
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
