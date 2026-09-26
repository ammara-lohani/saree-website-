'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItemType, ProductItem } from '@/lib/types';

interface CartContextType {
  items: CartItemType[];
  totalItems: number;
  subtotal: number;
  shippingFee: number;
  total: number;
  freeShippingThreshold: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  addToCart: (product: ProductItem, selectedColor: string, quantity?: number) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItemType[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const FREE_SHIPPING_THRESHOLD = 15000;
  const STANDARD_SHIPPING_FEE = 350;

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('rivaayat_cart');
      if (stored) {
        setItems(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load cart from storage', e);
    }
    setMounted(true);
  }, []);

  // Save to localStorage when items change
  useEffect(() => {
    if (mounted) {
      try {
        localStorage.setItem('rivaayat_cart', JSON.stringify(items));
      } catch (e) {
        console.error('Failed to save cart to storage', e);
      }
    }
  }, [items, mounted]);

  const addToCart = (product: ProductItem, selectedColor: string, quantity = 1) => {
    const itemKey = `${product.id}-${selectedColor}`;
    const effectivePrice = product.discountPrice ? product.discountPrice : product.price;

    setItems((prev) => {
      const existing = prev.find((item) => item.id === itemKey);
      if (existing) {
        return prev.map((item) =>
          item.id === itemKey
            ? { ...item, quantity: Math.min(product.stock, item.quantity + quantity) }
            : item
        );
      } else {
        const newItem: CartItemType = {
          id: itemKey,
          productId: product.id,
          name: product.name,
          slug: product.slug,
          price: effectivePrice,
          discountPrice: product.discountPrice,
          selectedColor: selectedColor || (product.colors && product.colors[0]) || 'Standard',
          image: (product.images && product.images[0]) || 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b',
          quantity: Math.min(product.stock, quantity),
          stock: product.stock,
        };
        return [...prev, newItem];
      }
    });

    setIsCartOpen(true);
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: Math.min(item.stock, quantity) } : item
      )
    );
  };

  const removeFromCart = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingFee = items.length === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_FEE;
  const total = subtotal + shippingFee;

  return (
    <CartContext.Provider
      value={{
        items,
        totalItems,
        subtotal,
        shippingFee,
        total,
        freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
}
