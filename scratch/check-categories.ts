import { db } from '../lib/db';

async function check() {
  const categories = await db.category.findMany();
  console.log('Categories in DB:');
  categories.forEach(c => {
    console.log(`- [${c.slug}] "${c.name}": image = ${c.image}`);
  });
}

check().catch(console.error).finally(() => process.exit());
