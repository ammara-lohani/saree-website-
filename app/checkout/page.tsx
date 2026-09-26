'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import NextLink from 'next/link';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { formatPKR } from '@/lib/utils';
import {
  ShieldCheck,
  Truck,
  CreditCard,
  Banknote,
  ArrowRight,
  AlertCircle,
  Loader2,
  Lock,
} from 'lucide-react';

const PAKISTAN_CITIES = [
  'Karachi',
  'Lahore',
  'Islamabad',
  'Rawalpindi',
  'Faisalabad',
  'Multan',
  'Peshawar',
  'Quetta',
  'Sialkot',
  'Gujranwala',
  'Hyderabad',
  'Bahawalpur',
  'Sargodha',
  'Sukkur',
  'Abbottabad',
  'Mardan',
  'Wah Cantt',
  'Mirpur (AJK)',
  'Muzaffarabad',
  'Other City',
];

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, shippingFee, total, clearCart } = useCart();
  const { user } = useAuth();

  const [fullName, setFullName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState(user?.address || '');
  const [city, setCity] = useState(user?.city || 'Karachi');
  const [postalCode, setPostalCode] = useState('');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h2 className="font-serif text-2xl font-bold text-stone-900">Your bag is empty</h2>
        <p className="text-xs text-stone-500 mt-2">
          Please add a saree to your shopping bag before proceeding to checkout.
        </p>
        <NextLink
          href="/shop"
          className="mt-6 inline-block px-6 py-2.5 bg-maroon-800 text-gold-200 text-xs font-bold uppercase tracking-wider rounded"
        >
          Browse Sarees
        </NextLink>
      </div>
    );
  }

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!fullName.trim() || !email.trim() || !phone.trim() || !address.trim() || !city) {
      setErrorMessage('Please fill out all required contact and shipping fields.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: fullName,
          customerEmail: email,
          customerPhone: phone,
          shippingAddress: address,
          city,
          postalCode: postalCode || '00000',
          items: items.map((item) => ({
            productId: item.productId,
            name: item.name,
            selectedColor: item.selectedColor,
            quantity: item.quantity,
            price: item.price,
            image: item.image,
          })),
          paymentMethod,
          notes,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to place order.');
      }

      // Order placed successfully! Clear cart & redirect to order confirmation
      clearCart();
      router.push(`/order-confirmation/${data.order.orderNumber}`);
    } catch (err: any) {
      console.error('Order submission error:', err);
      setErrorMessage(err.message || 'Something went wrong while placing your order.');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Checkout Header */}
      <div className="border-b border-cream-200 pb-6 mb-8">
        <span className="text-[11px] uppercase tracking-[0.25em] text-gold-600 font-semibold">
          Finalize Couture Order
        </span>
        <h1 className="font-serif text-3xl font-bold text-stone-900 mt-1">
          Express Checkout
        </h1>
      </div>

      {errorMessage && (
        <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-lg flex items-center gap-3 text-xs text-rose-800">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Left Column: Shipping & Payment (7 cols) */}
        <div className="lg:col-span-7 space-y-8">
          {/* Customer Information */}
          <div className="bg-white p-6 rounded-xl border border-cream-200 shadow-xs space-y-4">
            <h2 className="font-serif text-lg font-bold text-stone-900 tracking-wider uppercase border-b border-cream-200 pb-2">
              1. Customer Information
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-stone-600 font-semibold mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Ayesha Khan"
                  className="w-full p-2.5 bg-cream-50/50 border border-stone-300 rounded focus:outline-none focus:border-gold-500"
                />
              </div>

              <div>
                <label className="block text-stone-600 font-semibold mb-1">
                  Phone Number (for Courier SMS/Call) *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. 0300-1234567"
                  className="w-full p-2.5 bg-cream-50/50 border border-stone-300 rounded focus:outline-none focus:border-gold-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-stone-600 font-semibold mb-1">
                  Email Address (for Order Updates & Receipt) *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ayesha.khan@example.com"
                  className="w-full p-2.5 bg-cream-50/50 border border-stone-300 rounded focus:outline-none focus:border-gold-500"
                />
              </div>
            </div>
          </div>

          {/* Delivery Address */}
          <div className="bg-white p-6 rounded-xl border border-cream-200 shadow-xs space-y-4">
            <h2 className="font-serif text-lg font-bold text-stone-900 tracking-wider uppercase border-b border-cream-200 pb-2">
              2. Delivery Address (Pakistan)
            </h2>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-stone-600 font-semibold mb-1">
                  Complete Street Address (House/Apartment #, Street, Area) *
                </label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. House 42, Street 15, Sector F-7/2"
                  className="w-full p-2.5 bg-cream-50/50 border border-stone-300 rounded focus:outline-none focus:border-gold-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-stone-600 font-semibold mb-1">
                    City *
                  </label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full p-2.5 bg-cream-50/50 border border-stone-300 rounded focus:outline-none focus:border-gold-500"
                  >
                    {PAKISTAN_CITIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-stone-600 font-semibold mb-1">
                    Postal Code (Optional)
                  </label>
                  <input
                    type="text"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    placeholder="44000"
                    className="w-full p-2.5 bg-cream-50/50 border border-stone-300 rounded focus:outline-none focus:border-gold-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-600 font-semibold mb-1">
                  Delivery Instructions / Special Notes (Optional)
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Please call before arriving or deliver between 2 PM - 6 PM"
                  className="w-full p-2.5 bg-cream-50/50 border border-stone-300 rounded focus:outline-none focus:border-gold-500"
                />
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-white p-6 rounded-xl border border-cream-200 shadow-xs space-y-4">
            <h2 className="font-serif text-lg font-bold text-stone-900 tracking-wider uppercase border-b border-cream-200 pb-2">
              3. Payment Method
            </h2>

            <div className="space-y-3">
              {/* Cash on Delivery (Active) */}
              <label className="flex items-center gap-3 p-4 rounded-lg border-2 border-maroon-800 bg-maroon-50/40 cursor-pointer transition">
                <input
                  type="radio"
                  name="payment"
                  value="Cash on Delivery"
                  checked={paymentMethod === 'Cash on Delivery'}
                  onChange={() => setPaymentMethod('Cash on Delivery')}
                  className="accent-maroon-800"
                />
                <div className="flex-1 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Banknote className="w-5 h-5 text-maroon-800" />
                    <div>
                      <span className="text-xs font-bold text-stone-900 block">
                        Cash on Delivery (COD)
                      </span>
                      <span className="text-[11px] text-stone-500">
                        Pay conveniently in cash upon courier parcel arrival at your doorstep.
                      </span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 bg-maroon-800 text-gold-200 text-[10px] uppercase font-bold rounded">
                    Popular
                  </span>
                </div>
              </label>

              {/* Online Card (Future expansion ready) */}
              <div className="flex items-center gap-3 p-4 rounded-lg border border-stone-200 bg-stone-50 opacity-60 cursor-not-allowed">
                <input type="radio" disabled name="payment" />
                <div className="flex-1 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-5 h-5 text-stone-400" />
                    <div>
                      <span className="text-xs font-bold text-stone-600 block">
                        Credit / Debit Card (Visa, Mastercard, PayPak)
                      </span>
                      <span className="text-[11px] text-stone-400">
                        Secure online gateway integration.
                      </span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 bg-stone-200 text-stone-600 text-[10px] font-bold rounded">
                    Coming Soon
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary & Place Order Button (5 cols) */}
        <div className="lg:col-span-5">
          <div className="bg-white p-6 rounded-xl border border-cream-200 shadow-sm space-y-6 sticky top-28">
            <h2 className="font-serif text-lg font-bold text-stone-900 tracking-wider uppercase border-b border-cream-200 pb-2">
              Order Summary ({items.length} {items.length === 1 ? 'item' : 'items'})
            </h2>

            {/* Line items mini preview */}
            <div className="max-h-72 overflow-y-auto space-y-3 pr-1">
              {items.map((item) => (
                <div key={item.id} className="flex gap-3 text-xs border-b border-stone-100 pb-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-14 h-16 rounded object-cover bg-cream-100 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-stone-900 truncate">{item.name}</p>
                    <p className="text-stone-500 text-[11px] mt-0.5">
                      Color: {item.selectedColor} • Qty: {item.quantity}
                    </p>
                    <p className="font-bold text-maroon-900 mt-1">
                      {formatPKR(item.price * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Calculations */}
            <div className="space-y-2.5 text-xs text-stone-600 border-t border-cream-200 pt-3">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-stone-900">{formatPKR(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Nationwide Shipping</span>
                <span>
                  {shippingFee === 0 ? (
                    <span className="text-emerald-700 font-bold uppercase text-[11px]">Free</span>
                  ) : (
                    formatPKR(shippingFee)
                  )}
                </span>
              </div>
              <div className="flex justify-between text-stone-400">
                <span>Sales Tax</span>
                <span>PKR 0 (Inclusive)</span>
              </div>

              <div className="border-t border-stone-200 pt-3 flex justify-between items-baseline text-base font-bold text-stone-900">
                <span className="font-serif text-lg">Total Amount</span>
                <span className="font-serif text-2xl text-maroon-900">
                  {formatPKR(total)}
                </span>
              </div>
            </div>

            {/* Prominent Place Order button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-maroon-800 hover:bg-maroon-900 text-gold-200 rounded text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl hover:shadow-2xl transition disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-gold-400" />
                  <span>Processing Your Order...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4 text-gold-400" />
                  <span>Place Order ({formatPKR(total)})</span>
                </>
              )}
            </button>

            <div className="text-[11px] text-stone-500 text-center flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Safe & Secure Checkout • Cash on Delivery</span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
