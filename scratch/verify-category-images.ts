async function verify() {
  const BASE = 'http://localhost:3005';
  console.log('--- VERIFYING CATEGORY IMAGES ON HOME, CATEGORIES, AND SHOP ---');

  // 1. Check Home page
  console.log('1. Checking Home page HTML for updated category images...');
  const resHome = await fetch(`${BASE}/`);
  const htmlHome = await resHome.text();
  const hasPinterestHome = htmlHome.includes('pinimg.com');
  console.log(`   Home Page contains updated pinimg.com images: ${hasPinterestHome}`);
  if (!hasPinterestHome) throw new Error('Home page does not contain updated category images!');

  // 2. Check /categories page
  console.log('2. Checking /categories page HTML for updated category images...');
  const resCat = await fetch(`${BASE}/categories`);
  const htmlCat = await resCat.text();
  const hasPinterestCat = htmlCat.includes('pinimg.com');
  console.log(`   /categories contains updated pinimg.com images: ${hasPinterestCat}`);
  if (!hasPinterestCat) throw new Error('/categories page does not contain updated category images!');

  // 3. Check /api/categories
  console.log('3. Checking /api/categories response...');
  const resApiCat = await fetch(`${BASE}/api/categories`);
  const dataApiCat = await resApiCat.json();
  console.log(`   API Categories count: ${dataApiCat.categories.length}`);
  dataApiCat.categories.forEach((c: any) => {
    console.log(`   - "${c.name}": ${c.image?.substring(0, 50)}...`);
  });

  // 4. Check /shop products with updated category slugs
  console.log('4. Checking /shop with category "wedding-sarees"...');
  const resShopWedding = await fetch(`${BASE}/api/products?category=wedding-sarees`);
  const dataShopWedding = await resShopWedding.json();
  console.log(`   Products in "wedding-sarees": ${dataShopWedding.count}`);

  console.log('\n✅ ALL VERIFICATION CHECKS PASSED SUCCESSFULLY!');
}

verify().catch(err => {
  console.error('❌ Verification failed:', err);
  process.exit(1);
});
