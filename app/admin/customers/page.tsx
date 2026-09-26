'use client';

import React, { useState, useEffect } from 'react';
import { formatPKR } from '@/lib/utils';
import {
  Search,
  Users,
  Eye,
  Mail,
  Phone,
  MapPin,
  Calendar,
  ShoppingBag,
  Loader2,
  X,
} from 'lucide-react';

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<any | null>(null);

  const fetchCustomers = async () => {
    try {
      const res = await fetch('/api/admin/customers');
      if (res.ok) {
        const data = await res.json();
        setCustomers(data.customers || []);
      }
    } catch (err) {
      console.error('Error fetching customers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const filteredCustomers = customers.filter((c) => {
    const term = searchTerm.toLowerCase();
    return (
      c.name.toLowerCase().includes(term) ||
      c.email.toLowerCase().includes(term) ||
      c.phone.includes(term) ||
      c.city?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <span className="text-[11px] uppercase tracking-[0.25em] text-gold-700 font-bold">
            Clientele Directory
          </span>
          <h1 className="font-serif text-3xl font-bold text-stone-900 mt-0.5">
            Customer Profiles ({customers.length})
          </h1>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs flex items-center justify-between text-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by customer name, email, phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-cream-50/50 border border-stone-200 rounded focus:outline-none focus:border-gold-500"
          />
        </div>
        <p className="text-stone-400 text-xs hidden sm:block">
          Registered members & guest patrons
        </p>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-stone-400">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-gold-600 mb-2" />
            <p className="text-xs">Loading customer directory...</p>
          </div>
        ) : filteredCustomers.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#faf8f5] text-stone-500 uppercase tracking-wider text-[10px] border-b border-stone-200">
                <tr>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Contact</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Orders Placed</th>
                  <th className="py-3 px-4">Total Spending</th>
                  <th className="py-3 px-4">Last Order</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredCustomers.map((c) => (
                  <tr key={c.id} className="hover:bg-cream-50/60 transition">
                    <td className="py-3 px-4">
                      <p className="font-semibold text-stone-900">{c.name}</p>
                      <span className="text-[11px] text-stone-400">{c.email}</span>
                    </td>

                    <td className="py-3 px-4 text-stone-700 font-mono">{c.phone}</td>

                    <td className="py-3 px-4 text-stone-600 font-medium">{c.city}</td>

                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 bg-cream-100 text-stone-800 rounded font-bold">
                        {c.ordersCount} orders
                      </span>
                    </td>

                    <td className="py-3 px-4 font-bold text-maroon-900 font-sans">
                      {formatPKR(c.totalSpent)}
                    </td>

                    <td className="py-3 px-4 text-stone-500 whitespace-nowrap">
                      {c.lastOrder
                        ? new Date(c.lastOrder).toLocaleDateString('en-PK', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })
                        : 'No orders yet'}
                    </td>

                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                          c.type === 'Registered Member'
                            ? 'bg-amber-50 text-amber-900 border border-amber-200'
                            : 'bg-stone-100 text-stone-700'
                        }`}
                      >
                        {c.type}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setSelectedCustomer(c)}
                        className="px-2.5 py-1 bg-cream-100 hover:bg-cream-200 text-maroon-900 rounded font-bold uppercase text-[10px] tracking-wider transition inline-flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>History</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-12 text-center text-stone-400 text-xs">
            No customers match the search criteria.
          </div>
        )}
      </div>

      {/* Customer Order History Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setSelectedCustomer(null)}
          />

          <div className="relative min-h-screen flex items-center justify-center p-4">
            <div className="relative w-full max-w-xl bg-white rounded-xl shadow-2xl border border-cream-200 overflow-hidden animate-fade-in">
              <div className="bg-maroon-900 text-cream-50 p-5 flex items-center justify-between border-b border-gold-500/30">
                <div>
                  <h3 className="font-serif text-lg font-bold">{selectedCustomer.name}</h3>
                  <span className="text-xs text-gold-400">{selectedCustomer.email}</span>
                </div>
                <button
                  onClick={() => setSelectedCustomer(null)}
                  className="p-1 text-gold-300 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-5 text-xs max-h-[70vh] overflow-y-auto">
                <div className="grid grid-cols-2 gap-3 p-3 bg-cream-50 rounded-lg border border-cream-200">
                  <div>
                    <span className="text-stone-400 block text-[10px] uppercase">Lifetime Value</span>
                    <span className="font-serif text-base font-bold text-maroon-900">
                      {formatPKR(selectedCustomer.totalSpent)}
                    </span>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[10px] uppercase">Total Orders</span>
                    <span className="font-bold text-stone-900 text-sm">
                      {selectedCustomer.ordersCount}
                    </span>
                  </div>
                </div>

                <div>
                  <h4 className="font-serif text-sm font-bold text-stone-900 uppercase tracking-wider mb-2">
                    Customer Order History
                  </h4>

                  {selectedCustomer.orderHistory && selectedCustomer.orderHistory.length > 0 ? (
                    <div className="divide-y divide-stone-100 border border-stone-200 rounded-lg overflow-hidden">
                      {selectedCustomer.orderHistory.map((ord: any) => (
                        <div
                          key={ord.id}
                          className="p-3 bg-white flex items-center justify-between text-xs"
                        >
                          <div>
                            <span className="font-mono font-bold text-stone-900 block">
                              {ord.orderNumber}
                            </span>
                            <span className="text-stone-400 text-[11px]">
                              {new Date(ord.createdAt).toLocaleDateString('en-PK')}
                            </span>
                          </div>

                          <div className="text-right">
                            <span className="font-bold text-maroon-900 block">
                              {formatPKR(ord.total)}
                            </span>
                            <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-bold uppercase bg-stone-100 text-stone-700">
                              {ord.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-stone-400 text-center py-4">No order history available.</p>
                  )}
                </div>
              </div>

              <div className="p-4 bg-stone-50 border-t border-stone-200 text-right">
                <button
                  onClick={() => setSelectedCustomer(null)}
                  className="px-4 py-2 bg-stone-800 text-white rounded font-bold uppercase text-xs tracking-wider"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
