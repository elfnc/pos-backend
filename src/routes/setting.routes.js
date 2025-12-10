import express from 'express';
import * as settingController from '../controllers/setting.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/role.middleware.js';
import { Role } from '@prisma/client';
import validate from '../middlewares/validation.middleware.js';
import { updateSettingSchema } from '../validations/setting.validation.js';

const router = express.Router();

// GET Settings (Admin & Kasir butuh ini untuk cetak struk/header aplikasi)
router.get('/', authenticate, authorize([Role.ADMIN, Role.CASHIER]), settingController.getSetting);

// UPDATE Settings (Hanya Admin)
router.put('/', 
  authenticate, 
  authorize([Role.ADMIN]), 
  validate(updateSettingSchema), 
  settingController.updateSetting
);

export default router;