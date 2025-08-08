import React, { useState, useRef, useEffect } from 'react';
import { AudioUploader } from './AudioUploader';
import Timeline from './Timeline';
import TransportControls from './TransportControls';
import TrackList from './TrackList';
import AIGenerationPanel from './AIGenerationPanel';
import EmptyStudioState from './EmptyStudioState';
import ProjectHeader from './ProjectHeader';
import '../styles/BeatStudio.css';

interface BeatStudioProps {
  onCreateBeat?: () => void;
  shouldCreateBeat?: boolean;
  onBeatCreated?: () => void;
}

const BeatStudio: React.FC<BeatStudioProps> = ({ onCreateBeat, shouldCreateBeat, onBeatCreated }) => {
  const [currentBeat, setCurrentBeat] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [tempo, setTempo] = useState(120);
  const [selectedTrack, setSelectedTrack] = useState<number | null>(null);
  const [showAIPanel, setShowAIPanel] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
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

  const createNewManualBeat = () => {
    const newBeat = {
      id: Date.now(),
      name: 'Untitled Project',
      duration: 240, // 4 minutes
      tempo: 120,
      key: 'C',
      genre: 'Manual Creation',
      isManual: true
    };
    
    setCurrentBeat(newBeat);
    setDuration(newBeat.duration);
    setTempo(newBeat.tempo);
    onBeatCreated?.();
  };

  const handleProjectNameChange = (name: string) => {
    if (currentBeat) {
      setCurrentBeat({ ...currentBeat, name });
    }
  };

  const handleBpmChange = (bpm: number) => {
    setTempo(bpm);
    if (currentBeat) {
      setCurrentBeat({ ...currentBeat, tempo: bpm });
    }
  };

  const handleKeyChange = (key: string) => {
    if (currentBeat) {
      setCurrentBeat({ ...currentBeat, key });
    }
  };

  const handleSave = () => {
    console.log('Saving project:', currentBeat);
    // TODO: Implement actual save functionality
  };

  const handleExport = () => {
    console.log('Exporting project:', currentBeat);
    // TODO: Implement actual export functionality
  };

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

  const handleStop = () => {
    setIsPlaying(false);
    setCurrentTime(0);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  const handleRecord = () => {
    console.log('Record functionality will be implemented later');
    // TODO: Implement recording functionality
  };

  const handleLoop = () => {
    setIsLooping(!isLooping);
    if (audioRef.current) {
      audioRef.current.loop = !isLooping;
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

  // Auto-create beat when shouldCreateBeat is true
  useEffect(() => {
    if (shouldCreateBeat && !currentBeat) {
      createNewManualBeat();
    }
  }, [shouldCreateBeat, currentBeat]);

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

  // Show empty state if no current beat
  if (!currentBeat) {
    return <EmptyStudioState onCreateBeat={onCreateBeat || (() => {})} />;
  }

  return (
    <div className="beat-studio">
      {/* Project Header */}
      <ProjectHeader
        projectName={currentBeat?.name || 'Untitled Project'}
        bpm={tempo}
        timeSignature="4/4"
        musicalKey={currentBeat?.key || 'C'}
        onProjectNameChange={handleProjectNameChange}
        onBpmChange={handleBpmChange}
        onKeyChange={handleKeyChange}
        onSave={handleSave}
        onExport={handleExport}
      />

      {/* Studio Actions Bar */}
      <div className="studio-actions-bar">
        <button
          className="btn btn-secondary"
          onClick={() => setShowImportModal(true)}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="17,8 12,3 7,8"/>
            <line x1="12" y1="3" x2="12" y2="15"/>
          </svg>
          Import Audio
        </button>
        
        <button
          className={`btn btn-primary ${showAIPanel ? 'active' : ''}`}
          onClick={() => setShowAIPanel(!showAIPanel)}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
            <polyline points="3.27,6.96 12,12.01 20.73,6.96"/>
            <line x1="12" y1="22.08" x2="12" y2="12"/>
          </svg>
          AI Assistant
        </button>
      </div>

      <div className={`studio-workspace ${showAIPanel ? 'has-sidebar' : ''}`}>
        {/* Left Panel - AI Panel (only when active) */}
        {showAIPanel && (
          <div className="studio-sidebar">
            <AIGenerationPanel
              currentBeat={currentBeat}
              onGenerate={(params) => console.log('Generate with:', params)}
              onClose={() => setShowAIPanel(false)}
            />
          </div>
        )}

        {/* Main Panel - Timeline & Controls */}
        <div className="studio-main">
          <div className="timeline-section">
            <Timeline
              isPlaying={isPlaying}
              currentTime={currentTime}
              duration={duration}
              tempo={tempo}
              onTimeChange={setCurrentTime}
            />
          </div>

          <div className="transport-section">
            <TransportControls
              isPlaying={isPlaying}
              currentTime={currentTime}
              duration={duration}
              volume={volume}
              isLooping={isLooping}
              onPlay={handlePlay}
              onStop={handleStop}
              onRecord={handleRecord}
              onLoop={handleLoop}
              onVolumeChange={setVolume}
              onTimeChange={setCurrentTime}
            />
          </div>
        </div>

        {/* Right Panel - Track List (only when beat is loaded) */}
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
      
      {/* Import Audio Modal */}
      {showImportModal && (
        <div className="modal-overlay" onClick={() => setShowImportModal(false)}>
          <div className="modal-content import-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Import Audio</h3>
              <button className="modal-close" onClick={() => setShowImportModal(false)}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
            <div className="modal-body">
              <AudioUploader
                onUpload={async (files) => {
                  const result = await handleUpload(files);
                  setShowImportModal(false);
                  return result;
                }}
                maxFiles={1}
                maxFileSize={100 * 1024 * 1024} // 100MB
                accept={['audio/mp3', 'audio/wav', 'audio/aac', 'audio/ogg', 'audio/flac']}
                showProgress={true}
                showMetadata={true}
                multiple={false}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BeatStudio;