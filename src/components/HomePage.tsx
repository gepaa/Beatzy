import React, { useState } from 'react';
import '../styles/HomePage.css';

interface HomePageProps {
  onGetStarted: () => void;
}

const HomePage: React.FC<HomePageProps> = ({ onGetStarted }) => {
  const [activeTab, setActiveTab] = useState<'hum' | 'upload' | 'generate'>('hum');
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              Create Beats with 
              <span className="gradient-text"> AI Power</span>
            </h1>
            <p className="hero-subtitle">
              Transform your musical ideas into professional beats using cutting-edge AI. 
              Hum a melody, upload inspiration, or let AI create something entirely new.
            </p>
            <div className="hero-actions">
              <button className="btn btn-primary btn-large" onClick={onGetStarted}>
                Start Creating Free
              </button>
              <button className="btn btn-ghost btn-large">
                Watch Demo
              </button>
            </div>
            <p className="hero-note">
              ✨ No credit card required • Create 3 beats free
            </p>
          </div>
          
          <div className="hero-visual">
            <div className="ai-interface">
              <div className="interface-header">
                <div className="interface-dots">
                  <div className="dot dot-red"></div>
                  <div className="dot dot-yellow"></div>
                  <div className="dot dot-green"></div>
                </div>
                <span className="interface-title">AI Beat Studio</span>
              </div>
              <div className="interface-content">
                <div className="visual-area">
                  {activeTab === 'hum' && (
                    <div className="hum-visual">
                      <div className="microphone-icon">
                        🎤
                      </div>
                      <div className="sound-waves">
                        {[...Array(15)].map((_, i) => (
                          <div 
                            key={i} 
                            className="sound-wave"
                            style={{
                              animationDelay: `${i * 0.1}s`,
                              height: `${Math.random() * 30 + 10}px`
                            }}
                          />
                        ))}
                      </div>
                      <p className="visual-text">Hum your melody...</p>
                    </div>
                  )}
                  
                  {activeTab === 'upload' && (
                    <div className="upload-visual">
                      <div className="upload-animation">
                        <div className="upload-arrow">↑</div>
                        <div className="upload-file">🎵</div>
                      </div>
                      <div className="upload-progress">
                        <div className="progress-bar"></div>
                      </div>
                      <p className="visual-text">Upload your audio file...</p>
                    </div>
                  )}
                  
                  {activeTab === 'generate' && (
                    <div className="generate-visual">
                      <div className="ai-brain">
                        <div className="brain-core">🧠</div>
                        <div className="neural-connections">
                          {[...Array(8)].map((_, i) => (
                            <div key={i} className={`connection connection-${i}`}></div>
                          ))}
                        </div>
                      </div>
                      <p className="visual-text">AI is creating magic...</p>
                    </div>
                  )}
                </div>
                
                <div className="ai-controls">
                  <div 
                    className={`control-item ${activeTab === 'hum' ? 'active' : ''}`}
                    onClick={() => setActiveTab('hum')}
                  >
                    <span className="control-icon">🎤</span>
                    <span>Hum to Beat</span>
                  </div>
                  <div 
                    className={`control-item ${activeTab === 'upload' ? 'active' : ''}`}
                    onClick={() => setActiveTab('upload')}
                  >
                    <span className="control-icon">📁</span>
                    <span>Upload Melody</span>
                  </div>
                  <div 
                    className={`control-item ${activeTab === 'generate' ? 'active' : ''}`}
                    onClick={() => setActiveTab('generate')}
                  >
                    <span className="control-icon">✨</span>
                    <span>AI Generate</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features-section">
        <div className="container">
          <h2 className="section-title">Why Beatzy?</h2>
          <div className="features-carousel">
            <div className="carousel-track">
              {/* First set of cards */}
              <div className="feature-card">
                <div className="feature-icon">🎵</div>
                <h3 className="feature-title">Hum to Beat</h3>
                <p className="feature-description">
                  Simply hum or sing your melody and let our AI transform it into a professional beat
                </p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">🎧</div>
                <h3 className="feature-title">Upload & Transform</h3>
                <p className="feature-description">
                  Upload any melody or reference track and get AI-generated beats in seconds
                </p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">🎯</div>
                <h3 className="feature-title">Style Inspiration</h3>
                <p className="feature-description">
                  Use any song as inspiration to create similar but unique beats in any genre
                </p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">⚡</div>
                <h3 className="feature-title">Lightning Fast</h3>
                <p className="feature-description">
                  Generate professional-quality beats in under 30 seconds with AI precision
                </p>
              </div>
              {/* Duplicate set for infinite scroll effect */}
              <div className="feature-card">
                <div className="feature-icon">🎵</div>
                <h3 className="feature-title">Hum to Beat</h3>
                <p className="feature-description">
                  Simply hum or sing your melody and let our AI transform it into a professional beat
                </p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">🎧</div>
                <h3 className="feature-title">Upload & Transform</h3>
                <p className="feature-description">
                  Upload any melody or reference track and get AI-generated beats in seconds
                </p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">🎯</div>
                <h3 className="feature-title">Style Inspiration</h3>
                <p className="feature-description">
                  Use any song as inspiration to create similar but unique beats in any genre
                </p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">⚡</div>
                <h3 className="feature-title">Lightning Fast</h3>
                <p className="feature-description">
                  Generate professional-quality beats in under 30 seconds with AI precision
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="pricing-section">
        <div className="container">
          <h2 className="section-title">Choose Your Plan</h2>
          <div className="pricing-grid">
            <div className="pricing-card">
              <div className="plan-header">
                <h3 className="plan-name">Free</h3>
                <div className="plan-price">
                  <span className="price">$0</span>
                  <span className="period">/month</span>
                </div>
              </div>
              <ul className="plan-features">
                <li>3 AI beats per month</li>
                <li>Basic export quality</li>
                <li>Standard genres</li>
                <li>Community support</li>
              </ul>
              <button className="btn btn-outline">Get Started</button>
            </div>

            <div className="pricing-card popular">
              <div className="popular-badge">Most Popular</div>
              <div className="plan-header">
                <h3 className="plan-name">Pro</h3>
                <div className="plan-price">
                  <span className="price">$19</span>
                  <span className="period">/month</span>
                </div>
              </div>
              <ul className="plan-features">
                <li>Unlimited AI beats</li>
                <li>High-quality exports</li>
                <li>All genres & styles</li>
                <li>Advanced customization</li>
                <li>Priority support</li>
              </ul>
              <button className="btn btn-primary" onClick={onGetStarted}>Start Pro Trial</button>
            </div>

            <div className="pricing-card">
              <div className="plan-header">
                <h3 className="plan-name">Studio</h3>
                <div className="plan-price">
                  <span className="price">$49</span>
                  <span className="period">/month</span>
                </div>
              </div>
              <ul className="plan-features">
                <li>Everything in Pro</li>
                <li>Commercial licensing</li>
                <li>Collaboration tools</li>
                <li>API access</li>
                <li>Custom AI training</li>
              </ul>
              <button className="btn btn-outline">Contact Sales</button>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section id="demo" className="demo-section">
        <div className="container">
          <h2 className="section-title">See Beatzy in Action</h2>
          <div className="demo-video">
            <div className="video-placeholder">
              <div className="play-button">
                <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="5,3 19,12 5,21 5,3" fill="currentColor"/>
                </svg>
              </div>
            </div>
            <p className="demo-description">Watch how you can create professional beats in seconds with our AI</p>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="about-section">
        <div className="container">
          <div className="about-content">
            <h2 className="section-title">Built by Producers, for Producers</h2>
            <p className="about-text">
              Beatzy was created by a team of music producers and AI engineers who understand the creative process. 
              We've spent years perfecting our AI to understand musical patterns, rhythm, and what makes a beat truly great.
            </p>
            <div className="stats-row">
              <div className="stat">
                <span className="stat-number">50K+</span>
                <span className="stat-label">Beats Created</span>
              </div>
              <div className="stat">
                <span className="stat-number">10K+</span>
                <span className="stat-label">Active Producers</span>
              </div>
              <div className="stat">
                <span className="stat-number">99%</span>
                <span className="stat-label">Satisfaction Rate</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2 className="cta-title">Ready to Create Your First AI Beat?</h2>
            <p className="cta-subtitle">
              Join thousands of producers already using Beatzy to create amazing music
            </p>
            <button className="btn btn-primary btn-large" onClick={onGetStarted}>
              Start Creating Now
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <div className="footer-logo">
                <div className="logo-icon">
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                    <circle cx="16" cy="16" r="14" fill="url(#footerGradient)"/>
                    <path d="M12 10v12l8-6z" fill="white"/>
                    <defs>
                      <linearGradient id="footerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#6366f1"/>
                        <stop offset="100%" stopColor="#8b5cf6"/>
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
                <span className="footer-logo-text">Beatzy</span>
              </div>
              <p className="footer-description">
                Create professional beats with AI in seconds. Join thousands of producers already using Beatzy.
              </p>
            </div>
            
            <div className="footer-links">
              <div className="footer-column">
                <h4 className="footer-title">Product</h4>
                <ul className="footer-list">
                  <li><a href="#features" className="footer-link">Features</a></li>
                  <li><a href="#pricing" className="footer-link">Pricing</a></li>
                  <li><a href="#demo" className="footer-link">Demo</a></li>
                  <li><a href="#api" className="footer-link">API</a></li>
                </ul>
              </div>
              
              <div className="footer-column">
                <h4 className="footer-title">Company</h4>
                <ul className="footer-list">
                  <li><a href="#about" className="footer-link">About</a></li>
                  <li><a href="#careers" className="footer-link">Careers</a></li>
                  <li><a href="#press" className="footer-link">Press</a></li>
                  <li><a href="#contact" className="footer-link">Contact</a></li>
                </ul>
              </div>
              
              <div className="footer-column">
                <h4 className="footer-title">Resources</h4>
                <ul className="footer-list">
                  <li><a href="#blog" className="footer-link">Blog</a></li>
                  <li><a href="#help" className="footer-link">Help Center</a></li>
                  <li><a href="#community" className="footer-link">Community</a></li>
                  <li><a href="#tutorials" className="footer-link">Tutorials</a></li>
                </ul>
              </div>
              
              <div className="footer-column">
                <h4 className="footer-title">Legal</h4>
                <ul className="footer-list">
                  <li><a href="#privacy" className="footer-link">Privacy</a></li>
                  <li><a href="#terms" className="footer-link">Terms</a></li>
                  <li><a href="#cookies" className="footer-link">Cookies</a></li>
                  <li><a href="#licenses" className="footer-link">Licenses</a></li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="footer-bottom">
            <p className="footer-copyright">
              © 2024 Beatzy. All rights reserved.
            </p>
            <div className="footer-social">
              <a href="#twitter" className="social-link">🐦</a>
              <a href="#instagram" className="social-link">📸</a>
              <a href="#youtube" className="social-link">🎥</a>
              <a href="#discord" className="social-link">💬</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Background Effects */}
      <div className="home-bg-effects">
        <div className="floating-note note-1">♪</div>
        <div className="floating-note note-2">♫</div>
        <div className="floating-note note-3">♪</div>
        <div className="floating-note note-4">♫</div>
      </div>
    </div>
  );
};

export default HomePage;