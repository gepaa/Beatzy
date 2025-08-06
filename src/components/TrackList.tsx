import React from 'react';
import '../styles/TrackList.css';

interface Track {
  id: number;
  name: string;
  color: string;
  volume: number;
  muted: boolean;
  solo: boolean;
  pattern: number[];
  samples: string[];
}

interface TrackListProps {
  tracks: Track[];
  selectedTrack: number | null;
  onTrackSelect: (trackId: number | null) => void;
  isPlaying: boolean;
  currentTime: number;
}

const TrackList: React.FC<TrackListProps> = ({
  tracks,
  selectedTrack,
  onTrackSelect,
  isPlaying,
  currentTime
}) => {
  const handleVolumeChange = (trackId: number, volume: number) => {
    console.log(`Track ${trackId} volume: ${volume}`);
  };

  const handleMute = (trackId: number) => {
    console.log(`Toggle mute for track ${trackId}`);
  };

  const handleSolo = (trackId: number) => {
    console.log(`Toggle solo for track ${trackId}`);
  };

  const handlePatternClick = (trackId: number, stepIndex: number) => {
    console.log(`Toggle step ${stepIndex} for track ${trackId}`);
  };

  const currentStep = isPlaying ? Math.floor((currentTime * 2) % 16) : -1;

  return (
    <div className="track-list">
      <div className="track-list-header">
        <h3 className="track-title">Tracks</h3>
        <button className="btn btn-sm btn-primary">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Add Track
        </button>
      </div>

      <div className="tracks-container">
        {tracks.map((track) => (
          <div
            key={track.id}
            className={`track-item ${selectedTrack === track.id ? 'selected' : ''}`}
            onClick={() => onTrackSelect(track.id === selectedTrack ? null : track.id)}
          >
            {/* Track Header */}
            <div className="track-header">
              <div className="track-info">
                <div 
                  className="track-color" 
                  style={{ backgroundColor: track.color }}
                />
                <span className="track-name">{track.name}</span>
              </div>
              
              <div className="track-controls">
                <button
                  className={`control-btn solo ${track.solo ? 'active' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSolo(track.id);
                  }}
                  title="Solo"
                >
                  S
                </button>
                <button
                  className={`control-btn mute ${track.muted ? 'active' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMute(track.id);
                  }}
                  title="Mute"
                >
                  M
                </button>
              </div>
            </div>

            {/* Track Pattern */}
            <div className="track-pattern">
              <div className="pattern-steps">
                {track.pattern.map((active, stepIndex) => (
                  <button
                    key={stepIndex}
                    className={`pattern-step ${active ? 'active' : ''} ${
                      stepIndex === currentStep ? 'current' : ''
                    } ${stepIndex % 4 === 0 ? 'beat' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePatternClick(track.id, stepIndex);
                    }}
                    style={{
                      backgroundColor: active ? track.color : undefined,
                      borderColor: stepIndex === currentStep ? track.color : undefined
                    }}
                    title={`Step ${stepIndex + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* Track Volume */}
            <div className="track-volume">
              <div className="volume-control">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={track.volume}
                  onChange={(e) => {
                    e.stopPropagation();
                    handleVolumeChange(track.id, parseFloat(e.target.value));
                  }}
                  className="volume-slider"
                  style={{
                    background: `linear-gradient(90deg, ${track.color} 0%, ${track.color} ${track.volume * 100}%, var(--bg-tertiary) ${track.volume * 100}%, var(--bg-tertiary) 100%)`
                  }}
                />
                <span className="volume-value">{Math.round(track.volume * 100)}</span>
              </div>
            </div>

            {/* Track Samples */}
            <div className="track-samples">
              <div className="samples-list">
                {track.samples.map((sample, index) => (
                  <div key={index} className="sample-item">
                    <div className="sample-icon">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polygon points="5,3 19,12 5,21"/>
                      </svg>
                    </div>
                    <span className="sample-name">{sample}</span>
                  </div>
                ))}
              </div>
              
              <button className="add-sample-btn" title="Add Sample">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="5" x2="12" y2="19"/>
                  <line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
              </button>
            </div>

            {/* Expanded Track Details */}
            {selectedTrack === track.id && (
              <div className="track-details">
                <div className="detail-section">
                  <h4 className="detail-title">Effects</h4>
                  <div className="effects-grid">
                    <button className="effect-btn">Reverb</button>
                    <button className="effect-btn">Delay</button>
                    <button className="effect-btn">Filter</button>
                    <button className="effect-btn">Distortion</button>
                  </div>
                </div>
                
                <div className="detail-section">
                  <h4 className="detail-title">Settings</h4>
                  <div className="settings-grid">
                    <div className="setting-item">
                      <label>Pan</label>
                      <input type="range" min="-1" max="1" step="0.1" defaultValue="0" />
                    </div>
                    <div className="setting-item">
                      <label>Pitch</label>
                      <input type="range" min="-12" max="12" step="1" defaultValue="0" />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Pattern Length Controls */}
      <div className="pattern-controls">
        <div className="pattern-length">
          <label className="control-label">Pattern Length</label>
          <div className="length-buttons">
            <button className="length-btn">8</button>
            <button className="length-btn active">16</button>
            <button className="length-btn">32</button>
          </div>
        </div>
        
        <div className="pattern-actions">
          <button className="btn btn-sm btn-secondary">Clear All</button>
          <button className="btn btn-sm btn-secondary">Random</button>
        </div>
      </div>
    </div>
  );
};

export default TrackList;