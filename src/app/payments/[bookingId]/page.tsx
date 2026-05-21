import { redirect } from 'next/navigation'

export default async function PaymentPage({ params }: { params: Promise<{ bookingId: string }> }) {
  const { bookingId } = await params
  
  // UNIFICATION: Redirect legacy manual payment page to the modern Stripe-integrated checkout summary.
  // This ensures all users use the same verified and secure flow.
  redirect(`/payments/checkout/${bookingId}`)
}
