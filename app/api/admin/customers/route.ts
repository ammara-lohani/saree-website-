import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized. Admin access required.' }, { status: 403 });
    }

    const [registeredUsers, allOrders] = await Promise.all([
      db.user.findMany({
        where: { role: 'customer' },
        orderBy: { createdAt: 'desc' },
        include: {
          orders: {
            orderBy: { createdAt: 'desc' },
          },
        },
      }),
      db.order.findMany({
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    // Format registered customers
    const customers = registeredUsers.map((u) => {
      const orders = u.orders;
      const validOrders = orders.filter((o) => o.status !== 'Cancelled');
      const totalSpent = validOrders.reduce((sum, o) => sum + o.total, 0);
      const lastOrder = orders[0] ? orders[0].createdAt.toISOString() : null;

      return {
        id: u.id,
        name: u.name,
        email: u.email,
        phone: u.phone || 'N/A',
        city: u.city || 'N/A',
        ordersCount: orders.length,
        totalSpent,
        lastOrder,
        type: 'Registered Member',
        createdAt: u.createdAt.toISOString(),
        orderHistory: orders.map((o) => ({
          id: o.id,
          orderNumber: o.orderNumber,
          total: o.total,
          status: o.status,
          createdAt: o.createdAt.toISOString(),
        })),
      };
    });

    // Also identify guest buyers who don't have a registered user account
    const registeredEmails = new Set(registeredUsers.map((u) => u.email.toLowerCase()));
    const guestOrders = allOrders.filter(
      (o) => !o.userId && !registeredEmails.has(o.customerEmail.toLowerCase())
    );

    const guestMap: Record<string, any> = {};
    guestOrders.forEach((o) => {
      const key = o.customerEmail.toLowerCase();
      if (!guestMap[key]) {
        guestMap[key] = {
          id: `guest-${key}`,
          name: o.customerName,
          email: o.customerEmail,
          phone: o.customerPhone,
          city: o.city,
          ordersCount: 0,
          totalSpent: 0,
          lastOrder: o.createdAt.toISOString(),
          type: 'Guest Buyer',
          createdAt: o.createdAt.toISOString(),
          orderHistory: [],
        };
      }
      guestMap[key].ordersCount += 1;
      if (o.status !== 'Cancelled') {
        guestMap[key].totalSpent += o.total;
      }
      guestMap[key].orderHistory.push({
        id: o.id,
        orderNumber: o.orderNumber,
        total: o.total,
        status: o.status,
        createdAt: o.createdAt.toISOString(),
      });
    });

    const combined = [...customers, ...Object.values(guestMap)];

    return NextResponse.json({ customers: combined });
  } catch (error) {
    console.error('Error fetching customers:', error);
    return NextResponse.json({ error: 'Failed to fetch customers' }, { status: 500 });
  }
}
