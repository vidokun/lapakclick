import Link from "next/link";
import { Globe } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FooterProps {
  className?: string;
}

const linkGroups = [
  {
    title: "Produk",
    links: [
      { label: "Fitur", href: "/#features" },
      { label: "Harga", href: "/#harga" },
    ],
  },
  {
    title: "Bantuan",
    links: [
      { label: "Panduan", href: "/panduan" },
      { label: "FAQ", href: "/#faq" },
      { label: "Hubungi Kami", href: "/hubungi" },
    ],
  },
  {
    title: "Perusahaan",
    links: [
      { label: "Tentang", href: "/tentang" },
      { label: "Blog", href: "/blog" },
      { label: "Kebijakan Privasi", href: "/privasi" },
    ],
  },
];

export function Footer({ className }: FooterProps) {
  return (
    <footer className={cn("bg-surface border-t border-border", className)}>
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="flex flex-wrap justify-between gap-8 pb-8 border-b border-border">
          <div className="max-w-xs">
            <Link
              href="/"
              className="font-display font-bold text-base text-fg whitespace-nowrap"
            >
              lapak<span className="text-accent">.click</span>
            </Link>
            <p className="mt-2 text-sm text-muted leading-relaxed">
              Onlinekan usaha mu dengan subdomain gratis
            </p>
          </div>

          <div className="flex flex-wrap gap-8">
            {linkGroups.map((group) => (
              <div key={group.title}>
                <h4 className="text-xs font-semibold text-fg uppercase tracking-wider mb-3">
                  {group.title}
                </h4>
                <ul className="flex flex-col gap-2">
                  {group.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-sm text-muted transition-colors duration-200 hover:text-fg"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 pt-6">
          <div className="flex items-center gap-3">
            <a
              href="#"
              className="flex items-center justify-center w-8 h-8 rounded-4 text-muted border border-border transition-colors duration-200 hover:text-fg hover:border-accent"
              aria-label="Website"
            >
              <Globe size={16} />
            </a>
            <span className="text-xs text-muted">Instagram</span>
            <span className="text-xs text-muted">Twitter</span>
            <span className="text-xs text-muted">TikTok</span>
          </div>

          <p className="text-xs text-muted whitespace-nowrap">
            &copy; 2026 lapak.click. Hak cipta dilindungi.
          </p>
        </div>
      </div>
    </footer>
  );
}
