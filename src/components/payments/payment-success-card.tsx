'use client'

import { Payment } from '@/types/payment'
import { Booking } from '@/types/booking'
import { CheckCircle2, Calendar, Receipt, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { PaymentStatusBadge } from './payment-status-badge'
import { useSettings } from '@/context/SettingsContext'
import { ImigongoPattern } from '@/components/shared/imigongo-pattern'

interface PaymentSuccessCardProps {
  payment: Payment
  booking: Booking
}

export function PaymentSuccessCard({ payment, booking }: PaymentSuccessCardProps) {
  const { t, formatPrice } = useSettings()
  const property = booking.property

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-[2.5rem] md:rounded-[4rem] border border-gray-100 shadow-2xl shadow-[var(--primary)]/5 overflow-hidden transform transition-all hover:scale-[1.005]">
        <div className="bg-[var(--primary)] p-8 md:p-12 text-center text-white relative">
          <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none">
            <ImigongoPattern variant="dark" className="absolute inset-0 w-full h-full text-[var(--accent)] text-opacity-20" />
          </div>
          
          <div className="inline-flex items-center justify-center w-20 h-20 md:w-24 md:h-24 bg-white/20 backdrop-blur-xl rounded-2xl md:rounded-[2.5rem] mb-6 md:mb-8 border border-white/20 animate-in zoom-in duration-500">
            <CheckCircle2 color="white" size={40} strokeWidth={2.5} />
          </div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-3 md:mb-4">{t('payment.success_title')}</h1>
          <p className="text-white/70 font-medium text-base md:text-lg px-4 md:px-8 leading-relaxed">
            {t('payment.success_message', { name: property?.name || '' })}
          </p>
        </div>

        <div className="p-8 md:p-14">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12 mb-10 md:mb-12">
            <div>
              <p className="text-[10px] font-black text-[var(--primary)] uppercase tracking-[0.2em] mb-6">{t('payment.details_title')}</p>
              <div className="space-y-6">
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-1">{t('payment.status_label')}</label>
                  <PaymentStatusBadge status={payment.status} />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-1">{t('payment.reference_label')}</label>
                  <div className="flex items-center gap-2 group">
                    <Receipt size={14} className="text-gray-400" />
                    <span className="text-sm font-black text-gray-900 font-mono tracking-tight">{payment.transaction_reference}</span>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-1">{t('payment.method_label')}</label>
                  <span className="text-sm font-black uppercase tracking-tighter">{payment.method.replace('_', ' ')}</span>
                </div>
              </div>
            </div>

            <div>
              <p className="text-[10px] font-black text-[var(--primary)] uppercase tracking-[0.2em] mb-6">{t('payment.booking_context_title')}</p>
              <div className="space-y-6">
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-1">{t('payment.check_in_out_label')}</label>
                  <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-gray-400" />
                    <span className="text-sm font-bold text-gray-900">{booking.check_in} — {booking.check_out}</span>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-1">{t('booking.guests')}</label>
                  <span className="text-sm font-bold">{booking.guests} {booking.guests === 1 ? t('property.guest') : t('property.guests')}</span>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-1">{t('payment.amount_paid_label')}</label>
                  <span className="text-2xl font-black text-[var(--primary)] font-mono">{formatPrice(payment.amount)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-gray-50">
            <Link href="/bookings" className="flex-1">
              <div className="w-full py-5 md:py-6 px-4 bg-gray-50 hover:bg-gray-100 text-gray-900 font-black text-xs md:text-sm uppercase tracking-widest rounded-2xl md:rounded-[1.8rem] transition-all flex items-center justify-center gap-2 group border border-gray-100">
                {t('payment.view_all_btn')}
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
            <Link href="/" className="flex-1">
              <div className="w-full py-5 md:py-6 px-4 bg-white hover:bg-gray-50 text-[var(--primary)] font-black text-xs md:text-sm uppercase tracking-widest rounded-2xl md:rounded-[1.8rem] transition-all flex items-center justify-center gap-2 group border border-[var(--primary)]/10">
                {t('payment.home_btn')}
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          </div>
        </div>
      </div>
      
      <p className="text-center text-gray-400 text-xs font-medium mt-10">
        {t('payment.help_text')} <span className="text-[var(--primary)] underline font-bold">support@urugostay.com</span>
      </p>
    </div>
  )
}
