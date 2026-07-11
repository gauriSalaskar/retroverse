/**
 * Achievements
 * Displays every achievement in ACHIEVEMENTS_LIST, greyed out until the
 * matching id appears in `unlocked` (from useAchievements()).
 */
export default function Achievements({ allAchievements, unlocked }) {
  return (
    <div className="p-3 font-tahoma text-sm">
      <p className="text-xs text-gray-600 mb-2">
        {unlocked.length} / {allAchievements.length} unlocked
      </p>
      <div className="grid grid-cols-2 gap-2">
        {allAchievements.map((a) => {
          const isUnlocked = unlocked.includes(a.id);
          return (
            <div
              key={a.id}
              className={`flex items-center gap-2 p-2 rounded border ${
                isUnlocked ? 'bg-yellow-50 border-orangeHighlight' : 'bg-gray-100 border-gray-300 opacity-50'
              }`}
            >
              <span className="text-xl">{isUnlocked ? a.icon : '🔒'}</span>
              <span className="text-xs font-semibold text-xpDarkBlue">{a.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
