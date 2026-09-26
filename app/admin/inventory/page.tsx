'use client';

import React, { useState, useEffect } from 'react';
import { formatPKR } from '@/lib/utils';
import {
  Boxes,
  Search,
  AlertTriangle,
  Check,
  Plus,
  Minus,
  Save,
  Loader2,
  RefreshCw,
} from 'lucide-react';

export default function AdminInventoryPage() {
  const [inventory, setInventory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingStock, setEditingStock] = useState<Record<string, number>>({});
  const [savingId, setSavingId] = useState<string | null>(null);

  const fetchInventory = async () => {
    try {
      const res = await fetch('/api/admin/inventory');
      if (res.ok) {
        const data = await res.json();
        setInventory(data.inventory || []);
        // Initialize editing state
        const initialStocks: Record<string, number> = {};
        (data.inventory || []).forEach((item: any) => {
          initialStocks[item.id] = item.stock;
        });
        setEditingStock(initialStocks);
      }
    } catch (err) {
      console.error('Error fetching inventory:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleStockChange = (productId: string, val: number) => {
    setEditingStock((prev) => ({
      ...prev,
      [productId]: Math.max(0, val),
    }));
  };

  const handleSaveStock = async (productId: string) => {
    const newStock = editingStock[productId];
    if (newStock === undefined) return;

    setSavingId(productId);
    try {
      const res = await fetch('/api/admin/inventory', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, stock: newStock }),
      });

      if (res.ok) {
        setInventory((prev) =>
          prev.map((item) =>
            item.id === productId
              ? {
                  ...item,
                  stock: newStock,
                  status: newStock === 0 ? 'Out of Stock' : newStock <= 5 ? 'Low Stock' : 'In Stock',
                }
              : item
          )
        );
      } else {
        alert('Failed to update stock');
      }
    } catch {
      alert('Error updating stock');
    } finally {
      setSavingId(null);
    }
  };

  const filteredInventory = inventory.filter((item) => {
    const term = searchTerm.toLowerCase();
    return (
      item.name.toLowerCase().includes(term) ||
      item.sku.toLowerCase().includes(term) ||
      item.category.toLowerCase().includes(term)
    );
  });

  const lowStockCount = inventory.filter((i) => i.stock <= 5).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <span className="text-[11px] uppercase tracking-[0.25em] text-gold-700 font-bold">
            Warehouse & Atelier Stock
          </span>
          <h1 className="font-serif text-3xl font-bold text-stone-900 mt-0.5">
            Inventory Management ({inventory.length} SKUs)
          </h1>
        </div>

        <button
          onClick={fetchInventory}
          className="px-3.5 py-2 border border-stone-300 hover:bg-white text-stone-700 rounded text-xs font-semibold flex items-center gap-1.5 transition self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Stock</span>
        </button>
      </div>

      {/* Low Stock Highlight Alert */}
      {lowStockCount > 0 && (
        <div className="p-4 bg-amber-50 border border-amber-300 rounded-xl flex items-center gap-3 text-xs text-amber-900 shadow-xs">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
          <div>
            <span className="font-bold">
              {lowStockCount} Sarees have reached critical low stock levels (&le; 5 units).
            </span>
            <span className="block text-stone-600 mt-0.5">
              Adjust quantities below as new shipments arrive from the handlooms.
            </span>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs flex items-center justify-between text-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by SKU, saree title, category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-cream-50/50 border border-stone-200 rounded focus:outline-none focus:border-gold-500"
          />
        </div>
        <p className="text-stone-400 text-xs hidden sm:block">
          Inline adjustments automatically update customer purchase ceilings.
        </p>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-stone-400">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-gold-600 mb-2" />
            <p className="text-xs">Loading warehouse inventory...</p>
          </div>
        ) : filteredInventory.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#faf8f5] text-stone-500 uppercase tracking-wider text-[10px] border-b border-stone-200">
                <tr>
                  <th className="py-3 px-4">Saree Product</th>
                  <th className="py-3 px-4">SKU</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Price (PKR)</th>
                  <th className="py-3 px-4">Stock Status</th>
                  <th className="py-3 px-4">Stock Quantity</th>
                  <th className="py-3 px-4 text-right">Quick Update</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredInventory.map((item) => {
                  const isLow = item.stock <= 5;
                  const isOut = item.stock === 0;
                  const currentVal = editingStock[item.id] !== undefined ? editingStock[item.id] : item.stock;
                  const isModified = currentVal !== item.stock;

                  return (
                    <tr
                      key={item.id}
                      className={`transition ${
                        isOut
                          ? 'bg-rose-50/40 hover:bg-rose-50/70'
                          : isLow
                          ? 'bg-amber-50/40 hover:bg-amber-50/70'
                          : 'hover:bg-cream-50/60'
                      }`}
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.image || 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b'}
                            alt={item.name}
                            className="w-10 h-12 rounded object-cover bg-cream-100 shrink-0"
                          />
                          <p className="font-semibold text-stone-900 max-w-xs truncate">{item.name}</p>
                        </div>
                      </td>

                      <td className="py-3 px-4 font-mono font-bold text-stone-600">{item.sku}</td>

                      <td className="py-3 px-4 text-stone-700 font-medium">{item.category}</td>

                      <td className="py-3 px-4 font-bold text-maroon-900 font-sans">
                        {formatPKR(item.price)}
                      </td>

                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${
                            isOut
                              ? 'bg-rose-100 text-rose-800 border-rose-300'
                              : isLow
                              ? 'bg-amber-100 text-amber-800 border-amber-300'
                              : 'bg-emerald-50 text-emerald-800 border-emerald-300'
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>

                      {/* Interactive Stock Counter */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleStockChange(item.id, currentVal - 1)}
                            className="p-1 rounded bg-stone-100 hover:bg-stone-200 text-stone-700 transition"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <input
                            type="number"
                            min={0}
                            value={currentVal}
                            onChange={(e) =>
                              handleStockChange(item.id, parseInt(e.target.value) || 0)
                            }
                            className="w-16 p-1 text-center font-bold text-stone-900 bg-white border border-stone-300 rounded focus:outline-none focus:border-gold-500"
                          />
                          <button
                            type="button"
                            onClick={() => handleStockChange(item.id, currentVal + 1)}
                            className="p-1 rounded bg-stone-100 hover:bg-stone-200 text-stone-700 transition"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </td>

                      {/* Save Button */}
                      <td className="py-3 px-4 text-right">
                        <button
                          type="button"
                          disabled={!isModified || savingId === item.id}
                          onClick={() => handleSaveStock(item.id)}
                          className={`px-3 py-1.5 rounded font-bold uppercase text-[10px] tracking-wider transition flex items-center gap-1 ml-auto ${
                            isModified
                              ? 'bg-maroon-800 text-gold-200 hover:bg-maroon-900 shadow-sm'
                              : 'bg-stone-100 text-stone-400 cursor-not-allowed'
                          }`}
                        >
                          {savingId === item.id ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            <Save className="w-3 h-3" />
                          )}
                          <span>Save</span>
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
            No products found matching the search criteria.
          </div>
        )}
      </div>
    </div>
  );
}
