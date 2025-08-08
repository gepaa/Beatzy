import React, { useState, useRef, useEffect, useCallback } from 'react';
import '../styles/Timeline.css';

interface TimelineProps {
  isPlaying?: boolean;
  currentTime?: number;
  duration?: number;
  tempo?: number;
  onTimeChange?: (time: number) => void;
  className?: string;
}

const Timeline: React.FC<TimelineProps> = ({
  isPlaying = false,
  currentTime = 0,
  duration = 240, // 4 minutes default
  tempo = 120, // BPM
  onTimeChange,
  className = ''
}) => {
  const [zoom, setZoom] = useState(1);
  const [scrollLeft, setScrollLeft] = useState(0);
  const timelineRef = useRef<HTMLDivElement>(null);
  const playheadRef = useRef<HTMLDivElement>(null);

  // Calculate timeline dimensions
  const beatsPerSecond = tempo / 60;
  const pixelsPerSecond = 100 * zoom; // Base 100px per second
  const totalWidth = duration * pixelsPerSecond;
  const totalBeats = Math.ceil(duration * beatsPerSecond);
  const totalMeasures = Math.ceil(totalBeats / 4);

  // Update playhead position
  useEffect(() => {
    if (playheadRef.current && timelineRef.current) {
      const playheadPosition = currentTime * pixelsPerSecond;
      playheadRef.current.style.left = `${playheadPosition}px`;
      
      // Auto-scroll to keep playhead in view during playback
      if (isPlaying) {
        const container = timelineRef.current;
        const containerWidth = container.clientWidth;
        const shouldScroll = playheadPosition > scrollLeft + containerWidth - 100;
        
        if (shouldScroll) {
          const newScrollLeft = Math.max(0, playheadPosition - containerWidth / 2);
          container.scrollLeft = newScrollLeft;
          setScrollLeft(newScrollLeft);
        }
      }
    }
  }, [currentTime, pixelsPerSecond, scrollLeft, isPlaying]);

  const handleZoomIn = useCallback(() => {
    setZoom(prev => Math.min(prev * 1.5, 4));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoom(prev => Math.max(prev / 1.5, 0.25));
  }, []);

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollLeft(e.currentTarget.scrollLeft);
  }, []);

  const handleTimelineClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (timelineRef.current && onTimeChange) {
      const rect = timelineRef.current.getBoundingClientRect();
      const clickX = e.clientX - rect.left + scrollLeft;
      const newTime = clickX / pixelsPerSecond;
      onTimeChange(Math.max(0, Math.min(newTime, duration)));
    }
  }, [scrollLeft, pixelsPerSecond, duration, onTimeChange]);

  const renderMeasureMarkers = () => {
    const markers = [];
    for (let measure = 0; measure <= totalMeasures; measure++) {
      const measureTime = (measure * 4) / beatsPerSecond;
      const position = measureTime * pixelsPerSecond;
      
      markers.push(
        <div
          key={`measure-${measure}`}
          className="timeline-measure-marker"
          style={{ left: `${position}px` }}
        >
          <div className="timeline-measure-number">{measure + 1}</div>
          <div className="timeline-measure-line" />
        </div>
      );
    }
    return markers;
  };

  const renderBeatGrid = () => {
    const gridLines = [];
    
    // Beat lines (every beat)
    for (let beat = 0; beat <= totalBeats; beat++) {
      const beatTime = beat / beatsPerSecond;
      const position = beatTime * pixelsPerSecond;
      const isMeasureStart = beat % 4 === 0;
      
      gridLines.push(
        <div
          key={`beat-${beat}`}
          className={`timeline-beat-line ${isMeasureStart ? 'measure-start' : ''}`}
          style={{ left: `${position}px` }}
        />
      );
    }
    
    // Subdivision lines (16th notes)
    if (zoom >= 0.5) {
      for (let subdivision = 0; subdivision <= totalBeats * 4; subdivision++) {
        if (subdivision % 4 !== 0) { // Don't duplicate beat lines
          const subdivisionTime = subdivision / (beatsPerSecond * 4);
          const position = subdivisionTime * pixelsPerSecond;
          
          gridLines.push(
            <div
              key={`subdivision-${subdivision}`}
              className="timeline-subdivision-line"
              style={{ left: `${position}px` }}
            />
          );
        }
      }
    }
    
    return gridLines;
  };

  return (
    <div className={`timeline-container ${className}`}>
      {/* Timeline Controls */}
      <div className="timeline-controls">
        <div className="timeline-zoom-controls">
          <button
            className="timeline-zoom-btn"
            onClick={handleZoomOut}
            title="Zoom Out"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
              <line x1="8" y1="11" x2="14" y2="11"/>
            </svg>
          </button>
          <div className="timeline-zoom-level">
            {Math.round(zoom * 100)}%
          </div>
          <button
            className="timeline-zoom-btn"
            onClick={handleZoomIn}
            title="Zoom In"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
              <line x1="11" y1="8" x2="11" y2="14"/>
              <line x1="8" y1="11" x2="14" y2="11"/>
            </svg>
          </button>
        </div>
        
        <div className="timeline-info">
          <span className="timeline-tempo">{tempo} BPM</span>
          <span className="timeline-duration">{Math.floor(duration / 60)}:{(duration % 60).toString().padStart(2, '0')}</span>
        </div>
      </div>

      {/* Timeline Viewport */}
      <div
        ref={timelineRef}
        className="timeline-viewport"
        onScroll={handleScroll}
        onClick={handleTimelineClick}
      >
        <div
          className="timeline-content"
          style={{ width: `${totalWidth}px` }}
        >
          {/* Background Grid */}
          <div className="timeline-background" />
          
          {/* Grid Lines */}
          <div className="timeline-grid">
            {renderBeatGrid()}
          </div>
          
          {/* Measure Markers */}
          <div className="timeline-measures">
            {renderMeasureMarkers()}
          </div>
          
          {/* Playhead */}
          <div
            ref={playheadRef}
            className={`timeline-playhead ${isPlaying ? 'playing' : ''}`}
          >
            <div className="timeline-playhead-line" />
            <div className="timeline-playhead-handle" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Timeline;