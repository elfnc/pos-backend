import bcrypt from 'bcryptjs';

/**
 * Melakukan hash pada password plain text
 * @param {string} password - Password yang akan di-hash
 * @returns {Promise<string>} - Hashed password
 */
export const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

/**
 * Membandingkan password plain text dengan hashed password
 * @param {string} password - Password dari input user
 * @param {string} hashedPassword - Password dari database
 * @returns {Promise<boolean>} - True jika cocok, false jika tidak
 */
export const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};