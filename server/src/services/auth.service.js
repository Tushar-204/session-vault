import crypto from 'crypto';
import { userRepository } from '../repositories/user.repository.js';
import { RefreshToken } from '../models/refreshToken.model.js';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt.js';
import { ApiError } from '../utils/ApiError.js';
import { emailService } from './email.service.js';

export class AuthService {
  async register(fullName, email, password) {
    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) {
      throw new ApiError(400, 'An account with this email address already exists.');
    }

    const verificationToken = crypto.randomBytes(32).toString('hex');
    const user = await userRepository.create({
      fullName,
      email,
      password,
      verificationToken,
    });

    // Send verification email in background
    emailService.sendVerificationEmail(email, verificationToken);

    const accessToken = generateAccessToken({ userId: user._id, email: user.email });
    const refreshToken = generateRefreshToken({ userId: user._id });

    // Store Refresh Token in DB
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await RefreshToken.create({
      userId: user._id,
      token: refreshToken,
      expiresAt,
    });

    return { user, accessToken, refreshToken };
  }

  async login(email, password, userAgent = 'Web Browser', ipAddress = '127.0.0.1') {
    const user = await userRepository.findByEmail(email, true);
    if (!user) {
      throw new ApiError(401, 'Invalid email or password.');
    }

    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch) {
      throw new ApiError(401, 'Invalid email or password.');
    }

    const accessToken = generateAccessToken({ userId: user._id, email: user.email });
    const refreshToken = generateRefreshToken({ userId: user._id });

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await RefreshToken.create({
      userId: user._id,
      token: refreshToken,
      userAgent,
      ipAddress,
      expiresAt,
    });

    return { user: user.toJSON(), accessToken, refreshToken };
  }

  async refreshToken(tokenString) {
    if (!tokenString) {
      throw new ApiError(401, 'Refresh token required.');
    }

    const decoded = verifyRefreshToken(tokenString);
    const storedToken = await RefreshToken.findOne({ token: tokenString, userId: decoded.userId });

    if (!storedToken) {
      throw new ApiError(401, 'Refresh token has been revoked or expired.');
    }

    const user = await userRepository.findById(decoded.userId);
    if (!user) {
      throw new ApiError(401, 'User associated with token not found.');
    }

    // Rotate Refresh Token
    await RefreshToken.deleteOne({ _id: storedToken._id });

    const newAccessToken = generateAccessToken({ userId: user._id, email: user.email });
    const newRefreshToken = generateRefreshToken({ userId: user._id });

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await RefreshToken.create({
      userId: user._id,
      token: newRefreshToken,
      expiresAt,
    });

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  }

  async logout(tokenString) {
    if (tokenString) {
      await RefreshToken.deleteOne({ token: tokenString });
    }
    return true;
  }
}

export const authService = new AuthService();
