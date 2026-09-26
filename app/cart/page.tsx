'use client';

import React from 'react';
import NextLink from 'next/link';
import { useCart } from '@/context/CartContext';
import { formatPKR } from '@/lib/utils';
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

export default function CartPage() {
  const {
    items,
    totalItems,
    subtotal,
    shippingFee,
    total,
    freeShippingThreshold,
    updateQuantity,
    removeFromCart,
    clearCart,
  } = useCart();

  const amountNeeded = Math.max(0, freeShippingThreshold - subtotal);
  const progressPercent = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 rounded-full bg-cream-200 flex items-center justify-center text-stone-400 mx-auto mb-5">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h1 className="font-serif text-3xl font-bold text-stone-900">Your Shopping Bag is Empty</h1>
        <p className="text-sm text-stone-500 mt-2 max-w-md mx-auto leading-relaxed">
          Looks like you haven&apos;t added any luxury sarees to your bag yet. Explore our handcrafted Pakistani banarasi, chiffon, and bridal designs.
        </p>
        <div className="mt-8">
          <NextLink
            href="/shop"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-maroon-800 text-gold-200 text-xs font-bold uppercase tracking-widest rounded shadow-lg hover:bg-maroon-900 transition"
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
            Review Your Order
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 mt-1">
            Shopping Bag ({totalItems} {totalItems === 1 ? 'item' : 'items'})
          </h1>
        </div>

        <button
          onClick={clearCart}
          className="text-xs text-rose-700 hover:text-rose-900 underline font-medium self-start sm:self-auto"
        >
          Clear Entire Bag
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Items List (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          {/* Free Shipping Notification */}
          <div className="p-4 bg-cream-100 rounded-lg border border-cream-200 text-xs text-stone-700">
            {amountNeeded > 0 ? (
              <p>
                Add <span className="font-bold text-maroon-800">{formatPKR(amountNeeded)}</span> more of handcrafted sarees to qualify for{' '}
                <span className="text-gold-700 font-bold">Complimentary Express Delivery</span> across Pakistan!
              </p>
            ) : (
              <p className="text-emerald-800 font-bold flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                Congratulations! You have unlocked Free Nationwide Express Delivery!
              </p>
            )}
            <div className="w-full bg-cream-300 h-2 rounded-full mt-2.5 overflow-hidden">
              <div
                className="bg-gold-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Table / Cards */}
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row gap-4 p-4 sm:p-5 bg-white rounded-lg border border-cream-200 shadow-xs"
              >
                {/* Thumbnail */}
                <div className="w-24 h-32 rounded bg-cream-100 overflow-hidden shrink-0 mx-auto sm:mx-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <NextLink
                        href={`/product/${item.slug || item.productId}`}
                        className="font-serif text-base sm:text-lg font-bold text-stone-900 hover:text-maroon-800 transition line-clamp-1"
                      >
                        {item.name}
                      </NextLink>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-stone-400 hover:text-rose-600 p-1 transition"
                        title="Remove from cart"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="mt-1 flex items-center gap-2 text-xs text-stone-500">
                      <span className="px-2 py-0.5 bg-cream-100 rounded border border-cream-200 font-medium">
                        Color: {item.selectedColor}
                      </span>
                      <span>•</span>
                      <span>Unit Price: {formatPKR(item.price)}</span>
                    </div>
                  </div>

                  {/* Quantity and Subtotal Row */}
                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-stone-100">
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-stone-500 font-medium">Quantity:</span>
                      <div className="flex items-center border border-stone-300 rounded bg-white">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1.5 text-stone-600 hover:bg-cream-100"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-3 text-xs font-bold text-stone-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1.5 text-stone-600 hover:bg-cream-100"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-xs text-stone-400 block">Total</span>
                      <span className="font-serif text-base sm:text-lg font-bold text-maroon-900">
                        {formatPKR(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4">
            <NextLink
              href="/shop"
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-maroon-800 hover:text-maroon-900"
            >
              <span>← Continue Shopping Sarees</span>
            </NextLink>
          </div>
        </div>

        {/* Order Summary (4 cols) */}
        <div className="lg:col-span-4">
          <div className="bg-white p-6 rounded-xl border border-cream-200 shadow-sm space-y-6 sticky top-28">
            <h3 className="font-serif text-lg font-bold text-stone-900 tracking-wider uppercase border-b border-cream-200 pb-3">
              Order Summary
            </h3>

            <div className="space-y-3 text-xs sm:text-sm text-stone-600">
              <div className="flex justify-between">
                <span>Subtotal ({totalItems} items)</span>
                <span className="font-bold text-stone-900">{formatPKR(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Nationwide Shipping</span>
                <span>
                  {shippingFee === 0 ? (
                    <span className="text-emerald-700 font-bold uppercase text-xs tracking-wider">Free Delivery</span>
                  ) : (
                    formatPKR(shippingFee)
                  )}
                </span>
              </div>
              <div className="flex justify-between text-xs text-stone-400">
                <span>Estimated Sales Tax</span>
                <span>PKR 0 (Inclusive)</span>
              </div>

              <div className="border-t border-stone-200 pt-3 flex justify-between items-baseline text-base sm:text-lg font-bold text-stone-900">
                <span className="font-serif">Estimated Total</span>
                <span className="font-serif text-xl sm:text-2xl text-maroon-900">
                  {formatPKR(total)}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <NextLink
                href="/checkout"
                className="w-full py-4 bg-maroon-800 hover:bg-maroon-900 text-gold-200 rounded text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg transition"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </NextLink>

              <div className="text-[11px] text-stone-500 text-center">
                Cash on Delivery (COD) supported nationwide.
              </div>
            </div>

            <div className="border-t border-cream-200 pt-4 space-y-2 text-xs text-stone-500">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-gold-600 shrink-0" />
                <span>Standard delivery: 2–4 business days</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-gold-600 shrink-0" />
                <span>Authentic Pakistani handcraft guarantee</span>
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-gold-600 shrink-0" />
                <span>Easy exchange within 7 days</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
