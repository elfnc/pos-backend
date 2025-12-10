import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Mulai seeding...');

  // Hash password
  const saltRounds = 10;
  const adminPassword = await bcrypt.hash('admin123', saltRounds);
  const cashierPassword = await bcrypt.hash('kasir123', saltRounds);

  // 1. Seed Users (Admin dan Kasir)
  const users = await Promise.all([
    prisma.user.upsert({
      where: { username: 'admin' },
      update: {},
      create: {
        username: 'admin',
        password: adminPassword,
        role: 'ADMIN',
      },
    }),
    prisma.user.upsert({
      where: { username: 'kasir1' },
      update: {},
      create: {
        username: 'kasir1',
        password: cashierPassword,
        role: 'CASHIER',
      },
    }),
    prisma.user.upsert({
      where: { username: 'kasir2' },
      update: {},
      create: {
        username: 'kasir2',
        password: cashierPassword,
        role: 'CASHIER',
      },
    }),
  ]);

  console.log(`✅ ${users.length} user berhasil dibuat`);

  // 2. Seed Categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { name: 'Makanan' },
      update: {},
      create: {
        name: 'Makanan',
      },
    }),
    prisma.category.upsert({
      where: { name: 'Minuman' },
      update: {},
      create: {
        name: 'Minuman',
      },
    }),
    prisma.category.upsert({
      where: { name: 'Snack' },
      update: {},
      create: {
        name: 'Snack',
      },
    }),
    prisma.category.upsert({
      where: { name: 'ATK' },
      update: {},
      create: {
        name: 'ATK',
      },
    }),
  ]);

  console.log(`✅ ${categories.length} kategori berhasil dibuat`);

  // 3. Seed Products
  const foodCategory = categories.find(cat => cat.name === 'Makanan');
  const drinkCategory = categories.find(cat => cat.name === 'Minuman');
  const snackCategory = categories.find(cat => cat.name === 'Snack');
  const atkCategory = categories.find(cat => cat.name === 'ATK');

  const products = await Promise.all([
    // Produk Makanan
    prisma.product.upsert({
      where: { slug: 'nasi-goreng' },
      update: {},
      create: {
        name: 'Nasi Goreng',
        slug: 'nasi-goreng',
        price: 25000,
        stock: 50,
        image: 'https://example.com/images/nasi-goreng.jpg',
        categoryId: foodCategory.id,
      },
    }),
    prisma.product.upsert({
      where: { slug: 'mie-goreng' },
      update: {},
      create: {
        name: 'Mie Goreng',
        slug: 'mie-goreng',
        price: 20000,
        stock: 40,
        image: 'https://example.com/images/mie-goreng.jpg',
        categoryId: foodCategory.id,
      },
    }),

    // Produk Minuman
    prisma.product.upsert({
      where: { slug: 'teh-manis' },
      update: {},
      create: {
        name: 'Teh Manis',
        slug: 'teh-manis',
        price: 5000,
        stock: 100,
        image: 'https://example.com/images/teh-manis.jpg',
        categoryId: drinkCategory.id,
      },
    }),
    prisma.product.upsert({
      where: { slug: 'kopi-hitam' },
      update: {},
      create: {
        name: 'Kopi Hitam',
        slug: 'kopi-hitam',
        price: 8000,
        stock: 80,
        image: 'https://example.com/images/kopi-hitam.jpg',
        categoryId: drinkCategory.id,
      },
    }),

    // Produk Snack
    prisma.product.upsert({
      where: { slug: 'keripik-kentang' },
      update: {},
      create: {
        name: 'Keripik Kentang',
        slug: 'keripik-kentang',
        price: 15000,
        stock: 60,
        image: 'https://example.com/images/keripik-kentang.jpg',
        categoryId: snackCategory.id,
      },
    }),

    // Produk ATK
    prisma.product.upsert({
      where: { slug: 'bolpoint-hitam' },
      update: {},
      create: {
        name: 'Bolpoint Hitam',
        slug: 'bolpoint-hitam',
        price: 5000,
        stock: 200,
        image: 'https://example.com/images/bolpoint.jpg',
        categoryId: atkCategory.id,
      },
    }),
  ]);

  console.log(`✅ ${products.length} produk berhasil dibuat`);

  // 4. Seed Settings (Pengaturan Toko)
  const setting = await prisma.setting.upsert({
    where: { id: 'default-setting' },
    update: {},
    create: {
      id: 'default-setting',
      storeName: 'Toko POS Sejahtera',
      storeAddress: 'Jl. Contoh No. 123, Kota Contoh',
      storePhone: '081234567890',
      receiptFooter: 'Terima Kasih atas Kunjungan Anda',
      printerWidth: 58,
    },
  });

  console.log('✅ Pengaturan toko berhasil dibuat');

  // 5. Seed Contoh Transaksi (Opsional)
  const adminUser = users.find(user => user.username === 'admin');
  const nasiGoreng = products.find(product => product.slug === 'nasi-goreng');
  const tehManis = products.find(product => product.slug === 'teh-manis');

  if (adminUser && nasiGoreng && tehManis) {
    const transaction = await prisma.transaction.create({
      data: {
        totalAmount: 30000,
        paymentAmount: 50000,
        changeAmount: 20000,
        userId: adminUser.id,
        items: {
          create: [
            {
              quantity: 1,
              priceAtTransaction: nasiGoreng.price,
              productId: nasiGoreng.id,
            },
            {
              quantity: 1,
              priceAtTransaction: tehManis.price,
              productId: tehManis.id,
            },
          ],
        },
      },
    });

    console.log('✅ Contoh transaksi berhasil dibuat');
  }

  console.log('🎉 Seeding selesai!');
}

main()
  .catch((e) => {
    console.error('❌ Error saat seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });