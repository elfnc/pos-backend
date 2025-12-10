import Joi from 'joi';

export const updateSettingSchema = Joi.object({
  storeName: Joi.string().min(3).required().messages({
    'string.empty': 'Nama toko tidak boleh kosong',
  }),
  storeAddress: Joi.string().allow('', null),
  storePhone: Joi.string().max(15).allow('', null),
  receiptFooter: Joi.string().allow('', null),
  printerWidth: Joi.number().valid(58, 80).required().messages({
    'any.only': 'Ukuran printer harus 58mm atau 80mm'
  }),
});