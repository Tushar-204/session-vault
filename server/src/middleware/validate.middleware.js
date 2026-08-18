import { ApiError } from '../utils/ApiError.js';

/**
 * Middleware factory for Zod Schema validation
 * @param {import('zod').ZodSchema} schema 
 */
export const validate = (schema) => {
  return (req, res, next) => {
    // GET requests validate query params; everything else validates the body.
    const source = req.method === 'GET' ? req.query : req.body;
    const result = schema.safeParse(source);

    if (!result.success) {
      const errorMessages = result.error.errors.map(
        (issue) => `${issue.path.join('.')}: ${issue.message}`
      );
      throw new ApiError(400, 'Validation failed. Please check input parameters.', errorMessages);
    }

    if (req.method === 'GET') {
      req.query = result.data;
    } else {
      req.body = result.data;
    }
    next();
  };
};
