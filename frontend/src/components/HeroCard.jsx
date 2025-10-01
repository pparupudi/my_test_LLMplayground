import React from 'react';
import { Button, Form, Container, Row, Col, Card } from 'react-bootstrap';
import { Trash2 } from 'lucide-react';
import { PROVIDERS } from '../services/api';

const HeroCard = ({
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
    <Card className="shadow-sm">
      <Card.Body className="p-4">
        <div className="text-center mb-4">
          <div 
            className="d-inline-flex align-items-center justify-content-center rounded-3 mb-3"
            style={{
              width: '80px',
              height: '80px',
              backgroundColor: '#4a5d23',
              color: 'white'
            }}
          >
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="4" y="8" width="28" height="20" rx="4" ry="4" fill="white" stroke="none"/>
              <path d="M 4 28 L 4 32 L 0 28 Z" fill="white"/>
              <rect x="8" y="12" width="20" height="12" rx="2" ry="2" fill="none" stroke="#4a5d23" strokeWidth="2"/>
            </svg>
          </div>
          <h2 className="mb-3">Welcome to <span className="text-primary">LLM Playground</span></h2>
          <p className="text-muted">
            Start a conversation with any AI provider. Select a provider and model 
            above, then type your message below to begin exploring the power of 
            artificial intelligence.
          </p>
        </div>
        <Row className="align-items-center">
          {/* Left side - Title and subtitle */}
          <Col lg={6} className="mb-3 mb-lg-0">
            <div className="d-flex align-items-center">
              <div className="welcome-icon me-3">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="2" y="4" width="16" height="12" rx="2" ry="2" fill="#4a5d23" stroke="none"/>
                  <path d="M 2 16 L 2 19 L -1 16 Z" fill="#4a5d23"/>
                  <rect x="4" y="6" width="12" height="8" rx="1" ry="1" fill="none" stroke="white" strokeWidth="1.5"/>
                </svg>
              </div>
              <div>
                <h1 className="h2 fw-bold text-dark mb-1">LLM Playground</h1>
                <p className="text-muted small mb-0">Chat with multiple AI providers in one place</p>
              </div>
            </div>
          </Col>

          {/* Right side - Controls */}
          <Col lg={6}>
            <Row className="g-3">
              {/* Provider buttons */}
              <Col xs={12} sm="auto">
                <div className="d-flex flex-wrap gap-2">
                  {Object.entries(PROVIDERS).map(([key, provider]) => (
                    <Button
                      key={key}
                      onClick={() => handleProviderChange(key)}
                      variant={selectedProvider === key ? 'success' : 'outline-secondary'}
                      size="sm"
                      aria-pressed={selectedProvider === key}
                      aria-label={`Select ${provider.name} as AI provider`}
                    >
                      {provider.name}
                    </Button>
                  ))}
                </div>
              </Col>

              {/* Model select and Clear Chat button */}
              <Col xs={12} sm="auto">
                <div className="d-flex gap-2 align-items-center">
                  <Form.Select
                    value={selectedModel}
                    onChange={handleModelChange}
                    size="sm"
                    style={{ minWidth: '180px' }}
                    aria-label="Select AI model"
                  >
                    {getCurrentModels().map((model) => (
                      <option key={model} value={model}>
                        {model}
                      </option>
                    ))}
                  </Form.Select>

                  <Button
                    onClick={onClearChat}
                    variant="outline-danger"
                    size="sm"
                    className="d-flex align-items-center"
                    aria-label="Clear all chat messages"
                  >
                    <Trash2 size={16} className="me-1" />
                    <span className="d-none d-sm-inline">Clear Chat</span>
                  </Button>
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default HeroCard;