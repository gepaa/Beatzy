export const createMockFile = (
  name: string,
  size: number = 1024,
  type: string = 'audio/mp3',
  lastModified: number = Date.now()
): File => {
  const content = new Array(size).fill('a').join('');
  const file = new File([content], name, {
    type,
    lastModified
  });
  
  // Add custom properties for testing
  Object.defineProperty(file, 'size', { value: size });
  
  return file;
};

export const createMockAudioFiles = () => ({
  validMp3: createMockFile('test.mp3', 1024 * 1024, 'audio/mp3'),
  validWav: createMockFile('test.wav', 2048 * 1024, 'audio/wav'),
  validOgg: createMockFile('test.ogg', 512 * 1024, 'audio/ogg'),
  validFlac: createMockFile('test.flac', 4096 * 1024, 'audio/flac'),
  validM4a: createMockFile('test.m4a', 1536 * 1024, 'audio/mp4'),
  
  // Invalid files
  invalidType: createMockFile('test.txt', 1024, 'text/plain'),
  tooLarge: createMockFile('large.mp3', 100 * 1024 * 1024 + 1, 'audio/mp3'),
  emptyFile: createMockFile('empty.mp3', 0, 'audio/mp3'),
  
  // Edge cases
  noExtension: createMockFile('noext', 1024, 'audio/mp3'),
  specialChars: createMockFile('test file [special] (chars).mp3', 1024, 'audio/mp3'),
  longName: createMockFile('a'.repeat(255) + '.mp3', 1024, 'audio/mp3'),
});

export const createMockFileList = (files: File[]): FileList => {
  const fileList = files as any;
  fileList.length = files.length;
  fileList.item = (index: number) => files[index] || null;
  return fileList;
};

export const createMockDataTransfer = (files: File[]) => ({
  files: createMockFileList(files),
  items: [],
  types: ['Files'],
  dropEffect: 'copy' as const,
  effectAllowed: 'all' as const,
  clearData: jest.fn(),
  getData: jest.fn(),
  setData: jest.fn(),
  setDragImage: jest.fn()
});

export const createMockDragEvent = (
  type: string,
  files: File[] = []
): DragEvent => {
  const event = new Event(type) as any;
  event.dataTransfer = createMockDataTransfer(files);
  event.preventDefault = jest.fn();
  event.stopPropagation = jest.fn();
  return event;
};

export const audioMimeTypes = [
  'audio/mp3',
  'audio/mpeg',
  'audio/wav',
  'audio/wave',
  'audio/ogg',
  'audio/oga',
  'audio/mp4',
  'audio/m4a',
  'audio/x-m4a',
  'audio/flac',
  'audio/aac',
  'audio/x-ms-wma'
];

export const invalidMimeTypes = [
  'image/jpeg',
  'image/png',
  'video/mp4',
  'text/plain',
  'application/pdf',
  'application/zip'
];