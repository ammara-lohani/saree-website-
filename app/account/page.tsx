'use client';

import React from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';
import {
  User,
  ShoppingBag,
  Heart,
  Package,
  ShieldCheck,
  LogOut,
  MapPin,
  Phone,
  Mail,
  ArrowRight,
} from 'lucide-react';

export default function AccountPage() {
  const router = useRouter();
  const { user, logout, loading } = useAuth();
  const { totalWishlist } = useWishlist();
  const { totalItems } = useCart();

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="font-serif text-lg text-stone-500">Loading your profile...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-serif text-2xl font-bold text-stone-900">Please Sign In</h2>
        <p className="text-xs text-stone-500">
          Sign in to view your orders, saved sarees, and personalized recommendations.
        </p>
        <div className="pt-2">
          <NextLink
            href="/login"
            className="px-6 py-2.5 bg-maroon-800 text-gold-200 text-xs font-bold uppercase tracking-widest rounded"
          >
            Sign In
          </NextLink>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Header */}
      <div className="border-b border-cream-200 pb-6 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] uppercase tracking-[0.25em] text-gold-600 font-semibold">
            Client Atelier
          </span>
          <h1 className="font-serif text-3xl font-bold text-stone-900 mt-1">
            Welcome, {user.name}
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Member of Rivaayat Couture Circle
          </p>
        </div>

        <div className="flex items-center gap-3">
          {user.role === 'admin' && (
            <NextLink
              href="/admin"
              className="px-4 py-2 bg-amber-100 hover:bg-amber-200 border border-amber-300 text-amber-900 rounded text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition"
            >
              <ShieldCheck className="w-4 h-4 text-amber-700" />
              <span>Admin Panel</span>
            </NextLink>
          )}

          <button
            onClick={async () => {
              await logout();
              router.push('/login');
            }}
            className="px-4 py-2 border border-stone-300 hover:bg-cream-100 text-stone-700 rounded text-xs font-semibold flex items-center gap-1.5 transition"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Quick Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        <NextLink
          href="/account/orders"
          className="p-6 bg-white rounded-xl border border-cream-200 shadow-xs hover:shadow-md transition group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="p-3 rounded-full bg-maroon-50 text-maroon-800">
              <Package className="w-6 h-6" />
            </span>
            <ArrowRight className="w-4 h-4 text-stone-300 group-hover:text-maroon-800 transition -translate-x-1 group-hover:translate-x-0" />
          </div>
          <h3 className="font-serif text-lg font-bold text-stone-900">My Orders</h3>
          <p className="text-xs text-stone-500 mt-1">Track pending shipments, receipts, and order histories.</p>
        </NextLink>

        <NextLink
          href="/wishlist"
          className="p-6 bg-white rounded-xl border border-cream-200 shadow-xs hover:shadow-md transition group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="p-3 rounded-full bg-rose-50 text-rose-700">
              <Heart className="w-6 h-6" />
            </span>
            <span className="text-sm font-bold text-stone-900 font-sans">{totalWishlist} saved</span>
          </div>
          <h3 className="font-serif text-lg font-bold text-stone-900">Wishlist & Curations</h3>
          <p className="text-xs text-stone-500 mt-1">View your saved sarees and bridal selections.</p>
        </NextLink>

        <NextLink
          href="/cart"
          className="p-6 bg-white rounded-xl border border-cream-200 shadow-xs hover:shadow-md transition group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="p-3 rounded-full bg-gold-50 text-gold-700">
              <ShoppingBag className="w-6 h-6" />
            </span>
            <span className="text-sm font-bold text-stone-900 font-sans">{totalItems} in bag</span>
          </div>
          <h3 className="font-serif text-lg font-bold text-stone-900">Shopping Bag</h3>
          <p className="text-xs text-stone-500 mt-1">Review selected sarees and proceed to checkout.</p>
        </NextLink>
      </div>

      {/* Account Details Box */}
      <div className="bg-white p-6 sm:p-8 rounded-xl border border-cream-200 shadow-xs max-w-2xl space-y-6">
        <h3 className="font-serif text-lg font-bold text-stone-900 tracking-wider uppercase border-b border-cream-200 pb-2">
          Personal Information
        </h3>

        <div className="space-y-4 text-xs text-stone-600">
          <div className="flex items-center gap-3">
            <User className="w-4 h-4 text-maroon-800 shrink-0" />
            <div>
              <span className="text-stone-400 block text-[10px] uppercase">Client Name</span>
              <span className="font-semibold text-stone-900 text-sm">{user.name}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Mail className="w-4 h-4 text-maroon-800 shrink-0" />
            <div>
              <span className="text-stone-400 block text-[10px] uppercase">Email</span>
              <span className="font-semibold text-stone-900 text-sm">{user.email}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Phone className="w-4 h-4 text-maroon-800 shrink-0" />
            <div>
              <span className="text-stone-400 block text-[10px] uppercase">Phone</span>
              <span className="font-semibold text-stone-900 text-sm">{user.phone || 'Not specified'}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <MapPin className="w-4 h-4 text-maroon-800 shrink-0" />
            <div>
              <span className="text-stone-400 block text-[10px] uppercase">Default Shipping Address</span>
              <span className="font-semibold text-stone-900 text-sm">
                {user.address ? `${user.address}, ${user.city || ''}` : 'No address saved yet'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
