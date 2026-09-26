import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized. Admin access required.' }, { status: 403 });
    }

    const products = await db.product.findMany({
      orderBy: { stock: 'asc' }, // show lowest stock first
      include: {
        category: true,
      },
    });

    const formatted = products.map((p) => {
      let images = [];
      try {
        images = JSON.parse(p.images);
      } catch {
        images = [p.images];
      }
      return {
        id: p.id,
        name: p.name,
        sku: p.sku,
        category: p.category.name,
        price: p.price,
        stock: p.stock,
        image: images[0] || '',
        active: p.active,
        status: p.stock === 0 ? 'Out of Stock' : p.stock <= 5 ? 'Low Stock' : 'In Stock',
      };
    });

    return NextResponse.json({ inventory: formatted });
  } catch (error) {
    console.error('Error fetching inventory:', error);
    return NextResponse.json({ error: 'Failed to fetch inventory' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized. Admin access required.' }, { status: 403 });
    }

    const { productId, stock } = await req.json();

    if (!productId || stock === undefined || stock < 0) {
      return NextResponse.json({ error: 'Valid Product ID and stock quantity required.' }, { status: 400 });
    }

    const updated = await db.product.update({
      where: { id: productId },
      data: { stock: parseInt(stock) },
    });

    return NextResponse.json({ success: true, product: updated });
  } catch (error: any) {
    console.error('Error updating stock:', error);
    return NextResponse.json({ error: error.message || 'Failed to update stock' }, { status: 500 });
  }
}
