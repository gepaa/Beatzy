/**
 * useDropzone Hook
 * Provides comprehensive drag-and-drop functionality with accessibility support,
 * keyboard navigation, and comprehensive event handling for audio file uploads
 */

import { useCallback, useRef, useState, useMemo } from 'react';
import {
  UseDropzoneOptions,
  UseDropzoneReturn,
  AUDIO_MIME_TYPES
} from '../types/audio-upload';

export const useDropzone = (options: UseDropzoneOptions): UseDropzoneReturn => {
  const {
    onDrop,
    accept = Object.keys(AUDIO_MIME_TYPES),
    multiple = true,
    disabled = false,
    maxFiles = 10,
    noClick = false,
    noKeyboard = false
  } = options;

  // Refs for DOM elements
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // State management
  const [isDragActive, setIsDragActive] = useState(false);
  const [isDragAccept, setIsDragAccept] = useState(false);
  const [isDragReject, setIsDragReject] = useState(false);
  const [isFileDialogActive, setIsFileDialogActive] = useState(false);

  // Memoize accepted MIME types for performance
  const acceptedMimeTypes = useMemo(() => new Set(accept), [accept]);
  const acceptString = useMemo(() => accept.join(','), [accept]);

  // Check if dragged files are acceptable
  const checkFileTypes = useCallback((files: FileList | File[]): boolean => {
    const fileArray = Array.from(files);
    return fileArray.every(file => acceptedMimeTypes.has(file.type));
  }, [acceptedMimeTypes]);

  // Handle file selection from input or drag-and-drop
  const handleFiles = useCallback((files: FileList | File[]) => {
    if (disabled) return;
    
    const fileArray = Array.from(files);
    const validFiles = fileArray.filter(file => acceptedMimeTypes.has(file.type));
    
    // Limit number of files if specified
    const filesToProcess = maxFiles ? validFiles.slice(0, maxFiles) : validFiles;
    
    if (filesToProcess.length > 0) {
      onDrop(filesToProcess);
    }
  }, [disabled, acceptedMimeTypes, maxFiles, onDrop]);

  // Drag event handlers
  const onDragEnter = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    
    if (disabled) return;

    setIsDragActive(true);
    
    if (event.dataTransfer?.items && event.dataTransfer.items.length > 0) {
      const files = Array.from(event.dataTransfer.items)
        .filter(item => item.kind === 'file')
        .map(item => item.getAsFile())
        .filter((file): file is File => file !== null);
      
      const areFilesAcceptable = checkFileTypes(files);
      setIsDragAccept(areFilesAcceptable);
      setIsDragReject(!areFilesAcceptable);
    }
  }, [disabled, checkFileTypes]);

  const onDragLeave = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    
    if (disabled) return;

    // Only set drag inactive if we're leaving the dropzone entirely
    if (rootRef.current && !rootRef.current.contains(event.relatedTarget as Node)) {
      setIsDragActive(false);
      setIsDragAccept(false);
      setIsDragReject(false);
    }
  }, [disabled]);

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    
    if (disabled) return;

    // Set the appropriate cursor and drop effect
    event.dataTransfer.dropEffect = isDragAccept ? 'copy' : 'none';
  }, [disabled, isDragAccept]);

  const onDropHandler = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    
    setIsDragActive(false);
    setIsDragAccept(false);
    setIsDragReject(false);
    
    if (disabled) return;

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      handleFiles(files);
    }
  }, [disabled, handleFiles]);

  // Click handler to open file dialog
  const onClickHandler = useCallback((event: React.MouseEvent) => {
    if (disabled || noClick) return;
    
    event.preventDefault();
    event.stopPropagation();
    
    if (inputRef.current) {
      setIsFileDialogActive(true);
      inputRef.current.click();
    }
  }, [disabled, noClick]);

  // Keyboard handler for accessibility
  const onKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (disabled || noKeyboard) return;
    
    // Open file dialog on Enter or Space
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      event.stopPropagation();
      
      if (inputRef.current) {
        setIsFileDialogActive(true);
        inputRef.current.click();
      }
    }
    
    // Handle Escape to cancel any active state
    if (event.key === 'Escape') {
      setIsDragActive(false);
      setIsDragAccept(false);
      setIsDragReject(false);
      setIsFileDialogActive(false);
    }
  }, [disabled, noKeyboard]);

  // Handle file input change
  const onInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setIsFileDialogActive(false);
    
    const files = event.target.files;
    if (files && files.length > 0) {
      handleFiles(files);
    }
    
    // Reset input value to allow selecting the same file again
    if (event.target) {
      event.target.value = '';
    }
  }, [handleFiles]);

  // Function to programmatically open file dialog
  const openFileDialog = useCallback(() => {
    if (disabled || !inputRef.current) return;
    
    setIsFileDialogActive(true);
    inputRef.current.click();
  }, [disabled]);

  // Props for the root dropzone element
  const getRootProps = useCallback(() => ({
    onDragEnter,
    onDragLeave,
    onDragOver,
    onDrop: onDropHandler,
    onClick: onClickHandler,
    onKeyDown,
    tabIndex: disabled ? -1 : 0,
    role: 'button',
    'aria-label': `Upload audio files. ${multiple ? 'You can select multiple files.' : 'You can select one file.'} Drag and drop files here or click to browse.`,
    ref: rootRef
  }), [
    onDragEnter,
    onDragLeave,
    onDragOver,
    onDropHandler,
    onClickHandler,
    onKeyDown,
    disabled,
    multiple
  ]);

  // Props for the hidden file input element
  const getInputProps = useCallback(() => ({
    type: 'file' as const,
    multiple,
    accept: acceptString,
    onChange: onInputChange,
    ref: inputRef,
    style: { display: 'none' } as const
  }), [multiple, acceptString, onInputChange]);

  return {
    // State
    isDragActive,
    isDragAccept,
    isDragReject,
    isFileDialogActive,
    
    // Props getters
    getRootProps,
    getInputProps,
    
    // Actions
    openFileDialog
  };
};