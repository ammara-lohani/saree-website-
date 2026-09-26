'use client';

import React from 'react';
import NextLink from 'next/link';

interface LogoProps {
  variant?: 'navbar' | 'footer' | 'admin' | 'stacked' | 'icon';
  className?: string;
  href?: string;
}

export default function Logo({
  variant = 'navbar',
  className = '',
  href = '/',
}: LogoProps) {
  const isDark = variant === 'footer' || variant === 'admin';

  // SVG Emblem - A handcrafted royal South Asian couture crest
  const Emblem = ({ size = 42 }: { size?: number }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0 transition-transform duration-300 group-hover:scale-105"
    >
      <defs>
        {/* Metallic Gold Gradient */}
        <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F9E8B2" />
          <stop offset="35%" stopColor="#D4AF37" />
          <stop offset="70%" stopColor="#C5A059" />
          <stop offset="100%" stopColor="#936D2B" />
        </linearGradient>

        {/* Regal Maroon Gradient */}
        <linearGradient id="maroonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4A0B14" />
          <stop offset="50%" stopColor="#30040A" />
          <stop offset="100%" stopColor="#1E0206" />
        </linearGradient>

        {/* Subtle Inner Glow */}
        <radialGradient id="glowGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#D4AF37" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Outer Ornamental Octagonal / Mughal Arch Seal */}
      <rect
        x="12"
        y="12"
        width="76"
        height="76"
        rx="20"
        transform="rotate(45 50 50)"
        fill="url(#maroonGrad)"
        stroke="url(#goldGrad)"
        strokeWidth="2.5"
      />
      <rect
        x="17"
        y="17"
        width="66"
        height="66"
        rx="16"
        transform="rotate(45 50 50)"
        fill="none"
        stroke="url(#goldGrad)"
        strokeWidth="1"
        strokeDasharray="2.5 2.5"
        opacity="0.8"
      />

      {/* Circular Inner Medallion */}
      <circle cx="50" cy="50" r="32" fill="url(#glowGrad)" />
      <circle cx="50" cy="50" r="31" stroke="url(#goldGrad)" strokeWidth="1" opacity="0.6" />

      {/* Mughal Crown / Lotus Finial Motif at Top */}
      <path
        d="M50 20 L53 25 L58 24 L55 28 L50 26 L45 28 L42 24 L47 25 Z"
        fill="url(#goldGrad)"
      />

      {/* Stylized Saree Drape Arc (Fluid Pallu Flow) */}
      <path
        d="M34 68 C35 52 42 42 62 38 C56 46 54 54 58 66"
        fill="none"
        stroke="url(#goldGrad)"
        strokeWidth="1.8"
        strokeLinecap="round"
        opacity="0.75"
      />

      {/* Regal Calligraphic "R" Monogram */}
      {/* Stem */}
      <path
        d="M39 34 L39 66"
        stroke="url(#goldGrad)"
        strokeWidth="3.2"
        strokeLinecap="round"
      />
      {/* Upper Bowl */}
      <path
        d="M39 35 C48 33 60 36 60 46 C60 55 48 57 39 56"
        fill="none"
        stroke="url(#goldGrad)"
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Leg with Elegant Swash */}
      <path
        d="M48 55 C53 58 57 63 64 66"
        fill="none"
        stroke="url(#goldGrad)"
        strokeWidth="3.2"
        strokeLinecap="round"
      />

      {/* Small Decorative Accent Dots */}
      <circle cx="50" cy="74" r="1.8" fill="url(#goldGrad)" />
      <circle cx="26" cy="50" r="1.5" fill="url(#goldGrad)" opacity="0.8" />
      <circle cx="74" cy="50" r="1.5" fill="url(#goldGrad)" opacity="0.8" />
    </svg>
  );

  // Standalone Icon Variant
  if (variant === 'icon') {
    return (
      <NextLink href={href} className={`inline-block group ${className}`}>
        <Emblem size={44} />
      </NextLink>
    );
  }

  // Stacked Variant (Hero / Splash / Center)
  if (variant === 'stacked') {
    return (
      <NextLink
        href={href}
        className={`inline-flex flex-col items-center text-center group ${className}`}
      >
        <Emblem size={56} />
        <div className="mt-2.5 space-y-0.5">
          <div className="flex items-center justify-center gap-2">
            <span
              className={`font-serif text-3xl sm:text-4xl font-bold tracking-[0.22em] uppercase transition ${
                isDark ? 'text-gold-300 group-hover:text-gold-200' : 'text-maroon-900 group-hover:text-maroon-700'
              }`}
            >
              Rivaayat
            </span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <span className="w-5 h-[1px] bg-gold-500/50" />
            <span className="text-[10px] tracking-[0.35em] uppercase font-semibold text-gold-600 font-sans">
              Luxury Sarees • Pakistan
            </span>
            <span className="w-5 h-[1px] bg-gold-500/50" />
          </div>
        </div>
      </NextLink>
    );
  }

  // Admin Sidebar / Topbar Variant
  if (variant === 'admin') {
    return (
      <NextLink
        href={href}
        className={`inline-flex items-center gap-3 group ${className}`}
      >
        <Emblem size={38} />
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="font-serif text-2xl font-bold tracking-[0.16em] text-gold-400 uppercase group-hover:text-gold-300 transition">
              Rivaayat
            </span>
            <span className="px-1.5 py-0.5 bg-maroon-800 text-gold-200 text-[9px] font-bold rounded uppercase tracking-wider border border-gold-500/30">
              HQ
            </span>
          </div>
          <span className="text-[9px] tracking-[0.25em] uppercase text-stone-400 font-medium font-sans">
            Couture Atelier
          </span>
        </div>
      </NextLink>
    );
  }

  // Footer Variant (for dark luxury background)
  if (variant === 'footer') {
    return (
      <NextLink
        href={href}
        className={`inline-flex items-center gap-3.5 group ${className}`}
      >
        <Emblem size={46} />
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="font-serif text-2xl sm:text-3xl font-bold tracking-[0.2em] text-gold-300 uppercase group-hover:text-gold-200 transition">
              Rivaayat
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-gold-400 mb-1" />
          </div>
          <span className="text-[10px] tracking-[0.32em] uppercase text-gold-500 font-semibold font-sans">
            Luxury Sarees • Pakistan
          </span>
        </div>
      </NextLink>
    );
  }

  // Default Navbar Variant (Light clean luxury background)
  return (
    <NextLink
      href={href}
      className={`inline-flex items-center gap-3 group text-left ${className}`}
    >
      <Emblem size={44} />
      <div className="flex flex-col justify-center">
        <div className="flex items-center gap-1.5">
          <span className="font-serif text-2xl sm:text-3xl font-bold tracking-[0.18em] text-maroon-900 uppercase group-hover:text-maroon-700 transition leading-none">
            Rivaayat
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-gold-500 shrink-0" />
        </div>
        <span className="text-[9px] sm:text-[10px] tracking-[0.3em] uppercase text-gold-700 font-semibold font-sans mt-1">
          Luxury Sarees • Pakistan
        </span>
      </div>
    </NextLink>
  );
}
