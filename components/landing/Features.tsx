"use client";

import { Globe, Server, Zap, Coins } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: Globe,
    title: "Domain Gratis",
    description:
      "Dapatkan subdomain .lapak.click gratis untuk website UMKM kamu. Tanpa biaya registrasi, tanpa biaya bulanan.",
  },
  {
    icon: Server,
    title: "DNS Mudah",
    description:
      "Kelola DNS dengan mudah melalui dashboard. Arahkan subdomain ke hosting favorit kamu dalam hitungan klik.",
  },
  {
    icon: Zap,
    title: "Cepat Aktif",
    description:
      "DNS siap dalam hitungan menit. Setelah konfigurasi, subdomain langsung bisa diakses dari seluruh dunia.",
  },
  {
    icon: Coins,
    title: "100% Gratis",
    description:
      "Tidak ada biaya tersembunyi. Semua fitur dasar gratis selamanya untuk UMKM Indonesia.",
  },
];

export function Features() {
  return (
    <section className="border-b border-border py-24" id="fitur">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="font-mono text-[0.7rem] uppercase tracking-[0.12em] text-accent mb-3">
            Keunggulan
          </p>
          <h2 className="font-display font-bold text-fg text-[clamp(1.4rem,3vw+0.5rem,2.4rem)] tracking-[-0.025em] mb-8">
            Kenapa Pilih <span className="text-accent">lapak.click</span>?
          </h2>
        </motion.div>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
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
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
