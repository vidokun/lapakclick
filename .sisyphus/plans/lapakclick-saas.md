# Lapak.click — Free Subdomain SaaS for Indonesian MSMEs

## TL;DR

> **Quick Summary**: Build a complete SaaS platform at `lapak.click` where Indonesian MSMEs can claim a free subdomain (`namausaha.lapak.click`) and manage DNS records via Cloudflare API. Users bring their own hosting — we handle the DNS.
>
> **Deliverables**:
> - Public landing page with availability checker
> - Auth system (login, register, forgot password, Google OAuth)
> - Protected dashboard (overview, subdomains, claim, DNS management, settings)
> - Supabase database schema + RLS policies
> - Cloudflare DNS API CRUD integration
> - Responsive across 9 viewports, midnight purple theme
>
> **Estimated Effort**: Large (21 tasks + 4 review tasks)
> **Parallel Execution**: YES — 4 waves + final review wave
> **Critical Path**: Task 1 → Task 5 → Task 10 → Task 14 → Task 15 → Tasks F1-F4 → user okay

---

## Context

### Original Request
Build a free subdomain SaaS for Indonesian MSMEs (`namausaha.lapak.click`) — users claim a subdomain, point it to their own hosting, and manage DNS records. Design and brand assets are in `/design/` folder (brand-spec.md, index.html, login.html, dashboard.html).

### Interview Summary
**Key Discussions**:
- **Core Service**: DNS-only subdomain service (users bring their own hosting). Template hosting explicitly excluded from MVP.
- **Tech Stack**: Next.js (App Router) on Vercel Hobby, Supabase Auth + PostgreSQL, Cloudflare DNS API only (no Pages/Workers).
- **Free Tier**: 3 subdomains per account (freemium, premium features TBD later).
- **Design Copy**: Landing page must be rewritten to reflect DNS-only (remove template upload, revise How It Works steps 3-4, FAQ, Features).
- **Auth**: Email/password + Google OAuth via Supabase. Register and Forgot Password adapted from login.html design.
- **Test Strategy**: Tests After + mandatory Agent-Executed QA (Playwright for UI, curl for API).
- **Subdomain Rules**: lowercase alphanumeric + hyphens only.

**Research Findings**:
- Design files: `design/index.html` (landing), `design/login.html` (auth), `design/dashboard.html` (5-tab SPA), `design/brand-spec.md` (tokens), `design/DESIGN-MANIFEST.json` (responsive matrix), `design/DESIGN-HANDOFF.md` (impl instructions).
- Brand tokens: midnight purple oklch palette (`oklch(21% 0.06 280)` — `oklch(92% 0.01 280)`), Cabinet Grotesk (headings), Geist (body), Geist Mono (code), 4px border radius, compact spacing.
- Cloudflare DNS API: Zone ID + API Token authentication, Create/List/Update/Delete DNS records endpoints.

### Metis Review
**Identified Gaps** (addressed):
- **Design-Scope Mismatch**: Landing page HTML promises file hosting/template upload. Resolved via copy rewrite mandate (Task 19).
- **SSL Copy Confusion**: Feature card says "SSL Gratis". Clarified: Cloudflare provides SSL for proxied DNS; for DNS-only mode, copy must say "SSL dari hosting Anda" or remove claim.
- **Analytics Placeholder**: Dashboard has visitor counter. Resolved: show as non-functional placeholder "Segera hadir" for MVP.
- **Subdomain Name Normalization**: Dashboard JS uses `replace(/[^a-z0-9-]/g, '')`. Formalized as task acceptance criteria.
- **Google OAuth Redirects**: Vercel preview branches need dynamic callback URLs. Resolved via Supabase's built-in redirect configuration.
- **Rate Limiting & Race Conditions**: Claim availability must debounce frontend + unique constraint on `subdomains.name` in Supabase.

---

## Work Objectives

### Core Objective
Build and deploy a production-ready DNS-only subdomain SaaS at lapak.click where Indonesian MSMEs claim free subdomains and manage DNS records via a modern dashboard.

### Concrete Deliverables
- Next.js App Router project deployed to Vercel
- Public landing page (`/`) with DNS-only copy, availability checker, how-it-works, FAQ
- Auth pages: `/login`, `/register`, `/forgot-password`, Google OAuth callback
- Protected dashboard at `/dashboard/*` with 5 tabs: Overview, Subdomain, Claim, DNS Management, Settings
- Supabase PostgreSQL schema: `subdomains`, `dns_records`, `activity_logs` tables + RLS policies
- Cloudflare DNS API CRUD integration (server-side only, via API routes)
- Responsive design matching 9 viewports from DESIGN-MANIFEST.json

### Definition of Done
- [ ] All 21 implementation tasks complete with passing QA scenarios
- [ ] All 4 final reviewers (F1-F4) approve
- [ ] User gives explicit okay after final review presentation
- [ ] Evidence files saved to `.sisyphus/evidence/` for every QA scenario

### Must Have
- Landing page copy rewritten to DNS-only service (no file hosting, no template upload)
- Real-time availability check via Supabase API (not client-side simulation)
- Subdomain name validation: lowercase alphanumeric + hyphens, 3-63 chars, no reserved words
- Free tier limit: maximum 3 subdomains per account enforced at DB + API level
- Cloudflare DNS records CRUD via server-side API routes (secrets never exposed to client)
- RLS policies: users can only read/write their own subdomains and DNS records
- Responsive layout: sidebar collapses at 900px breakpoint, off-canvas navigation on mobile

### Must NOT Have (Guardrails)
- NO template hosting or file upload functionality (claim form removes "Template Website" dropdown)
- NO custom domain binding UI or logic
- NO admin panel or internal tools
- NO payment or pricing logic
- NO analytics/visitor tracking collection (stats shown as "Segera hadir" placeholders)
- NO Supabase Storage integration
- NO English translation — all copy in Bahasa Indonesia only
- NO premium feature gate logic beyond the 3-subdomain limit counter

---

## Verification Strategy

> **ZERO HUMAN INTERVENTION** — ALL verification is agent-executed. No exceptions.

### Test Decision
- **Infrastructure exists**: NO (will be set up during project init)
- **Automated tests**: Tests After (test tasks included in relevant implementation tasks)
- **Framework**: Playwright (browser QA) + vitest (unit tests)
- **QA Execution**: Every task includes agent-executed QA scenarios

### QA Policy
Every task MUST include agent-executed QA scenarios. Evidence saved to `.sisyphus/evidence/task-{N}-{scenario-slug}.{ext}`.

- **Frontend/UI**: Playwright — navigate, interact, assert DOM, screenshot
- **API/Backend**: Bash (curl) — send requests, assert status + response fields
- **Database**: Bash (psql or Supabase CLI) — query tables, verify RLS enforcement
- **Responsive**: Playwright viewport emulation — test at 390px, 768px, 1440px

---

## Execution Strategy

### Parallel Execution Waves

```
Wave 1 (Start Immediately — foundation + scaffolding):
├── Task 1: Project initialization (Next.js + Tailwind + deps)
├── Task 2: Design token extraction & CSS system
├── Task 3: Shared UI component library
├── Task 4: Layout components (Header, Footer, Sidebar)
├── Task 5: Database schema & Supabase migration
├── Task 6: Supabase Auth setup (client + server helpers)
└── Task 7: Cloudflare API client utility

Wave 2 (After Wave 1 — public pages + API layer):
├── Task 8: Landing page (Hero, Features, HowItWorks, FAQ, CTA, Footer)
├── Task 9: Auth pages (Login, Register, Forgot Password)
├── Task 10: Supabase RLS policies & server helpers
└── Task 11: API routes (availability check, subdomain CRUD, DNS CRUD)

Wave 3 (After Wave 2 — dashboard):
├── Task 12: Dashboard layout & navigation wrapper
├── Task 13: Dashboard Overview (stats cards + activity log)
├── Task 14: Subdomain list + management page
├── Task 15: Claim subdomain page (with Cloudflare integration)
├── Task 16: DNS management page (with Cloudflare CRUD)
└── Task 17: Settings page (profile, security, delete account)

Wave 4 (After Wave 3 — integration & polish):
├── Task 18: Landing page availability check integration
├── Task 19: DNS-only copy rewrite across all pages
├── Task 20: Responsive QA & polish pass
└── Task 21: SEO meta tags, OG images, favicon

Wave FINAL (After ALL tasks — 4 parallel reviews, then user okay):
├── Task F1: Plan compliance audit (oracle)
├── Task F2: Code quality review (unspecified-high)
├── Task F3: Real manual QA execution (unspecified-high)
└── Task F4: Scope fidelity check (deep)
```

### Dependency Matrix

- **1-7**: Independent — parallel in Wave 1
- **8**: Depends on 2, 3, 4 — blocked by Wave 1
- **9**: Depends on 2, 3, 4, 6 — blocked by Wave 1
- **10**: Depends on 5, 6 — blocked by Wave 1
- **11**: Depends on 5, 6, 7 — blocked by Wave 1
- **12**: Depends on 3, 4, 6 — blocked by Wave 1
- **13**: Depends on 10, 11, 12 — blocked by Wave 2-3
- **14**: Depends on 10, 11, 12 — blocked by Wave 2-3
- **15**: Depends on 10, 11, 12, 7 — blocked by Wave 2-3
- **16**: Depends on 10, 11, 12, 7 — blocked by Wave 2-3
- **17**: Depends on 10, 12 — blocked by Wave 2-3
- **18**: Depends on 8, 11 — blocked by Wave 2-3
- **19**: Depends on 8, 9, 13-17 — blocked by Wave 2-3
- **20**: Depends on all Wave 1-4 tasks — final pass
- **21**: Depends on 8 — can start after landing page done
- **F1-F4**: Depends on ALL tasks — final wave

---

## TODOs

- [x] 1. **Project initialization** — Next.js + Tailwind + dependencies

  **What to do**:
  - Scaffold a new Next.js 14 App Router project with TypeScript
  - Install and configure Tailwind CSS v3 with PostCSS
  - Install `@supabase/supabase-js`, `@supabase/ssr`, `@supabase/auth-helpers-nextjs`
  - Install `zod` for validation
  - Install `lucide-react` for icons
  - Install Playwright for E2E testing (`npm init playwright`)
  - Create `.env.local.example` with all environment variables documented
  - Create `.gitignore` (node_modules, .next, .env.local, .playwright)
  - Set up directory structure: `app/`, `components/`, `lib/`, `types/`, `public/`
  - Configure `next.config.ts` (image domains, experimental flags if any)
  - Set up `tsconfig.json` with path aliases (`@/` → `src/`)

  **Must NOT do**:
  - No global CSS reset yet (delegated to Task 2)
  - No component creation (delegated to Tasks 3-4)
  - No API routes

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []
  - Reason: Standard project scaffolding — well-defined, repeatable, minimal decisions

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 2-7)
  - **Blocks**: Wave 2 tasks, Wave 3 tasks, Wave 4 tasks
  - **Blocked By**: None (starts immediately)

  **References**:
  - `design/brand-spec.md` — Design token reference for Tailwind config
  - `design/DESIGN-MANIFEST.json` — Viewport/responsive requirements
  - Supabase SSR docs: https://supabase.com/docs/guides/auth/server-side/nextjs

  **Acceptance Criteria**:

  **QA Scenarios**:

  ```
  Scenario: Project builds and dev server starts
    Tool: Bash
    Preconditions: npm install completed
    Steps:
      1. Run `npm run build` — expect exit code 0
      2. Run `npm run dev` — server starts on port 3000
    Expected Result: Build succeeds, dev server starts without errors
    Evidence: .sisyphus/evidence/task-1-build-success.txt

  Scenario: Directory structure exists
    Tool: Bash
    Preconditions: scaffolding complete
    Steps:
      1. `ls app/` — exists
      2. `ls components/` — exists
      3. `ls lib/` — exists
      4. `ls types/` — exists
    Expected Result: All directories exist
    Evidence: .sisyphus/evidence/task-1-directories.txt

  Scenario: .env.local.example has all required keys
    Tool: Bash
    Preconditions: file exists
    Steps:
      1. `grep -c "NEXT_PUBLIC_SUPABASE_URL" .env.local.example` ≥ 1
      2. `grep -c "NEXT_PUBLIC_SUPABASE_ANON_KEY" .env.local.example` ≥ 1
      3. `grep -c "SUPABASE_SERVICE_ROLE_KEY" .env.local.example` ≥ 1
      4. `grep -c "CLOUDFLARE_API_TOKEN" .env.local.example` ≥ 1
      5. `grep -c "CLOUDFLARE_ZONE_ID" .env.local.example` ≥ 1
    Expected Result: All 5 env vars documented
    Evidence: .sisyphus/evidence/task-1-env-vars.txt
  ```

  **Evidence to Capture**:
  - [ ] Build output log
  - [ ] Directory listing
  - [ ] .env.local.example content

  **Commit**: YES (groups with Wave 1)

