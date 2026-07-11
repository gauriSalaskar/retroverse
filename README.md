# 🌐 RetroVerse — Relive the Internet of 2006

A fully interactive nostalgia site recreating the early-2000s internet:
Windows XP boot, dial-up, a custom "Internet Identity" (no login), a full
draggable-window XP desktop, Orkut, Yahoo Messenger, Winamp, spam email,
playable games, achievements, random popups, and a secret AI-from-2026
storyline (ChronoAI).

## Tech stack

- React 18 + Vite
- Tailwind CSS (Windows XP / Y2K / Frutiger Aero color system)
- Framer Motion (window drag/animations, transitions)
- Howler.js (sound effects)
- react95 + styled-components (authentic Win95/98/XP widget chrome — theme is wired up in `main.jsx`, ready to use for any additional widgets)
- LocalStorage (identity, achievements, high scores — no backend)
- Grok API (xAI) for the ChronoAI chat feature

## Getting started

```bash
npm install
cp .env.example .env      # then add your Grok API key
npm run dev
```

Open the printed local URL (default `http://localhost:5173`).

### Grok API key

ChronoAI (`AI_2026.exe` on the desktop) calls the Grok API directly from
the browser (see `src/utils/grokApi.js`). Get a key at
https://x.ai/api and put it in `.env` as `VITE_GROK_API_KEY`. Without a
key, ChronoAI still opens but responds with a "signal too weak" fallback
message instead of a live reply.

**Security note:** because there's no backend, the API key ships in the
client bundle. That's fine for a personal project or demo, but for a
public production deployment, proxy the Grok call through a serverless
function (e.g. a Vercel Edge Function) so the key isn't exposed.

## Deploying to Vercel

```bash
npm run build
```

Push this repo to GitHub and import it in Vercel (framework preset:
Vite — `vercel.json` is already included). Add `VITE_GROK_API_KEY` as an
environment variable in the Vercel project settings.

## Project structure

```
src/
  components/
    BootScreen.jsx        Windows XP boot sequence
    DialUpScreen.jsx       Dial-up connection sequence
    InternetIdentity.jsx   "No login" identity creation form
    Desktop.jsx             Main desktop: icons, window manager, cyber café timer
    Taskbar.jsx             Start menu, running windows, clock, mute
    Window.jsx               Reusable draggable XP window chrome
    InternetExplorer.jsx    Browser + RetroVerse Portal homepage
    Orkut.jsx                Social profile, Top 8, scrapbook
    Messenger.jsx            Yahoo/MSN-style chat + Buzz
    Winamp.jsx                Music player UI + equalizer
    Downloads.jsx             Funny downloaded files
    EmailInbox.jsx             Outlook Express-style spam inbox
    PhotoGallery.jsx           Digicam-style photo grid + slideshow
    GamesFolder.jsx             Game picker (wraps Games/*)
    Games/
      Snake.jsx, Minesweeper.jsx, TicTacToe.jsx
    Achievements.jsx           Badge collection screen
    Popups.jsx                  Random nostalgic ad popups + achievement toasts
    ChronoAI.jsx                 The AI-from-2026 cyberpunk chat section
    EasterEggs.jsx                Konami code + secret page
  hooks/
    useLocalStorage.js, useSound.js, useAchievements.js
  utils/
    constants.js (all fake content), grokApi.js (Grok integration)
  App.jsx     Orchestrates Boot -> Dial-up -> Identity -> Desktop
  main.jsx    React root + react95 ThemeProvider
```

## Known placeholders (by design, not bugs)

- **Sounds**: `useSound()` calls reference files in
  `src/assets/sounds/` that aren't bundled (copyright) — see the README
  in that folder for how to add your own.
- **Wallpapers**: CSS gradients stand in for real Windows XP "Bliss"-style
  photography — see `src/assets/wallpapers/README.md`.
- **Winamp playback**: the player UI and equalizer are fully functional,
  but no real audio plays (song titles are just names, not real audio
  files, again for copyright reasons).
- **Persistence**: identity, achievements, and Snake high score persist
  via `localStorage` — this really works in a real browser (unlike a
  Claude.ai artifact sandbox), so returning users skip identity creation.

## Easter eggs

- **Konami Code** (↑ ↑ ↓ ↓ ← → ← → b a): unlocks "Developer Mode" banner
- **Click "My Computer" 10 times**: unlocks a hidden secret page
- **AI_2026.exe**: triggers a fake "unknown software" warning, then
  glitches into the ChronoAI cyberpunk section
