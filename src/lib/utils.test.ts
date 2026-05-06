import { describe, it, expect } from 'vitest'
import { formatIDR } from './utils'

describe('formatIDR', () => {
  const normalize = (str: string) => str.replace(/\u00A0/g, ' ');

  it('formats positive numbers correctly', () => {
    expect(normalize(formatIDR(1500000))).toBe('Rp 1.500.000')
    expect(normalize(formatIDR(5000))).toBe('Rp 5.000')
  })

  it('formats zero correctly', () => {
    expect(normalize(formatIDR(0))).toBe('Rp 0')
  })

  it('handles small amounts', () => {
    expect(normalize(formatIDR(99))).toBe('Rp 99')
  })
})
