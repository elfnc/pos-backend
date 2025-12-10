import Joi from 'joi';

export const createProductSchema = Joi.object({
  name: Joi.string().min(3).required().messages({
    'string.base': 'Nama harus berupa teks',
    'string.empty': 'Nama produk tidak boleh kosong',
    'any.required': 'Nama produk wajib diisi'
  }),
  price: Joi.number().integer().min(100).required(),
  stock: Joi.number().integer().min(0).required(),
  categoryId: Joi.string().uuid().optional(),
});

export const updateProductSchema = Joi.object({
  name: Joi.string().min(3),
  price: Joi.number().integer().min(100),
  stock: Joi.number().integer().min(0),
  categoryId: Joi.string().uuid().optional(),
});