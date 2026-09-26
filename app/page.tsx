import React from 'react';
import NextLink from 'next/link';
import { db } from '@/lib/db';
import ProductCard from '@/components/ProductCard';
import { Sparkles, ArrowRight, ShieldCheck, Gem, Award, Feather, HeartHandshake } from 'lucide-react';
import { ProductItem, CategoryItem } from '@/lib/types';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Fetch initial data on server
async function getData() {
  const [categories, featuredProducts, newArrivals] = await Promise.all([
    db.category.findMany({
      where: { active: true },
      orderBy: { name: 'asc' },
    }),
    db.product.findMany({
      where: { featured: true, active: true },
      take: 8,
      include: { category: true },
      orderBy: { createdAt: 'desc' },
    }),
    db.product.findMany({
      where: { newArrival: true, active: true },
      take: 8,
      include: { category: true },
      orderBy: { createdAt: 'desc' },
    }),
  ]);

  const parseProduct = (p: any): ProductItem => {
    let colors = [];
    let images = [];
    try {
      colors = JSON.parse(p.colors);
    } catch {
      colors = [p.colors];
    }
    try {
      images = JSON.parse(p.images);
    } catch {
      images = [p.images];
    }
    return {
      ...p,
      colors,
      images,
      createdAt: p.createdAt.toISOString(),
    };
  };

  return {
    categories: categories as CategoryItem[],
    featuredProducts: featuredProducts.map(parseProduct),
    newArrivals: newArrivals.map(parseProduct),
  };
}

