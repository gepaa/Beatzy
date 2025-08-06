import React, { useEffect, useRef, useState } from 'react';
import '../styles/AudioVisualizer.css';

interface AudioVisualizerProps {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  audioData?: any;
}

const AudioVisualizer: React.FC<AudioVisualizerProps> = ({
  isPlaying,
  currentTime,
  duration,
  audioData
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const [visualizerType, setVisualizerType] = useState<'waveform' | 'spectrum' | 'circular'>('waveform');

  // Mock audio data for visualization
  const generateMockData = (type: string) => {
    const dataPoints = type === 'circular' ? 64 : 128;
    return Array.from({ length: dataPoints }, (_, i) => {
      if (!isPlaying) return Math.random() * 0.1;
      
      const time = currentTime + i * 0.1;
      const amplitude = 0.3 + Math.sin(time * 0.5) * 0.2;
      const frequency = Math.sin(time * 2 + i * 0.1) * amplitude;
      const randomness = (Math.random() - 0.5) * 0.1;
      
      return Math.max(0, frequency + randomness);
    });
  };

  const drawWaveform = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    const data = generateMockData('waveform');
    const width = canvas.width;
    const height = canvas.height;
    
    // Clear canvas
    ctx.fillStyle = 'rgba(10, 10, 15, 0.1)';
    ctx.fillRect(0, 0, width, height);
    
    // Create gradient
    const gradient = ctx.createLinearGradient(0, 0, width, 0);
    gradient.addColorStop(0, '#6366f1');
    gradient.addColorStop(0.5, '#06ffa5');
    gradient.addColorStop(1, '#8b5cf6');
    
    ctx.fillStyle = gradient;
    ctx.strokeStyle = gradient;
    
    // Draw waveform
    const barWidth = width / data.length;
    data.forEach((value, i) => {
      const barHeight = value * height * 0.8;
      const x = i * barWidth;
      const y = (height - barHeight) / 2;
      
      // Draw bar with glow effect
      ctx.shadowColor = '#6366f1';
      ctx.shadowBlur = 10;
      ctx.fillRect(x, y, barWidth - 1, barHeight);
      
      // Add top highlight
      ctx.shadowBlur = 0;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.fillRect(x, y, barWidth - 1, 2);
      ctx.fillStyle = gradient;
    });
    
    // Draw progress line
    if (duration > 0) {
      const progressX = (currentTime / duration) * width;
      ctx.strokeStyle = '#ff6b35';
      ctx.lineWidth = 3;
      ctx.shadowColor = '#ff6b35';
      ctx.shadowBlur = 15;
      ctx.beginPath();
      ctx.moveTo(progressX, 0);
      ctx.lineTo(progressX, height);
      ctx.stroke();
    }
  };

  const drawSpectrum = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    const data = generateMockData('spectrum');
    const width = canvas.width;
    const height = canvas.height;
    
    ctx.fillStyle = 'rgba(10, 10, 15, 0.1)';
    ctx.fillRect(0, 0, width, height);
    
    const barWidth = width / data.length;
    
    data.forEach((value, i) => {
      const barHeight = value * height;
      const x = i * barWidth;
      const y = height - barHeight;
      
      // Color based on frequency
      const hue = (i / data.length) * 360;
      ctx.fillStyle = `hsla(${hue}, 70%, 60%, 0.8)`;
      ctx.shadowColor = `hsla(${hue}, 70%, 60%, 0.5)`;
      ctx.shadowBlur = 8;
      
      ctx.fillRect(x, y, barWidth - 2, barHeight);
    });
  };

  const drawCircular = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    const data = generateMockData('circular');
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) * 0.3;
    
    ctx.fillStyle = 'rgba(10, 10, 15, 0.1)';
    ctx.fillRect(0, 0, width, height);
    
    // Draw center circle
    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
    gradient.addColorStop(0, 'rgba(99, 102, 241, 0.3)');
    gradient.addColorStop(1, 'rgba(99, 102, 241, 0.1)');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * 0.6, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw frequency bars in circle
    data.forEach((value, i) => {
      const angle = (i / data.length) * Math.PI * 2 - Math.PI / 2;
      const barLength = value * radius * 0.8;
      
      const x1 = centerX + Math.cos(angle) * (radius * 0.7);
      const y1 = centerY + Math.sin(angle) * (radius * 0.7);
      const x2 = centerX + Math.cos(angle) * (radius * 0.7 + barLength);
      const y2 = centerY + Math.sin(angle) * (radius * 0.7 + barLength);
      
      const hue = (i / data.length) * 360;
      ctx.strokeStyle = `hsla(${hue}, 70%, 60%, 0.8)`;
      ctx.lineWidth = 3;
      ctx.shadowColor = `hsla(${hue}, 70%, 60%, 0.5)`;
      ctx.shadowBlur = 5;
      
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    });
    
    // Rotating center indicator
    if (isPlaying) {
      const rotation = (currentTime * 2) % (Math.PI * 2);
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(rotation);
      
      ctx.strokeStyle = '#06ffa5';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, -10);
      ctx.lineTo(0, -radius * 0.5);
      ctx.stroke();
      
      ctx.restore();
    }
  };

  const animate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas size
    canvas.width = canvas.offsetWidth * window.devicePixelRatio;
    canvas.height = canvas.offsetHeight * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    
    // Draw based on visualizer type
    switch (visualizerType) {
      case 'waveform':
        drawWaveform(ctx, canvas);
        break;
      case 'spectrum':
        drawSpectrum(ctx, canvas);
        break;
      case 'circular':
        drawCircular(ctx, canvas);
        break;
    }
    
    if (isPlaying) {
      animationRef.current = requestAnimationFrame(animate);
    }
  };

  useEffect(() => {
    animate();
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, currentTime, visualizerType]);

  return (
    <div className="audio-visualizer">
      <div className="visualizer-header">
        <h3 className="visualizer-title">Audio Visualizer</h3>
        <div className="visualizer-controls">
          <button
            className={`visualizer-btn ${visualizerType === 'waveform' ? 'active' : ''}`}
            onClick={() => setVisualizerType('waveform')}
            title="Waveform"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 12h3l3-9 6 18 3-9h3"/>
            </svg>
          </button>
          <button
            className={`visualizer-btn ${visualizerType === 'spectrum' ? 'active' : ''}`}
            onClick={() => setVisualizerType('spectrum')}
            title="Spectrum"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
              <line x1="9" y1="9" x2="9" y2="15"/>
              <line x1="15" y1="7" x2="15" y2="17"/>
              <line x1="12" y1="5" x2="12" y2="19"/>
            </svg>
          </button>
          <button
            className={`visualizer-btn ${visualizerType === 'circular' ? 'active' : ''}`}
            onClick={() => setVisualizerType('circular')}
            title="Circular"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="2" x2="12" y2="12"/>
              <line x1="12" y1="12" x2="16" y2="16"/>
            </svg>
          </button>
        </div>
      </div>
      
      <div className="visualizer-canvas-container">
        <canvas
          ref={canvasRef}
          className="visualizer-canvas"
        />
        
        {!isPlaying && !audioData && (
          <div className="visualizer-placeholder">
            <div className="placeholder-icon">🎵</div>
            <p>Import a beat to see visualization</p>
          </div>
        )}
      </div>
      
      {audioData && (
        <div className="visualizer-info">
          <div className="info-item">
            <span className="info-label">BPM:</span>
            <span className="info-value">{audioData.tempo || 120}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Key:</span>
            <span className="info-value">{audioData.key || 'C'}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Genre:</span>
            <span className="info-value">{audioData.genre || 'Unknown'}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AudioVisualizer;