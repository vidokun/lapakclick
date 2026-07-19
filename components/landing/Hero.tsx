"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, CheckCircle, Loader2, Search, XCircle } from "lucide-react";
import { motion } from "framer-motion";
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
    <section className="relative overflow-hidden pt-24 pb-12 sm:pt-32 sm:pb-24" id="beranda">
      {/* Animated Glow Background */}
      <div
        className="pointer-events-none absolute -top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/3 animate-pulse-slow"
        aria-hidden="true"
      >
        <div className="w-[800px] h-[800px] rounded-full bg-gradient-radial from-accent/25 to-transparent opacity-40 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-8 items-center">
          
          {/* LEFT COLUMN: Copy & CTA */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-left"
          >
            <div className="inline-block mb-6 px-3 py-1.5 rounded-4 text-accent font-mono text-[0.75rem] uppercase tracking-[0.1em] border border-accent/30 bg-accent/5 opacity-0 animate-fade-in-up">
              Gratis · 1 Menit · Sepuasnya
            </div>

            <h1 className="font-display font-bold text-fg mb-5 text-[clamp(2.5rem,5vw,4.5rem)] tracking-[-0.03em] leading-[1.1] max-w-[600px] opacity-0 animate-fade-in-up-delay-1">
              Bikin website UMKM tampil <span className="text-accent">profesional.</span>
            </h1>

            <p className="text-fg-2 max-w-[500px] mb-8 text-[clamp(1rem,1.5vw,1.25rem)] leading-relaxed opacity-0 animate-fade-in-up-delay-2">
              Dapatkan subdomain <code className="font-mono text-accent bg-accent/10 px-1.5 py-0.5 rounded-4 text-[0.9em]">namausaha.lapak.click</code> gratis. Arahkan ke hosting favorit kamu — tanpa ribet, tanpa biaya tersembunyi.
            </p>

            <div className="flex flex-wrap items-center gap-4 opacity-0 animate-fade-in-up-delay-3">
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 rounded-4 font-body font-medium whitespace-nowrap transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg px-7 py-3.5 text-base bg-accent text-bg hover:bg-accent-gl hover:shadow-[0_0_20px_rgba(139,92,246,0.4)] active:bg-accent-dim active:scale-95"
              >
                Klaim Sekarang
                <ArrowRight size={18} />
              </Link>
              <Link
                href="#fitur"
                className="inline-flex items-center justify-center gap-2 rounded-4 font-body font-medium whitespace-nowrap transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg px-7 py-3.5 text-base bg-transparent text-fg hover:text-accent hover:bg-surface-2 active:bg-surface border border-border"
              >
                Pelajari Dulu
              </Link>
            </div>
          </motion.div>

          {/* RIGHT COLUMN: Interactive Checker & Stats */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="w-full max-w-[540px] mx-auto lg:ml-auto opacity-0 animate-fade-in-up-delay-4"
          >
            
            {/* Checker Card */}
            <div className="rounded-8 border border-border bg-surface/50 backdrop-blur-md p-6 sm:p-8 shadow-2xl shadow-accent/5">
              <h3 className="font-display font-semibold text-lg text-fg mb-4">
                Cek Ketersediaan Subdomain
              </h3>
              
              <div className="flex flex-col sm:flex-row overflow-hidden rounded-4 border border-border bg-bg focus-within:border-accent focus-within:ring-1 focus-within:ring-accent transition-all duration-200">
                <div className="flex flex-1 items-center px-4 py-3 sm:py-0 min-h-[3.25rem]">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    placeholder="namausaha"
                    className="min-w-0 flex-1 bg-transparent text-base font-mono text-fg outline-none placeholder:text-muted/60"
                    autoComplete="off"
                    spellCheck="false"
                    maxLength={63}
                    aria-label="Nama subdomain"
                  />
                  <span className="hidden sm:inline-block ml-2 font-mono text-sm text-muted shrink-0">
                    .lapak.click
                  </span>
                </div>
                
                <button
                  type="button"
                  onClick={() => {
                    if (state.status === "available") {
                      handleClaimClick();
                    }
                  }}
                  disabled={state.status === "loading"}
                  className="bg-accent px-6 py-3 sm:py-0 min-h-[3.25rem] text-sm font-semibold text-bg transition-colors hover:bg-accent-gl disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center shrink-0 border-t sm:border-t-0 sm:border-l border-accent/20"
                >
                  {state.status === "loading" ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : state.status === "available" ? (
                    "Klaim"
                  ) : (
                    <span className="flex items-center gap-2">
                      <Search size={16} />
                      <span className="sm:hidden">Cek</span>
                    </span>
                  )}
                </button>
              </div>

              {/* Status Message */}
              <div className="mt-4 min-h-[2rem] text-sm">
                {state.status === "validating" && inputValue.trim().length > 0 && (
                  <p className="text-negative flex items-start gap-2">
                    <XCircle size={16} className="shrink-0 mt-0.5" />
                    <span>Hanya boleh huruf kecil, angka, dan tanda hubung (-). Maks 63 karakter.</span>
                  </p>
                )}

                {state.status === "loading" && (
                  <div className="flex items-center gap-2 text-muted">
                    <span className="inline-block h-3 w-3 animate-pulse rounded-full bg-accent/50" />
                    <span>Memeriksa ketersediaan...</span>
                  </div>
                )}

                {state.status === "available" && (
                  <div className="flex flex-col gap-1">
                    <p className="flex items-center gap-1.5 text-positive font-medium">
                      <CheckCircle size={16} className="shrink-0" />
                      <span>Tersedia!</span>
                    </p>
                    <p className="font-mono text-sm text-fg-2 opacity-80">
                      {trimmedInput}.lapak.click
                    </p>
                  </div>
                )}

                {state.status === "unavailable" && (
                  <p className="flex items-center gap-1.5 text-negative font-medium">
                    <XCircle size={16} className="shrink-0" />
                    <span>Sudah digunakan oleh UMKM lain</span>
                  </p>
                )}

                {state.status === "error" && (
                  <p className="flex items-center gap-1.5 text-negative">
                    <XCircle size={16} className="shrink-0" />
                    <span>{state.message}</span>
                  </p>
                )}
                
                {state.status === "idle" && !inputValue && (
                  <p className="text-muted/70 flex items-center gap-1.5">
                    <ArrowRight size={14} className="shrink-0" />
                    <span>Ketik nama usahamu tanpa spasi</span>
                  </p>
                )}
              </div>
            </div>

            {/* Stats Bar */}
            <div className="mt-6 grid grid-cols-3 gap-2 sm:gap-4">
              {[
                { number: "2.8k+", label: "Terdaftar" },
                { number: "1.2k+", label: "UMKM Aktif" },
                { number: "99.9%", label: "Uptime" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-8 border border-border/50 bg-surface/30 backdrop-blur-sm p-3 sm:p-4 text-center transition-colors hover:bg-surface/60"
                >
                  <div className="font-display text-lg sm:text-xl font-extrabold text-accent tabular-nums">
                    {stat.number}
                  </div>
                  <div className="mt-1 text-[0.65rem] sm:text-xs text-muted uppercase tracking-wider font-semibold">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

          </motion.div>
        </div>
      </div>
    </section>
  );
}