- [x] 2. **Design token extraction & CSS system**

  **What to do**:
  - Extract all design tokens from `design/brand-spec.md` into `styles/tokens.css` as CSS custom properties
  - Configure `tailwind.config.ts` with the midnight purple oklch color palette:
    - Background: `oklch(21% 0.06 280)` (darkest)
    - Surface: `oklch(27% 0.05 280)`
    - Surface elevated: `oklch(33% 0.05 280)`
    - Border/line: `oklch(41% 0.05 280)`
    - Text primary: `oklch(92% 0.01 280)`
    - Text muted: `oklch(65% 0.02 280)`
    - Accent purple: `oklch(62% 0.22 290)`
    - Accent hover: `oklch(68% 0.22 290)`
    - Success green: `oklch(60% 0.18 150)`
    - Error red: `oklch(58% 0.22 25)`
    - Warning amber: `oklch(72% 0.18 80)`
  - Configure fonts: Cabinet Grotesk (headings via Fontshare), Geist (body via Google Fonts), Geist Mono (code)
  - Set up `app/globals.css` with `@tailwind base/components/utilities` and custom property definitions
  - Set up root `app/layout.tsx` with font loading (next/font for Geist, CSS @import for Cabinet Grotesk)
  - Apply base body styles: bg color, text color, font-family
  - Set border-radius utility: `rounded-4` (4px default)

  **Must NOT do**:
  - No component-specific styling (delegated to Tasks 3-4)
  - No page-specific styling (delegated to Tasks 8-9, 13-17)

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
  - **Skills**: []
  - Reason: Design token translation requires pixel-fidelity to brand spec

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 1, 3-7)
  - **Blocks**: Tasks 3, 4, 8, 9, 12, 13-17, 20
  - **Blocked By**: None (starts immediately)

  **References**:
  - `design/brand-spec.md` — Complete token reference
  - `design/index.html` — Check CSS custom properties in `<style>` block
  - `design/DESIGN-HANDOFF.md` — Implementation instructions
  - Cabinet Grotesk: https://www.fontshare.com/fonts/cabinet-grotesk
  - Geist: https://vercel.com/font (or Google Fonts)

  **Acceptance Criteria**:

  **QA Scenarios**:

  ```
  Scenario: Tailwind config has purple theme tokens
    Tool: Bash
    Preconditions: tailwind.config.ts exists
    Steps:
      1. Run `grep -c "purple" tailwind.config.ts` — at least one purple accent found
      2. Run `grep -c "oklch" tailwind.config.ts` — at least 10 oklch values
    Expected Result: Theme tokens are defined
    Evidence: .sisyphus/evidence/task-2-tailwind-tokens.txt

  Scenario: Root layout uses dark bg and correct fonts
    Tool: Playwright
    Preconditions: dev server running on localhost:3000
    Steps:
      1. Navigate to http://localhost:3000
      2. Check `<body>` has `background-color` computed from oklch(21% 0.06 280)
      3. Check `<body>` `font-family` includes 'Geist'
    Expected Result: Dark theme applied, correct font loaded
    Evidence: .sisyphus/evidence/task-2-theme.png
  ```

  **Evidence to Capture**:
  - [ ] Tailwind config snippet showing oklch colors
  - [ ] Screenshot of body with dark background

  **Commit**: YES (groups with Wave 1)

- [x] 3. **Shared UI component library**

  **What to do**:
  - Build a set of reusable UI components in `components/ui/`:
    - `Button.tsx` — variants: primary (accent purple), secondary (surface), ghost, danger; sizes: sm, md, lg; loading state with spinner
    - `Input.tsx` — with label, error message, icon support, dark theme styling
    - `Card.tsx` — with title, subtitle, content slots, dark surface bg, 4px radius
    - `Badge.tsx` — variants: success (green), warning (amber), error (red), info (purple)
    - `Modal.tsx` — overlay, close button, title, body, footer slots
    - `Toast.tsx` — success/error/info variants, auto-dismiss after 5s
    - `Spinner.tsx` — SVG spinner with accent color
    - `EmptyState.tsx` — icon + title + description + optional CTA button
    - `StatCard.tsx` — label, value, icon, trend indicator
    - `Table.tsx` — responsive table with sort headers, loading skeleton, empty state
  - All components use Tailwind classes with `cn()` utility for class merging
  - All components typed with Props interface exported
  - Components accept `className` prop for customization
  - Components support dark theme (bg-surface, text-primary, border-line tokens)

  **Must NOT do**:
  - No page-specific components (delegated to Tasks 8, 9, 13-17)
  - No layout components (delegated to Task 4)
  - No complex state management — pure presentational components

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
  - **Skills**: []
  - Reason: Pixel-accurate dark-themed UI components matching HTML design

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 1, 2, 4-7)
  - **Blocks**: Tasks 8, 9, 12, 13-17
  - **Blocked By**: Task 2 (needs design tokens for styling)

  **References**:
  - `design/index.html` — Button styles, card patterns
  - `design/login.html` — Input styles, form patterns
  - `design/dashboard.html` — Table, badge, stat card, modal patterns
  - `design/brand-spec.md` — Token values for component styling

  **Acceptance Criteria**:

  **QA Scenarios**:

  ```
  Scenario: Button renders with variants
    Tool: Playwright
    Preconditions: dev server running with a test page
    Steps:
      1. Create a test page rendering Button with variant="primary"
      2. Assert button is visible, has bg-accent-purple
      3. Assert button has 4px border-radius
    Expected Result: Primary button renders with correct styles
    Evidence: .sisyphus/evidence/task-3-button.png

  Scenario: Input renders with label and error state
    Tool: Playwright
    Preconditions: test page with Input component
    Steps:
      1. Render Input with label="Email" and error="Required"
      2. Assert label text "Email" exists
      3. Assert error text "Required" exists in red
    Expected Result: Input with label and error renders correctly
    Evidence: .sisyphus/evidence/task-3-input.png

  Scenario: Card renders with all slots
    Tool: Playwright
    Preconditions: test page with Card
    Steps:
      1. Render Card with title, description, and children
      2. Assert title visible, description visible, children rendered
      3. Assert card has dark surface background
    Expected Result: Card renders fully
    Evidence: .sisyphus/evidence/task-3-card.png

  Scenario: Modal opens and closes
    Tool: Playwright
    Preconditions: test page with Modal
    Steps:
      1. Click button to open modal
      2. Assert modal overlay and content visible
      3. Click close button
      4. Assert modal hidden
    Expected Result: Modal toggles correctly
    Evidence: .sisyphus/evidence/task-3-modal.png
  ```

  **Evidence to Capture**:
  - [ ] Screenshots of each component variant
  - [ ] Component file listing

  **Commit**: YES (groups with Wave 1)

- [x] 4. **Layout components** — Header, Footer, Sidebar

  **What to do**:
  - Build `components/layout/Header.tsx`:
    - Logo "lapak.click" linking to `/`
    - Desktop: nav links (Beranda, Fitur, Cara Kerja, FAQ), login/register CTAs
    - Mobile: hamburger menu → off-canvas nav drawer
    - Sticky at top with glass-morphism effect (semi-transparent bg + backdrop-blur)
    - Matches `design/index.html` header pattern
  - Build `components/layout/Footer.tsx`:
    - Logo, tagline, nav links, social icons (as placeholders)
    - Copyright line
    - Matches `design/index.html` footer pattern
  - Build `components/layout/Sidebar.tsx`:
    - Dashboard sidebar with 5 nav items: Overview, Subdomain, Claim, DNS, Settings
    - Active state indicator (accent purple left border)
    - User info section at bottom (name, email, logout)
    - Collapses to off-canvas at 900px breakpoint
    - Matches `design/dashboard.html` sidebar pattern
  - Build `components/layout/DashboardShell.tsx`:
    - Combines Sidebar + main content area
    - Responsive: sidebar visible on desktop, hamburger on mobile
    - Matches `design/dashboard.html` layout

  **Must NOT do**:
  - No page content (delegated to Tasks 8, 9, 13-17)
  - No auth logic (delegated to Task 6)
  - No active links/logic — pure layout

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
  - **Skills**: []
  - Reason: Responsive layout matching HTML designs exactly

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 1-3, 5-7)
  - **Blocks**: Tasks 8, 9, 12
  - **Blocked By**: Task 2 (needs design tokens), Task 3 (needs Button component)

  **References**:
  - `design/index.html` — Header + Footer structure and styling
  - `design/dashboard.html` — Sidebar structure, nav items, responsive breakpoint at 900px
  - `design/DESIGN-MANIFEST.json` — Responsive breakpoints and viewport requirements

  **Acceptance Criteria**:

  **QA Scenarios**:

  ```
  Scenario: Landing page Header renders with nav links
    Tool: Playwright
    Preconditions: dev server running, landing page at /
    Steps:
      1. Navigate to http://localhost:3000
      2. Assert logo "lapak.click" visible in header
      3. Assert nav link "Fitur" exists
      4. Assert nav link "Cara Kerja" exists
      5. Assert "Masuk" and "Daftar" buttons visible
    Expected Result: Header renders with all nav items
    Evidence: .sisyphus/evidence/task-4-header-landing.png

  Scenario: Dashboard Sidebar shows 5 nav items
    Tool: Playwright
    Preconditions: test page with Sidebar
    Steps:
      1. Render Sidebar
      2. Assert "Overview" nav item exists
      3. Assert "Subdomain" nav item exists
      4. Assert "DNS" nav item exists
      5. Assert "Claim" nav item exists
      6. Assert "Pengaturan" nav item exists
    Expected Result: All 5 nav items present
    Evidence: .sisyphus/evidence/task-4-sidebar.png

  Scenario: Footer renders with logo and copyright
    Tool: Playwright
    Preconditions: landing page at /
    Steps:
      1. Scroll to bottom of page
      2. Assert logo "lapak.click" in footer
      3. Assert text includes "Hak Cipta" or "©"
    Expected Result: Footer renders correctly
    Evidence: .sisyphus/evidence/task-4-footer.png

  Scenario: Sidebar collapses below 900px
    Tool: Playwright
    Preconditions: test page with Sidebar
    Steps:
      1. Set viewport to 800px width
      2. Assert sidebar nav items hidden (off-canvas)
      3. Assert hamburger/menu button visible
      4. Click hamburger
      5. Assert off-canvas nav slides in
    Expected Result: Sidebar responsive behavior works
    Evidence: .sisyphus/evidence/task-4-sidebar-responsive.png
  ```

  **Evidence to Capture**:
  - [ ] Header screenshot
  - [ ] Sidebar screenshot (desktop + mobile)
  - [ ] Footer screenshot
  - [ ] Evidence files

  **Commit**: YES (groups with Wave 1)

