import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const order = await db.order.findFirst({
      where: {
        OR: [{ id }, { orderNumber: id }],
      },
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    let items = [];
    try {
      items = JSON.parse(order.itemsJson);
    } catch {
      items = [];
    }

    return NextResponse.json({
      order: {
        ...order,
        items,
        createdAt: order.createdAt.toISOString(),
      },
    });
  } catch (error) {
    console.error('Error fetching order details:', error);
    return NextResponse.json({ error: 'Failed to fetch order' }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized. Admin access required.' }, { status: 403 });
    }

    const { id } = params;
    const { status } = await req.json();

    const validStatuses = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid order status value.' }, { status: 400 });
    }

    const existingOrder = await db.order.findFirst({
      where: { OR: [{ id }, { orderNumber: id }] },
    });

    if (!existingOrder) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // If changing to Cancelled and wasn't previously cancelled, restock items
    if (status === 'Cancelled' && existingOrder.status !== 'Cancelled') {
      try {
        const items = JSON.parse(existingOrder.itemsJson);
        for (const item of items) {
          if (item.productId && item.quantity) {
            await db.product.update({
              where: { id: item.productId },
              data: { stock: { increment: item.quantity } },
            }).catch(() => null);
          }
        }
      } catch (err) {
        console.error('Error restocking cancelled order:', err);
      }
    }

    const updated = await db.order.update({
      where: { id: existingOrder.id },
      data: { status },
    });

    let items = [];
    try {
      items = JSON.parse(updated.itemsJson);
    } catch {
      items = [];
    }

    return NextResponse.json({
      order: {
        ...updated,
        items,
        createdAt: updated.createdAt.toISOString(),
      },
    });
  } catch (error: any) {
    console.error('Error updating order:', error);
    return NextResponse.json({ error: error.message || 'Failed to update order' }, { status: 500 });
  }
}
