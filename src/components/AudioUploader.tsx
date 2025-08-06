/**
 * AudioUploader Component
 * A comprehensive React component for audio file upload with drag-and-drop functionality,
 * accessibility support, progress tracking, and error handling using modern React hooks
 */

import React, { useMemo } from 'react';
import { AudioUploaderProps, AudioFile, UploadError } from '../types/audio-upload';
import { useAudioUpload } from '../hooks/useAudioUpload';
import { useDropzone } from '../hooks/useDropzone';
import './AudioUploader.css';

// Simple icons as inline SVG components for better accessibility
const UploadIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg 
    className={className} 
    fill="none" 
    viewBox="0 0 24 24" 
    stroke="currentColor"
    aria-hidden="true"
  >
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      strokeWidth={2} 
      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" 
    />
  </svg>
);

const MusicIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg 
    className={className} 
    fill="none" 
    viewBox="0 0 24 24" 
    stroke="currentColor"
    aria-hidden="true"
  >
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      strokeWidth={2} 
      d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" 
    />
  </svg>
);

const CheckIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg 
    className={className} 
    fill="none" 
    viewBox="0 0 24 24" 
    stroke="currentColor"
    aria-hidden="true"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const XIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg 
    className={className} 
    fill="none" 
    viewBox="0 0 24 24" 
    stroke="currentColor"
    aria-hidden="true"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const SpinnerIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg 
    className={className} 
    fill="none" 
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <circle 
      className="opacity-25" 
      cx="12" 
      cy="12" 
      r="10" 
      stroke="currentColor" 
      strokeWidth="4"
    />
    <path 
      className="opacity-75" 
      fill="currentColor" 
      d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </svg>
);

const ExclamationIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg 
    className={className} 
    fill="none" 
    viewBox="0 0 24 24" 
    stroke="currentColor"
    aria-hidden="true"
  >
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      strokeWidth={2} 
      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" 
    />
  </svg>
);

// Utility function to format file size
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Utility function to format duration
const formatDuration = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

// File item component
const FileItem: React.FC<{
  file: AudioFile;
  onRemove: (id: string) => void;
  showProgress: boolean;
  showMetadata: boolean;
}> = ({ file, onRemove, showProgress, showMetadata }) => {
  const getStatusIcon = () => {
    switch (file.status) {
      case 'pending':
        return <SpinnerIcon className="audio-uploader__status-icon audio-uploader__status-icon--pending" />;
      case 'validating':
      case 'uploading':
        return <SpinnerIcon className="audio-uploader__status-icon audio-uploader__status-icon--uploading" />;
      case 'complete':
        return <CheckIcon className="audio-uploader__status-icon audio-uploader__status-icon--complete" />;
      case 'error':
        return <XIcon className="audio-uploader__status-icon audio-uploader__status-icon--error" />;
      default:
        return null;
    }
  };

  const getProgressBarClass = () => {
    if (file.status === 'complete') return 'audio-uploader__progress-bar--complete';
    if (file.status === 'error') return 'audio-uploader__progress-bar--error';
    return '';
  };

  return (
    <div className="audio-uploader__file-item">
      <MusicIcon className="audio-uploader__file-icon" />
      
      <div className="audio-uploader__file-info">
        <h4 className="audio-uploader__file-name" title={file.name}>
          {file.name}
        </h4>
        
        <div className="audio-uploader__file-meta">
          <span className="audio-uploader__file-size">
            {formatFileSize(file.size)}
          </span>
          
          {showMetadata && file.metadata?.duration && (
            <span className="audio-uploader__file-duration">
              {formatDuration(file.metadata.duration)}
            </span>
          )}
          
          {file.error && (
            <span className="audio-uploader__file-error" style={{ color: 'var(--error-color)' }}>
              {file.error}
            </span>
          )}
        </div>

        {showProgress && (file.status === 'uploading' || file.status === 'complete') && (
          <div className="audio-uploader__progress">
            <div 
              className={`audio-uploader__progress-bar ${getProgressBarClass()}`}
              style={{ width: `${file.progress}%` }}
              role="progressbar"
              aria-valuenow={file.progress}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`Upload progress for ${file.name}: ${file.progress}%`}
            />
          </div>
        )}
      </div>

      <div className="audio-uploader__file-status">
        {getStatusIcon()}
        
        <button
          type="button"
          className="audio-uploader__remove-button"
          onClick={() => onRemove(file.id)}
          aria-label={`Remove ${file.name}`}
          title={`Remove ${file.name}`}
        >
          <XIcon className="remove-icon" />
        </button>
      </div>
    </div>
  );
};

// Error display component
const ErrorDisplay: React.FC<{ errors: UploadError[] }> = ({ errors }) => {
  if (errors.length === 0) return null;

  return (
    <div className="audio-uploader__errors" role="alert">
      {errors.map((error, index) => (
        <div key={index} className="audio-uploader__error">
          <ExclamationIcon className="audio-uploader__error-icon" />
          <p className="audio-uploader__error-message">
            {error.fileName && <strong>{error.fileName}: </strong>}
            {error.message}
          </p>
        </div>
      ))}
    </div>
  );
};

