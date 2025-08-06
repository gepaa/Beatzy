import React from 'react';
import '../styles/CreateBeatModal.css';

interface CreateBeatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onChooseAI: () => void;
  onChooseManual: () => void;
}

const CreateBeatModal: React.FC<CreateBeatModalProps> = ({
  isOpen,
  onClose,
  onChooseAI,
  onChooseManual
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">How would you like to create your beat?</h2>
          <button className="modal-close" onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div className="creation-options">
          <div className="creation-option ai-option" onClick={onChooseAI}>
            <div className="option-icon">
              <div className="ai-badge">AI</div>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                <path d="M2 17l10 5 10-5"/>
                <path d="M2 12l10 5 10-5"/>
              </svg>
            </div>
            
            <div className="option-content">
              <h3 className="option-title">Create with AI</h3>
              <p className="option-description">
                Let AI help you create amazing beats. Choose from multiple AI-powered options.
              </p>
              
              <div className="option-features">
                <div className="feature-item">
                  <span className="feature-icon">🎤</span>
                  <span>Hum a melody</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">📁</span>
                  <span>Upload inspiration</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">✨</span>
                  <span>Generate from scratch</span>
                </div>
              </div>
            </div>
            
            <div className="option-arrow">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9,18 15,12 9,6"/>
              </svg>
            </div>
          </div>

          <div className="creation-option manual-option" onClick={onChooseManual}>
            <div className="option-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                <line x1="8" y1="21" x2="16" y2="21"/>
                <line x1="12" y1="17" x2="12" y2="21"/>
              </svg>
            </div>
            
            <div className="option-content">
              <h3 className="option-title">Create Manually</h3>
              <p className="option-description">
                Build your beat from scratch with our professional tools and samples.
              </p>
              
              <div className="option-features">
                <div className="feature-item">
                  <span className="feature-icon">🥁</span>
                  <span>Drum sequencer</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">🎹</span>
                  <span>Piano roll</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">🎵</span>
                  <span>Sample library</span>
                </div>
              </div>
            </div>
            
            <div className="option-arrow">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9,18 15,12 9,6"/>
              </svg>
            </div>
          </div>
        </div>
        
        <div className="modal-footer">
          <p className="footer-note">
            You can always switch between AI and manual creation during the process
          </p>
        </div>
      </div>
    </div>
  );
};

export default CreateBeatModal;