'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Booking } from '@/types/booking'
import { PaymentMethod } from '@/types/payment'
import { createPayment } from '@/lib/payments/createPayment'
import { PaymentMethodSelector } from './payment-method-selector'
import { Button } from '@/components/ui/Button'
import { ShieldCheck, Lock } from 'lucide-react'
import { HouseButtonLoader } from '@/components/shared/HouseLoader'
import { useSettings } from '@/context/SettingsContext'

interface PaymentFormProps {
  booking: Booking
}

export function PaymentForm({ booking }: PaymentFormProps) {
  const router = useRouter()
  const { t, formatPrice } = useSettings()
  const [loading, setLoading] = useState(false)
  const [method, setMethod] = useState<PaymentMethod>('card')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const payment = await createPayment({
        booking_id: booking.id,
        method,
        amount: booking.total_price,
        currency: 'USD'
      })

      router.push(`/payments/success/${payment.id}`)
    } catch (error) {
      console.error('Payment failed:', error)
      alert(t('payment.error_payment'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white p-10 md:p-14 rounded-[3rem] border border-gray-100 shadow-sm transition-all">
      <div className="flex items-center gap-3 mb-10">
        <div className="w-10 h-10 rounded-full bg-green-50 text-green-600 flex items-center justify-center">
          <ShieldCheck size={20} strokeWidth={2.5} />
        </div>
        <span className="text-sm font-black text-gray-900 uppercase tracking-widest">{t('payment.secure_checkout')}</span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-12">
        <PaymentMethodSelector 
          selectedMethod={method} 
          onMethodChange={setMethod} 
        />

        <div className="bg-gray-50 p-8 rounded-[2rem] border border-gray-100/50">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-white rounded-xl shadow-sm border border-gray-100 mt-1">
              <Lock size={18} className="text-gray-400" />
            </div>
            <div>
              <p className="font-bold text-gray-900 text-sm leading-relaxed mb-2">{t('payment.terms_title')}</p>
              <p className="text-xs text-gray-400 font-medium leading-loose">
                {t('payment.terms_text')}
              </p>
            </div>
          </div>
        </div>

        <Button 
          type="submit" 
          disabled={loading}
          className="w-full py-9 text-xl rounded-[2.2rem] shadow-2xl shadow-blue-100 transition-all hover:-translate-y-1 active:scale-[0.98] group"
        >
          {loading ? (
            <>
              <HouseButtonLoader />
              {t('payment.processing_securely')}
            </>
          ) : (
            <>
              {t('payment.complete_payment_btn', { price: formatPrice(booking.total_price) })}
            </>
          )}
        </Button>
      </form>
    </div>
  )
}
