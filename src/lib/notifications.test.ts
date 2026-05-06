import { describe, it, expect, vi } from 'vitest'
import { createNotification } from './notifications'
import { prisma } from './db'
import { NotificationType } from '@/generated/prisma/client'

describe('Notification Service', () => {
  it('calls prisma.create with correct data', async () => {
    const mockData = {
      userId: 'user-123',
      type: NotificationType.SYSTEM,
      title: 'Test Title',
      body: 'Test Body',
      link: '/test',
    }

    await createNotification(mockData)

    expect(prisma.notification.create).toHaveBeenCalledWith({
      data: mockData,
    })
  })

  it('logs error when prisma.create fails', async () => {
    vi.mocked(prisma.notification.create).mockRejectedValueOnce(new Error('DB Error'))
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    const result = await createNotification({
      userId: 'fail',
      type: NotificationType.SYSTEM,
      title: 'Fail',
    })

    expect(result).toBeNull()
    expect(consoleSpy).toHaveBeenCalledWith('Failed to create notification:', expect.any(Error))
    
    consoleSpy.mockRestore()
  })
})
