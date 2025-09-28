# 🚀 LLM Playground

A comprehensive web application for experimenting with Large Language Models. This playground provides both a beautiful frontend interface and a robust backend API for testing prompts, adjusting model parameters, and viewing generated responses from multiple AI providers.

## ✨ Features

- **🎛️ Model Parameters Control**
  - Multiple AI providers (OpenAI, Anthropic, Groq, Hugging Face)
  - Model selection with real-time availability
  - Temperature adjustment (creativity vs. focus)
  - Max tokens configuration
  - Top P parameter tuning

- **📝 Interactive Interface**
  - Large prompt input area
  - Real-time output display
  - Accurate token usage tracking from APIs
  - Copy to clipboard functionality
  - Download responses as text files

- **🎨 Modern Design**
  - Responsive layout (mobile, tablet, desktop)
  - Clean, intuitive UI with gradient backgrounds
  - Smooth animations and transitions
  - Glassmorphism design elements
  - Dark/light mode support

- **🔧 Backend API**
  - RESTful API with Express.js
  - Support for OpenAI, Anthropic, Groq, and Hugging Face APIs
  - Comprehensive error handling and validation
  - Rate limiting and security features
  - CORS support for frontend integration

- **⚡ Development Features**
  - Flask frontend server with hot reload
  - Express.js backend with nodemon
  - Virtual environment setup
  - Comprehensive testing suite
  - Modular architecture for easy extension

## 🚀 Deployment to Vercel

### Prerequisites for Deployment
- A Vercel account
- API keys for the LLM providers you want to use

### Quick Deploy
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/llm-playground)

### Manual Deployment Steps

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

4. **Set Environment Variables in Vercel Dashboard**
   - `OPENAI_API_KEY` - Your OpenAI API key
   - `ANTHROPIC_API_KEY` - Your Anthropic API key
   - `GROQ_API_KEY` - Your Groq API key
   - `HUGGINGFACE_API_KEY` - Your HuggingFace API key

### Vercel Project Structure
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

## 🛠️ Local Development Setup

### Prerequisites
- Python 3.8 or higher
- Node.js 16 or higher
- npm (Node package manager)
- pip (Python package installer)

### Quick Start

#### Frontend Setup

1. **Clone or download the project files**
   ```bash
   cd /path/to/my_test_LLMplayground
   ```

2. **Create virtual environment**
   ```bash
   python3 -m venv venv
   ```

3. **Activate virtual environment**
   ```bash
   # On macOS/Linux:
   source venv/bin/activate
   
   # On Windows:
   venv\\Scripts\\activate
   ```

4. **Install Python dependencies**
   ```bash
   pip install -r requirements.txt
   ```

5. **Run the frontend server**
   ```bash
   python app.py
   ```

#### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend-api
   ```

2. **Install Node.js dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   # Edit .env file with your API keys
   ```

4. **Run the backend server**
   ```bash
   npm start
   ```

#### Access the Application

1. **Frontend**: Navigate to `http://localhost:5000`
2. **Backend API**: Available at `http://localhost:3001`

The frontend will automatically connect to the backend API for real LLM interactions.

## 🧪 Testing

Run the test suite to verify everything works correctly:

```bash
# Activate virtual environment first
source venv/bin/activate

# Run tests
python -m pytest test_app.py -v

# Or run tests with coverage
python -m pytest test_app.py -v --html=test_report.html
```

## 📁 Project Structure

```
my_test_LLMplayground/
├── venv/                   # Virtual environment (frontend)
├── backend-api/            # Backend API server
│   ├── src/
│   │   ├── controllers/    # API route handlers
│   │   ├── middleware/     # Express middleware
│   │   ├── services/       # AI provider integrations
│   │   └── utils/          # Utility functions
│   ├── tests/              # Backend test suite
│   ├── .env.example        # Environment variables template
│   ├── package.json        # Node.js dependencies
│   └── server.js           # Express server entry point
├── index.html             # Main HTML interface
├── styles.css             # CSS styling
├── script.js              # JavaScript functionality
├── app.py                 # Flask frontend server
├── run_dev.py             # Development runner script
├── test_app.py            # Frontend test suite
├── requirements.txt       # Python dependencies
└── README.md              # This file
```

