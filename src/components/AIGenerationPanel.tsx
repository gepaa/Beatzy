import React, { useState } from 'react';
import '../styles/AIGenerationPanel.css';

interface AIGenerationPanelProps {
  currentBeat?: any;
  onGenerate: (params: any) => void;
  onClose: () => void;
}

const AIGenerationPanel: React.FC<AIGenerationPanelProps> = ({
  currentBeat,
  onGenerate,
  onClose
}) => {
  const [generationType, setGenerationType] = useState<'variation' | 'melody' | 'drum' | 'bass'>('variation');
  const [intensity, setIntensity] = useState(0.5);
  const [creativity, setCreativity] = useState(0.7);
  const [genre, setGenre] = useState('hip-hop');
  const [isGenerating, setIsGenerating] = useState(false);

  const genres = [
    { value: 'hip-hop', label: 'Hip Hop', emoji: '🎤' },
    { value: 'trap', label: 'Trap', emoji: '🔥' },
    { value: 'lo-fi', label: 'Lo-Fi', emoji: '🌙' },
    { value: 'electronic', label: 'Electronic', emoji: '⚡' },
    { value: 'r&b', label: 'R&B', emoji: '💫' },
    { value: 'jazz', label: 'Jazz', emoji: '🎷' }
  ];

  const generationTypes = [
    {
      value: 'variation',
      label: 'Beat Variation',
      description: 'Create variations of your current beat',
      icon: '🔄'
    },
    {
      value: 'melody',
      label: 'Melody Generator',
      description: 'Generate melodic elements',
      icon: '🎵'
    },
    {
      value: 'drum',
      label: 'Drum Pattern',
      description: 'Create new drum patterns',
      icon: '🥁'
    },
    {
      value: 'bass',
      label: 'Bass Line',
      description: 'Generate bass lines',
      icon: '🎸'
    }
  ];

  const handleGenerate = async () => {
    setIsGenerating(true);
    
    const params = {
      type: generationType,
      intensity,
      creativity,
      genre,
      baseBeat: currentBeat
    };

    // Simulate AI generation
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    onGenerate(params);
    setIsGenerating(false);
  };

  return (
    <div className="ai-generation-panel">
      <div className="panel-header">
        <div className="panel-title">
          <div className="ai-icon">🤖</div>
          <h3>AI Beat Generator</h3>
        </div>
        <button className="close-btn" onClick={onClose}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>

      <div className="panel-content">
        {/* Generation Type Selection */}
        <div className="section">
          <h4 className="section-title">Generation Type</h4>
          <div className="generation-types">
            {generationTypes.map((type) => (
              <button
                key={type.value}
                className={`generation-type ${generationType === type.value ? 'active' : ''}`}
                onClick={() => setGenerationType(type.value as any)}
              >
                <div className="type-icon">{type.icon}</div>
                <div className="type-info">
                  <div className="type-label">{type.label}</div>
                  <div className="type-description">{type.description}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Genre Selection */}
        <div className="section">
          <h4 className="section-title">Genre Style</h4>
          <div className="genre-grid">
            {genres.map((g) => (
              <button
                key={g.value}
                className={`genre-btn ${genre === g.value ? 'active' : ''}`}
                onClick={() => setGenre(g.value)}
              >
                <span className="genre-emoji">{g.emoji}</span>
                <span className="genre-label">{g.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* AI Parameters */}
        <div className="section">
          <h4 className="section-title">AI Parameters</h4>
          
          <div className="parameter-group">
            <div className="parameter-header">
              <label className="parameter-label">Intensity</label>
              <span className="parameter-value">{Math.round(intensity * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={intensity}
              onChange={(e) => setIntensity(parseFloat(e.target.value))}
              className="parameter-slider intensity"
            />
            <div className="parameter-description">
              How aggressive and energetic the generation should be
            </div>
          </div>

          <div className="parameter-group">
            <div className="parameter-header">
              <label className="parameter-label">Creativity</label>
              <span className="parameter-value">{Math.round(creativity * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={creativity}
              onChange={(e) => setCreativity(parseFloat(e.target.value))}
              className="parameter-slider creativity"
            />
            <div className="parameter-description">
              How experimental and unique the AI should be
            </div>
          </div>
        </div>

        {/* Current Beat Info */}
        {currentBeat && (
          <div className="section">
            <h4 className="section-title">Source Beat</h4>
            <div className="beat-info">
              <div className="beat-details">
                <div className="beat-name">{currentBeat.name}</div>
                <div className="beat-stats">
                  <span className="stat">{currentBeat.tempo} BPM</span>
                  <span className="stat">Key: {currentBeat.key}</span>
                  <span className="stat">{currentBeat.genre}</span>
                </div>
              </div>
              <div className="beat-waveform">
                {[...Array(20)].map((_, i) => (
                  <div 
                    key={i} 
                    className="mini-bar"
                    style={{ height: `${Math.random() * 100}%` }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Generation Options */}
        <div className="section">
          <h4 className="section-title">Options</h4>
          <div className="options-list">
            <label className="option-item">
              <input type="checkbox" defaultChecked />
              <span className="option-label">Keep original tempo</span>
            </label>
            <label className="option-item">
              <input type="checkbox" />
              <span className="option-label">Add swing</span>
            </label>
            <label className="option-item">
              <input type="checkbox" defaultChecked />
              <span className="option-label">Maintain key signature</span>
            </label>
            <label className="option-item">
              <input type="checkbox" />
              <span className="option-label">Generate multiple variations</span>
            </label>
          </div>
        </div>

        {/* Generate Button */}
        <div className="generate-section">
          <button
            className={`generate-btn ${isGenerating ? 'generating' : ''}`}
            onClick={handleGenerate}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <>
                <div className="loading-spinner" />
                <span>Generating...</span>
              </>
            ) : (
              <>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                  <polyline points="3.27,6.96 12,12.01 20.73,6.96"/>
                  <line x1="12" y1="22.08" x2="12" y2="12"/>
                </svg>
                <span>Generate with AI</span>
              </>
            )}
          </button>
          
          <div className="generate-info">
            <div className="info-item">
              <span className="info-icon">⚡</span>
              <span>Powered by Advanced AI</span>
            </div>
            <div className="info-item">
              <span className="info-icon">🎯</span>
              <span>Optimized for {genre}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Background Animation */}
      <div className="ai-background">
        <div className="neural-network">
          {[...Array(8)].map((_, i) => (
            <div 
              key={i}
              className="neural-node"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${i * 0.5}s`
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AIGenerationPanel;