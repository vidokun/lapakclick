# lapak.click — Brand spec

## Overview
Free subdomain claim service for Indonesian MSMEs (Usaha Mikro, Kecil, dan Menengah).
Domain: lapak.click
Tagline: "onlinekan usaha mu dengan subdomain gratis"

## Color tokens (midnight purple — dark mode)

```css
:root {
  --bg:        oklch(10% 0.018 280);   /* deep midnight */
  --surface:   oklch(14% 0.022 280);   /* card/surface */
  --fg:        oklch(92% 0.008 280);   /* main text */
  --muted:     oklch(55% 0.015 280);   /* secondary text */
  --border:    oklch(22% 0.025 280);   /* borders */
  --accent:    oklch(68% 0.18 285);    /* bright violet accent */
  --accent-gl: oklch(78% 0.20 290);   /* glow variant */
  --positive:  oklch(65% 0.18 150);   /* success green */
  --negative:  oklch(60% 0.18 25);    /* error red */
}
```

## Typography
- **Display**: 'Cabinet Grotesk', system-ui, sans-serif (bold, geometric, compact)
- **Body**: 'Geist', system-ui, sans-serif (clean, modern)
- **Mono**: 'Geist Mono', 'JetBrains Mono', monospace (for domain names, technical text)

## Layout posture
- Compact spacing — minimal vertical gaps, information-dense
- Dark surface with bright accent pops
- Frosted glass effects on interactive elements
- Sharp corners (4px radius max), no rounded cards
- One accent per viewport (violet), used for CTAs and highlights only
- Tabular numbers for domain-related data
