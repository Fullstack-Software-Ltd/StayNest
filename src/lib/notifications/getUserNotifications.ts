'use server'

import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { Notification } from '@/types/notification'

/**
 * Fetches notifications and unread count for the currently authenticated user in a single request or combined logic.
 */
export async function getNotificationUpdate(limit = 20): Promise<{ notifications: Notification[], unreadCount: number }> {
  try {
    const session = await auth()
    const userId = session?.user?.id
    if (!userId) return { notifications: [], unreadCount: 0 }

    // Execution (Parallel fetching for better performance)
    const [notifications, unreadCount] = await Promise.all([
      prisma.notification.findMany({
        where: { user_id: userId },
        select: {
          id: true,
          title: true,
          message: true,
          type: true,
          is_read: true,
          link: true,
          created_at: true
        },
        orderBy: {
          created_at: 'desc'
        },
        take: limit
      }),
      prisma.notification.count({
        where: {
          user_id: userId,
          is_read: false
        }
      })
    ])

    return {
      notifications: notifications as any[],
      unreadCount: unreadCount || 0
    }
  } catch (error: any) {
    console.error('CRITICAL NOTIFICATION FETCH FAILURE:', error?.message || error)
    return { notifications: [], unreadCount: 0 }
  }
}

/**
 * Legacy support for individual fetches, now calling the optimized combined version or similar logic.
 */
export async function getUserNotifications(limit = 20): Promise<Notification[]> {
  const { notifications } = await getNotificationUpdate(limit)
  return notifications
}

export async function getUnreadCount(): Promise<number> {
  const { unreadCount } = await getNotificationUpdate(1) // Limit 1 as we only need count
  return unreadCount
}
