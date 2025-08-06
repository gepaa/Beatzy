/**
 * useFileValidation Hook
 * Provides comprehensive file validation for audio files including MIME type,
 * size, duration, and content validation with accessibility support
 */

import { useCallback, useMemo } from 'react';
import {
  ValidationResult,
  AudioMetadata,
  UseFileValidationOptions,
  UseFileValidationReturn,
  AUDIO_MIME_TYPES,
  DEFAULT_MAX_FILE_SIZE,
  DEFAULT_MAX_DURATION,
  DEFAULT_MIN_DURATION
} from '../types/audio-upload';

export const useFileValidation = (options: UseFileValidationOptions = {}): UseFileValidationReturn => {
  const {
    accept = Object.keys(AUDIO_MIME_TYPES),
    maxFileSize = DEFAULT_MAX_FILE_SIZE,
    maxFiles = 10,
    maxDuration = DEFAULT_MAX_DURATION,
    minDuration = DEFAULT_MIN_DURATION,
    customValidator
  } = options;

  // Memoize accepted MIME types for performance
  const acceptedMimeTypes = useMemo(() => new Set(accept), [accept]);

  // Check if file type is a valid audio file
  const isValidAudioFile = useCallback((file: File): boolean => {
    if (!file.type) {
      // If no MIME type, check file extension
      const extension = file.name.toLowerCase().match(/\.[^.]+$/)?.[0];
      if (!extension) return false;
      
      return Object.values(AUDIO_MIME_TYPES).some(extensions => 
        (extensions as unknown as string[]).includes(extension)
      );
    }
    
    return acceptedMimeTypes.has(file.type);
  }, [acceptedMimeTypes]);

  // Extract audio metadata from file
  const getAudioMetadata = useCallback(async (file: File): Promise<AudioMetadata | null> => {
    return new Promise((resolve) => {
      try {
        const audio = new Audio();
        const url = URL.createObjectURL(file);
        
        const cleanup = () => {
          URL.revokeObjectURL(url);
          audio.removeEventListener('loadedmetadata', onLoadedMetadata);
          audio.removeEventListener('error', onError);
        };

        const onLoadedMetadata = () => {
          const metadata: AudioMetadata = {
            duration: audio.duration,
            format: file.type || 'unknown'
          };
          
          cleanup();
          resolve(metadata);
        };

        const onError = () => {
          cleanup();
          resolve(null);
        };

        audio.addEventListener('loadedmetadata', onLoadedMetadata);
        audio.addEventListener('error', onError);
        audio.src = url;
      } catch (error) {
        console.warn('Failed to extract audio metadata:', error);
        resolve(null);
      }
    });
  }, []);

  // Validate a single file
  const validateSingleFile = useCallback(async (file: File): Promise<ValidationResult> => {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Check file type
    if (!isValidAudioFile(file)) {
      errors.push(`File type "${file.type || 'unknown'}" is not supported. Please upload audio files only.`);
    }

    // Check file size
    if (file.size > maxFileSize) {
      const maxSizeMB = Math.round(maxFileSize / (1024 * 1024));
      const fileSizeMB = Math.round(file.size / (1024 * 1024));
      errors.push(`File size (${fileSizeMB}MB) exceeds maximum allowed size (${maxSizeMB}MB).`);
    }

    // Check if file is empty
    if (file.size === 0) {
      errors.push('File appears to be empty or corrupted.');
    }

    let metadata: AudioMetadata | null = null;
    
    // If basic validation passes, check audio-specific properties
    if (errors.length === 0) {
      try {
        metadata = await getAudioMetadata(file);
        
        if (metadata) {
          // Check duration if available
          if (metadata.duration !== undefined) {
            if (metadata.duration > maxDuration) {
              const maxMinutes = Math.floor(maxDuration / 60);
              const maxSeconds = maxDuration % 60;
              const fileMinutes = Math.floor(metadata.duration / 60);
              const fileSeconds = Math.floor(metadata.duration % 60);
              errors.push(
                `Audio duration (${fileMinutes}:${fileSeconds.toString().padStart(2, '0')}) ` +
                `exceeds maximum allowed duration (${maxMinutes}:${maxSeconds.toString().padStart(2, '0')}).`
              );
            }
            
            if (metadata.duration < minDuration) {
              errors.push(`Audio duration is too short. Minimum duration is ${minDuration} second(s).`);
            }
          }
        } else {
          warnings.push('Unable to extract audio metadata. File may be corrupted or in an unsupported format.');
        }
      } catch (error) {
        warnings.push('Failed to analyze audio file properties.');
      }
    }

    // Run custom validation if provided
    if (customValidator && errors.length === 0) {
      try {
        const customResult = await customValidator(file);
        errors.push(...customResult.errors);
        warnings.push(...customResult.warnings);
        if (customResult.metadata) {
          metadata = { ...metadata, ...customResult.metadata };
        }
      } catch (error) {
        warnings.push('Custom validation failed.');
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      metadata: metadata || undefined
    };
  }, [
    isValidAudioFile,
    maxFileSize,
    maxDuration,
    minDuration,
    customValidator,
    getAudioMetadata
  ]);

  // Validate multiple files
  const validateFiles = useCallback(async (files: File[]): Promise<ValidationResult[]> => {
    const results: ValidationResult[] = [];
    
    // Check file count
    if (files.length > maxFiles) {
      // Create error result for excess files
      for (let i = maxFiles; i < files.length; i++) {
        results.push({
          isValid: false,
          errors: [`Too many files selected. Maximum allowed is ${maxFiles} files.`],
          warnings: []
        });
      }
      // Only validate up to maxFiles
      files = files.slice(0, maxFiles);
    }

    // Validate each file
    const validationPromises = files.map(file => validateSingleFile(file));
    const fileResults = await Promise.all(validationPromises);
    
    return [...fileResults, ...results];
  }, [maxFiles, validateSingleFile]);

  return {
    validateFiles,
    validateSingleFile,
    isValidAudioFile,
    getAudioMetadata
  };
};