import express from 'express';
import * as authController from '../controllers/auth.controller.js';
import { authLimiter } from '../middlewares/rateLimit.middleware.js';

const router = express.Router();

router.post('/login', authLimiter, authController.login);

export default router;