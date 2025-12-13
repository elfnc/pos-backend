import Joi from 'joi';

export const createTransactionSchema = Joi.object({
  items: Joi.array().items(
    Joi.object({
      productId: Joi.string().uuid().required().messages({
        'string.guid': 'ID Produk harus berupa UUID yang valid',
        'any.required': 'ID Produk wajib diisi'
      }),
      quantity: Joi.number().integer().min(1).required().messages({
        'number.min': 'Jumlah barang minimal 1',
        'number.base': 'Jumlah barang harus berupa angka'
      })
    })
  ).min(1).required().messages({
    'array.min': 'Transaksi harus memiliki minimal 1 item',
    'array.base': 'Format items salah'
  }),
  paymentAmount: Joi.number().integer().min(0).required().messages({
    'number.base': 'Jumlah pembayaran harus berupa angka',
    'any.required': 'Jumlah pembayaran wajib diisi'
  }),
  paymentMethod: Joi.string().valid('CASH', 'TRANSFER').default('CASH').messages({
    'any.only': 'Metode pembayaran tidak valid (Gunakan: CASH atau TRANSFER)'
  })
});

export const exportTransactionSchema = Joi.object({
  startDate: Joi.date().iso().messages({
    'date.base': 'Format tanggal mulai salah (gunakan ISO 8601, cth: 2023-01-01)',
    'date.format': 'Format tanggal mulai salah'
  }),
  endDate: Joi.date().iso().min(Joi.ref('startDate')).messages({
    'date.base': 'Format tanggal akhir salah',
    'date.min': 'Tanggal akhir tidak boleh lebih kecil dari tanggal mulai'
  })
});