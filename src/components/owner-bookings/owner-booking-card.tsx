'use client'

import Link from 'next/link'
import Image from 'next/image'
import { formatDateRange } from '@/lib/utils/formatDate'
import { Calendar, Users, Home, ChevronRight } from 'lucide-react'
import { OwnerBookingStatusBadge } from './owner-booking-status-badge'
import { FormattedPrice } from '@/components/shared/formatted-price'

interface OwnerBookingCardProps {
  booking: any
}

export function OwnerBookingCard({ booking }: OwnerBookingCardProps) {
  return (
    <div className="bg-white rounded-3xl border border-gray-100 p-6 hover:shadow-xl hover:shadow-[var(--primary)]/5 transition-all group focus-within:shadow-[var(--primary)]/5">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center space-x-4 flex-1">
          <div className="w-16 h-16 bg-gray-50 rounded-2xl overflow-hidden flex-shrink-0 border border-gray-100 relative">
            {booking.guest?.avatar_url ? (
              <Image 
                src={booking.guest.avatar_url} 
                alt={booking.guest.full_name} 
                fill
                sizes="64px"
                className="object-cover" 
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-300 font-bold text-xl uppercase">
                {booking.guest?.full_name?.charAt(0)}
              </div>
            )}
          </div>
          <div className="min-w-0">
            <h4 className="text-lg font-black text-gray-900 tracking-tight truncate leading-tight">
              {booking.guest?.full_name}
            </h4>
            <p className="text-sm text-gray-400 font-medium flex items-center mt-0.5">
              <Home className="w-3 h-3 mr-1" />
              {booking.property?.name} • {booking.room?.name}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gray-50 rounded-2xl border border-gray-100">
               <div className="text-[9px] font-black text-gray-400 uppercase mb-0.5">Dates</div>
               <div className="text-xs font-bold text-gray-900">
                 {formatDateRange(booking.check_in, booking.check_out)}
               </div>
            </div>
            <div className="p-3 bg-gray-50 rounded-2xl border border-gray-100">
               <div className="text-[9px] font-black text-gray-400 uppercase mb-0.5">Amount</div>
               <FormattedPrice amount={booking.total_price} className="text-xs font-black text-[var(--primary)]" />
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <OwnerBookingStatusBadge status={booking.status} />
            <Link 
              href={`/owner/reservations/${booking.id}`}
              className="p-2 bg-gray-50 text-gray-400 hover:text-[var(--primary)] hover:bg-[var(--primary)]/10 rounded-xl transition-all"
            >
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
