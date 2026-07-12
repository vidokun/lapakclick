import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function CTA() {
  return (
    <section className="py-24 text-center">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="font-display font-bold text-fg text-[clamp(1.4rem,3vw+0.5rem,2.4rem)] tracking-[-0.025em] mb-3">
          Siap Onlinekan Usaha Anda?
        </h2>
        <p className="text-fg-2 mx-auto max-w-prose mb-8 text-base">
          Dapatkan subdomain{" "}
          <code className="font-mono text-accent">namausaha.lapak.click</code>{" "}
          gratis sekarang juga.
        </p>
        <Link
          href="/register"
          className="inline-flex items-center justify-center gap-2 rounded-4 font-body font-medium whitespace-nowrap transition-all duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg px-6 py-3 text-base bg-accent text-bg hover:bg-accent-gl active:bg-accent-dim"
        >
          Mulai Sekarang
          <ArrowRight size={18} />
        </Link>
      </div>
    </section>
  );
}
