'use client';

import React, { useState } from 'react';
import Link from 'next/navigation';
import { usePathname } from 'next/navigation';
import NextLink from 'next/link';
import {
  Search,
  Heart,
  ShoppingBag,
  User as UserIcon,
  Menu,
  X,
  Sparkles,
  ChevronDown,
  ShieldCheck,
  LogOut,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useAuth } from '@/context/AuthContext';
import Logo from '@/components/Logo';

interface NavbarProps {
  onOpenSearch: () => void;
}

export default function Navbar({ onOpenSearch }: NavbarProps) {
  const pathname = usePathname();
  const { totalItems, setIsCartOpen } = useCart();
  const { totalWishlist } = useWishlist();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);

  // If we are on admin pages, we use the Admin Layout instead
  const isAdminRoute = pathname?.startsWith('/admin');
  if (isAdminRoute) return null;

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Shop', href: '/shop' },
    { name: 'Categories', href: '/categories' },
    { name: 'New Arrivals', href: '/shop?newArrival=true' },
    { name: 'Wedding', href: '/shop?category=wedding' },
    { name: 'About', href: '/about' },
  ];

  return (
    <>
      {/* Announcement Bar */}
      <div className="bg-maroon-900 text-gold-300 text-xs tracking-wider py-2 px-4 text-center font-medium border-b border-gold-600/30">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-gold-400 animate-pulse" />
          <span>Complimentary Express Delivery across Pakistan on orders above PKR 15,000</span>
          <span className="hidden md:inline text-gold-500/60">|</span>
          <span className="hidden md:inline text-cream-200">Karachi Flagship & Worldwide Couturier Inquiries: +92 300 1234567</span>
        </div>
      </div>

      {/* Main Navbar */}
      <header className="sticky top-0 z-40 bg-[#fdfbf7]/95 backdrop-blur-md border-b border-cream-200 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Mobile Hamburger Button */}
            <div className="flex items-center lg:hidden">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-maroon-900 hover:text-gold-600 transition"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

            {/* Brand Logo with Title */}
            <div className="flex-1 lg:flex-none text-center lg:text-left flex items-center justify-center lg:justify-start">
              <Logo variant="navbar" />
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-8">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <NextLink
                    key={link.name}
                    href={link.href}
                    className={`text-sm tracking-widest uppercase transition-colors duration-200 py-1 border-b-2 font-medium ${
                      isActive
                        ? 'text-maroon-800 border-gold-500'
                        : 'text-stone-700 border-transparent hover:text-maroon-800 hover:border-gold-300'
                    }`}
                  >
                    {link.name}
                  </NextLink>
                );
              })}
            </nav>

            {/* Right Action Icons */}
            <div className="flex items-center space-x-3 sm:space-x-5">
              {/* Search Button */}
              <button
                type="button"
                onClick={onOpenSearch}
                className="p-2 text-stone-700 hover:text-maroon-800 transition rounded-full hover:bg-cream-100"
                aria-label="Search sarees"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Wishlist Link */}
              <NextLink
                href="/wishlist"
                className="p-2 text-stone-700 hover:text-maroon-800 transition relative rounded-full hover:bg-cream-100"
                aria-label="Wishlist"
              >
                <Heart className="w-5 h-5" />
                {totalWishlist > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-maroon-800 text-gold-200 text-[10px] font-bold rounded-full flex items-center justify-center border border-cream-50">
                    {totalWishlist}
                  </span>
                )}
              </NextLink>

              {/* Cart Drawer Trigger */}
              <button
                type="button"
                onClick={() => setIsCartOpen(true)}
                className="p-2 text-stone-700 hover:text-maroon-800 transition relative rounded-full hover:bg-cream-100"
                aria-label="Shopping Cart"
              >
                <ShoppingBag className="w-5 h-5" />
                {totalItems > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-gold-500 text-maroon-950 text-[10px] font-bold rounded-full flex items-center justify-center border border-cream-50">
                    {totalItems}
                  </span>
                )}
              </button>

              {/* Account Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setAccountDropdownOpen(!accountDropdownOpen)}
                  className="flex items-center gap-1 p-2 text-stone-700 hover:text-maroon-800 transition rounded-full hover:bg-cream-100"
                  aria-label="Customer Account"
                >
                  <UserIcon className="w-5 h-5" />
                  {user && <span className="hidden xl:inline text-xs font-medium max-w-[80px] truncate">{user.name.split(' ')[0]}</span>}
                  <ChevronDown className="w-3 h-3 text-stone-400" />
                </button>

                {accountDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-cream-200 py-2 z-50 animate-fade-in"
                    onMouseLeave={() => setAccountDropdownOpen(false)}
                  >
                    {user ? (
                      <>
                        <div className="px-4 py-2 border-b border-stone-100">
                          <p className="text-xs text-stone-400">Signed in as</p>
                          <p className="text-sm font-semibold text-stone-800 truncate">{user.name}</p>
                          <span className={`inline-block px-1.5 py-0.5 mt-1 text-[10px] font-bold rounded uppercase tracking-wider ${
                            user.role === 'admin' ? 'bg-amber-100 text-amber-800' : 'bg-cream-200 text-stone-700'
                          }`}>
                            {user.role}
                          </span>
                        </div>

                        {user.role === 'admin' && (
                          <NextLink
                            href="/admin"
                            onClick={() => setAccountDropdownOpen(false)}
                            className="flex items-center gap-2 px-4 py-2 text-sm text-maroon-900 font-semibold hover:bg-cream-100 transition"
                          >
                            <ShieldCheck className="w-4 h-4 text-gold-600" />
                            Admin Dashboard
                          </NextLink>
                        )}

                        <NextLink
                          href="/account"
                          onClick={() => setAccountDropdownOpen(false)}
                          className="block px-4 py-2 text-sm text-stone-700 hover:bg-cream-100 transition"
                        >
                          My Profile
                        </NextLink>

                        <NextLink
                          href="/account/orders"
                          onClick={() => setAccountDropdownOpen(false)}
                          className="block px-4 py-2 text-sm text-stone-700 hover:bg-cream-100 transition"
                        >
                          My Orders
                        </NextLink>

                        <div className="border-t border-stone-100 mt-1 pt-1">
                          <button
                            type="button"
                            onClick={async () => {
                              setAccountDropdownOpen(false);
                              await logout();
                            }}
                            className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-rose-700 hover:bg-rose-50 transition"
                          >
                            <LogOut className="w-4 h-4" />
                            Log Out
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="px-4 py-2 border-b border-stone-100">
                          <p className="text-xs text-stone-500">Welcome to Rivaayat Sarees</p>
                        </div>
                        <NextLink
                          href="/login"
                          onClick={() => setAccountDropdownOpen(false)}
                          className="block px-4 py-2 text-sm font-semibold text-maroon-900 hover:bg-cream-100 transition"
                        >
                          Sign In
                        </NextLink>
                        <NextLink
                          href="/register"
                          onClick={() => setAccountDropdownOpen(false)}
                          className="block px-4 py-2 text-sm text-stone-700 hover:bg-cream-100 transition"
                        >
                          Create Account
                        </NextLink>
                        <div className="border-t border-stone-100 mt-1 pt-1">
                          <NextLink
                            href="/account/orders"
                            onClick={() => setAccountDropdownOpen(false)}
                            className="block px-4 py-2 text-xs text-stone-500 hover:bg-cream-100 transition"
                          >
                            Track Guest Order
                          </NextLink>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-cream-50 border-b border-cream-200 px-4 pt-3 pb-6 space-y-3 animate-fade-in">
            <div className="space-y-1">
              {navLinks.map((link) => (
                <NextLink
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2.5 text-base font-medium text-stone-800 hover:bg-cream-200 rounded-md tracking-wider uppercase text-sm"
                >
                  {link.name}
                </NextLink>
              ))}
            </div>

            <div className="border-t border-cream-200 pt-3 space-y-2">
              {user ? (
                <>
                  <p className="px-3 text-xs text-stone-500">Signed in as {user.name}</p>
                  {user.role === 'admin' && (
                    <NextLink
                      href="/admin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-3 py-2 text-sm font-bold text-maroon-900 bg-amber-50 border border-amber-200 rounded"
                    >
                      Admin Dashboard
                    </NextLink>
                  )}
                  <NextLink
                    href="/account/orders"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 text-sm text-stone-700 hover:bg-cream-200 rounded"
                  >
                    My Orders
                  </NextLink>
                  <button
                    type="button"
                    onClick={async () => {
                      setMobileMenuOpen(false);
                      await logout();
                    }}
                    className="w-full text-left px-3 py-2 text-sm text-rose-700 hover:bg-rose-50 rounded"
                  >
                    Log Out
                  </button>
                </>
              ) : (
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <NextLink
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-center py-2 px-3 border border-maroon-800 text-maroon-800 font-semibold text-sm rounded"
                  >
                    Sign In
                  </NextLink>
                  <NextLink
                    href="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-center py-2 px-3 bg-maroon-800 text-gold-200 font-semibold text-sm rounded"
                  >
                    Register
                  </NextLink>
                </div>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  );
}
