import { auth } from '@/auth'
import { stripe } from '@/lib/payments/stripe'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { headers } from 'next/headers'

export async function POST(req: Request) {
  try {
    const session = await auth()
    const userId = session?.user?.id

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 1. Get current profile to check for existing Stripe ID
    const profile = await prisma.profile.findUnique({
      where: { id: userId },
      select: {
        stripe_connect_id: true,
        hosting_business_name: true,
        email: true
      }
    })

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    let stripeAccountId = profile.stripe_connect_id

    // 2. If no account exists, create one in Stripe
    if (!stripeAccountId) {
      const account = await stripe.accounts.create({
        type: 'express',
        email: profile.email,
        capabilities: {
          card_payments: { requested: true },
          transfers: { requested: true },
        },
        business_profile: {
          name: profile.hosting_business_name || undefined,
        },
        metadata: {
          user_id: userId
        }
      })

      stripeAccountId = account.id

      // 3. Save to database immediately
      await prisma.profile.update({
        where: { id: userId },
        data: { stripe_connect_id: stripeAccountId }
      })
    }

    // 4. Create an account link for onboarding
    const origin = (await headers()).get('origin') || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    
    const accountLink = await stripe.accountLinks.create({
      account: stripeAccountId,
      refresh_url: `${origin}/host/onboarding?step=6&refresh=true`,
      return_url: `${origin}/host/onboarding?step=6&success=true`,
      type: 'account_onboarding',
    })

    return NextResponse.json({ url: accountLink.url })

  } catch (error: any) {
    console.error('STRIPE_CONNECT_ERROR:', error)
    
    // Provide a helpful message for common setup issues
    if (error.message?.includes('signed up for Connect')) {
      return NextResponse.json({ 
        error: "Stripe Connect is not enabled on your account. Please visit https://dashboard.stripe.com/connect to activate it." 
      }, { status: 403 })
    }

    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 })
  }
}
