import { db } from '../lib/db';

async function check() {
  const products = await db.product.findMany({
    include: { category: true }
  });
  console.log(`Total products: ${products.length}`);
  products.forEach(p => {
    console.log(`- "${p.name}" => Category: "${p.category?.name}" (${p.category?.slug})`);
  });
}

check().catch(console.error).finally(() => process.exit());
