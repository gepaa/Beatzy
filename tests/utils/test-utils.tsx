import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Custom render function with providers if needed
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };

// User event setup
export const user = userEvent.setup();

// Test utilities
export const waitFor = (callback: () => void | Promise<void>, timeout = 1000) =>
  new Promise<void>((resolve, reject) => {
    const startTime = Date.now();
    const check = async () => {
      try {
        await callback();
        resolve();
      } catch (error) {
        if (Date.now() - startTime >= timeout) {
          reject(error);
        } else {
          setTimeout(check, 10);
        }
      }
    };
    check();
  });

// Accessibility test helper
export const axeTest = async (container: Element) => {
  const { axe, toHaveNoViolations } = await import('jest-axe');
  expect.extend(toHaveNoViolations);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
};

// Performance measurement utility
export const measurePerformance = async (
  callback: () => Promise<void> | void
): Promise<number> => {
  const start = performance.now();
  await callback();
  return performance.now() - start;
};

// Memory usage tracking
export const trackMemoryUsage = () => {
  const initial = (performance as any).memory?.usedJSHeapSize || 0;
  
  return {
    getUsage: () => {
      const current = (performance as any).memory?.usedJSHeapSize || 0;
      return current - initial;
    }
  };
};

// Drag and drop test helpers
export const simulateDragEnter = (
  element: Element,
  files: File[] = []
) => {
  const event = new DragEvent('dragenter', {
    bubbles: true,
    cancelable: true,
    dataTransfer: new DataTransfer()
  });
  
  // Mock the dataTransfer.files
  Object.defineProperty(event.dataTransfer, 'files', {
    value: files,
    enumerable: true
  });
  
  element.dispatchEvent(event);
  return event;
};

export const simulateDragOver = (
  element: Element,
  files: File[] = []
) => {
  const event = new DragEvent('dragover', {
    bubbles: true,
    cancelable: true,
    dataTransfer: new DataTransfer()
  });
  
  Object.defineProperty(event.dataTransfer, 'files', {
    value: files,
    enumerable: true
  });
  
  element.dispatchEvent(event);
  return event;
};

export const simulateDragLeave = (element: Element) => {
  const event = new DragEvent('dragleave', {
    bubbles: true,
    cancelable: true
  });
  
  element.dispatchEvent(event);
  return event;
};

export const simulateDrop = (
  element: Element,
  files: File[]
) => {
  const event = new DragEvent('drop', {
    bubbles: true,
    cancelable: true,
    dataTransfer: new DataTransfer()
  });
  
  Object.defineProperty(event.dataTransfer, 'files', {
    value: files,
    enumerable: true
  });
  
  element.dispatchEvent(event);
  return event;
};

// Mock intersection observer for lazy loading tests
export const mockIntersectionObserver = () => {
  const mockIntersectionObserver = jest.fn();
  mockIntersectionObserver.mockReturnValue({
    observe: () => null,
    unobserve: () => null,
    disconnect: () => null
  });
  window.IntersectionObserver = mockIntersectionObserver;
};

// Mock resize observer for responsive tests
export const mockResizeObserver = () => {
  global.ResizeObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
  }));
};

// Test data generators
export const generateMockUploadProgress = (percentage: number = 50) => ({
  loaded: percentage,
  total: 100,
  percentage,
  speed: 1024 * 1024, // 1MB/s
  estimated: (100 - percentage) / 10, // seconds
  startTime: Date.now() - 1000,
});

export const generateMockUploadResult = (success: boolean = true) => ({
  id: 'test-upload-id',
  success,
  url: success ? 'https://example.com/uploaded-file.mp3' : undefined,
  error: success ? undefined : new Error('Upload failed'),
  metadata: {
    duration: 120,
    size: 1024 * 1024,
    format: 'mp3',
    sampleRate: 44100,
    channels: 2
  }
});