# decisions.md

## Auth Infra Files (Task 6 gap fill)

- **`lib/supabase/middleware.ts`** exports `updateSession()` despite `@supabase/ssr` not having this export. The function uses `createServerClient` internally with request/response cookie handling — named `updateSession` for semantic clarity following Supabase docs conventions.
- **`lib/supabase/server.ts`** uses `cookies()` from `next/headers` (async) — for server components, route handlers, and server actions.
- **`lib/supabase/admin.ts`** uses `createClient` from `@supabase/supabase-js` directly (not `@supabase/ssr`) since admin operations bypass RLS and don't need cookie-based session management.
- **Root `middleware.ts`** uses `NextResponse.redirect()` for redirecting unauthenticated users to `/login`, and returns `undefined` (Early return) for public routes instead of calling `updateSession` at all — avoids unnecessary session refresh on public pages.
- **`app/auth/callback/route.ts`** creates a fresh server client inside the handler (not importing from `@/lib/supabase/server`) to avoid circular dependency and keep the handler self-contained. The server client is created with `cookies()` from `next/headers` for cookie-based session persistence.
- **`app/auth/confirm/route.ts`** uses `verifyOtp` with `type as 'signup' | 'email' | 'recovery' | 'invite'` type cast — all Supabase OTP types are covered.
