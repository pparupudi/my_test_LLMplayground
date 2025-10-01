import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';

const AboutMe = () => {
  return (
    <div className="about-page" style={{ minHeight: '100vh', backgroundColor: '#ffffff' }}>
      {/* Custom Styles */}
      <style>{`
        .about-page {
          --primary-green: #166534;
          --light-green: #22c55e;
          --hover-green: #15803d;
        }
        
        .about-card {
          border: none;
          border-radius: 16px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          transition: all 0.3s ease;
        }
        
        .about-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
        }
        
        .profile-section {
          background: linear-gradient(135deg, var(--primary-green) 0%, var(--light-green) 100%);
          color: white;
          border-radius: 16px;
          padding: 2rem;
          margin-bottom: 2rem;
        }
        
        .skill-tag {
          background-color: #f3f4f6;
          color: #374151;
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-size: 0.875rem;
          margin: 0.25rem;
          display: inline-block;
        }
        
        .portfolio-btn {
          background: linear-gradient(135deg, var(--primary-green) 0%, var(--light-green) 100%);
          border: none;
          border-radius: 25px;
          padding: 12px 30px;
          font-weight: 600;
          transition: all 0.3s ease;
          text-decoration: none;
          color: white;
        }
        
        .portfolio-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 15px rgba(34, 197, 94, 0.3);
          color: white;
        }
        
        .back-btn {
          background-color: #6b7280;
          border: none;
          border-radius: 20px;
          padding: 8px 20px;
          color: white;
          font-size: 0.875rem;
          transition: all 0.3s ease;
        }
        
        .back-btn:hover {
          background-color: #4b5563;
          transform: translateY(-1px);
        }
      `}</style>

      {/* Navigation Header */}
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
                <div style={{ fontSize: '12px', color: '#6b7280' }}>About the Creator</div>
              </div>
            </div>
          </Col>
          <Col xs={12} md={6} className="d-flex justify-content-md-end justify-content-center">
            <Link to="/" style={{ textDecoration: 'none' }}>
              <Button className="back-btn">
                ← Back to Playground
              </Button>
            </Link>
          </Col>
        </Row>
      </Container>

      {/* Main Content */}
      <Container className="py-4">
        <Row className="justify-content-center">
          <Col lg={8} xl={7}>
            {/* Profile Section */}
            <div className="profile-section text-center">
              <div className="mb-4">
                <div style={{ 
                  width: '120px', 
                  height: '120px', 
                  borderRadius: '50%', 
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto',
                  fontSize: '48px',
                  fontWeight: 'bold'
                }}>
                  P
                </div>
              </div>
              <h1 className="mb-3" style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>
                Prasanthi
              </h1>
              <p className="lead mb-4" style={{ fontSize: '1.25rem', opacity: '0.9' }}>
                Web & Multimedia Design Student | UX/UI Designer
              </p>
              <p style={{ fontSize: '1.1rem', opacity: '0.8', lineHeight: '1.6' }}>
                Living in SF Bay Area with 4+ years of experience in creating engaging user experiences
              </p>
            </div>

            {/* About Content */}
            <Card className="about-card mb-4">
              <Card.Body className="p-4">
                <h3 className="mb-4" style={{ color: '#111827', fontWeight: 'bold' }}>
                  About Me
                </h3>
                <p style={{ fontSize: '1.1rem', lineHeight: '1.7', color: '#374151', marginBottom: '1.5rem' }}>
                  Hey there! I'm Prasanthi, a web and multimedia design student living in SF Bay. I bring over 4 years of experience in UX/UI design to the table. My journey in UX/UI has been driven by a deep understanding of user needs and behaviors.
                </p>
                <p style={{ fontSize: '1.1rem', lineHeight: '1.7', color: '#374151', marginBottom: '1.5rem' }}>
                  In addition to UX/UI design, I specialize in Instructional design, creating engaging and effective learning experiences. I bring a unique combination of creativity, technical skills, and exceptional customer service to every project.
                </p>
                <p style={{ fontSize: '1.1rem', lineHeight: '1.7', color: '#374151', marginBottom: '1.5rem' }}>
                  My aptitude for solving problems coupled with relentless perseverance enabled me to navigate challenges and deliver high-quality results on time.
                </p>
                <p style={{ fontSize: '1.1rem', lineHeight: '1.7', color: '#374151' }}>
                  When I'm not immersed in Figma, you can find me experimenting in the kitchen, cooking up delicious dishes.
                </p>
              </Card.Body>
            </Card>

            {/* Skills Section */}
            <Card className="about-card mb-4">
              <Card.Body className="p-4">
                <h3 className="mb-4" style={{ color: '#111827', fontWeight: 'bold' }}>
                  Skills & Expertise
                </h3>
                <div className="mb-3">
                  <span className="skill-tag">UX/UI Design</span>
                  <span className="skill-tag">Instructional Design</span>
                  <span className="skill-tag">Web Design</span>
                  <span className="skill-tag">Multimedia Design</span>
                  <span className="skill-tag">Figma</span>
                  <span className="skill-tag">User Research</span>
                  <span className="skill-tag">Problem Solving</span>
                  <span className="skill-tag">Customer Service</span>
                </div>
              </Card.Body>
            </Card>

            {/* Portfolio Link */}
            <Card className="about-card">
              <Card.Body className="p-4 text-center">
                <h3 className="mb-3" style={{ color: '#111827', fontWeight: 'bold' }}>
                  View My Work
                </h3>
                <p className="mb-4" style={{ color: '#6b7280', fontSize: '1.1rem' }}>
                  Explore my design portfolio and see my latest projects
                </p>
                <a 
                  href="https://www.prasanthidesign.art/about" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="portfolio-btn"
                  style={{ textDecoration: 'none' }}
                >
                  Visit My Portfolio →
                </a>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AboutMe;