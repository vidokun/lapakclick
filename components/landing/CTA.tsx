"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export function CTA() {
  const router = useRouter();
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "");
    setInputValue(raw);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    setIsLoading(true);
    // Simulate check then redirect
    setTimeout(() => {
      router.push("/register");
    }, 500);
  };

  return (
    <section className="py-24 text-center pb-16 sm:pb-24">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="font-display font-bold text-fg text-[clamp(1.4rem,3vw+0.5rem,2.4rem)] tracking-[-0.025em] mb-3">
          Siap Onlinekan Usaha Anda?
        </h2>
        <p className="text-fg-2 mx-auto max-w-prose mb-8 text-base">
          Dapatkan subdomain{" "}
          <code className="font-mono text-[0.9rem] text-fg bg-bg px-1 py-0.5 rounded border border-border">namausaha.lapak.click</code>{" "}
          gratis sekarang juga.
        </p>
        
        <form onSubmit={handleSubmit} className="mx-auto flex max-w-[480px] overflow-hidden rounded-8 border border-border bg-surface focus-within:border-accent focus-within:shadow-[0_0_0_3px_rgba(139,92,246,0.15)] flex-wrap sm:flex-nowrap">
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder="nama-usaha"
            className="min-w-[100%] sm:min-w-0 flex-1 bg-transparent px-4 py-3 text-sm font-mono text-fg outline-none placeholder:text-muted placeholder:font-body"
            autoComplete="off"
            spellCheck="false"
            maxLength={63}
          />
          <span className="hidden sm:flex items-center whitespace-nowrap pr-3 pl-1 font-mono text-[0.8rem] text-muted">
            .lapak.click
          </span>
          <button
            type="submit"
            disabled={isLoading || !inputValue.trim()}
            className="w-full sm:w-auto bg-accent px-5 py-3 text-sm font-semibold text-bg transition-colors hover:bg-accent-gl disabled:opacity-60 disabled:cursor-not-allowed whitespace-nowrap rounded-none sm:rounded-r-8 sm:rounded-bl-none rounded-b-8"
          >
            {isLoading ? <Loader2 size={16} className="animate-spin mx-auto" /> : "Cek & Claim"}
          </button>
        </form>
      </div>
    </section>
  );
}
