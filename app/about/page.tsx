import React from 'react';
import NextLink from 'next/link';
import { Sparkles, ArrowRight, ShieldCheck, HeartHandshake, Gem, Scissors } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="space-y-16 pb-20">
      {/* Hero Banner */}
      <section className="relative min-h-[50vh] flex items-center justify-center bg-[#171213] text-cream-50 overflow-hidden py-16">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1800&q=80"
            alt="Rivaayat Brand Story"
            className="w-full h-full object-cover opacity-25 object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#171213] via-[#171213]/60 to-transparent" />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 text-center space-y-4">
          <span className="text-xs uppercase tracking-[0.3em] text-gold-400 font-semibold">
            Atelier Heritage
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
            The Craft of Pakistani Drapes
          </h1>
          <p className="text-stone-300 text-sm sm:text-base max-w-2xl mx-auto font-light leading-relaxed">
            Honoring seven centuries of South Asian textile mastery. Each Rivaayat saree is an heirloom woven with pure mulberry silks, authentic metallic zaris, and unhurried artistry.
          </p>
        </div>
      </section>

      {/* Main Narrative */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="space-y-4">
            <span className="text-xs uppercase tracking-[0.25em] text-gold-600 font-bold">
              Our Genesis
            </span>
            <h2 className="font-serif text-3xl font-bold text-stone-900 leading-snug">
              Reviving The Elegance of The Saree in Contemporary Pakistan
            </h2>
            <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
              While the saree has always symbolized quintessential grace across South Asia, modern Pakistani women often sought drapes that balanced time-honored royal motifs with modern, lightweight comfort.
            </p>
            <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
              Rivaayat was founded in Karachi to curate sarees that don’t merely hang in wardrobes—they evoke memories. From the delicate tilla borders of Kashmiri needlework to the opulent jacquard florals of heirloom Banarasi katan, we collaborate directly with generational master weavers.
            </p>
          </div>

          <div className="aspect-[4/3] rounded-xl overflow-hidden shadow-lg border border-cream-200">
            <img
              src="https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1000&q=80"
              alt="Bridal Handloom Weaving"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 border-t border-cream-200">
          <div className="p-6 bg-white rounded-xl border border-cream-200 space-y-3">
            <Gem className="w-8 h-8 text-gold-600" />
            <h3 className="font-serif text-lg font-bold text-stone-900">Pure Fabrics</h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              100% natural mulberry silks, organic linen, bamboo chiffon, and silk organza with zero synthetic adulteration.
            </p>
          </div>

          <div className="p-6 bg-white rounded-xl border border-cream-200 space-y-3">
            <Scissors className="w-8 h-8 text-gold-600" />
            <h3 className="font-serif text-lg font-bold text-stone-900">Custom Finishing</h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              Every saree includes pre-stitched satin fall & pico edging, along with coordinating unstitched luxury blouse fabrics.
            </p>
          </div>

          <div className="p-6 bg-white rounded-xl border border-cream-200 space-y-3">
            <HeartHandshake className="w-8 h-8 text-gold-600" />
            <h3 className="font-serif text-lg font-bold text-stone-900">Artisan Fair Trade</h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              Directly supporting over 120 artisan families across Lahore, Multan, Faisalabad, and historic weaving hubs.
            </p>
          </div>
        </div>

        {/* Flagship Boutiques */}
        <div className="bg-[#f7f3eb] p-8 rounded-2xl border border-cream-300 space-y-4 text-center max-w-3xl mx-auto">
          <h3 className="font-serif text-2xl font-bold text-maroon-950">Experience In Person</h3>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            Our flagship atelier is located on Zamzama Boulevard, Phase 5 DHA Karachi. Private trousseau consultations are also available by appointment in Gulberg Lahore and Sector F-7 Islamabad.
          </p>
          <div className="pt-2">
            <NextLink
              href="/shop"
              className="inline-flex items-center gap-2 px-8 py-3 bg-maroon-800 text-gold-200 text-xs font-bold uppercase tracking-widest rounded shadow-md hover:bg-maroon-900 transition"
            >
              <span>Explore The Collection</span>
              <ArrowRight className="w-4 h-4" />
            </NextLink>
          </div>
        </div>
      </section>
    </div>
  );
}
