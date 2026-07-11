import useLocalStorage from '../hooks/useLocalStorage';

/**
 * RetroBadges
 * A cluster of classic early-2000s personal-website widgets, rendered
 * in the bottom-left corner of the desktop (above the taskbar):
 *   - an odometer-style visitor counter that increments once per visit
 *   - a scrolling <marquee>-style announcement banner
 *   - the obligatory "Best viewed in Internet Explorer, 800x600" badge
 * Purely decorative nostalgia, no gameplay logic attached.
 */
export default function RetroBadges() {
  // Starts from a semi-arbitrary "already been running a while" base so
  // it doesn't look suspiciously new, then increments once per session.
  const [visitorCount, setVisitorCount] = useLocalStorage('retroverse_visitor_count', 4382);
  const [hasCountedVisit, setHasCountedVisit] = useLocalStorage('retroverse_visit_counted_session', false);

  if (!hasCountedVisit) {
    setVisitorCount((c) => c + 1);
    setHasCountedVisit(true);
  }

  const digits = String(visitorCount).padStart(6, '0').split('');

  return (
    <div className="absolute bottom-12 left-4 flex flex-col gap-2 z-10 pointer-events-none select-none">
      {/* Scrolling marquee banner */}
      <div className="bg-black border-2 border-limeGreen w-56 overflow-hidden py-1 shadow-xpWindow">
        <div className="marquee-track animate-marquee text-limeGreen text-[11px] font-mssans whitespace-nowrap px-2">
          ★彡 WELCOME TO MY HOMEPAGE 彡★ SIGN MY GUESTBOOK ★ UNDER CONSTRUCTION ★ BEST VIEWED AT 800x600 ★
        </div>
      </div>

      {/* Odometer-style visitor counter */}
      <div className="bg-black border-2 border-gray-400 px-2 py-1 shadow-xpWindow flex items-center gap-1.5 w-fit">
        <span className="text-[9px] text-silverChrome font-mssans">VISITORS:</span>
        <div className="flex gap-0.5">
          {digits.map((d, i) => (
            <span
              key={i}
              className="bg-gray-900 text-orangeHighlight text-[11px] font-mono w-4 text-center border border-gray-600 rounded-sm"
            >
              {d}
            </span>
          ))}
        </div>
      </div>

      {/* "Best viewed in..." badge */}
      <div className="bg-xpDarkBlue border border-aquaBlue px-2 py-1 shadow-xpWindow w-fit">
        <p className="text-[9px] text-white font-mssans leading-tight">
          🖥 Best viewed in
          <br />
          <span className="font-bold">Internet Explorer 6</span>
          <br />
          at 800x600 resolution
        </p>
      </div>
    </div>
  );
}