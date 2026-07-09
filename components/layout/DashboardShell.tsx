"use client";

import { useState, useEffect, useCallback, type ReactNode } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface DashboardShellProps {
  sidebar: ReactNode;
  children: ReactNode;
  title?: string;
  className?: string;
}

export function DashboardShell({
  sidebar,
  children,
  title,
  className,
}: DashboardShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const close = useCallback(() => {
    setSidebarOpen(false);
    document.body.style.overflow = "";
  }, []);

  const toggle = useCallback(() => {
    setSidebarOpen((prev) => {
      const next = !prev;
      document.body.style.overflow = next ? "hidden" : "";
      return next;
    });
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && sidebarOpen) close();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [sidebarOpen, close]);

  useEffect(() => {
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div className="flex min-h-screen bg-bg">
      <div className="hidden xl900:block">{sidebar}</div>

      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/60 backdrop-blur-sm xl900:hidden",
          "transition-opacity duration-300",
          sidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={close}
        aria-hidden="true"
      />

      <aside
        className={cn(
          "fixed top-0 left-0 bottom-0 z-50 xl900:hidden",
          "w-64 bg-surface border-r border-border",
          "flex flex-col overflow-y-auto",
          "transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
        aria-label="Sidebar navigasi"
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <span className="font-display font-extrabold text-base text-fg whitespace-nowrap">
            lapak<span className="text-accent">.click</span>
          </span>
          <button
            type="button"
            onClick={close}
            className="flex items-center justify-center w-8 h-8 bg-none border border-border rounded-4 text-fg-2 cursor-pointer transition-colors duration-200 hover:border-accent"
            aria-label="Tutup sidebar"
          >
            <X size={18} />
          </button>
        </div>
        {sidebar}
      </aside>

      <main
        className={cn(
          "flex-1 min-h-screen ml-0 xl900:ml-64 p-6 lg:p-10",
          className
        )}
      >
        <div className="flex items-center justify-between mb-6 xl900:hidden">
          <h1 className="font-display font-bold text-xl text-fg">
            {title ?? "Dashboard"}
          </h1>
          <button
            type="button"
            onClick={toggle}
            className="flex items-center justify-center w-8 h-8 bg-none border border-border rounded-4 text-fg-2 cursor-pointer transition-colors duration-200 hover:border-accent shrink-0"
            aria-label={sidebarOpen ? "Tutup sidebar" : "Buka sidebar"}
            aria-expanded={sidebarOpen}
          >
            {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        {title && (
          <h1 className="hidden xl900:block font-display font-bold text-xl text-fg mb-6">
            {title}
          </h1>
        )}

        {children}
      </main>
    </div>
  );
}
