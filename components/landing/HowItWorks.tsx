const steps = [
  {
    number: "01",
    title: "Cek Ketersediaan",
    description:
      "Masukkan nama yang diinginkan dan lihat apakah subdomain tersebut tersedia untuk Anda claim.",
  },
  {
    number: "02",
    title: "Daftar Akun",
    description:
      "Isi data diri — hanya butuh 1 menit. Verifikasi email, dan subdomain siap digunakan.",
  },
  {
    number: "03",
    title: "Upload Website",
    description:
      "Upload file website Anda atau arahkan ke layanan hosting favorit. DNS sudah otomatis.",
  },
  {
    number: "04",
    title: "Online Sekarang!",
    description:
      "Website Anda live di namausaha.lapak.click. Bagikan ke pelanggan sekarang!",
  },
];

export function HowItWorks() {
  return (
    <section className="border-b border-border py-24" id="how-it-works">
      <div className="mx-auto max-w-6xl px-6">
        <p className="font-mono text-[0.7rem] uppercase tracking-[0.12em] text-accent mb-3">
          Cara Kerja
        </p>
        <h2 className="font-display font-bold text-fg text-[clamp(1.4rem,3vw+0.5rem,2.4rem)] tracking-[-0.025em] mb-10">
          Mulai dalam{" "}
          <span className="text-accent">3 Langkah</span>
        </h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4">
          {steps.map((step, i) => (
            <div key={step.number} className="relative pt-6">
              <div className="font-display text-4xl font-extrabold text-accent-dim/60 leading-none mb-3 tabular-nums">
                {step.number}
              </div>
              <h3 className="font-display font-bold text-fg mb-2 text-base">
                {step.title}
              </h3>
              <p className="text-sm text-fg-2 leading-relaxed">
                {step.title === "Online Sekarang!" ? (
                  <>Website Anda live di <code className="font-mono text-[0.8rem] text-fg bg-bg px-1 py-0.5 rounded border border-border">namausaha.lapak.click</code>. Bagikan ke pelanggan sekarang!</>
                ) : (
                  step.description
                )}
              </p>
              {i < steps.length - 1 && (
                <div
                  className="hidden md:block absolute top-8 -right-4 text-muted/40 text-lg"
                  aria-hidden="true"
                >
                  →
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
