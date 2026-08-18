/**
 * Higher-Order Function for Wrapping Async Express Route Handlers
 * @param {Function} fn - Async controller function
 */
export const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
