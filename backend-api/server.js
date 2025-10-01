import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Import routes
import openaiRoutes from './routes/openai.js';
import anthropicRoutes from './routes/anthropic.js';
import huggingfaceRoutes from './routes/huggingface.js';
import groqRoutes from './routes/groq.js';
import modelsRoutes from './routes/models.js';

// Import services for unified chat endpoint
import openaiService from './services/openaiService.js';
import anthropicService from './services/anthropicService.js';
import huggingfaceService from './services/huggingfaceService.js';
import groqService from './services/groqService.js';

// Import middleware
import { errorHandler } from './middleware/errorHandler.js';
import { validateApiKeys } from './middleware/validateApiKeys.js';

// Get current directory for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet({
  contentSecurityPolicy: false, // Disable CSP for API
  crossOriginEmbedderPolicy: false
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.',
    retryAfter: Math.ceil((parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000) / 1000)
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

app.use(limiter);

// CORS configuration
const corsOptions = {
  origin: [
    process.env.CORS_ORIGIN || 'http://localhost:5000',
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:3002',
    'http://localhost:3003'
  ],
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: false
};

app.use(cors(corsOptions));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// API key validation middleware
app.use(validateApiKeys);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Unified chat endpoint
app.post('/chat', async (req, res) => {
  try {
    const { provider, prompt, model, temperature, max_tokens, top_p } = req.body;
    
    if (!provider) {
      return res.status(400).json({
        success: false,
        error: 'Provider is required',
        message: 'Please specify a provider (openai, anthropic, huggingface, groq)'
      });
    }

    if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Prompt is required and must be a non-empty string'
      });
    }

    let result;
    
    // Route to the appropriate provider service
    switch (provider.toLowerCase()) {
      case 'openai':
        result = await openaiService.generateCompletion({
          prompt,
          model: model || 'gpt-3.5-turbo',
          temperature: temperature || 0.7,
          max_tokens: max_tokens || 1000,
          top_p: top_p || 1
        });
        break;
      
      case 'anthropic':
        result = await anthropicService.generateCompletion({
          prompt,
          model: model || 'claude-3-haiku-20240307',
          temperature: temperature || 0.7,
          max_tokens: max_tokens || 1000,
          top_p: top_p || 1
        });
        break;
      
      case 'huggingface':
        result = await huggingfaceService.generateCompletion({
          prompt,
          model: model || 'microsoft/DialoGPT-medium',
          temperature: temperature || 0.7,
          max_tokens: max_tokens || 1000,
          top_p: top_p || 1
        });
        break;
      
      case 'groq':
        result = await groqService.generateCompletion({
          prompt,
          model: model || 'mixtral-8x7b-32768',
          temperature: temperature || 0.7,
          max_tokens: max_tokens || 1000,
          top_p: top_p || 1
        });
        break;
      
      default:
        return res.status(400).json({
          success: false,
          error: 'Invalid provider',
          message: `Provider '${provider}' is not supported. Available providers: openai, anthropic, huggingface, groq`
        });
    }

    res.json(result);
  } catch (error) {
    console.error('Chat endpoint error:', error);
    
    const { provider } = req.body;
    
    // Check if it's an API key related error
    if (error.message && (
      (error.message.includes('invalid') && error.message.includes('key')) ||
      error.message.includes('Invalid') && error.message.includes('API key')
    )) {
      return res.status(401).json({
        success: false,
        error: 'Invalid API Key',
        message: `The ${provider || 'API'} API key is invalid or not configured properly. Please check your .env file and ensure you have a valid API key.`
      });
    }
    
    // Check if it's an authentication error
    if (error.message && error.message.includes('authentication')) {
      return res.status(401).json({
        success: false,
        error: 'Authentication Error',
        message: `Authentication failed with ${provider || 'the service'}. Please verify your API key is correct.`
      });
    }
    
    // Generic error for other cases
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message || 'An error occurred while processing your request'
    });
  }
});

// Routes
app.use('/api/openai', openaiRoutes);
app.use('/api/anthropic', anthropicRoutes);
app.use('/api/huggingface', huggingfaceRoutes);
app.use('/api/groq', groqRoutes);
app.use('/api/models', modelsRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    message: `The requested endpoint ${req.originalUrl} does not exist.`,
    availableEndpoints: [
      'POST /api/openai',
      'POST /api/anthropic',
      'POST /api/huggingface',
      'POST /api/groq',
      'GET /health'
    ]
  });
});

// Error handling middleware (must be last)
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔒 CORS origin: ${process.env.CORS_ORIGIN || 'http://localhost:5000'}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});

export default app;