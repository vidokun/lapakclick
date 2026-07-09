# Learnings — lapakclick-saas

## Task 8: Landing Page

- **Design tokens**: Tokens defined in `styles/tokens.css` as CSS custom properties, mapped to Tailwind v4 `@theme` block in `globals.css`. Use Tailwind classes like `bg-surface`, `text-fg`, `text-accent`, `font-display`, `rounded-4`, `border-border` etc.
- **Button component**: `components/ui/Button.tsx` does NOT support `asChild` prop (no Slot/RadiU pattern). For link-as-button, use `<Link>` with matching Tailwind classes directly.
- **Header component**: Accepts `landing` prop (default true). When true, shows landing nav items (Beranda, Fitur, Cara Kerja, FAQ) and Masuk/Daftar buttons. Already has mobile hamburger + off-canvas drawer.
- **Footer**: Has 3 link columns + copyright. Already uses design tokens.
- **FAQ accordion**: Use `"use client"` for `useState` to track open index. CSS transition on `max-height` for smooth open/close. Only one item open at a time.
- **Hero gradient**: Implemented via `bg-gradient-radial from-accent/20 to-transparent` on a separate absolutely positioned div.
- **ID attributes**: All sections need `id` attrs for scroll nav: `#fitur`, `#cara-kerja`, `#faq`, `#beranda`.
- **Build**: TypeScript compilation and Next.js build succeed. Static pre-rendering produces `index.html` at ~45KB.
- **Box shadow syntax**: Tailwind v4 supports arbitrary `shadow-[...]` values for custom box-shadows.
- **Gradient radial**: Tailwind v4 has `bg-gradient-radial` utility.
