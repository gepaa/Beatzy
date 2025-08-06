/**
 * useAudioUpload Hook
 * Central orchestration hook for audio file upload functionality including
 * file management, validation, progress tracking, and error handling
 */

import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import {
  AudioFile,
  UploadProgress,
  UploadError,
  UseAudioUploadOptions,
  UseAudioUploadReturn
} from '../types/audio-upload';
import { useFileValidation } from './useFileValidation';

export const useAudioUpload = (options: UseAudioUploadOptions = {}): UseAudioUploadReturn => {
  const {
    onUpload,
    onProgress,
    onError,
    onSuccess,
    onFilesChange,
    maxFiles = 10,
    maxFileSize = 100 * 1024 * 1024, // 100MB
    accept = [
      'audio/mp3', 'audio/mpeg', 'audio/wav', 'audio/wave',
      'audio/aac', 'audio/mp4', 'audio/x-m4a', 'audio/ogg', 'audio/flac'
    ],
    validateAudio
  } = options;

  // State management
  const [files, setFiles] = useState<AudioFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState<UploadProgress[]>([]);
  const [errors, setErrors] = useState<UploadError[]>([]);

  // Refs for managing upload operations
  const uploadController = useRef<AbortController | null>(null);
  const fileIdCounter = useRef(0);

  // File validation hook
  const { validateFiles, getAudioMetadata } = useFileValidation({
    accept,
    maxFileSize,
    maxFiles,
    customValidator: validateAudio
  });

  // Generate unique file ID
  const generateFileId = useCallback(() => {
    return `audio-file-${Date.now()}-${++fileIdCounter.current}`;
  }, []);

  // Convert File objects to AudioFile objects
  const createAudioFiles = useCallback(async (fileList: File[]): Promise<AudioFile[]> => {
    const audioFiles: AudioFile[] = [];
    
    for (const file of fileList) {
      const audioFile: AudioFile = {
        id: generateFileId(),
        file,
        name: file.name,
        size: file.size,
        type: file.type,
        status: 'pending',
        progress: 0
      };
      
      // Try to extract metadata
      try {
        const metadata = await getAudioMetadata(file);
        if (metadata) {
          audioFile.metadata = metadata;
        }
      } catch (error) {
        console.warn(`Failed to extract metadata for ${file.name}:`, error);
      }
      
      audioFiles.push(audioFile);
    }
    
    return audioFiles;
  }, [generateFileId, getAudioMetadata]);

  // Add files to the upload queue
  const addFiles = useCallback(async (newFiles: File[]) => {
    if (newFiles.length === 0) return;

    // Clear previous errors
    setErrors([]);

    try {
      // Validate files
      const validationResults = await validateFiles(newFiles);
      const validFiles: File[] = [];
      const validationErrors: UploadError[] = [];

      validationResults.forEach((result, index) => {
        const file = newFiles[index];
        if (result.isValid) {
          validFiles.push(file);
        } else {
          validationErrors.push({
            fileName: file.name,
            type: 'validation',
            message: result.errors.join('; '),
            recoverable: false
          });
        }
      });

      // Add validation errors
      if (validationErrors.length > 0) {
        setErrors(prev => [...prev, ...validationErrors]);
        validationErrors.forEach(error => onError?.(error));
      }

      // Create AudioFile objects for valid files
      if (validFiles.length > 0) {
        const audioFiles = await createAudioFiles(validFiles);
        
        setFiles(prev => {
          // Check if adding these files would exceed maxFiles
          const totalFiles = prev.length + audioFiles.length;
          if (totalFiles > maxFiles) {
            const allowedCount = Math.max(0, maxFiles - prev.length);
            const allowedFiles = audioFiles.slice(0, allowedCount);
            const rejectedFiles = audioFiles.slice(allowedCount);
            
            // Add errors for rejected files
            const rejectionErrors: UploadError[] = rejectedFiles.map(file => ({
              fileId: file.id,
              fileName: file.name,
              type: 'validation',
              message: `Maximum number of files (${maxFiles}) exceeded.`,
              recoverable: false
            }));
            
            setErrors(prevErrors => [...prevErrors, ...rejectionErrors]);
            rejectionErrors.forEach(error => onError?.(error));
            
            const newFileList = [...prev, ...allowedFiles];
            onFilesChange?.(newFileList);
            return newFileList;
          }
          
          const newFileList = [...prev, ...audioFiles];
          onFilesChange?.(newFileList);
          return newFileList;
        });
      }
    } catch (error) {
      const uploadError: UploadError = {
        type: 'processing',
        message: 'Failed to process uploaded files.',
        recoverable: true
      };
      setErrors(prev => [...prev, uploadError]);
      onError?.(uploadError);
    }
  }, [validateFiles, createAudioFiles, maxFiles, onError, onFilesChange]);

  // Remove a file from the upload queue
  const removeFile = useCallback((id: string) => {
    setFiles(prev => {
      const newFiles = prev.filter(file => file.id !== id);
      onFilesChange?.(newFiles);
      return newFiles;
    });
    
    // Remove associated progress and errors
    setProgress(prev => prev.filter(p => p.fileId !== id));
    setErrors(prev => prev.filter(e => e.fileId !== id));
  }, [onFilesChange]);

  // Update file status
  const updateFileStatus = useCallback((fileId: string, status: AudioFile['status'], error?: string) => {
    setFiles(prev => prev.map(file => 
      file.id === fileId 
        ? { ...file, status, error }
        : file
    ));
  }, []);

  // Update file progress
  const updateFileProgress = useCallback((fileId: string, progressValue: number) => {
    setFiles(prev => prev.map(file => 
      file.id === fileId 
        ? { ...file, progress: progressValue }
        : file
    ));

    setProgress(prev => {
      const existingIndex = prev.findIndex(p => p.fileId === fileId);
      const file = files.find(f => f.id === fileId);
      
      if (!file) return prev;

      const progressItem: UploadProgress = {
        fileId,
        fileName: file.name,
        bytesUploaded: Math.floor((file.size * progressValue) / 100),
        totalBytes: file.size,
        percentage: progressValue
      };

      if (existingIndex >= 0) {
        const newProgress = [...prev];
        newProgress[existingIndex] = progressItem;
        return newProgress;
      } else {
        return [...prev, progressItem];
      }
    });
  }, [files]);

  // Start upload process
  const startUpload = useCallback(async () => {
    if (!onUpload || files.length === 0 || isUploading) return;

    setIsUploading(true);
    uploadController.current = new AbortController();

    try {
      // Update all files to uploading status
      const uploadingFiles = files.map(file => ({ ...file, status: 'uploading' as const }));
      setFiles(uploadingFiles);

      // Simulate progress updates (replace with actual upload logic)
      const results = await onUpload(uploadingFiles);
      
      // Update files based on results
      results.forEach(result => {
        if (result.success) {
          updateFileStatus(result.fileId, 'complete');
          updateFileProgress(result.fileId, 100);
        } else {
          updateFileStatus(result.fileId, 'error', result.error);
          const error: UploadError = {
            fileId: result.fileId,
            fileName: result.fileName,
            type: 'server',
            message: result.error || 'Upload failed',
            recoverable: true
          };
          setErrors(prev => [...prev, error]);
          onError?.(error);
        }
      });

      onSuccess?.(results);
    } catch (error) {
      // Handle upload failure
      files.forEach(file => {
        updateFileStatus(file.id, 'error', 'Upload failed');
      });

      const uploadError: UploadError = {
        type: 'network',
        message: error instanceof Error ? error.message : 'Upload failed',
        recoverable: true
      };
      setErrors(prev => [...prev, uploadError]);
      onError?.(uploadError);
    } finally {
      setIsUploading(false);
      uploadController.current = null;
    }
  }, [onUpload, files, isUploading, updateFileStatus, updateFileProgress, onSuccess, onError]);

  // Cancel upload
  const cancelUpload = useCallback(() => {
    if (uploadController.current) {
      uploadController.current.abort();
      uploadController.current = null;
    }
    
    setIsUploading(false);
    
    // Reset uploading files to pending
    setFiles(prev => prev.map(file => 
      file.status === 'uploading' 
        ? { ...file, status: 'pending', progress: 0 }
        : file
    ));
    
    // Clear progress
    setProgress([]);
  }, []);

  // Retry failed uploads
  const retryFailedUploads = useCallback(async () => {
    const failedFiles = files.filter(file => file.status === 'error');
    if (failedFiles.length === 0) return;

    // Reset failed files to pending
    setFiles(prev => prev.map(file => 
      file.status === 'error' 
        ? { ...file, status: 'pending', progress: 0, error: undefined }
        : file
    ));

    // Clear errors for failed files
    setErrors(prev => prev.filter(error => 
      !failedFiles.some(file => file.id === error.fileId)
    ));

    // Start upload for failed files
    await startUpload();
  }, [files, startUpload]);

  // Clear all files and reset state
  const clearAll = useCallback(() => {
    cancelUpload();
    setFiles([]);
    setProgress([]);
    setErrors([]);
    onFilesChange?.([]);
  }, [cancelUpload, onFilesChange]);

  // Check if more files can be added
  const canAddMore = useMemo(() => {
    return files.length < maxFiles && !isUploading;
  }, [files.length, maxFiles, isUploading]);

  // Notify about progress changes
  useEffect(() => {
    if (progress.length > 0) {
      onProgress?.(progress);
    }
  }, [progress, onProgress]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (uploadController.current) {
        uploadController.current.abort();
      }
    };
  }, []);

  return {
    // State
    files,
    isUploading,
    progress,
    errors,
    canAddMore,
    
    // Actions
    addFiles,
    removeFile,
    startUpload,
    cancelUpload,
    retryFailedUploads,
    clearAll
  };
};