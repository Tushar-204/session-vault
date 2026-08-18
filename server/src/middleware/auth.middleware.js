import { verifyAccessToken } from '../utils/jwt.js';
import { ApiError } from '../utils/ApiError.js';
import { userRepository } from '../repositories/user.repository.js';
import { asyncHandler } from '../utils/asyncHandler.js';

/**
 * Authentication Middleware
 * Validates JWT access token from Bearer Header or Cookie
 */
export const authenticate = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies && req.cookies.accessToken) {
    token = req.cookies.accessToken;
  }

  if (!token) {
    throw new ApiError(401, 'Authentication failed. Access token is missing.');
  }

  try {
    const decoded = verifyAccessToken(token);
    const user = await userRepository.findById(decoded.userId);

    if (!user) {
      throw new ApiError(401, 'User account no longer exists.');
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new ApiError(401, 'Access token expired. Please refresh your token.', ['TOKEN_EXPIRED']);
    }
    throw new ApiError(401, 'Invalid or corrupted access token.');
  }
});
