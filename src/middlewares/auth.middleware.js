import prisma from "../lib/prisma.js"
import {verifyToken} from "../utils/jwt.util.js"

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      const error = new Error('Unauthorized: Missing or invalid token');
      error.status = 401;
      throw error;
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user) {
      const error = new Error('Unauthorized: User not found');
      error.status = 401;
      throw error;
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      error.message = 'Unauthorized: Invalid token';
      error.status = 401;
    }
    if (error.name === 'TokenExpiredError') {
        error.message = 'Unauthorized: Token expired';
        error.status = 401;
    }
    next(error);
  }
};