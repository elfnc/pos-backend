import * as productService from '../services/product.service.js';

export const createProduct = async (req, res, next) => {
  try {
    const product = await productService.createProduct(req.body, req.file);
    res.status(201).json({
      message: 'Product created successfully',
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllProducts = async (req, res, next) => {
  try {
    const { page, limit } = req.query; 
    
    const result = await productService.getAllProducts(page || 1, limit || 10);
    
    res.status(200).json({
      message: 'Products fetched successfully',
      data: result.data,
      meta: result.meta // Kirim metadata pagination ke frontend
    });
  } catch (error) {
    next(error);
  }
};

export const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await productService.getProductById(id);
    res.status(200).json({
      message: 'Product fetched successfully',
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await productService.updateProduct(id, req.body, req.file);
    res.status(200).json({
      message: 'Product updated successfully',
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    await productService.deleteProduct(id);
    res.status(200).json({
      message: 'Product deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};