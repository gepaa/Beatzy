import React, { useState, useRef, useEffect } from 'react';
import '../styles/ProjectHeader.css';

interface ProjectHeaderProps {
  projectName: string;
  bpm: number;
  timeSignature: string;
  musicalKey: string;
  onProjectNameChange: (name: string) => void;
  onBpmChange: (bpm: number) => void;
  onKeyChange: (key: string) => void;
  onSave: () => void;
  onExport: () => void;
}

const musicalKeys = [
  'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B',
  'C min', 'C# min', 'D min', 'D# min', 'E min', 'F min', 'F# min', 
  'G min', 'G# min', 'A min', 'A# min', 'B min'
];

const ProjectHeader: React.FC<ProjectHeaderProps> = ({
  projectName,
  bpm,
  timeSignature,
  musicalKey,
  onProjectNameChange,
  onBpmChange,
  onKeyChange,
  onSave,
  onExport
}) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(projectName);
  const [showBpmDropdown, setShowBpmDropdown] = useState(false);
  const [showKeyDropdown, setShowKeyDropdown] = useState(false);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const bpmDropdownRef = useRef<HTMLDivElement>(null);
  const keyDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTempName(projectName);
  }, [projectName]);

  useEffect(() => {
    if (isEditingName && nameInputRef.current) {
      nameInputRef.current.focus();
      nameInputRef.current.select();
    }
  }, [isEditingName]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (bpmDropdownRef.current && !bpmDropdownRef.current.contains(event.target as Node)) {
        setShowBpmDropdown(false);
      }
      if (keyDropdownRef.current && !keyDropdownRef.current.contains(event.target as Node)) {
        setShowKeyDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleNameEdit = () => {
    setIsEditingName(true);
  };

  const handleNameSubmit = () => {
    const finalName = tempName.trim() || 'Untitled Project';
    onProjectNameChange(finalName);
    setTempName(finalName);
    setIsEditingName(false);
  };

  const handleNameKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleNameSubmit();
    } else if (e.key === 'Escape') {
      setTempName(projectName);
      setIsEditingName(false);
    }
  };

  const handleBpmChange = (newBpm: number) => {
    if (newBpm >= 60 && newBpm <= 200) {
      onBpmChange(newBpm);
    }
    setShowBpmDropdown(false);
  };

  const commonBpms = [80, 90, 100, 110, 120, 130, 140, 150, 160, 170];

  return (
    <div className="project-header">
      <div className="project-header-content">
        {/* Project Name */}
        <div className="project-name-section">
          {isEditingName ? (
            <input
              ref={nameInputRef}
              type="text"
              className="project-name-input"
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              onBlur={handleNameSubmit}
              onKeyDown={handleNameKeyDown}
              maxLength={50}
            />
          ) : (
            <h2 className="project-name" onClick={handleNameEdit}>
              {projectName}
              <span className="edit-icon">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
              </span>
            </h2>
          )}
        </div>

        {/* Project Controls */}
        <div className="project-controls">
          {/* BPM Selector */}
          <div className="control-group">
            <label className="control-label">BPM</label>
            <div ref={bpmDropdownRef} className="bpm-selector" onClick={() => setShowBpmDropdown(!showBpmDropdown)}>
              <span className="bpm-value">{bpm}</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="6,9 12,15 18,9"/>
              </svg>
              
              {showBpmDropdown && (
                <div className="bpm-dropdown">
                  <div className="bpm-input-section">
                    <input
                      type="number"
                      min="60"
                      max="200"
                      value={bpm}
                      onChange={(e) => handleBpmChange(parseInt(e.target.value) || 120)}
                      className="bpm-input"
                    />
                  </div>
                  <div className="bpm-presets">
                    {commonBpms.map(preset => (
                      <button
                        key={preset}
                        className={`bpm-preset ${bpm === preset ? 'active' : ''}`}
                        onClick={() => handleBpmChange(preset)}
                      >
                        {preset}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Time Signature */}
          <div className="control-group">
            <label className="control-label">Time</label>
            <div className="time-signature">
              <span className="time-value">{timeSignature}</span>
            </div>
          </div>

          {/* Key Selector */}
          <div className="control-group">
            <label className="control-label">Key</label>
            <div ref={keyDropdownRef} className="key-selector" onClick={() => setShowKeyDropdown(!showKeyDropdown)}>
              <span className="key-value">{musicalKey}</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="6,9 12,15 18,9"/>
              </svg>
              
              {showKeyDropdown && (
                <div className="key-dropdown">
                  <div className="key-section">
                    <div className="key-section-title">Major</div>
                    <div className="key-options">
                      {musicalKeys.slice(0, 12).map(key => (
                        <button
                          key={key}
                          className={`key-option ${musicalKey === key ? 'active' : ''}`}
                          onClick={() => {
                            onKeyChange(key);
                            setShowKeyDropdown(false);
                          }}
                        >
                          {key}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="key-section">
                    <div className="key-section-title">Minor</div>
                    <div className="key-options">
                      {musicalKeys.slice(12).map(key => (
                        <button
                          key={key}
                          className={`key-option ${musicalKey === key ? 'active' : ''}`}
                          onClick={() => {
                            onKeyChange(key);
                            setShowKeyDropdown(false);
                          }}
                        >
                          {key}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="project-actions">
          <button className="icon-button save-btn" onClick={onSave} title="Save Project">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
              <polyline points="17,21 17,13 7,13 7,21"/>
              <polyline points="7,3 7,8 15,8"/>
            </svg>
          </button>
          
          <button className="icon-button export-btn" onClick={onExport} title="Export Project">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7,10 12,15 17,10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectHeader;