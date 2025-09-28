# AI Providers Backend API

A secure Node.js backend API that provides unified access to multiple AI providers including OpenAI, Anthropic, Hugging Face, and Groq. Built with Express.js and modern JavaScript (ESM).

## ✨ Features

- 🔐 **Secure API Key Management** - All API keys stored securely in environment variables
- 🌐 **Multiple AI Providers** - Support for OpenAI, Anthropic, Hugging Face, and Groq
- 🛡️ **Comprehensive Security** - Rate limiting, CORS, input validation, and error handling
- 📊 **Unified Response Format** - Consistent JSON responses across all providers
- 🚀 **Modern Architecture** - ESM imports, modular design, and async/await
- 📝 **Detailed Logging** - Comprehensive error logging and debugging information
- ⚡ **Lazy Initialization** - API clients initialized only when needed
- 🔄 **CORS Support** - Configured for frontend integration on localhost:5000

## Quick Start

### 1. Installation

```bash
# Clone or navigate to the backend-api directory
cd backend-api

# Install dependencies
npm install
```

### 2. Environment Setup

Copy the example environment file and configure your API keys:

```bash
cp .env.example .env
```

Edit the `.env` file with your actual API keys:

```env
# Server Configuration
PORT=3001
NODE_ENV=development

# OpenAI API Configuration
OPENAI_API_KEY=sk-your-openai-api-key-here

# Anthropic API Configuration
ANTHROPIC_API_KEY=sk-ant-your-anthropic-api-key-here

# Hugging Face API Configuration
HUGGINGFACE_API_KEY=hf_your-huggingface-api-key-here

# Groq API Configuration
GROQ_API_KEY=gsk_your-groq-api-key-here

# CORS Configuration
CORS_ORIGIN=http://localhost:5000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### 3. Getting API Keys

#### OpenAI
1. Visit [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in to your account
3. Navigate to API Keys section
4. Create a new API key

#### Anthropic
1. Visit [Anthropic Console](https://console.anthropic.com/)
2. Sign up or log in to your account
3. Navigate to API Keys section
4. Create a new API key

#### Hugging Face
1. Visit [Hugging Face](https://huggingface.co/)
2. Sign up or log in to your account
3. Go to Settings → Access Tokens
4. Create a new token with read permissions

#### Groq
1. Visit [Groq Console](https://console.groq.com/)
2. Sign up or log in to your account
3. Navigate to API Keys section
4. Create a new API key

### 4. Start the Server

```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:3001` (or the port specified in your `.env` file).

## API Endpoints

### Health Check

```http
GET /health
```

Returns server status and basic information.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "uptime": 3600,
  "environment": "development"
}
```

### OpenAI

#### Generate Completion
```http
POST /api/openai
Content-Type: application/json

{
  "prompt": "Explain quantum computing in simple terms",
  "temperature": 0.7,
  "max_tokens": 1000,
  "top_p": 1,
  "model": "gpt-3.5-turbo"
}
```

#### List Models
```http
GET /api/openai/models
```

### Anthropic

#### Generate Completion
```http
POST /api/anthropic
Content-Type: application/json

{
  "prompt": "Write a creative story about AI and humans",
  "temperature": 0.7,
  "max_tokens": 1000,
  "top_p": 1,
  "model": "claude-3-sonnet-20240229"
}
```

#### List Models
```http
GET /api/anthropic/models
```

### Hugging Face

#### Generate Completion
```http
POST /api/huggingface
Content-Type: application/json

{
  "prompt": "Help me debug this Python code",
  "temperature": 0.7,
  "max_tokens": 1000,
  "top_p": 1,
  "model": "microsoft/DialoGPT-large"
}
```

#### List Models
```http
GET /api/huggingface/models
```

### Groq

#### Generate Completion
```http
POST /api/groq
Content-Type: application/json

{
  "prompt": "Create a business plan for a tech startup",
  "temperature": 0.7,
  "max_tokens": 1000,
  "top_p": 1,
  "model": "llama3-8b-8192"
}
```

