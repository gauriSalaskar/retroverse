import { useState } from 'react';

/**
 * InternetExplorer
 * Classic IE6-style browser chrome (address bar + nav buttons) whose
 * "homepage" is the RetroVerse Portal: blinking/marquee text, a fake
 * visitor counter, "flash ad" banners, and an Under Construction gif
 * stand-in — all the hallmarks of a mid-2000s personal homepage.
 */
export default function InternetExplorer() {
  const [visitorCount] = useState(() => Math.floor(Math.random() * 9000) + 1000);

  return (
    <div className="font-tahoma">
      {/* Browser chrome */}
      <div className="bg-gray-200 border-b border-gray-400 px-2 py-1 flex items-center gap-1 text-xs">
        <span className="px-2 py-0.5 bg-gray-300 rounded">◀</span>
        <span className="px-2 py-0.5 bg-gray-300 rounded">▶</span>
        <span className="px-2 py-0.5 bg-gray-300 rounded">⟳</span>
        <input
          readOnly
          value="http://www.retroverse-portal.com/home.html"
          className="flex-1 px-2 py-0.5 border border-gray-400 bg-white text-gray-700"
        />
        <span className="px-2 py-0.5 bg-gray-300 rounded">Go</span>
      </div>

      {/* Page content */}
      <div className="bg-white p-3 text-sm">
        <div className="bg-gradient-to-r from-purpleNeon via-pinkAccent to-orangeHighlight text-white text-center py-2 rounded mb-2 font-bold overflow-hidden">
          <span className="blink-text">✨ Welcome to my awesome website!!! ✨</span>
        </div>

        <div className="overflow-hidden whitespace-nowrap border border-dashed border-xpBlue py-1 mb-3 bg-yellow-100">
          <span className="marquee-track text-xpDarkBlue text-xs">
            🎉 Sign my guestbook! 🎉 Best viewed in 800x600 🎉 Under construction since 1999 🎉 Click here to win a
            prize! 🎉
          </span>
        </div>

        <div className="flex gap-3 mb-3">
          <div className="flex-1 border-2 border-limeGreen rounded p-2 bg-green-50 text-center">
            <p className="text-xs text-gray-600">You are visitor number</p>
            <p className="font-mono font-bold text-lg text-green-700">{String(visitorCount).padStart(6, '0')}</p>
          </div>
          <div className="flex-1 border-2 border-orangeHighlight rounded p-2 bg-orange-50 flex items-center justify-center text-center">
            <p className="text-xs font-bold text-orange-700">
              🚧 PAGE UNDER
              <br />
              CONSTRUCTION 🚧
            </p>
          </div>
        </div>

        <div className="border border-gray-300 rounded p-2 mb-3 bg-gradient-to-b from-yellow-50 to-orange-100">
          <p className="text-xs font-bold text-red-600 mb-1">⚡ FLASH SALE! ⚡</p>
          <p className="text-xs text-gray-700">Download free screensavers and smileys now! (Not a virus, we promise)</p>
        </div>

        <p className="font-bold text-xpDarkBlue mb-1">🔗 Cool Links</p>
        <ul className="text-xs text-blue-700 underline space-y-1">
          <li>My Orkut Profile</li>
          <li>Sign my Guestbook</li>
          <li>Best Winamp Skins 2006</li>
          <li>Free Nokia Ringtones</li>
        </ul>
      </div>
    </div>
  );
}
