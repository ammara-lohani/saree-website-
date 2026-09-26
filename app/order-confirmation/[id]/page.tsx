import React from 'react';
import NextLink from 'next/link';
import { db } from '@/lib/db';
import { formatPKR } from '@/lib/utils';
import { CheckCircle2, Package, MapPin, Truck, ArrowRight, Printer, Sparkles } from 'lucide-react';

async function getOrder(orderNumber: string) {
  const order = await db.order.findFirst({
    where: {
      OR: [{ orderNumber }, { id: orderNumber }],
    },
  });

  if (!order) return null;

  let items = [];
  try {
    items = JSON.parse(order.itemsJson);
  } catch {
    items = [];
  }

  return {
    ...order,
    items,
    createdAt: order.createdAt.toISOString(),
  };
}

export default async function OrderConfirmationPage({
  params,
}: {
  params: { id: string };
}) {
  const order = await getOrder(params.id);

  if (!order) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <h2 className="font-serif text-2xl font-bold text-stone-900">Order Not Found</h2>
        <p className="text-xs text-stone-500 mt-2">
          We could not locate this order. Please verify your order number or contact support.
        </p>
        <NextLink
          href="/"
          className="mt-6 inline-block px-6 py-2.5 bg-maroon-800 text-gold-200 text-xs font-bold uppercase tracking-wider rounded"
        >
          Return to Home
        </NextLink>
      </div>
    );
  }

  const orderDate = new Date(order.createdAt).toLocaleDateString('en-PK', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      {/* Success Badge */}
      <div className="text-center space-y-3 mb-10">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-sm">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-gold-500/10 text-gold-700 rounded-full text-xs font-bold uppercase tracking-widest border border-gold-500/20">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Shukriya! Order Confirmed</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900">
          Thank You For Choosing Rivaayat
        </h1>
        <p className="text-stone-500 text-xs sm:text-sm max-w-lg mx-auto">
          Dear <span className="font-semibold text-stone-800">{order.customerName}</span>, your bespoke saree order has been received. Our atelier is carefully preparing your parcel.
        </p>
      </div>

      {/* Confirmation Card */}
      <div className="bg-white rounded-xl border border-cream-200 shadow-md overflow-hidden">
        {/* Top Details Strip */}
        <div className="bg-maroon-900 text-cream-50 p-6 flex flex-wrap items-center justify-between gap-4 border-b border-gold-500/30">
          <div>
            <span className="text-[11px] uppercase tracking-wider text-gold-400 block font-semibold">
              Order Reference
            </span>
            <span className="font-mono text-xl sm:text-2xl font-bold text-white">
              {order.orderNumber}
            </span>
          </div>

          <div>
            <span className="text-[11px] uppercase tracking-wider text-gold-400 block font-semibold">
              Date Placed
            </span>
            <span className="text-xs sm:text-sm font-medium text-stone-200">
              {orderDate}
            </span>
          </div>

          <div>
            <span className="text-[11px] uppercase tracking-wider text-gold-400 block font-semibold">
              Status
            </span>
            <span className="inline-block px-2.5 py-0.5 bg-gold-500 text-maroon-950 text-xs font-bold uppercase tracking-wider rounded">
              {order.status}
            </span>
          </div>
        </div>

        {/* Ordered Items List */}
        <div className="p-6 sm:p-8 space-y-6">
          <h3 className="font-serif text-lg font-bold text-stone-900 tracking-wider uppercase border-b border-cream-200 pb-2">
            Ordered Sarees ({order.items.length})
          </h3>

          <div className="divide-y divide-cream-200">
            {order.items.map((item: any, idx: number) => (
              <div key={idx} className="py-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <img
                    src={item.image || 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b'}
                    alt={item.name}
                    className="w-16 h-20 rounded object-cover bg-cream-100 shrink-0 border border-cream-200"
                  />
                  <div>
                    <h4 className="font-serif font-bold text-stone-900 text-sm sm:text-base">
                      {item.name}
                    </h4>
                    <p className="text-xs text-stone-500 mt-0.5">
                      Color: <span className="font-semibold text-stone-700">{item.selectedColor}</span> • Qty: {item.quantity}
                    </p>
                    <p className="text-xs text-maroon-800 font-semibold mt-1">
                      {formatPKR(item.price)} each
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs text-stone-400 block">Total</span>
                  <span className="font-bold text-stone-900 text-sm sm:text-base">
                    {formatPKR(item.price * item.quantity)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Delivery & Payment Information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-cream-200">
            <div className="space-y-2 text-xs text-stone-600">
              <h4 className="font-serif font-bold text-stone-900 text-sm flex items-center gap-2">
                <MapPin className="w-4 h-4 text-maroon-800" />
                <span>Delivery Address</span>
              </h4>
              <p className="font-semibold text-stone-800">{order.customerName}</p>
              <p>{order.shippingAddress}</p>
              <p>{order.city}, {order.postalCode}</p>
              <p className="text-stone-700">Phone: {order.customerPhone}</p>
              {order.notes && <p className="italic text-stone-500 mt-1">Note: &quot;{order.notes}&quot;</p>}
            </div>

            <div className="space-y-2 text-xs text-stone-600">
              <h4 className="font-serif font-bold text-stone-900 text-sm flex items-center gap-2">
                <Truck className="w-4 h-4 text-maroon-800" />
                <span>Payment & Logistics</span>
              </h4>
              <p>Payment Method: <span className="font-bold text-stone-800">{order.paymentMethod}</span></p>
              <p>Estimated Dispatch: <span className="font-semibold text-stone-800">Within 24–48 hours</span></p>
              <p>Delivery Window: <span className="font-semibold text-stone-800">2–4 business days via TCS / Leopards</span></p>
            </div>
          </div>

          {/* Pricing Breakdown */}
          <div className="border-t border-cream-200 pt-4 space-y-2 text-xs sm:text-sm text-stone-600">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-semibold text-stone-900">{formatPKR(order.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Express Delivery Fee</span>
              <span>
                {order.shippingFee === 0 ? (
                  <span className="text-emerald-700 font-bold uppercase text-xs">Free Nationwide Delivery</span>
                ) : (
                  formatPKR(order.shippingFee)
                )}
              </span>
            </div>
            <div className="border-t border-stone-200 pt-3 flex justify-between items-baseline text-base sm:text-lg font-bold text-stone-900">
              <span className="font-serif">Total Payable</span>
              <span className="font-serif text-2xl text-maroon-900">
                {formatPKR(order.total)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
        <NextLink
          href="/shop"
          className="w-full sm:w-auto px-6 py-3.5 bg-maroon-800 hover:bg-maroon-900 text-gold-200 text-xs font-bold uppercase tracking-widest rounded shadow-md transition flex items-center justify-center gap-2"
        >
          <span>Continue Shopping</span>
          <ArrowRight className="w-4 h-4" />
        </NextLink>

        <NextLink
          href="/account/orders"
          className="w-full sm:w-auto px-6 py-3.5 bg-white border border-stone-300 hover:bg-cream-100 text-stone-800 text-xs font-bold uppercase tracking-widest rounded transition flex items-center justify-center gap-2"
        >
          <span>View My Orders</span>
        </NextLink>
      </div>
    </div>
  );
}
