import React from 'react';
import { Button, Form, Navbar, Container } from 'react-bootstrap';
import { Trash2 } from 'lucide-react';
import { PROVIDERS } from '../services/api';

const NavBar = ({
  selectedProvider,
  setSelectedProvider,
  selectedModel,
  setSelectedModel,
  availableModels,
  onClearChat
}) => {
  const handleProviderChange = (providerKey) => {
    setSelectedProvider(providerKey);
  };

  const handleModelChange = (event) => {
    setSelectedModel(event.target.value);
  };

  const getCurrentModels = () => {
    return availableModels[selectedProvider] || PROVIDERS[selectedProvider]?.models || [];
  };

  return (
    <Navbar bg="white" className="border-bottom shadow-sm py-3" style={{ borderBottom: '1px solid #e9ecef' }}>
      <Container fluid className="px-4">
        {/* Left side - Logo and title */}
        <Navbar.Brand className="d-flex align-items-center me-4">
          <div className="me-3">
            <div 
              className="d-flex align-items-center justify-content-center rounded-2"
              style={{
                width: '40px',
                height: '40px',
                backgroundColor: '#4a5d23',
                color: 'white'
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="2" y="4" width="16" height="12" rx="2" ry="2" fill="white" stroke="none"/>
                <path d="M 2 16 L 2 19 L -1 16 Z" fill="white"/>
                <rect x="4" y="6" width="12" height="8" rx="1" ry="1" fill="none" stroke="#4a5d23" strokeWidth="1.5"/>
              </svg>
            </div>
          </div>
          <div>
            <h1 className="h5 fw-bold text-dark mb-0">LLM Playground</h1>
            <p className="text-muted small mb-0" style={{ fontSize: '0.8rem' }}>Chat with multiple AI providers in one place</p>
          </div>
        </Navbar.Brand>

        {/* Right side - Controls */}
        <div className="d-flex align-items-center gap-3">
          {/* Provider buttons */}
          <div className="d-flex gap-2">
            {Object.entries(PROVIDERS).map(([key, provider]) => (
              <Button
                key={key}
                onClick={() => handleProviderChange(key)}
                className={`rounded-pill px-3 py-2 fw-medium border-0 ${
                  selectedProvider === key 
                    ? 'text-white' 
                    : 'text-dark'
                }`}
                style={{
                  backgroundColor: selectedProvider === key ? '#4a5d23' : '#f8f9fa',
                  fontSize: '0.875rem',
                  transition: 'all 0.2s ease',
                  boxShadow: selectedProvider === key ? '0 2px 4px rgba(74, 93, 35, 0.2)' : '0 1px 3px rgba(0,0,0,0.1)'
                }}
                onMouseEnter={(e) => {
                  if (selectedProvider !== key) {
                    e.target.style.backgroundColor = '#e9ecef';
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedProvider !== key) {
                    e.target.style.backgroundColor = '#f8f9fa';
                  }
                }}
                aria-pressed={selectedProvider === key}
                aria-label={`Select ${provider.name} as AI provider`}
              >
                {provider.name}
              </Button>
            ))}
          </div>

          {/* Model select */}
          <Form.Select
            value={selectedModel}
            onChange={handleModelChange}
            className="rounded-pill border-0"
            style={{ 
              minWidth: '140px',
              backgroundColor: '#f8f9fa',
              fontSize: '0.875rem',
              padding: '0.5rem 1rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}
            aria-label="Select AI model"
          >
            {getCurrentModels().map((model) => (
              <option key={model} value={model}>
                {model}
              </option>
            ))}
          </Form.Select>

          {/* Clear Chat button */}
          <Button
            onClick={onClearChat}
            className="rounded-pill px-3 py-2 fw-medium border-0 text-white d-flex align-items-center"
            style={{
              backgroundColor: '#dc3545',
              fontSize: '0.875rem',
              transition: 'all 0.2s ease',
              boxShadow: '0 2px 4px rgba(220, 53, 69, 0.2)'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#c82333';
              e.target.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#dc3545';
              e.target.style.transform = 'translateY(0)';
            }}
            aria-label="Clear all chat messages"
          >
            <Trash2 size={16} className="me-1" />
            <span className="d-none d-sm-inline">Clear Chat</span>
          </Button>
        </div>
      </Container>
    </Navbar>
  );
};

export default NavBar;