# AudioUploader Component - API Documentation

## Overview

A comprehensive React component for audio file upload with drag-and-drop functionality, built with modern hooks and full accessibility support.

## Quick Start

```tsx
import { AudioUploader } from '../src/components/AudioUploader';

function App() {
  const handleUpload = async (files) => {
    // Your upload implementation
    return files.map(file => ({ 
      fileId: file.id, 
      success: true, 
      url: 'upload-url' 
    }));
  };

  return (
    <AudioUploader
      onUpload={handleUpload}
      maxFiles={5}
      maxFileSize={50 * 1024 * 1024} // 50MB
      acceptedFormats={['mp3', 'wav', 'aac']}
    />
  );
}
```

## Props API

### AudioUploaderProps

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `onUpload` | `(files: AudioFile[]) => Promise<UploadResult[]>` | **Required** | Upload handler function |
| `maxFiles` | `number` | `10` | Maximum number of files allowed |
| `maxFileSize` | `number` | `100MB` | Maximum file size in bytes |
| `acceptedFormats` | `AudioFormat[]` | All formats | Accepted audio formats |
| `showProgress` | `boolean` | `true` | Show upload progress |
| `showMetadata` | `boolean` | `true` | Display audio metadata |
| `multiple` | `boolean` | `true` | Allow multiple file selection |
| `disabled` | `boolean` | `false` | Disable the component |
| `className` | `string` | `undefined` | Additional CSS class |
| `dropzoneText` | `string` | Auto-generated | Custom dropzone text |
| `onFileSelect` | `(files: File[]) => void` | `undefined` | File selection callback |
| `onValidationError` | `(errors: ValidationError[]) => void` | `undefined` | Validation error callback |
| `onUploadProgress` | `(progress: UploadProgress) => void` | `undefined` | Upload progress callback |
| `customValidation` | `ValidationFunction` | `undefined` | Custom validation function |

## Types

### AudioFile Interface

```typescript
interface AudioFile {
  id: string;
  file: File;
  metadata: AudioMetadata;
  validation: ValidationResult;
  uploadProgress: number;
  status: 'pending' | 'uploading' | 'completed' | 'error';
  error?: string;
}
```

### AudioMetadata Interface

```typescript
interface AudioMetadata {
  duration: number;
  bitrate?: number;
  sampleRate?: number;
  channels?: number;
  format: string;
  size: number;
}
```

### ValidationResult Interface

```typescript
interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  metadata?: AudioMetadata;
}
```

### UploadResult Interface

```typescript
interface UploadResult {
  fileId: string;
  success: boolean;
  url?: string;
  error?: string;
}
```

## Custom Hooks

### useAudioUpload

Central upload management hook.

```typescript
const {
  files,
  uploadProgress,
  isUploading,
  errors,
  addFiles,
  removeFile,
  uploadFiles,
  cancelUpload,
  retryUpload,
  clearFiles
} = useAudioUpload({
  onUpload,
  maxFiles,
  maxFileSize,
  acceptedFormats,
  customValidation
});
```

### useDropzone

Drag-and-drop functionality with accessibility.

```typescript
const {
  getRootProps,
  getInputProps,
  isDragActive,
  isDragAccept,
  isDragReject,
  open
} = useDropzone({
  accept: { 'audio/*': ['.mp3', '.wav', '.aac'] },
  multiple: true,
  maxFiles: 10,
  onDrop: handleFileDrop,
  onDropRejected: handleDropReject
});
```

### useFileValidation

File validation with audio metadata extraction.

```typescript
const {
  validateFiles,
  validateFile,
  isValidating,
  validationErrors
} = useFileValidation({
  maxFileSize: 50 * 1024 * 1024,
  acceptedFormats: ['mp3', 'wav', 'aac'],
  maxDuration: 600, // 10 minutes
  minDuration: 1,
  customValidation: (file, metadata) => {
    // Custom validation logic
    return { isValid: true, errors: [] };
  }
});
```

## Styling

The component includes responsive CSS with custom properties:

```css
.audio-uploader {
  --primary-color: #007bff;
  --success-color: #28a745;
  --error-color: #dc3545;
  --border-radius: 8px;
  --transition: all 0.2s ease;
}
```

### CSS Custom Properties

| Property | Default | Description |
|----------|---------|-------------|
| `--primary-color` | `#007bff` | Primary theme color |
| `--success-color` | `#28a745` | Success state color |
| `--error-color` | `#dc3545` | Error state color |
| `--warning-color` | `#ffc107` | Warning state color |
| `--border-radius` | `8px` | Border radius for elements |
| `--transition` | `all 0.2s ease` | Default transition |
| `--font-size-base` | `1rem` | Base font size |
| `--spacing-unit` | `0.5rem` | Base spacing unit |

