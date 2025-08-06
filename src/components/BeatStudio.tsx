import React, { useState, useRef, useEffect } from 'react';
import { AudioUploader } from './AudioUploader';
import AudioVisualizer from './AudioVisualizer';
import BeatControls from './BeatControls';
import TrackList from './TrackList';
import AIGenerationPanel from './AIGenerationPanel';
import '../styles/BeatStudio.css';

interface BeatStudioProps {
  onCreateBeat?: () => void;
}

const BeatStudio: React.FC<BeatStudioProps> = ({ onCreateBeat }) => {
  const [currentBeat, setCurrentBeat] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [tempo, setTempo] = useState(120);
  const [selectedTrack, setSelectedTrack] = useState<number | null>(null);
  const [showAIPanel, setShowAIPanel] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Mock tracks data
  const [tracks] = useState([
    {
      id: 1,
      name: 'Kick',
      color: '#ff6b35',
      volume: 0.8,
      muted: false,
      solo: false,
      pattern: [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0],
      samples: ['kick_1.wav', 'kick_2.wav']
    },
    {
      id: 2,
      name: 'Snare',
      color: '#06ffa5',
      volume: 0.7,
      muted: false,
      solo: false,
      pattern: [0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0],
      samples: ['snare_1.wav', 'snare_2.wav']
    },
    {
      id: 3,
      name: 'Hi-Hat',
      color: '#8b5cf6',
      volume: 0.6,
      muted: false,
      solo: false,
      pattern: [1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1],
      samples: ['hihat_1.wav', 'hihat_2.wav']
    },
    {
      id: 4,
      name: 'Bass',
      color: '#6366f1',
      volume: 0.9,
      muted: false,
      solo: false,
      pattern: [1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 1, 0],
      samples: ['bass_1.wav', 'bass_2.wav']
    }
  ]);

  const handlePlay = () => {
    setIsPlaying(!isPlaying);
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
    }
  };

  const handleUpload = async (files: any[]) => {
    // Mock upload - in real app would process audio files
    console.log('Uploading files to beat studio:', files);
    
    // Simulate processing
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock successful upload
    const mockBeat = {
      id: Date.now(),
      name: files[0]?.file?.name || 'Uploaded Beat',
      duration: 180, // 3 minutes
      tempo: Math.floor(Math.random() * 40) + 100, // 100-140 BPM
      key: ['C', 'D', 'E', 'F', 'G', 'A', 'B'][Math.floor(Math.random() * 7)],
      genre: ['Hip Hop', 'Trap', 'Lo-Fi', 'Electronic'][Math.floor(Math.random() * 4)]
    };
    
    setCurrentBeat(mockBeat);
    setDuration(mockBeat.duration);
    setTempo(mockBeat.tempo);
    
    return files.map(file => ({
      fileId: file.id,
      fileName: file.file.name,
      success: true,
      url: `mock://beats/${file.file.name}`,
      metadata: {
        ...mockBeat,
        format: file.file.type || 'audio/mp3'
      }
    }));
  };

  useEffect(() => {
    // Mock audio time updates
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= duration) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, duration]);

  return (
    <div className="beat-studio">
      <div className="studio-header">
        <div className="project-info">
          <h1 className="project-title">
            {currentBeat ? currentBeat.name : 'New Project'}
          </h1>
          <div className="project-details">
            <span className="tempo">{tempo} BPM</span>
            {currentBeat && (
              <>
                <span className="key">Key: {currentBeat.key}</span>
                <span className="genre">{currentBeat.genre}</span>
              </>
            )}
          </div>
        </div>
        
        <div className="studio-actions">
          <button
            className={`btn btn-primary ${showAIPanel ? 'active' : ''}`}
            onClick={() => setShowAIPanel(!showAIPanel)}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
              <polyline points="3.27,6.96 12,12.01 20.73,6.96"/>
              <line x1="12" y1="22.08" x2="12" y2="12"/>
            </svg>
            AI Assistant
          </button>
          
          <button className="btn btn-secondary">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7,10 12,15 17,10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Export
          </button>
          
          <button className="btn btn-accent">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5l7 7z"/>
            </svg>
            Save Project
          </button>
        </div>
      </div>

      <div className="studio-workspace">
        {/* Left Panel - Upload & AI */}
        <div className="studio-sidebar">
          <div className="upload-section">
            <h3 className="section-title">Create New Beat</h3>
            <div className="create-beat-prompt">
              <div className="prompt-icon">🎵</div>
              <p className="prompt-description">
                Ready to create your next hit? Click the button below to get started.
              </p>
              <button className="btn btn-primary btn-lg" onClick={onCreateBeat}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                  <path d="M2 17l10 5 10-5"/>
                  <path d="M2 12l10 5 10-5"/>
                </svg>
                Create Beat
              </button>
            </div>

            <h3 className="section-title">Or Import Audio</h3>
            <AudioUploader
              onUpload={handleUpload}
              maxFiles={1}
              maxFileSize={100 * 1024 * 1024} // 100MB
              accept={['audio/mp3', 'audio/wav', 'audio/aac', 'audio/ogg', 'audio/flac']}
              showProgress={true}
              showMetadata={true}
              multiple={false}
            />
          </div>

          {showAIPanel && (
            <AIGenerationPanel
              currentBeat={currentBeat}
              onGenerate={(params) => console.log('Generate with:', params)}
              onClose={() => setShowAIPanel(false)}
            />
          )}
        </div>

        {/* Center Panel - Visualizer & Controls */}
        <div className="studio-main">
          <div className="visualizer-section">
            <AudioVisualizer
              isPlaying={isPlaying}
              currentTime={currentTime}
              duration={duration}
              audioData={currentBeat}
            />
          </div>

          <div className="controls-section">
            <BeatControls
              isPlaying={isPlaying}
              currentTime={currentTime}
              duration={duration}
              volume={volume}
              tempo={tempo}
              onPlay={handlePlay}
              onTimeChange={setCurrentTime}
              onVolumeChange={setVolume}
              onTempoChange={setTempo}
            />
          </div>
        </div>

        {/* Right Panel - Track List */}
        <div className="studio-tracks">
          <TrackList
            tracks={tracks}
            selectedTrack={selectedTrack}
            onTrackSelect={setSelectedTrack}
            isPlaying={isPlaying}
            currentTime={currentTime}
          />
        </div>
      </div>

      {/* Hidden audio element for demo */}
      <audio ref={audioRef} style={{ display: 'none' }} />
      
      {/* Floating Action Button */}
      <button className="fab">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="12" y1="5" x2="12" y2="19"/>
          <line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
      </button>
    </div>
  );
};

export default BeatStudio;