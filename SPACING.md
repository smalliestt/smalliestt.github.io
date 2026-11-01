# Portfolio spacing

The shared spacing stylesheet is `spacing.css`, loaded after project styles. It keeps each project's identity and immersive artwork coordinates.

- Scale: 4, 8, 12, 16, 20, 24, 32, 40, 48, 56, 64, 80 and 96 CSS pixels.
- Page insets: 16 below 360px, 20 on phones, 24 from 768px, 32 from 1200px; existing safe-area insets still apply.
- Separate buttons use 12px gaps. Case-picker targets are 44px with 8px gaps; ordinary buttons use 48px and Chit Chat result actions use 56px.
- Case section spacing: 56px on phones, 64px on tablets, 80px on wide screens. Related paragraphs use 16px.
- Padded Chit Chat and Viet Home research panels stay in one column at 768–999px.
- The contact panel fills the phone viewport and is capped at 520px on desktop, with its own internal insets.
- Footer links use 44px rows and 8px gaps. Its link area participates in normal flow so that five links fit with 48px remaining below them on desktop.
- Reports and their downloadable offline bundle share the same spacing rules.

Verified in emulated Chromium layouts at 320, 390, 768, 1024 and 1440px. All five cases were checked at these widths; all five reports at 320, 390, 768 and 1440px. Contact, menu, reveal and footer states were inspected. Book arrows, case switching and the comparison slider were exercised. This is browser emulation, not a physical-device certification.
