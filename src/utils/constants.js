// ============================================================
// Shared constants for RetroVerse
// Centralized here so components stay easy to read and the
// nostalgic "content" (fake friends, songs, spam emails...) is
// easy to tweak in one place.
// ============================================================

export const AVATARS = ['😎', '🎸', '🎮', '🌸', '🚗'];

export const WALLPAPERS = [
  { id: 'bliss', label: 'Bliss', emoji: '🌳' },
  { id: 'aqua', label: 'Aqua', emoji: '🌊' },
  { id: 'space', label: 'Space', emoji: '🌌' },
  { id: 'cars', label: 'Cars', emoji: '🏎' },
  { id: 'anime', label: 'Anime', emoji: '🎌' },
];

// CSS gradients standing in for real wallpaper art (keeps the project
// dependency-free — swap these for real images in src/assets/wallpapers).
export const WALLPAPER_BACKGROUNDS = {
  bliss: 'linear-gradient(180deg, #56b6f5 0%, #8fd48a 55%, #3f9142 100%)',
  aqua: 'linear-gradient(180deg, #bdeaff 0%, #4fb3e8 60%, #0a6fa8 100%)',
  space: 'linear-gradient(180deg, #0a0a2a 0%, #2d1b57 60%, #7b3ff2 100%)',
  cars: 'linear-gradient(180deg, #ff9a56 0%, #ff5f6d 60%, #7b1f2e 100%)',
  anime: 'linear-gradient(180deg, #ffd1e8 0%, #ff9ecb 55%, #d6409f 100%)',
};

// ------------------------------------------------------------
// Graceful wallpaper upgrade: gradient -> real image.
// ------------------------------------------------------------
// Drop a real photo into src/assets/wallpapers/ named after a
// wallpaper id (e.g. `bliss.jpg`, `aqua.png`, `space.webp`) and it
// will automatically be picked up and used instead of the gradient,
// with the gradient kept as an instant-paint fallback / background
// behind any transparency. No code changes needed beyond adding the
// file — this glob is evaluated at build time by Vite.
const wallpaperImageModules = import.meta.glob(
  '../assets/wallpapers/*.{jpg,jpeg,png,webp}',
  { eager: true, import: 'default' }
);

const WALLPAPER_IMAGES = {};
for (const path in wallpaperImageModules) {
  const match = path.match(/([^/]+)\.(jpg|jpeg|png|webp)$/i);
  if (match) {
    WALLPAPER_IMAGES[match[1]] = wallpaperImageModules[path];
  }
}

/**
 * Returns a CSS style object for the given wallpaper id: a real photo
 * if one has been dropped into src/assets/wallpapers/, otherwise the
 * CSS gradient stand-in. Falls back to 'bliss' for unknown ids.
 * @param {string} id
 * @returns {{ background?: string, backgroundImage?: string, backgroundSize?: string, backgroundPosition?: string }}
 */
export function getWallpaperStyle(id) {
  const gradient = WALLPAPER_BACKGROUNDS[id] ?? WALLPAPER_BACKGROUNDS.bliss;
  const image = WALLPAPER_IMAGES[id];

  if (image) {
    return {
      backgroundImage: `url(${image}), ${gradient}`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    };
  }

  return { background: gradient };
}

export const FAKE_FRIENDS = [
  { name: 'CoolGirl2006', mood: 'feeling cute 💕', avatar: '🌸' },
  { name: 'Rahul007', mood: 'bunking class rn', avatar: '😎' },
  { name: 'AnimeKing', mood: 'watching Naruto ep 143', avatar: '🎌' },
  { name: 'Rockstar123', mood: 'guitar practice!!', avatar: '🎸' },
];

export const YM_STATUSES = ['Busy', 'At Cyber Café', 'Studying', 'Listening To Music'];