#### List Models
```http
GET /api/groq/models
```

## Request Parameters

### Required Parameters

- **prompt** (string): The user prompt/question for the AI model

### Optional Parameters

- **temperature** (number): Controls randomness (0-2 for OpenAI/Groq, 0-1 for Anthropic/HuggingFace)
- **max_tokens** (number): Maximum tokens to generate (1-4000 for most providers)
- **top_p** (number): Nucleus sampling parameter (0-1)
- **model** (string): Specific model to use (defaults provided for each provider)

## Response Format

All successful responses follow this format:

```json
{
  "success": true,
  "data": {
    "content": "Generated text response...",
    "model": "gpt-3.5-turbo",
    "usage": {
      "prompt_tokens": 15,
      "completion_tokens": 150,
      "total_tokens": 165
    },
    "finish_reason": "stop"
  },
  "provider": "openai",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## Error Handling

Error responses follow this format:

```json
{
  "error": {
    "message": "Error description",
    "status": 400,
    "timestamp": "2024-01-15T10:30:00.000Z"
  }
}
```

### Common Error Codes

- **400** - Bad Request (invalid parameters, missing prompt)
- **401** - Unauthorized (invalid or missing API key)
- **429** - Too Many Requests (rate limit exceeded)
- **503** - Service Unavailable (external API temporarily down)
- **500** - Internal Server Error

## Security Features

### Rate Limiting
- Default: 100 requests per 15 minutes per IP
- Configurable via environment variables

### CORS Protection
- Configurable allowed origins
- Default: `http://localhost:5000`

### Input Validation
- Prompt length limits (max 50,000 characters)
- Parameter range validation
- Request body structure validation

### API Key Security
- Keys stored in environment variables only
- Never exposed to client-side code
- Validation before processing requests

## Development

### Project Structure

```
backend-api/
├── middleware/
│   ├── errorHandler.js      # Error handling and custom error classes
│   └── validateApiKeys.js   # API key and request validation
├── routes/
│   ├── openai.js           # OpenAI route handlers
│   ├── anthropic.js        # Anthropic route handlers
│   ├── huggingface.js      # Hugging Face route handlers
│   └── groq.js             # Groq route handlers
├── services/
│   ├── openaiService.js    # OpenAI API client
│   ├── anthropicService.js # Anthropic API client
│   ├── huggingfaceService.js # Hugging Face API client
│   └── groqService.js      # Groq API client
├── server.js               # Main Express server
├── package.json            # Dependencies and scripts
├── .env.example           # Environment variables template
└── README.md              # This file
```

### Available Scripts

```bash
# Start development server with auto-reload
npm run dev

# Start production server
npm start

# Install dependencies
npm install
```

### Adding New Providers

1. Create a new service in `services/` directory
2. Create a new route handler in `routes/` directory
3. Add the route to `server.js`
4. Update environment variables in `.env.example`
5. Add API key validation in `validateApiKeys.js`

## Troubleshooting

### Common Issues

1. **"API key not configured" error**
   - Ensure your `.env` file has the correct API key
   - Check that the key doesn't contain placeholder text

2. **CORS errors**
   - Verify `CORS_ORIGIN` in `.env` matches your frontend URL
   - Ensure the frontend is running on the specified origin

3. **Rate limit exceeded**
   - Wait for the rate limit window to reset
   - Adjust `RATE_LIMIT_MAX_REQUESTS` if needed

4. **Module import errors**
   - Ensure you're using Node.js version 14 or higher
   - Check that `"type": "module"` is in `package.json`

### Logs

The server provides detailed logging for debugging:
- Request information
- Error details with stack traces
- API response information

## License

This project is licensed under the MIT License.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## Support

For issues and questions:
1. Check the troubleshooting section
2. Review the error logs
3. Ensure all environment variables are correctly set
4. Verify API keys are valid and have sufficient credits