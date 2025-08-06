# Audio Upload Component - Test Suite

This directory contains comprehensive tests for the React audio upload component with drag-and-drop functionality.

## Test Structure

```
tests/
├── hooks/                          # Hook unit tests
│   ├── useAudioUpload.test.ts      # Main upload logic hook
│   ├── useDropzone.test.ts         # Drag-and-drop functionality
│   └── useFileValidation.test.ts   # File validation logic
├── components/                     # Component tests
│   └── AudioUploader.test.tsx      # Main component integration tests
├── accessibility/                  # Accessibility tests
│   └── AudioUploader.a11y.test.tsx # WCAG compliance and a11y tests
├── mocks/                          # Test mocks and utilities
│   └── files.ts                    # File mocking utilities
├── utils/                          # Test utilities
│   └── test-utils.tsx              # Testing Library setup and helpers
├── jest.config.js                  # Jest configuration
├── setup.ts                        # Test environment setup
└── package.json                    # Test dependencies
```

## Running Tests

### All Tests
```bash
npm test
```

### Watch Mode
```bash
npm run test:watch
```

### Coverage Report
```bash
npm run test:coverage
```

### Specific Test Categories
```bash
# Hook tests only
npm run test:hooks

# Component tests only
npm run test:components

# Accessibility tests only
npm run test:accessibility
```

### CI/CD Mode
```bash
npm run test:ci
```

## Test Categories

### 1. Hook Unit Tests

#### useAudioUpload Hook
- Initial state management
- File addition and removal
- Upload process orchestration
- Progress tracking
- Error handling
- State reset functionality
- Edge cases and validation

#### useDropzone Hook
- Drag-and-drop event handling
- File dialog integration
- State management (drag active, accept, reject)
- Accessibility props generation
- Keyboard navigation support
- Configuration options

#### useFileValidation Hook
- MIME type validation
- File size validation
- Audio file detection
- Metadata extraction
- Custom validation support
- Batch validation
- Error reporting

### 2. Component Integration Tests

#### AudioUploader Component
- Complete user interaction flows
- File selection via drag-and-drop
- File selection via file dialog
- Upload process with progress tracking
- Error handling and display
- File preview and management
- Reset functionality
- Keyboard navigation
- Props and configuration options

### 3. Accessibility Tests

#### WCAG 2.1 AA Compliance
- Automated accessibility testing with jest-axe
- ARIA implementation verification
- Screen reader support
- Keyboard navigation
- Focus management
- Color contrast (structural)
- High contrast mode support
- Mobile accessibility

#### Screen Reader Support
- Live regions for status updates
- Error announcements
- Progress announcements
- File selection announcements
- Proper labeling and descriptions

#### Keyboard Navigation
- Tab order verification
- Enter/Space key handling
- Focus indicators
- Focus trapping during uploads
- Disabled state handling

## Test Utilities

### Mock Files
The `tests/mocks/files.ts` provides utilities for creating mock files:

```typescript
import { createMockAudioFiles } from '@tests/mocks/files';

const mockFiles = createMockAudioFiles();
// Returns: { validMp3, validWav, validOgg, invalidType, tooLarge, etc. }
```

### Test Utilities
The `tests/utils/test-utils.tsx` provides enhanced testing utilities:

```typescript
import { render, screen, user, axeTest } from '@tests/utils/test-utils';

// Enhanced render with providers
render(<Component />);

// User event utilities
await user.click(button);

// Accessibility testing
await axeTest(container);
```

### Drag and Drop Testing
Utilities for testing drag-and-drop interactions:

```typescript
import { simulateDrop, simulateDragEnter } from '@tests/utils/test-utils';

simulateDragEnter(element, files);
simulateDrop(element, files);
```

## Coverage Requirements

The test suite maintains high coverage standards:

- **Statements**: >90%
- **Branches**: >90%
- **Functions**: >90%
- **Lines**: >90%

Coverage reports are generated in the `coverage/` directory.

## Test Data and Scenarios

### File Types Tested
- Valid audio files: MP3, WAV, OGG, FLAC, M4A
- Invalid file types: Text, Images, Video
- Edge cases: Empty files, very large files, special characters

### User Scenarios
- Single file upload
- Multiple file upload
- Drag and drop interaction
- File dialog selection
- File removal and management
- Upload progress tracking
- Error handling and recovery
- Accessibility interactions

### Browser Compatibility
Tests are designed to work across modern browsers and include:
- File API compatibility
- Drag and Drop API support
- Web Audio API features
- Progressive enhancement fallbacks

## Performance Testing

### Memory Usage
Tests include memory usage validation to ensure:
- Proper cleanup of file references
- AudioContext management
- No memory leaks during upload

### Load Testing
Scenarios tested include:
- Large file handling (up to 100MB)
- Multiple simultaneous uploads
- Batch file processing
- Progress tracking accuracy

## Error Scenarios

### Validation Errors
- Invalid file types
- Files too large
- Too many files
- Empty file handling

### Upload Errors
- Network failures
- Server errors
- Timeout handling
- Retry mechanisms

### Browser Limitations
- API not supported
- Security restrictions
- File access permissions

## Continuous Integration

The test suite is designed for CI/CD environments:

```bash
# CI mode - no watch, coverage reports
npm run test:ci

# Lint tests
npm run lint:tests

# Type checking
npm run type-check
```

## Testing Best Practices

### Test Organization
- One test file per component/hook
- Descriptive test names
- Grouped by functionality
- Clear arrange-act-assert structure

### Mock Strategy
- Mock external dependencies
- Use real DOM APIs where possible
- Provide realistic test data
- Maintain mock consistency

### Accessibility Testing
- Include automated a11y tests
- Test keyboard navigation
- Verify screen reader compatibility
- Check ARIA implementation

### Performance Considerations
- Test cleanup and memory management
- Validate upload progress accuracy
- Check for unnecessary re-renders
- Monitor test execution time

## Debugging Tests

### Debug Mode
```bash
npm run test:debug
```

### Specific Test Debugging
```bash
# Run specific test file
npx jest hooks/useAudioUpload.test.ts

# Run specific test case
npx jest -t "should handle file upload"

# Verbose output
npx jest --verbose
```

### Common Issues
- File API mocking problems
- Drag and drop event simulation
- Async operation timing
- Memory cleanup verification

## Contributing

When adding new tests:

1. Follow existing naming conventions
2. Include accessibility tests for UI changes
3. Add appropriate mocks for new dependencies
4. Update coverage thresholds if needed
5. Document any new test utilities
6. Ensure cross-browser compatibility

## Dependencies

### Core Testing
- Jest: Test runner and assertion library
- React Testing Library: Component testing utilities
- Jest DOM: Additional DOM matchers

### Accessibility Testing
- jest-axe: Automated accessibility testing
- Testing Library utilities for a11y

### Mocking and Utilities
- User Event: Realistic user interaction simulation
- Custom mocks for File API, AudioContext, etc.

This comprehensive test suite ensures the audio upload component is reliable, accessible, and performant across all supported environments.