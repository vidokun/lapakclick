import { ReactNode } from "react";
import { DashboardLayoutShell } from "./DashboardLayoutShell";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";

export const metadata = {
  title: "Dashboard - lapak.click",
  description: "Kelola DNS dan subdomain gratis .lapak.click kamu",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <DashboardLayoutShell>
      <ErrorBoundary>
        {children}
      </ErrorBoundary>
    </DashboardLayoutShell>
  );
}
