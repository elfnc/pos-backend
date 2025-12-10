import prisma from '../lib/prisma.js'

export const createTransaction = async (transactionData, userId) => {
  const { items, paymentAmount } = transactionData;

  const productIds = items.map((item) => item.productId);

  const newTransaction = await prisma.$transaction(async (tx) => {
   // 1. Ambil data produk
    const products = await tx.product.findMany({
      where: { id: { in: productIds } },
    });

    const productMap = new Map(products.map((p) => [p.id, p]));
    let totalAmount = 0;

    // 2. Hitung total & Cek Stok
    for (const item of items) {
      const product = productMap.get(item.productId);
      if (!product) {
        const error = new Error(`Product with ID ${item.productId} not found`);
        error.status = 404; // Set status code spesifik
        throw error;
      }
      if (product.stock < item.quantity) {
        const error = new Error(`Insufficient stock for ${product.name}. Available: ${product.stock}, Required: ${item.quantity}`);
        error.status = 400;
        throw error;
      }
      totalAmount += product.price * item.quantity;
    }

    // 3. Cek Pembayaran
    if (paymentAmount < totalAmount) {
      const error = new Error(`Payment amount is insufficient. Required: ${totalAmount}, Paid: ${paymentAmount}`);
      error.status = 400;
      throw error;
    }
    const changeAmount = paymentAmount - totalAmount;

    // 4. Buat Record Transaksi
    const transaction = await tx.transaction.create({
      data: { userId, totalAmount, paymentAmount, changeAmount },
    });

    // 5. Buat Record Item Transaksi
    const transactionItemsData = items.map((item) => {
      const product = productMap.get(item.productId);
      return {
        transactionId: transaction.id,
        productId: item.productId,
        quantity: item.quantity,
        priceAtTransaction: product.price,
      };
    });
    await tx.transactionItem.createMany({ data: transactionItemsData });

    // 6. Kurangi Stok
    for (const item of items) {
      await tx.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      });
    }

    return tx.transaction.findUnique({
      where: { id: transaction.id },
      include: {
        items: { include: { product: { select: { name: true } } } },
        user: { select: { username: true } },
      },
    });
  });

  return newTransaction;
};

/**
 * Logika bisnis untuk mendapatkan semua transaksi (hanya Admin).
 */
export const getAllTransactions = async (page = 1, limit = 10) => {
  const skip = (page - 1) * limit;

  const [transactions, total] = await Promise.all([
    prisma.transaction.findMany({
      skip: parseInt(skip),
      take: parseInt(limit),
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        user: {
          select: { username: true },
        },
        items: {
          include: {
            product: {
              select: { name: true },
            },
          },
        },
      },
    }),
    prisma.transaction.count(),
  ]);

  return {
    data: transactions,
    meta: {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / limit)
    }
  };
};

/**
 * Logika bisnis untuk mendapatkan satu transaksi berdasarkan ID.
 * @param {string} transactionId - ID dari transaksi yang dicari
 */
export const getTransactionById = async (transactionId) => {
  const transaction = await prisma.transaction.findUnique({
    where: { id: transactionId },
    include: {
      items: {
        include: {
          product: {
            select: { id: true, name: true },
          },
        },
      },
      user: {
        select: { username: true },
      },
    },
  });

  if (!transaction) {
    const error = new Error('Transaction not found');
    error.status = 404;
    throw error;
  }

  return transaction;
};

export const exportTransactions = async (startDate, endDate) => {
  // 1. Buat filter tanggal (opsional)
  const whereClause = {};
  if (startDate && endDate) {
    whereClause.createdAt = {
      gte: new Date(startDate), // Greater than or equal
      lte: new Date(new Date(endDate).setHours(23, 59, 59)), // Less than or equal (sampai akhir hari)
    };
  }

  // 2. Ambil data dari database
  const transactions = await prisma.transaction.findMany({
    where: whereClause,
    orderBy: { createdAt: 'desc' },
    include: {
      user: { select: { username: true } },
      items: {
        include: {
          product: { select: { name: true } }
        }
      }
    }
  });

  // 3. Format data untuk CSV (Flattening)
  // Kita ingin 1 baris CSV = 1 Item barang terjual, bukan 1 Transaksi
  const csvData = [];

  transactions.forEach((trx) => {
    trx.items.forEach((item) => {
      csvData.push({
        'Transaction ID': trx.id,
        'Date': trx.createdAt.toISOString().split('T')[0], // YYYY-MM-DD
        'Time': trx.createdAt.toISOString().split('T')[1].split('.')[0], // HH:MM:SS
        'Cashier': trx.user.username,
        'Product Name': item.product ? item.product.name : 'Deleted Product',
        'Quantity': item.quantity,
        'Price': item.priceAtTransaction,
        'Total Item Price': item.quantity * item.priceAtTransaction,
        'Total Transaction': trx.totalAmount // Info ini akan berulang per item
      });
    });
  });

  return csvData;
};