// Main AudioUploader component
export const AudioUploader: React.FC<AudioUploaderProps> = ({
  onUpload,
  onProgress,
  onError,
  onSuccess,
  onFilesChange,
  accept,
  maxFiles = 10,
  maxFileSize = 100 * 1024 * 1024, // 100MB
  maxDuration: _maxDuration,
  minDuration: _minDuration,
  multiple = true,
  disabled = false,
  className = '',
  style,
  showPreview = true,
  showProgress = true,
  showMetadata = true,
  validateAudio,
  ariaLabel,
  ariaDescribedBy,
  onDragEnter,
  onDragLeave,
  onClick
}) => {
  // Use the audio upload hook
  const {
    files,
    isUploading,
    errors,
    canAddMore,
    addFiles,
    removeFile,
    startUpload,
    cancelUpload,
    retryFailedUploads,
    clearAll
  } = useAudioUpload({
    onUpload,
    onProgress,
    onError,
    onSuccess,
    onFilesChange,
    maxFiles,
    maxFileSize,
    accept,
    validateAudio
  });

  // Use the dropzone hook
  const {
    isDragActive,
    isDragAccept,
    isDragReject,
    getRootProps,
    getInputProps,
    openFileDialog
  } = useDropzone({
    onDrop: addFiles,
    accept,
    multiple,
    disabled: disabled || !canAddMore,
    maxFiles
  });

  // Calculate dropzone CSS classes
  const dropzoneClasses = useMemo(() => {
    const classes = ['audio-uploader__dropzone'];
    
    if (isDragActive) classes.push('audio-uploader__dropzone--drag-active');
    if (isDragAccept) classes.push('audio-uploader__dropzone--drag-accept');
    if (isDragReject) classes.push('audio-uploader__dropzone--drag-reject');
    if (disabled || !canAddMore) classes.push('audio-uploader__dropzone--disabled');
    
    return classes.join(' ');
  }, [isDragActive, isDragAccept, isDragReject, disabled, canAddMore]);

  // Get dropzone props with custom event handlers
  const rootProps = getRootProps();
  const enhancedRootProps = {
    ...rootProps,
    onDragEnter: (e: React.DragEvent) => {
      rootProps.onDragEnter(e);
      onDragEnter?.(e);
    },
    onDragLeave: (e: React.DragEvent) => {
      rootProps.onDragLeave(e);
      onDragLeave?.(e);
    },
    onClick: (e: React.MouseEvent) => {
      rootProps.onClick(e);
      onClick?.(e);
    },
    'aria-label': ariaLabel || rootProps['aria-label'],
    'aria-describedby': ariaDescribedBy
  };

  // Check if there are any failed uploads that can be retried
  const hasRetryableErrors = errors.some(error => error.recoverable);
  const hasFailedFiles = files.some(file => file.status === 'error');

  return (
    <div 
      className={`audio-uploader ${className}`} 
      style={style}
    >
      {/* Dropzone area */}
      <div 
        {...enhancedRootProps}
        className={dropzoneClasses}
      >
        <input {...getInputProps()} />
        
        <div className="audio-uploader__dropzone-content">
          <UploadIcon className="audio-uploader__icon" />
          
          <h3 className="audio-uploader__title">
            {isDragActive 
              ? isDragAccept 
                ? 'Drop your audio files here'
                : 'Some files are not supported'
              : 'Upload Audio Files'
            }
          </h3>
          
          <p className="audio-uploader__subtitle">
            {isDragActive 
              ? isDragAccept
                ? 'Release to upload'
                : 'Please select valid audio files'
              : `Drag and drop your audio files here, or click to browse.${multiple ? ` You can select up to ${maxFiles} files.` : ''}`
            }
          </p>
          
          {!isDragActive && (
            <button
              type="button"
              className="audio-uploader__browse-button"
              onClick={(e) => {
                e.stopPropagation();
                openFileDialog();
              }}
              disabled={disabled || !canAddMore}
            >
              Browse Files
            </button>
          )}
        </div>
      </div>

      {/* Error display */}
      <ErrorDisplay errors={errors} />

      {/* File list */}
      {showPreview && files.length > 0 && (
        <div className="audio-uploader__files">
          {files.map(file => (
            <FileItem
              key={file.id}
              file={file}
              onRemove={removeFile}
              showProgress={showProgress}
              showMetadata={showMetadata}
            />
          ))}
        </div>
      )}

      {/* Action buttons */}
      {files.length > 0 && (
        <div className="audio-uploader__actions">
          {!isUploading && (
            <>
              <button
                type="button"
                className="audio-uploader__button audio-uploader__button--secondary"
                onClick={clearAll}
                disabled={disabled}
              >
                Clear All
              </button>
              
              {(hasRetryableErrors || hasFailedFiles) && (
                <button
                  type="button"
                  className="audio-uploader__button audio-uploader__button--secondary"
                  onClick={retryFailedUploads}
                  disabled={disabled}
                >
                  Retry Failed
                </button>
              )}
              
              {onUpload && (
                <button
                  type="button"
                  className="audio-uploader__button audio-uploader__button--primary"
                  onClick={startUpload}
                  disabled={disabled || files.every(f => f.status === 'complete')}
                >
                  <UploadIcon className="upload-icon" />
                  Upload Files
                </button>
              )}
            </>
          )}
          
          {isUploading && (
            <button
              type="button"
              className="audio-uploader__button audio-uploader__button--danger"
              onClick={cancelUpload}
            >
              Cancel Upload
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default AudioUploader;