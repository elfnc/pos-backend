import prisma from "../lib/prisma.js"

export const createProduct = async (productData) => {
  const { name, price, stock } = productData;

  if (!name || !price || stock === undefined) {
    const error = new Error('Name, price, and stock are required');
    error.status = 400;
    throw error;
  }

  const product = await prisma.product.create({
    data: {
      name,
      price: parseInt(price),
      stock: parseInt(stock),
    },
  });
  return product;
};

export const getAllProducts = async () => {
  return await prisma.product.findMany();
};

export const getProductById = async (id) => {
  const product = await prisma.product.findUnique({
    where: { id },
  });

  if (!product) {
    const error = new Error('Product not found');
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
  return await prisma.product.delete({
    where: { id },
  });
};