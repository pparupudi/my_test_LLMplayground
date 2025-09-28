#!/usr/bin/env python3
"""
Test suite for LLM Playground Flask application
"""

import pytest
import json
import os
import sys

# Add the current directory to the path so we can import app
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app import app

@pytest.fixture
def client():
    """Create a test client for the Flask application"""
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

def test_index_route(client):
    """Test that the main page loads correctly"""
    response = client.get('/')
    assert response.status_code == 200
    assert b'LLM Playground' in response.data

def test_css_route(client):
    """Test that CSS file is served correctly"""
    response = client.get('/styles.css')
    assert response.status_code == 200
    assert response.content_type == 'text/css; charset=utf-8'

def test_js_route(client):
    """Test that JavaScript file is served correctly"""
    response = client.get('/script.js')
    assert response.status_code == 200
    assert response.content_type == 'application/javascript; charset=utf-8'

def test_health_check(client):
    """Test the health check endpoint"""
    response = client.get('/api/health')
    assert response.status_code == 200
    
    data = json.loads(response.data)
    assert data['status'] == 'healthy'
    assert 'timestamp' in data
    assert 'version' in data

def test_models_endpoint(client):
    """Test the models API endpoint"""
    response = client.get('/api/models')
    assert response.status_code == 200
    
    data = json.loads(response.data)
    assert 'models' in data
    assert len(data['models']) > 0
    
    # Check that each model has required fields
    for model in data['models']:
        assert 'id' in model
        assert 'name' in model
        assert 'description' in model
        assert 'max_tokens' in model

def test_generate_endpoint(client):
    """Test the generate API endpoint"""
    test_data = {
        'prompt': 'Test prompt for generation',
        'model': 'gpt-4',
        'temperature': 0.7,
        'max_tokens': 100
    }
    
    response = client.post('/api/generate', 
                          data=json.dumps(test_data),
                          content_type='application/json')
    
    assert response.status_code == 200
    
    data = json.loads(response.data)
    assert data['success'] is True
    assert 'response' in data
    assert 'usage' in data
    assert 'model' in data
    assert 'timestamp' in data
    
    # Check usage statistics
    usage = data['usage']
    assert 'prompt_tokens' in usage
    assert 'completion_tokens' in usage
    assert 'total_tokens' in usage
    assert usage['total_tokens'] == usage['prompt_tokens'] + usage['completion_tokens']

def test_generate_endpoint_missing_data(client):
    """Test the generate endpoint with missing data"""
    response = client.post('/api/generate', 
                          data=json.dumps({}),
                          content_type='application/json')
    
    # Should still work with default values
    assert response.status_code == 200

def test_404_error(client):
    """Test 404 error handling"""
    response = client.get('/nonexistent-route')
    assert response.status_code == 404
    
    data = json.loads(response.data)
    assert 'error' in data

if __name__ == '__main__':
    # Run tests if this file is executed directly
    pytest.main([__file__, '-v'])