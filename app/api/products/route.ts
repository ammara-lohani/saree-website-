import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { slugify } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const color = searchParams.get('color');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const availability = searchParams.get('availability');
    const fabric = searchParams.get('fabric');
    const sort = searchParams.get('sort') || 'featured';
    const search = searchParams.get('search')?.trim();
    const featured = searchParams.get('featured');
    const newArrival = searchParams.get('newArrival');
    const limit = searchParams.get('limit');
    const all = searchParams.get('all'); // if admin wants active + inactive

    const where: any = {};

    if (all !== 'true') {
      where.active = true;
    }

    if (featured === 'true') {
      where.featured = true;
    }

    if (newArrival === 'true') {
      where.newArrival = true;
    }

    if (category && category !== 'all') {
      where.category = {
        OR: [
          { slug: category },
          { slug: { contains: category } },
          { name: { contains: category } },
          { id: category },
        ],
      };
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice);
      if (maxPrice) where.price.lte = parseFloat(maxPrice);
    }

    if (availability === 'in-stock') {
      where.stock = { gt: 0 };
    } else if (availability === 'out-of-stock') {
      where.stock = { lte: 0 };
    }

    if (fabric) {
      where.fabric = {
        contains: fabric,
      };
    }

    // Sort order
    let orderBy: any = { createdAt: 'desc' };
    if (sort === 'price-asc') {
      orderBy = { price: 'asc' };
    } else if (sort === 'price-desc') {
      orderBy = { price: 'desc' };
    } else if (sort === 'name-asc') {
      orderBy = { name: 'asc' };
    } else if (sort === 'name-desc') {
      orderBy = { name: 'desc' };
    } else if (sort === 'newest') {
      orderBy = { createdAt: 'desc' };
    } else if (sort === 'featured') {
      orderBy = [{ featured: 'desc' }, { createdAt: 'desc' }];
    }

    let products = await db.product.findMany({
      where,
      orderBy,
      include: {
        category: true,
      },
      take: limit ? parseInt(limit) : undefined,
    });

    // Parse JSON fields
    let formatted = products.map((p) => {
      let parsedColors: string[] = [];
      let parsedImages: string[] = [];
      try {
        parsedColors = JSON.parse(p.colors);
      } catch {
        parsedColors = [p.colors];
      }
      try {
        parsedImages = JSON.parse(p.images);
      } catch {
        parsedImages = [p.images];
      }

      return {
        ...p,
        colors: parsedColors,
        images: parsedImages,
        createdAt: p.createdAt.toISOString(),
      };
    });

    // Filter by color in memory (since SQLite JSON query can vary)
    if (color && color.toLowerCase() !== 'all') {
      const targetColor = color.toLowerCase();
      formatted = formatted.filter((p) =>
        p.colors.some((c) => c.toLowerCase().includes(targetColor))
      );
    }

    // Search query filter (matches name, description, fabric, category name, colors)
    if (search) {
      const q = search.toLowerCase();
      formatted = formatted.filter((p) => {
        const matchName = p.name.toLowerCase().includes(q);
        const matchDesc = p.description.toLowerCase().includes(q);
        const matchFabric = p.fabric.toLowerCase().includes(q);
        const matchCat = p.category?.name.toLowerCase().includes(q);
        const matchColors = p.colors.some((c) => c.toLowerCase().includes(q));
        const matchSku = p.sku.toLowerCase().includes(q);
        return matchName || matchDesc || matchFabric || matchCat || matchColors || matchSku;
      });
    }

    return NextResponse.json({ products: formatted, count: formatted.length });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized. Admin access required.' }, { status: 403 });
    }

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

    if (!name || !categoryId || !price || !fabric) {
      return NextResponse.json(
        { error: 'Name, Category, Price, and Fabric are required fields.' },
        { status: 400 }
      );
    }

    const generatedSku = sku || `RIV-${Date.now().toString().slice(-6)}`;
    const baseSlug = slugify(name);
    let slug = baseSlug;
    const existingSlug = await db.product.findUnique({ where: { slug } });
    if (existingSlug) {
      slug = `${baseSlug}-${Math.floor(Math.random() * 1000)}`;
    }

    const product = await db.product.create({
      data: {
        name,
        slug,
        description: description || '',
        categoryId,
        price: parseFloat(price),
        discountPrice: discountPrice ? parseFloat(discountPrice) : null,
        colors: Array.isArray(colors) ? JSON.stringify(colors) : JSON.stringify([colors || 'Multi']),
        fabric,
        images: Array.isArray(images) ? JSON.stringify(images) : JSON.stringify([images || 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b']),
        stock: parseInt(stock) || 0,
        sku: generatedSku,
        featured: Boolean(featured),
        newArrival: Boolean(newArrival),
        active: active !== undefined ? Boolean(active) : true,
        careGuide: careGuide || null,
        blouseDetails: blouseDetails || null,
      },
      include: {
        category: true,
      },
    });

    return NextResponse.json({ product }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating product:', error);
    return NextResponse.json({ error: error.message || 'Failed to create product' }, { status: 500 });
  }
}
