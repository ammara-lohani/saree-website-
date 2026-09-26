'use client';

import React, { useState, useEffect } from 'react';
import { ProductItem, CategoryItem } from '@/lib/types';
import { formatPKR } from '@/lib/utils';
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  Check,
  X,
  Sparkles,
  Loader2,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import NextLink from 'next/link';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Modal State for Add / Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);
  const [saving, setSaving] = useState(false);
  const [modalError, setModalError] = useState('');

  // Form Fields
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [price, setPrice] = useState('');
  const [discountPrice, setDiscountPrice] = useState('');
  const [fabric, setFabric] = useState('');
  const [colorsInput, setColorsInput] = useState('');
  const [imagesInput, setImagesInput] = useState('');
  const [stock, setStock] = useState('10');
  const [description, setDescription] = useState('');
  const [careGuide, setCareGuide] = useState('');
  const [blouseDetails, setBlouseDetails] = useState('');
  const [featured, setFeatured] = useState(false);
  const [newArrival, setNewArrival] = useState(false);
  const [active, setActive] = useState(true);

  const fetchInitialData = async () => {
    try {
      const [prodRes, catRes] = await Promise.all([
        fetch('/api/products?all=true'),
        fetch('/api/categories'),
      ]);

      if (prodRes.ok && catRes.ok) {
        const prodData = await prodRes.json();
        const catData = await catRes.json();
        setProducts(prodData.products || []);
        setCategories(catData.categories || []);
      }
    } catch (err) {
      console.error('Error fetching admin products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  const openAddModal = () => {
    setEditingProduct(null);
    setName('');
    setSku(`RIV-${Date.now().toString().slice(-5)}`);
    setCategoryId(categories[0]?.id || '');
    setPrice('');
    setDiscountPrice('');
    setFabric('Pure Silk');
    setColorsInput('Maroon, Gold');
    setImagesInput('https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b');
    setStock('10');
    setDescription('');
    setCareGuide('Dry Clean Only.');
    setBlouseDetails('Includes unstitched blouse piece.');
    setFeatured(false);
    setNewArrival(true);
    setActive(true);
    setModalError('');
    setIsModalOpen(true);
  };

  const openEditModal = (p: ProductItem) => {
    setEditingProduct(p);
    setName(p.name);
    setSku(p.sku);
    setCategoryId(p.categoryId);
    setPrice(p.price.toString());
    setDiscountPrice(p.discountPrice ? p.discountPrice.toString() : '');
    setFabric(p.fabric);
    setColorsInput(p.colors.join(', '));
    setImagesInput(p.images.join(', '));
    setStock(p.stock.toString());
    setDescription(p.description);
    setCareGuide(p.careGuide || '');
    setBlouseDetails(p.blouseDetails || '');
    setFeatured(p.featured);
    setNewArrival(p.newArrival);
    setActive(p.active);
    setModalError('');
    setIsModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setModalError('');

    const colorsArray = colorsInput
      .split(',')
      .map((c) => c.trim())
      .filter(Boolean);

    const imagesArray = imagesInput
      .split(',')
      .map((img) => img.trim())
      .filter(Boolean);

    const payload = {
      name,
      sku,
      categoryId,
      price: parseFloat(price),
      discountPrice: discountPrice ? parseFloat(discountPrice) : null,
      fabric,
      colors: colorsArray,
      images: imagesArray,
      stock: parseInt(stock),
      description,
      careGuide,
      blouseDetails,
      featured,
      newArrival,
      active,
    };

    try {
      const url = editingProduct ? `/api/products/${editingProduct.id}` : '/api/products';
      const method = editingProduct ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to save product');
      }

      setIsModalOpen(false);
      await fetchInitialData();
    } catch (err: any) {
      setModalError(err.message || 'Error occurred while saving product');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to permanently delete this saree from the catalog?')) {
      return;
    }

    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p.id !== id));
      } else {
        alert('Failed to delete product');
      }
    } catch {
      alert('Error deleting product');
    }
  };

  const handleToggleActive = async (p: ProductItem) => {
    try {
      const res = await fetch(`/api/products/${p.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: !p.active }),
      });
      if (res.ok) {
        setProducts((prev) =>
          prev.map((item) => (item.id === p.id ? { ...item, active: !item.active } : item))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Filter products by search and category
  const filteredProducts = products.filter((p) => {
    const matchCat = selectedCategory === 'all' || p.categoryId === selectedCategory;
    const matchSearch =
      searchTerm === '' ||
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.fabric.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <span className="text-[11px] uppercase tracking-[0.25em] text-gold-700 font-bold">
            Catalog Management
          </span>
          <h1 className="font-serif text-3xl font-bold text-stone-900 mt-0.5">
            Saree Catalog ({products.length})
          </h1>
        </div>

        <button
          onClick={openAddModal}
          className="px-4 py-2.5 bg-maroon-800 hover:bg-maroon-900 text-gold-200 rounded text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-sm transition"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Saree</span>
        </button>
      </div>

      {/* Search & Filter Controls */}
      <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by saree name, SKU, fabric..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-cream-50/50 border border-stone-200 rounded focus:outline-none focus:border-gold-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-stone-500 font-medium">Category:</span>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="p-2 bg-cream-50/50 border border-stone-200 rounded text-xs font-semibold text-stone-800 focus:outline-none"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Datatable */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-stone-400">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-gold-600 mb-2" />
            <p className="text-xs">Loading saree catalog...</p>
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#faf8f5] text-stone-500 uppercase tracking-wider text-[10px] border-b border-stone-200">
                <tr>
                  <th className="py-3 px-4">Saree</th>
                  <th className="py-3 px-4">SKU</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Price (PKR)</th>
                  <th className="py-3 px-4">Stock</th>
                  <th className="py-3 px-4">Badges</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredProducts.map((p) => {
                  const image = p.images[0] || 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b';
                  return (
                    <tr key={p.id} className="hover:bg-cream-50/60 transition">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={image}
                            alt={p.name}
                            className="w-10 h-12 rounded object-cover bg-cream-100 shrink-0"
                          />
                          <div>
                            <p className="font-semibold text-stone-900 max-w-xs truncate">{p.name}</p>
                            <span className="text-[11px] text-stone-400">{p.fabric}</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4 font-mono font-bold text-stone-600">{p.sku}</td>

                      <td className="py-3 px-4 text-stone-700 font-medium">{p.category?.name}</td>

                      <td className="py-3 px-4">
                        <span className="font-bold text-maroon-900 font-sans block">
                          {formatPKR(p.discountPrice || p.price)}
                        </span>
                        {p.discountPrice && (
                          <span className="text-[10px] text-stone-400 line-through">
                            {formatPKR(p.price)}
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        <span
                          className={`font-semibold ${
                            p.stock <= 5 ? 'text-rose-700 font-bold' : 'text-stone-700'
                          }`}
                        >
                          {p.stock} units
                        </span>
                      </td>

                      <td className="py-3 px-4 space-x-1">
                        {p.featured && (
                          <span className="inline-block px-1.5 py-0.5 bg-maroon-100 text-maroon-800 text-[10px] font-bold rounded">
                            Featured
                          </span>
                        )}
                        {p.newArrival && (
                          <span className="inline-block px-1.5 py-0.5 bg-gold-100 text-gold-900 text-[10px] font-bold rounded">
                            New
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        <button
                          type="button"
                          onClick={() => handleToggleActive(p)}
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border transition ${
                            p.active
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                              : 'bg-stone-100 text-stone-600 border-stone-300'
                          }`}
                        >
                          {p.active ? 'Active' : 'Inactive'}
                        </button>
                      </td>

                      <td className="py-3 px-4 text-right space-x-2">
                        <NextLink
                          href={`/product/${p.slug}`}
                          target="_blank"
                          className="p-1 text-stone-400 hover:text-stone-700 inline-block"
                          title="View on store"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </NextLink>

                        <button
                          onClick={() => openEditModal(p)}
                          className="p-1 text-stone-600 hover:text-maroon-800 inline-block"
                          title="Edit Saree"
                        >
                          <Edit className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleDelete(p.id)}
                          className="p-1 text-stone-400 hover:text-rose-600 inline-block"
                          title="Delete Saree"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-12 text-center text-stone-400 text-xs">
            No sarees match the current search or category filter.
          </div>
        )}
      </div>

      {/* Add / Edit Saree Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          />

          <div className="relative min-h-screen flex items-center justify-center p-4">
            <div className="relative w-full max-w-3xl bg-white rounded-xl shadow-2xl border border-cream-200 overflow-hidden animate-fade-in">
              {/* Modal Header */}
              <div className="bg-maroon-900 text-cream-50 p-5 flex items-center justify-between border-b border-gold-500/30">
                <h3 className="font-serif text-lg font-bold">
                  {editingProduct ? 'Edit Saree Details' : 'Add New Saree to Atelier'}
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1 text-gold-300 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSaveProduct} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
                {modalError && (
                  <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>{modalError}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-stone-700 font-semibold mb-1">
                      Saree Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Shahzadi Crimson Banarasi Pure Silk Saree"
                      className="w-full p-2.5 bg-cream-50/50 border border-stone-300 rounded focus:outline-none focus:border-gold-500"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-700 font-semibold mb-1">
                      Product SKU *
                    </label>
                    <input
                      type="text"
                      required
                      value={sku}
                      onChange={(e) => setSku(e.target.value)}
                      className="w-full p-2.5 bg-cream-50/50 border border-stone-300 rounded focus:outline-none focus:border-gold-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-700 font-semibold mb-1">
                      Category *
                    </label>
                    <select
                      value={categoryId}
                      onChange={(e) => setCategoryId(e.target.value)}
                      className="w-full p-2.5 bg-cream-50/50 border border-stone-300 rounded focus:outline-none focus:border-gold-500 font-medium"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-stone-700 font-semibold mb-1">
                      Regular Price (PKR) *
                    </label>
                    <input
                      type="number"
                      required
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="45000"
                      className="w-full p-2.5 bg-cream-50/50 border border-stone-300 rounded focus:outline-none focus:border-gold-500"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-700 font-semibold mb-1">
                      Discounted Price (PKR, Optional)
                    </label>
                    <input
                      type="number"
                      value={discountPrice}
                      onChange={(e) => setDiscountPrice(e.target.value)}
                      placeholder="38000"
                      className="w-full p-2.5 bg-cream-50/50 border border-stone-300 rounded focus:outline-none focus:border-gold-500"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-700 font-semibold mb-1">
                      Fabric / Weave *
                    </label>
                    <input
                      type="text"
                      required
                      value={fabric}
                      onChange={(e) => setFabric(e.target.value)}
                      placeholder="e.g. Pure Katan Banarasi Silk"
                      className="w-full p-2.5 bg-cream-50/50 border border-stone-300 rounded focus:outline-none focus:border-gold-500"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-700 font-semibold mb-1">
                      Stock Quantity *
                    </label>
                    <input
                      type="number"
                      required
                      value={stock}
                      onChange={(e) => setStock(e.target.value)}
                      placeholder="10"
                      className="w-full p-2.5 bg-cream-50/50 border border-stone-300 rounded focus:outline-none focus:border-gold-500"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-stone-700 font-semibold mb-1">
                      Color Swatches (comma-separated: e.g. Maroon, Gold, Red)
                    </label>
                    <input
                      type="text"
                      value={colorsInput}
                      onChange={(e) => setColorsInput(e.target.value)}
                      className="w-full p-2.5 bg-cream-50/50 border border-stone-300 rounded focus:outline-none focus:border-gold-500"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-stone-700 font-semibold mb-1">
                      Image URLs (comma-separated URLs)
                    </label>
                    <textarea
                      rows={2}
                      value={imagesInput}
                      onChange={(e) => setImagesInput(e.target.value)}
                      className="w-full p-2.5 bg-cream-50/50 border border-stone-300 rounded focus:outline-none focus:border-gold-500"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-stone-700 font-semibold mb-1">
                      Description & Craft Story
                    </label>
                    <textarea
                      rows={3}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full p-2.5 bg-cream-50/50 border border-stone-300 rounded focus:outline-none focus:border-gold-500"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-700 font-semibold mb-1">
                      Blouse Details
                    </label>
                    <input
                      type="text"
                      value={blouseDetails}
                      onChange={(e) => setBlouseDetails(e.target.value)}
                      placeholder="Includes 1m unstitched pure silk blouse piece"
                      className="w-full p-2.5 bg-cream-50/50 border border-stone-300 rounded focus:outline-none focus:border-gold-500"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-700 font-semibold mb-1">
                      Care Instructions
                    </label>
                    <input
                      type="text"
                      value={careGuide}
                      onChange={(e) => setCareGuide(e.target.value)}
                      placeholder="Dry Clean Only."
                      className="w-full p-2.5 bg-cream-50/50 border border-stone-300 rounded focus:outline-none focus:border-gold-500"
                    />
                  </div>
                </div>

                {/* Toggles */}
                <div className="flex flex-wrap items-center gap-6 pt-3 border-t border-stone-200">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={featured}
                      onChange={(e) => setFeatured(e.target.checked)}
                      className="accent-maroon-800"
                    />
                    <span className="font-semibold text-stone-800">Featured Saree</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newArrival}
                      onChange={(e) => setNewArrival(e.target.checked)}
                      className="accent-maroon-800"
                    />
                    <span className="font-semibold text-stone-800">New Arrival</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={active}
                      onChange={(e) => setActive(e.target.checked)}
                      className="accent-maroon-800"
                    />
                    <span className="font-semibold text-stone-800">Active (Visible in Store)</span>
                  </label>
                </div>

                {/* Footer Buttons */}
                <div className="pt-4 border-t border-stone-200 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 border border-stone-300 text-stone-700 rounded font-semibold hover:bg-stone-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-2 bg-maroon-800 hover:bg-maroon-900 text-gold-200 rounded font-bold uppercase tracking-wider flex items-center gap-2"
                  >
                    {saving && <Loader2 className="w-4 h-4 animate-spin text-gold-400" />}
                    <span>{editingProduct ? 'Update Saree' : 'Save Saree'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
