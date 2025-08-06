import React from 'react';
import '../styles/Header.css';

interface HeaderProps {
  onMenuToggle?: () => void;
  sidebarOpen?: boolean;
  isHomePage?: boolean;
  onLogin?: () => void;
  onSignUp?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuToggle, isHomePage, onLogin, onSignUp }) => {
  return (
    <header className={`header ${isHomePage ? 'header-home' : ''}`}>
      <div className="header-left">
        {!isHomePage && (
          <button 
            className="btn btn-ghost btn-icon menu-toggle"
            onClick={onMenuToggle}
            aria-label="Toggle sidebar"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="6" x2="21" y2="6"/>
              <line x1="3" y1="12" x2="21" y2="12"/>
              <line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          </button>
        )}
        
        <div className="logo">
          <div className="logo-icon">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <circle cx="16" cy="16" r="14" fill="url(#gradient1)"/>
              <path d="M12 10v12l8-6z" fill="white"/>
              <defs>
                <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#6366f1"/>
                  <stop offset="100%" stopColor="#8b5cf6"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
          <span className="logo-text">Beatzy</span>
        </div>
      </div>

      {!isHomePage && (
        <div className="header-center">
          <div className="search-container">
            <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.35-4.35"/>
            </svg>
            <input 
              type="text" 
              placeholder="Search beats..." 
              className="search-input"
            />
          </div>
        </div>
      )}

      {isHomePage && (
        <div className="header-center">
          <nav className="nav-links">
            <a href="#features" className="nav-link">Features</a>
            <a href="#pricing" className="nav-link">Pricing</a>
            <a href="#demo" className="nav-link">Demo</a>
            <a href="#about" className="nav-link">About</a>
          </nav>
        </div>
      )}

      <div className="header-right">
        {isHomePage ? (
          <div className="auth-buttons">
            <button className="btn btn-ghost" onClick={onLogin}>Log In</button>
            <button className="btn btn-primary" onClick={onSignUp}>Sign Up</button>
          </div>
        ) : (
          <>
            <button className="btn btn-ghost btn-icon notification-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
              </svg>
              <span className="notification-badge">3</span>
            </button>

            <div className="user-profile">
              <img 
                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=40&h=40&fit=crop&crop=face" 
                alt="User Profile" 
                className="user-avatar"
              />
              <div className="user-info">
                <span className="user-name">Alex Producer</span>
                <span className="user-status">Pro Member</span>
              </div>
              <svg className="dropdown-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="6,9 12,15 18,9"/>
              </svg>
            </div>
          </>
        )}
      </div>

      {/* Audio visualizer in header - only show in app */}
      {!isHomePage && (
        <div className="header-visualizer">
          {[...Array(40)].map((_, i) => (
            <div 
              key={i} 
              className="visualizer-bar"
              style={{
                animationDelay: `${i * 0.1}s`,
                height: `${Math.random() * 30 + 5}px`
              }}
            />
          ))}
        </div>
      )}
    </header>
  );
};

export default Header;