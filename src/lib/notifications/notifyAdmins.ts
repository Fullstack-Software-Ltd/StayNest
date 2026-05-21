import { prisma } from '@/lib/prisma'
import { createNotification } from './createNotification'
import { NotificationType } from '@/types/notification'

interface AdminNotificationInput {
  title: string
  message: string
  type: NotificationType
  link?: string
}

/**
 * Utility to notify all administrators on the platform.
 * Used for critical events like new property submissions.
 */
export async function notifyAdmins({ title, message, type, link }: AdminNotificationInput) {
  try {
    // 1. Fetch all admin IDs
    const admins = await prisma.profile.findMany({
      where: { role: 'admin' },
      select: { id: true }
    })

    if (!admins || admins.length === 0) {
      console.warn('NO ADMINS FOUND TO NOTIFY')
      return
    }

    // 2. Send notification to each admin
    const notificationPromises = admins.map(admin => 
      createNotification({
        user_id: admin.id,
        title,
        message,
        type,
        link
      })
    )

    await Promise.allSettled(notificationPromises)
  } catch (error) {
    console.error('ERROR NOTIFYING ADMINS:', error)
  }
}
