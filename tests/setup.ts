import '@testing-library/jest-dom';
import 'jest-axe/extend-expect';

// Mock File API
global.File = class File extends Blob {
  lastModified: number;
  name: string;
  webkitRelativePath: string;

  constructor(chunks: any[], name: string, options: any = {}) {
    super(chunks, options);
    this.name = name;
    this.lastModified = options.lastModified || Date.now();
    this.webkitRelativePath = '';
  }
};

// Mock FileReader
global.FileReader = class FileReader extends EventTarget {
  result: string | ArrayBuffer | null = null;
  error: DOMException | null = null;
  readyState: number = FileReader.EMPTY;

  static readonly EMPTY = 0;
  static readonly LOADING = 1;
  static readonly DONE = 2;

  readAsDataURL(file: Blob) {
    this.readyState = FileReader.LOADING;
    setTimeout(() => {
      this.result = `data:${file.type};base64,mock-base64-content`;
      this.readyState = FileReader.DONE;
      this.dispatchEvent(new Event('load'));
    }, 10);
  }

  readAsArrayBuffer(file: Blob) {
    this.readyState = FileReader.LOADING;
    setTimeout(() => {
      this.result = new ArrayBuffer(8);
      this.readyState = FileReader.DONE;
      this.dispatchEvent(new Event('load'));
    }, 10);
  }

  readAsText(file: Blob) {
    this.readyState = FileReader.LOADING;
    setTimeout(() => {
      this.result = 'mock file content';
      this.readyState = FileReader.DONE;
      this.dispatchEvent(new Event('load'));
    }, 10);
  }

  abort() {
    this.readyState = FileReader.DONE;
    this.dispatchEvent(new Event('abort'));
  }
};

// Mock URL.createObjectURL
global.URL.createObjectURL = jest.fn(() => 'mock-object-url');
global.URL.revokeObjectURL = jest.fn();

// Mock AudioContext for audio processing tests
global.AudioContext = jest.fn().mockImplementation(() => ({
  close: jest.fn(),
  createBufferSource: jest.fn(),
  createAnalyser: jest.fn(),
  decodeAudioData: jest.fn((buffer) => 
    Promise.resolve({
      duration: 120,
      sampleRate: 44100,
      numberOfChannels: 2,
      length: 44100 * 120
    })
  )
}));

// Mock HTMLMediaElement for audio metadata
Object.defineProperty(HTMLMediaElement.prototype, 'duration', {
  get: () => 120
});

Object.defineProperty(HTMLMediaElement.prototype, 'play', {
  value: jest.fn(() => Promise.resolve())
});

Object.defineProperty(HTMLMediaElement.prototype, 'pause', {
  value: jest.fn()
});

// Mock drag and drop events
class MockDataTransfer implements DataTransfer {
  dropEffect: 'none' | 'copy' | 'link' | 'move' = 'none';
  effectAllowed: 'none' | 'copy' | 'copyLink' | 'copyMove' | 'link' | 'linkMove' | 'move' | 'all' | 'uninitialized' = 'all';
  files: FileList = [] as any;
  items: DataTransferItemList = [] as any;
  types: readonly string[] = [];

  clearData(format?: string): void {}
  getData(format: string): string { return ''; }
  setData(format: string, data: string): void {}
  setDragImage(element: Element, x: number, y: number): void {}
}

global.DataTransfer = MockDataTransfer as any;

// Suppress console errors in tests unless needed
const originalError = console.error;
beforeAll(() => {
  console.error = (...args: any[]) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Warning: ReactDOM.render is no longer supported')
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});