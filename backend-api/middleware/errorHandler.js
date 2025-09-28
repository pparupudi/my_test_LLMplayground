/**
 * Comprehensive error handling middleware
 */

export const errorHandler = (err, req, res, next) => {
  // Log error for debugging
  console.error('Error occurred:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString()
  });

  // Default error response
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let details = null;

  // Handle specific error types
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation Error';
    details = err.details || err.message;
  } else if (err.name === 'UnauthorizedError') {
    statusCode = 401;
    message = 'Unauthorized';
  } else if (err.code === 'ENOTFOUND' || err.code === 'ECONNREFUSED') {
    statusCode = 503;
    message = 'Service Unavailable';
    details = 'Unable to connect to external API service';
  } else if (err.response) {
    // Handle API response errors (from axios, etc.)
    statusCode = err.response.status || 500;
    message = err.response.data?.error?.message || err.response.statusText || 'External API Error';
    details = err.response.data?.error || null;
  } else if (err.code === 'LIMIT_FILE_SIZE') {
    statusCode = 413;
    message = 'File too large';
  } else if (err.type === 'entity.parse.failed') {
    statusCode = 400;
    message = 'Invalid JSON in request body';
  }

  // Don't expose internal errors in production
  if (process.env.NODE_ENV === 'production' && statusCode === 500) {
    message = 'Internal Server Error';
    details = null;
  }

  // Send error response
  const errorResponse = {
    error: {
      message,
      status: statusCode,
      timestamp: new Date().toISOString()
    }
  };

  // Add details if available and not in production
  if (details && process.env.NODE_ENV !== 'production') {
    errorResponse.error.details = details;
  }

  // Add request ID if available
  if (req.id) {
    errorResponse.error.requestId = req.id;
  }

  res.status(statusCode).json(errorResponse);
};

/**
 * Async error wrapper to catch async errors in route handlers
 */
export const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * Create custom error with status code
 */
export class AppError extends Error {
  constructor(message, statusCode = 500, details = null) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    this.name = 'AppError';
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Validation error
 */
export class ValidationError extends AppError {
  constructor(message, details = null) {
    super(message, 400, details);
    this.name = 'ValidationError';
  }
}

/**
 * Unauthorized error
 */
export class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized') {
    super(message, 401);
    this.name = 'UnauthorizedError';
  }
}