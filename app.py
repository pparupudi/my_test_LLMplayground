#!/usr/bin/env python3
"""
Flask development server for LLM Playground
Provides a better development environment with hot reload and proper CORS handling
"""

from flask import Flask, render_template_string, send_from_directory, jsonify
from flask_cors import CORS
import os
import json
from datetime import datetime

app = Flask(__name__)
CORS(app)

# Configuration
app.config['DEBUG'] = True
app.config['TEMPLATES_AUTO_RELOAD'] = True

# Get the directory where this script is located
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

@app.route('/')
def index():
    """Serve the main HTML file"""
    try:
        with open(os.path.join(BASE_DIR, 'index.html'), 'r', encoding='utf-8') as f:
            return f.read()
    except FileNotFoundError:
        return "index.html not found", 404

@app.route('/styles.css')
def styles():
    """Serve the CSS file"""
    return send_from_directory(BASE_DIR, 'styles.css', mimetype='text/css')

@app.route('/script.js')
def script():
    """Serve the JavaScript file"""
    return send_from_directory(BASE_DIR, 'script.js', mimetype='application/javascript')

@app.route('/api/health')
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat(),
        'version': '1.0.0'
    })

@app.route('/api/models')
def get_models():
    """Get available models (for future API integration)"""
    models = [
        {
            'id': 'gpt-4',
            'name': 'GPT-4',
            'description': 'Most capable model, best for complex tasks',
            'max_tokens': 8192
        },
        {
            'id': 'gpt-3.5-turbo',
            'name': 'GPT-3.5 Turbo',
            'description': 'Fast and efficient for most tasks',
            'max_tokens': 4096
        },
        {
            'id': 'claude-3',
            'name': 'Claude 3',
            'description': 'Anthropic\'s latest model',
            'max_tokens': 4096
        },
        {
            'id': 'llama-2',
            'name': 'Llama 2',
            'description': 'Open source model by Meta',
            'max_tokens': 4096
        }
    ]
    return jsonify({'models': models})

@app.route('/api/generate', methods=['POST'])
def generate_response():
    """
    Simulate LLM generation endpoint
    In a real implementation, this would connect to actual LLM APIs
    """
    from flask import request
    
    try:
        data = request.get_json()
        prompt = data.get('prompt', '')
        model = data.get('model', 'gpt-4')
        temperature = data.get('temperature', 0.7)
        max_tokens = data.get('max_tokens', 1000)
        
        # Simulate processing time
        import time
        time.sleep(1)
        
        # Generate a simulated response
        response_text = f"""This is a simulated response from {model}.

Your prompt: "{prompt[:100]}{'...' if len(prompt) > 100 else ''}"

Parameters used:
- Model: {model}
- Temperature: {temperature}
- Max tokens: {max_tokens}

In a production environment, this endpoint would:
1. Validate the input parameters
2. Make API calls to the selected LLM provider
3. Handle rate limiting and error responses
4. Return the actual generated content

This playground demonstrates the interface and user experience for interacting with language models."""

        # Calculate token usage (simplified estimation)
        prompt_tokens = len(prompt.split()) * 1.3  # Rough estimation
        completion_tokens = len(response_text.split()) * 1.3
        total_tokens = prompt_tokens + completion_tokens
        
        return jsonify({
            'success': True,
            'response': response_text,
            'usage': {
                'prompt_tokens': int(prompt_tokens),
                'completion_tokens': int(completion_tokens),
                'total_tokens': int(total_tokens)
            },
            'model': model,
            'timestamp': datetime.now().isoformat()
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e),
            'timestamp': datetime.now().isoformat()
        }), 500

@app.errorhandler(404)
def not_found(error):
    """Handle 404 errors"""
    return jsonify({'error': 'Not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    """Handle 500 errors"""
    return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    print("🚀 Starting LLM Playground Development Server...")
    print(f"📁 Serving files from: {BASE_DIR}")
    print("🌐 Server will be available at: http://localhost:5000")
    print("🔄 Auto-reload enabled for development")
    print("📡 CORS enabled for API testing")
    print("\n" + "="*50)
    
    app.run(
        host='0.0.0.0',
        port=5000,
        debug=True,
        use_reloader=True,
        threaded=True
    )