import Link from 'next/link';
import { RegisterForm } from '@/components/auth/RegisterForm';

export default function RegisterPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-bg">
      <div className="w-full max-w-sm mx-4 my-8">
        <div className="login__head">
          <h1 className="text-3xl font-bold font-display mb-1 tracking-tight">Daftar</h1>
          <p className="text-[0.85rem] text-fg-2">Buat akun <span className="font-mono">lapak.click</span> baru</p>
        </div>

        <RegisterForm />

        <p className="login__register text-center mt-6 text-[0.85rem] text-fg-2">
          Sudah punya akun? <Link href="/login" className="font-medium text-accent hover:text-accent-gl transition-colors">Masuk</Link>
        </p>
      </div>
    </main>
  );
}
