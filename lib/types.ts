export interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  image?: string | null;
  active: boolean;
  _count?: {
    products: number;
  };
}

export interface ProductItem {
  id: string;
  name: string;
  slug: string;
  description: string;
  categoryId: string;
  category?: CategoryItem;
  price: number;
  discountPrice?: number | null;
  colors: string[]; // parsed from JSON
  fabric: string;
  images: string[]; // parsed from JSON
  stock: number;
  sku: string;
  featured: boolean;
  newArrival: boolean;
  active: boolean;
  careGuide?: string | null;
  blouseDetails?: string | null;
  createdAt: string;
}

export interface CartItemType {
  id: string; // product id + color unique key
  productId: string;
  name: string;
  slug: string;
  price: number;
  discountPrice?: number | null;
  selectedColor: string;
  image: string;
  quantity: number;
  stock: number;
}

export interface OrderLineItem {
  productId: string;
  name: string;
  slug: string;
  selectedColor: string;
  price: number;
  quantity: number;
  image: string;
}

export interface OrderType {
  id: string;
  orderNumber: string;
  userId?: string | null;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  city: string;
  postalCode: string;
  items: OrderLineItem[];
  subtotal: number;
  shippingFee: number;
  total: number;
  paymentMethod: string;
  status: 'Pending' | 'Confirmed' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  notes?: string | null;
  createdAt: string;
}
