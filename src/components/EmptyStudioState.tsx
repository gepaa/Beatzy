import React from 'react';
import '../styles/EmptyStudioState.css';

interface EmptyStudioStateProps {
  onCreateBeat: () => void;
}

const EmptyStudioState: React.FC<EmptyStudioStateProps> = ({ onCreateBeat }) => {
  return (
    <div className="empty-studio-state">
      <div className="empty-state-content">
        {/* Animated Music Note Icon */}
        <div className="music-note-container">
          <div className="music-note-icon">
            <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18V5l12-2v13"/>
              <circle cx="6" cy="18" r="3"/>
              <circle cx="18" cy="16" r="3"/>
            </svg>
          </div>
          <div className="music-waves">
            <div className="wave wave-1"></div>
            <div className="wave wave-2"></div>
            <div className="wave wave-3"></div>
          </div>
        </div>

        {/* Main Content */}
        <div className="empty-state-text">
          <h1 className="empty-state-title">Ready to Create Magic?</h1>
          <p className="empty-state-description">
            Start your musical journey and bring your beats to life with our AI-powered studio
          </p>
        </div>

        {/* Create Button */}
        <button className="empty-state-btn" onClick={onCreateBeat}>
          <div className="btn-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <polygon points="10,8 16,12 10,16 10,8"/>
            </svg>
          </div>
          <span>Create New Beat</span>
          <div className="btn-glow"></div>
        </button>

        {/* Help Text */}
        <div className="help-text">
          <div className="help-icon">✨</div>
          <p>Choose between AI-generated beats or manual creation</p>
        </div>
      </div>

      {/* Background Effects */}
      <div className="empty-state-bg">
        <div className="bg-orb bg-orb-1"></div>
        <div className="bg-orb bg-orb-2"></div>
        <div className="bg-orb bg-orb-3"></div>
      </div>
    </div>
  );
};

export default EmptyStudioState;