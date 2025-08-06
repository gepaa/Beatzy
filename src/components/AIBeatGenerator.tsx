import React, { useState } from 'react';
import '../styles/AIBeatGenerator.css';

interface AIBeatGeneratorProps {
  onBack: () => void;
  onGenerate: (options: any) => void;
}

type AIGenerationMode = 'hum' | 'upload' | 'inspiration' | 'scratch';

const AIBeatGenerator: React.FC<AIBeatGeneratorProps> = ({ onBack, onGenerate }) => {
  const [selectedMode, setSelectedMode] = useState<AIGenerationMode | null>(null);
  const [customPrompt, setCustomPrompt] = useState('');
  const [showPromptModal, setShowPromptModal] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState('');

  const generationModes = [
    {
      id: 'hum' as AIGenerationMode,
      title: 'Hum a Melody',
      description: 'Record yourself humming and let AI turn it into a beat',
      icon: '🎤',
      color: '--primary'
    },
    {
      id: 'upload' as AIGenerationMode,
      title: 'Upload Melody',
      description: 'Upload an audio file and transform it into a beat',
      icon: '📁',
      color: '--accent'
    },
    {
      id: 'inspiration' as AIGenerationMode,
      title: 'Use Inspiration',
      description: 'Upload a reference track for AI to create something similar',
      icon: '✨',
      color: '--accent-orange'
    },
    {
      id: 'scratch' as AIGenerationMode,
      title: 'Generate from Scratch',
      description: 'Let AI create a completely new beat based on your preferences',
      icon: '🎵',
      color: '--secondary'
    }
  ];

  const genres = [
    'Hip Hop', 'Trap', 'Drill', 'Reggaeton', 'Afrobeat', 'R&B', 
    'Pop', 'Rock', 'Electronic', 'Jazz', 'Blues', 'Country'
  ];

  const handleModeSelect = (mode: AIGenerationMode) => {
    setSelectedMode(mode);
    if (mode === 'scratch') {
      setShowPromptModal(true);
    }
  };

  const handleGenerate = () => {
    const options = {
      mode: selectedMode,
      genre: selectedGenre,
      customPrompt: customPrompt.trim()
    };
    onGenerate(options);
  };

  const renderModeContent = () => {
    switch (selectedMode) {
      case 'hum':
        return (
          <div className="mode-content">
            <div className="recording-interface">
              <div className="record-button">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <circle cx="12" cy="12" r="3" fill="currentColor"/>
                </svg>
              </div>
              <p className="record-instruction">
                Click the record button and start humming your melody
              </p>
              <div className="audio-wave">
                {[...Array(20)].map((_, i) => (
                  <div key={i} className="wave-bar" style={{ animationDelay: `${i * 0.1}s` }} />
                ))}
              </div>
            </div>
          </div>
        );

      case 'upload':
        return (
          <div className="mode-content">
            <div className="upload-zone">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7,10 12,15 17,10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              <p className="upload-text">
                <strong>Click to upload</strong> or drag and drop your audio file
              </p>
              <p className="upload-formats">MP3, WAV, AIFF up to 50MB</p>
            </div>
          </div>
        );

      case 'inspiration':
        return (
          <div className="mode-content">
            <div className="upload-zone">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 11H5a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h4l5 4V7l-5 4z"/>
                <path d="M22 9l-6 6"/>
                <path d="M16 9l6 6"/>
              </svg>
              <p className="upload-text">
                <strong>Upload inspiration track</strong> for AI to analyze
              </p>
              <p className="upload-formats">Any audio format • AI will create something similar but unique</p>
            </div>
            <div className="inspiration-note">
              <p>💡 The AI will analyze the style, rhythm, and mood to create an original beat inspired by your reference</p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="ai-beat-generator">
      <div className="generator-header">
        <button className="back-button" onClick={onBack}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15,18 9,12 15,6"/>
          </svg>
          Back
        </button>
        <h2 className="generator-title">AI Beat Generator</h2>
      </div>

      {!selectedMode ? (
        <div className="generation-modes">
          <p className="modes-description">Choose how you'd like AI to create your beat:</p>
          <div className="modes-grid">
            {generationModes.map((mode) => (
              <div
                key={mode.id}
                className="mode-card"
                onClick={() => handleModeSelect(mode.id)}
                style={{ '--accent-color': `var(${mode.color})` } as any}
              >
                <div className="mode-icon">{mode.icon}</div>
                <h3 className="mode-title">{mode.title}</h3>
                <p className="mode-description">{mode.description}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="selected-mode">
          <div className="mode-header">
            <button className="change-mode" onClick={() => setSelectedMode(null)}>
              Change Mode
            </button>
            <h3 className="current-mode">
              {generationModes.find(m => m.id === selectedMode)?.title}
            </h3>
          </div>

          {renderModeContent()}

          <div className="generation-settings">
            <div className="setting-group">
              <label className="setting-label">Genre (Optional)</label>
              <select 
                className="genre-select"
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
              >
                <option value="">Auto-detect</option>
                {genres.map(genre => (
                  <option key={genre} value={genre}>{genre}</option>
                ))}
              </select>
            </div>

            <button 
              className="customize-button"
              onClick={() => setShowPromptModal(true)}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
              Add Custom Instructions
            </button>

            <button className="generate-button" onClick={handleGenerate}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                <path d="M2 17l10 5 10-5"/>
                <path d="M2 12l10 5 10-5"/>
              </svg>
              Generate Beat
            </button>
          </div>
        </div>
      )}

      {/* Custom Prompt Modal */}
      {showPromptModal && (
        <div className="modal-overlay" onClick={() => setShowPromptModal(false)}>
          <div className="prompt-modal" onClick={(e) => e.stopPropagation()}>
            <div className="prompt-header">
              <h3>Customize Your Beat</h3>
              <button onClick={() => setShowPromptModal(false)}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            <div className="prompt-content">
              <label className="prompt-label">
                Describe how you want your beat to sound:
              </label>
              <textarea
                className="prompt-textarea"
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder="Example: Create a chill trap beat with a dark vibe, add a beat switch halfway through, make it similar to Travis Scott style but with more 808s..."
                rows={6}
              />
              
              <div className="prompt-examples">
                <p className="examples-title">Example prompts:</p>
                <div className="example-tags">
                  <span className="example-tag" onClick={() => setCustomPrompt("Create a dark drill beat with heavy 808s and a menacing melody")}>
                    Dark drill with heavy 808s
                  </span>
                  <span className="example-tag" onClick={() => setCustomPrompt("Make a reggaeton beat with a tropical vibe and catchy percussion")}>
                    Tropical reggaeton
                  </span>
                  <span className="example-tag" onClick={() => setCustomPrompt("Create an Afrobeat with traditional drums and modern trap elements")}>
                    Afrobeat + trap fusion
                  </span>
                </div>
              </div>
            </div>

            <div className="prompt-footer">
              <button className="btn btn-ghost" onClick={() => setShowPromptModal(false)}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={() => setShowPromptModal(false)}>
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIBeatGenerator;