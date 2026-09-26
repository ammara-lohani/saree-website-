import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { slugify } from '@/lib/utils';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';

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
    const { name, description, image, active } = await req.json();

    const category = await db.category.update({
      where: { id },
      data: {
        name,
        slug: name ? slugify(name) : undefined,
        description,
        image,
        active,
      },
    });

    revalidatePath('/', 'page');
    revalidatePath('/shop', 'page');
    revalidatePath('/categories', 'page');
    revalidatePath('/admin/categories', 'page');

    return NextResponse.json({ category });
  } catch (error: any) {
    console.error('Error updating category:', error);
    return NextResponse.json({ error: error.message || 'Failed to update category' }, { status: 500 });
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

    // Check if category has products
    const productCount = await db.product.count({
      where: { categoryId: id },
    });

    if (productCount > 0) {
      return NextResponse.json(
        { error: `Cannot delete category: it currently contains ${productCount} products. Please reassign or delete them first.` },
        { status: 400 }
      );
    }

    await db.category.delete({
      where: { id },
    });

    revalidatePath('/', 'page');
    revalidatePath('/shop', 'page');
    revalidatePath('/categories', 'page');
    revalidatePath('/admin/categories', 'page');

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting category:', error);
    return NextResponse.json({ error: error.message || 'Failed to delete category' }, { status: 500 });
  }
}
