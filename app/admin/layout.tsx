'use client';

import React, { useState } from 'react';
import NextLink from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  LayoutDashboard,
  Package,
  Layers,
  ShoppingBag,
  Users,
  Boxes,
  BarChart3,
  Settings,
  LogOut,
  ExternalLink,
  ShieldAlert,
  Menu,
  X,
  Sparkles,
  Loader2,
} from 'lucide-react';
import Logo from '@/components/Logo';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#141212] flex flex-col items-center justify-center text-cream-100">
        <Loader2 className="w-8 h-8 animate-spin text-gold-500 mb-3" />
        <p className="font-serif text-lg tracking-wider">Verifying Admin Privileges...</p>
      </div>
    );
  }

  // Role Guard: Normal customers or unauthenticated users CANNOT access /admin
  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-[#141212] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-stone-900 border border-gold-600/30 rounded-2xl p-8 text-center text-cream-100 shadow-2xl space-y-5">
          <div className="w-16 h-16 rounded-full bg-rose-950/60 border border-rose-500/40 text-rose-400 flex items-center justify-center mx-auto">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-gold-300">Access Restricted</h2>
          <p className="text-xs text-stone-400 leading-relaxed">
            The Admin Control Panel is reserved exclusively for store directors and inventory managers. Regular customer accounts cannot view this portal.
          </p>
          <div className="pt-2 flex flex-col gap-2">
            <NextLink
              href="/login"
              className="w-full py-2.5 bg-maroon-800 hover:bg-maroon-700 text-gold-200 text-xs font-bold uppercase tracking-widest rounded transition"
            >
              Sign In as Admin
            </NextLink>
            <NextLink
              href="/"
              className="w-full py-2.5 bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-bold uppercase tracking-widest rounded transition"
            >
              Back to Storefront
            </NextLink>
          </div>
        </div>
      </div>
    );
  }

  const navItems = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Products', href: '/admin/products', icon: Package },
    { name: 'Categories', href: '/admin/categories', icon: Layers },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingBag },
    { name: 'Customers', href: '/admin/customers', icon: Users },
    { name: 'Inventory', href: '/admin/inventory', icon: Boxes },
    { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen bg-[#f7f5f0] flex flex-col lg:flex-row">
      {/* Mobile Admin Header */}
      <div className="lg:hidden bg-[#181412] text-cream-100 px-4 py-3 flex items-center justify-between border-b border-gold-600/30">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1 text-gold-400 hover:text-white"
          >
            {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          <Logo variant="admin" href="/admin" />
        </div>
        <NextLink
          href="/"
          className="text-xs text-gold-400 hover:text-white flex items-center gap-1"
        >
          <span>Store</span>
          <ExternalLink className="w-3 h-3" />
        </NextLink>
      </div>

      {/* Admin Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 inset-y-0 left-0 z-40 w-64 bg-[#141212] text-cream-100 flex flex-col border-r border-gold-600/20 transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Strip */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <Logo variant="admin" href="/admin" />
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 text-stone-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Admin User Mini Card */}
        <div className="p-4 mx-3 my-3 bg-stone-900/80 rounded-lg border border-gold-500/20 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-maroon-800 text-gold-300 font-bold flex items-center justify-center font-serif text-sm border border-gold-500/40 shrink-0">
            {user.name.charAt(0)}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-cream-50 truncate">{user.name}</p>
            <span className="inline-block text-[10px] text-gold-400 font-mono">Store Director</span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <NextLink
                key={item.name}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-medium uppercase tracking-wider transition ${
                  isActive
                    ? 'bg-maroon-900/90 text-gold-300 border border-gold-500/30 font-bold shadow-md'
                    : 'text-stone-400 hover:bg-stone-900 hover:text-cream-100'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-gold-400' : 'text-stone-500'}`} />
                <span>{item.name}</span>
              </NextLink>
            );
          })}
        </nav>

        {/* Footer Actions */}
        <div className="p-4 border-t border-white/10 space-y-2">
          <NextLink
            href="/"
            target="_blank"
            className="w-full flex items-center justify-between px-3 py-2 text-xs text-stone-400 hover:text-gold-300 hover:bg-stone-900 rounded transition"
          >
            <span>Live Customer Store</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </NextLink>

          <button
            onClick={async () => {
              await logout();
              router.push('/login');
            }}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs text-rose-400 hover:bg-rose-950/40 rounded transition"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out Admin</span>
          </button>
        </div>
      </aside>

      {/* Main Admin Content Container */}
      <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}
