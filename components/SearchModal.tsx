'use client';

import React, { useState, useEffect, useRef } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, X, ArrowRight, Sparkles, Loader2 } from 'lucide-react';
import { ProductItem } from '@/lib/types';
import { formatPKR } from '@/lib/utils';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    } else {
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/products?search=${encodeURIComponent(query.trim())}`);
        if (res.ok) {
          const data = await res.json();
          setResults(data.products || []);
        }
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onClose();
      router.push(`/shop?search=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleQuickKeyword = (kw: string) => {
    setQuery(kw);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="relative min-h-screen flex items-start justify-center p-4 sm:p-6 lg:p-8 pt-16">
        <div className="relative w-full max-w-2xl bg-[#fdfbf7] rounded-xl shadow-2xl border border-cream-200 overflow-hidden animate-fade-in">
          {/* Header & Input */}
          <form onSubmit={handleSubmit} className="relative border-b border-cream-200">
            <div className="flex items-center px-4 py-3 sm:px-6">
              <Search className="w-5 h-5 text-stone-400 shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by saree name, color, wedding, silk, organza, fabric..."
                className="w-full pl-3 pr-8 py-2 text-stone-900 placeholder-stone-400 bg-transparent text-sm sm:text-base focus:outline-none font-medium"
              />
              {loading && <Loader2 className="w-4 h-4 text-gold-600 animate-spin mr-2 shrink-0" />}
              <button
                type="button"
                onClick={onClose}
                className="p-1 text-stone-400 hover:text-stone-700 rounded-full hover:bg-cream-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </form>

          {/* Popular Searches & Suggestions */}
          {!query && (
            <div className="p-6">
              <p className="text-xs uppercase tracking-wider text-stone-400 font-semibold mb-3">
                Popular Searches
              </p>
              <div className="flex flex-wrap gap-2">
                {['Red Wedding Saree', 'Organza', 'Black Chiffon', 'Pure Banarasi Silk', 'Maroon Velvet', 'Gota Patti', 'Linen Work'].map(
                  (tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => handleQuickKeyword(tag)}
                      className="px-3 py-1.5 bg-white border border-cream-200 hover:border-gold-500 rounded-full text-xs text-stone-700 hover:text-maroon-900 transition flex items-center gap-1.5 shadow-sm"
                    >
                      <Sparkles className="w-3 h-3 text-gold-500" />
                      <span>{tag}</span>
                    </button>
                  )
                )}
              </div>
            </div>
          )}

          {/* Results container */}
          {query.trim() && (
            <div className="max-h-[60vh] overflow-y-auto p-4 sm:p-6">
              {loading ? (
                <div className="py-12 text-center text-stone-400">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto text-gold-600 mb-2" />
                  <p className="text-xs">Searching Rivaayat archives...</p>
                </div>
              ) : results.length > 0 ? (
                <div>
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-stone-200">
                    <p className="text-xs text-stone-500">
                      Found <span className="font-semibold text-stone-900">{results.length}</span> matching sarees for &quot;{query}&quot;
                    </p>
                    <button
                      type="button"
                      onClick={handleSubmit}
                      className="text-xs font-semibold text-maroon-800 hover:underline flex items-center gap-1"
                    >
                      <span>View All in Catalog</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="space-y-3">
                    {results.slice(0, 6).map((item) => (
                      <NextLink
                        key={item.id}
                        href={`/product/${item.slug}`}
                        onClick={onClose}
                        className="flex items-center gap-4 p-2.5 rounded-lg hover:bg-white border border-transparent hover:border-cream-200 transition group"
                      >
                        <div className="w-14 h-16 rounded overflow-hidden bg-cream-100 shrink-0">
                          <img
                            src={item.images[0] || 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b'}
                            alt={item.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="text-[10px] uppercase tracking-wider text-gold-600 font-semibold">
                            {item.category?.name || 'Saree'} • {item.fabric}
                          </span>
                          <h4 className="font-serif text-sm font-semibold text-stone-900 truncate group-hover:text-maroon-800">
                            {item.name}
                          </h4>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs font-bold text-maroon-900">
                              {formatPKR(item.discountPrice || item.price)}
                            </span>
                            {item.discountPrice && (
                              <span className="text-[11px] text-stone-400 line-through">
                                {formatPKR(item.price)}
                              </span>
                            )}
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-stone-300 group-hover:text-maroon-800 transition -translate-x-1 group-hover:translate-x-0" />
                      </NextLink>
                    ))}
                  </div>
                </div>
              ) : (
                /* No Products Found State */
                <div className="py-12 text-center">
                  <div className="w-12 h-12 rounded-full bg-cream-200 flex items-center justify-center text-stone-400 mx-auto mb-3">
                    <Search className="w-6 h-6" />
                  </div>
                  <h4 className="font-serif text-lg font-semibold text-stone-800">
                    No sarees found
                  </h4>
                  <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
                    We could not find any saree matching &quot;{query}&quot;. Try searching for colors like &quot;red&quot;, &quot;black&quot;, or fabrics like &quot;silk&quot; or &quot;organza&quot;.
                  </p>
                  <div className="mt-4 flex flex-wrap justify-center gap-2">
                    {['Wedding', 'Pure Silk', 'Chiffon', 'Bridal'].map((term) => (
                      <button
                        key={term}
                        type="button"
                        onClick={() => handleQuickKeyword(term)}
                        className="px-2.5 py-1 text-xs bg-white border border-stone-300 rounded hover:border-maroon-800 transition"
                      >
                        Try &quot;{term}&quot;
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
