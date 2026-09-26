import React from 'react';
import NextLink from 'next/link';
import { Sparkles, Phone, Mail, MapPin, ShieldCheck, Truck, RefreshCw } from 'lucide-react';
import Logo from '@/components/Logo';

export default function Footer() {
  return (
    <footer className="bg-[#181412] text-cream-100 border-t border-gold-600/30">
      {/* Brand Value Pillars */}
      <div className="border-b border-white/10 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          <div className="flex items-center gap-4 justify-center md:justify-start">
            <div className="w-12 h-12 rounded-full bg-maroon-900/60 border border-gold-500/40 flex items-center justify-center shrink-0">
              <Sparkles className="w-6 h-6 text-gold-400" />
            </div>
            <div>
              <h4 className="font-serif text-lg font-semibold text-gold-200">Authentic Handloom</h4>
              <p className="text-xs text-stone-400 mt-0.5">Pure katan silks, hand-carved zardozi, and genuine artisan needlework.</p>
            </div>
          </div>

          <div className="flex items-center gap-4 justify-center md:justify-start">
            <div className="w-12 h-12 rounded-full bg-maroon-900/60 border border-gold-500/40 flex items-center justify-center shrink-0">
              <Truck className="w-6 h-6 text-gold-400" />
            </div>
            <div>
              <h4 className="font-serif text-lg font-semibold text-gold-200">Express Delivery Across Pakistan</h4>
              <p className="text-xs text-stone-400 mt-0.5">Complimentary shipping on orders above PKR 15,000. Reliable Cash on Delivery.</p>
            </div>
          </div>

          <div className="flex items-center gap-4 justify-center md:justify-start">
            <div className="w-12 h-12 rounded-full bg-maroon-900/60 border border-gold-500/40 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6 text-gold-400" />
            </div>
            <div>
              <h4 className="font-serif text-lg font-semibold text-gold-200">Boutique Guarantee</h4>
              <p className="text-xs text-stone-400 mt-0.5">Custom fall & edging, unstitched blouse fabric, and personalized bridal trials.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <Logo variant="footer" />
            <p className="text-sm text-stone-400 leading-relaxed max-w-sm">
              Rivaayat celebrates centuries of South Asian draping art. Each saree is woven with historical reverence, marrying pure silks, diaphanous organzas, and exquisite Pakistani handcrafts for the modern Pakistani woman.
            </p>
            <div className="pt-2 text-xs text-stone-400 space-y-2">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gold-500 shrink-0" />
                <span>Flagship Atelier: 14-C, Zamzama Boulevard, Phase 5, DHA, Karachi</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gold-500 shrink-0" />
                <span>Boutique WhatsApp & Inquiries: +92 300 1234567</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gold-500 shrink-0" />
                <span>couture@rivaayat.pk</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif text-base tracking-widest uppercase text-gold-300 font-semibold mb-4 border-b border-gold-600/30 pb-2">
              Collections
            </h4>
            <ul className="space-y-2.5 text-sm text-stone-400">
              <li>
                <NextLink href="/shop?category=wedding" className="hover:text-gold-300 transition">
                  Wedding Sarees
                </NextLink>
              </li>
              <li>
                <NextLink href="/shop?category=bridal" className="hover:text-gold-300 transition">
                  Bridal Coutures
                </NextLink>
              </li>
              <li>
                <NextLink href="/shop?category=party-wear" className="hover:text-gold-300 transition">
                  Party Wear & Soirées
                </NextLink>
              </li>
              <li>
                <NextLink href="/shop?category=festive" className="hover:text-gold-300 transition">
                  Festive & Eid Collection
                </NextLink>
              </li>
              <li>
                <NextLink href="/shop?category=work" className="hover:text-gold-300 transition">
                  Work & Boardroom
                </NextLink>
              </li>
              <li>
                <NextLink href="/shop?category=casual" className="hover:text-gold-300 transition">
                  Casual Drapes
                </NextLink>
              </li>
              <li>
                <NextLink href="/shop?category=sale" className="hover:text-gold-300 text-rose-400 transition">
                  Seasonal Archive / Sale
                </NextLink>
              </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h4 className="font-serif text-base tracking-widest uppercase text-gold-300 font-semibold mb-4 border-b border-gold-600/30 pb-2">
              Client Concierge
            </h4>
            <ul className="space-y-2.5 text-sm text-stone-400">
              <li>
                <NextLink href="/about" className="hover:text-gold-300 transition">
                  Brand Heritage
                </NextLink>
              </li>
              <li>
                <NextLink href="/account/orders" className="hover:text-gold-300 transition">
                  Track Your Order
                </NextLink>
              </li>
              <li>
                <NextLink href="/wishlist" className="hover:text-gold-300 transition">
                  My Wishlist
                </NextLink>
              </li>
              <li>
                <NextLink href="/account" className="hover:text-gold-300 transition">
                  Client Profile
                </NextLink>
              </li>
              <li>
                <NextLink href="/login" className="hover:text-gold-300 transition">
                  VIP Club Sign In
                </NextLink>
              </li>
              <li>
                <NextLink href="/admin" className="text-xs text-stone-500 hover:text-gold-400 transition">
                  Admin Portal
                </NextLink>
              </li>
            </ul>
          </div>

          {/* Newsletter Column */}
          <div>
            <h4 className="font-serif text-base tracking-widest uppercase text-gold-300 font-semibold mb-4 border-b border-gold-600/30 pb-2">
              The Rivaayat Gazette
            </h4>
            <p className="text-xs text-stone-400 mb-4 leading-relaxed">
              Subscribe to receive private bridal previews, seasonal lookbooks, and an exclusive PKR 1,500 privilege voucher on your premier order.
            </p>
            <form onSubmit={(e) => { e.preventDefault(); alert('Thank you for subscribing to Rivaayat Gazette!'); }} className="space-y-2">
              <input
                type="email"
                required
                placeholder="Enter your email address"
                className="w-full bg-stone-900 border border-stone-700 px-3 py-2 text-sm text-cream-100 placeholder-stone-500 rounded focus:outline-none focus:border-gold-500"
              />
              <button
                type="submit"
                className="w-full bg-gold-600 hover:bg-gold-500 text-stone-950 font-bold text-xs uppercase tracking-widest py-2.5 rounded transition"
              >
                Join Private List
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10 py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-stone-500">
        <p>© {new Date().getFullYear()} Rivaayat Sarees Pvt. Ltd. All rights reserved. Crafted in Pakistan.</p>
        <div className="flex items-center gap-4">
          <span className="text-stone-400">Accepted In Pakistan:</span>
          <span className="px-2 py-1 bg-stone-900 rounded border border-stone-800 text-[11px] text-stone-300 font-medium">Cash on Delivery</span>
          <span className="px-2 py-1 bg-stone-900 rounded border border-stone-800 text-[11px] text-stone-300 font-medium">Direct Bank Transfer</span>
          <span className="px-2 py-1 bg-stone-900 rounded border border-stone-800 text-[11px] text-stone-300 font-medium">Cards (Visa/MC)</span>
        </div>
      </div>
    </footer>
  );
}
