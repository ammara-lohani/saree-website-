'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import NextLink from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Sparkles, ShieldCheck, UserCheck, AlertCircle, Loader2 } from 'lucide-react';
import Logo from '@/components/Logo';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password);
    setLoading(false);

    if (result.success) {
      if (result.user?.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/account');
      }
    } else {
      setError(result.error || 'Invalid credentials');
    }
  };

  const handleDemoAdmin = async () => {
    setEmail('admin@rivaayat.pk');
    setPassword('AdminPassword123!');
    setError('');
    setLoading(true);
    const result = await login('admin@rivaayat.pk', 'AdminPassword123!');
    setLoading(false);
    if (result.success) router.push('/admin');
    else setError(result.error || 'Failed to login');
  };

  const handleDemoCustomer = async () => {
    setEmail('ayesha.khan@example.com');
    setPassword('CustomerPassword123!');
    setError('');
    setLoading(true);
    const result = await login('ayesha.khan@example.com', 'CustomerPassword123!');
    setLoading(false);
    if (result.success) router.push('/account');
    else setError(result.error || 'Failed to login');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl border border-cream-200 shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <div className="flex justify-center pb-2">
            <Logo variant="stacked" />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-maroon-50 text-maroon-900 rounded-full text-[11px] font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-gold-600" />
            <span>VIP Client Portal</span>
          </div>
          <h1 className="font-serif text-2xl font-bold text-stone-900">Sign In</h1>
          <p className="text-xs text-stone-500">
            Access your orders, bespoke wishlist, and bridal consultations.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded text-xs text-rose-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-stone-700 font-semibold mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. name@example.com"
              className="w-full p-2.5 bg-cream-50/50 border border-stone-300 rounded focus:outline-none focus:border-gold-500"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-stone-700 font-semibold">Password</label>
              <button
                type="button"
                onClick={() => alert('Password reset link sent to demo email!')}
                className="text-[11px] text-maroon-800 hover:underline"
              >
                Forgot Password?
              </button>
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full p-2.5 bg-cream-50/50 border border-stone-300 rounded focus:outline-none focus:border-gold-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-maroon-800 hover:bg-maroon-900 text-gold-200 text-xs font-bold uppercase tracking-widest rounded shadow-md transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin text-gold-400" /> : <span>Sign In</span>}
          </button>
        </form>

        {/* 1-Click Demo Buttons for Fast Evaluation */}
        <div className="border-t border-cream-200 pt-5 space-y-2">
          <p className="text-[11px] uppercase tracking-wider text-stone-400 font-bold text-center">
            Instant Demo Sign In
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handleDemoAdmin}
              disabled={loading}
              className="py-2 px-3 bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 rounded text-[11px] font-bold flex items-center justify-center gap-1.5 transition"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
              <span>Admin Demo</span>
            </button>
            <button
              type="button"
              onClick={handleDemoCustomer}
              disabled={loading}
              className="py-2 px-3 bg-cream-100 hover:bg-cream-200 border border-stone-300 text-stone-800 rounded text-[11px] font-bold flex items-center justify-center gap-1.5 transition"
            >
              <UserCheck className="w-3.5 h-3.5 text-stone-600" />
              <span>Customer Demo</span>
            </button>
          </div>
        </div>

        <div className="text-center text-xs text-stone-500 pt-2 border-t border-cream-200">
          New to Rivaayat Sarees?{' '}
          <NextLink href="/register" className="font-bold text-maroon-800 hover:underline">
            Create an Account
          </NextLink>
        </div>
      </div>
    </div>
  );
}
