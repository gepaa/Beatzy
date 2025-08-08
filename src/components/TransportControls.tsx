import React, { useState } from 'react';
import '../styles/TransportControls.css';

interface TransportControlsProps {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isLooping: boolean;
  onPlay: () => void;
  onStop: () => void;
  onRecord: () => void;
  onLoop: () => void;
  onVolumeChange: (volume: number) => void;
  onTimeChange: (time: number) => void;
}

const TransportControls: React.FC<TransportControlsProps> = ({
  isPlaying,
  currentTime,
  duration,
  volume,
  isLooping,
  onPlay,
  onStop,
  onRecord,
  onLoop,
  onVolumeChange,
  onTimeChange
}) => {
  const [isRecording] = useState(false);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 10);
    return `${mins}:${secs.toString().padStart(2, '0')}.${ms}`;
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const newTime = percent * duration;
    onTimeChange(newTime);
  };

  return (
    <div className="transport-controls">
      <div className="transport-main">
        {/* Left Section - Tempo Tap (optional) */}
        <div className="transport-left">
          <button className="tempo-tap-btn" title="Tap Tempo">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
          </button>
        </div>

        {/* Center Section - Main Transport */}
        <div className="transport-center">
          {/* Primary Transport Buttons */}
          <div className="primary-controls">
            {/* Record Button */}
            <button 
              className={`transport-btn record-btn ${isRecording ? 'recording' : ''}`}
              onClick={onRecord}
              title="Record"
              disabled={true} // Disabled for now as requested
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="8" fill={isRecording ? "#ff4444" : "currentColor"} opacity={isRecording ? "1" : "0.5"}/>
              </svg>
            </button>

            {/* Stop Button */}
            <button 
              className="transport-btn stop-btn"
              onClick={onStop}
              title="Stop"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <rect x="6" y="6" width="12" height="12" fill="currentColor"/>
              </svg>
            </button>

            {/* Play/Pause Button - Larger and more prominent */}
            <button 
              className={`transport-btn play-btn ${isPlaying ? 'playing' : ''}`}
              onClick={onPlay}
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                  <rect x="6" y="4" width="4" height="16" fill="currentColor"/>
                  <rect x="14" y="4" width="4" height="16" fill="currentColor"/>
                </svg>
              ) : (
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                  <polygon points="8,5 19,12 8,19" fill="currentColor"/>
                </svg>
              )}
            </button>

            {/* Loop Button */}
            <button 
              className={`transport-btn loop-btn ${isLooping ? 'active' : ''}`}
              onClick={onLoop}
              title="Loop"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 2l4 4-4 4"/>
                <path d="M3 11v-1a4 4 0 0 1 4-4h14"/>
                <path d="M7 22l-4-4 4-4"/>
                <path d="M21 13v1a4 4 0 0 1-4 4H3"/>
              </svg>
            </button>
          </div>

          {/* Time Display */}
          <div className="time-display">
            <span className="time-text">
              {formatTime(currentTime)}
            </span>
          </div>
        </div>

        {/* Right Section - Volume */}
        <div className="transport-right">
          <div className="volume-section">
            <button className="volume-icon" title="Volume">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                {volume === 0 ? (
                  <>
                    <polygon points="11,5 6,9 2,9 2,15 6,15 11,19"/>
                    <line x1="23" y1="9" x2="17" y2="15"/>
                    <line x1="17" y1="9" x2="23" y2="15"/>
                  </>
                ) : volume < 0.5 ? (
                  <>
                    <polygon points="11,5 6,9 2,9 2,15 6,15 11,19"/>
                    <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
                  </>
                ) : (
                  <>
                    <polygon points="11,5 6,9 2,9 2,15 6,15 11,19"/>
                    <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
                    <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
                  </>
                )}
              </svg>
            </button>
            <div className="volume-slider-container">
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
            <span className="volume-value">{Math.round(volume * 100)}</span>
          </div>
        </div>
      </div>

      {/* Progress Bar - Full width below controls */}
      <div className="progress-section">
        <div className="progress-container" onClick={handleProgressClick}>
          <div className="progress-track">
            <div 
              className="progress-fill"
              style={{ width: duration > 0 ? `${(currentTime / duration) * 100}%` : '0%' }}
            />
            <div 
              className="progress-handle"
              style={{ left: duration > 0 ? `${(currentTime / duration) * 100}%` : '0%' }}
            />
          </div>
        </div>
        <div className="time-info">
          <span className="time-current">{formatTime(currentTime)}</span>
          <span className="time-duration">{formatTime(duration)}</span>
        </div>
      </div>
    </div>
  );
};

export default TransportControls;