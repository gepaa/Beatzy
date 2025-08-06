import React from 'react';
import '../styles/BeatControls.css';

interface BeatControlsProps {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  tempo: number;
  onPlay: () => void;
  onTimeChange: (time: number) => void;
  onVolumeChange: (volume: number) => void;
  onTempoChange: (tempo: number) => void;
}

const BeatControls: React.FC<BeatControlsProps> = ({
  isPlaying,
  currentTime,
  duration,
  volume,
  tempo,
  onPlay,
  onTimeChange,
  onVolumeChange,
  onTempoChange
}) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const newTime = percent * duration;
    onTimeChange(newTime);
  };

  return (
    <div className="beat-controls">
      {/* Main Transport Controls */}
      <div className="transport-section">
        <div className="transport-controls">
          <button className="control-btn secondary" title="Previous">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="19,20 9,12 19,4"/>
              <line x1="5" y1="19" x2="5" y2="5"/>
            </svg>
          </button>

          <button 
            className={`control-btn primary play-btn ${isPlaying ? 'playing' : ''}`} 
            onClick={onPlay}
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="6" y="4" width="4" height="16"/>
                <rect x="14" y="4" width="4" height="16"/>
              </svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="5,3 19,12 5,21"/>
              </svg>
            )}
          </button>

          <button className="control-btn secondary" title="Next">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="5,4 15,12 5,20"/>
              <line x1="19" y1="5" x2="19" y2="19"/>
            </svg>
          </button>

          <button className="control-btn secondary" title="Stop">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="6" y="6" width="12" height="12"/>
            </svg>
          </button>

          <button className="control-btn secondary" title="Record">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <circle cx="12" cy="12" r="3" fill="currentColor"/>
            </svg>
          </button>
        </div>

        {/* Time Display */}
        <div className="time-display">
          <span className="current-time">{formatTime(currentTime)}</span>
          <span className="time-separator">/</span>
          <span className="total-time">{formatTime(duration)}</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="progress-section">
        <div className="progress-container" onClick={handleProgressClick}>
          <div className="progress-track">
            <div 
              className="progress-fill"
              style={{ width: duration > 0 ? `${(currentTime / duration) * 100}%` : '0%' }}
            />
            <div 
              className="progress-thumb"
              style={{ left: duration > 0 ? `${(currentTime / duration) * 100}%` : '0%' }}
            />
          </div>
        </div>
      </div>

      {/* Secondary Controls */}
      <div className="secondary-controls">
        {/* Volume Control */}
        <div className="control-group">
          <div className="control-label">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="11,5 6,9 2,9 2,15 6,15 11,19"/>
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
            </svg>
          </div>
          <div className="slider-container">
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
              className="volume-slider"
            />
          </div>
          <span className="control-value">{Math.round(volume * 100)}%</span>
        </div>

        {/* Tempo Control */}
        <div className="control-group">
          <div className="control-label">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12,6 12,12 16,14"/>
            </svg>
          </div>
          <div className="slider-container">
            <input
              type="range"
              min="60"
              max="200"
              step="1"
              value={tempo}
              onChange={(e) => onTempoChange(parseInt(e.target.value))}
              className="tempo-slider"
            />
          </div>
          <span className="control-value">{tempo} BPM</span>
        </div>

        {/* Loop Toggle */}
        <button className="control-btn toggle" title="Loop">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M17 2l4 4-4 4"/>
            <path d="M3 11v-1a4 4 0 0 1 4-4h14"/>
            <path d="M7 22l-4-4 4-4"/>
            <path d="M21 13v1a4 4 0 0 1-4 4H3"/>
          </svg>
        </button>

        {/* Shuffle Toggle */}
        <button className="control-btn toggle" title="Shuffle">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="16,3 21,3 21,8"/>
            <line x1="4" y1="20" x2="21" y2="3"/>
            <polyline points="21,16 21,21 16,21"/>
            <line x1="15" y1="15" x2="21" y2="21"/>
            <line x1="4" y1="4" x2="9" y2="9"/>
          </svg>
        </button>

        {/* Metronome Toggle */}
        <button className="control-btn toggle" title="Metronome">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 3v18"/>
            <path d="M8 21h8"/>
            <path d="M10 3h4"/>
            <circle cx="12" cy="9" r="2"/>
          </svg>
        </button>
      </div>

      {/* Beat Grid Indicator */}
      <div className="beat-grid">
        <div className="grid-label">Beat Grid</div>
        <div className="grid-indicators">
          {[...Array(16)].map((_, i) => (
            <div 
              key={i}
              className={`grid-dot ${i % 4 === 0 ? 'accent' : ''} ${
                isPlaying && Math.floor((currentTime * 2) % 16) === i ? 'active' : ''
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default BeatControls;