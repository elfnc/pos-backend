import { Role } from '@prisma/client';
import { hashPassword } from '../utils/password.util.js';
import prisma from '../lib/prisma.js'


const userPublicData = {
  id: true,
  username: true,
  role: true,
  createdAt: true,
  updatedAt: true,
};

export const createUser = async (userData) => {
  const { username, password, role } = userData;

  if (!username || !password) {
    const error = new Error('Username and password are required');
    error.status = 400;
    throw error;
  }

  const existingUser = await prisma.user.findUnique({ where: { username } });
  if (existingUser) {
    const error = new Error('Username already taken');
    error.status = 409; // Conflict
    throw error;
  }

  const hashedPassword = await hashPassword(password);

  return await prisma.user.create({
    data: {
      username,
      password: hashedPassword,
      role: role && Object.values(Role).includes(role) ? role : Role.CASHIER,
    },
    select: userPublicData,
  });
};

export const getAllUsers = async () => {
  return await prisma.user.findMany({
    select: userPublicData,
  });
};

export const getUserById = async (id) => {
  const user = await prisma.user.findUnique({
    where: { id },
    select: userPublicData,
  });

  if (!user) {
    const error = new Error('User not found');
    error.status = 404;
    throw error;
  }
  return user;
};

export const updateUser = async (id, userData) => {
  const { username, role } = userData;

  // Pastikan user ada
  await getUserById(id);

  return await prisma.user.update({
    where: { id },
    data: {
      username,
      role: role && Object.values(Role).includes(role) ? role : undefined,
    },
    select: userPublicData,
  });
};

export const deleteUser = async (id) => {
  // Pastikan user ada
  await getUserById(id);
  
  // Cek apakah user memiliki transaksi
  const userTransactions = await prisma.transaction.count({
    where: { userId: id },
  });

  if (userTransactions > 0) {
    const error = new Error('Cannot delete user with existing transactions');
    error.status = 400;
    throw error;
  }

  return await prisma.user.delete({
    where: { id },
  });
};