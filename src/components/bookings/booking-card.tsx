'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Booking } from '@/types/booking'
import { BookingStatusBadge } from './booking-status-badge'
import { Calendar, MapPin, Users, ArrowRight, MessageSquare, Home, CreditCard } from 'lucide-react'
import { format } from 'date-fns'
import { formatDateRange } from '@/lib/utils/formatDate'
import { useSettings } from '@/context/SettingsContext'
import { Button } from '@/components/shared/Button'

interface BookingCardProps {
  booking: Booking
}

export function BookingCard({ booking }: BookingCardProps) {
  const { formatPrice, t } = useSettings()

  const payments = (booking as any).payments || [];
  const isPaid = Array.isArray(payments) 
    ? payments.some((p: any) => p.status === 'paid')
    : (payments as any)?.status === 'paid';

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-7 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 group flex flex-col md:flex-row gap-5 sm:gap-7">
      {/* Property Image */}
      <div className="md:w-56 h-44 sm:h-48 md:h-auto bg-gray-50 rounded-2xl overflow-hidden relative flex-shrink-0 border border-gray-100">
        {booking.property?.main_image_url ? (
          <Image 
            src={booking.property.main_image_url} 
            alt={booking.property.name} 
            fill
            sizes="(max-width: 768px) 100vw, 224px"
            className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out" 
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300">
             <Home className="w-12 h-12" />
          </div>
        )}
        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Row: Title + Status */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-5">
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="px-2.5 py-1 bg-[var(--primary)]/5 text-[var(--primary)] rounded-lg text-[9px] font-semibold uppercase tracking-[0.2em] border border-[var(--primary)]/10">
                {booking.property?.type}
              </span>
              <BookingStatusBadge status={booking.status} />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight leading-tight truncate group-hover:text-[var(--primary)] transition-colors duration-200">
              {booking.property?.name}
            </h3>
            <div className="flex items-center text-gray-500 text-sm font-medium mt-1.5 gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[var(--accent)] shrink-0" />
              <span className="truncate">{booking.property?.city}, {booking.property?.country}</span>
            </div>
          </div>
          
          {/* Price on desktop */}
          <div className="text-right hidden sm:block shrink-0">
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-[0.15em] mb-1">{t('booking.total_stay')}</p>
            <span className="text-2xl font-bold text-[var(--primary)] tracking-tight tabular-nums">{formatPrice(booking.total_price)}</span>
          </div>
        </div>

        {/* Info Chips */}
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
          <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-xl border border-gray-100">
            <Calendar className="w-3.5 h-3.5 text-[var(--primary)]" />
            <div>
              <span className="text-[9px] font-semibold text-gray-400 uppercase tracking-wider block">{t('booking.dates')}</span>
              <span className="text-xs font-semibold text-gray-700">
                {formatDateRange(booking.check_in, booking.check_out)}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-xl border border-gray-100">
            <Users className="w-3.5 h-3.5 text-[var(--primary)]" />
            <div>
              <span className="text-[9px] font-semibold text-gray-400 uppercase tracking-wider block">{t('booking.guests')}</span>
              <span className="text-xs font-semibold text-gray-700">{booking.guests} {booking.guests === 1 ? t('property.guest') : t('property.guests')}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-xl border border-gray-100">
            <CreditCard className="w-3.5 h-3.5 text-[var(--primary)]" />
            <div>
              <span className="text-[9px] font-semibold text-gray-400 uppercase tracking-wider block">{t('booking.payment')}</span>
              {isPaid ? (
                <span className="text-xs font-bold text-emerald-600 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.5)]" />
                  {t('booking.paid')}
                </span>
              ) : (
                <span className="text-xs font-bold text-amber-600 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                  {t('booking.pending')}
                </span>
              )}
            </div>
          </div>

          {/* Mobile price chip */}
          <div className="flex items-center gap-2 px-3 py-2 bg-[var(--primary)]/5 rounded-xl border border-[var(--primary)]/10 sm:hidden">
            <span className="text-lg font-bold text-[var(--primary)] tabular-nums">{formatPrice(booking.total_price)}</span>
          </div>
        </div>
        
        {/* Actions Footer */}
        <div className="mt-auto pt-5 sm:pt-6 flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 mt-6">
          <div className="flex items-center gap-3">
             <Link href={`/properties/${booking.property_id}`} className="text-[10px] font-semibold text-gray-400 hover:text-[var(--primary)] uppercase tracking-widest transition-colors duration-200 underline underline-offset-4 decoration-gray-200">
               {t('property.view_property')}
             </Link>
             <span className="w-1 h-1 rounded-full bg-gray-200" />
             <Link href={`/help`} className="text-[10px] font-semibold text-gray-400 hover:text-[var(--primary)] uppercase tracking-widest transition-colors duration-200 underline underline-offset-4 decoration-gray-200">
               {t('booking.need_help')}
             </Link>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {!isPaid && (
              <Link href={`/payments/checkout/${booking.id}`} className="flex-1 sm:flex-none">
                <Button variant="primary" size="md" className="w-full rounded-xl font-semibold text-[10px] uppercase tracking-widest shadow-md shadow-[var(--primary)]/10" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  {t('booking.complete_payment')}
                </Button>
              </Link>
            )}

            {booking.status === 'completed' && (!booking.reviews || booking.reviews.length === 0) && (
              <Link href={`/reviews/new/${booking.id}`} className="flex-1 sm:flex-none">
                <Button variant="outline" size="md" className="w-full rounded-xl font-semibold text-[10px] uppercase tracking-widest" leftIcon={<MessageSquare className="w-4 h-4" />}>
                  {t('booking.leave_review')}
                </Button>
              </Link>
            )}
            
            <Link href={`/bookings/${booking.id}`} className="shrink-0">
              <div className="w-11 h-11 rounded-xl bg-gray-50 hover:bg-[var(--primary)]/5 border border-gray-100 flex items-center justify-center text-gray-400 hover:text-[var(--primary)] transition-all duration-200 group-hover:translate-x-0.5">
                <ArrowRight className="w-5 h-5" />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
