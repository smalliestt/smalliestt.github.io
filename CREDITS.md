# Visual credits

## Chit Chat interactive portfolio demo

The character discovery animation is an original interaction created specifically for this portfolio. Its message capsule, graphic shapes, transitions, and character reveal are rendered locally with SVG, DOM elements, and browser animation APIs.

## Original Chit Chat artwork

Yuna Aoki, Jade Morgan, the mint-to-sky reveal graphic, logo, stars, arrows, and close icon come from Viktoriia Volkova's supplied [Chit Chat Figma designs](https://www.figma.com/design/6BM0G6AghHiftyskGDcIwm/My-porfolio?node-id=19-3533). They are the original portfolio project visuals, used in this interaction with the user's direction.

Local artwork files:

- `img/cc-yuna-character.png`
- `img/cc-jade-character.png`
- `img/cc-reveal-rays.svg`

These credits describe the Chit Chat interactive demo. The rest of the portfolio retains its existing artwork and authorship.

## Chit Chat typefaces

Sora and Montserrat are served locally from `fonts/`. Their SIL Open Font License notices are included in `fonts/cc-sora-OFL.txt` and `fonts/cc-montserrat-OFL.txt`. The rest of the portfolio keeps its existing typefaces.

## Việt Home — current Figma design

The eight menu pages in `img/vh-figma-01.png` through `img/vh-figma-08.png` are original print-art exports of the current Menu page in the supplied [portfolio Figma file](https://www.figma.com/design/6BM0G6AghHiftyskGDcIwm/My-porfolio?node-id=332-1030). They preserve the original typography, colours and continuous dotted dragon illustration.

The six presentation mockups use the original photographs and print layers from the same Figma page: paper bag, takeaway box, loyalty card, chopstick sleeves, team T-shirt and staff apron. Their local `vh-src-*` assets and outlined wordmarks are composed at the original Figma coordinates and scaled together for smaller screens. The mockups show design applications; they are not presented as production or sales evidence.

## Research-page typography

The research pages inherit each project's colours and use the supplied project artwork. Outfit and Instrument Serif are served locally for these pages and their case-study sections. Font files come from the official Google Fonts repositories for [Outfit](https://github.com/google/fonts/tree/main/ofl/outfit) and [Instrument Serif](https://github.com/google/fonts/tree/main/ofl/instrumentserif). Their SIL Open Font License files are bundled in `fonts/portfolio-outfit-OFL.txt` and `fonts/portfolio-instrument-serif-OFL.txt`. Chit Chat continues to use the locally bundled Sora and Montserrat faces.

Outfit and Instrument Serif have no Vietnamese letters, so `fonts/vn-outfit-*.woff` and `fonts/vn-instrument-serif.woff` add the missing ones (ệ, ơ, ở, ị and the rest of the Vietnamese set). They are built from each font's own glyphs and accent positions, under separate names (Portfolio Outfit Vietnamese, Portfolio Serif Vietnamese), and are released under the same SIL Open Font License. `vn-fonts.css` loads them only for those letters.
