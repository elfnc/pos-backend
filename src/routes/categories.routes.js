import express from 'express';
import prisma from '../lib/prisma.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/role.middleware.js';
import { Role } from '@prisma/client';

const router = express.Router();

// Get All Categories
router.get('/', authenticate, async (req, res, next) => {
  try {
    const categories = await prisma.category.findMany();
    res.json({ data: categories });
  } catch (error) { next(error); }
});

// Create Category (Admin Only)
router.post('/', authenticate, authorize([Role.ADMIN]), async (req, res, next) => {
  try {
    const { name } = req.body;
    const category = await prisma.category.create({ data: { name } });
    res.status(201).json({ data: category });
  } catch (error) { next(error); }
});

export default router;