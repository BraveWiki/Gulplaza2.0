import { db } from '../src/lib/db'

async function main() {
  // Create sample shopkeepers
  const shopkeeper1 = await db.shopkeeper.upsert({
    where: { phone: '0300-1234567' },
    update: {},
    create: {
      name: 'Ahmed Khan',
      phone: '0300-1234567',
      shopName: 'Al-Faisal Fabrics',
      shopNumber: 'Shop 123, First Floor',
    },
  })

  const shopkeeper2 = await db.shopkeeper.upsert({
    where: { phone: '0321-9876543' },
    update: {},
    create: {
      name: 'Fatima Ali',
      phone: '0321-9876543',
      shopName: 'Gul Electronics',
      shopNumber: 'Shop 45, Ground Floor',
    },
  })

  const shopkeeper3 = await db.shopkeeper.upsert({
    where: { phone: '0345-5555555' },
    update: {},
    create: {
      name: 'Hassan Raza',
      phone: '0345-5555555',
      shopName: 'Royal Jewelry',
      shopNumber: 'Shop 78, Second Floor',
    },
  })

  // Create sample products for Al-Faisal Fabrics
  await db.product.upsert({
    where: { id: 'prod1' },
    update: {},
    create: {
      id: 'prod1',
      title: 'Men\'s Premium Cotton Kurta',
      description: 'High-quality cotton kurta with traditional embroidery. Perfect for festive occasions.',
      price: 1500,
      category: 'clothing',
      imageUrl: null,
      stock: 25,
      shopkeeperId: shopkeeper1.id,
    },
  })

  await db.product.upsert({
    where: { id: 'prod2' },
    update: {},
    create: {
      id: 'prod2',
      title: 'Women\'s Lawn Suit - 3 Piece',
      description: 'Beautiful lawn fabric with digital print. Includes shirt, dupatta, and trouser.',
      price: 2500,
      category: 'clothing',
      imageUrl: null,
      stock: 15,
      shopkeeperId: shopkeeper1.id,
    },
  })

  await db.product.upsert({
    where: { id: 'prod3' },
    update: {},
    create: {
      id: 'prod3',
      title: 'Embroidered Shawl',
      description: 'Elegant embroidered shawl in multiple colors. Perfect for winter.',
      price: 3500,
      category: 'accessories',
      imageUrl: null,
      stock: 10,
      shopkeeperId: shopkeeper1.id,
    },
  })

  // Create sample products for Gul Electronics
  await db.product.upsert({
    where: { id: 'prod4' },
    update: {},
    create: {
      id: 'prod4',
      title: 'Wireless Bluetooth Earbuds',
      description: 'High-quality wireless earbuds with noise cancellation and long battery life.',
      price: 2000,
      category: 'electronics',
      imageUrl: null,
      stock: 30,
      shopkeeperId: shopkeeper2.id,
    },
  })

  await db.product.upsert({
    where: { id: 'prod5' },
    update: {},
    create: {
      id: 'prod5',
      title: 'USB Fast Charger 20W',
      description: 'Fast charging adapter compatible with all smartphones.',
      price: 800,
      category: 'electronics',
      imageUrl: null,
      stock: 50,
      shopkeeperId: shopkeeper2.id,
    },
  })

  await db.product.upsert({
    where: { id: 'prod6' },
    update: {},
    create: {
      id: 'prod6',
      title: 'Power Bank 10000mAh',
      description: 'Portable power bank with dual USB ports. Charge multiple devices simultaneously.',
      price: 1800,
      category: 'electronics',
      imageUrl: null,
      stock: 20,
      shopkeeperId: shopkeeper2.id,
    },
  })

  // Create sample products for Royal Jewelry
  await db.product.upsert({
    where: { id: 'prod7' },
    update: {},
    create: {
      id: 'prod7',
      title: 'Gold Plated Bangle Set',
      description: 'Set of 4 gold plated bangles with intricate design.',
      price: 5000,
      category: 'jewelry',
      imageUrl: null,
      stock: 8,
      shopkeeperId: shopkeeper3.id,
    },
  })

  await db.product.upsert({
    where: { id: 'prod8' },
    update: {},
    create: {
      id: 'prod8',
      title: 'Pearl Necklace Set',
      description: 'Elegant pearl necklace with matching earrings.',
      price: 4500,
      category: 'jewelry',
      imageUrl: null,
      stock: 12,
      shopkeeperId: shopkeeper3.id,
    },
  })

  await db.product.upsert({
    where: { id: 'prod9' },
    update: {},
    create: {
      id: 'prod9',
      title: 'Silver Anklets (Pair)',
      description: 'Beautiful silver anklets with bells. Traditional design.',
      price: 1200,
      category: 'jewelry',
      imageUrl: null,
      stock: 15,
      shopkeeperId: shopkeeper3.id,
    },
  })

  console.log('Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
  })
