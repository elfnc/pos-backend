import express from 'express';
import productRoutes from './product.routes.js';
import authRoutes from './auth.routes.js';
import userRoutes from './user.routes.js';
import transactionRoutes from './transaction.routes.js';
import categoriesRoutes from './categories.routes.js';
import settingRoutes from './setting.routes.js';

const router = express.Router();

router.use('/products', productRoutes);
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/transactions', transactionRoutes);
router.use('/categories', categoriesRoutes);
router.use('/settings', settingRoutes);

export default router;