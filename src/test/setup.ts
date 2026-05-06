import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock Prisma
vi.mock('@/lib/db', () => ({
  prisma: {
    notification: {
      create: vi.fn(),
      update: vi.fn(),
    },
    order: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
  },
}))

// Mock Next-Auth
vi.mock('@/auth', () => ({
  auth: vi.fn(),
}))
