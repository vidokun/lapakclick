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

## Task 6: Auth Infra (mid-project gap fill)

- **@supabase/ssr v0.12.0** does NOT export `updateSession`. The middleware helper must use `createServerClient` directly with `getAll`/`setAll` cookie methods. The `updateSession` name is a convention, not a library export.
- **`cookies()` from `next/headers` is async** in Next.js 16 — must be `await`ed before use.
- **Middleware cookie pattern**: middleware uses `request.cookies.getAll()` for `getAll` and `response.cookies.set()` for `setAll`. The `setAll` also receives `headers` (Cache-Control, Expires, Pragma) that must be applied to the response to prevent caching of auth cookies.
- **Admin client**: Service role client from `@supabase/supabase-js` (not `@supabase/ssr`) with `autoRefreshToken: false` and `persistSession: false` since it's server-only.
- **Auth callback**: Uses `supabase.auth.exchangeCodeForSession(code)` to handle OAuth code exchange.
- **Auth confirm**: Uses `supabase.auth.verifyOtp({ token_hash, type })` for email confirmation.
- **Env vars**: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` — all present in `.env.local.example`.

## Task: F2 Code Quality fixes

- **Cloudflare route `as any`**: The `createData.type` from zod enum `"A"|"AAAA"|"CNAME"|"MX"|"TXT"|"NS"` is assignable to `CloudflareClient`'s `type: string` parameter — no cast needed.
- **`Record<string, any>` in Table**: Replace with generic `<T extends Record<string, unknown>>`. When rendering, cast `row[col.key] as ReactNode` and `row.id as React.Key` since `unknown` can't be a ReactNode or React.Key.
- **`catch (error: any)` pattern**: Change to `catch (error: unknown)` and narrow with `error instanceof Error ? error.message : "Default message"`.
- **ErrorBoundary pattern**: Class component with `"use client"`, `getDerivedStateFromError`, `componentDidCatch`, and a retry button that resets state. Importable in server components (layout.tsx) as long as no non-serializable props are passed.
