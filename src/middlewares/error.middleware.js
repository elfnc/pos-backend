import { Prisma } from '@prisma/client';
import logger from '../utils/logger.js';

const errorMiddleware = (err, req, res, next) => {
  // Log error ke file/console menggunakan logger yang sudah ada
  logger.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);

  // 1. Handle Error Validasi Joi (Biasanya status 400)
  if (err.isJoi) {
      return res.status(400).json({
          message: 'Validation Error',
          error: err.message
      });
  }

  // 2. Handle Error Spesifik Prisma
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    // Code P2002: Unique constraint failed (Misal: Username sudah ada)
    if (err.code === 'P2002') {
      const field = err.meta?.target?.join(', ') || 'field';
      return res.status(409).json({
        message: `Conflict Error: ${field} already exists.`,
      });
    }
    // Code P2025: Record not found (Saat update/delete data yg ga ada)
    if (err.code === 'P2025') {
      return res.status(404).json({
        message: 'Resource not found.',
      });
    }
  }

  // 3. Handle Error Custom (yang kita throw new Error)
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';

  return res.status(status).json({
    message: message,
  });
};

export default errorMiddleware;