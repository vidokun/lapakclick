"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Sidebar } from "@/components/layout/Sidebar";
import { User } from "@supabase/supabase-js";

export function DashboardLayoutShell({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.replace("/login");
        return;
      }
      
      setUser(session.user);
      setLoading(false);
    };
    
    checkUser();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!session) {
          router.replace("/login");
        } else {
          setUser(session.user);
        }
      }
    );
    
    return () => {
      subscription.unsubscribe();
    };
  }, [router, supabase.auth]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <div className="w-8 h-8 rounded-full border-2 border-border border-t-accent animate-spin" />
      </div>
    );
  }

  // Detect admin role
  const isAdmin = user?.user_metadata?.role === "admin";

  // Determine active item based on pathname
  let activeItem = "overview";
  if (pathname === "/dashboard" || pathname === "/dashboard/overview") activeItem = "overview";
  else if (pathname.includes("/dashboard/admin")) activeItem = "admin";
  else if (pathname.includes("/dashboard/subdomain/claim")) activeItem = "claim";
  else if (pathname.includes("/dashboard/subdomain")) activeItem = "subdomain";
  else if (pathname.includes("/dashboard/dns")) activeItem = "dns";
  else if (pathname.includes("/dashboard/settings") || pathname.includes("/dashboard/pengaturan")) activeItem = "pengaturan";

  // Map to Sidebar props
  const userInfo = user ? {
    name: user.user_metadata?.full_name || undefined,
    email: user.email,
  } : undefined;

  const sidebar = (
    <Sidebar 
      activeItem={activeItem} 
      user={userInfo} 
      onLogout={handleLogout} 
      isAdmin={isAdmin}
    />
  );

  let pageTitle = "Dashboard";
  let pageSubtitle = "Ringkasan akun lapak.click Anda";
  
  if (activeItem === "overview") {
    pageTitle = "Beranda";
    pageSubtitle = "Ringkasan akun lapak.click Anda";
  } else if (activeItem === "subdomain") {
    pageTitle = "Subdomain Saya";
    pageSubtitle = "Kelola subdomain yang sudah di-claim";
  } else if (activeItem === "claim") {
    pageTitle = "Domain Baru";
    pageSubtitle = "Claim subdomain .lapak.click gratis";
  } else if (activeItem === "dns") {
    pageTitle = "DNS";
    pageSubtitle = "Kelola DNS record subdomain Anda";
  } else if (activeItem === "pengaturan") {
    pageTitle = "Pengaturan";
    pageSubtitle = "Pengaturan profil dan keamanan akun";
  } else if (activeItem === "admin") {
    pageTitle = "Admin Panel";
    pageSubtitle = "Kelola blacklist domain dan pengaturan sistem";
  }

  return (
    <DashboardShell sidebar={sidebar} title={pageTitle} subtitle={pageSubtitle}>
      {children}
    </DashboardShell>
  );
}
