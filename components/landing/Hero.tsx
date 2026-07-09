"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, CheckCircle, Loader2, Search, XCircle } from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce";
import { availabilityCheckSchema } from "@/lib/validations";
import { createClient } from "@/lib/supabase/client";

type AvailabilityState =
  | { status: "idle" }
  | { status: "validating" }
  | { status: "loading" }
  | { status: "available" }
  | { status: "unavailable" }
  | { status: "error"; message: string };

export function Hero() {
  const router = useRouter();
  const [inputValue, setInputValue] = useState("");
  const [state, setState] = useState<AvailabilityState>({ status: "idle" });
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const debouncedInput = useDebounce(inputValue, 500);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data }) => {
      setIsAuthenticated(!!data.session);
    });
  }, []);

  useEffect(() => {
    const trimmed = debouncedInput.trim();

    if (!trimmed) {
      setState({ status: "idle" });
      return;
    }

    const parsed = availabilityCheckSchema.safeParse({ name: trimmed });
    if (!parsed.success) {
      setState({ status: "validating" });
      return;
    }

    const controller = new AbortController();
    let cancelled = false;

    setState({ status: "loading" });

    fetch("/api/subdomains/check", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: trimmed }),
      signal: controller.signal,
    })
      .then(async (res) => {
        if (cancelled) return;
        if (!res.ok) {
          const body = await res.json().catch(() => null);
          throw new Error(body?.error?.message || "Terjadi kesalahan");
        }
        const data = await res.json();
        if (cancelled) return;
        setState(
          data.available
            ? { status: "available" }
            : { status: "unavailable" }
        );
      })
      .catch((err) => {
        if (cancelled) return;
        if (err.name === "AbortError") return;
        setState({ status: "error", message: err.message || "Gagal memeriksa ketersediaan" });
      });

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [debouncedInput]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "");
    setInputValue(raw);
  };

  const handleClaimClick = () => {
    const trimmed = inputValue.trim();
    if (!trimmed) return;
    if (isAuthenticated) {
      router.push("/dashboard/subdomain/claim");
    } else {
      router.push("/register");
    }
  };

  const trimmedInput = inputValue.trim();

  return (
    <section className="relative overflow-hidden pt-24 pb-12 sm:pt-28 sm:pb-16 text-center" id="beranda">
      <div
        className="pointer-events-none absolute -top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/3"
        aria-hidden="true"
      >
        <div className="w-[700px] h-[700px] rounded-full bg-gradient-radial from-accent/20 to-transparent opacity-30" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-6">
        <div className="inline-block mb-4 px-3 py-1 rounded-4 text-accent font-mono text-[0.7rem] uppercase tracking-[0.1em] border border-accent/30">
          Gratis · 1 Menit · Sepuasnya
        </div>

        <h1 className="font-display font-bold text-fg mx-auto max-w-[760px] mb-3 text-[clamp(2rem,5vw+0.5rem,4rem)] tracking-[-0.03em] leading-[1.15]">
          Bikin website UMKM kamu profesional dengan{" "}
          <span className="text-accent">domain gratis</span>!
        </h1>

        <p className="text-fg-2 mx-auto max-w-[540px] mb-8 text-[clamp(0.95rem,1.5vw+0.2rem,1.1rem)]">
          Dapatkan subdomain{" "}
          <code className="font-mono text-accent">namausaha.lapak.click</code>{" "}
          gratis dan arahkan ke hosting favorit kamu — tanpa ribet, tanpa biaya.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/register"
            className="inline-flex items-center justify-center gap-2 rounded-4 font-body font-medium whitespace-nowrap transition-all duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg px-6 py-3 text-base bg-accent text-bg hover:bg-accent-gl active:bg-accent-dim"
          >
            Klaim Subdomain Gratis
            <ArrowRight size={18} />
          </Link>
          <Link
            href="#fitur"
            className="inline-flex items-center justify-center gap-2 rounded-4 font-body font-medium whitespace-nowrap transition-all duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg px-6 py-3 text-base bg-transparent text-fg hover:text-accent hover:bg-surface-2 active:bg-surface border border-border"
          >
            Pelajari Lebih Lanjut
          </Link>
        </div>

        <div className="mx-auto mt-8 max-w-[480px]">
          <div className="flex overflow-hidden rounded-8 border border-border bg-surface focus-within:border-accent focus-within:shadow-[0_0_0_3px_rgba(139,92,246,0.15)]">
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              placeholder="Cek ketersediaan nama subdomain..."
              className="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm font-mono text-fg outline-none placeholder:text-muted placeholder:font-body"
              autoComplete="off"
              spellCheck="false"
              maxLength={63}
              aria-label="Nama subdomain"
            />
            <span className="hidden items-center whitespace-nowrap px-2 font-mono text-xs text-muted sm:flex">
              .lapak.click
            </span>
            <button
              type="button"
              onClick={() => {
                if (state.status === "available") {
                  handleClaimClick();
                }
              }}
              disabled={state.status === "loading"}
              className="bg-accent px-5 py-3 text-sm font-semibold text-bg transition-colors hover:bg-accent-gl disabled:opacity-60 disabled:cursor-not-allowed whitespace-nowrap"
            >
              {state.status === "loading" ? (
                <Loader2 size={16} className="animate-spin" />
              ) : state.status === "available" ? (
                "Klaim Sekarang"
              ) : (
                <>
                  <span className="hidden sm:inline">Cek Ketersediaan</span>
                  <span className="inline sm:hidden">
                    <Search size={16} />
                  </span>
                </>
              )}
            </button>
          </div>

          <div className="mt-3 min-h-[1.5rem] text-left text-sm">
            {state.status === "validating" && inputValue.trim().length > 0 && (
              <p className="text-red-400">
                Subdomain hanya boleh berisi huruf kecil, angka, dan tanda hubung (-) (3-63 karakter).
              </p>
            )}

            {state.status === "loading" && (
              <div className="flex items-center gap-2 text-muted">
                <span className="inline-block h-3 w-3 animate-pulse rounded-full bg-accent/50" />
                <span>Memeriksa ketersediaan...</span>
              </div>
            )}

            {state.status === "available" && (
              <div className="space-y-2">
                <p className="flex items-center gap-1.5 text-emerald-400 font-medium">
                  <CheckCircle size={16} className="shrink-0" />
                  <span>Tersedia!</span>
                </p>
                <p className="font-mono text-sm text-fg-2">
                  {trimmedInput}.lapak.click
                </p>
              </div>
            )}

            {state.status === "unavailable" && (
              <p className="flex items-center gap-1.5 text-red-400 font-medium">
                <XCircle size={16} className="shrink-0" />
                <span>Sudah digunakan</span>
              </p>
            )}

            {state.status === "error" && (
              <p className="text-red-400 text-sm">
                {state.message}
              </p>
            )}
          </div>
        </div>

        <div className="mx-auto mt-8 grid max-w-[600px] grid-cols-1 gap-1 sm:grid-cols-3 sm:gap-2">
          {[
            { number: "2,847+", label: "Subdomain terdaftar" },
            { number: "1,230+", label: "UMKM aktif" },
            { number: "99.9%", label: "Uptime" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-8 border border-border bg-surface p-3 text-center"
            >
              <div className="font-display text-xl font-extrabold text-accent tabular-nums sm:text-2xl">
                {stat.number}
              </div>
              <div className="mt-1 text-xs text-muted">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
