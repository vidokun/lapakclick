"use client";

import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";

export function Hero() {
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

        <form
          onSubmit={(e) => e.preventDefault()}
          className="mx-auto mt-8 flex max-w-[480px] overflow-hidden rounded-8 border border-border bg-surface focus-within:border-accent focus-within:shadow-[0_0_0_3px_rgba(139,92,246,0.15)]"
        >
          <input
            type="text"
            placeholder="Cek ketersediaan nama subdomain..."
            className="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm font-mono text-fg outline-none placeholder:text-muted placeholder:font-body"
            autoComplete="off"
            spellCheck="false"
          />
          <span className="hidden items-center whitespace-nowrap px-2 font-mono text-xs text-muted sm:flex">
            .lapak.click
          </span>
          <button
            type="submit"
            className="bg-accent px-5 py-3 text-sm font-semibold text-bg transition-colors hover:bg-accent-gl whitespace-nowrap"
          >
            <span className="hidden sm:inline">Cek Ketersediaan</span>
            <span className="inline sm:hidden">
              <Search size={16} />
            </span>
          </button>
        </form>

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
