import React from 'react';
import NextLink from 'next/link';
import { db } from '@/lib/db';
import { ArrowRight, Sparkles } from 'lucide-react';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getCategories() {
  const categories = await db.category.findMany({
    where: { active: true },
    orderBy: { name: 'asc' },
    include: {
      _count: {
        select: { products: true },
      },
    },
  });
  return categories;
}

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      {/* Editorial Header */}
      <div className="text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gold-500/40 bg-maroon-950/10 mb-4">
          <Sparkles className="w-3.5 h-3.5 text-gold-600" />
          <span className="text-xs uppercase tracking-[0.25em] text-gold-700 font-bold">
            Haute Couture Archives
          </span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-stone-900 tracking-tight">
          Saree Categories & Occasions
        </h1>
        <p className="text-stone-600 text-xs sm:text-sm mt-3 leading-relaxed">
          From opulent Banarasi wedding heirlooms and diaphanous evening chiffons to crisp boardroom linens. Discover drapes woven for every chapter of life.
        </p>
        <div className="w-16 h-0.5 bg-gold-500 mx-auto mt-5" />
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
        {categories.map((cat) => (
          <NextLink
            key={cat.id}
            href={`/shop?category=${cat.slug}`}
            className="group relative aspect-[3/4] rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 border border-cream-200 flex flex-col justify-end"
          >
            <img
              src={cat.image || 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b'}
              alt={cat.name}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-950/40 to-transparent transition-opacity group-hover:from-maroon-950/95" />

            <div className="relative p-5 text-cream-50 space-y-2 z-10">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-widest text-gold-400 font-bold">
                  Collection
                </span>
                <span className="px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-[10px] font-bold text-cream-100">
                  {cat._count.products} {cat._count.products === 1 ? 'Saree' : 'Sarees'}
                </span>
              </div>

              <h2 className="font-serif text-2xl font-bold group-hover:text-gold-200 transition">
                {cat.name}
              </h2>

              <p className="text-xs text-stone-300 line-clamp-2 leading-relaxed opacity-90">
                {cat.description || 'Heirloom drapes crafted with authentic artisan handwork.'}
              </p>

              <div className="pt-2 flex items-center gap-1.5 text-xs font-bold text-gold-400 group-hover:text-gold-300 uppercase tracking-wider">
                <span>Explore Saree</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </NextLink>
        ))}
      </div>
    </div>
  );
}
