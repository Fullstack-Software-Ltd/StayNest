'use client'

import { use, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createCheckoutSession } from '@/lib/payments/createCheckoutSession'
import { getCheckoutData } from '@/app/actions/payments'
import { Button } from '@/components/shared/Button'
import { Card, CardHeader, CardContent } from '@/components/shared/Card'
import { FormattedPrice } from '@/components/shared/formatted-price'
import { CreditCard, ShieldCheck, ArrowRight, Info, Sparkles } from 'lucide-react'
import { HouseLoader } from '@/components/shared/HouseLoader'
import { useSettings } from '@/context/SettingsContext'
import { toast } from 'sonner'

export default function CheckoutPage({ params: paramsPromise }: { params: Promise<{ bookingId: string }> }) {
  const { bookingId } = use(paramsPromise)
  const router = useRouter()
  const { t, formatPrice } = useSettings()
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [booking, setBooking] = useState<any>(null)
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'momo' | 'bank'>('card')
  const [momoNumber, setMomoNumber] = useState('')

  useEffect(() => {
    async function fetchBooking() {
      const data = await getCheckoutData(bookingId)

      if (!data) {
        toast.error('Booking not found')
        router.push('/bookings')
        return
      }

      setBooking(data)
      setLoading(false)
    }

    fetchBooking()
  }, [bookingId])

  const handlePayment = async () => {
    setProcessing(true)
    const payment = booking.payments?.[0]
    if (!payment) {
      toast.error('Payment Error: No associated payment record found.')
      console.error('DIAGNOSTIC - Booking:', booking.id, 'User:', booking.user_id)
      setProcessing(false)
      return
    }

    try {
      const { url } = await createCheckoutSession({
        bookingId: booking.id,
        amount: payment.amount,
        currency: payment.currency,
        customerName: booking.user?.full_name || 'Guest',
        customerEmail: booking.user?.email || '',
      })

      if (url) {
        window.location.href = url
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to initiate payment')
    } finally {
      setProcessing(false)
    }
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <HouseLoader size="lg" label="Preparing Secure Checkout" />
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50/50 py-12 sm:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
          
          <div className="lg:col-span-3 space-y-10">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[var(--primary)]/5 text-[var(--primary)] rounded-full text-[10px] font-black uppercase tracking-widest border border-[var(--primary)]/10">
                <ShieldCheck className="w-3.5 h-3.5" />
                Secure Checkout
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">Checkout Summary</h1>
              <p className="text-gray-500 font-medium">Verify your reservation details before proceeding to the secure payment gateway.</p>
            </div>

            <Card variant="default" padding="none" className="overflow-hidden rounded-[2.5rem] border-white/60 shadow-2xl shadow-black/[0.04]">
              <CardHeader 
                className="bg-gray-50 px-8 py-8 sm:px-10 sm:py-8 border-b border-gray-100/50"
                title="Property Details"
              />
              <CardContent className="p-8 sm:p-10 space-y-8">
                <div className="flex gap-6 items-center">
                    <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gray-100 flex-shrink-0">
                        <img 
                            src={booking.property?.main_image_url} 
                            alt={booking.property?.name} 
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 tracking-tight">{booking.property?.name}</h3>
                        <p className="text-sm text-gray-500 font-medium">{booking.property?.city}, {booking.property?.country}</p>
                        <p className="text-xs text-[var(--primary)] font-bold mt-1 uppercase tracking-widest">{booking.room?.name}</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-8 pt-8 border-t border-gray-50">
                    <div className="space-y-1">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Check-in</span>
                        <p className="text-sm font-bold text-gray-900">{new Date(booking.check_in).toLocaleDateString()}</p>
                    </div>
                    <div className="space-y-1 text-right">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Check-out</span>
                        <p className="text-sm font-bold text-gray-900">{new Date(booking.check_out).toLocaleDateString()}</p>
                    </div>
                </div>
              </CardContent>
            </Card>

            <div className="p-6 bg-blue-50/50 rounded-[1.5rem] border border-blue-100 flex gap-4">
                <Info className="w-5 h-5 text-blue-500 flex-shrink-0" />
                <p className="text-xs text-blue-800 font-medium leading-relaxed">
                    By proceeding, you agree to our terms of service and the property's cancellation policy. Your payment info is protected by secure encryption.
                </p>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-10">
            <Card variant="default" padding="none" className="overflow-hidden rounded-[2.5rem] border-white/60 shadow-2xl shadow-black/[0.04]">
              <CardHeader 
                className="bg-gray-50 px-8 py-8 sm:px-10 sm:py-8 border-b border-gray-100/50"
                title="Payment Summary"
              />
              <CardContent className="p-8 sm:p-10 space-y-10">
                <div className="space-y-4">
                    <div className="flex justify-between items-center text-sm font-medium text-gray-500">
                        <span>Rate Total</span>
                        <span className="font-bold text-gray-900">{formatPrice(booking.total_price)}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm font-medium text-gray-500">
                        <span>Service Fee</span>
                        <span className="text-[10px] font-black uppercase text-green-600 tracking-widest bg-green-50 px-2 py-0.5 rounded-md">Included</span>
                    </div>
                    <div className="pt-6 border-t border-gray-100/50 flex justify-between items-end">
                        <div className="space-y-1">
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Grand Total</span>
                            <div className="text-3xl font-black text-[var(--primary)] tracking-tight">
                                {new Intl.NumberFormat(undefined, { style: 'currency', currency: booking.payments?.[0]?.currency || 'USD' }).format(booking.payments?.[0]?.amount || booking.total_price)}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Select Payment Method</label>
                    <div className="grid grid-cols-3 gap-3">
                        {[
                            { id: 'card', label: 'Card', icon: CreditCard },
                            { id: 'momo', label: 'Momo', icon: Sparkles },
                            { id: 'bank', label: 'Bank', icon: ShieldCheck }
                        ].map((method) => (
                            <button
                                key={method.id}
                                onClick={() => setPaymentMethod(method.id as any)}
                                className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${
                                    paymentMethod === method.id 
                                        ? 'border-[var(--primary)] bg-[var(--primary)]/5 text-[var(--primary)] shadow-lg shadow-[var(--primary)]/5' 
                                        : 'border-gray-50 bg-gray-50 text-gray-400 hover:border-gray-100'
                                }`}
                            >
                                <method.icon className="w-5 h-5" />
                                <span className="text-[9px] font-black uppercase tracking-widest">{method.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {paymentMethod === 'momo' && (
                    <div className="space-y-4 animate-fade-in-up">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">MTN / Airtel Number</label>
                        <div className="relative">
                            <input 
                                type="tel" 
                                placeholder="078... or 072..." 
                                value={momoNumber}
                                onChange={(e) => setMomoNumber(e.target.value)}
                                className="w-full h-14 pl-12 pr-4 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-[var(--primary)]/10 text-sm font-bold tracking-widest tabular-nums"
                            />
                            <div className="absolute inset-y-0 left-4 flex items-center">
                                <span className="text-xs font-black text-yellow-500">M</span>
                            </div>
                        </div>
                        <p className="text-[9px] text-gray-400 font-medium leading-relaxed italic px-2">
                           * You will receive a prompt on your phone to authorize the transaction.
                        </p>
                    </div>
                )}

                <Button 
                    size="lg"
                    className="w-full h-16 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-[var(--primary)]/20 active:scale-95"
                    onClick={handlePayment}
                    disabled={processing || (paymentMethod === 'momo' && !momoNumber)}
                    isLoading={processing}
                    rightIcon={!processing && <ArrowRight className="w-5 h-5" />}
                >
                    {paymentMethod === 'card' ? 'Pay with Stripe' : 
                     paymentMethod === 'momo' ? 'Initiate Momo Pay' : 
                     'View Bank Details'}
                </Button>
              </CardContent>
            </Card>
          </div>

        </div>
      </div>
    </div>
  )
}
