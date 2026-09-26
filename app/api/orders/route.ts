import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const user = await getCurrentUser();

    let where: any = {};

    if (user?.role === 'admin') {
      if (status && status !== 'all') {
        where.status = status;
      }
    } else if (user) {
      // Logged in customer: only see their own orders
      where.userId = user.userId;
      if (status && status !== 'all') {
        where.status = status;
      }
    } else {
      // Guest: can query by orderNumber and email
      const orderNumber = searchParams.get('orderNumber');
      const email = searchParams.get('email');
      if (orderNumber && email) {
        where = {
          orderNumber,
          customerEmail: email.toLowerCase().trim(),
        };
      } else {
        return NextResponse.json({ orders: [] });
      }
    }

    const orders = await db.order.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    const formatted = orders.map((o) => {
      let items = [];
      try {
        items = JSON.parse(o.itemsJson);
      } catch {
        items = [];
      }
      return {
        ...o,
        items,
        createdAt: o.createdAt.toISOString(),
      };
    });

    return NextResponse.json({ orders: formatted });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    const body = await req.json();

    const {
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress,
      city,
      postalCode,
      items,
      paymentMethod = 'Cash on Delivery',
      notes,
    } = body;

    if (!customerName || !customerPhone || !shippingAddress || !city || !items || !items.length) {
      return NextResponse.json(
        { error: 'Please provide all required shipping and product information.' },
        { status: 400 }
      );
    }

    // Calculate subtotal and verify stock
    let subtotal = 0;
    const validatedItems = [];

    for (const lineItem of items) {
      const product = await db.product.findUnique({
        where: { id: lineItem.productId },
      });

      if (!product) {
        return NextResponse.json(
          { error: `Product "${lineItem.name}" is no longer available.` },
          { status: 400 }
        );
      }

      if (product.stock < lineItem.quantity) {
        return NextResponse.json(
          {
            error: `Insufficient stock for "${product.name}". Only ${product.stock} left in stock.`,
          },
          { status: 400 }
        );
      }

      const itemPrice = product.discountPrice ? product.discountPrice : product.price;
      subtotal += itemPrice * lineItem.quantity;

      validatedItems.push({
        productId: product.id,
        name: product.name,
        slug: product.slug,
        selectedColor: lineItem.selectedColor || 'Standard',
        price: itemPrice,
        quantity: lineItem.quantity,
        image: lineItem.image || (product.images ? JSON.parse(product.images)[0] : ''),
      });

      // Decrement stock
      await db.product.update({
        where: { id: product.id },
        data: {
          stock: { decrement: lineItem.quantity },
        },
      });
    }

    const FREE_SHIPPING_THRESHOLD = 15000;
    const shippingFee = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 350;
    const total = subtotal + shippingFee;

    // Generate unique order number
    const randomDigits = Math.floor(10000 + Math.random() * 90000);
    const orderNumber = `RIV-${randomDigits}`;

    const order = await db.order.create({
      data: {
        orderNumber,
        userId: user ? user.userId : null,
        customerName,
        customerEmail: customerEmail.toLowerCase().trim(),
        customerPhone,
        shippingAddress,
        city,
        postalCode: postalCode || '00000',
        itemsJson: JSON.stringify(validatedItems),
        subtotal,
        shippingFee,
        total,
        paymentMethod,
        status: 'Pending',
        notes: notes || null,
      },
    });

    return NextResponse.json(
      {
        order: {
          ...order,
          items: validatedItems,
          createdAt: order.createdAt.toISOString(),
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error placing order:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to place order' },
      { status: 500 }
    );
  }
}
