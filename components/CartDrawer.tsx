'use client';

import React from 'react';
import NextLink from 'next/link';
import Image from 'next/image';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Sparkles } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatPKR } from '@/lib/utils';

export default function CartDrawer() {
  const {
    items,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    subtotal,
    shippingFee,
    total,
    freeShippingThreshold,
  } = useCart();

  if (!isCartOpen) return null;

  const amountNeededForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const freeShippingProgress = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#fdfbf7] shadow-2xl flex flex-col border-l border-cream-200">
          {/* Header */}
          <div className="p-5 border-b border-cream-200 flex items-center justify-between bg-white">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-maroon-800" />
              <h2 className="font-serif text-xl font-bold tracking-wider text-maroon-900 uppercase">
                Your Shopping Bag ({items.length})
              </h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 text-stone-500 hover:text-stone-800 rounded-full hover:bg-cream-100 transition"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Meter */}
          <div className="bg-cream-100/80 px-5 py-3 border-b border-cream-200 text-xs">
            {amountNeededForFreeShipping > 0 ? (
              <p className="text-stone-700 font-medium">
                Add <span className="font-bold text-maroon-800">{formatPKR(amountNeededForFreeShipping)}</span> more for{' '}
                <span className="text-gold-700 font-semibold">Free Express Delivery</span> across Pakistan!
              </p>
            ) : (
              <p className="text-emerald-800 font-semibold flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                Congratulations! You’ve unlocked Free Express Delivery!
              </p>
            )}
            <div className="w-full bg-cream-300 h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-gold-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 rounded-full bg-cream-200 flex items-center justify-center text-stone-400 mb-4">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-lg font-semibold text-stone-800">Your bag is empty</h3>
                <p className="text-xs text-stone-500 mt-1 max-w-xs">
                  Discover our handcrafted Pakistani drapes, pure silks and bridal masterpieces.
                </p>
                <NextLink
                  href="/shop"
                  onClick={() => setIsCartOpen(false)}
                  className="mt-6 px-6 py-2.5 bg-maroon-800 text-gold-200 font-semibold text-xs uppercase tracking-widest rounded hover:bg-maroon-900 transition"
                >
                  Explore Sarees
                </NextLink>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-3 bg-white rounded-lg border border-cream-200 shadow-sm"
                >
                  {/* Thumbnail */}
                  <div className="relative w-20 h-24 rounded bg-cream-100 overflow-hidden shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-1">
                        <NextLink
                          href={`/product/${item.slug || item.productId}`}
                          onClick={() => setIsCartOpen(false)}
                          className="font-serif text-sm font-semibold text-stone-900 hover:text-maroon-800 line-clamp-1"
                        >
                          {item.name}
                        </NextLink>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-stone-400 hover:text-rose-600 transition p-1"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="mt-1 flex items-center gap-2">
                        <span className="inline-block text-[11px] px-2 py-0.5 bg-cream-100 text-stone-700 rounded border border-cream-200 font-medium">
                          Color: {item.selectedColor}
                        </span>
                      </div>

                      <p className="mt-1 text-xs font-bold text-maroon-900">
                        {formatPKR(item.price)}
                      </p>
                    </div>

                    {/* Quantity controls */}
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-stone-100">
                      <div className="flex items-center border border-stone-200 rounded">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1 text-stone-600 hover:bg-cream-100 transition"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2.5 py-0.5 text-xs font-semibold text-stone-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 text-stone-600 hover:bg-cream-100 transition"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <span className="text-xs font-semibold text-stone-700">
                        {formatPKR(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Calculations */}
          {items.length > 0 && (
            <div className="p-5 bg-white border-t border-cream-200 space-y-3">
              <div className="space-y-1.5 text-xs text-stone-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-stone-900">{formatPKR(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery across Pakistan</span>
                  <span>
                    {shippingFee === 0 ? (
                      <span className="text-emerald-700 font-bold uppercase tracking-wider text-[11px]">Free</span>
                    ) : (
                      formatPKR(shippingFee)
                    )}
                  </span>
                </div>
                <div className="border-t border-stone-200 pt-2 flex justify-between text-sm font-bold text-stone-900">
                  <span className="font-serif text-base">Estimated Total</span>
                  <span className="font-serif text-base text-maroon-900">{formatPKR(total)}</span>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <NextLink
                  href="/checkout"
                  onClick={() => setIsCartOpen(false)}
                  className="w-full bg-maroon-800 hover:bg-maroon-900 text-gold-200 py-3 rounded text-center text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </NextLink>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="w-full py-2 border border-stone-300 hover:bg-cream-100 text-stone-700 text-xs font-semibold rounded uppercase tracking-wider transition"
                  >
                    Continue Shopping
                  </button>
                  <NextLink
                    href="/cart"
                    onClick={() => setIsCartOpen(false)}
                    className="w-full py-2 bg-cream-200 hover:bg-cream-300 text-maroon-900 text-xs font-semibold rounded text-center uppercase tracking-wider transition"
                  >
                    View Full Bag
                  </NextLink>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
