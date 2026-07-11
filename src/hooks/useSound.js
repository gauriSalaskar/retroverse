import { useCallback, useRef } from 'react';
import { Howl } from 'howler';

/**
 * useSound
 * Thin wrapper around Howler.js for one-shot UI sound effects
 * (startup chime, dial-up tone, notification blip, error, achievement).
 *
 * Drop real files into src/assets/sounds/ and reference them here —
 * see README.md for where to source authentic-feeling retro SFX.
 * A global mute flag is read from localStorage ("retroverse_muted")
 * so the Taskbar mute toggle affects every sound in the app.
 */
export default function useSound(src, options = {}) {
  const howlRef = useRef(null);

  const play = useCallback(() => {
    const muted = window.localStorage.getItem('retroverse_muted') === 'true';
    if (muted) return;

    if (!howlRef.current) {
      howlRef.current = new Howl({
        src: [src],
        volume: options.volume ?? 0.5,
        loop: options.loop ?? false,
        html5: true,
      });
    }
    howlRef.current.play();
  }, [src, options.volume, options.loop]);

  const stop = useCallback(() => {
    howlRef.current?.stop();
  }, []);

  return { play, stop };
}