## Accessibility Features

### Keyboard Navigation

- **Tab**: Navigate between interactive elements
- **Enter/Space**: Activate file dialog or remove files
- **Escape**: Cancel drag operation or close dialogs
- **Arrow Keys**: Navigate file list

### Screen Reader Support

- Full ARIA labeling and role definitions
- Live regions for status announcements
- Descriptive text for all interactions
- Progress updates with accessible descriptions

### WCAG 2.1 AA Compliance

- Color contrast ratios meet AA standards
- Focus indicators visible and clear
- Alternative text for all visual elements
- Keyboard accessible functionality

## Usage Examples

### Basic Usage

```tsx
<AudioUploader
  onUpload={handleUpload}
  maxFiles={3}
  acceptedFormats={['mp3', 'wav']}
/>
```

### With Custom Validation

```tsx
<AudioUploader
  onUpload={handleUpload}
  customValidation={(file, metadata) => ({
    isValid: metadata.duration <= 300, // 5 minutes max
    errors: metadata.duration > 300 ? ['File too long'] : []
  })}
/>
```

### With Progress Tracking

```tsx
<AudioUploader
  onUpload={handleUpload}
  onUploadProgress={(progress) => {
    console.log(`Upload ${progress.percentage}% complete`);
  }}
  showProgress={true}
/>
```

### Form Integration

```tsx
import { useForm } from 'react-hook-form';

function AudioForm() {
  const { register, handleSubmit, setValue } = useForm();

  const handleAudioUpload = async (files) => {
    const results = await uploadFiles(files);
    setValue('audioFiles', results.map(r => r.url));
    return results;
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <AudioUploader onUpload={handleAudioUpload} />
      <button type="submit">Submit</button>
    </form>
  );
}
```

## Error Handling

### Validation Errors

```typescript
interface ValidationError {
  code: 'INVALID_TYPE' | 'FILE_TOO_LARGE' | 'TOO_MANY_FILES' | 'CUSTOM';
  message: string;
  file?: File;
}
```

### Common Error Codes

- `INVALID_TYPE`: File format not supported
- `FILE_TOO_LARGE`: File exceeds size limit
- `TOO_MANY_FILES`: Too many files selected
- `DURATION_TOO_LONG`: Audio duration exceeds limit
- `DURATION_TOO_SHORT`: Audio duration below minimum
- `UPLOAD_FAILED`: Upload process failed
- `NETWORK_ERROR`: Network connectivity issue

### Error Recovery

```tsx
<AudioUploader
  onUpload={handleUpload}
  onValidationError={(errors) => {
    errors.forEach(error => {
      toast.error(error.message);
    });
  }}
/>
```

## Performance Optimization

### Memory Management

- Automatic cleanup of audio contexts
- File object URL revocation
- Efficient re-rendering with React.memo

### Large File Handling

- Chunked upload support (implement in onUpload)
- Progress streaming for real-time updates
- Cancel and retry functionality

### Bundle Size

- Tree-shakable exports
- Optional dependencies
- Minimal external dependencies

## Browser Compatibility

| Feature | Chrome | Firefox | Safari | Edge |
|---------|---------|---------|--------|------|
| File API | ✅ | ✅ | ✅ | ✅ |
| Drag & Drop | ✅ | ✅ | ✅ | ✅ |
| Web Audio API | ✅ | ✅ | ✅ | ✅ |
| Audio Formats | ✅ | ✅ | ⚠️ | ✅ |

**Note**: Safari has limited audio format support. Test thoroughly.

## Testing

Run the comprehensive test suite:

```bash
# Unit tests
npm run test:unit

# Integration tests  
npm run test:integration

# Accessibility tests
npm run test:a11y

# All tests with coverage
npm run test:coverage
```

## Troubleshooting

### Common Issues

**Files not uploading**
- Check onUpload function implementation
- Verify network connectivity
- Check browser console for errors

**Drag and drop not working**
- Ensure proper event handlers
- Check for conflicting CSS
- Verify browser drag/drop support

**Accessibility issues**
- Run automated accessibility tests
- Test with screen readers
- Verify keyboard navigation

**Performance problems**
- Check file sizes and quantities
- Monitor memory usage
- Implement chunked uploads for large files

### Debug Mode

Enable debug logging:

```tsx
<AudioUploader
  onUpload={handleUpload}
  debug={true} // Enables console logging
/>
```

## Migration Guide

### From v1.x to v2.x

- `onFileUpload` renamed to `onUpload`
- `allowedTypes` renamed to `acceptedFormats`
- New required TypeScript interfaces

## Contributing

See the main project README for contribution guidelines.

## License

MIT License - see LICENSE file for details.