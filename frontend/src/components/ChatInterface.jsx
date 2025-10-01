import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, AlertCircle, CheckCircle, Loader, RotateCcw, RefreshCw } from 'lucide-react';
import { Container, Row, Col, Card, Button, Form, Alert, Spinner } from 'react-bootstrap';
import { apiService, PROVIDERS } from '../services/api';
import NavBar from './NavBar';

const ChatInterface = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [selectedProvider, setSelectedProvider] = useState('anthropic');
  const [selectedModel, setSelectedModel] = useState('claude-3-haiku-20240307');
  const [isLoading, setIsLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('checking');
  const [availableModels, setAvailableModels] = useState({});
  const [retryCount, setRetryCount] = useState(0);
  const messagesEndRef = useRef(null);

  // Check backend connection on component mount
  useEffect(() => {
    checkBackendConnection();
    loadAvailableModels();
  }, []);

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Update selected model when provider changes
  useEffect(() => {
    setSelectedModel(PROVIDERS[selectedProvider].defaultModel);
  }, [selectedProvider]);

  const checkBackendConnection = async () => {
    try {
      await apiService.checkHealth();
      setConnectionStatus('connected');
    } catch (error) {
      setConnectionStatus('disconnected');
      console.error('Backend connection failed:', error);
    }
  };

  const loadAvailableModels = async () => {
    const models = {};
    for (const provider of Object.keys(PROVIDERS)) {
      try {
        if (provider === 'anthropic') {
          const response = await apiService.getModels(provider);
          models[provider] = response.models || PROVIDERS[provider].models;
        } else {
          models[provider] = PROVIDERS[provider].models;
        }
      } catch (error) {
        console.error(`Failed to load ${provider} models:`, error);
        models[provider] = PROVIDERS[provider].models;
      }
    }
    setAvailableModels(models);
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputValue.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await apiService.chat(selectedProvider, userMessage.content, selectedModel);
      
      const assistantMessage = {
        id: Date.now() + 1,
        type: 'assistant',
        content: response.response || response.message || 'No response received',
        provider: selectedProvider,
        model: selectedModel,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
      setRetryCount(0); // Reset retry count on success
    } catch (error) {
      console.error('Chat error:', error);
      
      let errorContent = error.message;
      
      // Provide more helpful error messages
      if (error.message.includes('quota')) {
        errorContent = `💳 ${error.message}\n\nTip: Try switching to a different provider or check your API billing.`;
      } else if (error.message.includes('rate limit')) {
        errorContent = `⏱️ ${error.message}\n\nTip: Please wait a moment before trying again.`;
      } else if (error.message.includes('API key')) {
        errorContent = `🔑 ${error.message}\n\nTip: Check your API key configuration in the environment variables.`;
      } else if (error.message.includes('Network Error') || error.message.includes('fetch')) {
        errorContent = `🌐 Connection failed. Please check if the backend server is running.\n\nTip: Make sure the backend is started with 'npm start'.`;
      }

      const errorMessage = {
        id: Date.now() + 1,
        type: 'error',
        content: errorContent,
        provider: selectedProvider,
        model: selectedModel,
        timestamp: new Date(),
        canRetry: !error.message.includes('quota') && !error.message.includes('API key')
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const retryLastMessage = async () => {
    if (retryCount >= 3) {
      setMessages(prev => [...prev, {
        id: Date.now(),
        type: 'error',
        content: '❌ Maximum retry attempts reached. Please try a different approach or check your configuration.',
        timestamp: new Date()
      }]);
      return;
    }

    setRetryCount(prev => prev + 1);
    
    // Get the last user message
    const lastUserMessage = messages.filter(m => m.type === 'user').pop();
    if (lastUserMessage) {
      setInputValue(lastUserMessage.content);
      setTimeout(() => handleSendMessage(), 100);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearChat = () => {
    setMessages([]);
  };



  const ConnectionStatus = () => {
    const getStatusConfig = () => {
      switch (connectionStatus) {
        case 'connected':
          return {
            status: 'success',
            message: '🟢 Connected to backend',
            showRetry: false
          };
        case 'disconnected':
          return {
            status: 'error',
            message: '🔴 Backend disconnected',
            showRetry: true
          };
        default:
          return {
            status: 'warning',
            message: '🟡 Checking connection...',
            showRetry: false
          };
      }
    };

    const config = getStatusConfig();

    const retryConnection = async () => {
      setConnectionStatus('checking');
      try {
        const response = await fetch('http://localhost:3001/health');
        if (response.ok) {
          setConnectionStatus('connected');
        } else {
          setConnectionStatus('disconnected');
        }
      } catch {
        setConnectionStatus('disconnected');
      }
    };

    return (
      <Alert variant={config.status === 'success' ? 'success' : config.status === 'error' ? 'danger' : 'warning'} className="rounded">
        <div className="d-flex justify-content-between align-items-center">
          <span>{config.message}</span>
          {config.showRetry && (
            <Button
              onClick={retryConnection}
              size="sm"
              variant="outline-secondary"
            >
              🔄 Retry
            </Button>
          )}
        </div>
      </Alert>
    );
  };

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* Navigation Bar */}
      <NavBar
        selectedProvider={selectedProvider}
        setSelectedProvider={setSelectedProvider}
        selectedModel={selectedModel}
        setSelectedModel={setSelectedModel}
        availableModels={availableModels}
        onClearChat={clearChat}
      />
      
      <Container style={{ maxWidth: '1200px' }} className="p-4">

        {/* Debug Connection Status (dev only) */}
        {import.meta.env.DEV && (
          <div className="mb-4 d-flex justify-content-center">
            <ConnectionStatus />
          </div>
        )}

        {/* Messages Area */}
        <div className="chat-container mb-4">
          {messages.length === 0 ? (
            <div className="text-center py-5">
              <div 
                className="d-inline-flex align-items-center justify-content-center rounded-3 mb-4"
                style={{
                  width: '80px',
                  height: '80px',
                  backgroundColor: '#6f42c1',
                  color: 'white'
                }}
              >
                <i className="bi bi-chat-dots" style={{ fontSize: '2.5rem' }}></i>
              </div>
              <h3 className="mb-3">Welcome to <span className="text-primary">LLM Playground</span></h3>
              <p className="text-muted mb-4">
                Start a conversation with any AI provider. Select a provider and model 
                above, then type your message below to begin exploring the power of 
                artificial intelligence.
              </p>
              
              <div className="mb-4">
                <p className="text-muted">
                  Currently using: <strong>{selectedProvider}</strong> • <strong>{selectedModel}</strong>
                </p>
              </div>
              
              <Row className="g-3 justify-content-center">
                <Col md={4}>
                  <Card className="h-100 text-center">
                    <Card.Body>
                      <div className="mb-3 d-flex justify-content-center">
                        <img src="/sparkles-icon.svg" alt="Multiple AI Providers" width="48" height="48" />
                      </div>
                      <h5>Multiple AI Providers</h5>
                      <p className="text-muted small">
                        Switch between OpenAI, Anthropic, Groq, and Gemini
                      </p>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={4}>
                  <Card className="h-100 text-center">
                    <Card.Body>
                      <div className="mb-3 d-flex justify-content-center">
                        <img src="/lightning-icon.svg" alt="Lightning Fast" width="48" height="48" />
                      </div>
                      <h5>Lightning Fast</h5>
                      <p className="text-muted small">
                        Optimized for speed with real-time responses
                      </p>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={4}>
                  <Card className="h-100 text-center">
                    <Card.Body>
                      <div className="mb-3 d-flex justify-content-center">
                        <img src="/brain-icon.svg" alt="Smart Conversations" width="48" height="48" />
                      </div>
                      <h5>Smart Conversations</h5>
                      <p className="text-muted small">
                        Context-aware AI that understands your needs
                      </p>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
              
              <div className="mt-4">
                <p className="text-muted">
                  Ready to get started? Type your first message in the chat box below.
                </p>
              </div>
            </div>
          ) : (
            <div>
              {messages.map((message, index) => (
                <Card key={index} className="mb-3">
                  <Card.Body>
                    <div className="d-flex align-items-start gap-3">
                      <div 
                        className="flex-shrink-0 rounded-circle d-flex align-items-center justify-content-center"
                        style={{
                          width: '40px',
                          height: '40px',
                          backgroundColor: message.role === 'user' ? '#007bff' : '#6c757d',
                          color: 'white'
                        }}
                      >
                        <i className={`bi ${message.role === 'user' ? 'bi-person-fill' : 'bi-robot'}`}></i>
                      </div>
                      <div className="flex-grow-1">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <strong className="text-capitalize">{message.role}</strong>
                          {message.provider && message.model && (
                            <small className="text-muted">
                              {message.provider} • {message.model}
                            </small>
                          )}
                        </div>
                        <div style={{ whiteSpace: 'pre-wrap' }}>
                          {message.content}
                        </div>
                        {message.role === 'assistant' && (
                          <div className="mt-2">
                            <Button
                              variant="outline-secondary"
                              size="sm"
                              onClick={() => handleRetry(index)}
                              disabled={isLoading}
                            >
                              <i className="bi bi-arrow-clockwise me-1"></i>
                              Retry
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              ))}
                <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Area */}
        <Card>
          <Card.Body>
            <div className="d-flex gap-2 align-items-end">
              <div className="flex-grow-1">
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Type your message here... (Press Enter to send, Shift+Enter for new line)"
                  disabled={isLoading}
                  onKeyDown={handleKeyPress}
                />
                <div className="mt-2 d-flex justify-content-between align-items-center">
                  <small className="text-muted">
                    Using: <strong>{selectedProvider}</strong> • <strong>{selectedModel}</strong>
                  </small>
                  <div className="d-flex gap-2">
                    <Button variant="outline-secondary" size="sm">
                      <i className="bi bi-paperclip"></i> Attach
                    </Button>
                    <Button variant="outline-secondary" size="sm">
                      <i className="bi bi-mic"></i> Voice
                    </Button>
                  </div>
                </div>
              </div>
              <Button
                onClick={handleSendMessage}
                variant="primary"
                disabled={isLoading || !inputValue.trim()}
              >
                {isLoading ? (
                  <Spinner animation="border" size="sm" />
                ) : (
                  <i className="bi bi-send"></i>
                )}
              </Button>
            </div>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default ChatInterface;