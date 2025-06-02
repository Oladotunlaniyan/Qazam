// Custom error class for API errors

class ApiError extends Error {
    constructor(message, statusCode) {
      super(message);
      this.statusCode = statusCode;
      this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
      this.isOperational = true;
  
      Error.captureStackTrace(this, this.constructor);
    }
  }
  
  const notFound = (req, res, next) => {
    const error = new ApiError(`Not Found - ${req.originalUrl}`, 404);
    next(error);
  };
  
  const asyncHandler = (fn) => (req, res, next) =>
    Promise.resolve(fn(req, res, next)).catch(next);
  
  module.exports = {
    ApiError,
    notFound,
    asyncHandler,
  };