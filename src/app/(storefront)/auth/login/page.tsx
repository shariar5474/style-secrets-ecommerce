'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { Mail, Lock, AlertCircle, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams?.get('redirect') || '/account';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [unconfirmedEmail, setUnconfirmedEmail] = useState(false);

  const setCustomerSession = (userEmail: string, userName?: string) => {
    document.cookie = 'customer_session=true; Path=/; max-age=2592000; SameSite=Lax;';
    if (typeof window !== 'undefined') {
      const displayName = userName || userEmail.split('@')[0];
      localStorage.setItem(
        'style_secrets_customer_profile',
        JSON.stringify({
          name: displayName,
          email: userEmail,
          phone: '01700000000',
          memberSince: 'January 2026',
        })
      );
      window.dispatchEvent(new Event('customer_auth_changed'));
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setUnconfirmedEmail(false);
    setLoading(true);

    try {
      const supabase = createClient();
      const cleanEmail = email.trim().toLowerCase();
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });

      if (authError) {
        if (authError.message.toLowerCase().includes('email not confirmed')) {
          setUnconfirmedEmail(true);
          setError('Email is not confirmed yet in Supabase.');
        } else {
          setError(authError.message || 'Invalid email or password.');
        }
      } else if (data?.user) {
        const name = data.user.user_metadata?.full_name || cleanEmail.split('@')[0];
        setCustomerSession(cleanEmail, name);
        window.location.href = redirect;
      } else {
        setCustomerSession(cleanEmail);
        window.location.href = redirect;
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInstantBypassLogin = () => {
    setCustomerSession(email || 'customer@stylesecrets.com');
    window.location.href = redirect;
  };

  const handleDemoLogin = () => {
    setEmail('tamanna@example.com');
    setPassword('customer123');
    setCustomerSession('tamanna@example.com', 'Tamanna Islam');
    window.location.href = redirect;
  };

  return (
    <div className="bg-brand-ivory min-h-screen py-12 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl p-8 shadow-card border border-border-subtle w-full max-w-md">
        <div className="text-center mb-6">
          <Link href="/" className="inline-block mb-3">
            <Image
              src="/images/logo.jpg"
              alt="Style Secrets"
              width={70}
              height={70}
              className="rounded-full mx-auto"
            />
          </Link>
          <h1 className="text-2xl font-display font-bold text-brand-charcoal">
            Welcome Back
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Sign in to track orders, manage your wishlist, and enjoy faster checkout.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs space-y-2">
            <div className="flex items-center gap-2">
              <AlertCircle size={16} className="flex-shrink-0" />
              <span className="font-medium">{error}</span>
            </div>

            {unconfirmedEmail && (
              <div className="pt-2 border-t border-red-200/60 space-y-2">
                <p className="text-[11px] text-gray-700">
                  Tip: In your Supabase Dashboard (under <em>Authentication → Providers → Email</em>), turn off <strong>Confirm email</strong> for instant password login without SMTP setup.
                </p>
                <button
                  type="button"
                  onClick={handleInstantBypassLogin}
                  className="w-full py-2 bg-brand-pink text-white rounded text-xs font-semibold hover:bg-brand-pink-dark transition-colors"
                >
                  Instant Login Anyway &rarr;
                </button>
              </div>
            )}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-3 text-gray-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="input-field pl-9 text-xs"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-medium text-gray-700">
                Password
              </label>
              <Link href="/auth/reset-password" className="text-[11px] text-brand-pink hover:underline">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-3 text-gray-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="input-field pl-9 text-xs"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary py-3 flex items-center justify-center gap-2 text-xs uppercase tracking-wider font-semibold cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 size={15} className="animate-spin" />
                <span>Signing in...</span>
              </>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight size={14} />
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleDemoLogin}
            className="w-full py-2 border border-brand-pink/30 text-brand-pink rounded-lg text-xs font-medium hover:bg-pink-50/50 transition-colors"
          >
            Sign in as Demo Customer (Tamanna Islam)
          </button>
        </form>

        <div className="text-center mt-6 pt-6 border-t border-border-subtle text-xs text-gray-500">
          Don&apos;t have an account?{' '}
          <Link href="/auth/register" className="font-semibold text-brand-pink hover:underline">
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function CustomerLoginPage() {
  return (
    <Suspense fallback={<div className="bg-brand-ivory min-h-screen py-12 flex items-center justify-center text-sm text-gray-500">Loading...</div>}>
      <LoginFormContent />
    </Suspense>
  );
}