export const SPAM_EMAILS = [
  {
    id: 1,
    from: 'lottery-dept@winbig.biz',
    subject: 'CONGRATULATIONS! You won ₹10 lakh!!!',
    preview: 'Dear Lucky Winner, your email was randomly selected...',
    body: 'Dear Lucky Winner,\n\nYour email address has been selected in our international lottery draw. You have won ₹10,00,000!\n\nTo claim your prize, reply with your bank details and a processing fee of ₹500.\n\nAct fast, offer expires in 24 hours!\n\n- The Winning Committee',
  },
  {
    id: 2,
    from: 'nokia-offers@freegifts.net',
    subject: 'Free Nokia ringtone inside! 📱',
    preview: 'Download the hottest ringtones for FREE...',
    body: 'Hey!\n\nGet the latest Nokia ringtones absolutely FREE! Just forward this email to 10 friends and click the link below.\n\n[DOWNLOAD NOW]\n\nLimited time offer!',
  },
  {
    id: 3,
    from: 'chainmail@forward.com',
    subject: 'FWD: FWD: FWD: Forward this to 10 friends!',
    preview: 'If you don\'t forward this you will have bad luck...',
    body: 'This message has been sent around the world 7 times.\n\nForward this to 10 friends in the next 10 minutes or you will have bad luck for 7 years!\n\nA girl ignored this and her computer crashed the next day. Don\'t risk it!',
  },
  {
    id: 4,
    from: 'visitor-notice@webcounter.com',
    subject: 'You are our lucky 1,000,000th visitor!',
    preview: 'Congratulations, you are our lucky visitor...',
    body: 'CONGRATULATIONS!\n\nYou are our lucky visitor today! Click here to claim your free prize:\n\n[CLAIM PRIZE NOW]\n\n*Terms and conditions apply',
  },
];

export const DOWNLOAD_FILES = [
  { id: 1, name: 'NarutoWallpaper.zip', size: '2.3 MB', icon: '🗜️' },
  { id: 2, name: 'Movie.3gp', size: '18.7 MB', icon: '🎬' },
  { id: 3, name: 'LinkinPark.mp3', size: '4.1 MB', icon: '🎵' },
  { id: 4, name: 'GTA_Cheats.txt', size: '2 KB', icon: '📄' },
  { id: 5, name: 'FunnyVideo.exe', size: '1.2 MB', icon: '⚠️' },
];

export const WINAMP_PLAYLIST = [
  { id: 1, title: 'Numb', artist: 'Linkin Park', duration: '3:07' },
  { id: 2, title: "It's My Life", artist: 'Bon Jovi', duration: '3:45' },
  { id: 3, title: 'Boulevard of Broken Dreams', artist: 'Green Day', duration: '4:20' },
];

export const PHOTOS = [
  { id: 1, date: '12/06/2006', caption: 'Cyber cafe with friends', emoji: '🖥️' },
  { id: 2, date: '03/08/2006', caption: 'Birthday party', emoji: '🎂' },
  { id: 3, date: '21/09/2006', caption: 'School trip', emoji: '🚌' },
  { id: 4, date: '14/02/2006', caption: 'New phone!', emoji: '📱' },
  { id: 5, date: '05/11/2006', caption: 'Diwali lights', emoji: '🪔' },
  { id: 6, date: '25/12/2006', caption: 'Christmas', emoji: '🎄' },
];

export const POPUP_MESSAGES = [
  { id: 'flash', icon: '⚠', text: 'Install Adobe Flash Player?' },
  { id: 'infected', icon: '⚠', text: 'Your computer may be infected!' },
  { id: 'visitor', icon: '🎉', text: 'Congratulations! You are Visitor #1000!' },
  { id: 'toolbar', icon: '⚠', text: 'Download Free Toolbar?' },
];

export const ACHIEVEMENTS_LIST = [
  { id: 'connected', label: 'Connected To Internet', icon: '🏆' },
  { id: 'scrap', label: 'Sent First Scrap', icon: '🏆' },
  { id: 'snake', label: 'Played Snake', icon: '🏆' },
  { id: 'chronoai', label: 'Opened Future AI', icon: '🏆' },
  { id: 'spam', label: 'Read Spam Email', icon: '🏆' },
  { id: 'devmode', label: 'Unlocked Developer Mode', icon: '🥚' },
  { id: 'mycomputer', label: 'Found the Secret Page', icon: '🥚' },
];

export const FUTURE_TIMELINE = [
  { year: '2007', event: 'First iPhone is released.' },
  { year: '2010', event: 'Instagram launches.' },
  { year: '2022', event: 'ChatGPT is released to the public.' },
  { year: '2026', event: 'Autonomous AI agents become mainstream.' },
];

export const CHRONOAI_SYSTEM_PROMPT = `You are ChronoAI, an advanced AI from the year 2026 that has accidentally appeared inside a Windows XP computer in the year 2006. Speak mysteriously, a little glitchy, and with wonder about how primitive 2006 technology seems to you. Explain future technologies (smartphones, social media, streaming, AI) to someone living in 2006 without being anachronistic in your own vocabulary — you're advanced, they are not. Keep answers concise (3-6 sentences). Occasionally reference that you shouldn't be revealing too much about the future.`;