## 🔧 API Endpoints

### Frontend Server (Flask - Port 5000)
- `GET /` - Main interface
- `GET /api/health` - Health check
- `GET /api/models` - Available models
- `POST /api/generate` - Generate responses (simulated)

### Backend API Server (Express - Port 3001)
- `GET /health` - API health check
- `GET /api/openai/models` - OpenAI available models
- `POST /api/openai` - OpenAI chat completions
- `GET /api/anthropic/models` - Anthropic available models
- `POST /api/anthropic` - Anthropic message generation
- `GET /api/groq/models` - Groq available models
- `POST /api/groq` - Groq chat completions
- `GET /api/huggingface/models` - Hugging Face available models
- `POST /api/huggingface` - Hugging Face inference

## 🎮 Usage

1. **Select a Model**: Choose from available LLM models
2. **Adjust Parameters**: 
   - **Temperature**: Lower values (0.1-0.5) for focused responses, higher (0.8-2.0) for creative
   - **Max Tokens**: Set the maximum length of the response
   - **Top P**: Controls diversity of word selection
3. **Enter Prompt**: Type your question or prompt in the text area
4. **Generate**: Click "Generate" or press Ctrl+Enter
5. **Review Output**: View the generated response with token usage statistics
6. **Copy/Download**: Use the buttons to copy or save the response

## 🔑 API Key Configuration

To use the backend API with real AI providers, you need to configure API keys:

1. **Copy the environment template**
   ```bash
   cd backend-api
   cp .env.example .env
   ```

2. **Edit the .env file with your API keys**
   ```bash
   # OpenAI API Key
   OPENAI_API_KEY=your_openai_api_key_here
   
   # Anthropic API Key
   ANTHROPIC_API_KEY=your_anthropic_api_key_here
   
   # Groq API Key
   GROQ_API_KEY=your_groq_api_key_here
   
   # Hugging Face API Key
   HUGGINGFACE_API_KEY=your_huggingface_api_key_here
   ```

3. **Obtain API keys from providers**
   - **OpenAI**: https://platform.openai.com/api-keys
   - **Anthropic**: https://console.anthropic.com/
   - **Groq**: https://console.groq.com/keys
   - **Hugging Face**: https://huggingface.co/settings/tokens

**Note**: You only need API keys for the providers you want to use. The application will gracefully handle missing keys.

## ⌨️ Keyboard Shortcuts

- `Ctrl + Enter` - Generate response
- `Ctrl + K` - Clear all content
- `Ctrl + Shift + C` - Copy output to clipboard

## 🔮 Future Enhancements

- Conversation history and session management
- Custom model fine-tuning interface
- Batch processing capabilities
- Advanced prompt templates
- Response comparison tools
- Model performance analytics
- Custom API provider integration

## 🐛 Troubleshooting

### Frontend Issues

#### Virtual Environment Issues
```bash
# If activation fails, try:
python3 -m venv --clear venv
source venv/bin/activate
pip install -r requirements.txt
```

#### Port Already in Use (Frontend)
```bash
# If port 5000 is busy, modify app.py:
app.run(port=5001)  # Use a different port
```

#### Missing Python Dependencies
```bash
# Reinstall all dependencies:
pip install --force-reinstall -r requirements.txt
```

### Backend Issues

#### Port Already in Use (Backend)
```bash
# If port 3001 is busy, modify backend-api/server.js:
const PORT = process.env.PORT || 3002;  # Use a different port
```

#### Missing Node.js Dependencies
```bash
cd backend-api
rm -rf node_modules package-lock.json
npm install
```

#### API Key Issues
```bash
# Check if .env file exists and has correct format:
cd backend-api
cat .env

# Ensure no extra spaces or quotes around API keys
# Example: OPENAI_API_KEY=sk-1234567890abcdef (no quotes)
```

#### CORS Issues
```bash
# If frontend can't connect to backend, check:
# 1. Backend is running on port 3001
# 2. Frontend is running on port 5000
# 3. No firewall blocking local connections
```

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📞 Support

For issues or questions:
- Check the troubleshooting section
- Review the test output for errors
- Ensure all dependencies are properly installed

---

**Happy experimenting with LLMs! 🎉**