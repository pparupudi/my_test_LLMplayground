import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const AboutMe = () => {
  return (
    <div className="about-me-page" style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      {/* Custom Styles */}
      <style>{`
        .about-me-page {
          --primary-green: #166534;
          --light-green: #22c55e;
          --hover-green: #15803d;
        }
        
        .hero-section {
          background: linear-gradient(135deg, var(--primary-green) 0%, var(--light-green) 100%);
          color: white;
          padding: 80px 0;
        }
        
        .profile-card {
          border: none;
          border-radius: 15px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
          transition: transform 0.3s ease;
        }
        
        .profile-card:hover {
          transform: translateY(-5px);
        }
        
        .skill-badge {
          background: var(--light-green);
          color: white;
          padding: 8px 16px;
          border-radius: 20px;
          margin: 5px;
          display: inline-block;
          font-size: 0.9rem;
        }
        

        .section-title {
          color: var(--primary-green);
          font-weight: 700;
          margin-bottom: 30px;
          position: relative;
        }
        
        .section-title::after {
          content: '';
          position: absolute;
          bottom: -10px;
          left: 0;
          width: 50px;
          height: 3px;
          background: var(--light-green);
        }
      `}</style>

      {/* Navigation Header */}
      <Container className="py-3">
        <Row className="align-items-center">
          <Col xs={12} md={6} className="mb-2 mb-md-0">
            <Link to="/" className="text-decoration-none">
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
            </Link>
          </Col>
          <Col xs={12} md={6} className="d-flex align-items-center justify-content-md-end justify-content-center">
            <div className="d-flex align-items-center gap-2">
              <Link to="/">
                <Button 
                  variant="outline-success" 
                  size="sm"
                  style={{ 
                    fontSize: '12px',
                    padding: '6px 12px'
                  }}
                >
                  Back to Playground
                </Button>
              </Link>
            </div>
          </Col>
        </Row>
      </Container>

      {/* Hero Section */}
      <div className="hero-section">
        <Container>
          <Row className="justify-content-center text-center">
            <Col lg={8}>
              <h1 className="display-4 fw-bold mb-4">About Me</h1>
              <p className="lead">
                Welcome to my AI Playground! I'm passionate about exploring the capabilities 
                of different AI models and creating tools that make AI accessible to everyone.
              </p>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Main Content */}
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col lg={10}>
            {/* Profile Card */}
            <Card className="profile-card mb-5">
              <Card.Body className="p-5">
                <Row>
                  <Col md={4} className="text-center mb-4 mb-md-0">
                    <div 
                      style={{
                        width: '150px',
                        height: '150px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, var(--primary-green), var(--light-green))',
                        margin: '0 auto',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '3rem',
                        color: 'white',
                        fontWeight: 'bold'
                      }}
                    >
                      P
                    </div>
                    <h3 className="mt-3 mb-1">Prasanthi</h3>
                    <p className="text-muted">Product Designer & AI Enthusiast</p>
                  </Col>
                  <Col md={8}>
                    <h4 className="section-title">About Me</h4>
                    <p className="mb-4">
                      I'm a Product Designer with 4+ years of experience specializing in turning complex problems 
                      into intuitive solutions. By integrating generative AI into my design process, I merge human 
                      empathy with machine intelligence to transform complex systems into adaptive and empowering experiences.
                      I work across Healthcare, EdTech, E-commerce, and Logistics domains.
                    </p>
                    
                    <h4 className="section-title">About This Project</h4>
                    <p className="mb-4">
                      This LLM Playground is a comprehensive platform that allows users to interact 
                      with multiple AI models from different providers including OpenAI, Anthropic, 
                      Groq, and Google Gemini. The goal is to provide a unified interface for 
                      comparing and exploring the capabilities of various large language models.
                      This project showcases my passion for making AI more accessible and user-friendly.
                    </p>
                    
                    <h5 className="fw-bold mb-3">Key Features:</h5>
                    <ul className="mb-4">
                      <li>Multi-provider AI model support</li>
                      <li>Real-time chat interface</li>
                      <li>Model comparison capabilities</li>
                      <li>Responsive design for all devices</li>
                      <li>Clean and intuitive user experience</li>
                    </ul>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            {/* Skills & Technologies */}
            <Card className="profile-card mb-5">
              <Card.Body className="p-5">
                <h4 className="section-title">Technologies Used</h4>
                <div className="mb-4">
                  <span className="skill-badge">React</span>
                  <span className="skill-badge">Node.js</span>
                  <span className="skill-badge">Express</span>
                  <span className="skill-badge">Bootstrap</span>
                  <span className="skill-badge">Vite</span>
                  <span className="skill-badge">OpenAI API</span>
                  <span className="skill-badge">Anthropic API</span>
                  <span className="skill-badge">Groq API</span>
                  <span className="skill-badge">Gemini API</span>
                  <span className="skill-badge">JavaScript</span>
                  <span className="skill-badge">CSS3</span>
                  <span className="skill-badge">HTML5</span>
                </div>
              </Card.Body>
            </Card>

            {/* Contact & Links */}
            <Card className="profile-card mb-5">
              <Card.Body className="p-5">
                <h4 className="section-title">Connect With Me</h4>
                <p className="mb-4">
                  I'm always interested in discussing AI, technology, and innovative projects. 
                  Feel free to reach out if you'd like to collaborate or just chat about AI!
                </p>
                
                <div className="d-flex flex-wrap gap-3">
                  <Button 
                    variant="outline-success" 
                    href="https://github.com/pparupudi/my_test_LLMplayground" 
                    target="_blank"
                    className="d-flex align-items-center"
                  >
                    <i className="fab fa-github me-2"></i>
                    GitHub
                  </Button>
                  <Button 
                    variant="outline-success" 
                    href="https://www.linkedin.com/in/prasanthi-p-9a0b38105/" 
                    target="_blank"
                    className="d-flex align-items-center"
                  >
                    <i className="fab fa-linkedin me-2"></i>
                    LinkedIn
                  </Button>
                  <Button 
                    variant="outline-success" 
                    href="https://www.prasanthidesign.art/" 
                    target="_blank"
                    className="d-flex align-items-center"
                  >
                    <i className="fas fa-palette me-2"></i>
                    Portfolio
                  </Button>
                </div>
              </Card.Body>
            </Card>


          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AboutMe;