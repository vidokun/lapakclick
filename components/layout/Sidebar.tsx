"use client";

import Link from "next/link";
import {
  LayoutDashboard,
  Globe,
  PlusCircle,
  Settings2,
  User,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface SidebarProps {
  activeItem: string;
  user?: { name?: string; email?: string };
  onLogout?: () => void;
  className?: string;
}

const navItems = [
  { id: "overview", label: "Overview", icon: LayoutDashboard, href: "/dashboard/overview" },
  { id: "subdomain", label: "Subdomain", icon: Globe, href: "/dashboard/subdomain" },
  { id: "claim", label: "Claim", icon: PlusCircle, href: "/dashboard/subdomain/claim" },
  { id: "dns", label: "DNS", icon: Settings2, href: "/dashboard/dns" },
  { id: "pengaturan", label: "Pengaturan", icon: User, href: "/dashboard/settings" },
];

export function Sidebar({
  activeItem,
  user,
  onLogout,
  className,
}: SidebarProps) {
  return (
    <aside
      className={cn(
        "fixed top-0 left-0 bottom-0 z-50",
        "w-64 bg-surface border-r border-border",
        "flex flex-col overflow-y-auto",
        className
      )}
      aria-label="Sidebar dashboard"
    >
      <div className="flex items-center gap-2 px-5 py-4 border-b border-border">
        <Link
          href="/dashboard"
          className="font-display font-extrabold text-base text-fg whitespace-nowrap"
        >
          lapak<span className="text-accent">.click</span>
        </Link>
      </div>

      <nav className="flex-1 py-2 flex flex-col gap-0.5" aria-label="Navigasi dashboard">
        {navItems.map((item) => {
          const isActive = activeItem === item.id;
          const Icon = item.icon;
          return (
            <Link
              key={item.id}
              href={item.href}
              className={cn(
                "flex items-center gap-3 mx-2 px-3 py-2.5 rounded-4",
                "text-sm font-body font-medium transition-all duration-150",
                isActive
                  ? "text-accent bg-accent/10 border-l-2 border-accent"
                  : "text-fg-2 hover:text-fg hover:bg-surface-2 border-l-2 border-transparent"
              )}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon size={16} className={cn("shrink-0", isActive ? "opacity-100" : "opacity-60")} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border">
        {user ? (
          <div className="flex items-center justify-between px-5 py-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 rounded-full shrink-0 bg-accent-dim flex items-center justify-center font-display font-bold text-sm text-bg">
                {(user.name ?? user.email ?? "U").charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <div className="text-sm font-medium text-fg truncate">
                  {user.name ?? "Pengguna"}
                </div>
                {user.email && (
                  <div className="text-xs text-muted truncate">{user.email}</div>
                )}
              </div>
            </div>
            {onLogout && (
              <button
                type="button"
                onClick={onLogout}
                className="flex items-center justify-center w-8 h-8 rounded-4 text-muted transition-colors duration-200 hover:text-negative hover:bg-negative/10 shrink-0"
                aria-label="Keluar"
                title="Keluar"
              >
                <LogOut size={16} />
              </button>
            )}
          </div>
        ) : (
          <div className="px-5 py-3">
            <Link
              href="/login"
              className="w-full inline-flex items-center justify-center gap-2 rounded-4 font-body font-medium text-sm whitespace-nowrap transition-all duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg px-4 py-2 bg-transparent text-fg hover:text-accent hover:bg-surface-2 active:bg-surface"
            >
              Masuk
            </Link>
          </div>
        )}
      </div>
    </aside>
  );
}
