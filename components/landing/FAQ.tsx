"use client";

import { useState } from "react";

const faqs = [
  {
    question: "Apa itu lapak.click?",
    answer:
      "lapak.click adalah layanan subdomain gratis untuk UMKM Indonesia. Kami menyediakan subdomain .lapak.click yang bisa kamu arahkan ke hosting favorit. Kami hanya mengelola DNS — website dan hosting adalah tanggung jawab kamu.",
  },
  {
    question: "Berapa biayanya?",
    answer:
      "Gratis! Tidak ada biaya registrasi, biaya bulanan, atau biaya tersembunyi. Subdomain .lapak.click gratis selamanya untuk UMKM Indonesia.",
  },
  {
    question: "Bagaimana cara mengarahkan subdomain ke hosting saya?",
    answer:
      "Setelah claim subdomain, masuk ke dashboard dan masukkan alamat IP (record A) atau nama domain (record CNAME) dari hosting kamu. DNS akan aktif dalam hitungan menit. Panduan lengkap tersedia di dashboard.",
  },
  {
    question: "Apakah saya perlu punya website dulu?",
    answer:
      "Ya, kamu perlu memiliki website yang dihosting di suatu tempat — bisa di hosting berbayar, hosting gratis, atau VPS. lapak.click hanya menyediakan subdomain dan mengelola DNS-nya.",
  },
  {
    question: "Berapa lama DNS tersebar?",
    answer:
      "DNS biasanya aktif dalam 1-5 menit setelah konfigurasi, meskipun dalam beberapa kasus bisa memakan waktu hingga 24 jam tergantung penyedia layanan internet.",
  },
  {
    question: "Apakah SSL disediakan?",
    answer:
      "SSL adalah tanggung jawab hosting Anda. Kami menyediakan subdomain dan DNS. Jika hosting Anda mendukung SSL (seperti Let's Encrypt), website Anda akan aman dengan HTTPS.",
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
