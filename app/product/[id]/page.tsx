'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import NextLink from 'next/link';
import {
  Heart,
  ShoppingBag,
  Truck,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  ChevronRight,
  Plus,
  Minus,
  Check,
  Scissors,
  Loader2,
} from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import { ProductItem } from '@/lib/types';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { formatPKR } from '@/lib/utils';

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

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [product, setProduct] = useState<ProductItem | null>(null);
  const [related, setRelated] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [addedSuccess, setAddedSuccess] = useState(false);

  useEffect(() => {
    async function fetchProduct() {
      if (!id) return;
      setLoading(true);
      try {
        const res = await fetch(`/api/products/${id}`);
        if (res.ok) {
          const data = await res.json();
          setProduct(data.product);
          setRelated(data.related || []);
          if (data.product.colors && data.product.colors.length > 0) {
            setSelectedColor(data.product.colors[0]);
          }
        }
      } catch (err) {
        console.error('Error fetching product:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-stone-500">
        <Loader2 className="w-8 h-8 animate-spin text-gold-600 mb-3" />
        <p className="font-serif text-lg">Unfolding saree details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-4">
        <h2 className="font-serif text-2xl font-bold text-stone-900">Saree Not Found</h2>
        <p className="text-xs text-stone-500 mt-2">
          This saree design may have been archived or is no longer available.
        </p>
        <NextLink
          href="/shop"
          className="mt-6 px-6 py-2.5 bg-maroon-800 text-gold-200 text-xs font-bold uppercase tracking-wider rounded"
        >
          Return to Catalog
        </NextLink>
      </div>
    );
  }

  const isLiked = isInWishlist(product.id);
  const images = product.images.length > 0 ? product.images : ['https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b'];
  const activeImage = images[activeImageIndex] || images[0];

  const effectivePrice = product.discountPrice ? product.discountPrice : product.price;
  const hasDiscount = Boolean(product.discountPrice && product.discountPrice < product.price);
  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.discountPrice!) / product.price) * 100)
    : 0;

  const handleAddToCart = () => {
    addToCart(product, selectedColor, quantity);
    setAddedSuccess(true);
    setTimeout(() => setAddedSuccess(false), 2000);
  };

  const handleBuyNow = () => {
    addToCart(product, selectedColor, quantity);
    router.push('/checkout');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-16">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-stone-500 overflow-x-auto whitespace-nowrap pb-2">
        <NextLink href="/" className="hover:text-maroon-800">Home</NextLink>
        <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
        <NextLink href="/shop" className="hover:text-maroon-800">Shop Sarees</NextLink>
        <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
        <NextLink href={`/shop?category=${product.category?.slug}`} className="hover:text-maroon-800">
          {product.category?.name || 'Category'}
        </NextLink>
        <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
        <span className="text-stone-900 font-semibold truncate max-w-[200px] sm:max-w-none">{product.name}</span>
      </nav>

      {/* Main Product Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
        {/* Left: Image Gallery (7 cols) */}
        <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-4">
          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto shrink-0 pb-2 md:pb-0 max-h-[580px]">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-16 h-20 md:w-20 md:h-24 rounded overflow-hidden border-2 transition shrink-0 bg-cream-100 ${
                    activeImageIndex === idx
                      ? 'border-maroon-800 shadow-md ring-1 ring-maroon-800'
                      : 'border-cream-300 hover:border-gold-400 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`${product.name} view ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Main Large Image */}
          <div className="relative flex-1 aspect-[3/4] rounded-xl overflow-hidden bg-cream-100 border border-cream-200 shadow-lg group">
            <img
              src={activeImage}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />

            {/* Badges on Image */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {product.featured && (
                <span className="px-3 py-1 bg-maroon-900/90 text-gold-300 text-xs font-bold uppercase tracking-widest rounded shadow-sm">
                  Heirloom Collection
                </span>
              )}
              {hasDiscount && (
                <span className="px-3 py-1 bg-rose-700 text-white text-xs font-bold uppercase tracking-widest rounded shadow-sm">
                  {discountPercent}% OFF
                </span>
              )}
            </div>

            {/* Wishlist Button */}
            <button
              onClick={() => toggleWishlist(product)}
              className={`absolute top-4 right-4 p-3 rounded-full backdrop-blur-md transition shadow-md ${
                isLiked
                  ? 'bg-rose-50 text-rose-600 border border-rose-300 scale-105'
                  : 'bg-white/80 hover:bg-white text-stone-700 hover:text-rose-600'
              }`}
              title="Add to Wishlist"
            >
              <Heart className={`w-5 h-5 ${isLiked ? 'fill-rose-600' : ''}`} />
            </button>
          </div>
        </div>

        {/* Right: Product Details & Purchase Form (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[11px] uppercase tracking-[0.25em] text-gold-600 font-bold">
                {product.category?.name || 'Saree'}
              </span>
              <span className="text-stone-300">•</span>
              <span className="text-xs text-stone-500 font-mono">SKU: {product.sku}</span>
            </div>

            <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-stone-900 leading-snug">
              {product.name}
            </h1>

            {/* Price block */}
            <div className="mt-4 flex items-baseline gap-3">
              <span className="text-2xl sm:text-3xl font-bold text-maroon-900 font-sans">
                {formatPKR(effectivePrice)}
              </span>
              {hasDiscount && (
                <span className="text-base text-stone-400 line-through">
                  {formatPKR(product.price)}
                </span>
              )}
              {hasDiscount && (
                <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Save {formatPKR(product.price - product.discountPrice!)}
                </span>
              )}
            </div>

            <p className="text-xs text-stone-500 mt-1">
              Inclusive of all taxes. Free Express Delivery across Pakistan.
            </p>
          </div>

          {/* Color Selection */}
          {product.colors && product.colors.length > 0 && (
            <div className="border-t border-cream-200 pt-5">
              <div className="flex items-center justify-between text-xs mb-2.5">
                <span className="font-bold uppercase tracking-wider text-stone-700">
                  Selected Color: <span className="text-maroon-900 font-semibold">{selectedColor}</span>
                </span>
              </div>
              <div className="flex flex-wrap gap-2.5">
                {product.colors.map((color) => {
                  const hex = COLOR_MAP[color] || '#D4AF37';
                  const isSelected = selectedColor === color;
                  return (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setSelectedColor(color)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs transition ${
                        isSelected
                          ? 'border-maroon-800 bg-maroon-50 text-maroon-950 font-bold ring-2 ring-maroon-800/30'
                          : 'border-stone-300 text-stone-700 hover:border-stone-400 bg-white'
                      }`}
                    >
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-stone-300"
                        style={{ backgroundColor: hex }}
                      />
                      <span>{color}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Fabric & Specifications */}
          <div className="border-t border-cream-200 pt-5 grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-white rounded border border-cream-200">
              <span className="text-stone-400 uppercase tracking-wider block text-[10px]">Fabric / Weave</span>
              <span className="font-semibold text-stone-800 text-sm mt-0.5 block">{product.fabric}</span>
            </div>
            <div className="p-3 bg-white rounded border border-cream-200">
              <span className="text-stone-400 uppercase tracking-wider block text-[10px]">Availability</span>
              <span className={`font-semibold text-sm mt-0.5 block ${product.stock > 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                {product.stock > 0 ? `In Stock (${product.stock} units)` : 'Sold Out'}
              </span>
            </div>
          </div>

          {/* Quantity & Action Buttons */}
          <div className="border-t border-cream-200 pt-5 space-y-4">
            <div className="flex items-center gap-4">
              <span className="text-xs uppercase tracking-wider text-stone-700 font-bold">Quantity:</span>
              <div className="flex items-center border border-stone-300 rounded bg-white">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                  className="p-2 text-stone-600 hover:bg-cream-100 disabled:opacity-30 transition"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 py-1 text-sm font-semibold text-stone-900 min-w-[32px] text-center">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  disabled={quantity >= product.stock}
                  className="p-2 text-stone-600 hover:bg-cream-100 disabled:opacity-30 transition"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className={`py-3.5 px-6 rounded text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 shadow-md transition ${
                  product.stock <= 0
                    ? 'bg-stone-300 text-stone-500 cursor-not-allowed'
                    : addedSuccess
                    ? 'bg-emerald-700 text-white'
                    : 'bg-maroon-800 hover:bg-maroon-900 text-gold-200'
                }`}
              >
                {addedSuccess ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Added to Bag</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Bag</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleBuyNow}
                disabled={product.stock <= 0}
                className="py-3.5 px-6 bg-gold-600 hover:bg-gold-500 text-stone-950 rounded text-xs font-bold uppercase tracking-widest shadow-md transition"
              >
                Buy Now
              </button>
            </div>
          </div>

          {/* Description & Care Accordions */}
          <div className="border-t border-cream-200 pt-5 space-y-4 text-xs text-stone-600 leading-relaxed">
            <div>
              <h4 className="font-serif text-sm font-bold text-stone-900 uppercase tracking-wider mb-1">
                The Heritage Story
              </h4>
              <p>{product.description}</p>
            </div>

            {product.blouseDetails && (
              <div className="p-3 bg-cream-100/70 rounded-lg border border-cream-200 flex items-start gap-2.5">
                <Scissors className="w-4 h-4 text-gold-700 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-stone-800 block">Blouse Piece Included</span>
                  <p className="text-stone-600 mt-0.5">{product.blouseDetails}</p>
                </div>
              </div>
            )}

            {product.careGuide && (
              <div>
                <h4 className="font-serif text-sm font-bold text-stone-900 uppercase tracking-wider mb-1">
                  Artisan Care Instructions
                </h4>
                <p>{product.careGuide}</p>
              </div>
            )}
          </div>

          {/* Trust badges */}
          <div className="border-t border-cream-200 pt-5 space-y-2 text-xs text-stone-600">
            <div className="flex items-center gap-2.5">
              <Truck className="w-4 h-4 text-gold-600 shrink-0" />
              <span>Complimentary nationwide delivery on orders over PKR 15,000 (2–4 working days).</span>
            </div>
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-gold-600 shrink-0" />
              <span>100% Genuine Handloom & Hand-Crafted Pakistani Coutures.</span>
            </div>
            <div className="flex items-center gap-2.5">
              <RotateCcw className="w-4 h-4 text-gold-600 shrink-0" />
              <span>Cash on Delivery available nationwide. Hassle-free exchanges for unworn items.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products Section */}
      {related.length > 0 && (
        <div className="border-t border-cream-200 pt-14">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-[11px] uppercase tracking-[0.25em] text-gold-600 font-semibold">
              More In This Collection
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
              Related Sarees
            </h2>
            <div className="w-12 h-0.5 bg-gold-500 mx-auto mt-3" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {related.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
