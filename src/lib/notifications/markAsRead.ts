'use server'

import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { revalidatePath } from 'next/cache'

/**
 * Marks a specific notification as read.
 */
export async function markAsRead(notificationId: string) {
  try {
    await prisma.notification.update({
      where: { id: notificationId },
      data: { is_read: true }
    })

    revalidatePath('/notifications')
    return { success: true }
  } catch (error: any) {
    console.error('MARK AS READ ERROR:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Marks all notifications for the current user as read.
 */
export async function markAllAsRead() {
  const session = await auth()
  const userId = session?.user?.id
  if (!userId) return { success: false, error: 'Unauthorized' }

  try {
    await prisma.notification.updateMany({
      where: {
        user_id: userId,
        is_read: false
      },
      data: { is_read: true }
    })

    revalidatePath('/notifications')
    return { success: true }
  } catch (error: any) {
    console.error('MARK ALL AS READ ERROR:', error)
    return { success: false, error: error.message }
  }
}
