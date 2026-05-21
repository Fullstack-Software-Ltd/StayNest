'use server'

import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { revalidatePath } from 'next/cache'

export async function updatePayoutMethod(data: {
  payout_method: string
  payout_momo_number?: string
  payout_momo_provider?: string
}) {
  const session = await auth()
  if (!session?.user) return { success: false, error: 'Unauthorized' }

  try {
    await prisma.profile.update({
      where: { id: session.user.id },
      data: {
        payout_method: data.payout_method,
        payout_momo_number: data.payout_momo_number,
        payout_momo_provider: data.payout_momo_provider
      }
    })
    revalidatePath('/owner/earnings')
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function requestWithdrawal(amount: number) {
  const session = await auth()
  if (!session?.user) return { success: false, error: 'Unauthorized' }

  try {
    const profile = await prisma.profile.findUnique({
      where: { id: session.user.id }
    })

    if (!profile) throw new Error("Profile not found")

    await prisma.payoutRequest.create({
      data: {
        user_id: session.user.id,
        amount,
        method: profile.payout_method || 'none',
        details: {
          momo_number: profile.payout_momo_number,
          momo_provider: profile.payout_momo_provider,
          stripe_id: profile.stripe_connect_id,
          hosting_business: profile.hosting_business_name
        }
      }
    })

    // Create a notification for the host
    await prisma.notification.create({
      data: {
        user_id: session.user.id,
        title: "Withdrawal Requested",
        message: `Your request for $${amount} has been received and is being processed.`,
        type: "payment"
      }
    })

    revalidatePath('/owner/earnings')
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}
