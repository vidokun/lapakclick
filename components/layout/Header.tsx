"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface HeaderProps {
  /** When true shows landing-page nav items; otherwise dashboard links */
  landing?: boolean;
  className?: string;
}

const navItems = [
  { label: "Beranda", href: "/" },
  { label: "Fitur", href: "/#features" },
  { label: "Cara Kerja", href: "/#how-it-works" },
  { label: "FAQ", href: "/#faq" },
];

export function Header({ landing = true, className }: HeaderProps) {
  const [open, setOpen] = useState(false);

  const close = useCallback(() => {
    setOpen(false);
    document.body.style.overflow = "";
  }, []);

  const toggle = useCallback(() => {
    setOpen((prev) => {
      const next = !prev;
      document.body.style.overflow = next ? "hidden" : "";
      return next;
    });
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) close();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, close]);

  /* Cleanup on unmount */
  useEffect(() => {
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50",
          "bg-bg/85 backdrop-blur-16 border-b border-border",
          className
        )}
      >
        <div className="mx-auto flex items-center gap-4 px-6 py-2 max-w-6xl">
          <Link
            href={landing ? "/" : "/dashboard"}
            className="font-display text-lg font-extrabold text-fg whitespace-nowrap shrink-0"
          >
            lapak<span className="text-accent">.click</span>
          </Link>

          {landing && (
            <nav aria-label="Navigasi utama" className="hidden md:flex items-center gap-1 ml-auto">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm font-body font-medium text-fg-2 px-3 py-1.5 rounded-4 transition-all duration-200 hover:text-fg hover:bg-surface whitespace-nowrap"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          )}

          {landing && (
            <div className="hidden md:flex items-center gap-2">
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 rounded-4 font-body font-medium text-sm whitespace-nowrap transition-all duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg px-4 py-2 bg-transparent text-fg hover:text-accent hover:bg-surface-2 active:bg-surface"
              >
                Masuk
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 rounded-4 font-body font-medium text-sm whitespace-nowrap transition-all duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg px-4 py-2 bg-accent text-bg hover:bg-accent-gl active:bg-accent-dim"
              >
                Daftar
              </Link>
            </div>
          )}

          <button
            type="button"
            onClick={toggle}
            className="md:hidden flex items-center justify-center ml-auto w-11 h-11 p-2 bg-none border border-border rounded-4 text-fg-2 cursor-pointer transition-colors duration-200 hover:border-accent shrink-0 relative z-[60]"
            aria-label={open ? "Tutup menu" : "Buka menu"}
            aria-expanded={open}
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </header>

      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/60 backdrop-blur-sm",
          "transition-opacity duration-300",
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={close}
        aria-hidden="true"
      />

      <aside
        className={cn(
          "fixed top-0 right-0 bottom-0 z-50",
          "w-72 max-w-[80vw] bg-bg border-l border-border",
          "flex flex-col overflow-y-auto",
          "transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
          open ? "translate-x-0" : "translate-x-full"
        )}
        aria-label="Menu navigasi"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <span className="font-display font-extrabold text-lg text-fg whitespace-nowrap">
            lapak<span className="text-accent">.click</span>
          </span>
          <button
            type="button"
            onClick={close}
            className="flex items-center justify-center w-11 h-11 bg-none border border-border rounded-4 text-fg-2 cursor-pointer transition-colors duration-200 hover:border-accent"
            aria-label="Tutup menu"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="flex flex-col py-3" aria-label="Menu ponsel">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={close}
              className="block px-6 py-3 text-base font-body font-medium text-fg-2 transition-colors duration-200 hover:bg-surface-2 hover:text-fg"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="mt-auto px-6 py-4 border-t border-border flex flex-col gap-2">
          <Link
            href="/login"
            onClick={close}
            className="w-full inline-flex items-center justify-center gap-2 rounded-4 font-body font-medium text-sm whitespace-nowrap transition-all duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg px-4 py-2 bg-transparent text-fg hover:text-accent hover:bg-surface-2 active:bg-surface"
          >
            Masuk
          </Link>
          <Link
            href="/register"
            onClick={close}
            className="w-full inline-flex items-center justify-center gap-2 rounded-4 font-body font-medium text-sm whitespace-nowrap transition-all duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg px-4 py-2 bg-accent text-bg hover:bg-accent-gl active:bg-accent-dim"
          >
            Daftar
          </Link>
        </div>
      </aside>
    </>
  );
}
