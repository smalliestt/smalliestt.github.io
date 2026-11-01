# Viktoriia Volkova — portfolio site

Static site: keep all HTML, CSS and JS files, the `img/` folder, and the other supplied assets together. No build step.

## Put it online
- Netlify: drag this folder onto app.netlify.com/drop.
- GitHub Pages: push the folder to a repository and turn on Pages for the main branch.
- Any host that serves static files works. Keep the folder structure as it is.

## Add your profile links
Open `index.html`, search for `profiles:` and fill in the addresses:

    profiles: { behance: 'https://www.behance.net/…', linkedin: 'https://www.linkedin.com/in/…', telegram: 'https://t.me/…' }

Links that stay empty are hidden on the page.

## Page not found
`404.html` is picked up automatically by Netlify and GitHub Pages (user site or custom domain). It uses root paths (`/fonts/…`, `/`), so it is meant for a site served from the domain root.

## Design notes
`research/` holds the design review: five project pages, a method page and the MAXQDA / ATLAS.ti project files. `research/README-ru.md` explains the files.

## Link preview
`og-image.jpg` is the picture shown when the link is shared. Most apps need its full address: once the site is online, replace
`content="og-image.jpg"` in `index.html` with the full URL, e.g. `https://your-site/og-image.jpg`.

## Fonts and scripts
Fonts load from Google Fonts (Instrument Serif, Outfit, JetBrains Mono); motion uses GSAP 3.13.0 from cdnjs.
Without them the page still works with fallback fonts and no animation.

## Chit Chat interactive demo

The character reveal uses an original, locally rendered SVG/DOM animation and the supplied Figma character artwork. No video files or `media/` folder are required for this interaction. The animation has skip and close controls and respects reduced-motion preferences. Artwork credits are listed in `CREDITS.md`. Chit Chat uses local Sora and Montserrat font files and their bundled SIL Open Font License notices in `fonts/`.
