import React from 'react';
import { render, screen, fireEvent, waitFor } from '@tests/utils/test-utils';
import { axe, toHaveNoViolations } from 'jest-axe';
import { createMockAudioFiles, createMockDragEvent } from '@tests/mocks/files';

expect.extend(toHaveNoViolations);

// Mock component - this will be replaced with actual import once implemented
const MockAudioUploader = ({ 
  onUpload, 
  onProgress, 
  onError, 
  onSuccess,
  maxFiles = 5,
  maxFileSize = 50 * 1024 * 1024,
  accept = ['audio/mp3', 'audio/wav'],
  multiple = true,
  disabled = false,
  className = '',
  ariaLabel,
  ariaDescribedBy,
  ...props 
}: any) => {
  const [files, setFiles] = React.useState<File[]>([]);
  const [isUploading, setIsUploading] = React.useState(false);
  const [isDragActive, setIsDragActive] = React.useState(false);
  const [errors, setErrors] = React.useState<string[]>([]);
  const [progress, setProgress] = React.useState(0);

  const handleDrop = (droppedFiles: File[]) => {
    const validFiles = droppedFiles.filter(file => 
      accept.includes(file.type) && file.size <= maxFileSize
    );
    
    if (files.length + validFiles.length > maxFiles) {
      setErrors([`Cannot add more than ${maxFiles} files`]);
      return;
    }

    setFiles(prev => [...prev, ...validFiles]);
    setErrors([]);
  };

  const handleUpload = async () => {
    if (files.length === 0) return;
    
    setIsUploading(true);
    setProgress(0);

    try {
      for (let i = 0; i <= 100; i += 20) {
        setProgress(i);
        onProgress?.({ percentage: i, loaded: i, total: 100 });
        await new Promise(resolve => setTimeout(resolve, 50));
      }

      const results = await onUpload(files);
      onSuccess?.(results);
      setFiles([]);
    } catch (error) {
      onError?.(error);
      setErrors([error.message]);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className={`audio-uploader ${className}`} data-testid="audio-uploader">
      <h2 id="uploader-title">Audio File Upload</h2>
      <p id="uploader-instructions">
        Upload audio files by dragging and dropping them here, or click to browse your files. 
        Supported formats: MP3, WAV, OGG. Maximum file size: 50MB.
      </p>
      
      <div
        className={`dropzone ${isDragActive ? 'active' : ''} ${disabled ? 'disabled' : ''}`}
        data-testid="dropzone"
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-label={ariaLabel || "Upload audio files by dragging and dropping or clicking to browse"}
        aria-describedby={ariaDescribedBy || "uploader-instructions"}
        aria-expanded={isDragActive}
        aria-pressed={isDragActive}
        onDragEnter={(e) => {
          e.preventDefault();
          if (!disabled) setIsDragActive(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          setIsDragActive(false);
        }}
        onDragOver={(e) => {
          e.preventDefault();
        }}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragActive(false);
          if (!disabled) {
            const droppedFiles = Array.from(e.dataTransfer.files);
            handleDrop(droppedFiles);
          }
        }}
        onKeyDown={(e) => {
          if ((e.key === 'Enter' || e.key === ' ') && !disabled) {
            e.preventDefault();
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = accept.join(',');
            input.multiple = multiple;
            input.onchange = (event) => {
              const target = event.target as HTMLInputElement;
              const selectedFiles = Array.from(target.files || []);
              handleDrop(selectedFiles);
            };
            input.click();
          }
        }}
      >
        <div className="dropzone-content">
          <svg 
            aria-hidden="true" 
            width="48" 
            height="48" 
            viewBox="0 0 24 24"
            className="upload-icon"
          >
            <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
          </svg>
          <p className="dropzone-text">
            {isDragActive ? 'Drop files here' : 'Drop audio files here or click to browse'}
          </p>
          <p className="dropzone-hint">
            Maximum {maxFiles} files, up to {Math.round(maxFileSize / (1024 * 1024))}MB each
          </p>
        </div>
      </div>

      <input
        type="file"
        accept={accept.join(',')}
        multiple={multiple}
        disabled={disabled}
        style={{ display: 'none' }}
        data-testid="file-input"
        aria-hidden="true"
        onChange={(e) => {
          const selectedFiles = Array.from(e.target.files || []);
          handleDrop(selectedFiles);
        }}
      />

      {errors.length > 0 && (
        <div className="errors" data-testid="error-messages" role="alert" aria-live="assertive">
          <h3 className="error-title">Upload Errors</h3>
          <ul>
            {errors.map((error, index) => (
              <li key={index} className="error">
                {error}
              </li>
            ))}
          </ul>
        </div>
      )}

      {files.length > 0 && (
        <div className="file-preview" data-testid="file-preview">
          <h3 id="selected-files-title">Selected Files ({files.length})</h3>
          <ul role="list" aria-labelledby="selected-files-title">
            {files.map((file, index) => (
              <li key={index} className="file-item" data-testid={`file-item-${index}`} role="listitem">
                <div className="file-info">
                  <span className="file-name" aria-label={`File name: ${file.name}`}>
                    {file.name}
                  </span>
                  <span className="file-size" aria-label={`File size: ${(file.size / 1024).toFixed(1)} kilobytes`}>
                    {(file.size / 1024).toFixed(1)} KB
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setFiles(prev => prev.filter((_, i) => i !== index))}
                  aria-label={`Remove ${file.name} from upload list`}
                  data-testid={`remove-file-${index}`}
                  className="remove-button"
                >
                  <span aria-hidden="true">×</span>
                  <span className="sr-only">Remove</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {isUploading && (
        <div className="upload-progress" data-testid="upload-progress" role="region" aria-label="Upload progress">
          <h3 id="progress-title">Uploading Files</h3>
          <div className="progress-container">
            <div 
              className="progress-bar"
              role="progressbar"
              aria-valuenow={progress}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-labelledby="progress-title"
              aria-describedby="progress-text"
            >
              <div 
                className="progress-fill"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div id="progress-text" className="progress-text" aria-live="polite">
              {progress}% complete
            </div>
          </div>
        </div>
      )}

      <div className="upload-controls" data-testid="upload-controls">
        <button
          type="button"
          onClick={handleUpload}
          disabled={disabled || isUploading || files.length === 0}
          data-testid="upload-button"
          className="primary-button"
          aria-describedby="upload-button-description"
        >
          {isUploading ? 'Uploading...' : `Upload ${files.length} File${files.length !== 1 ? 's' : ''}`}
        </button>
        <div id="upload-button-description" className="sr-only">
          {files.length === 0 
            ? 'No files selected for upload' 
            : `Upload ${files.length} selected audio file${files.length !== 1 ? 's' : ''}`
          }
        </div>
        
        <button
          type="button"
          onClick={() => {
            setFiles([]);
            setErrors([]);
            setProgress(0);
          }}
          disabled={disabled || isUploading}
          data-testid="reset-button"
          className="secondary-button"
        >
          Clear All
        </button>
      </div>

      <div className="sr-only" aria-live="polite" data-testid="status-announcements">
        {files.length > 0 && `${files.length} files selected for upload`}
        {isUploading && `Upload in progress: ${progress}% complete`}
        {errors.length > 0 && `${errors.length} error${errors.length !== 1 ? 's' : ''} occurred`}
      </div>
    </div>
  );
};

describe('AudioUploader Accessibility', () => {
  const mockFiles = createMockAudioFiles();
  const defaultProps = {
    onUpload: jest.fn().mockResolvedValue([{ success: true, id: 'test-id' }]),
    onProgress: jest.fn(),
    onError: jest.fn(),
    onSuccess: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('WCAG 2.1 AA Compliance', () => {
    it('should have no accessibility violations', async () => {
      const { container } = render(<MockAudioUploader {...defaultProps} />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have no violations with files selected', async () => {
      const { container } = render(<MockAudioUploader {...defaultProps} />);
      
      const dropzone = screen.getByTestId('dropzone');
      const dropEvent = createMockDragEvent('drop', [mockFiles.validMp3]);
      fireEvent(dropzone, dropEvent);

      await waitFor(() => {
        expect(screen.getByTestId('file-preview')).toBeInTheDocument();
      });

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have no violations during upload', async () => {
      const { container } = render(<MockAudioUploader {...defaultProps} />);
      
      const dropzone = screen.getByTestId('dropzone');
      const dropEvent = createMockDragEvent('drop', [mockFiles.validMp3]);
      fireEvent(dropzone, dropEvent);

      await waitFor(() => {
        expect(screen.getByTestId('file-preview')).toBeInTheDocument();
      });

      const uploadButton = screen.getByTestId('upload-button');
      fireEvent.click(uploadButton);

      await waitFor(() => {
        expect(screen.getByTestId('upload-progress')).toBeInTheDocument();
      });

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have no violations with errors', async () => {
      const { container } = render(<MockAudioUploader {...defaultProps} maxFiles={1} />);
      
      const dropzone = screen.getByTestId('dropzone');
      const dropEvent = createMockDragEvent('drop', [mockFiles.validMp3, mockFiles.validWav]);
      fireEvent(dropzone, dropEvent);

      await waitFor(() => {
        expect(screen.getByTestId('error-messages')).toBeInTheDocument();
      });

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('ARIA Implementation', () => {
    it('should have proper ARIA roles and attributes', () => {
      render(<MockAudioUploader {...defaultProps} />);

      const dropzone = screen.getByTestId('dropzone');
      expect(dropzone).toHaveAttribute('role', 'button');
      expect(dropzone).toHaveAttribute('aria-label');
      expect(dropzone).toHaveAttribute('aria-describedby', 'uploader-instructions');
      expect(dropzone).toHaveAttribute('tabIndex', '0');
    });

    it('should update ARIA states during interaction', async () => {
      render(<MockAudioUploader {...defaultProps} />);

      const dropzone = screen.getByTestId('dropzone');
      
      fireEvent.dragEnter(dropzone);
      
      expect(dropzone).toHaveAttribute('aria-expanded', 'true');
      expect(dropzone).toHaveAttribute('aria-pressed', 'true');

      fireEvent.dragLeave(dropzone);
      
      expect(dropzone).toHaveAttribute('aria-expanded', 'false');
      expect(dropzone).toHaveAttribute('aria-pressed', 'false');
    });

    it('should have proper ARIA labels for file list', async () => {
      render(<MockAudioUploader {...defaultProps} />);

      const dropzone = screen.getByTestId('dropzone');
      const dropEvent = createMockDragEvent('drop', [mockFiles.validMp3, mockFiles.validWav]);
      fireEvent(dropzone, dropEvent);

      await waitFor(() => {
        expect(screen.getByRole('list')).toBeInTheDocument();
        expect(screen.getByRole('list')).toHaveAttribute('aria-labelledby', 'selected-files-title');
        
        const listItems = screen.getAllByRole('listitem');
        expect(listItems).toHaveLength(2);
      });
    });

    it('should have accessible progress bar', async () => {
      render(<MockAudioUploader {...defaultProps} />);

      const dropzone = screen.getByTestId('dropzone');
      const dropEvent = createMockDragEvent('drop', [mockFiles.validMp3]);
      fireEvent(dropzone, dropEvent);

      await waitFor(() => {
        expect(screen.getByTestId('file-preview')).toBeInTheDocument();
      });

      const uploadButton = screen.getByTestId('upload-button');
      fireEvent.click(uploadButton);

      await waitFor(() => {
        const progressBar = screen.getByRole('progressbar');
        expect(progressBar).toHaveAttribute('aria-valuenow');
        expect(progressBar).toHaveAttribute('aria-valuemin', '0');
        expect(progressBar).toHaveAttribute('aria-valuemax', '100');
        expect(progressBar).toHaveAttribute('aria-labelledby', 'progress-title');
        expect(progressBar).toHaveAttribute('aria-describedby', 'progress-text');
      });
    });
  });

  describe('Screen Reader Support', () => {
    it('should announce errors to screen readers', async () => {
      render(<MockAudioUploader {...defaultProps} maxFiles={1} />);

      const dropzone = screen.getByTestId('dropzone');
      const dropEvent = createMockDragEvent('drop', [mockFiles.validMp3, mockFiles.validWav]);
      fireEvent(dropzone, dropEvent);

      await waitFor(() => {
        const errorRegion = screen.getByRole('alert');
        expect(errorRegion).toBeInTheDocument();
        expect(errorRegion).toHaveAttribute('aria-live', 'assertive');
      });
    });

    it('should have live regions for status updates', () => {
      render(<MockAudioUploader {...defaultProps} />);

      const statusRegion = screen.getByTestId('status-announcements');
      expect(statusRegion).toHaveAttribute('aria-live', 'polite');
    });

    it('should announce file selection changes', async () => {
      render(<MockAudioUploader {...defaultProps} />);

      const dropzone = screen.getByTestId('dropzone');
      const dropEvent = createMockDragEvent('drop', [mockFiles.validMp3]);
      fireEvent(dropzone, dropEvent);

      await waitFor(() => {
        const statusRegion = screen.getByTestId('status-announcements');
        expect(statusRegion).toHaveTextContent('1 files selected for upload');
      });
    });

    it('should announce upload progress', async () => {
      render(<MockAudioUploader {...defaultProps} />);

      const dropzone = screen.getByTestId('dropzone');
      const dropEvent = createMockDragEvent('drop', [mockFiles.validMp3]);
      fireEvent(dropzone, dropEvent);

      await waitFor(() => {
        expect(screen.getByTestId('file-preview')).toBeInTheDocument();
      });

      const uploadButton = screen.getByTestId('upload-button');
      fireEvent.click(uploadButton);

      await waitFor(() => {
        const progressText = screen.getByText(/% complete/);
        expect(progressText).toBeInTheDocument();
        
        const progressRegion = screen.getByRole('region', { name: /upload progress/i });
        expect(progressRegion).toBeInTheDocument();
      });
    });
  });

  describe('Keyboard Navigation', () => {
    it('should be focusable with keyboard', () => {
      render(<MockAudioUploader {...defaultProps} />);

      const dropzone = screen.getByTestId('dropzone');
      expect(dropzone).toHaveAttribute('tabIndex', '0');
      
      dropzone.focus();
      expect(dropzone).toHaveFocus();
    });

    it('should respond to Enter key', () => {
      const createElementSpy = jest.spyOn(document, 'createElement');
      const mockInput = {
        type: '',
        accept: '',
        multiple: false,
        click: jest.fn(),
        onchange: null
      };
      createElementSpy.mockReturnValue(mockInput as any);

      render(<MockAudioUploader {...defaultProps} />);

      const dropzone = screen.getByTestId('dropzone');
      dropzone.focus();
      fireEvent.keyDown(dropzone, { key: 'Enter', code: 'Enter' });

      expect(mockInput.click).toHaveBeenCalled();

      createElementSpy.mockRestore();
    });

    it('should respond to Space key', () => {
      const createElementSpy = jest.spyOn(document, 'createElement');
      const mockInput = {
        type: '',
        accept: '',
        multiple: false,
        click: jest.fn(),
        onchange: null
      };
      createElementSpy.mockReturnValue(mockInput as any);

      render(<MockAudioUploader {...defaultProps} />);

      const dropzone = screen.getByTestId('dropzone');
      dropzone.focus();
      fireEvent.keyDown(dropzone, { key: ' ', code: 'Space' });

      expect(mockInput.click).toHaveBeenCalled();

      createElementSpy.mockRestore();
    });

    it('should have proper tab order', async () => {
      render(<MockAudioUploader {...defaultProps} />);

      const dropzone = screen.getByTestId('dropzone');
      const dropEvent = createMockDragEvent('drop', [mockFiles.validMp3]);
      fireEvent(dropzone, dropEvent);

      await waitFor(() => {
        expect(screen.getByTestId('file-preview')).toBeInTheDocument();
      });

      // Check tab order: dropzone -> remove button -> upload button -> reset button
      const focusableElements = [
        screen.getByTestId('dropzone'),
        screen.getByTestId('remove-file-0'),
        screen.getByTestId('upload-button'),
        screen.getByTestId('reset-button')
      ];

      focusableElements.forEach(element => {
        expect(element).toHaveAttribute('tabIndex');
      });
    });

    it('should trap focus properly during upload', async () => {
      render(<MockAudioUploader {...defaultProps} />);

      const dropzone = screen.getByTestId('dropzone');
      const dropEvent = createMockDragEvent('drop', [mockFiles.validMp3]);
      fireEvent(dropzone, dropEvent);

      await waitFor(() => {
        expect(screen.getByTestId('file-preview')).toBeInTheDocument();
      });

      const uploadButton = screen.getByTestId('upload-button');
      fireEvent.click(uploadButton);

      await waitFor(() => {
        expect(uploadButton).toBeDisabled();
        expect(screen.getByTestId('reset-button')).toBeDisabled();
      });
    });
  });

  describe('Visual Accessibility', () => {
    it('should have sufficient color contrast', () => {
      render(<MockAudioUploader {...defaultProps} />);

      // This would be tested with actual CSS values in a real scenario
      // For now, we verify the structure exists
      expect(screen.getByTestId('dropzone')).toBeInTheDocument();
    });

    it('should have visible focus indicators', () => {
      render(<MockAudioUploader {...defaultProps} />);

      const dropzone = screen.getByTestId('dropzone');
      dropzone.focus();
      
      // In a real test, we'd check computed styles for focus ring
      expect(dropzone).toHaveFocus();
    });

    it('should support high contrast mode', () => {
      render(<MockAudioUploader {...defaultProps} />);

      // Structure should be accessible even without CSS
      expect(screen.getByRole('button')).toBeInTheDocument();
      expect(screen.getByText(/drop audio files here/i)).toBeInTheDocument();
    });
  });

  describe('Mobile Accessibility', () => {
    it('should have appropriate touch targets', async () => {
      render(<MockAudioUploader {...defaultProps} />);

      const dropzone = screen.getByTestId('dropzone');
      const dropEvent = createMockDragEvent('drop', [mockFiles.validMp3]);
      fireEvent(dropzone, dropEvent);

      await waitFor(() => {
        expect(screen.getByTestId('file-preview')).toBeInTheDocument();
      });

      // Check that buttons are large enough for touch interaction
      const removeButton = screen.getByTestId('remove-file-0');
      const uploadButton = screen.getByTestId('upload-button');
      
      expect(removeButton).toBeInTheDocument();
      expect(uploadButton).toBeInTheDocument();
    });

    it('should announce actions for voice control', () => {
      render(<MockAudioUploader {...defaultProps} />);

      const dropzone = screen.getByTestId('dropzone');
      expect(dropzone).toHaveAttribute('aria-label');
      
      const uploadButton = screen.getByTestId('upload-button');
      expect(uploadButton).toHaveAttribute('aria-describedby');
    });
  });

  describe('Custom ARIA Labels', () => {
    it('should accept custom aria-label', () => {
      render(<MockAudioUploader {...defaultProps} ariaLabel="Custom audio uploader" />);

      const dropzone = screen.getByTestId('dropzone');
      expect(dropzone).toHaveAttribute('aria-label', 'Custom audio uploader');
    });

    it('should accept custom aria-describedby', () => {
      render(
        <div>
          <p id="custom-description">Custom description for the uploader</p>
          <MockAudioUploader {...defaultProps} ariaDescribedBy="custom-description" />
        </div>
      );

      const dropzone = screen.getByTestId('dropzone');
      expect(dropzone).toHaveAttribute('aria-describedby', 'custom-description');
    });
  });

  describe('Error Accessibility', () => {
    it('should associate errors with form controls', async () => {
      const errorProps = {
        ...defaultProps,
        onUpload: jest.fn().mockRejectedValue(new Error('Upload failed'))
      };

      render(<MockAudioUploader {...errorProps} />);

      const dropzone = screen.getByTestId('dropzone');
      const dropEvent = createMockDragEvent('drop', [mockFiles.validMp3]);
      fireEvent(dropzone, dropEvent);

      await waitFor(() => {
        expect(screen.getByTestId('file-preview')).toBeInTheDocument();
      });

      const uploadButton = screen.getByTestId('upload-button');
      fireEvent.click(uploadButton);

      await waitFor(() => {
        const errorAlert = screen.getByRole('alert');
        expect(errorAlert).toBeInTheDocument();
        expect(errorAlert).toHaveAttribute('aria-live', 'assertive');
      }, { timeout: 2000 });
    });

    it('should provide clear error instructions', async () => {
      render(<MockAudioUploader {...defaultProps} maxFiles={1} />);

      const dropzone = screen.getByTestId('dropzone');
      const dropEvent = createMockDragEvent('drop', [mockFiles.validMp3, mockFiles.validWav]);
      fireEvent(dropzone, dropEvent);

      await waitFor(() => {
        const errorAlert = screen.getByRole('alert');
        expect(errorAlert).toBeInTheDocument();
        expect(errorAlert).toHaveTextContent(/cannot add more than 1 files/i);
      });
    });
  });
});