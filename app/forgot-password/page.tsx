import Link from 'next/link';
import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm';

export default function ForgotPasswordPage() {
  return (
    <main className="login" data-od-id="login">
      <div className="login__card">
        <div className="login__head">
          <h1 className="text-3xl font-bold font-display mb-1 tracking-tight">Lupa Password</h1>
          <p className="text-[0.85rem] text-fg-2">Masukkan email untuk mereset password Anda</p>
        </div>

        <ForgotPasswordForm />

        <p className="login__register text-center mt-6 text-[0.85rem] text-fg-2">
          Ingat password Anda? <Link href="/login" className="font-medium text-accent hover:text-accent-gl transition-colors">Kembali ke login</Link>
        </p>
      </div>
    </main>
  );
}
