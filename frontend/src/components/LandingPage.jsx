import React, { useState, useRef, useEffect } from 'react';
import { Container, Navbar, Nav, Button, Dropdown, Card, Row, Col, Form, InputGroup, Alert, Spinner } from 'react-bootstrap';
import { apiService } from '../services/api';

const LandingPage = () => {
  const [selectedProvider, setSelectedProvider] = useState('Anthropic');
  const [selectedModel, setSelectedModel] = useState('claude-3-haiku-20240307');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showChat, setShowChat] = useState(false);
  const messagesEndRef = useRef(null);

  const providers = ['OpenAI', 'Anthropic', 'Groq', 'Gemini'];
  const models = {
    'OpenAI': ['gpt-3.5-turbo'],
    'Anthropic': ['claude-3-haiku-20240307', 'claude-3-sonnet-20240229', 'claude-3-opus-20240229'],
    'Groq': ['llama-3.1-8b-instant', 'llama-3.1-70b-versatile', 'mixtral-8x7b-32768'],
    'Gemini': ['gemini-2.5-flash', 'gemini-2.5-pro', 'gemini-2.0-flash']
  };

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleProviderChange = (provider) => {
    setSelectedProvider(provider);
    setSelectedModel(models[provider][0]);
  };

  const handleSendMessage = async () => {
    if (message.trim() && !isLoading) {
      const userMessage = message.trim();
      setMessage('');
      setError(null);
      setShowChat(true);
      
      // Add user message to chat
      const newUserMessage = {
        id: Date.now(),
        type: 'user',
        content: userMessage,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, newUserMessage]);
      setIsLoading(true);

      try {
        // Check if we're in demo mode (no backend available)
        const isDemoMode = window.location.hostname.includes('vercel.app') || window.location.hostname.includes('netlify.app');
        
        if (isDemoMode) {
          // Demo mode - simulate AI response
          await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000)); // Simulate API delay
          
          const demoResponses = [
            "This is a demo response from the LLM Playground! The responsive design is working perfectly on mobile devices.",
            "Hello! I'm simulating a response since this is a demo deployment. The navigation should stack nicely on smaller screens.",
            "Great question! In demo mode, I can show you how the chat interface adapts to different screen sizes.",
            "The responsive design ensures that this chat interface works seamlessly across desktop, tablet, and mobile devices.",
            "This demo showcases the mobile-friendly navigation and chat layout. Try resizing your browser window!"
          ];
          
          const randomResponse = demoResponses[Math.floor(Math.random() * demoResponses.length)];
          
          const aiMessage = {
            id: Date.now() + 1,
            type: 'assistant',
            content: randomResponse,
            model: selectedModel,
            provider: selectedProvider,
            timestamp: new Date()
          };
          setMessages(prev => [...prev, aiMessage]);
        } else {
          // Production mode - use actual API
          const providerMapping = {
            'OpenAI': 'openai',
            'Anthropic': 'anthropic', 
            'Groq': 'groq',
            'Gemini': 'gemini'
          };
          const providerKey = providerMapping[selectedProvider];
          const response = await apiService.chat(providerKey, userMessage, selectedModel);
          
          // Add AI response to chat
          const aiMessage = {
            id: Date.now() + 1,
            type: 'assistant',
            content: response.data.content,
            model: response.data.model,
            provider: selectedProvider,
            timestamp: new Date()
          };
          setMessages(prev => [...prev, aiMessage]);
        }
      } catch (error) {
        console.error('Chat error:', error);
        setError(error.message);
        
        // Add error message to chat
        const errorMessage = {
          id: Date.now() + 1,
          type: 'error',
          content: `Error: ${error.message}`,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, errorMessage]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="landing-page" style={{ minHeight: '100vh', backgroundColor: '#ffffff' }}>
      {/* Custom Styles */}
      <style>{`
        .landing-page {
          --primary-green: #166534;
          --light-green: #22c55e;
          --hover-green: #15803d;
        }
        
        .provider-btn {
          border-radius: 50px !important;
          padding: 8px 20px !important;
          margin: 0 4px !important;
          border: 1px solid #e5e7eb !important;
          background-color: #f9fafb !important;
          color: #374151 !important;
          transition: all 0.2s ease !important;
        }
        
        .provider-btn:hover {
          background-color: #f3f4f6 !important;
          border-color: #d1d5db !important;
          transform: translateY(-1px);
        }
        
        .provider-btn.active {
          background-color: var(--primary-green) !important;
          border-color: var(--primary-green) !important;
          color: white !important;
        }
        
        .custom-dropdown {
          border-radius: 50px !important;
          border: 1px solid #e5e7eb !important;
          padding: 8px 16px !important;
        }
        
        .clear-btn {
          border-radius: 50px !important;
          border: 2px solid #dc2626 !important;
          color: #dc2626 !important;
          background-color: transparent !important;
          padding: 8px 16px !important;
          transition: all 0.2s ease !important;
        }
        
        .clear-btn:hover {
          background-color: #dc2626 !important;
          color: white !important;
        }
        
        .hero-icon {
          width: 80px;
          height: 80px;
          background-color: var(--primary-green);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 2rem;
        }
        
        .feature-card {
          border-radius: 16px !important;
          border: 1px solid #e5e7eb !important;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1) !important;
          transition: all 0.2s ease !important;
          height: 100%;
        }
        
        .feature-card:hover {
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1) !important;
          transform: translateY(-2px);
        }
        
        .feature-icon {
          width: 48px;
          height: 48px;
          background-color: var(--primary-green);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1rem;
        }
        
        .chat-input-container {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          background-color: white;
          border-top: 1px solid #e5e7eb;
          box-shadow: 0 -4px 6px rgba(0, 0, 0, 0.1);
          padding: 20px 0;
          z-index: 1000;
        }
        
        .chat-input {
          border-radius: 50px !important;
          border: 1px solid #e5e7eb !important;
          padding: 12px 20px !important;
          font-size: 16px !important;
        }
        
        .send-btn {
          width: 48px !important;
          height: 48px !important;
          border-radius: 50% !important;
          background-color: var(--primary-green) !important;
          border: none !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          transition: all 0.2s ease !important;
        }
        
        .send-btn:hover {
          background-color: var(--hover-green) !important;
          transform: scale(1.05);
        }
        
        .current-provider-pill {
          background-color: #f3f4f6;
          border: 1px solid #e5e7eb;
          border-radius: 50px;
          padding: 8px 16px;
          font-size: 14px;
          color: #6b7280;
          display: inline-block;
        }
        
        .navbar-custom {
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          padding: 1rem 0;
        }
        
        .logo-icon {
          width: 40px;
          height: 40px;
          background-color: var(--primary-green);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 12px;
        }
      `}</style>

      {/* Navigation */}
      <Container className="py-3">
        <Row className="align-items-center">
          <Col xs={12} md={6} className="mb-2 mb-md-0">
            <div className="d-flex align-items-center">
              <div className="me-3">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ backgroundColor: '#059669', borderRadius: '8px', padding: '6px' }}>
                  <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div>
                <div className="fw-bold" style={{ fontSize: '18px', color: '#111827' }}>LLM Playground</div>
                <div style={{ fontSize: '12px', color: '#6b7280' }}>Chat with multiple AI providers in one place</div>
              </div>
            </div>
          </Col>
          <Col xs={12} md={6} className="d-flex align-items-center justify-content-md-end justify-content-center">
            <div className="d-flex align-items-center gap-2 flex-wrap justify-content-center justify-content-md-end">
              <Dropdown className="me-2">
                <Dropdown.Toggle 
                  variant="outline-secondary" 
                  id="model-dropdown"
                  style={{ 
                    borderColor: '#d1d5db',
                    color: '#374151',
                    fontSize: '14px',
                    padding: '8px 16px'
                  }}
                >
                  {models[selectedProvider]?.find(m => m === selectedModel) || selectedModel}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {models[selectedProvider]?.map((modelOption) => (
                    <Dropdown.Item 
                      key={modelOption}
                      onClick={() => setSelectedModel(modelOption)}
                      active={selectedModel === modelOption}
                    >
                      {modelOption}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
              
              <Button 
                variant="outline-danger" 
                size="sm"
                onClick={() => {
                  setMessages([]);
                  setShowChat(false);
                  setError(null);
                }}
                style={{ 
                  fontSize: '12px',
                  padding: '6px 12px'
                }}
              >
                Clear Chat
              </Button>
            </div>
          </Col>
        </Row>
        
        {/* Provider Buttons */}
        <Row className="mt-3">
          <Col className="d-flex justify-content-center">
            <div className="d-flex flex-wrap justify-content-center gap-2">
              {providers.map((provider) => (
                <Button
                  key={provider}
                  variant={selectedProvider === provider ? "success" : "outline-secondary"}
                  onClick={() => handleProviderChange(provider)}
                  style={{ 
                    fontSize: '14px',
                    padding: '8px 16px',
                    minWidth: '100px'
                  }}
                >
                  {provider}
                </Button>
              ))}
            </div>
          </Col>
        </Row>
      </Container>

      {/* Hero Section */}
      <Container className="text-center py-5" style={{ marginTop: '2rem', marginBottom: '6rem' }}>
        <div className="hero-icon">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        
        <h1 className="display-4 fw-bold mb-4" style={{ color: '#111827' }}>
          Welcome to LLM Playground
        </h1>
        
        <p className="lead mb-4" style={{ color: '#6b7280', maxWidth: '600px', margin: '0 auto' }}>
          Start a conversation with any AI provider. Select a provider and model above, then type your message below to begin exploring the power of artificial intelligence.
        </p>
        
        <div className="current-provider-pill">
          Currently using: {selectedProvider} • {selectedModel}
        </div>
      </Container>

      {/* Feature Cards */}
      <Container className="mb-5" style={{ paddingBottom: '120px' }}>
        <Row className="g-4">
          <Col md={4}>
            <Card className="feature-card h-100 text-center p-4">
              <Card.Body>
                <div className="feature-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75M13 7a4 4 0 11-8 0 4 4 0 018 0z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h5 className="fw-bold mb-3" style={{ color: '#111827' }}>Multiple AI Providers</h5>
                <p style={{ color: '#6b7280' }}>
                  Switch between OpenAI, Anthropic, Groq, and Gemini
                </p>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={4}>
            <Card className="feature-card h-100 text-center p-4">
              <Card.Body>
                <div className="feature-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <polygon points="13,2 3,14 12,14 11,22 21,10 12,10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="white"/>
                  </svg>
                </div>
                <h5 className="fw-bold mb-3" style={{ color: '#111827' }}>Lightning Fast</h5>
                <p style={{ color: '#6b7280' }}>
                  Optimized for speed with real-time responses
                </p>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={4}>
            <Card className="feature-card h-100 text-center p-4">
              <Card.Body>
                <div className="feature-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h5 className="fw-bold mb-3" style={{ color: '#111827' }}>Smart Conversations</h5>
                <p style={{ color: '#6b7280' }}>
                  Context-aware AI that understands your needs
                </p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Chat Display Area */}
      {showChat && (
        <Container className="mb-4" style={{ paddingBottom: '120px' }}>
          <Card className="chat-container" style={{ maxHeight: '400px', overflowY: 'auto', border: '1px solid #e5e7eb', borderRadius: '16px' }}>
            <Card.Header className="bg-light" style={{ borderBottom: '1px solid #e5e7eb' }}>
              <div className="d-flex justify-content-between align-items-center">
                <h6 className="mb-0" style={{ color: '#374151' }}>
                  Chat with {selectedProvider} • {selectedModel}
                </h6>
                <Button 
                  variant="outline-danger" 
                  size="sm" 
                  onClick={() => {
                    setMessages([]);
                    setShowChat(false);
                    setError(null);
                  }}
                  style={{ borderRadius: '20px' }}
                >
                  Clear Chat
                </Button>
              </div>
            </Card.Header>
            <Card.Body className="p-3">
              {error && (
                <Alert variant="danger" className="mb-3">
                  {error}
                </Alert>
              )}
              
              {messages.map((msg) => (
                <div key={msg.id} className={`mb-3 d-flex ${msg.type === 'user' ? 'justify-content-end' : 'justify-content-start'}`}>
                  <div 
                    className={`message-bubble p-3 rounded-3 ${
                      msg.type === 'user' 
                        ? 'bg-primary text-white' 
                        : msg.type === 'error'
                        ? 'bg-danger text-white'
                        : 'bg-light text-dark'
                    }`}
                    style={{ 
                      maxWidth: '70%',
                      wordWrap: 'break-word',
                      whiteSpace: 'pre-wrap',
                      fontSize: '15px',
                      lineHeight: '1.4'
                    }}
                  >
                    {msg.type === 'assistant' && (
                      <small className="d-block mb-1 opacity-75" style={{ fontSize: '0.7rem' }}>
                        {msg.provider} • {msg.model}
                      </small>
                    )}
                    {msg.content}
                    <small className="d-block mt-1 opacity-75" style={{ fontSize: '0.7rem' }}>
                      {msg.timestamp.toLocaleTimeString()}
                    </small>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="d-flex justify-content-start mb-3">
                  <div className="bg-light p-3 rounded-3">
                    <Spinner animation="border" size="sm" className="me-2" />
                    <span>AI is thinking...</span>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </Card.Body>
          </Card>
        </Container>
      )}

      {/* Fixed Chat Input */}
      <div className="chat-input-container">
        <Container>
          <Row className="align-items-center">
            <Col>
              <div className="d-flex align-items-center">
                <div className="me-3 d-flex">
                  <Button variant="link" className="p-0 me-3" style={{ color: '#6b7280', fontSize: '14px' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="me-1">
                      <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66L9.64 16.2a2 2 0 01-2.83-2.83l8.49-8.49" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Attach
                  </Button>
                  <Button variant="link" className="p-0" style={{ color: '#6b7280', fontSize: '14px' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="me-1">
                      <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3zM19 10v2a7 7 0 01-14 0v-2M12 19v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Voice
                  </Button>
                </div>
                
                <div className="flex-grow-1 position-relative">
                  <Form.Control
                    as="textarea"
                    rows={1}
                    className="chat-input"
                    placeholder="Type your message here… (Press Enter to send, Shift+Enter for new line)"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    style={{ 
                      resize: 'none', 
                      paddingRight: '60px',
                      fontSize: '16px',
                      minHeight: '50px'
                    }}
                  />
                  <Button
                    className="send-btn position-absolute"
                    style={{ top: '50%', right: '8px', transform: 'translateY(-50%)' }}
                    onClick={handleSendMessage}
                    disabled={!message.trim() || isLoading}
                  >
                    {isLoading ? (
                      <Spinner animation="border" size="sm" />
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </Button>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default LandingPage;