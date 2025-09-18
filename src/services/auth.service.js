import prisma from '../lib/prisma.js';
import { comparePassword } from '../utils/password.util.js';
import { generateToken } from '../utils/jwt.util.js';

export const loginUser = async (loginData) => {
  const { username, password } = loginData;

  console.log(loginData)

  if (!username || !password) {
    const error = new Error('Username and password are required');
    error.status = 400;
    throw error;
  }

  const user = await prisma.user.findUnique({
    where: { username },
  });

  if (!user) {
    const error = new Error('Invalid credentials');
    error.status = 401;
    throw error;
  }

  const isPasswordMatch = await comparePassword(password, user.password);

  if (!isPasswordMatch) {
    const error = new Error('Invalid credentials');
    error.status = 401;
    throw error;
  }

  const tokenPayload = {
    id: user.id,
    username: user.username,
    role: user.role,
  };

  const token = generateToken(tokenPayload);

  const userResponse = { ...user };
  delete userResponse.password;

  return { user: userResponse, token };
};