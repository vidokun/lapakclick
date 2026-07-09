'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createClient } from '@/lib/supabase/client';
import { forgotPasswordSchema, type ForgotPasswordSchema } from '@/lib/validations';

export function ForgotPasswordForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authSuccess, setAuthSuccess] = useState<boolean>(false);
  
  const { register, handleSubmit, formState: { errors } } = useForm<ForgotPasswordSchema>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordSchema) => {
    setIsLoading(true);
    setAuthError(null);
    setAuthSuccess(false);
    
    const supabase = createClient();
    
    const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/dashboard/settings`,
    });
    
    setIsLoading(false);
    
    if (error) {
      setAuthError(error.message || 'Terjadi kesalahan saat mengirim email reset');
      return;
    }
    
    setAuthSuccess(true);
  };

  if (authSuccess) {
    return (
      <div className="text-center py-4">
        <div className="w-12 h-12 rounded-full bg-positive/10 text-positive flex items-center justify-center mx-auto mb-4">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
        </div>
        <h3 className="text-lg font-bold font-display mb-2 text-fg">Cek Email Anda</h3>
        <p className="text-sm text-fg-2">
          Kami telah mengirimkan tautan untuk mereset password. Silakan periksa kotak masuk email Anda.
        </p>
      </div>
    );
  }

  return (
    <form className="form flex flex-col gap-3" onSubmit={handleSubmit(onSubmit)} noValidate>
      {authError && (
        <div className="text-negative text-sm text-center mb-2 bg-negative/10 p-2 rounded">
          {authError}
        </div>
      )}
      
      <div className="form__group flex flex-col gap-1">
        <label className="form__label font-body text-[0.8rem] font-medium text-fg-2 tracking-[0.01em]" htmlFor="email">Email</label>
        <div className="form__input-wrap flex items-center bg-bg border border-border rounded-lg overflow-hidden transition-all focus-within:border-accent focus-within:ring-[3px] focus-within:ring-accent/10">
          <input 
            type="email" 
            className="form__input flex-1 font-body text-[0.9rem] py-3 px-4 bg-transparent border-none text-fg outline-none min-w-0 placeholder:text-muted" 
            id="email" 
            placeholder="nama@email.com" 
            autoComplete="email" 
            spellCheck="false" 
            {...register('email')}
          />
        </div>
        <div className={`form__error text-[0.75rem] text-negative min-h-0 overflow-hidden transition-all ${errors.email ? 'min-h-[1.2rem] mt-1' : ''}`}>
          {errors.email?.message}
        </div>
      </div>

      <div className="form__submit mt-4">
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
          ) : 'Kirim tautan reset'}
        </button>
      </div>
    </form>
  );
}
