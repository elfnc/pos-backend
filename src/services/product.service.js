import prisma from "../lib/prisma.js";

export const createProduct = async (productData) => {
  const { name, price, stock } = productData;

  const product = await prisma.product.create({
    data: {
      name,
      price: parseInt(price),
      stock: parseInt(stock),
    },
  });
  return product;
};

export const getAllProducts = async (page = 1, limit = 10) => {
  const skip = (page - 1) * limit;

  // Filter: hanya ambil yang deletedAt-nya null
  const whereCondition = { deletedAt: null };

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where: whereCondition,
      skip: parseInt(skip),
      take: parseInt(limit),
      orderBy: { createdAt: "desc" },
    }),
    prisma.product.count({ where: whereCondition }), // Hitung hanya yg aktif
  ]);

  return {
    data: products,
    meta: {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getProductById = async (id) => {
  const product = await prisma.product.findFirst({
    where: {
      id,
      deletedAt: null, // Pastikan tidak mengambil barang yang sudah dihapus
    },
  });

  if (!product) {
    const error = new Error("Product not found");
    error.status = 404;
    throw error;
  }
  return product;
};

export const updateProduct = async (id, productData) => {
  await getProductById(id);
  const { name, price, stock } = productData;
  return await prisma.product.update({
    where: { id },
    data: {
      name,
      price: price ? parseInt(price) : undefined,
      stock: stock ? parseInt(stock) : undefined,
    },
  });
};

export const deleteProduct = async (id) => {
  await getProductById(id);
  return await prisma.product.update({
    where: { id },
    data: {
      deletedAt: new Date(),
    },
  });
};
