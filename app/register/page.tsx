'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import NextLink from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Sparkles, AlertCircle, Loader2 } from 'lucide-react';
import Logo from '@/components/Logo';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await register(name, email, password, phone);
    setLoading(false);

    if (result.success) {
      router.push('/account');
    } else {
      setError(result.error || 'Registration failed');
    }
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
            <span>Join The Rivaayat Circle</span>
          </div>
          <h1 className="font-serif text-2xl font-bold text-stone-900">Create Account</h1>
          <p className="text-xs text-stone-500">
            Enjoy exclusive preview access and personalized bridal drapes.
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
              Full Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Ayesha Khan"
              className="w-full p-2.5 bg-cream-50/50 border border-stone-300 rounded focus:outline-none focus:border-gold-500"
            />
          </div>

          <div>
            <label className="block text-stone-700 font-semibold mb-1">
              Email Address *
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ayesha.khan@example.com"
              className="w-full p-2.5 bg-cream-50/50 border border-stone-300 rounded focus:outline-none focus:border-gold-500"
            />
          </div>

          <div>
            <label className="block text-stone-700 font-semibold mb-1">
              Phone Number (Pakistani mobile)
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="0300-1234567"
              className="w-full p-2.5 bg-cream-50/50 border border-stone-300 rounded focus:outline-none focus:border-gold-500"
            />
          </div>

          <div>
            <label className="block text-stone-700 font-semibold mb-1">
              Create Password *
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              className="w-full p-2.5 bg-cream-50/50 border border-stone-300 rounded focus:outline-none focus:border-gold-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-maroon-800 hover:bg-maroon-900 text-gold-200 text-xs font-bold uppercase tracking-widest rounded shadow-md transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin text-gold-400" /> : <span>Register Account</span>}
          </button>
        </form>

        <div className="text-center text-xs text-stone-500 pt-2 border-t border-cream-200">
          Already have an account?{' '}
          <NextLink href="/login" className="font-bold text-maroon-800 hover:underline">
            Sign In
          </NextLink>
        </div>
      </div>
    </div>
  );
}
