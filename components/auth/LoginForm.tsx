'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createClient } from '@/lib/supabase/client';
import { loginSchema, type LoginSchema } from '@/lib/validations';

export function LoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  
  const { register, handleSubmit, formState: { errors } } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginSchema) => {
    setIsLoading(true);
    setAuthError(null);
    
    const supabase = createClient();
    
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });
    
    setIsLoading(false);
    
    if (error) {
      setAuthError('Email atau password salah');
      return;
    }
    
    router.push('/dashboard');
    router.refresh();
  };
  
  const handleGoogleOAuth = async () => {
    const supabase = createClient();
    
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      }
    });
  };

  return (
    <form className="form flex flex-col gap-3" onSubmit={handleSubmit(onSubmit)} noValidate>
      {authError && (
        <div className="text-negative text-sm text-center mb-2 bg-negative/10 p-2 rounded">
          {authError}
        </div>
      )}
      
      <div className="form__group flex flex-col gap-1">
        <label className="form__label font-body text-[0.8rem] font-medium text-fg-2 tracking-[0.01em]" htmlFor="email">Email atau Username</label>
        <div className="form__input-wrap flex items-center bg-bg border border-border rounded-lg overflow-hidden transition-all focus-within:border-accent focus-within:ring-[3px] focus-within:ring-accent/10">
          <input 
            type="text" 
            className="form__input flex-1 font-body text-[0.9rem] py-3 px-4 bg-transparent border-none text-fg outline-none min-w-0 placeholder:text-muted" 
            id="email" 
            placeholder="nama@email.com" 
            autoComplete="username" 
            spellCheck="false" 
            {...register('email')}
          />
        </div>
        <div className={`form__error text-[0.75rem] text-negative min-h-0 overflow-hidden transition-all ${errors.email ? 'min-h-[1.2rem] mt-1' : ''}`}>
          {errors.email?.message}
        </div>
      </div>

      <div className="form__group flex flex-col gap-1">
        <label className="form__label font-body text-[0.8rem] font-medium text-fg-2 tracking-[0.01em]" htmlFor="password">Password</label>
        <div className="form__input-wrap flex items-center bg-bg border border-border rounded-lg overflow-hidden transition-all focus-within:border-accent focus-within:ring-[3px] focus-within:ring-accent/10">
          <input 
            type={showPassword ? "text" : "password"} 
            className="form__input flex-1 font-body text-[0.9rem] py-3 px-4 bg-transparent border-none text-fg outline-none min-w-0 placeholder:text-muted" 
            id="password" 
            placeholder="Masukkan password" 
            autoComplete="current-password" 
            {...register('password')}
          />
          <button 
            type="button" 
            className="form__toggle-pw flex items-center justify-center w-10 h-10 shrink-0 bg-transparent border-none text-muted text-base cursor-pointer transition-colors hover:text-fg" 
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? "Sembunyikan password" : "Lihat password"}
          >
            {showPassword ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><title>Sembunyikan password</title><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><title>Lihat password</title><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            )}
          </button>
        </div>
        <div className={`form__error text-[0.75rem] text-negative min-h-0 overflow-hidden transition-all ${errors.password ? 'min-h-[1.2rem] mt-1' : ''}`}>
          {errors.password?.message}
        </div>
      </div>

      <div className="form__options flex items-center justify-between text-[0.8rem] mt-1">
        <label className="form__checkbox flex items-center gap-2 cursor-pointer">
          <input 
            type="checkbox" 
            defaultChecked
            className="appearance-none w-4 h-4 border border-border rounded-[3px] bg-bg cursor-pointer transition-colors shrink-0 m-0 checked:bg-accent checked:border-accent checked:bg-[url('data:image/svg+xml,%3Csvg_viewBox=%220_0_16_16%22_fill=%22none%22_xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cpath_d=%22M4_8l2.5_2.5L12_5%22_stroke=%22%23000%22_stroke-width=%222%22_stroke-linecap=%22round%22_stroke-linejoin=%22round%22/%3E%3C/svg%3E')]"
          />
          <span className="text-muted">Ingat saya</span>
        </label>
        <Link href="/forgot-password" className="form__forgot text-muted hover:text-accent transition-colors">Lupa password?</Link>
      </div>

      <div className="form__submit mt-2">
        <button 
          type="submit" 
          className="btn btn--primary btn--full w-full inline-flex items-center justify-center gap-2 font-body font-medium text-[0.85rem] py-2 px-5 bg-accent text-bg border-none rounded hover:bg-accent-gl hover:-translate-y-[1px] cursor-pointer transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          disabled={isLoading}
        >
          {isLoading ? (
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-bg" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : 'Masuk'}
        </button>
      </div>

      <div className="form__divider flex items-center gap-4 my-2 before:flex-1 before:h-[1px] before:bg-border after:flex-1 after:h-[1px] after:bg-border">
        <span className="text-[0.75rem] text-muted whitespace-nowrap">atau</span>
      </div>

      <div className="form__oauth flex flex-col gap-2">
        <button 
          type="button" 
          onClick={handleGoogleOAuth}
          className="btn--oauth flex items-center justify-center gap-2 w-full py-[0.65rem] px-4 bg-surface-2 border border-border rounded-lg text-fg-2 font-body text-[0.85rem] font-medium cursor-pointer transition-all hover:border-accent-dim hover:text-fg hover:bg-surface"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><title>Google</title><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
          Masuk dengan Google
        </button>
      </div>
    </form>
  );
}
