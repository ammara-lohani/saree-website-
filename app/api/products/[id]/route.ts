import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { slugify } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Search by ID or slug
    const product = await db.product.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
      },
      include: {
        category: true,
      },
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    let parsedColors: string[] = [];
    let parsedImages: string[] = [];
    try {
      parsedColors = JSON.parse(product.colors);
    } catch {
      parsedColors = [product.colors];
    }
    try {
      parsedImages = JSON.parse(product.images);
    } catch {
      parsedImages = [product.images];
    }

    // Fetch related products in the same category
    const related = await db.product.findMany({
      where: {
        categoryId: product.categoryId,
        id: { not: product.id },
        active: true,
      },
      take: 4,
      include: {
        category: true,
      },
    });

    const formattedRelated = related.map((r) => {
      let rColors: string[] = [];
      let rImages: string[] = [];
      try {
        rColors = JSON.parse(r.colors);
      } catch {
        rColors = [r.colors];
      }
      try {
        rImages = JSON.parse(r.images);
      } catch {
        rImages = [r.images];
      }
      return {
        ...r,
        colors: rColors,
        images: rImages,
        createdAt: r.createdAt.toISOString(),
      };
    });

    return NextResponse.json({
      product: {
        ...product,
        colors: parsedColors,
        images: parsedImages,
        createdAt: product.createdAt.toISOString(),
      },
      related: formattedRelated,
    });
  } catch (error) {
    console.error('Error fetching product details:', error);
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized. Admin access required.' }, { status: 403 });
    }

    const { id } = params;
    const body = await req.json();

    const {
      name,
      description,
      categoryId,
      price,
      discountPrice,
      colors,
      fabric,
      images,
      stock,
      sku,
      featured,
      newArrival,
      active,
      careGuide,
      blouseDetails,
    } = body;

    const updated = await db.product.update({
      where: { id },
      data: {
        name,
        slug: name ? slugify(name) : undefined,
        description,
        categoryId,
        price: price !== undefined ? parseFloat(price) : undefined,
        discountPrice: discountPrice !== undefined ? (discountPrice ? parseFloat(discountPrice) : null) : undefined,
        colors: colors ? (Array.isArray(colors) ? JSON.stringify(colors) : JSON.stringify([colors])) : undefined,
        fabric,
        images: images ? (Array.isArray(images) ? JSON.stringify(images) : JSON.stringify([images])) : undefined,
        stock: stock !== undefined ? parseInt(stock) : undefined,
        sku,
        featured: featured !== undefined ? Boolean(featured) : undefined,
        newArrival: newArrival !== undefined ? Boolean(newArrival) : undefined,
        active: active !== undefined ? Boolean(active) : undefined,
        careGuide,
        blouseDetails,
      },
      include: {
        category: true,
      },
    });

    return NextResponse.json({ product: updated });
  } catch (error: any) {
    console.error('Error updating product:', error);
    return NextResponse.json({ error: error.message || 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized. Admin access required.' }, { status: 403 });
    }

    const { id } = params;

    await db.product.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ error: error.message || 'Failed to delete product' }, { status: 500 });
  }
}
