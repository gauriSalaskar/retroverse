import { useState, useEffect } from 'react';
import { PHOTOS } from '../utils/constants';

/**
 * PhotoGallery
 * Low-res "digital camera" photo grid with date stamps, and an optional
 * auto-advancing slideshow mode — standard early-2000s digicam software
 * behavior (think Picasa/HP Photosmart).
 */
export default function PhotoGallery() {
  const [selected, setSelected] = useState(0);
  const [slideshow, setSlideshow] = useState(false);

  useEffect(() => {
    if (!slideshow) return;
    const interval = setInterval(() => {
      setSelected((i) => (i + 1) % PHOTOS.length);
    }, 1800);
    return () => clearInterval(interval);
  }, [slideshow]);

  const photo = PHOTOS[selected];

  return (
    <div className="font-tahoma p-3 text-sm">
      {/* Preview */}
      <div className="bg-black rounded p-4 flex flex-col items-center mb-3 relative">
        <div className="text-6xl mb-2">{photo.emoji}</div>
        <p className="text-white text-xs">{photo.caption}</p>
        <p className="absolute bottom-1 right-2 text-limeGreen font-mono text-[10px]">{photo.date}</p>
      </div>

      <div className="flex justify-center gap-2 mb-3">
        <button
          onClick={() => setSelected((i) => (i - 1 + PHOTOS.length) % PHOTOS.length)}
          className="aero-button px-3 py-1 text-xs text-xpDarkBlue"
        >
          ◀ Prev
        </button>
        <button onClick={() => setSlideshow((s) => !s)} className="aero-button px-3 py-1 text-xs text-xpDarkBlue">
          {slideshow ? '⏸ Stop Slideshow' : '▶ Slideshow'}
        </button>
        <button
          onClick={() => setSelected((i) => (i + 1) % PHOTOS.length)}
          className="aero-button px-3 py-1 text-xs text-xpDarkBlue"
        >
          Next ▶
        </button>
      </div>

      {/* Thumbnails */}
      <div className="grid grid-cols-6 gap-1">
        {PHOTOS.map((p, i) => (
          <button
            key={p.id}
            onClick={() => setSelected(i)}
            className={`aspect-square flex items-center justify-center rounded text-lg border-2 ${
              i === selected ? 'border-pinkAccent bg-white' : 'border-transparent bg-white/60'
            }`}
          >
            {p.emoji}
          </button>
        ))}
      </div>
    </div>
  );
}
