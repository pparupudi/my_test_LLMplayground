# 🚀 Vercel Deployment Guide

This guide will walk you through deploying your LLM Playground to Vercel.

## 📋 Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **Git Repository**: Your code should be in a Git repository (GitHub, GitLab, or Bitbucket)
3. **API Keys**: Obtain API keys from the providers you want to use:
   - OpenAI: [platform.openai.com](https://platform.openai.com/api-keys)
   - Anthropic: [console.anthropic.com](https://console.anthropic.com/)
   - Groq: [console.groq.com](https://console.groq.com/keys)
   - HuggingFace: [huggingface.co/settings/tokens](https://huggingface.co/settings/tokens)

## 🎯 Quick Deploy (Recommended)

### Option 1: Deploy from GitHub

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Prepare for Vercel deployment"
   git push origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Select "Import Git Repository"
   - Choose your repository
   - Click "Import"

3. **Configure Environment Variables**
   - In the deployment configuration, add these environment variables:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   ANTHROPIC_API_KEY=your_anthropic_api_key_here
   GROQ_API_KEY=your_groq_api_key_here
   HUGGINGFACE_API_KEY=your_huggingface_api_key_here
   ```

4. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete
   - Your app will be live at `https://your-project-name.vercel.app`

### Option 2: Deploy with Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy from project root**
   ```bash
   vercel
   ```

4. **Set Environment Variables**
   ```bash
   vercel env add OPENAI_API_KEY
   vercel env add ANTHROPIC_API_KEY
   vercel env add GROQ_API_KEY
   vercel env add HUGGINGFACE_API_KEY
   ```

5. **Redeploy with environment variables**
   ```bash
   vercel --prod
   ```

## 🔧 Configuration Details

### Project Structure
```
├── api/                    # Vercel serverless functions
│   ├── anthropic.js       # Anthropic API endpoint
│   ├── openai.js          # OpenAI API endpoint
│   ├── groq.js            # Groq API endpoint
│   ├── huggingface.js     # HuggingFace API endpoint
│   └── models/            # Model listing endpoints
├── index.html             # Frontend HTML
├── script.js              # Frontend JavaScript
├── styles.css             # Frontend styles
├── vercel.json            # Vercel configuration
└── package.json           # Project configuration
```

### Vercel Configuration (`vercel.json`)
```json
{
  "builds": [
    {
      "src": "index.html",
      "use": "@vercel/static"
    },
    {
      "src": "api/**/*.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/$1"
    }
  ],
  "functions": {
    "api/**/*.js": {
      "runtime": "nodejs18.x"
    }
  }
}
```

## 🌐 API Endpoints

Once deployed, your API endpoints will be available at:

- **Models**: `GET https://your-app.vercel.app/api/models/{provider}`
- **Completions**: `POST https://your-app.vercel.app/api/{provider}`

Where `{provider}` can be: `openai`, `anthropic`, `groq`, or `huggingface`

### Example API Usage

```javascript
// Get available models
const models = await fetch('https://your-app.vercel.app/api/models/openai');

// Generate completion
const response = await fetch('https://your-app.vercel.app/api/openai', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    prompt: 'Hello, how are you?',
    model: 'gpt-3.5-turbo',
    temperature: 0.7,
    max_tokens: 100
  })
});
```

## 🔒 Security Notes

1. **Environment Variables**: Never commit API keys to your repository. Always use environment variables.
2. **CORS**: The API endpoints are configured with CORS headers to allow frontend access.
3. **Rate Limiting**: Consider implementing rate limiting for production use.

## 🐛 Troubleshooting

### Common Issues

1. **API Key Not Found**
   - Ensure environment variables are set in Vercel dashboard
   - Check variable names match exactly (case-sensitive)

2. **CORS Errors**
   - CORS is already configured in the serverless functions
   - If issues persist, check browser console for specific errors

3. **Function Timeout**
   - Vercel has a 10-second timeout for serverless functions
   - Large prompts or slow APIs might timeout

4. **Build Errors**
   - Check the build logs in Vercel dashboard
   - Ensure all dependencies are properly specified

### Getting Help

- Check Vercel deployment logs in the dashboard
- Review browser console for frontend errors
- Test API endpoints directly using curl or Postman

## 🎉 Success!

Once deployed, your LLM Playground will be accessible worldwide at your Vercel URL. You can:

- Test different LLM providers
- Adjust model parameters in real-time
- Share the URL with others
- Monitor usage in the Vercel dashboard

## 📈 Next Steps

- **Custom Domain**: Add a custom domain in Vercel settings
- **Analytics**: Enable Vercel Analytics for usage insights
- **Monitoring**: Set up monitoring for API endpoints
- **Caching**: Implement caching for better performance