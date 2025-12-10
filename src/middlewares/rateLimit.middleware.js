import rateLimit from 'express-rate-limit';

// Limiter umum untuk semua API (misal: 100 request per 15 menit)
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 menit
  max: 100, 
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 429,
    message: 'Too many requests, please try again later.',
  },
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 5, 
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 429,
    message: 'Too many login attempts, please try again after 15 minutes.',
  },
});