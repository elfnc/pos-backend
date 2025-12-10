import express from 'express';
import * as dashboardController from '../controllers/dashboard.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/role.middleware.js';
import { Role } from '@prisma/client';

const router = express.Router();

// Hanya Admin yang boleh lihat dashboard analitik penuh
router.get('/stats', authenticate, authorize([Role.ADMIN]), dashboardController.getStats);

export default router;