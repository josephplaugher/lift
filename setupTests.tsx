import '@testing-library/jest-dom'
import { configure } from '@testing-library/react'
import { vi } from 'vitest'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'

// Configure RTL defaults
configure({ asyncUtilTimeout: 3000 })

// Mock browser APIs
window.scrollTo = vi.fn()
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})
global.fetch = vi.fn() as any

// Create a reusable QueryClient for tests
const testQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,         // no retries in tests
      // cacheTime: 0,         // disable cache between tests
    },
  },
})

// A global wrapper for React Testing Library render()
export const TSQTestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <QueryClientProvider client={testQueryClient}>
      {children}
    </QueryClientProvider>
  )
}
