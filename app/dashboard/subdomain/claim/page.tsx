import { ClaimForm } from "./claim-form";

export default function ClaimPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-fg">Klaim Subdomain</h1>
        <p className="text-sm text-fg-2 mt-1">Pilih nama subdomain untuk lapak.click Anda</p>
      </div>
      <ClaimForm />
    </div>
  );
}
