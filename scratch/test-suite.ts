async function runTests() {
  const BASE = 'http://localhost:3005';
  console.log('=== STARTING AUTOMATED TEST SUITE FOR RIVAAYAT SAREES ===\n');

  // Test 1: Fetch all products
  console.log('1. Testing GET /api/products...');
  const resProducts = await fetch(`${BASE}/api/products`);
  const dataProducts = await resProducts.json();
  console.log(`   Status: ${resProducts.status}, Total active products: ${dataProducts.count}`);
  if (dataProducts.count < 15) throw new Error('Expected at least 15 seeded products');

  // Test 2: Search by "red"
  console.log('\n2. Testing Search: query "red"...');
  const resSearchRed = await fetch(`${BASE}/api/products?search=red`);
  const dataSearchRed = await resSearchRed.json();
  console.log(`   Found ${dataSearchRed.count} sarees matching "red"`);
  if (dataSearchRed.count === 0) throw new Error('Search for "red" failed to return items');
  console.log(`   First result: "${dataSearchRed.products[0].name}"`);

  // Test 3: Search by "wedding"
  console.log('\n3. Testing Search: query "wedding"...');
  const resSearchWedding = await fetch(`${BASE}/api/products?search=wedding`);
  const dataSearchWedding = await resSearchWedding.json();
  console.log(`   Found ${dataSearchWedding.count} sarees matching "wedding"`);
  if (dataSearchWedding.count === 0) throw new Error('Search for "wedding" failed to return items');

  // Test 4: Search by "silk"
  console.log('\n4. Testing Search: query "silk"...');
  const resSearchSilk = await fetch(`${BASE}/api/products?search=silk`);
  const dataSearchSilk = await resSearchSilk.json();
  console.log(`   Found ${dataSearchSilk.count} sarees containing "silk"`);
  if (dataSearchSilk.count === 0) throw new Error('Search for "silk" failed to return items');

  // Test 5: Category filter
  console.log('\n5. Testing Category Filter: "wedding"...');
  const resCat = await fetch(`${BASE}/api/products?category=wedding`);
  const dataCat = await resCat.json();
  console.log(`   Found ${dataCat.count} sarees in category "wedding"`);

  // Test 6: Color filter
  console.log('\n6. Testing Color Filter: "Black"...');
  const resColor = await fetch(`${BASE}/api/products?color=Black`);
  const dataColor = await resColor.json();
  console.log(`   Found ${dataColor.count} sarees with color "Black"`);

  // Test 7: Price range filter
  console.log('\n7. Testing Price Range Filter: PKR 10,000 to PKR 25,000...');
  const resPrice = await fetch(`${BASE}/api/products?minPrice=10000&maxPrice=25000`);
  const dataPrice = await resPrice.json();
  console.log(`   Found ${dataPrice.count} sarees between PKR 10,000 and PKR 25,000`);

  // Test 8: Single product details with related products
  const sampleSlug = dataProducts.products[0].slug;
  console.log(`\n8. Testing Single Product Details for slug: "${sampleSlug}"...`);
  const resSingle = await fetch(`${BASE}/api/products/${sampleSlug}`);
  const dataSingle = await resSingle.json();
  console.log(`   Name: "${dataSingle.product.name}"`);
  console.log(`   Price: PKR ${dataSingle.product.price}`);
  console.log(`   Fabric: ${dataSingle.product.fabric}`);
  console.log(`   Related Sarees count: ${dataSingle.related.length}`);

  // Test 9: Place a new order
  console.log('\n9. Testing Order Placement (Cash on Delivery)...');
  const targetProduct = dataProducts.products[0];
  const initialStock = targetProduct.stock;
  const orderPayload = {
    customerName: 'Fatima Noor',
    customerEmail: 'fatima.noor@test.com',
    customerPhone: '+92 301 5551234',
    shippingAddress: 'Apartment 4B, Regency Heights, Gulberg 3',
    city: 'Lahore',
    postalCode: '54660',
    items: [
      {
        productId: targetProduct.id,
        name: targetProduct.name,
        selectedColor: targetProduct.colors[0] || 'Maroon',
        quantity: 1,
        price: targetProduct.discountPrice || targetProduct.price,
      },
    ],
    paymentMethod: 'Cash on Delivery',
    notes: 'Please call before delivery',
  };

  const resOrder = await fetch(`${BASE}/api/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderPayload),
  });
  const dataOrder = await resOrder.json();
  console.log(`   Order Placement Status: ${resOrder.status}`);
  console.log(`   Assigned Order Number: ${dataOrder.order.orderNumber}`);
  console.log(`   Total Amount: PKR ${dataOrder.order.total}`);
  console.log(`   Payment Method: ${dataOrder.order.paymentMethod}`);

  // Verify stock decremented
  const resStockCheck = await fetch(`${BASE}/api/products/${targetProduct.id}`);
  const dataStockCheck = await resStockCheck.json();
  console.log(`   Stock decremented from ${initialStock} to ${dataStockCheck.product.stock}`);
  if (dataStockCheck.product.stock !== initialStock - 1) {
    throw new Error('Stock was not properly decremented!');
  }

  // Test 10: Authenticate as Admin
  console.log('\n10. Testing Admin Authentication...');
  const resLogin = await fetch(`${BASE}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'admin@rivaayat.pk',
      password: 'AdminPassword123!',
    }),
  });
  const dataLogin = await resLogin.json();
  console.log(`   Admin Login Status: ${resLogin.status}`);
  console.log(`   Logged In User: ${dataLogin.user.name}, Role: ${dataLogin.user.role}`);
  const cookieHeader = resLogin.headers.get('set-cookie');
  if (!cookieHeader) throw new Error('Missing auth cookie in login response');

  // Test 11: Admin dashboard stats
  console.log('\n11. Testing Admin Stats (/api/admin/stats)...');
  const resStats = await fetch(`${BASE}/api/admin/stats`, {
    headers: { Cookie: cookieHeader },
  });
  const dataStats = await resStats.json();
  console.log(`   Total Sales: PKR ${dataStats.stats.totalSales}`);
  console.log(`   Total Orders: ${dataStats.stats.totalOrders}`);
  console.log(`   Low Stock Count: ${dataStats.stats.lowStockCount}`);

  // Test 12: Admin updates order status
  console.log('\n12. Testing Admin Order Status Update (Pending -> Confirmed -> Shipped)...');
  const resUpdate = await fetch(`${BASE}/api/orders/${dataOrder.order.id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Cookie: cookieHeader,
    },
    body: JSON.stringify({ status: 'Confirmed' }),
  });
  const dataUpdate = await resUpdate.json();
  console.log(`   Order ${dataOrder.order.orderNumber} status updated to: ${dataUpdate.order.status}`);
  if (dataUpdate.order.status !== 'Confirmed') throw new Error('Order status update failed');

  // Test 13: Customer Role Guard Verification
  console.log('\n13. Testing Security Role Guard (Regular customer cannot access admin stats)...');
  const resCustomerLogin = await fetch(`${BASE}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'ayesha.khan@example.com',
      password: 'CustomerPassword123!',
    }),
  });
  const custCookie = resCustomerLogin.headers.get('set-cookie');
  const resUnauthorized = await fetch(`${BASE}/api/admin/stats`, {
    headers: { Cookie: custCookie || '' },
  });
  console.log(`   Customer access to /api/admin/stats returned HTTP ${resUnauthorized.status} (Expected 403 Forbidden)`);
  if (resUnauthorized.status !== 403) throw new Error('Security Guard Failed! Non-admin accessed admin API');

  console.log('\n=== ALL 13 AUTOMATED TESTS PASSED SUCCESSFULLY! ===');
}

runTests().catch((err) => {
  console.error('\n❌ Test Suite Failed:', err);
  process.exit(1);
});
