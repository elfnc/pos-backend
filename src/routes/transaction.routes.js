import express from 'express';
import * as transactionController from '../controllers/transaction.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/role.middleware.js';
import { Role } from '@prisma/client';
import { createTransactionSchema, exportTransactionSchema } from '../validations/transaction.validation.js';
import validate from '../middlewares/validation.middleware.js';

const router = express.Router();

// Endpoint untuk membuat transaksi (Admin & Kasir)
router.post('/', authenticate, authorize([Role.ADMIN, Role.CASHIER]), validate(createTransactionSchema), transactionController.createTransaction);

// Endpoint untuk mendapatkan semua transaksi (Hanya Admin)
router.get('/', authenticate, authorize([Role.ADMIN]), transactionController.getAllTransactions);

router.get('/export', 
  authenticate, 
  authorize([Role.ADMIN]),
  validate(exportTransactionSchema, 'query'),
  transactionController.exportTransactions
);

// Endpoint untuk mendapatkan detail satu transaksi (Admin & Kasir)
router.get('/:id', authenticate, authorize([Role.ADMIN, Role.CASHIER]), transactionController.getTransactionById);


export default router;
