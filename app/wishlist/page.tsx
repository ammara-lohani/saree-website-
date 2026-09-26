'use client';

import React from 'react';
import NextLink from 'next/link';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';
import { Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { formatPKR } from '@/lib/utils';

export default function WishlistPage() {
  const { items, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-4 border border-rose-200">
          <Heart className="w-8 h-8" />
        </div>
        <h1 className="font-serif text-3xl font-bold text-stone-900">Your Wishlist is Empty</h1>
        <p className="text-xs sm:text-sm text-stone-500 mt-2 max-w-sm mx-auto">
          Save your favourite Pakistani couture sarees here to review later or prepare for upcoming wedding celebrations.
        </p>
        <div className="mt-8">
          <NextLink
            href="/shop"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-maroon-800 text-gold-200 text-xs font-bold uppercase tracking-widest rounded shadow-md hover:bg-maroon-900 transition"
          >
            <span>Explore Collections</span>
            <ArrowRight className="w-4 h-4" />
          </NextLink>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="border-b border-cream-200 pb-6 mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-[11px] uppercase tracking-[0.25em] text-gold-600 font-semibold">
            Bespoke Curations
          </span>
          <h1 className="font-serif text-3xl font-bold text-stone-900 mt-1">
            My Wishlist ({items.length} {items.length === 1 ? 'saree' : 'sarees'})
          </h1>
        </div>

        <NextLink
          href="/shop"
          className="text-xs font-bold uppercase tracking-wider text-maroon-800 hover:text-maroon-900"
        >
          ← Continue Shopping
        </NextLink>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {items.map((product) => {
          const effectivePrice = product.discountPrice ? product.discountPrice : product.price;
          const image = product.images[0] || 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b';

          return (
            <div
              key={product.id}
              className="bg-white rounded-lg border border-cream-200 overflow-hidden shadow-xs hover:shadow-lg transition flex flex-col justify-between"
            >
              <div className="relative aspect-[3/4] bg-cream-100 overflow-hidden">
                <NextLink href={`/product/${product.slug}`}>
                  <img
                    src={image}
                    alt={product.name}
                    className="w-full h-full object-cover hover:scale-105 transition duration-500"
                  />
                </NextLink>

                <button
                  onClick={() => removeFromWishlist(product.id)}
                  className="absolute top-2.5 right-2.5 p-2 bg-white/90 hover:bg-white text-stone-500 hover:text-rose-600 rounded-full shadow-sm transition"
                  title="Remove from wishlist"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-gold-600 font-semibold block">
                    {product.category?.name || 'Saree'}
                  </span>
                  <NextLink href={`/product/${product.slug}`}>
                    <h3 className="font-serif text-sm font-semibold text-stone-900 hover:text-maroon-800 line-clamp-2 mt-0.5">
                      {product.name}
                    </h3>
                  </NextLink>
                  <p className="text-xs font-bold text-maroon-900 mt-2 font-sans">
                    {formatPKR(effectivePrice)}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-cream-200">
                  <button
                    onClick={() => {
                      addToCart(product, product.colors[0] || 'Standard', 1);
                      removeFromWishlist(product.id);
                    }}
                    disabled={product.stock <= 0}
                    className="w-full py-2 bg-maroon-800 hover:bg-maroon-900 text-gold-200 text-xs font-bold uppercase tracking-wider rounded flex items-center justify-center gap-1.5 transition disabled:opacity-50"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Move to Bag</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
