import jwt from 'jsonwebtoken';
import crypto from 'crypto';

/**
 * Generate Access Token (Short-lived, e.g., 15 minutes)
 * @param {Object} payload - User identification payload { userId, email }
 */
export const generateAccessToken = (payload) => {
  return jwt.sign(
    payload,
    process.env.JWT_ACCESS_SECRET || 'sessionvault_access_secret_default_2026',
    { expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m' }
  );
};

/**
 * Generate Refresh Token (Long-lived, e.g., 7 days)
 * @param {Object} payload - User identification payload { userId }
 */
export const generateRefreshToken = (payload) => {
  return jwt.sign(
    payload,
    process.env.JWT_REFRESH_SECRET || 'sessionvault_refresh_secret_default_2026',
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d', jwtid: crypto.randomUUID() }
  );
};

/**
 * Verify Access Token
 * @param {string} token 
 */
export const verifyAccessToken = (token) => {
  return jwt.verify(token, process.env.JWT_ACCESS_SECRET || 'sessionvault_access_secret_default_2026');
};

/**
 * Verify Refresh Token
 * @param {string} token 
 */
export const verifyRefreshToken = (token) => {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET || 'sessionvault_refresh_secret_default_2026');
};
