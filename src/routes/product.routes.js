import express from 'express';
import * as productController from '../controllers/product.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/role.middleware.js';
import { Role } from '@prisma/client';
import validate from '../middlewares/validation.middleware.js';
import { createProductSchema, updateProductSchema } from '../validations/product.validation.js';

const router = express.Router();

router.get('/', authenticate, authorize([Role.ADMIN, Role.CASHIER]), productController.getAllProducts);
router.get('/:id', authenticate, authorize([Role.ADMIN, Role.CASHIER]), productController.getProductById);
router.post('/', authenticate, authorize([Role.ADMIN]), validate(createProductSchema),productController.createProduct);
router.put('/:id', authenticate, authorize([Role.ADMIN]), validate(updateProductSchema), productController.updateProduct);
router.delete('/:id', authenticate, authorize([Role.ADMIN]), productController.deleteProduct);

export default router;