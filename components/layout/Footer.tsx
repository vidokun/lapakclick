import Link from "next/link";
import { cn } from "@/lib/utils";

export interface FooterProps {
  className?: string;
}

export function Footer({ className }: FooterProps) {
  return (
    <footer className={cn("border-t border-border py-10 pb-6", className)}>
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-wrap justify-between items-center gap-6">
          <div>
            <div className="font-display font-bold text-base text-fg">
              lapak<span className="text-accent">.click</span>
            </div>
            <div className="mt-1 text-[0.8rem] text-muted">
              Subdomain gratis untuk UMKM Indonesia
            </div>
          </div>

          <ul className="flex flex-wrap gap-6 list-none m-0 p-0">
            <li>
              <Link href="/#beranda" className="text-[0.8rem] text-muted transition-colors duration-200 hover:text-fg hover:no-underline">
                Beranda
              </Link>
            </li>
            <li>
              <Link href="/#features" className="text-[0.8rem] text-muted transition-colors duration-200 hover:text-fg hover:no-underline">
                Fitur
              </Link>
            </li>
            <li>
              <Link href="/#how-it-works" className="text-[0.8rem] text-muted transition-colors duration-200 hover:text-fg hover:no-underline">
                Cara Kerja
              </Link>
            </li>
            <li>
              <Link href="/#faq" className="text-[0.8rem] text-muted transition-colors duration-200 hover:text-fg hover:no-underline">
                FAQ
              </Link>
            </li>
          </ul>

          <p className="text-[0.75rem] text-muted whitespace-nowrap w-full md:w-auto text-center md:text-right mt-4 md:mt-0">
            &copy; 2026 lapak.click — Subdomain gratis untuk UMKM Indonesia
          </p>
        </div>
      </div>
    </footer>
  );
}
