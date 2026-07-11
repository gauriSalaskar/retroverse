# Sound assets

This project references these files via `useSound()` but does not ship
the actual audio (copyrighted/trademarked sounds can't be redistributed
here). Every one of the spec's sound cues is wired up in code — drop in
matching files and they'll all work immediately, no code changes needed:

- `xp-startup.mp3` — Windows XP startup chime (BootScreen)
- `dialup.mp3` — 56k modem handshake sound (DialUpScreen)
- `folder-open.mp3` — short blip played whenever any app window opens (Window)
- `buzz.mp3` — Yahoo Messenger "Buzz" sound (Messenger)
- `notify.mp3` — Messenger notification blip (Messenger)
- `error.mp3` — plays when a random nostalgic popup (e.g. "Install Flash?") spawns (Popups)
- `achievement.mp3` — plays when an achievement toast appears (Popups)
- `crt-hum.mp3` — quiet looping CRT ambience, starts as soon as the desktop loads and
  respects the taskbar mute toggle live, since it loops continuously (Desktop)
- `orkut-theme.mp3` — looping "profile song" toggled on/off from the Orkut window,
  in the old MySpace/Orkut tradition of autoplay-ish profile music (Orkut)

To make sounds work:
1. Source royalty-free equivalents (e.g. freesound.org, zapsplat.com) or
   record/synthesize your own retro-style tones.
2. Drop them into this folder with the exact filenames above.
3. If you rename or restructure, update the `src` paths passed to
   `useSound()` in the relevant components (see the list above).

Until real files are added, `useSound()` will silently fail to play
(Howler handles missing/failed loads asynchronously without crashing
the app) — everything else keeps working normally.
