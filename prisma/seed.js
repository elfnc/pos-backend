import { PrismaClient, Role } from '@prisma/client';
import { hash } from 'bcryptjs';

// Inisialisasi Prisma Client
const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  // --- HASH PASSWORDS ---
  const adminPassword = await hash('admin123', 10);
  const cashierPassword = await hash('kasir123', 10);

  // --- CLEANUP DATABASE (Optional) ---
  // Hapus data yang ada agar tidak duplikat saat seeding ulang
  await prisma.transactionItem.deleteMany();
  await prisma.transaction.deleteMany();
  await prisma.user.deleteMany();
  await prisma.product.deleteMany();
  console.log('Cleared existing data.');

  // --- CREATE USERS ---
  await prisma.user.createMany({
    data: [
      {
        username: 'admin',
        password: adminPassword,
        role: Role.ADMIN,
      },
      {
        username: 'kasir',
        password: cashierPassword,
        role: Role.CASHIER,
      },
    ],
  });
  console.log('Created users.');

  // --- CREATE PRODUCTS ---
  await prisma.product.createMany({
    data: [
      { name: 'Kopi Susu Gula Aren', price: 18000, stock: 100 },
      { name: 'Americano', price: 15000, stock: 80 },
      { name: 'Cafe Latte', price: 20000, stock: 75 },
      { name: 'Croissant Coklat', price: 22000, stock: 50 },
      { name: 'Red Velvet Cake', price: 35000, stock: 30 },
      { name: 'Teh Melati', price: 12000, stock: 120 },
    ],
  });
  console.log('Created products.');

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // Tutup koneksi ke database
    await prisma.$disconnect();
  });
