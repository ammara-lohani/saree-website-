'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import ProductCard from '@/components/ProductCard';
import { ProductItem, CategoryItem } from '@/lib/types';
import {
  SlidersHorizontal,
  X,
  ChevronDown,
  RotateCcw,
  Search,
  Sparkles,
  Loader2,
  Check,
} from 'lucide-react';
import { formatPKR } from '@/lib/utils';

const COLORS_LIST = [
  { name: 'All', hex: 'transparent' },
  { name: 'Maroon', hex: '#5A121E' },
  { name: 'Red', hex: '#B91C1C' },
  { name: 'Gold', hex: '#D4AF37' },
  { name: 'Black', hex: '#171717' },
  { name: 'White', hex: '#F8FAFC' },
  { name: 'Pink', hex: '#F472B6' },
  { name: 'Green', hex: '#15803D' },
  { name: 'Blue', hex: '#1D4ED8' },
  { name: 'Purple', hex: '#7E22CE' },
  { name: 'Beige', hex: '#D5BEA3' },
  { name: 'Other', hex: '#9CA3AF' },
];

const CATEGORIES_LIST = [
  { name: 'All Sarees', slug: 'all' },
  { name: 'Casual', slug: 'casual' },
  { name: 'Work', slug: 'work' },
  { name: 'Wedding', slug: 'wedding' },
  { name: 'Party Wear', slug: 'party-wear' },
  { name: 'Festive', slug: 'festive' },
  { name: 'Bridal', slug: 'bridal' },
  { name: 'Luxury', slug: 'luxury' },
  { name: 'New Arrivals', slug: 'new-arrivals' },
  { name: 'Sale', slug: 'sale' },
];

const SORT_OPTIONS = [
  { label: 'Featured', value: 'featured' },
  { label: 'Newest Arrivals', value: 'newest' },
  { label: 'Price: Low to High', value: 'price-asc' },
  { label: 'Price: High to Low', value: 'price-desc' },
  { label: 'Name: A-Z', value: 'name-asc' },
  { label: 'Name: Z-A', value: 'name-desc' },
];

function ShopContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // State from URL or defaults
  const initialCategory = searchParams.get('category') || 'all';
  const initialColor = searchParams.get('color') || 'All';
  const initialSort = searchParams.get('sort') || 'featured';
  const initialSearch = searchParams.get('search') || '';
  const initialMinPrice = searchParams.get('minPrice') || '';
  const initialMaxPrice = searchParams.get('maxPrice') || '';
  const initialAvailability = searchParams.get('availability') || 'all';
  const initialNewArrival = searchParams.get('newArrival') === 'true';
  const initialFeatured = searchParams.get('featured') === 'true';

  const [products, setProducts] = useState<ProductItem[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedColor, setSelectedColor] = useState(initialColor);
  const [selectedSort, setSelectedSort] = useState(initialSort);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [minPrice, setMinPrice] = useState(initialMinPrice);
  const [maxPrice, setMaxPrice] = useState(initialMaxPrice);
  const [availability, setAvailability] = useState(initialAvailability);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  // Fetch dynamic categories
  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch('/api/categories');
        if (res.ok) {
          const data = await res.json();
          setCategories(data.categories || []);
        }
      } catch (err) {
        console.error('Failed to load categories', err);
      }
    }
    fetchCategories();
  }, []);

  // Sync state if URL params change externally
  useEffect(() => {
    setSelectedCategory(searchParams.get('category') || 'all');
    setSelectedColor(searchParams.get('color') || 'All');
    setSelectedSort(searchParams.get('sort') || 'featured');
    setSearchQuery(searchParams.get('search') || '');
  }, [searchParams]);

  // Fetch products dynamically based on filter state
  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();

        if (selectedCategory && selectedCategory !== 'all') {
          queryParams.set('category', selectedCategory);
        }
        if (selectedColor && selectedColor !== 'All') {
          queryParams.set('color', selectedColor);
        }
        if (minPrice) queryParams.set('minPrice', minPrice);
        if (maxPrice) queryParams.set('maxPrice', maxPrice);
        if (availability && availability !== 'all') {
          queryParams.set('availability', availability);
        }
        if (selectedSort) queryParams.set('sort', selectedSort);
        if (searchQuery.trim()) queryParams.set('search', searchQuery.trim());
        if (initialNewArrival) queryParams.set('newArrival', 'true');
        if (initialFeatured) queryParams.set('featured', 'true');

        const res = await fetch(`/api/products?${queryParams.toString()}`);
        if (res.ok) {
          const data = await res.json();
          setProducts(data.products || []);
        }
      } catch (err) {
        console.error('Error fetching filtered products:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [
    selectedCategory,
    selectedColor,
    selectedSort,
    searchQuery,
    minPrice,
    maxPrice,
    availability,
    initialNewArrival,
    initialFeatured,
  ]);

  const resetFilters = () => {
    setSelectedCategory('all');
    setSelectedColor('All');
    setSelectedSort('featured');
    setMinPrice('');
    setMaxPrice('');
    setAvailability('all');
    setSearchQuery('');
    router.push('/shop');
  };

  const hasActiveFilters =
    selectedCategory !== 'all' ||
    selectedColor !== 'All' ||
    minPrice !== '' ||
    maxPrice !== '' ||
    availability !== 'all' ||
    searchQuery !== '';

  const activeCategoryObj = categories.find(
    (c) => c.slug === selectedCategory || c.id === selectedCategory || c.name.toLowerCase() === selectedCategory.toLowerCase()
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Category Banner if category is selected */}
      {activeCategoryObj && (
        <div className="mb-8 rounded-2xl overflow-hidden bg-white border border-cream-200 shadow-sm flex flex-col md:flex-row items-center">
          <div className="w-full md:w-5/12 aspect-[16/9] md:aspect-auto md:h-56 relative overflow-hidden bg-cream-100 shrink-0">
            <img
              src={activeCategoryObj.image || 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b'}
              alt={activeCategoryObj.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-6 md:p-8 flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase tracking-widest text-gold-600 font-bold">
                Occasion & Collection
              </span>
              <span className="text-stone-300">•</span>
              <span className="text-xs text-stone-500">{products.length} Sarees</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
              {activeCategoryObj.name}
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 max-w-2xl leading-relaxed">
              {activeCategoryObj.description || 'Discover exquisite Pakistani drapes curated for this collection.'}
            </p>
          </div>
        </div>
      )}

      {/* Header Banner when showing all */}
      {!activeCategoryObj && (
        <div className="border-b border-cream-200 pb-8 mb-8 text-center sm:text-left flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-[11px] uppercase tracking-[0.25em] text-gold-600 font-semibold">
              Haute Couture Archives
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 mt-1">
              Complete Saree Catalog
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 mt-1 max-w-xl">
              Explore authentic handloom Banarasi silk, celestial organzas, raw silks, and regal bridal drapes tailored to perfection.
            </p>
          </div>

          <div className="flex items-center gap-3 justify-center sm:justify-end">
            {/* Mobile Filter Toggle */}
            <button
              type="button"
              onClick={() => setIsFilterDrawerOpen(true)}
              className="lg:hidden px-4 py-2.5 bg-maroon-800 text-gold-200 rounded text-xs font-bold uppercase tracking-wider flex items-center gap-2"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Filters {hasActiveFilters && '•'}</span>
            </button>

            {/* Desktop Sort Dropdown */}
            <div className="relative flex items-center gap-2 bg-white border border-stone-200 rounded px-3 py-2 text-xs text-stone-700">
              <span className="text-stone-400 font-medium">Sort By:</span>
              <select
                value={selectedSort}
                onChange={(e) => setSelectedSort(e.target.value)}
                className="bg-transparent font-semibold text-stone-900 focus:outline-none cursor-pointer"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Visual Category Strip with Updated Images */}
      {categories.length > 0 && (
        <div className="mb-8 overflow-x-auto pb-2">
          <div className="flex items-center gap-2.5 min-w-max">
            <button
              type="button"
              onClick={() => setSelectedCategory('all')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-semibold transition ${
                selectedCategory === 'all'
                  ? 'bg-maroon-800 text-gold-200 border-maroon-800 shadow-xs'
                  : 'bg-white text-stone-700 border-stone-200 hover:border-gold-400'
              }`}
            >
              <span>All Sarees</span>
            </button>
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat.slug || selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.slug)}
                  className={`flex items-center gap-2 pr-3.5 pl-1.5 py-1.5 rounded-full border text-xs font-medium transition ${
                    isSelected
                      ? 'bg-maroon-800 text-gold-200 border-maroon-800 shadow-xs font-bold'
                      : 'bg-white text-stone-700 border-stone-200 hover:border-gold-400'
                  }`}
                >
                  <img
                    src={cat.image || 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b'}
                    alt={cat.name}
                    className="w-6 h-6 rounded-full object-cover shrink-0 border border-white/60"
                  />
                  <span>{cat.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Active Filter Tags */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 mb-6 p-3 bg-cream-100/60 rounded-lg border border-cream-200 text-xs">
          <span className="text-stone-500 font-medium">Active Filters:</span>
          {selectedCategory !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-stone-300 rounded-full font-medium text-stone-800">
              Category: {selectedCategory}
              <button onClick={() => setSelectedCategory('all')} className="hover:text-rose-600">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {selectedColor !== 'All' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-stone-300 rounded-full font-medium text-stone-800">
              Color: {selectedColor}
              <button onClick={() => setSelectedColor('All')} className="hover:text-rose-600">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {(minPrice || maxPrice) && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-stone-300 rounded-full font-medium text-stone-800">
              Price: {minPrice ? formatPKR(Number(minPrice)) : '0'} - {maxPrice ? formatPKR(Number(maxPrice)) : 'Max'}
              <button onClick={() => { setMinPrice(''); setMaxPrice(''); }} className="hover:text-rose-600">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {availability !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-stone-300 rounded-full font-medium text-stone-800">
              Stock: {availability === 'in-stock' ? 'In Stock' : 'Out of Stock'}
              <button onClick={() => setAvailability('all')} className="hover:text-rose-600">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {searchQuery && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-stone-300 rounded-full font-medium text-stone-800">
              Search: &quot;{searchQuery}&quot;
              <button onClick={() => setSearchQuery('')} className="hover:text-rose-600">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          <button
            onClick={resetFilters}
            className="text-maroon-800 hover:text-maroon-900 font-semibold underline text-xs ml-auto flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset All</span>
          </button>
        </div>
      )}

      {/* Main Grid with Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Desktop Filter Sidebar */}
        <aside className="hidden lg:block lg:col-span-1 space-y-8 pr-4 border-r border-cream-200">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-lg font-bold text-stone-900 tracking-wider uppercase">
              Refine Search
            </h3>
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="text-xs text-stone-500 hover:text-maroon-800 underline"
              >
                Clear All
              </button>
            )}
          </div>

          {/* Categories Filter */}
          <div>
            <h4 className="text-xs uppercase tracking-widest text-gold-700 font-bold mb-3 border-b border-cream-200 pb-1">
              Category
            </h4>
            <div className="space-y-1">
              <button
                type="button"
                onClick={() => setSelectedCategory('all')}
                className={`w-full text-left px-2.5 py-1.5 rounded text-xs font-medium transition flex items-center justify-between ${
                  selectedCategory === 'all'
                    ? 'bg-maroon-800 text-gold-200 font-semibold shadow-xs'
                    : 'text-stone-700 hover:bg-cream-100'
                }`}
              >
                <span>All Sarees</span>
                {selectedCategory === 'all' && <Check className="w-3.5 h-3.5 text-gold-300" />}
              </button>

              {categories.map((cat) => {
                const isSelected = selectedCategory === cat.slug || selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.slug)}
                    className={`w-full text-left px-2.5 py-1.5 rounded text-xs font-medium transition flex items-center justify-between gap-2 ${
                      isSelected
                        ? 'bg-maroon-800 text-gold-200 font-semibold shadow-xs'
                        : 'text-stone-700 hover:bg-cream-100'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <img
                        src={cat.image || 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b'}
                        alt={cat.name}
                        className="w-4 h-4 rounded-full object-cover shrink-0"
                      />
                      <span className="truncate">{cat.name}</span>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      {cat._count?.products !== undefined && (
                        <span className="text-[10px] text-stone-400">({cat._count.products})</span>
                      )}
                      {isSelected && <Check className="w-3.5 h-3.5 text-gold-300" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Color Filter */}
          <div>
            <h4 className="text-xs uppercase tracking-widest text-gold-700 font-bold mb-3 border-b border-cream-200 pb-1">
              Color Palette
            </h4>
            <div className="grid grid-cols-3 gap-2">
              {COLORS_LIST.map((col) => {
                const isSelected = selectedColor.toLowerCase() === col.name.toLowerCase();
                return (
                  <button
                    key={col.name}
                    type="button"
                    onClick={() => setSelectedColor(col.name)}
                    className={`flex items-center gap-1.5 px-2 py-1.5 rounded text-[11px] border transition ${
                      isSelected
                        ? 'border-maroon-800 bg-maroon-50 text-maroon-900 font-bold shadow-xs'
                        : 'border-cream-200 text-stone-700 hover:border-stone-400 bg-white'
                    }`}
                  >
                    {col.name !== 'All' && (
                      <span
                        className="w-3 h-3 rounded-full border border-stone-300 shrink-0"
                        style={{ backgroundColor: col.hex }}
                      />
                    )}
                    <span className="truncate">{col.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Price Range */}
          <div>
            <h4 className="text-xs uppercase tracking-widest text-gold-700 font-bold mb-3 border-b border-cream-200 pb-1">
              Price Range (PKR)
            </h4>
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] uppercase text-stone-400 font-medium">Min</label>
                  <input
                    type="number"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    placeholder="3,500"
                    className="w-full p-1.5 text-xs bg-white border border-stone-300 rounded focus:outline-none focus:border-gold-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase text-stone-400 font-medium">Max</label>
                  <input
                    type="number"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    placeholder="100,000"
                    className="w-full p-1.5 text-xs bg-white border border-stone-300 rounded focus:outline-none focus:border-gold-500"
                  />
                </div>
              </div>

              {/* Quick price chips */}
              <div className="flex flex-wrap gap-1 pt-1">
                {[
                  { label: 'Under 10k', min: '', max: '10000' },
                  { label: '10k - 25k', min: '10000', max: '25000' },
                  { label: '25k - 50k', min: '25000', max: '50000' },
                  { label: '50k+', min: '50000', max: '' },
                ].map((tier) => (
                  <button
                    key={tier.label}
                    type="button"
                    onClick={() => {
                      setMinPrice(tier.min);
                      setMaxPrice(tier.max);
                    }}
                    className="px-2 py-0.5 text-[10px] bg-cream-100 hover:bg-cream-200 text-stone-600 rounded border border-cream-200 transition"
                  >
                    {tier.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Availability */}
          <div>
            <h4 className="text-xs uppercase tracking-widest text-gold-700 font-bold mb-3 border-b border-cream-200 pb-1">
              Availability
            </h4>
            <div className="space-y-1.5 text-xs">
              {[
                { label: 'All Sarees', value: 'all' },
                { label: 'In Stock Only', value: 'in-stock' },
                { label: 'Out of Stock', value: 'out-of-stock' },
              ].map((item) => (
                <label key={item.value} className="flex items-center gap-2 cursor-pointer text-stone-700">
                  <input
                    type="radio"
                    name="availability"
                    checked={availability === item.value}
                    onChange={() => setAvailability(item.value)}
                    className="accent-maroon-800"
                  />
                  <span>{item.label}</span>
                </label>
              ))}
            </div>
          </div>
        </aside>

        {/* Product Grid Area */}
        <div className="lg:col-span-3">
          {/* Result Count Status */}
          <div className="flex items-center justify-between text-xs text-stone-500 mb-6">
            <p>
              Showing <span className="font-bold text-stone-900">{products.length}</span> luxury sarees
            </p>
          </div>

          {loading ? (
            <div className="min-h-[400px] flex flex-col items-center justify-center text-stone-400">
              <Loader2 className="w-8 h-8 animate-spin text-gold-600 mb-3" />
              <p className="text-sm font-serif">Curating exquisite sarees...</p>
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            /* No Products Found State */
            <div className="text-center py-20 bg-white rounded-xl border border-cream-200 p-8 shadow-xs">
              <div className="w-16 h-16 rounded-full bg-cream-200 flex items-center justify-center text-stone-400 mx-auto mb-4">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-stone-800">
                No matching sarees found
              </h3>
              <p className="text-stone-500 text-xs sm:text-sm mt-2 max-w-md mx-auto">
                No sarees match your current filter selection. Try removing some filters or search for another color or fabric.
              </p>
              <div className="mt-6 flex justify-center">
                <button
                  type="button"
                  onClick={resetFilters}
                  className="px-6 py-2.5 bg-maroon-800 text-gold-200 text-xs font-bold uppercase tracking-widest rounded hover:bg-maroon-900 transition flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Reset All Filters</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {isFilterDrawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden overflow-hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsFilterDrawerOpen(false)}
          />
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-xs bg-[#fdfbf7] p-5 shadow-2xl overflow-y-auto space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-cream-200">
                <h3 className="font-serif text-lg font-bold text-maroon-900 uppercase">
                  Filters
                </h3>
                <button
                  onClick={() => setIsFilterDrawerOpen(false)}
                  className="p-1 text-stone-500 hover:text-stone-900"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Category */}
              <div>
                <h4 className="text-xs uppercase tracking-widest text-gold-700 font-bold mb-2">Category</h4>
                <div className="space-y-1">
                  <button
                    onClick={() => {
                      setSelectedCategory('all');
                      setIsFilterDrawerOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 rounded text-xs ${
                      selectedCategory === 'all'
                        ? 'bg-maroon-800 text-gold-200 font-semibold'
                        : 'text-stone-700 hover:bg-cream-100'
                    }`}
                  >
                    All Sarees
                  </button>
                  {categories.map((cat) => {
                    const isSelected = selectedCategory === cat.slug || selectedCategory === cat.id;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => {
                          setSelectedCategory(cat.slug);
                          setIsFilterDrawerOpen(false);
                        }}
                        className={`w-full text-left px-3 py-1.5 rounded text-xs flex items-center justify-between gap-2 ${
                          isSelected
                            ? 'bg-maroon-800 text-gold-200 font-semibold'
                            : 'text-stone-700 hover:bg-cream-100'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <img
                            src={cat.image || 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b'}
                            alt={cat.name}
                            className="w-4 h-4 rounded-full object-cover shrink-0"
                          />
                          <span className="truncate">{cat.name}</span>
                        </div>
                        {isSelected && <Check className="w-3.5 h-3.5 text-gold-300 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Mobile Color */}
              <div>
                <h4 className="text-xs uppercase tracking-widest text-gold-700 font-bold mb-2">Color</h4>
                <div className="grid grid-cols-2 gap-2">
                  {COLORS_LIST.map((col) => (
                    <button
                      key={col.name}
                      onClick={() => {
                        setSelectedColor(col.name);
                        setIsFilterDrawerOpen(false);
                      }}
                      className={`flex items-center gap-1.5 p-2 rounded text-xs border ${
                        selectedColor.toLowerCase() === col.name.toLowerCase()
                          ? 'border-maroon-800 bg-maroon-50 text-maroon-900 font-bold'
                          : 'border-cream-200 text-stone-700 bg-white'
                      }`}
                    >
                      {col.name !== 'All' && (
                        <span
                          className="w-3 h-3 rounded-full border border-stone-300"
                          style={{ backgroundColor: col.hex }}
                        />
                      )}
                      <span>{col.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Apply / Reset Buttons */}
              <div className="pt-4 border-t border-cream-200 space-y-2">
                <button
                  onClick={() => setIsFilterDrawerOpen(false)}
                  className="w-full py-2.5 bg-maroon-800 text-gold-200 font-bold text-xs uppercase tracking-widest rounded"
                >
                  Apply Filters
                </button>
                <button
                  onClick={() => {
                    resetFilters();
                    setIsFilterDrawerOpen(false);
                  }}
                  className="w-full py-2 border border-stone-300 text-stone-700 text-xs font-semibold rounded"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="min-h-screen py-20 text-center">Loading Saree Catalog...</div>}>
      <ShopContent />
    </Suspense>
  );
}