- [x] 5. **Database schema & Supabase migration**

  **What to do**:
  - Write `supabase/migrations/001_initial.sql` with the following tables:

    **`subdomains`** table:
    - `id` UUID PK (default gen_random_uuid())
    - `user_id` UUID FK → auth.users(id) NOT NULL
    - `name` VARCHAR(63) UNIQUE NOT NULL — the subdomain name
    - `target` VARCHAR(255) — where the subdomain points (user's hosting IP/CNAME)
    - `status` VARCHAR(20) DEFAULT 'active' — active | pending | suspended
    - `ssl_status` VARCHAR(20) DEFAULT 'pending' — active | pending | unavailable
    - `last_active_at` TIMESTAMPTZ
    - `created_at` TIMESTAMPTZ DEFAULT now()
    - `updated_at` TIMESTAMPTZ DEFAULT now()
    - CONSTRAINT unique_name UNIQUE(name)
    - CONSTRAINT name_format CHECK (name ~ '^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?$')
    - INDEX idx_subdomains_user_id ON user_id
    - INDEX idx_subdomains_name ON name

    **`dns_records`** table:
    - `id` UUID PK
    - `subdomain_id` UUID FK → subdomains(id) ON DELETE CASCADE
    - `type` VARCHAR(10) NOT NULL — A, AAAA, CNAME, MX, TXT, NS
    - `name` VARCHAR(255) NOT NULL — record name (@, www, *)
    - `value` TEXT NOT NULL — record value
    - `ttl` INTEGER DEFAULT 120
    - `priority` INTEGER (for MX records)
    - `cloudflare_id` VARCHAR(255) — Cloudflare DNS record ID for sync
    - `created_at` TIMESTAMPTZ DEFAULT now()
    - `updated_at` TIMESTAMPTZ DEFAULT now()
    - INDEX idx_dns_records_subdomain_id ON subdomain_id

    **`activity_logs`** table:
    - `id` UUID PK
    - `user_id` UUID FK → auth.users(id) NOT NULL
    - `action` VARCHAR(50) NOT NULL — subdomain_created, dns_added, etc.
    - `details` JSONB
    - `created_at` TIMESTAMPTZ DEFAULT now()
    - INDEX idx_activity_logs_user_id ON user_id
    - INDEX idx_activity_logs_created_at ON created_at DESC

  - Create an auto-update trigger for `updated_at` columns
  - Create a function `check_subdomain_limit(user_id)` that returns TRUE if user has < 3 subdomains
  - Create a trigger on INSERT to subdomains to enforce the 3-subdomain limit
  - Add RLS policies (basic — will be refined in Task 10):
    - subdomains: users can SELECT/INSERT their own, UPDATE/DELETE their own
    - dns_records: users can SELECT/INSERT/UPDATE/DELETE records on their subdomains
    - activity_logs: users can SELECT their own, INSERT via server function
  - Write `supabase/seed.sql` with test data (2 test users, sample subdomains, records)

  **Must NOT do**:
  - No Cloudflare-specific logic in schema
  - No analytics/visitor tables
  - No payment/subscription tables

  **Recommended Agent Profile**:
  - **Category**: `deep`
  - **Skills**: []
  - Reason: Schema design decisions affect everything downstream — RLS, triggers, indexing all critical

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 1-4, 6-7)
  - **Blocks**: Tasks 10, 11, 13-17
  - **Blocked By**: None (starts immediately)

  **References**:
  - Supabase schema design: https://supabase.com/docs/guides/database/overview
  - Supabase RLS: https://supabase.com/docs/guides/auth/row-level-security
  - Supabase migrations: https://supabase.com/docs/guides/cli/local-development#database-migrations
  - `design/dashboard.html` — Shows what data the dashboard displays (subdomain list, activity)

  **Acceptance Criteria**:

  **QA Scenarios**:

  ```
  Scenario: Migration runs without errors
    Tool: Bash
    Preconditions: Supabase project initialized, .env has DB connection
    Steps:
      1. Run `supabase migration up` or execute SQL via psql
      2. Assert exit code 0
    Expected Result: All tables created without errors
    Evidence: .sisyphus/evidence/task-5-migration-log.txt

  Scenario: All tables exist with correct columns
    Tool: Bash
    Preconditions: migration applied
    Steps:
      1. Query `SELECT table_name FROM information_schema.tables WHERE table_schema='public'`
      2. Assert subdomains, dns_records, activity_logs all present
      3. Query each table's column count and types
    Expected Result: Tables and columns match schema spec
    Evidence: .sisyphus/evidence/task-5-tables.txt

  Scenario: Unique constraint on subdomain name works
    Tool: Bash
    Preconditions: test user exists
    Steps:
      1. INSERT subdomain with name='test-01'
      2. Try INSERT another subdomain with name='test-01' — expect unique violation error
    Expected Result: Duplicate subdomain name rejected
    Evidence: .sisyphus/evidence/task-5-unique-constraint.txt

  Scenario: 3-subdomain limit enforced
    Tool: Bash
    Preconditions: test user with 3 existing subdomains
    Steps:
      1. Try INSERT 4th subdomain for same user
      2. Assert trigger/check constraint rejects it
    Expected Result: 4th subdomain blocked with clear error
    Evidence: .sisyphus/evidence/task-5-limit-enforcement.txt
  ```

  **Evidence to Capture**:
  - [ ] Migration SQL file
  - [ ] Table verification output
  - [ ] Constraint enforcement evidence

  **Commit**: YES (groups with Wave 1)

