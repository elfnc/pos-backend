import express from 'express';
import * as userController from '../controllers/user.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/role.middleware.js';
import { Role } from '@prisma/client';

const router = express.Router();

router.post('/', authenticate, authorize([Role.ADMIN]), userController.createUser);
router.get('/', authenticate, authorize([Role.ADMIN]), userController.getAllUsers);
router.get('/:id', authenticate, authorize([Role.ADMIN]), userController.getUserById);
router.put('/:id', authenticate, authorize([Role.ADMIN]), userController.updateUser);
router.delete('/:id', authenticate, authorize([Role.ADMIN]), userController.deleteUser);

export default router;