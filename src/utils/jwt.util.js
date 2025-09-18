import jwt from 'jsonwebtoken';

const secret = process.env.JWT_SECRET;

/**
 * Membuat JWT baru
 * @param {object} payload - Data yang akan disimpan di dalam token (misal: id, role)
 * @returns {string} - JSON Web Token
 */
export const generateToken = (payload) => {
  // Token akan kedaluwarsa dalam 1 hari
  return jwt.sign(payload, secret, { expiresIn: '1d' });
};

/**
 * Memverifikasi validitas sebuah JWT
 * @param {string} token - Token yang akan diverifikasi
 * @returns {object} - Payload yang telah di-decode dari token
 */
export const verifyToken = (token) => {
  return jwt.verify(token, secret);
};