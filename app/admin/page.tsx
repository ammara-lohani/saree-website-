'use client';

import React, { useState, useEffect } from 'react';
import NextLink from 'next/link';
import { formatPKR } from '@/lib/utils';
import {
  DollarSign,
  ShoppingBag,
  Clock,
  CheckCircle,
  Package,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Calendar,
  Eye,
  Loader2,
} from 'lucide-react';

const STATUS_PILLS: Record<string, string> = {
  Pending: 'bg-amber-100 text-amber-800 border-amber-300',
  Confirmed: 'bg-blue-100 text-blue-800 border-blue-300',
  Processing: 'bg-purple-100 text-purple-800 border-purple-300',
  Shipped: 'bg-indigo-100 text-indigo-800 border-indigo-300',
  Delivered: 'bg-emerald-100 text-emerald-800 border-emerald-300',
  Cancelled: 'bg-rose-100 text-rose-800 border-rose-300',
};

export default function AdminDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState('This month');

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch('/api/admin/stats');
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (err) {
        console.error('Error fetching admin dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-stone-500">
        <Loader2 className="w-8 h-8 animate-spin text-gold-600 mb-3" />
        <p className="font-serif text-lg">Gathering Store Metrics...</p>
      </div>
    );
  }

  const stats = data?.stats || {
    totalSales: 0,
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    totalProducts: 0,
    lowStockCount: 0,
  };

  const recentOrders = data?.recentOrders || [];
  const monthlySales = data?.monthlySales || [];
  const bestSellers = data?.bestSellers || [];

  return (
    <div className="space-y-8">
      {/* Top Header & Timeframe selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <span className="text-[11px] uppercase tracking-[0.25em] text-gold-700 font-bold">
            Executive Summary
          </span>
          <h1 className="font-serif text-3xl font-bold text-stone-900 mt-0.5">
            Store Performance
          </h1>
        </div>

        {/* Timeframe selector */}
        <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-stone-200 shadow-xs text-xs">
          <Calendar className="w-4 h-4 text-stone-400" />
          <span className="text-stone-500">Period:</span>
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className="bg-transparent font-bold text-stone-800 focus:outline-none cursor-pointer"
          >
            <option value="Today">Today</option>
            <option value="Last 7 days">Last 7 days</option>
            <option value="This month">This month</option>
            <option value="Last month">Last month</option>
            <option value="This year">This year</option>
          </select>
        </div>
      </div>

      {/* Low Stock Warning Alert if any */}
      {stats.lowStockCount > 0 && (
        <div className="p-4 bg-amber-50 border border-amber-300 rounded-xl flex items-center justify-between gap-4 text-xs text-amber-900 shadow-xs">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
            <div>
              <span className="font-bold block">
                Low Inventory Warning ({stats.lowStockCount} Sarees Under 5 Units)
              </span>
              <span>Replenish stocks to avoid missing sales during wedding peak seasons.</span>
            </div>
          </div>
          <NextLink
            href="/admin/inventory"
            className="px-3 py-1.5 bg-amber-800 text-amber-50 rounded font-bold uppercase text-[11px] tracking-wider shrink-0 hover:bg-amber-900 transition"
          >
            Review Inventory
          </NextLink>
        </div>
      )}

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Total Sales */}
        <div className="p-4 bg-white rounded-xl border border-stone-200 shadow-xs">
          <span className="text-[10px] uppercase tracking-wider text-stone-400 font-bold block">
            Total Sales
          </span>
          <p className="font-serif text-xl sm:text-2xl font-bold text-maroon-900 mt-1">
            {formatPKR(stats.totalSales)}
          </p>
          <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1 mt-1">
            <TrendingUp className="w-3 h-3" />
            +18.4% this month
          </span>
        </div>

        {/* Total Orders */}
        <div className="p-4 bg-white rounded-xl border border-stone-200 shadow-xs">
          <span className="text-[10px] uppercase tracking-wider text-stone-400 font-bold block">
            Total Orders
          </span>
          <p className="font-serif text-xl sm:text-2xl font-bold text-stone-900 mt-1">
            {stats.totalOrders}
          </p>
          <span className="text-[10px] text-stone-500 block mt-1">All time bookings</span>
        </div>

        {/* Pending Orders */}
        <div className="p-4 bg-white rounded-xl border border-stone-200 shadow-xs">
          <span className="text-[10px] uppercase tracking-wider text-amber-600 font-bold block">
            Pending Orders
          </span>
          <p className="font-serif text-xl sm:text-2xl font-bold text-amber-800 mt-1">
            {stats.pendingOrders}
          </p>
          <NextLink
            href="/admin/orders?status=Pending"
            className="text-[10px] text-amber-700 font-bold hover:underline block mt-1"
          >
            Needs Confirmation →
          </NextLink>
        </div>

        {/* Completed Orders */}
        <div className="p-4 bg-white rounded-xl border border-stone-200 shadow-xs">
          <span className="text-[10px] uppercase tracking-wider text-emerald-600 font-bold block">
            Completed Orders
          </span>
          <p className="font-serif text-xl sm:text-2xl font-bold text-emerald-800 mt-1">
            {stats.completedOrders}
          </p>
          <span className="text-[10px] text-stone-500 block mt-1">Delivered successfully</span>
        </div>

        {/* Total Products */}
        <div className="p-4 bg-white rounded-xl border border-stone-200 shadow-xs">
          <span className="text-[10px] uppercase tracking-wider text-stone-400 font-bold block">
            Active Catalog
          </span>
          <p className="font-serif text-xl sm:text-2xl font-bold text-stone-900 mt-1">
            {stats.totalProducts}
          </p>
          <span className="text-[10px] text-stone-500 block mt-1">Saree designs active</span>
        </div>

        {/* Low Stock Alert */}
        <div className="p-4 bg-white rounded-xl border border-stone-200 shadow-xs">
          <span className="text-[10px] uppercase tracking-wider text-rose-600 font-bold block">
            Low Stock Alerts
          </span>
          <p className="font-serif text-xl sm:text-2xl font-bold text-rose-800 mt-1">
            {stats.lowStockCount}
          </p>
          <span className="text-[10px] text-rose-700 font-medium block mt-1">Less than 5 items</span>
        </div>
      </div>

      {/* Visual Analytics Chart Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Bars (2 cols) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-stone-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <div>
              <h3 className="font-serif text-lg font-bold text-stone-900">
                Revenue Trajectory (PKR)
              </h3>
              <p className="text-xs text-stone-400">Monthly breakdown for {new Date().getFullYear()}</p>
            </div>
            <span className="text-xs font-bold text-maroon-900 bg-cream-100 px-3 py-1 rounded">
              Total: {formatPKR(stats.totalSales)}
            </span>
          </div>

          {/* Clean Responsive SVG Bar Chart */}
          <div className="h-60 flex items-end justify-between gap-2 pt-6 px-2">
            {monthlySales.map((m: any, idx: number) => {
              const maxVal = Math.max(...monthlySales.map((item: any) => item.sales), 100000);
              const heightPct = Math.max(12, Math.round((m.sales / maxVal) * 100));

              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                  {/* Tooltip on hover */}
                  <div className="text-[10px] font-bold text-maroon-900 opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
                    {formatPKR(m.sales)}
                  </div>
                  <div
                    className="w-full bg-cream-200 group-hover:bg-maroon-800 rounded-t transition-all duration-300 relative"
                    style={{ height: `${heightPct}%` }}
                  >
                    <div className="absolute inset-x-0 top-0 h-1 bg-gold-500 rounded-t" />
                  </div>
                  <span className="text-[11px] font-medium text-stone-600 uppercase">
                    {m.month}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Best Sellers (1 col) */}
        <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-xs space-y-4">
          <div className="border-b border-stone-100 pb-3 flex items-center justify-between">
            <h3 className="font-serif text-lg font-bold text-stone-900">
              Top Coutures
            </h3>
            <span className="text-xs text-stone-400">By Revenue</span>
          </div>

          <div className="space-y-3">
            {bestSellers.length > 0 ? (
              bestSellers.map((item: any, idx: number) => (
                <div key={idx} className="flex items-center gap-3 text-xs">
                  <span className="w-5 h-5 rounded-full bg-cream-100 text-stone-700 font-bold text-[11px] flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-stone-900 truncate">{item.name}</p>
                    <p className="text-stone-400 text-[11px]">{item.quantity} sold</p>
                  </div>
                  <span className="font-bold text-maroon-900 font-sans">
                    {formatPKR(item.revenue)}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-xs text-stone-400 py-6 text-center">No sales recorded yet.</p>
            )}
          </div>

          <div className="pt-2 border-t border-stone-100">
            <NextLink
              href="/admin/analytics"
              className="text-xs font-bold text-maroon-800 hover:text-maroon-900 flex items-center justify-between"
            >
              <span>View Full Analytics</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </NextLink>
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-stone-200 flex items-center justify-between">
          <div>
            <h3 className="font-serif text-lg font-bold text-stone-900">
              Recent Client Orders
            </h3>
            <p className="text-xs text-stone-400 mt-0.5">Real-time nationwide order placements</p>
          </div>

          <NextLink
            href="/admin/orders"
            className="text-xs font-bold uppercase tracking-wider text-maroon-800 hover:underline flex items-center gap-1"
          >
            <span>View All Orders</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </NextLink>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#faf8f5] text-stone-500 uppercase tracking-wider text-[10px] border-b border-stone-200">
              <tr>
                <th className="py-3 px-4">Order ID</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">City</th>
                <th className="py-3 px-4">Total</th>
                <th className="py-3 px-4">Payment</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {recentOrders.map((order: any) => (
                <tr key={order.id} className="hover:bg-cream-50/60 transition">
                  <td className="py-3 px-4 font-mono font-bold text-stone-900">
                    {order.orderNumber}
                  </td>
                  <td className="py-3 px-4">
                    <p className="font-semibold text-stone-800">{order.customerName}</p>
                    <span className="text-stone-400 text-[11px]">{order.customerPhone}</span>
                  </td>
                  <td className="py-3 px-4 text-stone-600 font-medium">{order.city}</td>
                  <td className="py-3 px-4 font-bold text-maroon-900">
                    {formatPKR(order.total)}
                  </td>
                  <td className="py-3 px-4 text-stone-600">{order.paymentMethod}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${
                        STATUS_PILLS[order.status] || 'bg-stone-100 text-stone-700'
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <NextLink
                      href="/admin/orders"
                      className="p-1.5 inline-block text-maroon-800 hover:bg-cream-100 rounded"
                      title="Manage Order"
                    >
                      <Eye className="w-4 h-4" />
                    </NextLink>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
