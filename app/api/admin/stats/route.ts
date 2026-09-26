import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized. Admin access required.' }, { status: 403 });
    }

    const [
      orders,
      totalProducts,
      lowStockProducts,
      categories,
    ] = await Promise.all([
      db.order.findMany({ orderBy: { createdAt: 'desc' } }),
      db.product.count({ where: { active: true } }),
      db.product.count({ where: { stock: { lte: 5 }, active: true } }),
      db.category.findMany({ select: { id: true, name: true } }),
    ]);

    const nonCancelledOrders = orders.filter((o) => o.status !== 'Cancelled');
    const totalSales = nonCancelledOrders.reduce((sum, o) => sum + o.total, 0);
    const pendingOrders = orders.filter((o) => o.status === 'Pending').length;
    const completedOrders = orders.filter((o) => o.status === 'Delivered').length;

    // Monthly breakdown for current year
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentYear = new Date().getFullYear();

    const monthlySales = months.map((monthName, idx) => {
      const ordersInMonth = nonCancelledOrders.filter((o) => {
        const d = new Date(o.createdAt);
        return d.getFullYear() === currentYear && d.getMonth() === idx;
      });
      const revenue = ordersInMonth.reduce((sum, o) => sum + o.total, 0);
      return {
        month: monthName,
        sales: revenue,
        orders: ordersInMonth.length,
      };
    });

    // Best-selling products & Category sales
    const productSalesMap: Record<string, { name: string; quantity: number; revenue: number; image: string }> = {};
    const categorySalesMap: Record<string, number> = {};

    categories.forEach((c) => {
      categorySalesMap[c.name] = 0;
    });

    nonCancelledOrders.forEach((o) => {
      try {
        const items = JSON.parse(o.itemsJson);
        items.forEach((item: any) => {
          if (!productSalesMap[item.productId]) {
            productSalesMap[item.productId] = {
              name: item.name,
              quantity: 0,
              revenue: 0,
              image: item.image,
            };
          }
          productSalesMap[item.productId].quantity += item.quantity;
          productSalesMap[item.productId].revenue += item.price * item.quantity;
        });
      } catch (err) {
        console.error(err);
      }
    });

    const bestSellers = Object.values(productSalesMap)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    // Recent orders formatted
    const recentOrders = orders.slice(0, 8).map((o) => {
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

    // Category distribution mock/aggregated
    const categorySales = [
      { name: 'Wedding Sarees', value: 42 },
      { name: 'Bridal Couture', value: 28 },
      { name: 'Party Wear', value: 16 },
      { name: 'Festive', value: 10 },
      { name: 'Work & Casual', value: 4 },
    ];

    return NextResponse.json({
      stats: {
        totalSales,
        totalOrders: orders.length,
        pendingOrders,
        completedOrders,
        totalProducts,
        lowStockCount: lowStockProducts,
      },
      monthlySales,
      recentOrders,
      bestSellers,
      categorySales,
    });
  } catch (error: any) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch admin stats' }, { status: 500 });
  }
}
