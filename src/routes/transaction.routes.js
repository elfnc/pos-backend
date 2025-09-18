import express from 'express';
import * as transactionController from '../controllers/transaction.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/role.middleware.js';
import { Role } from '@prisma/client';

const router = express.Router();

// Endpoint untuk membuat transaksi (Admin & Kasir)
router.post('/', authenticate, authorize([Role.ADMIN, Role.CASHIER]), transactionController.createTransaction);

// Endpoint untuk mendapatkan semua transaksi (Hanya Admin)
router.get('/', authenticate, authorize([Role.ADMIN]), transactionController.getAllTransactions);

// Endpoint untuk mendapatkan detail satu transaksi (Admin & Kasir)
router.get('/:id', authenticate, authorize([Role.ADMIN, Role.CASHIER]), transactionController.getTransactionById);


export default router;
