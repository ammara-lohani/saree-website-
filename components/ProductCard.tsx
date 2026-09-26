'use client';

import React, { useState } from 'react';
import NextLink from 'next/link';
import { Heart, ShoppingBag, Eye, Check } from 'lucide-react';
import { ProductItem } from '@/lib/types';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { formatPKR } from '@/lib/utils';

// Mapping color names to CSS colors or circles
const COLOR_MAP: Record<string, string> = {
  Maroon: '#5A121E',
  Red: '#B91C1C',
  Gold: '#D4AF37',
  Black: '#171717',
  White: '#F8FAFC',
  Pink: '#F472B6',
  Green: '#15803D',
  Blue: '#1D4ED8',
  Purple: '#7E22CE',
  Beige: '#D5BEA3',
  Other: '#9CA3AF',
};

export default function ProductCard({ product }: { product: ProductItem }) {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [selectedColor, setSelectedColor] = useState<string>(
    product.colors && product.colors[0] ? product.colors[0] : 'Standard'
  );
  const [isHovered, setIsHovered] = useState(false);
  const [addedAnimation, setAddedAnimation] = useState(false);

  const isLiked = isInWishlist(product.id);
  const primaryImage = product.images[0] || 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b';
  const secondaryImage = product.images[1] || primaryImage;

  const hasDiscount = Boolean(product.discountPrice && product.discountPrice < product.price);
  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.discountPrice!) / product.price) * 100)
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, selectedColor, 1);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1200);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  return (
    <div
      className="group relative bg-white rounded-lg border border-cream-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-cream-100">
        <NextLink href={`/product/${product.slug}`} className="block w-full h-full">
          <img
            src={isHovered ? secondaryImage : primaryImage}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        </NextLink>

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10 pointer-events-none">
          {product.featured && (
            <span className="px-2 py-0.5 bg-maroon-900/90 text-gold-300 text-[10px] uppercase font-bold tracking-widest rounded shadow-sm backdrop-blur-xs">
              Heirloom
            </span>
          )}
          {product.newArrival && (
            <span className="px-2 py-0.5 bg-gold-600/90 text-maroon-950 text-[10px] uppercase font-bold tracking-widest rounded shadow-sm">
              New Arrival
            </span>
          )}
          {hasDiscount && (
            <span className="px-2 py-0.5 bg-rose-700 text-white text-[10px] uppercase font-bold tracking-widest rounded shadow-sm">
              {discountPercent}% OFF
            </span>
          )}
          {product.stock <= 3 && product.stock > 0 && (
            <span className="px-2 py-0.5 bg-amber-600 text-white text-[10px] uppercase font-bold tracking-widest rounded shadow-sm">
              Only {product.stock} Left
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistToggle}
          aria-label="Save to Wishlist"
          className={`absolute top-2.5 right-2.5 p-2 rounded-full backdrop-blur-md transition-all duration-200 z-10 shadow-sm ${
            isLiked
              ? 'bg-rose-50 text-rose-600 border border-rose-200 scale-105'
              : 'bg-white/80 hover:bg-white text-stone-700 hover:text-rose-600'
          }`}
        >
          <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-600' : ''}`} />
        </button>

        {/* Quick Add Overlay on hover for desktop */}
        <div className="absolute inset-x-3 bottom-3 z-10 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 hidden sm:block">
          <button
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
            className={`w-full py-2.5 px-4 rounded font-bold text-xs uppercase tracking-widest shadow-lg flex items-center justify-center gap-2 transition ${
              product.stock <= 0
                ? 'bg-stone-300 text-stone-500 cursor-not-allowed'
                : addedAnimation
                ? 'bg-emerald-700 text-white'
                : 'bg-maroon-800 hover:bg-maroon-900 text-gold-200'
            }`}
          >
            {addedAnimation ? (
              <>
                <Check className="w-4 h-4" />
                <span>Added to Bag</span>
              </>
            ) : product.stock <= 0 ? (
              <span>Sold Out</span>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" />
                <span>Quick Add</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Product Information */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-[11px] text-stone-400 uppercase tracking-widest mb-1">
            <span>{product.category?.name || 'Saree'}</span>
            <span className="text-stone-500">{product.fabric}</span>
          </div>

          <NextLink href={`/product/${product.slug}`}>
            <h3 className="font-serif text-base font-semibold text-stone-900 hover:text-maroon-800 transition line-clamp-2 leading-snug">
              {product.name}
            </h3>
          </NextLink>

          {/* Color Swatches */}
          {product.colors && product.colors.length > 0 && (
            <div className="flex items-center gap-1.5 mt-2.5">
              {product.colors.map((color) => {
                const hexColor = COLOR_MAP[color] || '#D4AF37';
                const isSelected = selectedColor === color;
                return (
                  <button
                    key={color}
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setSelectedColor(color);
                    }}
                    title={color}
                    className={`w-4 h-4 rounded-full border transition-all ${
                      isSelected
                        ? 'ring-2 ring-maroon-800 ring-offset-1 scale-110'
                        : 'border-stone-300 hover:scale-105'
                    }`}
                    style={{ backgroundColor: hexColor }}
                  />
                );
              })}
              <span className="text-[10px] text-stone-500 ml-1 font-medium">
                {selectedColor}
              </span>
            </div>
          )}
        </div>

        {/* Price & Mobile Add to Cart */}
        <div className="mt-4 pt-3 border-t border-cream-200 flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-sm font-bold text-maroon-900 font-sans">
                {formatPKR(product.discountPrice || product.price)}
              </span>
              {hasDiscount && (
                <span className="text-xs text-stone-400 line-through">
                  {formatPKR(product.price)}
                </span>
              )}
            </div>
          </div>

          {/* Mobile direct add button */}
          <div className="sm:hidden">
            <button
              onClick={handleAddToCart}
              disabled={product.stock <= 0}
              className="p-2 bg-maroon-800 text-gold-200 rounded-full"
              aria-label="Add to cart"
            >
              <ShoppingBag className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
