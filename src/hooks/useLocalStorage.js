import { useState, useEffect } from 'react';

/**
 * useLocalStorage
 * Drop-in replacement for useState that persists the value to
 * localStorage under `key`. This is how RetroVerse remembers your
 * Internet Identity, achievements, and game high scores between visits
 * — exactly like the spec's "no backend, no login" requirement.
 */
export default function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = window.localStorage.getItem(key);
      return stored !== null ? JSON.parse(stored) : initialValue;
    } catch (err) {
      console.warn(`useLocalStorage: failed to read "${key}"`, err);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
      console.warn(`useLocalStorage: failed to write "${key}"`, err);
    }
  }, [key, value]);

  return [value, setValue];
}
