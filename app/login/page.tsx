import Link from 'next/link';
import { LoginForm } from '@/components/auth/LoginForm';

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-bg">
      <div className="w-full max-w-sm mx-4 my-8">
        <div className="login__head">
          <h1 className="text-3xl font-bold font-display mb-1 tracking-tight">Masuk</h1>
          <p className="text-[0.85rem] text-fg-2">Masuk ke akun <span className="font-mono">lapak.click</span> Anda</p>
        </div>

        <LoginForm />

        <p className="login__register text-center mt-6 text-[0.85rem] text-fg-2">
          Belum punya akun? <Link href="/register" className="font-medium text-accent hover:text-accent-gl transition-colors">Daftar Sekarang</Link>
        </p>
      </div>
    </main>
  );
}
