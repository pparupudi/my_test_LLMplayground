import { UnauthorizedError } from './errorHandler.js';

/**
 * Middleware to validate API keys based on the route
 */
export const validateApiKeys = (req, res, next) => {
  // Skip validation for health check and other non-API routes
  if (!req.path.startsWith('/api/')) {
    return next();
  }

  // Skip validation for models endpoints (they just return available models)
  if (req.path.startsWith('/api/models/')) {
    return next();
  }

  const route = req.path;
  let requiredKey = null;
  let keyName = null;

  // Determine which API key is required based on the route
  if (route.startsWith('/api/openai')) {
    requiredKey = process.env.OPENAI_API_KEY;
    keyName = 'OPENAI_API_KEY';
  } else if (route.startsWith('/api/anthropic')) {
    requiredKey = process.env.ANTHROPIC_API_KEY;
    keyName = 'ANTHROPIC_API_KEY';
  } else if (route.startsWith('/api/huggingface')) {
    requiredKey = process.env.HUGGINGFACE_API_KEY;
    keyName = 'HUGGINGFACE_API_KEY';
  } else if (route.startsWith('/api/groq')) {
    requiredKey = process.env.GROQ_API_KEY;
    keyName = 'GROQ_API_KEY';
  }

  // Check if the required API key exists and is not a placeholder
  if (!requiredKey || requiredKey.includes('your_') || requiredKey.includes('_here')) {
    throw new UnauthorizedError(
      `${keyName} is not configured. Please set up your API key in the .env file.`
    );
  }

  next();
};

/**
 * Validate request body structure
 */
export const validateRequestBody = (req, res, next) => {
  const { prompt } = req.body;

  if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
    const error = new Error('Prompt is required and must be a non-empty string');
    error.statusCode = 400;
    error.name = 'ValidationError';
    return next(error);
  }

  // Validate prompt length (reasonable limit)
  if (prompt.length > 50000) {
    const error = new Error('Prompt is too long. Maximum length is 50,000 characters.');
    error.statusCode = 400;
    error.name = 'ValidationError';
    return next(error);
  }

  next();
};