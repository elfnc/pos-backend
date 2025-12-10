import prisma from '../lib/prisma.js';

export const getDashboardStats = async () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const sevenDaysAgo = new Date(today);
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);

  // 1. Hitung Ringkasan Hari Ini (Omset & Transaksi)
  const todayStats = await prisma.transaction.aggregate({
    _sum: { totalAmount: true },
    _count: { id: true },
    where: {
      createdAt: {
        gte: today,
        lt: tomorrow,
      },
    },
  });

  // 2. Grafik Penjualan 7 Hari Terakhir
  // Ambil transaksi 7 hari terakhir
  const lastWeekTransactions = await prisma.transaction.findMany({
    where: {
      createdAt: { gte: sevenDaysAgo },
    },
    select: {
      createdAt: true,
      totalAmount: true,
    },
  });

  // Format data untuk grafik (Grouping by Date di JS)
  const salesChart = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(sevenDaysAgo);
    d.setDate(d.getDate() + i);
    const dateStr = d.toISOString().split('T')[0]; // YYYY-MM-DD

    // Cari transaksi di tanggal ini
    const dailyTotal = lastWeekTransactions
      .filter((t) => t.createdAt.toISOString().startsWith(dateStr))
      .reduce((sum, t) => sum + t.totalAmount, 0);

    salesChart.push({ date: dateStr, total: dailyTotal });
  }

  // 3. Produk Terlaris (Top 5)
  const topProductsRaw = await prisma.transactionItem.groupBy({
    by: ['productId'],
    _sum: { quantity: true },
    orderBy: {
      _sum: { quantity: 'desc' },
    },
    take: 5,
  });

  // Ambil detail nama produk
  const topProducts = await Promise.all(
    topProductsRaw.map(async (item) => {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
        select: { name: true, price: true, image: true },
      });
      return {
        name: product?.name || 'Unknown Product',
        image: product?.image,
        price: product?.price,
        totalSold: item._sum.quantity,
      };
    })
  );

  // 4. Stok Menipis (Misal di bawah 10)
  const lowStockProducts = await prisma.product.findMany({
    where: {
      stock: { lte: 10 },
      deletedAt: null, // Hanya yg aktif
    },
    select: { id: true, name: true, stock: true },
    take: 5,
    orderBy: { stock: 'asc' },
  });

  return {
    summary: {
      todayRevenue: todayStats._sum.totalAmount || 0,
      todayTransactions: todayStats._count.id || 0,
    },
    salesChart,
    topProducts,
    lowStockProducts,
  };
};