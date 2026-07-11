# Wallpaper assets

The desktop currently uses CSS gradients (see `WALLPAPER_BACKGROUNDS` in
`src/utils/constants.js`) as stand-ins for real wallpaper art like
Windows XP's "Bliss" photo, since that specific image is copyrighted.

## Using real images (automatic upgrade)

Just drop a real photo in this folder, named after the wallpaper's id:

- `bliss.jpg` (or `.jpeg` / `.png` / `.webp`)
- `aqua.jpg`
- `space.jpg`
- `cars.jpg`
- `anime.jpg`

That's it — no code changes needed. `getWallpaperStyle()` in
`src/utils/constants.js` scans this folder at build time (via
`import.meta.glob`) and will automatically use your image instead of
the gradient for any id that has a matching file. Ids without an image
still fall back to their gradient, so you can upgrade wallpapers one
at a time.
