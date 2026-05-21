'use server'

import { prisma } from '@/lib/prisma'
import { CreateNotificationInput } from '@/types/notification'

/**
 * Creates a new notification for a user.
 * This should be called from other server actions (booking, payment, etc.)
 */
export async function createNotification(input: CreateNotificationInput) {
  try {
    await prisma.notification.create({
      data: {
        user_id: input.user_id,
        title: input.title,
        message: input.message,
        type: input.type,
        is_read: false,
        link: input.link
      }
    })
    return true
  } catch (error) {
    console.error('CREATE NOTIFICATION ERROR:', error)
    // We don't necessarily want to throw and break the main flow (e.g. booking) 
    // if a notification fails to be created, but logging it is important.
    return null
  }
}
