"use client";

import { motion } from "framer-motion";

const steps = [
  {
    number: "01",
    title: "Pilih Nama Subdomain",
    description:
      "Cari dan pilih nama subdomain yang kamu inginkan. Pastikan masih tersedia dan sesuai dengan brand usaha kamu.",
  },
  {
    number: "02",
    title: "Arahkan ke Hosting Kamu",
    description:
      "Arahkan subdomain ke server hosting favorit kamu. Cukup masukkan alamat IP atau CNAME tujuan di dashboard.",
  },
  {
    number: "03",
    title: "Konfigurasi DNS",
    description:
      "Atur pengaturan DNS sesuai kebutuhan. Tambahkan record A, CNAME, MX, atau TXT dengan mudah.",
  },
  {
    number: "04",
    title: "Selesai! Subdomain Siap Digunakan",
    description:
      "Subdomain kamu sudah aktif dan terhubung dengan hostingmu. Website UMKM-mu siap go digital!",
  },
];

export function HowItWorks() {
  return (
    <section className="border-b border-border py-24" id="cara-kerja">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="font-mono text-[0.7rem] uppercase tracking-[0.12em] text-accent mb-3">
            Cara Kerja
          </p>
          <h2 className="font-display font-bold text-fg text-[clamp(1.4rem,3vw+0.5rem,2.4rem)] tracking-[-0.025em] mb-10">
            Mulai dalam{" "}
            <span className="text-accent">4 Langkah</span>
          </h2>
        </motion.div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4">
          {steps.map((step, i) => (
            <motion.div 
              key={step.number} 
              className="relative pt-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <div className="font-display text-3xl font-extrabold text-accent-dim/60 leading-none mb-3 tabular-nums">
                {step.number}
              </div>
              <h3 className="font-display font-bold text-fg mb-2 text-base">
                {step.title}
              </h3>
              <p className="text-sm text-fg-2 leading-relaxed">
                {step.description}
              </p>
              {i < steps.length - 1 && (
                <div
                  className="hidden md:block absolute top-8 -right-4 text-muted/40 text-lg"
                  aria-hidden="true"
                >
                  →
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
