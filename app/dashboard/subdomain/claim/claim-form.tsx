"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Check, X, Loader2 } from "lucide-react";
import { Toast } from "@/components/ui/Toast";

export function ClaimForm() {
  const router = useRouter();
  const [subdomain, setSubdomain] = useState("");
  const [debouncedSubdomain, setDebouncedSubdomain] = useState("");
  
  const [isChecking, setIsChecking] = useState(false);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [checkError, setCheckError] = useState<string | null>(null);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [target, setTarget] = useState("");
  
  const [toastMessage, setToastMessage] = useState<{type: 'success' | 'error', message: string} | null>(null);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSubdomain(subdomain);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [subdomain]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "");
    setSubdomain(val);
    
    if (!val) {
      setIsAvailable(null);
      setCheckError(null);
    }
  };

  useEffect(() => {
    async function checkAvailability() {
      if (!debouncedSubdomain) return;
      
      if (debouncedSubdomain.length < 3) {
        setIsAvailable(null);
        setCheckError("Minimal 3 karakter");
        return;
      }

      setIsChecking(true);
      setCheckError(null);
      
      try {
        const res = await fetch("/api/subdomains/check", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: debouncedSubdomain }),
        });
        
        const data = await res.json();
        
        if (!res.ok) {
          throw new Error(data.error?.message || "Gagal mengecek subdomain");
        }
        
        setIsAvailable(data.available);
      } catch (err: any) {
        setCheckError(err.message);
        setIsAvailable(null);
      } finally {
        setIsChecking(false);
      }
    }

    checkAvailability();
  }, [debouncedSubdomain]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!subdomain || !isAvailable || isSubmitting) return;
    
    setIsSubmitting(true);
    setToastMessage(null);
    
    try {
      const res = await fetch("/api/subdomains", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          name: subdomain,
          target: target || "192.168.1.10" 
        }),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error?.message || "Gagal meng-claim subdomain");
      }
      
      setToastMessage({type: 'success', message: `Subdomain ${subdomain}.lapak.click berhasil di-claim!`});
      setTimeout(() => {
        router.push("/dashboard/subdomain");
        router.refresh();
      }, 1500);
      
    } catch (err: any) {
      setToastMessage({type: 'error', message: err.message});
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 relative">
      {toastMessage && (
        <Toast
          type={toastMessage.type}
          message={toastMessage.message}
          onClose={() => setToastMessage(null)}
        />
      )}
      <div>
        <div 
          className={`flex items-center border rounded-lg overflow-hidden transition-colors ${
            subdomain ? "border-[var(--accent)] ring-2 ring-[var(--accent)]/10" : "border-[var(--border)] focus-within:border-[var(--accent)] focus-within:ring-2 focus-within:ring-[var(--accent)]/10"
          }`}
        >
          <input
            type="text"
            value={subdomain}
            onChange={handleInputChange}
            placeholder="nama-usaha"
            className="flex-1 font-mono text-sm px-4 py-3 bg-transparent border-none outline-none text-[var(--fg)] placeholder:font-sans placeholder:text-[var(--muted)]"
            autoComplete="off"
            spellCheck="false"
          />
          <span className="font-mono text-sm text-[var(--muted)] pr-4 pl-1 whitespace-nowrap flex items-center">
            .lapak.click
          </span>
        </div>
        
        <div className="mt-3 min-h-[60px]">
          {isChecking ? (
            <div className="flex items-center gap-2 text-sm text-[var(--muted)] font-mono animate-pulse">
              <Loader2 className="w-4 h-4 animate-spin" /> Memeriksa...
            </div>
          ) : checkError ? (
            <div className="text-sm text-[var(--negative)] font-mono">
              {checkError}
            </div>
          ) : isAvailable === true ? (
            <div className="border border-[color-mix(in_oklch,var(--positive)_30%,transparent)] bg-[color-mix(in_oklch,var(--positive)_8%,transparent)] rounded-lg p-3">
              <div className="text-[var(--positive)] font-semibold text-sm flex items-center gap-2">
                <Check className="w-4 h-4" /> Tersedia!
              </div>
            </div>
          ) : isAvailable === false ? (
            <div className="border border-[color-mix(in_oklch,var(--negative)_30%,transparent)] bg-[color-mix(in_oklch,var(--negative)_8%,transparent)] rounded-lg p-3">
              <div className="text-[var(--negative)] font-semibold text-sm flex items-center gap-2">
                <X className="w-4 h-4" /> Sudah digunakan
              </div>
              <div className="font-mono text-xs text-[var(--muted)] mt-1">
                {subdomain}.lapak.click sudah dipakai, coba nama lain
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {isAvailable && (
        <form onSubmit={handleSubmit} className="flex flex-col gap-5 pt-5 border-t border-[var(--border)] animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <label className="flex flex-col gap-1.5 text-xs font-medium text-[var(--fg-2)]">
              Nama Subdomain
              <input
                type="text"
                value={`${subdomain}.lapak.click`}
                readOnly
                className="font-mono text-sm px-3 py-2.5 bg-[var(--surface-hover)] border border-[var(--border)] rounded-lg text-[var(--fg)] opacity-70 cursor-not-allowed outline-none"
              />
            </label>
            
            <label className="flex flex-col gap-1.5 text-xs font-medium text-[var(--fg-2)]">
              Target (IP atau CNAME)
              <input
                type="text"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                placeholder="192.168.1.10"
                className="font-sans text-sm px-3 py-2.5 bg-[var(--bg)] border border-[var(--border)] rounded-lg text-[var(--fg)] outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/10"
              />
              <span className="text-[10px] text-[var(--muted)] mt-1">Arahkan subdomain ke hosting Anda</span>
            </label>
          </div>
          
          <button
            type="submit"
            disabled={isSubmitting}
            className="self-start font-semibold text-sm px-6 py-2.5 bg-[var(--accent)] hover:bg-[var(--accent-dim)] text-[var(--bg)] rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Memproses...
              </>
            ) : (
              "Claim Sekarang"
            )}
          </button>
        </form>
      )}
    </div>
  );
}
