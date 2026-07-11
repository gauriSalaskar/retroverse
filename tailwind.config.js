/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Windows XP / Y2K palette
        xpBlue: '#245EDB',
        xpDarkBlue: '#0A246A',
        silverChrome: '#D4D0C8',
        aquaBlue: '#89CFF0',
        limeGreen: '#8BD948',
        skyBlue: '#6DB3FF',
        purpleNeon: '#7B3FF2',
        pinkAccent: '#FF69B4',
        orangeHighlight: '#FFB347',
        // ChronoAI cyberpunk accents
        chronoBlack: '#05010f',
        chronoNeon: '#00F0FF',
        chronoPurple: '#9B30FF',
      },
      fontFamily: {
        // Y2K / early-2000s system fonts. Never Inter/Poppins.
        tahoma: ['Tahoma', 'Verdana', 'sans-serif'],
        trebuchet: ['"Trebuchet MS"', 'Verdana', 'sans-serif'],
        mssans: ['"MS Sans Serif"', 'Tahoma', 'sans-serif'],
      },
      boxShadow: {
        xpWindow: '2px 2px 8px rgba(0,0,0,0.5)',
        glass: 'inset 0 1px 0 rgba(255,255,255,0.6), inset 0 -6px 10px rgba(0,0,0,0.15)',
      },
      backgroundImage: {
        'xp-titlebar': 'linear-gradient(180deg, #3D95FF 0%, #245EDB 40%, #0A246A 100%)',
        'aero-glass': 'linear-gradient(180deg, rgba(255,255,255,0.7) 0%, rgba(137,207,240,0.35) 50%, rgba(109,179,255,0.25) 100%)',
      },
      animation: {
        flicker: 'flicker 0.15s infinite',
        scanline: 'scanline 6s linear infinite',
        marquee: 'marquee 12s linear infinite',
        blink: 'blink 1s step-start infinite',
      },
      keyframes: {
        flicker: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.96 },
        },
        scanline: {
          '0%': { backgroundPosition: '0 0' },
          '100%': { backgroundPosition: '0 100%' },
        },
        marquee: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        blink: {
          '50%': { opacity: 0 },
        },
      },
    },
  },
  plugins: [],
};
