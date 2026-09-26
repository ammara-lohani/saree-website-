import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { WishlistProvider } from '@/context/WishlistContext';
import ClientShell from '@/components/ClientShell';

export const metadata: Metadata = {
  title: 'Rivaayat Sarees | Luxury Pakistani Saree Brand & Coutures',
  description:
    'Experience Pakistan’s premier heirloom saree couture. Handcrafted Banarasi silks, delicate organzas, royal velvets, and bridal masterpieces.',
  keywords: [
    'Pakistani sarees',
    'luxury sarees Pakistan',
    'Banarasi saree Karachi',
    'organza saree Lahore',
    'wedding sarees Pakistan',
    'bridal saree',
    'chiffon sarees',
    'Rivaayat sarees',
  ],
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#fdfbf7] text-stone-900 antialiased selection:bg-gold-500 selection:text-stone-950">
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <ClientShell>{children}</ClientShell>
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
