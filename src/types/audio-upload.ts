/**
 * TypeScript definitions for Audio Upload Component
 * Provides comprehensive type safety for audio file upload functionality
 */

export interface AudioFile {
  id: string;
  file: File;
  name: string;
  size: number;
  type: string;
  status: 'pending' | 'validating' | 'uploading' | 'complete' | 'error';
  progress: number;
  error?: string;
  metadata?: AudioMetadata;
}

export interface AudioMetadata {
  duration?: number;
  sampleRate?: number;
  channels?: number;
  bitRate?: number;
  format: string;
}

export interface UploadProgress {
  fileId: string;
  fileName: string;
  bytesUploaded: number;
  totalBytes: number;
  percentage: number;
  speed?: number;
  estimatedTimeRemaining?: number;
}

export interface UploadResult {
  fileId: string;
  fileName: string;
  success: boolean;
  url?: string;
  error?: string;
  metadata?: AudioMetadata;
}

export interface UploadError {
  fileId?: string;
  fileName?: string;
  type: 'validation' | 'network' | 'server' | 'processing';
  message: string;
  code?: string;
  recoverable: boolean;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  metadata?: AudioMetadata;
}

export interface FileValidationOptions {
  accept?: string[];
  maxFileSize?: number;
  maxFiles?: number;
  maxDuration?: number;
  minDuration?: number;
  allowedSampleRates?: number[];
}

export interface DropzoneState {
  isDragActive: boolean;
  isDragAccept: boolean;
  isDragReject: boolean;
  isFileDialogActive: boolean;
}

export interface AudioUploaderProps {
  // Core functionality
  onUpload?: (files: AudioFile[]) => Promise<UploadResult[]>;
  onProgress?: (progress: UploadProgress[]) => void;
  onError?: (error: UploadError) => void;
  onSuccess?: (results: UploadResult[]) => void;
  onFilesChange?: (files: AudioFile[]) => void;
  
  // Configuration
  accept?: string[];
  maxFiles?: number;
  maxFileSize?: number;
  maxDuration?: number;
  minDuration?: number;
  multiple?: boolean;
  disabled?: boolean;
  
  // UI customization
  className?: string;
  style?: React.CSSProperties;
  showPreview?: boolean;
  showProgress?: boolean;
  showMetadata?: boolean;
  
  // Validation
  validateAudio?: (file: File) => Promise<ValidationResult>;
  
  // Accessibility
  ariaLabel?: string;
  ariaDescribedBy?: string;
  
  // Callbacks
  onDragEnter?: (event: React.DragEvent) => void;
  onDragLeave?: (event: React.DragEvent) => void;
  onClick?: (event: React.MouseEvent) => void;
}

export interface UseAudioUploadOptions {
  onUpload?: (files: AudioFile[]) => Promise<UploadResult[]>;
  onProgress?: (progress: UploadProgress[]) => void;
  onError?: (error: UploadError) => void;
  onSuccess?: (results: UploadResult[]) => void;
  onFilesChange?: (files: AudioFile[]) => void;
  maxFiles?: number;
  maxFileSize?: number;
  accept?: string[];
  validateAudio?: (file: File) => Promise<ValidationResult>;
}

export interface UseAudioUploadReturn {
  // State
  files: AudioFile[];
  isUploading: boolean;
  progress: UploadProgress[];
  errors: UploadError[];
  canAddMore: boolean;
  
  // Actions
  addFiles: (files: File[]) => Promise<void>;
  removeFile: (id: string) => void;
  startUpload: () => Promise<void>;
  cancelUpload: () => void;
  retryFailedUploads: () => Promise<void>;
  clearAll: () => void;
}

export interface UseDropzoneOptions {
  onDrop: (files: File[]) => void;
  accept?: string[];
  multiple?: boolean;
  disabled?: boolean;
  maxFiles?: number;
  noClick?: boolean;
  noKeyboard?: boolean;
}

export interface UseDropzoneReturn {
  // State
  isDragActive: boolean;
  isDragAccept: boolean;
  isDragReject: boolean;
  isFileDialogActive: boolean;
  
  // Props for elements
  getRootProps: () => {
    onDragEnter: (event: React.DragEvent) => void;
    onDragLeave: (event: React.DragEvent) => void;
    onDragOver: (event: React.DragEvent) => void;
    onDrop: (event: React.DragEvent) => void;
    onClick: (event: React.MouseEvent) => void;
    onKeyDown: (event: React.KeyboardEvent) => void;
    tabIndex: number;
    role: string;
    'aria-label': string;
    ref: React.RefObject<HTMLDivElement>;
  };
  getInputProps: () => {
    type: 'file';
    multiple: boolean;
    accept: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    ref: React.RefObject<HTMLInputElement>;
    style: { display: 'none' };
  };
  
  // Actions
  openFileDialog: () => void;
}

export interface UseFileValidationOptions {
  accept?: string[];
  maxFileSize?: number;
  maxFiles?: number;
  maxDuration?: number;
  minDuration?: number;
  customValidator?: (file: File) => Promise<ValidationResult>;
}

export interface UseFileValidationReturn {
  validateFiles: (files: File[]) => Promise<ValidationResult[]>;
  validateSingleFile: (file: File) => Promise<ValidationResult>;
  isValidAudioFile: (file: File) => boolean;
  getAudioMetadata: (file: File) => Promise<AudioMetadata | null>;
}

// Audio format constants
export const AUDIO_MIME_TYPES = {
  'audio/mp3': ['.mp3'],
  'audio/mpeg': ['.mp3', '.mpeg'],
  'audio/wav': ['.wav'],
  'audio/wave': ['.wav'],
  'audio/aac': ['.aac'],
  'audio/mp4': ['.m4a', '.mp4'],
  'audio/x-m4a': ['.m4a'],
  'audio/ogg': ['.ogg'],
  'audio/flac': ['.flac'],
  'audio/x-ms-wma': ['.wma']
} as const;

export const DEFAULT_AUDIO_ACCEPT = Object.keys(AUDIO_MIME_TYPES);

export const DEFAULT_MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB
export const DEFAULT_MAX_FILES = 10;
export const DEFAULT_MAX_DURATION = 10 * 60; // 10 minutes
export const DEFAULT_MIN_DURATION = 1; // 1 second