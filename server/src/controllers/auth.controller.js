import { authService } from '../services/auth.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';

export const register = asyncHandler(async (req, res) => {
  const { fullName, email, password } = req.body;
  const { user, accessToken, refreshToken } = await authService.register(fullName, email, password);

  // Set Refresh Token in HttpOnly cookie
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  res.status(201).json(
    new ApiResponse(201, { user, accessToken }, 'User registered successfully.')
  );
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const userAgent = req.headers['user-agent'] || 'Browser';
  const ipAddress = req.ip || '127.0.0.1';

  const { user, accessToken, refreshToken } = await authService.login(
    email,
    password,
    userAgent,
    ipAddress
  );

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(200).json(
    new ApiResponse(200, { user, accessToken, refreshToken }, 'Login successful.')
  );
});

export const refreshToken = asyncHandler(async (req, res) => {
  const tokenString = req.cookies.refreshToken || req.body.refreshToken;
  const { accessToken, refreshToken: newRefreshToken } = await authService.refreshToken(tokenString);

  res.cookie('refreshToken', newRefreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(200).json(
    new ApiResponse(200, { accessToken, refreshToken: newRefreshToken }, 'Access token refreshed successfully.')
  );
});

export const logout = asyncHandler(async (req, res) => {
  const tokenString = req.cookies.refreshToken || req.body.refreshToken;
  await authService.logout(tokenString);

  res.clearCookie('refreshToken');
  res.status(200).json(new ApiResponse(200, null, 'Logged out successfully.'));
});

export const getMe = asyncHandler(async (req, res) => {
  res.status(200).json(new ApiResponse(200, { user: req.user }, 'Current user profile fetched.'));
});
