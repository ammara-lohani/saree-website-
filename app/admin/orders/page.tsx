'use client';

import React, { useState, useEffect } from 'react';
import { formatPKR } from '@/lib/utils';
import { OrderType } from '@/lib/types';
import {
  Search,
  Filter,
  Eye,
  CheckCircle,
  Truck,
  X,
  AlertCircle,
  Loader2,
  Calendar,
  MapPin,
  Clock,
} from 'lucide-react';

const STATUS_PILLS: Record<string, string> = {
  Pending: 'bg-amber-50 text-amber-800 border-amber-300',
  Confirmed: 'bg-blue-50 text-blue-800 border-blue-300',
  Processing: 'bg-purple-50 text-purple-800 border-purple-300',
  Shipped: 'bg-indigo-50 text-indigo-800 border-indigo-300',
  Delivered: 'bg-emerald-50 text-emerald-800 border-emerald-300',
  Cancelled: 'bg-rose-50 text-rose-800 border-rose-300',
};

const ALL_STATUSES = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderType[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<OrderType | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders');
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
      }
    } catch (err) {
      console.error('Error fetching admin orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    setUpdatingStatus(true);
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        const data = await res.json();
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status: newStatus as any } : o))
        );
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder((prev) => (prev ? { ...prev, status: newStatus as any } : null));
        }
      } else {
        alert('Failed to update status');
      }
    } catch {
      alert('Error updating order status');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const filteredOrders = orders.filter((o) => {
    const matchStatus = selectedStatus === 'all' || o.status === selectedStatus;
    const matchSearch =
      searchTerm === '' ||
      o.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customerPhone.includes(searchTerm) ||
      o.city.toLowerCase().includes(searchTerm.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <span className="text-[11px] uppercase tracking-[0.25em] text-gold-700 font-bold">
            Fulfillment & Logistics
          </span>
          <h1 className="font-serif text-3xl font-bold text-stone-900 mt-0.5">
            Order Management ({orders.length})
          </h1>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by order #, client name, phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-cream-50/50 border border-stone-200 rounded focus:outline-none focus:border-gold-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-stone-500 font-medium">Status Filter:</span>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="p-2 bg-cream-50/50 border border-stone-200 rounded text-xs font-semibold text-stone-800 focus:outline-none"
          >
            <option value="all">All Statuses ({orders.length})</option>
            {ALL_STATUSES.map((st) => (
              <option key={st} value={st}>
                {st} ({orders.filter((o) => o.status === st).length})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-stone-400">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-gold-600 mb-2" />
            <p className="text-xs">Loading orders...</p>
          </div>
        ) : filteredOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#faf8f5] text-stone-500 uppercase tracking-wider text-[10px] border-b border-stone-200">
                <tr>
                  <th className="py-3 px-4">Order ID</th>
                  <th className="py-3 px-4">Customer Name</th>
                  <th className="py-3 px-4">Phone</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Products</th>
                  <th className="py-3 px-4">Total Amount</th>
                  <th className="py-3 px-4">Payment</th>
                  <th className="py-3 px-4">Order Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredOrders.map((order) => {
                  const dateStr = new Date(order.createdAt).toLocaleDateString('en-PK', {
                    day: 'numeric',
                    month: 'short',
                  });

                  return (
                    <tr key={order.id} className="hover:bg-cream-50/60 transition">
                      <td className="py-3 px-4 font-mono font-bold text-stone-900">
                        {order.orderNumber}
                      </td>

                      <td className="py-3 px-4">
                        <p className="font-semibold text-stone-800">{order.customerName}</p>
                        <span className="text-[11px] text-stone-400">{order.city}</span>
                      </td>

                      <td className="py-3 px-4 font-medium text-stone-600">{order.customerPhone}</td>

                      <td className="py-3 px-4 text-stone-500 whitespace-nowrap">{dateStr}</td>

                      <td className="py-3 px-4">
                        <span className="text-stone-700 font-medium">
                          {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                        </span>
                      </td>

                      <td className="py-3 px-4 font-bold text-maroon-900 font-sans">
                        {formatPKR(order.total)}
                      </td>

                      <td className="py-3 px-4 text-stone-600">{order.paymentMethod}</td>

                      <td className="py-3 px-4">
                        <select
                          value={order.status}
                          disabled={updatingStatus}
                          onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                          className={`px-2 py-1 rounded text-[11px] font-bold uppercase tracking-wider border cursor-pointer focus:outline-none ${
                            STATUS_PILLS[order.status] || 'bg-stone-50 text-stone-700'
                          }`}
                        >
                          {ALL_STATUSES.map((st) => (
                            <option key={st} value={st}>
                              {st}
                            </option>
                          ))}
                        </select>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="px-2.5 py-1 bg-cream-100 hover:bg-cream-200 text-maroon-900 rounded font-bold uppercase text-[10px] tracking-wider transition inline-flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View</span>
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
            No orders match the current status filter or search query.
          </div>
        )}
      </div>

      {/* Order Details Drawer / Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setSelectedOrder(null)}
          />

          <div className="relative min-h-screen flex items-center justify-center p-4">
            <div className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl border border-cream-200 overflow-hidden animate-fade-in">
              <div className="bg-maroon-900 text-cream-50 p-5 flex items-center justify-between border-b border-gold-500/30">
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-gold-400 block font-semibold">
                    Complete Order File
                  </span>
                  <span className="font-mono text-xl font-bold">{selectedOrder.orderNumber}</span>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-1 text-gold-300 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto text-xs">
                {/* Status Switcher Banner */}
                <div className="p-4 bg-cream-100/70 rounded-lg border border-cream-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-stone-500 block text-[10px] uppercase font-bold">
                      Current Order Status
                    </span>
                    <span
                      className={`inline-block mt-0.5 px-2.5 py-0.5 rounded text-xs font-bold uppercase tracking-wider border ${
                        STATUS_PILLS[selectedOrder.status] || 'bg-stone-50'
                      }`}
                    >
                      {selectedOrder.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-stone-600 font-semibold">Change to:</span>
                    <select
                      value={selectedOrder.status}
                      disabled={updatingStatus}
                      onChange={(e) => handleUpdateStatus(selectedOrder.id, e.target.value)}
                      className="p-2 bg-white border border-stone-300 rounded font-bold text-xs text-stone-800"
                    >
                      {ALL_STATUSES.map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Customer and Shipping Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-stone-50 rounded-lg border border-stone-200 text-stone-700">
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase tracking-wider text-stone-400 font-bold block">
                      Customer Profile
                    </span>
                    <p className="font-bold text-stone-900 text-sm">{selectedOrder.customerName}</p>
                    <p>Email: {selectedOrder.customerEmail}</p>
                    <p>Phone: {selectedOrder.customerPhone}</p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] uppercase tracking-wider text-stone-400 font-bold block">
                      Delivery Location
                    </span>
                    <p>{selectedOrder.shippingAddress}</p>
                    <p>{selectedOrder.city}, {selectedOrder.postalCode}</p>
                    {selectedOrder.notes && (
                      <p className="italic text-stone-500 mt-1">Special note: &quot;{selectedOrder.notes}&quot;</p>
                    )}
                  </div>
                </div>

                {/* Ordered Items Breakdown */}
                <div>
                  <h4 className="font-serif text-sm font-bold text-stone-900 uppercase tracking-wider mb-2">
                    Line Items
                  </h4>
                  <div className="divide-y divide-stone-100 border border-stone-200 rounded-lg overflow-hidden">
                    {selectedOrder.items.map((item, idx) => (
                      <div key={idx} className="p-3 bg-white flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.image || 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b'}
                            alt={item.name}
                            className="w-12 h-14 rounded object-cover bg-cream-100"
                          />
                          <div>
                            <p className="font-semibold text-stone-900">{item.name}</p>
                            <p className="text-stone-500 text-[11px]">
                              Color: {item.selectedColor} • Quantity: {item.quantity}
                            </p>
                          </div>
                        </div>
                        <span className="font-bold text-stone-900 font-sans">
                          {formatPKR(item.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Totals Summary */}
                <div className="space-y-2 border-t border-stone-200 pt-3 text-stone-600">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{formatPKR(selectedOrder.subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>{selectedOrder.shippingFee === 0 ? 'Free Delivery' : formatPKR(selectedOrder.shippingFee)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-sm text-stone-900 border-t border-stone-100 pt-2">
                    <span>Grand Total</span>
                    <span className="text-maroon-900 font-sans text-base">
                      {formatPKR(selectedOrder.total)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-stone-100 border-t border-stone-200 flex justify-between items-center">
                <button
                  onClick={() => handleUpdateStatus(selectedOrder.id, 'Cancelled')}
                  className="px-3 py-1.5 text-rose-700 hover:bg-rose-50 border border-rose-300 rounded font-semibold text-xs"
                >
                  Cancel Order
                </button>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="px-5 py-2 bg-stone-900 text-white rounded font-bold uppercase tracking-wider text-xs"
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
