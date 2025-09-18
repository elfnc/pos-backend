import prisma from '../lib/prisma.js'

export const createTransaction = async (transactionData, userId) => {
  const { items, paymentAmount } = transactionData;

  console.log(transactionData)

  // 1. Validasi input dasar
  if (!items || !Array.isArray(items) || items.length === 0) {
    const error = new Error('Transaction items cannot be empty');
    error.status = 400;
    throw error;
  }
  if (paymentAmount === undefined || typeof paymentAmount !== 'number') {
    const error = new Error('Payment amount is required and must be a number');
    error.status = 400;
    throw error;
  }

  const productIds = items.map((item) => item.productId);

  const newTransaction = await prisma.$transaction(async (tx) => {
    const products = await tx.product.findMany({
      where: { id: { in: productIds } },
    });

    const productMap = new Map(products.map((p) => [p.id, p]));
    let totalAmount = 0;

    for (const item of items) {
      const product = productMap.get(item.productId);
      if (!product) throw new Error(`Product with ID ${item.productId} not found`);
      if (product.stock < item.quantity) {
        throw new Error(`Insufficient stock for ${product.name}. Available: ${product.stock}, Required: ${item.quantity}`);
      }
      totalAmount += product.price * item.quantity;
    }

    if (paymentAmount < totalAmount) {
      throw new Error(`Payment amount is insufficient. Required: ${totalAmount}, Paid: ${paymentAmount}`);
    }
    const changeAmount = paymentAmount - totalAmount;

    const transaction = await tx.transaction.create({
      data: { userId, totalAmount, paymentAmount, changeAmount },
    });

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

  console.log(newTransaction)

  return newTransaction;
};

/**
 * Logika bisnis untuk mendapatkan semua transaksi (hanya Admin).
 */
export const getAllTransactions = async () => {
  return await prisma.transaction.findMany({
    orderBy: {
      createdAt: 'desc', // Tampilkan yang terbaru di atas
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
  });
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
