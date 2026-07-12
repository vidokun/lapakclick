"use client";

import { useState } from "react";

const faqs = [
  {
    question: "Apakah benar-benar gratis?",
    answer:
      "Ya, 100% gratis tanpa biaya tersembunyi. Tidak ada biaya registrasi, biaya bulanan, atau biaya tahunan. Subdomain .lapak.click gratis untuk selama-lamanya bagi UMKM Indonesia.",
  },
  {
    question: "Berapa lama proses claim?",
    answer:
      "Kurang dari 1 menit! Setelah Anda mendaftar dan verifikasi email, subdomain langsung aktif. DNS terkonfigurasi otomatis sehingga website Anda bisa diakses dalam hitungan menit.",
  },
  {
    question: "Website apa yang bisa dipasang di subdomain?",
    answer:
      "Apapun yang bisa diakses via browser — landing page, toko online sederhana, portofolio, blog, link bio, hingga website statis HTML. Subdomain .lapak.click siap menampung halaman Anda.",
  },
  {
    question: "Apakah ada limit traffic atau pengunjung?",
    answer:
      "Tidak ada limit traffic untuk website UMKM. Silakan promosikan subdomain Anda di media sosial, WhatsApp, dan Google — semua pengunjung bisa mengakses tanpa hambatan.",
  },
  {
    question: "Bagaimana cara memulainya?",
    answer:
      "Cukup cek ketersediaan nama subdomain di atas, lalu daftar. Verifikasi email, upload website, dan selesai! Panduan lengkap tersedia setelah Anda mendaftar.",
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (i: number) => {
    setOpenIndex((prev) => (prev === i ? null : i));
  };

  return (
    <section className="border-b border-border py-24" id="faq">
      <div className="mx-auto max-w-6xl px-6">
        <p className="font-mono text-[0.7rem] uppercase tracking-[0.12em] text-accent mb-3">
          FAQ
        </p>
        <h2 className="font-display font-bold text-fg text-[clamp(1.4rem,3vw+0.5rem,2.4rem)] tracking-[-0.025em] mb-8">
          Pertanyaan{" "}
          <span className="text-accent">Sering Ditanyakan</span>
        </h2>
        <div className="flex flex-col gap-1">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={i}
                className="overflow-hidden rounded-8 border border-border bg-surface"
              >
                <button
                  type="button"
                  onClick={() => toggle(i)}
                  className="flex w-full items-center justify-between gap-4 px-4 py-3 text-left text-sm font-medium text-fg transition-colors hover:bg-surface-2 sm:text-base"
                >
                  <span>{faq.question}</span>
                  <span
                    className={`shrink-0 text-muted transition-transform duration-300 text-lg ${
                      isOpen ? "rotate-45" : ""
                    }`}
                  >
                    +
                  </span>
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ease-out ${
                    isOpen ? "max-h-80" : "max-h-0"
                  }`}
                >
                  <div className="px-4 pb-4">
                    <p className="text-sm text-fg-2 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