export default async function HomePage() {
  const { categories, featuredProducts, newArrivals } = await getData();

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[85vh] sm:min-h-[90vh] flex items-center justify-center bg-[#171213] overflow-hidden">
        {/* Background Image with luxury overlay */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=2000&q=85"
            alt="Rivaayat Luxury Pakistani Sarees"
            className="w-full h-full object-cover object-top opacity-35 scale-105 animate-pulse duration-[10000ms]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#171213] via-[#171213]/60 to-[#171213]/40" />
          <div className="absolute inset-0 bg-[radial-gradient(#c5a059_1px,transparent_1px)] [background-size:24px_24px] opacity-10" />
        </div>

        {/* Hero Content */}
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-cream-50 z-10 py-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gold-500/40 bg-maroon-950/60 backdrop-blur-md mb-6 animate-fade-in">
            <Sparkles className="w-3.5 h-3.5 text-gold-400" />
            <span className="text-xs uppercase tracking-[0.25em] text-gold-300 font-medium">
              Heirloom Pakistani Coutures
            </span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-cream-50 leading-[1.1] mb-6">
            Timeless Elegance, <br />
            <span className="italic font-normal text-gold-400 font-serif">Woven in Heritage</span>
          </h1>

          <p className="max-w-2xl mx-auto text-stone-300 text-sm sm:text-base md:text-lg font-light leading-relaxed mb-10">
            Handcrafted pure Banarasi silks, celestial organzas, and regal bridal drapes. Celebrated across Karachi, Lahore, and worldwide for exquisite South Asian couture craftsmanship.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
            <NextLink
              href="/shop"
              className="w-full sm:w-auto px-8 py-4 bg-maroon-800 hover:bg-maroon-700 text-gold-200 border border-gold-500/50 rounded text-xs font-bold uppercase tracking-[0.2em] shadow-xl hover:shadow-gold-500/20 transition-all flex items-center justify-center gap-3"
            >
              <span>Shop Collection</span>
              <ArrowRight className="w-4 h-4" />
            </NextLink>

            <NextLink
              href="/shop?category=wedding"
              className="w-full sm:w-auto px-8 py-4 bg-white/10 hover:bg-white/20 text-cream-100 border border-white/20 hover:border-gold-400/60 rounded text-xs font-bold uppercase tracking-[0.2em] backdrop-blur-sm transition-all"
            >
              Explore Wedding Collection
            </NextLink>
          </div>
        </div>

        {/* Bottom subtle indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 text-stone-400 text-xs tracking-widest uppercase">
          <span className="w-8 h-[1px] bg-gold-500/40" />
          <span>Curated in Pakistan</span>
          <span className="w-8 h-[1px] bg-gold-500/40" />
        </div>
      </section>

      {/* 2. FEATURED CATEGORIES SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-xs uppercase tracking-[0.25em] text-gold-600 font-semibold mb-2">
            Signature Curation
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900">
            Explore By Occasion
          </h2>
          <div className="w-16 h-0.5 bg-gold-500 mx-auto mt-4" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {categories.map((cat) => (
            <NextLink
              key={cat.id}
              href={`/shop?category=${cat.slug}`}
              className="group relative aspect-[4/5] rounded-lg overflow-hidden border border-cream-200 shadow-sm hover:shadow-xl transition-all duration-500"
            >
              <img
                src={cat.image || 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b'}
                alt={cat.name}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/85 via-stone-950/30 to-transparent transition-opacity group-hover:from-maroon-950/90" />

              <div className="absolute inset-0 p-4 sm:p-5 flex flex-col justify-end text-cream-50">
                <span className="text-[10px] uppercase tracking-widest text-gold-400 font-semibold mb-1 opacity-90">
                  Explore Saree
                </span>
                <h3 className="font-serif text-lg sm:text-xl font-bold tracking-wide group-hover:text-gold-200 transition">
                  {cat.name}
                </h3>
                <p className="text-xs text-stone-300 mt-1 line-clamp-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {cat.description}
                </p>
              </div>
            </NextLink>
          ))}
        </div>
      </section>

      {/* 3. FEATURED PRODUCTS (THE HEIRLOOM EDIT) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10 pb-4 border-b border-cream-200">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-gold-600 font-semibold mb-1">
              Curated Masterpieces
            </p>
            <h2 className="font-serif text-3xl font-bold text-stone-900">
              Featured Sarees
            </h2>
          </div>
          <NextLink
            href="/shop?featured=true"
            className="text-xs uppercase tracking-widest font-bold text-maroon-800 hover:text-maroon-600 flex items-center gap-1.5 transition"
          >
            <span>View All Featured</span>
            <ArrowRight className="w-4 h-4" />
          </NextLink>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 4. BRAND STORY & CRAFTSMANSHIP SECTION */}
      <section className="bg-[#f7f3eb] py-16 sm:py-20 border-y border-cream-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Imagery Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="rounded-lg overflow-hidden shadow-lg border border-gold-500/20 aspect-[3/4]">
                  <img
                    src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80"
                    alt="Artisan Saree Weaving"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4 bg-maroon-900 text-gold-200 rounded-lg shadow-md border border-gold-500/30">
                  <p className="font-serif text-2xl font-bold">100%</p>
                  <p className="text-xs uppercase tracking-wider text-stone-300">Pure Mulberry Silk & Authentic Zari</p>
                </div>
              </div>

              <div className="space-y-4 pt-8">
                <div className="p-4 bg-white text-stone-900 rounded-lg shadow-md border border-cream-200">
                  <p className="font-serif text-2xl font-bold text-maroon-900">45+ Days</p>
                  <p className="text-xs uppercase tracking-wider text-stone-500">Handloom Loom Crafting per Bridal Saree</p>
                </div>
                <div className="rounded-lg overflow-hidden shadow-lg border border-gold-500/20 aspect-[3/4]">
                  <img
                    src="https://images.unsplash.com/photo-1596704017254-9b121068fb31?auto=format&fit=crop&w=800&q=80"
                    alt="Pakistani Saree Drape Details"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Right Narrative */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-gold-600 font-semibold">
                <Sparkles className="w-4 h-4 text-gold-500" />
                <span>The Rivaayat Heritage</span>
              </div>

              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-maroon-950 leading-tight">
                Honoring the Poise of the Traditional Pakistani Drape
              </h2>

              <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
                Founded with a passionate conviction to revive heirloom drapes, Rivaayat reinterprets age-old weaving dynasties for the discerning contemporary woman. From the bustling looms of Banaras to the delicate needlework ateliers of Lahore and Karachi, each saree narrates a tale of heritage, patience, and uncompromising beauty.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                <div className="flex gap-3">
                  <Feather className="w-6 h-6 text-gold-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-serif font-bold text-stone-900 text-base">Featherweight Drapes</h4>
                    <p className="text-xs text-stone-500 mt-1">Lightweight bamboo chiffons and diaphanous organzas engineered for all-day comfort.</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Gem className="w-6 h-6 text-gold-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-serif font-bold text-stone-900 text-base">Zardozi & Tilla Work</h4>
                    <p className="text-xs text-stone-500 mt-1">Master craftsman metallic hand embroidery using real dabka, cutdana, and badla.</p>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <NextLink
                  href="/about"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-maroon-800 hover:bg-maroon-900 text-gold-200 text-xs font-bold uppercase tracking-widest rounded transition"
                >
                  <span>Discover Our Atelier</span>
                  <ArrowRight className="w-4 h-4" />
                </NextLink>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. NEW ARRIVALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10 pb-4 border-b border-cream-200">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-gold-600 font-semibold mb-1">
              Fresh Off The Looms
            </p>
            <h2 className="font-serif text-3xl font-bold text-stone-900">
              New Arrivals
            </h2>
          </div>
          <NextLink
            href="/shop?newArrival=true"
            className="text-xs uppercase tracking-widest font-bold text-maroon-800 hover:text-maroon-600 flex items-center gap-1.5 transition"
          >
            <span>View All New Arrivals</span>
            <ArrowRight className="w-4 h-4" />
          </NextLink>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {newArrivals.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 6. PROMOTIONAL BRIDAL BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-2xl overflow-hidden bg-gradient-maroon text-cream-50 p-8 sm:p-12 lg:p-16 border border-gold-500/40 shadow-2xl">
          <div className="relative z-10 max-w-xl space-y-4">
            <span className="px-3 py-1 bg-gold-500/20 text-gold-300 text-xs font-bold uppercase tracking-[0.2em] rounded-full border border-gold-400/40">
              Private Bridal Appointments
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
              Curate Your Custom Bridal Trousseau
            </h2>
            <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
              Experience private bridal consultations with our senior couture drapers in Karachi and Lahore. Bespoke colorways, personalized zardozi monograms, and custom blouse tailoring.
            </p>
            <div className="pt-2 flex flex-wrap gap-4">
              <NextLink
                href="/shop?category=bridal"
                className="px-6 py-3.5 bg-gold-500 hover:bg-gold-400 text-maroon-950 font-bold text-xs uppercase tracking-widest rounded shadow-md transition"
              >
                Explore Bridal Sarees
              </NextLink>
              <a
                href="https://wa.me/923001234567"
                target="_blank"
                rel="noreferrer"
                className="px-6 py-3.5 bg-white/10 hover:bg-white/20 border border-white/30 text-white font-bold text-xs uppercase tracking-widest rounded transition flex items-center gap-2"
              >
                <span>Book WhatsApp Consultation</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
