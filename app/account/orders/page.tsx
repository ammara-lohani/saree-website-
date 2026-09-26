'use client';

import React, { useState, useEffect } from 'react';
import NextLink from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { formatPKR } from '@/lib/utils';
import { OrderType } from '@/lib/types';
import {
  Package,
  Calendar,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  Search,
  Eye,
  Loader2,
  X,
} from 'lucide-react';

const STATUS_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  Pending: { bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-200' },
  Confirmed: { bg: 'bg-blue-50', text: 'text-blue-800', border: 'border-blue-200' },
  Processing: { bg: 'bg-purple-50', text: 'text-purple-800', border: 'border-purple-200' },
  Shipped: { bg: 'bg-indigo-50', text: 'text-indigo-800', border: 'border-indigo-200' },
  Delivered: { bg: 'bg-emerald-50', text: 'text-emerald-800', border: 'border-emerald-200' },
  Cancelled: { bg: 'bg-rose-50', text: 'text-rose-800', border: 'border-rose-200' },
};

export default function MyOrdersPage() {
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<OrderType[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<OrderType | null>(null);

  // Guest lookup state
  const [guestOrderNum, setGuestOrderNum] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestSearchLoading, setGuestSearchLoading] = useState(false);
  const [guestError, setGuestError] = useState('');

  useEffect(() => {
    async function fetchOrders() {
      if (authLoading) return;
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        const res = await fetch('/api/orders');
        if (res.ok) {
          const data = await res.json();
          setOrders(data.orders || []);
        }
      } catch (err) {
        console.error('Error fetching orders:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, [user, authLoading]);

  const handleGuestLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    setGuestError('');
    if (!guestOrderNum || !guestEmail) {
      setGuestError('Please enter both Order Number and Email.');
      return;
    }

    setGuestSearchLoading(true);
    try {
      const res = await fetch(
        `/api/orders?orderNumber=${encodeURIComponent(guestOrderNum.trim())}&email=${encodeURIComponent(guestEmail.trim())}`
      );
      const data = await res.json();
      if (res.ok && data.orders && data.orders.length > 0) {
        setSelectedOrder(data.orders[0]);
      } else {
        setGuestError('No order found matching this Order Number and Email.');
      }
    } catch {
      setGuestError('Failed to locate order.');
    } finally {
      setGuestSearchLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Header */}
      <div className="border-b border-cream-200 pb-6 mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-[11px] uppercase tracking-[0.25em] text-gold-600 font-semibold">
            Order Fulfillment
          </span>
          <h1 className="font-serif text-3xl font-bold text-stone-900 mt-1">
            My Orders
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Track and view complete order history and courier status.
          </p>
        </div>

        <NextLink
          href="/shop"
          className="text-xs font-bold uppercase tracking-wider text-maroon-800 hover:text-maroon-900"
        >
          ← Continue Shopping
        </NextLink>
      </div>

      {/* If not logged in, provide Guest Tracking form */}
      {!user && (
        <div className="bg-white p-6 rounded-xl border border-cream-200 shadow-sm max-w-xl mx-auto mb-10 space-y-4">
          <div className="flex items-center gap-2">
            <Search className="w-5 h-5 text-maroon-800" />
            <h2 className="font-serif text-lg font-bold text-stone-900 uppercase">
              Track Guest Order
            </h2>
          </div>
          <p className="text-xs text-stone-500">
            Placed an order without creating an account? Enter your Order Number (e.g. <span className="font-mono font-semibold">RIV-98241</span>) and checkout email below.
          </p>

          {guestError && (
            <div className="p-2.5 bg-rose-50 text-rose-700 text-xs rounded border border-rose-200">
              {guestError}
            </div>
          )}

          <form onSubmit={handleGuestLookup} className="space-y-3 text-xs">
            <div>
              <label className="block text-stone-600 font-semibold mb-1">
                Order Number
              </label>
              <input
                type="text"
                required
                placeholder="RIV-XXXXX"
                value={guestOrderNum}
                onChange={(e) => setGuestOrderNum(e.target.value)}
                className="w-full p-2 bg-cream-50/50 border border-stone-300 rounded focus:outline-none focus:border-gold-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-stone-600 font-semibold mb-1">
                Checkout Email
              </label>
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={guestEmail}
                onChange={(e) => setGuestEmail(e.target.value)}
                className="w-full p-2 bg-cream-50/50 border border-stone-300 rounded focus:outline-none focus:border-gold-500"
              />
            </div>

            <button
              type="submit"
              disabled={guestSearchLoading}
              className="w-full py-2.5 bg-maroon-800 text-gold-200 font-bold uppercase tracking-wider rounded text-xs transition hover:bg-maroon-900 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {guestSearchLoading ? <Loader2 className="w-4 h-4 animate-spin text-gold-300" /> : <span>Track Order</span>}
            </button>
          </form>

          <div className="text-center text-xs text-stone-500 pt-2 border-t border-stone-100">
            Or{' '}
            <NextLink href="/login" className="font-bold text-maroon-800 underline">
              Sign In to your account
            </NextLink>{' '}
            to view all orders.
          </div>
        </div>
      )}

      {/* Orders List for Logged-in Customer */}
      {user && (
        <div>
          {loading ? (
            <div className="py-20 text-center text-stone-400">
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-gold-600 mb-2" />
              <p className="text-xs">Fetching your order history...</p>
            </div>
          ) : orders.length > 0 ? (
            <div className="space-y-4">
              {orders.map((order) => {
                const badge = STATUS_COLORS[order.status] || STATUS_COLORS.Pending;
                const formattedDate = new Date(order.createdAt).toLocaleDateString('en-PK', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                });

                return (
                  <div
                    key={order.id}
                    className="bg-white rounded-xl border border-cream-200 shadow-xs p-5 sm:p-6 space-y-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-cream-200 pb-4">
                      <div>
                        <span className="text-[11px] uppercase tracking-wider text-stone-400 font-semibold block">
                          Order Number
                        </span>
                        <span className="font-mono text-base font-bold text-stone-900">
                          {order.orderNumber}
                        </span>
                      </div>

                      <div>
                        <span className="text-[11px] uppercase tracking-wider text-stone-400 font-semibold block">
                          Order Date
                        </span>
                        <span className="text-xs font-medium text-stone-700">
                          {formattedDate}
                        </span>
                      </div>

                      <div>
                        <span className="text-[11px] uppercase tracking-wider text-stone-400 font-semibold block">
                          Total Amount
                        </span>
                        <span className="font-bold text-maroon-900 text-sm sm:text-base">
                          {formatPKR(order.total)}
                        </span>
                      </div>

                      <div>
                        <span className="text-[11px] uppercase tracking-wider text-stone-400 font-semibold block">
                          Status
                        </span>
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded text-xs font-bold uppercase tracking-wider border ${badge.bg} ${badge.text} ${badge.border}`}
                        >
                          {order.status}
                        </span>
                      </div>

                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="px-3 py-1.5 bg-cream-100 hover:bg-cream-200 text-maroon-900 rounded text-xs font-bold uppercase tracking-wider transition flex items-center gap-1.5"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View Details</span>
                      </button>
                    </div>

                    {/* Products Row */}
                    <div className="flex flex-wrap gap-4 pt-1">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-3 text-xs">
                          <img
                            src={item.image || 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b'}
                            alt={item.name}
                            className="w-12 h-14 rounded object-cover bg-cream-100 border border-cream-200"
                          />
                          <div>
                            <p className="font-semibold text-stone-900 line-clamp-1 max-w-[200px]">
                              {item.name}
                            </p>
                            <p className="text-stone-500 text-[11px]">
                              Color: {item.selectedColor} • Qty: {item.quantity}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-cream-200 p-12 text-center">
              <Package className="w-12 h-12 text-stone-300 mx-auto mb-3" />
              <h3 className="font-serif text-lg font-bold text-stone-800">No Orders Placed Yet</h3>
              <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
                You haven&apos;t placed any orders with this account yet. Discover our latest collections.
              </p>
              <NextLink
                href="/shop"
                className="mt-6 inline-block px-6 py-2.5 bg-maroon-800 text-gold-200 text-xs font-bold uppercase tracking-wider rounded"
              >
                Browse Sarees
              </NextLink>
            </div>
          )}
        </div>
      )}

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setSelectedOrder(null)}
          />
          <div className="relative min-h-screen flex items-center justify-center p-4">
            <div className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl border border-cream-200 overflow-hidden animate-fade-in">
              {/* Header */}
              <div className="bg-maroon-900 text-cream-50 p-5 flex items-center justify-between border-b border-gold-500/30">
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-gold-400 block font-semibold">
                    Order Details
                  </span>
                  <span className="font-mono text-lg font-bold">{selectedOrder.orderNumber}</span>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-1 text-gold-300 hover:text-white rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-stone-500">
                    Placed on: {new Date(selectedOrder.createdAt).toLocaleDateString('en-PK')}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded text-xs font-bold uppercase tracking-wider border ${
                      STATUS_COLORS[selectedOrder.status]?.bg || 'bg-amber-50'
                    } ${STATUS_COLORS[selectedOrder.status]?.text || 'text-amber-800'}`}
                  >
                    {selectedOrder.status}
                  </span>
                </div>

                {/* Items */}
                <div className="divide-y divide-cream-200 border-y border-cream-200 py-2">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="py-3 flex items-center justify-between gap-4 text-xs">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.image || 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b'}
                          alt={item.name}
                          className="w-12 h-16 rounded object-cover bg-cream-100"
                        />
                        <div>
                          <p className="font-semibold text-stone-900">{item.name}</p>
                          <p className="text-stone-500 text-[11px]">
                            Color: {item.selectedColor} • Qty: {item.quantity}
                          </p>
                        </div>
                      </div>
                      <span className="font-bold text-stone-900">
                        {formatPKR(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Shipping info */}
                <div className="text-xs text-stone-600 space-y-1">
                  <span className="font-bold text-stone-900 block uppercase tracking-wider">
                    Recipient & Delivery
                  </span>
                  <p className="font-medium text-stone-800">{selectedOrder.customerName}</p>
                  <p>{selectedOrder.shippingAddress}, {selectedOrder.city}</p>
                  <p>Phone: {selectedOrder.customerPhone}</p>
                  <p>Payment: {selectedOrder.paymentMethod}</p>
                </div>

                {/* Totals */}
                <div className="border-t border-cream-200 pt-3 space-y-1 text-xs text-stone-600">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{formatPKR(selectedOrder.subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery</span>
                    <span>{selectedOrder.shippingFee === 0 ? 'Free' : formatPKR(selectedOrder.shippingFee)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-sm text-stone-900 border-t border-stone-200 pt-2">
                    <span>Total Amount</span>
                    <span className="text-maroon-900">{formatPKR(selectedOrder.total)}</span>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 bg-cream-50 border-t border-cream-200 text-right">
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="px-4 py-2 bg-stone-800 hover:bg-stone-900 text-white text-xs font-bold uppercase tracking-wider rounded"
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
