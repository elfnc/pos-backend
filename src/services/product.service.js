import prisma from "../lib/prisma.js";
import slugify from "slugify";

export const createProduct = async (productData, file) => {
  const { name, price, stock, categoryId } = productData;

  let slug = slugify(name, { lower: true, strict: true });
  
  const checkSlug = await prisma.product.findUnique({ where: { slug } });
  if (checkSlug) {
    slug = slug + '-' + Date.now();
  }

  let imageUrl = null;
  if (file) {
    // Simpan path relatif agar bisa diakses static
    imageUrl = `/uploads/products/${file.filename}`;
  }

  const product = await prisma.product.create({
    data: {
      name,
      slug,
      price: parseInt(price),
      stock: parseInt(stock),
      image: imageUrl,
      categoryId: categoryId || null,
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
      include: { category: true }
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
      deletedAt: null,
    },
    include: { category: true }
  });

  if (!product) {
    const error = new Error("Product not found");
    error.status = 404;
    throw error;
  }
  return product;
};

export const updateProduct = async (id, productData, file) => {
  const oldProduct = await getProductById(id); // Akan throw error jika tidak ada

  const { name, price, stock, categoryId } = productData;
  const updateData = {};

  // 2. Update field text jika ada
  if (name) {
    updateData.name = name;
    // Opsional: Update slug jika nama berubah
    // updateData.slug = slugify(name, { lower: true, strict: true }); 
  }
  if (price) updateData.price = parseInt(price);
  if (stock) updateData.stock = parseInt(stock);
  if (categoryId) updateData.categoryId = categoryId;

  // 3. Update Gambar jika ada file baru yang diupload
  if (file) {
    updateData.image = `/uploads/products/${file.filename}`;
    
    // (Opsional) Hapus file gambar lama dari server fisik di sini jika perlu
    // if (oldProduct.image) { fs.unlink(...) }
  }

  // 4. Simpan ke Database
  return await prisma.product.update({
    where: { id },
    data: updateData,
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