- [x] 6. **Supabase Auth setup** — client + server helpers

  **What to do**:
  - Create `lib/supabase/client.ts`:
    - `createClient()` — Supabase browser client using `createBrowserClient` from `@supabase/ssr`
    - Uses `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - Create `lib/supabase/server.ts`:
    - `createServerClient()` — Supabase server client using `createServerClient` from `@supabase/ssr`
    - Cookie-based auth for server components and route handlers
  - Create `lib/supabase/middleware.ts`:
    - `updateSession()` — Next.js middleware to refresh Supabase session on every request
  - Create `middleware.ts` at root:
    - Apply `updateSession` to all routes
    - Protected route logic: redirect `/dashboard/*` to `/login` if unauthenticated
    - Public routes: `/`, `/login`, `/register`, `/forgot-password`, `/auth/*`
  - Create `app/auth/callback/route.ts` — OAuth callback handler
  - Create `app/auth/confirm/route.ts` — Email confirmation handler
  - Create `lib/supabase/admin.ts`:
    - `getServiceRoleClient()` — Supabase admin client using `SUPABASE_SERVICE_ROLE_KEY`
    - For server-only operations (deleting users, admin queries)
  - Set up Supabase project configuration:
    - Enable Email/Password Auth
    - Enable Google OAuth provider
    - Set Site URL to `http://localhost:3000` (dev) + production URL
    - Configure redirect URLs for auth callbacks

  **Must NOT do**:
  - No custom auth logic — use Supabase Auth primitives only
  - No user profiles table (auth.users meta_data sufficient for MVP)
  - No session storage beyond Supabase's built-in cookie management

  **Recommended Agent Profile**:
  - **Category**: `deep`
  - **Skills**: []
  - Reason: Auth middleware + server/client patterns require careful handling of cookies, SSR, and session refresh

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 1-5, 7)
  - **Blocks**: Tasks 9, 10, 11, 12, 13-17
  - **Blocked By**: None (starts immediately)

  **References**:
  - Supabase Auth + Next.js: https://supabase.com/docs/guides/auth/server-side/nextjs
  - Supabase SSR package: https://github.com/supabase/auth-helpers/tree/main/packages/ssr
  - `design/login.html` — Auth form patterns for login/register/forgot-password
  - `design/dashboard.html` — User info display in sidebar

  **Acceptance Criteria**:

  **QA Scenarios**:

  ```
  Scenario: Middleware redirects unauthenticated user to /login
    Tool: Playwright
    Preconditions: dev server running, no active session
    Steps:
      1. Navigate to http://localhost:3000/dashboard
      2. Assert redirected to http://localhost:3000/login
    Expected Result: Protected routes redirect to login
    Evidence: .sisyphus/evidence/task-6-redirect.png

  Scenario: OAuth callback route exists
    Tool: Bash
    Preconditions: project files exist
    Steps:
      1. `ls app/auth/callback/route.ts` — file exists
    Expected Result: Callback route present
    Evidence: .sisyphus/evidence/task-6-callback-route.txt

  Scenario: Server client creates session cookie
    Tool: Bash
    Preconditions: test script with valid Supabase credentials
    Steps:
      1. Write a test script that creates server client and exchanges code for session
      2. Run script — expect session object returned
    Expected Result: Server client works with cookie-based auth
    Evidence: .sisyphus/evidence/task-6-server-client.txt
  ```

  **Evidence to Capture**:
  - [ ] Middleware file content
  - [ ] Client and server client files
  - [ ] Redirect test screenshot

  **Commit**: YES (groups with Wave 1)

- [x] 7. **Cloudflare API client utility**

  **What to do**:
  - Create `lib/cloudflare.ts`:
    - `CloudflareClient` class with constructor(apiToken, zoneId)
    - Methods:
      - `createDnsRecord(subdomain, type, value, ttl?, proxied?)` → POST `/zones/:zone/dns_records`
      - `listDnsRecords(subdomain?)` → GET `/zones/:zone/dns_records`
      - `updateDnsRecord(recordId, subdomain, type, value, ttl?, proxied?)` → PATCH `/zones/:zone/dns_records/:id`
      - `deleteDnsRecord(recordId)` → DELETE `/zones/:zone/dns_records/:id`
      - `getDnsRecord(recordId)` → GET `/zones/:zone/dns_records/:id`
      - `checkDnsPropagation(recordName)` — basic check via dig/curl (informational)
    - All methods return typed responses using a shared `CloudflareApiResponse` type
    - Error handling: parse Cloudflare API errors, throw typed errors
    - Request timeout: 10s default
    - Retry logic: 2 retries with exponential backoff on 429 (rate limit) or 5xx
    - Log all API calls to `activity_logs` context (accept callback)
  - Create `types/cloudflare.ts`:
    - `DnsRecordType` — A, AAAA, CNAME, MX, TXT, NS
    - `CloudflareDnsRecord` — full Cloudflare DNS record shape
    - `CloudflareApiError` — typed error with code, message
  - Create `app/api/cloudflare/route.ts`:
    - Server-side API route wrapper (POST) for Cloudflare operations
    - Validates user authentication via Supabase session
    - Validates input with Zod schemas
    - Dispatches to CloudflareClient methods
    - Returns JSON responses (never exposes API token to client)

  **Must NOT do**:
  - No Cloudflare Pages/Workers integration
  - No zone management (zone must already exist for lapak.click)
  - No client-side Cloudflare API calls (server-only via API routes)

  **Recommended Agent Profile**:
  - **Category**: `deep`
  - **Skills**: []
  - Reason: External API integration with error handling, retry logic, and security — all Cloudflare secrets must stay server-side

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 1-6)
  - **Blocks**: Tasks 11, 15, 16
  - **Blocked By**: None (starts immediately)

  **References**:
  - Cloudflare DNS API: https://developers.cloudflare.com/api/operations/dns-records-for-a-zone-list-dns-records
  - Cloudflare API auth: https://developers.cloudflare.com/fundamentals/api/reference/authorization/
  - `design/dashboard.html` — DNS management tab for reference of what fields the UI needs

  **Acceptance Criteria**:

  **QA Scenarios**:

  ```
  Scenario: Cloudflare client creates a DNS record
    Tool: Bash
    Preconditions: Valid CLOUDFLARE_API_TOKEN and CLOUDFLARE_ZONE_ID in .env
    Steps:
      1. Write test script that imports CloudflareClient
      2. Call createDnsRecord('test-subdomain', 'A', '192.0.2.1')
      3. Assert response has success: true and record.id is a string
    Expected Result: DNS record created via Cloudflare API
    Evidence: .sisyphus/evidence/task-7-create-record.txt

  Scenario: Cloudflare client lists DNS records
    Tool: Bash
    Preconditions: at least one record exists
    Steps:
      1. Call listDnsRecords()
      2. Assert response has result array with at least 1 record
    Expected Result: Records listed successfully
    Evidence: .sisyphus/evidence/task-7-list-records.txt

  Scenario: Cloudflare client deletes DNS record
    Tool: Bash
    Preconditions: a record exists with known ID
    Steps:
      1. Call deleteDnsRecord(recordId)
      2. Verify by calling listDnsRecords() — record no longer present
    Expected Result: Record deleted successfully
    Evidence: .sisyphus/evidence/task-7-delete-record.txt

  Scenario: API route rejects unauthenticated requests
    Tool: Bash (curl)
    Preconditions: dev server running
    Steps:
      1. POST to /api/cloudflare without Authorization header
      2. Assert 401 Unauthorized response
    Expected Result: Unauthenticated requests blocked
    Evidence: .sisyphus/evidence/task-7-unauthorized.txt
  ```

  **Evidence to Capture**:
  - [ ] Cloudflare API test outputs
  - [ ] API route file content

  **Commit**: YES (groups with Wave 1)

- [x] 8. **Landing page** — Hero, Features, HowItWorks, FAQ, CTA, Footer

  **What to do**:
  - Create `app/page.tsx` as the main landing page
  - Build the following components in `components/landing/`:
    - **Hero.tsx**: Headline "Bikin website UMKM kamu profesional dengan domain gratis!", subheadline, CTA buttons ("Klaim Subdomain Gratis" → /register, "Pelajari Lebih Lanjut" → scroll to fitur), availability check input (visual only, wired in Task 18). Matches `index.html` hero section.
    - **Features.tsx**: 4 feature cards grid (grid 2x2 desktop, 1 col mobile):
      1. "Domain Gratis" — `.lapak.click` subdomain gratis
      2. "DNS Mudah" — Kelola DNS dengan mudah
      3. "Cepat Aktif" — DNS siap dalam hitungan menit
      4. "100% Gratis" — Tidak ada biaya tersembunyi
      Matches `index.html` features section.
    - **HowItWorks.tsx**: 4 steps (revised to DNS-only):
      1. Pilih nama subdomain
      2. Arahkan ke hosting kamu
      3. Konfigurasi DNS (jika diperlukan)
      4. Selesai! Website kamu online
      Matches revised copy per scope.
    - **FAQ.tsx**: Accordion-style FAQ with items:
      - Apa itu lapak.click?
      - Berapa biayanya?
      - Bagaimana cara mengarahkan subdomain ke hosting saya?
      - Apakah saya perlu punya website dulu?
      - Berapa lama DNS tersebar?
      - Apakah SSL disediakan? (Answer: SSL dari hosting Anda)
      Matches `index.html` FAQ pattern.
    - **CTA.tsx**: Final call-to-action section with "Mulai Sekarang" button → /register
  - All components match the midnight purple dark theme
  - Responsive across 9 viewports

  **Must NOT do**:
  - No template hosting mentions
  - No file upload references
  - No file hosting claims
  - No analytics collection
  - Availability check is visual-only (wired in Task 18)

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
  - **Skills**: []
  - Reason: Pixel-fidelity to index.html design + DNS-only copy rewrite

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 9, 10, 11)
  - **Blocks**: Tasks 18, 19, 21
  - **Blocked By**: Tasks 2, 3, 4

  **References**:
  - `design/index.html` — THE source of truth: hero, features, how-it-works, FAQ, CTA
  - `design/brand-spec.md` — Token values
  - `design/DESIGN-MANIFEST.json` — Responsive viewports
  - Task 19 (copy rewrite) — will revise copy after this creates initial version

  **Acceptance Criteria**:

  **QA Scenarios**:

  ```
  Scenario: Hero section renders with headline and CTAs
    Tool: Playwright
    Preconditions: dev server running
    Steps:
      1. Navigate to http://localhost:3000
      2. Assert headline text contains "domain gratis"
      3. Assert "Klaim Subdomain Gratis" button visible
      4. Assert availability check input visible
    Expected Result: Hero section fully rendered
    Evidence: .sisyphus/evidence/task-8-hero.png

  Scenario: Features grid shows 4 cards
    Tool: Playwright
    Preconditions: landing page loaded
    Steps:
      1. Scroll to features section
      2. Assert 4 feature cards visible
      3. Assert first card title contains "Domain Gratis"
    Expected Result: 4 feature cards rendered
    Evidence: .sisyphus/evidence/task-8-features.png

  Scenario: HowItWorks shows DNS-only 4 steps
    Tool: Playwright
    Preconditions: landing page loaded
    Steps:
      1. Scroll to Cara Kerja section
      2. Assert 4 steps visible
      3. Assert no text matching "upload" or "template" in the section
    Expected Result: 4 DNS-only steps, no file hosting references
    Evidence: .sisyphus/evidence/task-8-how-it-works.png

  Scenario: FAQ accordion opens and closes
    Tool: Playwright
    Preconditions: landing page loaded
    Steps:
      1. Scroll to FAQ section
      2. Click first FAQ question
      3. Assert answer becomes visible
      4. Click same question again
      5. Assert answer hides
    Expected Result: FAQ accordion toggles correctly
    Evidence: .sisyphus/evidence/task-8-faq.png

  Scenario: Landing page responsive at 390px
    Tool: Playwright
    Preconditions: landing page loaded
    Steps:
      1. Set viewport to 390x844 (iPhone 14)
      2. Assert no horizontal scroll
      3. Assert navigation collapses to hamburger
      4. Assert features grid is 1 column
    Expected Result: Mobile layout correct
    Evidence: .sisyphus/evidence/task-8-responsive-mobile.png
  ```

  **Evidence to Capture**:
  - [ ] Hero screenshot
  - [ ] Features screenshot
  - [ ] HowItWorks screenshot
  - [ ] FAQ interaction evidence
  - [ ] Mobile responsive screenshot

  **Commit**: YES (groups with Wave 2)

- [x] 9. **Auth pages** — Login, Register, Forgot Password

  **What to do**:
  - Create `app/login/page.tsx`:
    - Email/password form with validation (Zod schema)
    - Password visibility toggle (eye icon)
    - "Ingat saya" checkbox (remember me)
    - "Masuk" submit button with loading state
    - Google OAuth button with Google logo
    - Links: "Belum punya akun? Daftar" → /register, "Lupa password?" → /forgot-password
    - Error display for invalid credentials
    - Matches `design/login.html` pixel-for-pixel
  - Create `app/register/page.tsx`:
    - Adapted from login design: email, password, confirm password, nama lengkap fields
    - Registration form with Zod validation
    - "Daftar" submit button
    - Google OAuth button
    - Link: "Sudah punya akun? Masuk" → /login
    - On success: redirect to /dashboard (auto-create session) or show confirmation
  - Create `app/forgot-password/page.tsx`:
    - Email input only
    - "Kirim tautan reset" button
    - Success state: "Cek email kamu untuk tautan reset password"
    - Link back to /login
    - Matches login design system (same input styles, button styles, layout)
  - All forms use server actions or API routes for submission
  - All pages redirect to /dashboard if user is already authenticated
  - Form validation errors shown inline below fields
  - Loading states on submit buttons (spinner + disabled)

  **Must NOT do**:
  - No custom auth logic beyond Supabase Auth SDK calls
  - No password strength meter (basic validation only)
  - No email verification flow customization (use Supabase defaults)

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
  - **Skills**: []
  - Reason: Matching login.html design exactly + form validation UX

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 8, 10, 11)
  - **Blocks**: Tasks 18, 19
  - **Blocked By**: Tasks 2, 3, 4, 6

  **References**:
  - `design/login.html` — The sole design reference for all 3 pages
  - `design/brand-spec.md` — Token values for form styling
  - Supabase Auth: https://supabase.com/docs/guides/auth/server-side/nextjs
  - Task 6 (Auth setup) — provides client/server helpers this page uses

  **Acceptance Criteria**:

  **QA Scenarios**:

  ```
  Scenario: Login form renders correctly
    Tool: Playwright
    Preconditions: dev server running
    Steps:
      1. Navigate to http://localhost:3000/login
      2. Assert email input visible
      3. Assert password input visible (type="password")
      4. Assert "Masuk" button visible
      5. Assert "Google" OAuth button visible
      6. Assert "Lupa password?" link exists
      7. Assert "Belum punya akun? Daftar" link exists
    Expected Result: Login page complete
    Evidence: .sisyphus/evidence/task-9-login.png

  Scenario: Register form has all fields
    Tool: Playwright
    Preconditions: dev server running
    Steps:
      1. Navigate to http://localhost:3000/register
      2. Assert "Nama Lengkap" input visible
      3. Assert email input visible
      4. Assert password input visible
      5. Assert confirm password input visible
      6. Assert "Daftar" button visible
    Expected Result: Register page complete
    Evidence: .sisyphus/evidence/task-9-register.png

  Scenario: Forgot password page has email field
    Tool: Playwright
    Preconditions: dev server running
    Steps:
      1. Navigate to http://localhost:3000/forgot-password
      2. Assert email input visible
      3. Assert "Kirim tautan reset" button visible
      4. Assert "Kembali ke login" link exists
    Expected Result: Forgot password page complete
    Evidence: .sisyphus/evidence/task-9-forgot-password.png

  Scenario: Login form shows validation errors
    Tool: Playwright
    Preconditions: dev server running
    Steps:
      1. Navigate to /login
      2. Click "Masuk" without filling fields
      3. Assert validation error messages visible (email required, password required)
      4. Enter invalid email "notanemail"
      5. Assert email validation error
    Expected Result: Form validation works
    Evidence: .sisyphus/evidence/task-9-validation.png

  Scenario: Password visibility toggle works
    Tool: Playwright
    Preconditions: login page loaded
    Steps:
      1. Type password "test123" in password field
      2. Click eye/toggle icon
      3. Assert input type changes to "text"
      4. Assert password text visible
      5. Click toggle again
      6. Assert input type changes back to "password"
    Expected Result: Password visibility toggles
    Evidence: .sisyphus/evidence/task-9-password-toggle.png
  ```

  **Evidence to Capture**:
  - [x] Login page screenshot
  - [x] Register page screenshot
  - [x] Forgot password screenshot
  - [x] Validation error screenshot

  **Commit**: YES (groups with Wave 2)

- [x] 10. **Supabase RLS policies & server helpers**

  **What to do**:
  - Create `app/api/subdomains/route.ts`:
    - GET — list user's subdomains (filtered by authenticated user)
    - POST — create new subdomain (validate name, enforce 3 limit, create in DB + Cloudflare)
    - Uses server client for session validation
    - Input validation with Zod
  - Create `app/api/subdomains/[id]/route.ts`:
    - GET — get single subdomain
    - PATCH — update subdomain
    - DELETE — delete subdomain (clean up DNS records + Cloudflare)
  - Create `app/api/subdomains/check/route.ts`:
    - POST — check availability (body: { name: string })
    - Query subdomains table for name uniqueness
    - Returns { available: boolean }
  - Create `app/api/dns-records/route.ts`:
    - GET — list records for a subdomain (filtered by subdomain_id)
    - POST — create DNS record (validate, create in DB + Cloudflare)
  - Create `app/api/dns-records/[id]/route.ts`:
    - PATCH — update DNS record
    - DELETE — delete DNS record
  - Create `app/api/activity/route.ts`:
    - GET — list recent activity for user (last 20, ordered by created_at DESC)
  - Refine RLS policies in a new migration `002_rls_policies.sql`:
    - `subdomains`: FOR ALL on own records (user_id = auth.uid())
    - `dns_records`: FOR ALL on records where subdomain.user_id = auth.uid()
    - `activity_logs`: SELECT own, INSERT via application
  - Create `lib/supabase/queries.ts`:
    - Helper functions for common queries: getUserSubdomains, getDnsRecords, logActivity, checkSubdomainLimit, getUserStats

  **Must NOT do**:
  - No admin-only endpoints
  - No raw SQL exposed via API routes
  - No bypass of RLS

  **Recommended Agent Profile**:
  - **Category**: `deep`
  - **Skills**: []
  - Reason: Security-critical — RLS policies, API route auth, input validation, and Cloudflare integration all must be correct and secure

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 8, 9, 11)
  - **Blocks**: Tasks 13, 14, 15, 16, 17, 18
  - **Blocked By**: Tasks 5, 6

  **References**:
  - `supabase/migrations/001_initial.sql` — Table schemas
  - Supabase RLS docs: https://supabase.com/docs/guides/auth/row-level-security
  - Supabase API routes: https://supabase.com/docs/guides/api
  - Task 5 (schema) — table definitions
  - Task 7 (Cloudflare client) — needed for subdomain creation

  **Acceptance Criteria**:

  **QA Scenarios**:

  ```
  Scenario: RLS prevents user A from seeing user B's subdomains
    Tool: Bash
    Preconditions: two test users exist, each with 1 subdomain
    Steps:
      1. Authenticate as User A
      2. GET /api/subdomains — assert only User A's subdomain returned
      3. Try to access User B's subdomain by ID directly
      4. Assert 403 or empty response
    Expected Result: RLS isolates user data
    Evidence: .sisyphus/evidence/task-10-rls-isolation.txt

  Scenario: Subdomain availability check works
    Tool: Bash (curl)
    Preconditions: existing subdomain "test-01" in DB
    Steps:
      1. POST /api/subdomains/check { name: "test-01" }
      2. Assert { available: false }
      3. POST /api/subdomains/check { name: "unique-name-123" }
      4. Assert { available: true }
    Expected Result: Availability check returns correct results
    Evidence: .sisyphus/evidence/task-10-availability.txt

  Scenario: Creating subdomain enforces 3 limit
    Tool: Bash (curl)
    Preconditions: authenticated user with 3 subdomains
    Steps:
      1. POST /api/subdomains { name: "fourth-sub" }
      2. Assert 403 or error response with limit message
    Expected Result: 4th subdomain blocked
    Evidence: .sisyphus/evidence/task-10-limit-enforcement.txt
  ```

  **Evidence to Capture**:
  - [x] RLS test output
  - [x] API route responses
  - [x] Limit enforcement evidence

  **Commit**: YES (groups with Wave 2)

- [x] 11. **API routes** — DNS CRUD, Cloudflare integration

  **What to do**:
  - Create `app/api/dns/cloudflare/route.ts`:
    - POST — proxy to Cloudflare client operations
    - Accepts { action, subdomainId, recordId, ...params }
    - Actions: create_record, update_record, delete_record, list_records
    - Validates user owns the subdomain before proxying
    - Returns Cloudflare API response
  - Create `lib/validations.ts`:
    - Zod schemas for all API inputs:
      - `createSubdomainSchema` — name (3-63 chars, lowercase alphanumeric + hyphens)
      - `createDnsRecordSchema` — type (enum), name, value, ttl, priority
      - `updateDnsRecordSchema` — partial of createDnsRecordSchema
      - `availabilityCheckSchema` — name
      - `loginSchema` — email, password
      - `registerSchema` — email, password, confirmPassword, fullName
  - Create shared error handling in API routes:
    - Consistent error response format: `{ error: { code: string, message: string } }`
    - HTTP status codes: 200 success, 400 validation, 401 unauth, 403 forbidden, 404 not found, 409 conflict, 429 rate limit, 500 server error
  - Create rate limiting middleware:
    - Simple in-memory rate limiter for: availability check (10/min), subdomain create (5/min), DNS operations (20/min)
    - Return 429 with Retry-After header on limit

  **Must NOT do**:
  - No file upload endpoints
  - No admin/impersonation endpoints
  - No bulk operations (no batch delete, no bulk create)

  **Recommended Agent Profile**:
  - **Category**: `deep`
  - **Skills**: []
  - Reason: Complex integration between Supabase auth, DB queries, and Cloudflare API with validation and rate limiting

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 8, 9, 10)
  - **Blocks**: Tasks 13, 14, 15, 16, 18
  - **Blocked By**: Tasks 5, 6, 7

  **References**:
  - Task 7 (Cloudflare client) — the client this routes wraps
  - Task 10 (RLS + subdomain routes) — pattern to follow for DNS routes
  - `design/dashboard.html` — DNS management UI fields (type, name, value, TTL)

  **Acceptance Criteria**:

  **QA Scenarios**:

  ```
  Scenario: Create DNS record via API
    Tool: Bash (curl)
    Preconditions: authenticated user with existing subdomain
    Steps:
      1. POST /api/dns/cloudflare { action: "create_record", subdomainId: "...", type: "A", name: "@", value: "192.0.2.1" }
      2. Assert 200 response with record data
      3. Verify record appears in DB
    Expected Result: DNS record created in DB + Cloudflare
    Evidence: .sisyphus/evidence/task-11-create-dns.txt

  Scenario: Validation rejects invalid DNS record types
    Tool: Bash (curl)
    Preconditions: authenticated
    Steps:
      1. POST /api/dns/cloudflare { action: "create_record", type: "INVALID" }
      2. Assert 400 response with validation error
    Expected Result: Invalid type rejected
    Evidence: .sisyphus/evidence/task-11-validation.txt

  Scenario: Rate limiter blocks excessive requests
    Tool: Bash (curl)
    Preconditions: authenticated
    Steps:
      1. Send 11 availability check requests rapidly
      2. Assert 11th request returns 429
      3. Assert Retry-After header present
    Expected Result: Rate limiting works
    Evidence: .sisyphus/evidence/task-11-rate-limit.txt

  Scenario: Unauthenticated request rejected
    Tool: Bash (curl)
    Preconditions: no auth token
    Steps:
      1. POST /api/dns/cloudflare without session cookie
      2. Assert 401 response
    Expected Result: Auth required
    Evidence: .sisyphus/evidence/task-11-unauth.txt
  ```

  **Evidence to Capture**:
  - [x] API response logs for CRUD operations
  - [x] Validation error response
  - [x] Rate limit evidence

  **Commit**: YES (groups with Wave 2)

- [ ] 12. **Dashboard layout & navigation wrapper**

  **What to do**:
  - Create `app/dashboard/layout.tsx`:
    - Protected layout — checks auth session, redirects to /login if unauthenticated
    - Renders DashboardShell with Sidebar + main content area
    - Fetches user data (name, email from session) for sidebar display
    - Sets up dashboard-specific metadata (title, description)
  - Create `app/dashboard/page.tsx`:
    - Simple redirect to `/dashboard/overview`
  - Create sidebar navigation items matching dashboard.html:
    - Overview (`/dashboard/overview`) — icon: LayoutDashboard
    - Subdomain (`/dashboard/subdomain`) — icon: Globe
    - Claim (`/dashboard/subdomain/claim`) — icon: PlusCircle
    - DNS (`/dashboard/dns`) — icon: Settings
    - Pengaturan (`/dashboard/settings`) — icon: UserCircle
    - Active state indicated by accent purple left border + purple text
  - Create mobile off-canvas navigation for sidebar (hamburger toggle)
  - Handle loading state: skeleton for sidebar while session loads
  - Handle auth errors: redirect to /login if session expired

  **Must NOT do**:
  - No page-specific content (delegated to Tasks 13-17)
  - No complex state management
  - No template/upload navigation items
  - No admin links or hidden routes

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
  - **Skills**: []
  - Reason: Matching dashboard.html sidebar + responsive off-canvas navigation

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3 (starts when Wave 2 done)
  - **Blocks**: Tasks 13, 14, 15, 16, 17
  - **Blocked By**: Tasks 3, 4, 6 (UI components + layout + auth)

  **References**:
  - `design/dashboard.html` — Sidebar, navigation items, active states, responsive breakpoints
  - `design/DESIGN-MANIFEST.json` — Responsive requirements
  - Task 4 (Layout components) — Sidebar and DashboardShell components
  - Task 6 (Auth setup) — Session management

  **Acceptance Criteria**:

  **QA Scenarios**:

  ```
  Scenario: Dashboard redirects to login when unauthenticated
    Tool: Playwright
    Preconditions: no active session
    Steps:
      1. Navigate to http://localhost:3000/dashboard
      2. Assert redirected to /login
    Expected Result: Protected route redirects
    Evidence: .sisyphus/evidence/task-12-protected-redirect.png

  Scenario: Dashboard sidebar shows 5 nav items with active state
    Tool: Playwright
    Preconditions: authenticated session, navigate to /dashboard/overview
    Steps:
      1. Assert sidebar visible with 5 nav items
      2. Assert "Overview" has active state (purple accent)
      3. Assert other items do not have active state
      4. Assert user name and email displayed at bottom
      5. Assert logout button exists
    Expected Result: Sidebar renders with correct active state
    Evidence: .sisyphus/evidence/task-12-sidebar.png

  Scenario: Sidebar navigation works
    Tool: Playwright
    Preconditions: authenticated
    Steps:
      1. Click "Subdomain" in sidebar
      2. Assert URL changes to /dashboard/subdomain
      3. Assert "Subdomain" now has active state
    Expected Result: Navigation works and active state updates
    Evidence: .sisyphus/evidence/task-12-navigation.png
  ```

  **Evidence to Capture**:
  - [ ] Redirect test screenshot
  - [ ] Sidebar with active state screenshot
  - [ ] Navigation transition evidence

  **Commit**: YES (groups with Wave 3)

- [ ] 13. **Dashboard Overview** — stats cards + activity log

  **What to do**:
  - Create `app/dashboard/overview/page.tsx`:
    - Fetch user stats from API: total subdomains, active subdomains, remaining claims (3 - used)
    - Stats cards using StatCard component:
      - "Total Subdomain" — count
      - "Aktif" — active subdomain count
      - "Sisa Klaim" — remaining claims (e.g., "2 dari 3")
      - "Pengunjung (30 hari)" — placeholder with "Segera hadir" badge
    - Subdomain list preview: last 5 subdomains with status badges
    - Activity log: last 10 activity entries from API
    - Each activity shows: icon, action text, timestamp (relative, e.g., "2 menit lalu")
    - Loading skeleton states for all cards and lists
    - Empty states: "Belum ada subdomain. Klaim sekarang!"
  - Create `lib/helpers.ts`:
    - `formatRelativeTime(date)` — returns "2 menit lalu", "1 jam lalu", "3 hari lalu"
    - `truncate(str, length)` — for long strings

  **Must NOT do**:
  - No visitor tracking collection
  - No charting/graphing libraries
  - No real-time subscriptions for MVP (polling or on-load only)

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
  - **Skills**: []
  - Reason: Dashboard data display matching dashboard.html overview tab, with loading/empty states

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3 (with Tasks 14, 15, 16, 17)
  - **Blocks**: Task 19, 20
  - **Blocked By**: Tasks 10, 11, 12

  **References**:
  - `design/dashboard.html` — Overview tab: stats cards, activity log, subdomain preview
  - `design/brand-spec.md` — Token values for stat card styling
  - Task 10 (API routes) — activity log endpoint
  - Task 12 (Dashboard layout) — layout wrapper

  **Acceptance Criteria**:

  **QA Scenarios**:

  ```
  Scenario: Overview shows stats cards with correct data
    Tool: Playwright
    Preconditions: authenticated user with 2 subdomains
    Steps:
      1. Navigate to /dashboard/overview
      2. Assert "Total Subdomain" shows "2"
      3. Assert "Sisa Klaim" shows "1 dari 3"
      4. Assert "Pengunjung (30 hari)" shows "Segera hadir" badge
    Expected Result: Stats reflect user's actual data
    Evidence: .sisyphus/evidence/task-13-stats.png

  Scenario: Activity log shows recent entries
    Tool: Playwright
    Preconditions: user has activity log entries
    Steps:
      1. Navigate to /dashboard/overview
      2. Assert activity log section visible
      3. Assert at least 1 entry with action text and relative timestamp
    Expected Result: Activity log renders correctly
    Evidence: .sisyphus/evidence/task-13-activity.png

  Scenario: Empty state when no subdomains
    Tool: Playwright
    Preconditions: new user with 0 subdomains
    Steps:
      1. Navigate to /dashboard/overview
      2. Assert empty state message visible
      3. Assert CTA link to claim page exists
    Expected Result: Empty state rendered correctly
    Evidence: .sisyphus/evidence/task-13-empty.png
  ```

  **Evidence to Capture**:
  - [ ] Stats cards screenshot
  - [ ] Activity log screenshot
  - [ ] Empty state screenshot

  **Commit**: YES (groups with Wave 3)

- [ ] 14. **Subdomain list & management page**

  **What to do**:
  - Create `app/dashboard/subdomain/page.tsx`:
    - Fetch user's subdomains from API
    - Display in a Table component with columns:
      - Nama (subdomain name + full domain, e.g., "test-01.lapak.click")
      - Status (badge: active=green, pending=yellow, suspended=red)
      - SSL (badge: active=green, unavailable=gray)
      - Target (where it points)
      - Dibuat (created date, formatted)
      - Aksi (actions dropdown: Kelola DNS, Edit, Hapus)
    - Search/filter input (filter by name)
    - Loading skeleton table
    - Empty state: "Belum ada subdomain. Klaim sekarang!" with CTA button → /dashboard/subdomain/claim
    - Row click navigates to DNS management for that subdomain
    - Delete confirmation modal before deletion
  - Create `app/api/subdomains/[id]/route.ts` enhancements:
    - DELETE: cascade delete DNS records from DB + Cloudflare
    - PATCH: update target, status

  **Must NOT do**:
  - No bulk operations (select all, batch delete)
  - No pagination for MVP (show all, limited to max 3 anyway)
  - No export functionality

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
  - **Skills**: []
  - Reason: Data table with status badges, actions dropdown, and CRUD interactions

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3 (with Tasks 13, 15, 16, 17)
  - **Blocks**: Task 19, 20
  - **Blocked By**: Tasks 10, 11, 12

  **References**:
  - `design/dashboard.html` — Subdomain table, status badges, actions dropdown
  - Task 3 (UI components) — Table, Badge, Modal, EmptyState components
  - Task 10 (API routes) — subdomain CRUD endpoints

  **Acceptance Criteria**:

  **QA Scenarios**:

  ```
  Scenario: Subdomain list shows user's subdomains
    Tool: Playwright
    Preconditions: authenticated user with 2 subdomains
    Steps:
      1. Navigate to /dashboard/subdomain
      2. Assert table visible with 2 rows
      3. Assert columns: Nama, Status, SSL, Target, Dibuat, Aksi
      4. Assert first subdomain name ends with ".lapak.click"
    Expected Result: Subdomain list displays correctly
    Evidence: .sisyphus/evidence/task-14-list.png

  Scenario: Subdomain deletion works
    Tool: Playwright
    Preconditions: authenticated user with 1 subdomain
    Steps:
      1. Click "Hapus" action on a subdomain
      2. Assert confirmation modal appears
      3. Click confirm delete
      4. Assert subdomain removed from list
      5. Assert empty state shown (or count decreased)
    Expected Result: Subdomain deleted with confirmation
    Evidence: .sisyphus/evidence/task-14-delete.png

  Scenario: Search/filter filters subdomains
    Tool: Playwright
    Preconditions: user has 2+ subdomains with different names
    Steps:
      1. Type in search input
      2. Assert table filters to matching subdomains only
    Expected Result: Search filters subdomain list
    Evidence: .sisyphus/evidence/task-14-search.png
  ```

  **Evidence to Capture**:
  - [ ] Subdomain list screenshot
  - [ ] Delete confirmation modal screenshot
  - [ ] Search filter evidence

  **Commit**: YES (groups with Wave 3)

- [ ] 15. **Claim subdomain page** (with Cloudflare integration)

  **What to do**:
  - Create `app/dashboard/subdomain/claim/page.tsx`:
    - Form with fields:
      - Subdomain name input with live availability check (debounced, 500ms)
        - Shows inline validation: available (green check), unavailable (red X), invalid format
        - Validates: 3-63 chars, lowercase alphanumeric + hyphens, no double hyphens, no start/end with hyphen
      - Target input: where DNS points (IP address or hostname)
      - Record type selector: A, AAAA, CNAME (default: A)
      - TTL input (default: 120)
    - Submit button: "Klaim Subdomain" with loading state
    - On success: show success message with CTA to manage DNS
    - Error handling: duplicate name, over limit, invalid target, Cloudflare API failure
    - Show remaining claims counter on page: "Sisa klaim: 2 dari 3"
    - If user has reached limit: show message "Kamu sudah mencapai batas klaim" with upgrade prompt (generic "Tingkatkan akun" without payment logic)
  - Integration with Cloudflare:
    - On claim, create A record pointing to user's target via Cloudflare API
    - Store Cloudflare record ID in subdomains table
    - Log activity "Subdomain claimed"

  **Must NOT do**:
  - NO template website dropdown (removed per scope)
  - NO file upload
  - NO custom domain option
  - NO premium upgrade logic (just informational message)

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
  - **Skills**: []
  - Reason: Complex form with live availability checking, validation, and Cloudflare integration

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3 (with Tasks 13, 14, 16, 17)
  - **Blocks**: Task 19, 20
  - **Blocked By**: Tasks 7, 10, 11, 12

  **References**:
  - `design/dashboard.html` — Claim form section (domain input, target, type selector)
  - Task 7 (Cloudflare client) — DNS record creation
  - Task 10 (API routes) — subdomain CRUD, availability check endpoint
  - Task 11 (API routes) — DNS CRUD validation

  **Acceptance Criteria**:

  **QA Scenarios**:

  ```
  Scenario: Claim form validates subdomain name format
    Tool: Playwright
    Preconditions: authenticated user with < 3 subdomains
    Steps:
      1. Navigate to /dashboard/subdomain/claim
      2. Type "INVALID_NAME!" in subdomain input
      3. Assert validation error: only lowercase letters, numbers, and hyphens
      4. Type "my-valid-subdomain"
      5. Assert validation passes
    Expected Result: Subdomain name validation works
    Evidence: .sisyphus/evidence/task-15-validation.png

  Scenario: Live availability check shows available/unavailable
    Tool: Playwright
    Preconditions: existing subdomain "taken-name"
    Steps:
      1. Type "taken-name" in input
      2. Wait for debounce (600ms)
      3. Assert red X and "Tidak tersedia" message
      4. Type "unique-name-123"
      5. Wait for debounce
      6. Assert green check and "Tersedia" message
    Expected Result: Live availability check works
    Evidence: .sisyphus/evidence/task-15-availability.png

  Scenario: Successful subdomain claim
    Tool: Playwright
    Preconditions: authenticated user with < 3 subdomains
    Steps:
      1. Enter valid available name
      2. Enter target "192.0.2.1"
      3. Click "Klaim Subdomain"
      4. Assert success message
      5. Assert redirect or link to manage DNS
      6. Assert subdomain appears in subdomain list
    Expected Result: Subdomain claimed successfully, DNS record created
    Evidence: .sisyphus/evidence/task-15-claim-success.png

  Scenario: Block claim when over limit
    Tool: Playwright
    Preconditions: user already has 3 subdomains
    Steps:
      1. Navigate to /dashboard/subdomain/claim
      2. Assert message "Kamu sudah mencapai batas klaim"
      3. Assert form disabled or submit blocked
    Expected Result: Limit enforcement UI works
    Evidence: .sisyphus/evidence/task-15-limit.png
  ```

  **Evidence to Capture**:
  - [ ] Validation screenshot
  - [ ] Availability check screenshots (available + unavailable)
  - [ ] Success claim screenshot
  - [ ] Limit reached screenshot
  - [ ] Cloudflare API evidence

  **Commit**: YES (groups with Wave 3)

- [ ] 16. **DNS management page** (with Cloudflare CRUD)

  **What to do**:
  - Create `app/dashboard/dns/page.tsx`:
    - Subdomain selector dropdown (user picks which subdomain to manage)
    - Loading state while fetching
    - Empty state when user has no subdomains
  - Create `app/dashboard/dns/[subdomainId]/page.tsx` (or use query params):
    - DNS records table with columns: Type, Name, Value, TTL, Priority (for MX), Aksi
    - "Tambah Record" button → opens modal/form
    - Add DNS record form in modal:
      - Type dropdown: A, AAAA, CNAME, MX, TXT, NS
      - Name input (default: @)
      - Value input (validated per type — IP for A/AAAA, domain for CNAME, etc.)
      - TTL input (default: 120)
      - Priority input (only for MX)
    - Edit record: inline or modal with pre-filled values
    - Delete record: confirmation modal
    - All operations sync to Cloudflare API via server routes
    - Loading states for table and modal operations
    - Error handling: API failure notification via Toast
    - Info text: "DNS tersebar dalam 5-10 menit"

  **Must NOT do**:
  - No DNS zone management (SOA, NS records)
  - No bulk DNS operations
  - No DNSSEC management
  - No import/export zone files

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
  - **Skills**: []
  - Reason: CRUD interface matching dashboard.html DNS tab with Cloudflare API integration

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3 (with Tasks 13, 14, 15, 17)
  - **Blocks**: Task 19, 20
  - **Blocked By**: Tasks 7, 10, 11, 12

  **References**:
  - `design/dashboard.html` — DNS management tab: records table, add/edit modal, form fields
  - Task 7 (Cloudflare client) — DNS record CRUD
  - Task 11 (API routes) — DNS CRUD API routes
  - Task 3 (UI components) — Modal, Table, Input, Button, Toast

  **Acceptance Criteria**:

  **QA Scenarios**:

  ```
  Scenario: DNS records table shows subdomain records
    Tool: Playwright
    Preconditions: authenticated user with subdomain having 2 DNS records
    Steps:
      1. Navigate to /dashboard/dns
      2. Select subdomain from dropdown
      3. Assert table shows 2 records with Type, Name, Value, TTL columns
    Expected Result: DNS records displayed
    Evidence: .sisyphus/evidence/task-16-dns-list.png

  Scenario: Add DNS record via modal
    Tool: Playwright
    Preconditions: subdomain selected
    Steps:
      1. Click "Tambah Record"
      2. Assert modal opens
      3. Select Type: A, Name: "@", Value: "203.0.113.1"
      4. Click submit
      5. Assert modal closes
      6. Assert new record appears in table
    Expected Result: DNS record added and synced to Cloudflare
    Evidence: .sisyphus/evidence/task-16-add-record.png

  Scenario: Delete DNS record with confirmation
    Tool: Playwright
    Preconditions: record exists
    Steps:
      1. Click delete on a record
      2. Assert confirmation modal
      3. Click confirm
      4. Assert record removed from table
    Expected Result: DNS record deleted from DB + Cloudflare
    Evidence: .sisyphus/evidence/task-16-delete-record.png

  Scenario: Validation rejects invalid record values
    Tool: Playwright
    Preconditions: modal open
    Steps:
      1. Select Type: A
      2. Enter invalid IP "999.999.999.999" as value
      3. Assert validation error message
      4. Submit button disabled or shows error
    Expected Result: DNS value validation works
    Evidence: .sisyphus/evidence/task-16-validation.png
  ```

  **Evidence to Capture**:
  - [ ] DNS records table screenshot
  - [ ] Add record modal screenshot
  - [ ] Delete confirmation screenshot
  - [ ] Validation error screenshot

  **Commit**: YES (groups with Wave 3)

- [ ] 17. **Settings page** — profile, security, delete account

  **What to do**:
  - Create `app/dashboard/settings/page.tsx`:
    - **Profile Section**:
      - Display: Name, Email (read-only, from Supabase auth)
      - Edit Name field + "Simpan" button
      - Update via Supabase Auth updateUser API
    - **Security Section**:
      - "Ubah Password" form: current password, new password, confirm new password
      - Update via Supabase Auth updateUser API
      - Password validation: min 8 chars
      - Success toast
      - Error handling: wrong current password, weak password
    - **Akun Section**:
      - Danger zone with red border
      - "Hapus Akun" button with double confirmation modal
        - First modal: warning with consequences (all subdomains, DNS records deleted)
        - Second modal: type "HAPUS" to confirm
      - Delete account logic:
        1. Delete all Cloudflare DNS records for user's subdomains
        2. Delete all subdomains from DB
        3. Delete all activity logs
        4. Delete user from auth.users
        5. Sign out
    - Loading states for save operations
    - Error states for failed operations

  **Must NOT do**:
  - No email change functionality (email is tied to auth provider)
  - No 2FA/MFA setup
  - No API token management
  - No notification preferences

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
  - **Skills**: []
  - Reason: Settings form matching dashboard.html design with sensitive account operations

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3 (with Tasks 13, 14, 15, 16)
  - **Blocks**: Task 19, 20
  - **Blocked By**: Tasks 6, 10, 12

  **References**:
  - `design/dashboard.html` — Settings tab: profile form, security section, delete account
  - Supabase Auth updateUser: https://supabase.com/docs/reference/javascript/auth-updateuser
  - Task 6 (Auth setup) — server client for admin operations
  - Task 7 (Cloudflare client) — cleanup DNS records on account deletion

  **Acceptance Criteria**:

  **QA Scenarios**:

  ```
  Scenario: Settings page shows profile info
    Tool: Playwright
    Preconditions: authenticated user
    Steps:
      1. Navigate to /dashboard/settings
      2. Assert name field shows user's name
      3. Assert email field shows user's email (read-only)
    Expected Result: Profile info displayed
    Evidence: .sisyphus/evidence/task-17-profile.png

  Scenario: Password change validates correctly
    Tool: Playwright
    Preconditions: authenticated user
    Steps:
      1. Navigate to /dashboard/settings
      2. Enter current password
      3. Enter new password (min 8 chars)
      4. Enter confirm password (mismatch)
      5. Assert validation error "Password tidak cocok"
      6. Fix confirm password
      7. Click "Simpan" — expect success toast
    Expected Result: Password change works with validation
    Evidence: .sisyphus/evidence/task-17-password.png

  Scenario: Delete account requires double confirmation
    Tool: Playwright
    Preconditions: authenticated user with subdomains
    Steps:
      1. Click "Hapus Akun"
      2. Assert first warning modal appears
      3. Click "Lanjutkan"
      4. Assert second modal with "HAPUS" text input
      5. Type wrong text — assert submit disabled
      6. Type "HAPUS" — assert submit enabled
      7. Click confirm — assert redirect to /login
    Expected Result: Account deletion requires double confirmation
    Evidence: .sisyphus/evidence/task-17-delete-account.png
  ```

  **Evidence to Capture**:
  - [ ] Profile section screenshot
  - [ ] Password change screenshot
  - [ ] Delete account modals screenshots

  **Commit**: YES (groups with Wave 3)

- [ ] 18. **Landing page availability check integration**

  **What to do**:
  - Wire the availability check input in the Hero section to the real API:
    - On input change (debounced 500ms), call `POST /api/subdomains/check`
    - Display inline result below input:
      - Available: green text "Tersedia!" + checkmark
      - Unavailable: red text "Sudah digunakan" + X icon
      - Loading: spinner during API call
    - Show full domain preview: `{name}.lapak.click`
    - Show CTA: "Klaim Sekarang" button (only when available) → /register or /login
      - If user is authenticated → /dashboard/subdomain/claim
      - If user is not authenticated → /register
    - Handle network errors gracefully (timeout, server error)
  - Ensure the Hero component from Task 8 accepts the wired check component
  - Add Zod validation same as claim form: 3-63 chars, lowercase alphanumeric + hyphens

  **Must NOT do**:
  - No client-side simulation of availability
  - No rate-limit bypass on frontend

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
  - **Skills**: []
  - Reason: UI integration with debounced API calls and dynamic state changes

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 4 (with Tasks 19, 20, 21)
  - **Blocks**: Final Wave
  - **Blocked By**: Tasks 8, 11 (needs landing page hero + availability API)

  **References**:
  - Task 8 (Landing page) — Hero component that needs the check wired in
  - Task 10 (API routes) — availability check endpoint
  - `design/index.html` — Hero section: the check form design

  **Acceptance Criteria**:

  **QA Scenarios**:

  ```
  Scenario: Availability check shows available domain
    Tool: Playwright
    Preconditions: dev server running, no subdomain "my-biz" exists
    Steps:
      1. Navigate to http://localhost:3000
      2. Type "my-biz" in availability input
      3. Wait for debounce (600ms)
      4. Assert green text "Tersedia!" visible
      5. Assert "my-biz.lapak.click" preview visible
      6. Assert "Klaim Sekarang" button visible
    Expected Result: Available domain shown with green indicator
    Evidence: .sisyphus/evidence/task-18-available.png

  Scenario: Availability check shows unavailable domain
    Tool: Playwright
    Preconditions: subdomain "taken-name" exists in DB
    Steps:
      1. Type "taken-name" in input
      2. Wait for debounce
      3. Assert red text "Sudah digunakan" visible
    Expected Result: Unavailable domain shown with red indicator
    Evidence: .sisyphus/evidence/task-18-unavailable.png

  Scenario: "Klaim Sekarang" redirects unauthenticated user to /register
    Tool: Playwright
    Preconditions: no active session, available subdomain found
    Steps:
      1. Type available name
      2. Click "Klaim Sekarang" button
      3. Assert redirected to /register
    Expected Result: Unauthenticated users sent to register
    Evidence: .sisyphus/evidence/task-18-redirect-unauthed.png

  Scenario: Invalid subdomain name shows error
    Tool: Playwright
    Preconditions: landing page loaded
    Steps:
      1. Type "MY-SHOP!!!" in input
      2. Assert validation error (capital letters and special chars not allowed)
    Expected Result: Invalid format shown with error
    Evidence: .sisyphus/evidence/task-18-invalid.png
  ```

  **Evidence to Capture**:
  - [ ] Available domain screenshot
  - [ ] Unavailable domain screenshot
  - [ ] Redirect screenshot
  - [ ] Invalid format screenshot

  **Commit**: YES (groups with Wave 4)

- [ ] 19. **DNS-only copy rewrite across all pages**

  **What to do**:
  - Review EVERY page and component for file hosting / template / upload references:
    - **Landing page**: Hero headline/subheadline, Features cards, HowItWorks steps, FAQ answers, CTA text
    - **Claim form**: Remove "Template Website" dropdown entirely, replace with note: "Arahkan subdomain ke hosting Anda"
    - **Dashboard**: Any reference to templates, file uploads, website builder
    - **Settings**: Any reference to templates
  - Specific copy changes:
    - Hero: Remove "Upload file website Anda", replace with "Arahkan subdomain ke hosting Anda"
    - HowItWorks Step 3: "Upload file website" → "Arahkan ke hosting Anda"
    - HowItWorks Step 4: Remove "DNS otomatis terkonfigurasi" implications → "Selesai! Subdomain siap digunakan"
    - FAQ: SSL answer → "SSL disediakan oleh hosting Anda. Pastikan hosting Anda mendukung HTTPS"
    - Feature cards: Remove file hosting claims → focus on DNS management
    - Claim form: Remove template dropdown, replace with target input + info text
    - Any mention of "template", "upload", "file hosting" → remove or replace
  - Ensure all copy is in Bahasa Indonesia only
  - Proofread for consistency: tone, terminology, clarity

  **Must NOT do**:
  - No English copy
  - No contradicting the DNS-only service model

  **Recommended Agent Profile**:
  - **Category**: `writing`
  - **Skills**: []
  - Reason: Copy editing across all pages, requires understanding of DNS-only model and Indonesian language

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 4 (with Tasks 18, 20, 21)
  - **Blocks**: Final Wave
  - **Blocked By**: Tasks 8, 9, 13-17

  **References**:
  - `design/index.html` — Original copy that needs revision
  - `design/dashboard.html` — Claim form template dropdown
  - Tasks 8, 9, 13-17 — All pages that need copy review
  - Interview decisions — DNS-only scope definition

  **Acceptance Criteria**:

  **QA Scenarios**:

  ```
  Scenario: No "upload" or "template" keywords on landing page
    Tool: Bash (grep)
    Preconditions: landing page components exist
    Steps:
      1. Grep for "upload" in components/landing/ — 0 matches (case insensitive)
      2. Grep for "template" in components/landing/ — 0 matches (case insensitive)
    Expected Result: No file hosting references on landing page
    Evidence: .sisyphus/evidence/task-19-no-upload.txt

  Scenario: No template dropdown in claim form
    Tool: Bash (grep)
    Preconditions: claim page exists
    Steps:
      1. Grep for "template" in app/dashboard/subdomain/claim/ — 0 matches
      2. Grep for "Template" in any file under dashboard/ — 0 matches
    Expected Result: No template references in claim flow
    Evidence: .sisyphus/evidence/task-19-no-template.txt

  Scenario: FAQ mentions DNS-only model consistently
    Tool: Playwright
    Preconditions: landing page loaded
    Steps:
      1. Navigate to http://localhost:3000
      2. Open FAQ accordions
      3. Assert no answer mentions file hosting or upload
      4. Assert SSL answer mentions "hosting Anda"
    Expected Result: FAQ consistent with DNS-only model
    Evidence: .sisyphus/evidence/task-19-faq-consistency.png
  ```

  **Evidence to Capture**:
  - [ ] Grep output confirming no prohibited keywords
  - [ ] FAQ page screenshot
  - [ ] Landing page copy screenshot

  **Commit**: YES (groups with Wave 4)

- [ ] 20. **Responsive QA & polish pass**

  **What to do**:
  - Test and fix responsive behavior across ALL 9 viewports from DESIGN-MANIFEST.json:
    - 390px (mobile narrow)
    - 430px (mobile wide)
    - 768px (tablet portrait)
    - 820px (tablet wide)
    - 900px (sidebar collapse breakpoint)
    - 1024px (tablet landscape / small desktop)
    - 1280px (desktop)
    - 1440px (desktop wide)
    - 1920px (desktop HD)
  - For each viewport, verify:
    - No horizontal scroll
    - Text is readable (no overflow, appropriate font size)
    - Navigation works (hamburger on mobile, sidebar on desktop)
    - All interactive elements tappable (min 44px touch targets on mobile)
    - Forms usable (inputs not cut off, buttons visible)
    - Tables scrollable horizontally on small screens
    - Images/icons sized appropriately
  - Specific fixes:
    - Dashboard: sidebar collapse at 900px
    - Landing page: features grid 2x2 → 1x1 at 768px
    - Landing page: hero CTA buttons stack on mobile
    - Tables: add horizontal scroll wrapper for small screens
    - Navigation: hamburger menu full-screen overlay on mobile
  - Add `viewport` meta tag in layout
  - Use Tailwind responsive prefixes consistently

  **Must NOT do**:
  - No changing the design system
  - No adding new components
  - No breaking existing functionality

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
  - **Skills**: []
  - Reason: Cross-viewport visual QA and fixes

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 4 (with Tasks 18, 19, 21)
  - **Blocks**: Final Wave
  - **Blocked By**: All Wave 1-3 tasks (needs all pages built)

  **References**:
  - `design/DESIGN-MANIFEST.json` — Viewport matrix with exact dimensions
  - `design/DESIGN-HANDOFF.md` — Responsive implementation instructions

  **Acceptance Criteria**:

  **QA Scenarios**:

  ```
  Scenario: Landing page responsive at 390px
    Tool: Playwright
    Preconditions: dev server running
    Steps:
      1. Set viewport to 390x844
      2. Navigate to http://localhost:3000
      3. Assert no horizontal scroll (window.scrollX === 0)
      4. Assert hamburger menu visible
      5. Assert navigation links hidden (off-canvas)
      6. Assert features section is 1 column
      7. Assert CTA buttons stacked vertically
    Expected Result: Mobile layout correct
    Evidence: .sisyphus/evidence/task-20-responsive-390.png

  Scenario: Dashboard sidebar collapses at 800px
    Tool: Playwright
    Preconditions: authenticated
    Steps:
      1. Set viewport to 800x900
      2. Navigate to /dashboard/overview
      3. Assert sidebar nav items hidden
      4. Assert hamburger icon visible
      5. Click hamburger
      6. Assert off-canvas sidebar slides in
    Expected Result: Sidebar collapses at mobile breakpoint
    Evidence: .sisyphus/evidence/task-20-sidebar-collapse.png

  Scenario: Landing page responsive at 1440px
    Tool: Playwright
    Preconditions: dev server running
    Steps:
      1. Set viewport to 1440x900
      2. Navigate to http://localhost:3000
      3. Assert navigation links visible (no hamburger)
      4. Assert features grid is 2x2
      5. Assert no layout issues
    Expected Result: Desktop layout correct
    Evidence: .sisyphus/evidence/task-20-responsive-1440.png
  ```

  **Evidence to Capture**:
  - [ ] Screenshots at 390px, 768px, 900px, 1440px, 1920px
  - [ ] Sidebar collapse test evidence
  - [ ] Horizontal scroll check results

  **Commit**: YES (groups with Wave 4)

- [ ] 21. **SEO meta tags, OG images, favicon**

  **What to do**:
  - Create `app/layout.tsx` update with global metadata:
    - Title: "lapak.click — Domain gratis untuk UMKM Indonesia"
    - Description: "Dapatkan subdomain gratis .lapak.click untuk website UMKM kamu. Kelola DNS dengan mudah, 100% gratis."
  - Create `app/metadata.ts` with generateMetadata function:
    - Open Graph tags (og:title, og:description, og:image, og:url)
    - Twitter Card tags (twitter:card, twitter:title, twitter:description)
  - Create landing page OG image:
    - Simple purple background with logo and tagline
    - Saved as `public/og-image.png` (1200x630px)
  - Create `public/favicon.ico` and `public/favicon.svg`
  - Create `public/apple-icon.png` (180x180px)
  - Add `manifest.json` for PWA basics (name, short_name, icons, theme_color)
  - Update root layout with all meta tags
  - Add `robots.txt` (allow all for now)
  - Add `sitemap.ts` with basic sitemap (just landing page and static pages)

  **Must NOT do**:
  - No SEO for dashboard pages (they're behind auth — noindex)
  - No structured data/JSON-LD for MVP
  - No analytics/tracking scripts

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []
  - Reason: Standard SEO setup — well-defined, minimal decisions

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 4 (with Tasks 18, 19, 20)
  - **Blocks**: Final Wave
  - **Blocked By**: Task 8 (needs landing page title/description)

  **References**:
  - Next.js Metadata API: https://nextjs.org/docs/app/building-your-application/optimizing/metadata
  - Open Graph protocol: https://ogp.me/
  - `design/brand-spec.md` — Brand colors for OG image

  **Acceptance Criteria**:

  **QA Scenarios**:

  ```
  Scenario: Landing page has correct meta tags
    Tool: Playwright
    Preconditions: dev server running
    Steps:
      1. Navigate to http://localhost:3000
      2. Check document title contains "lapak.click"
      3. Check meta description contains "subdomain gratis"
      4. Check og:title meta tag exists
    Expected Result: Meta tags present and correct
    Evidence: .sisyphus/evidence/task-21-meta-tags.txt

  Scenario: OG image exists
    Tool: Bash
    Preconditions: project built
    Steps:
      1. ls public/og-image.png — file exists
      2. Check file is ≥ 10KB (not a placeholder)
    Expected Result: OG image in place
    Evidence: .sisyphus/evidence/task-21-og-image.txt

  Scenario: Favicon loads
    Tool: Playwright
    Preconditions: dev server running
    Steps:
      1. Navigate to http://localhost:3000
      2. Check <link rel="icon"> exists
      3. Fetch /favicon.ico — assert 200
    Expected Result: Favicon loads
    Evidence: .sisyphus/evidence/task-21-favicon.txt

  Scenario: robots.txt and sitemap accessible
    Tool: Bash (curl)
    Preconditions: dev server running
    Steps:
      1. curl http://localhost:3000/robots.txt — assert 200
      2. curl http://localhost:3000/sitemap.xml — assert 200 or valid response
    Expected Result: SEO files accessible
    Evidence: .sisyphus/evidence/task-21-seo-files.txt
  ```

  **Evidence to Capture**:
  - [ ] Meta tag HTML output
  - [ ] OG image file info
  - [ ] robots.txt/sitemap content

  **Commit**: YES (groups with Wave 4)

---

## Final Verification Wave

> 4 review agents run in PARALLEL. ALL must APPROVE. Present consolidated results to user and get explicit "okay" before completing.

- [ ] F1. **Plan Compliance Audit** — `oracle`
  Read the plan end-to-end. For each "Must Have": verify implementation exists (read file, curl endpoint, run command). For each "Must NOT Have": search codebase for forbidden patterns — reject with file:line if found. Check evidence files exist in .sisyphus/evidence/. Compare deliverables against plan.
  Output: `Must Have [N/N] | Must NOT Have [N/N] | Tasks [N/N] | VERDICT: APPROVE/REJECT`

- [ ] F2. **Code Quality Review** — `unspecified-high`
  Run `tsc --noEmit` + linter + `bun test` or equivalent. Review all changed files for: `as any`/`@ts-ignore`, empty catches, `console.log` in prod, commented-out code, unused imports. Check AI slop: excessive comments, over-abstraction, generic names (data/result/item/temp).
  Output: `Build [PASS/FAIL] | Lint [PASS/FAIL] | Tests [N pass/N fail] | Files [N clean/N issues] | VERDICT`

- [ ] F3. **Real Manual QA** — `unspecified-high` (+ `playwright` skill)
  Start from clean state. Execute EVERY QA scenario from EVERY task — follow exact steps, capture evidence. Test cross-task integration (features working together, not isolation). Test edge cases: empty state, invalid input, rapid actions. Save to `.sisyphus/evidence/final-qa/`.
  Output: `Scenarios [N/N pass] | Integration [N/N] | Edge Cases [N tested] | VERDICT`

- [ ] F4. **Scope Fidelity Check** — `deep`
  For each task: read "What to do", read actual diff (git log/diff). Verify 1:1 — everything in spec was built (no missing), nothing beyond spec was built (no creep). Check "Must NOT do" compliance. Detect cross-task contamination: Task N touching Task M's files. Flag unaccounted changes.
  Output: `Tasks [N/N compliant] | Contamination [CLEAN/N issues] | Unaccounted [CLEAN/N files] | VERDICT`

---

## Commit Strategy

- **Wave 1** (Tasks 1-7): `feat(init): project scaffolding, design tokens, UI components, database, auth, Cloudflare client`
- **Wave 2** (Tasks 8-11): `feat(public): landing page, auth pages, RLS policies, API routes`
- **Wave 3** (Tasks 12-17): `feat(dashboard): overview, subdomains, claim, DNS management, settings`
- **Wave 4** (Tasks 18-21): `feat(polish): availability check, copy rewrite, responsive, SEO`

---

## Success Criteria

### Verification Commands
```bash
# App runs
npm run dev          # opens on localhost:3000
npm run build        # builds without errors

# Tests pass
npm run test         # vitest unit tests pass
npx playwright test  # E2E scenarios pass

# Lint
npm run lint         # no warnings

# TypeScript
npx tsc --noEmit     # no type errors
```

### Final Checklist
- [ ] Landing page hero shows DNS-only copy (no file hosting mentions)
- [ ] Availability checker queries Supabase in real time
- [ ] User can register, login (email + Google OAuth), reset password
- [ ] Dashboard loads with sidebar navigation, 5 tabs active
- [ ] User can claim a subdomain — creates DNS records via Cloudflare API
- [ ] User limited to 3 subdomains (4th claim blocked with message)
- [ ] User can add/edit/delete DNS records via Cloudflare API
- [ ] Subdomain name validation enforces lowercase alphanumeric + hyphens
- [ ] Responsive layout works at 390px, 768px, 1440px
- [ ] RLS prevents user A from seeing user B's subdomains
- [ ] Cloudflare API keys never exposed to client-side code
- [ ] All evidence files saved in .sisyphus/evidence/
- [ ] All F1-F4 reviewers approve
- [ ] User explicitly confirms "okay" after final review
