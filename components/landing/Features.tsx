import { Globe, Server, ShieldCheck, Store, Target, Share2 } from "lucide-react";

const features = [
  {
    icon: Globe,
    title: "Gratis Selamanya",
    description:
      "Subdomain .lapak.click gratis untuk UMKM Indonesia. Tanpa biaya registrasi, tanpa biaya bulanan — selamanya.",
  },
  {
    icon: Server,
    title: "Instan & Mudah",
    description:
      "Proses claim hanya 1 menit. DNS otomatis terkonfigurasi — tidak perlu setting manual yang rumit.",
  },
  {
    icon: ShieldCheck,
    title: "SSL Gratis",
    description:
      "Setiap subdomain langsung aktif dengan SSL certificate. Website Anda aman dan terpercaya untuk pengunjung.",
  },
  {
    icon: Store,
    title: "Untuk Semua UMKM",
    description:
      "Warung, kafe, toko online, jasa, kreator — semua bisa punya website profesional dengan subdomain gratis.",
  },
  {
    icon: Target,
    title: "Branding Profesional",
    description:
      "Website dengan domain namausaha.lapak.click terlihat lebih profesional daripada blogspot atau wix gratis.",
  },
  {
    icon: Share2,
    title: "Mudah Dibagikan",
    description:
      "Link subdomain pendek dan mudah diingat. Cocok untuk dibagikan di WhatsApp, Instagram, media sosial, dan Google.",
  }
];

export function Features() {
  return (
    <section className="border-b border-border py-24" id="features">
      <div className="mx-auto max-w-6xl px-6">
        <p className="font-mono text-[0.7rem] uppercase tracking-[0.12em] text-accent mb-3">
          Keunggulan
        </p>
        <h2 className="font-display font-bold text-fg text-[clamp(1.4rem,3vw+0.5rem,2.4rem)] tracking-[-0.025em] mb-8">
          Kenapa Pilih <span className="text-accent">lapak.click</span>?
        </h2>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-8 border border-border bg-surface p-4 transition-all duration-200 hover:border-accent-dim hover:-translate-y-0.5"
            >
              <feature.icon
                className="text-accent mb-3"
                size={22}
                strokeWidth={1.5}
              />
              <h3 className="font-display font-bold text-fg mb-1 text-base">
                {feature.title}
              </h3>
              <p className="text-sm text-fg-2 leading-relaxed">
                {feature.title === "Branding Profesional" ? (
                  <>Website dengan domain <code className="font-mono text-[0.8rem] text-fg bg-bg px-1 py-0.5 rounded border border-border">namausaha.lapak.click</code> terlihat lebih profesional daripada blogspot atau wix gratis.</>
                ) : (
                  feature.description
                )}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
