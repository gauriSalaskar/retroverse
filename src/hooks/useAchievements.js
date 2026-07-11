import { useCallback } from 'react';
import useLocalStorage from './useLocalStorage';
import { ACHIEVEMENTS_LIST } from '../utils/constants';

/**
 * useAchievements
 * Tracks which achievement IDs have been unlocked (persisted to
 * localStorage) and exposes an `unlock(id)` function any component
 * can call. Returns the freshly-unlocked achievement (or null) so the
 * caller can trigger a toast/popup, plus the full unlocked list for
 * the Achievements window.
 */
export default function useAchievements() {
  const [unlocked, setUnlocked] = useLocalStorage('retroverse_achievements', []);

  const unlock = useCallback(
    (id) => {
      if (unlocked.includes(id)) return null;
      const achievement = ACHIEVEMENTS_LIST.find((a) => a.id === id);
      if (!achievement) return null;
      setUnlocked((prev) => [...prev, id]);
      return achievement;
    },
    [unlocked, setUnlocked]
  );

  return { unlocked, unlock, allAchievements: ACHIEVEMENTS_LIST };
}
