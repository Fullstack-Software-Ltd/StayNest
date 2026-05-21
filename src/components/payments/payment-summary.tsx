'use client'

import { Booking } from '@/types/booking'
import { Home, Calendar, Users, ArrowRight } from 'lucide-react'
import Image from 'next/image'
import { useSettings } from '@/context/SettingsContext'

interface PaymentSummaryProps {
  booking: Booking
}

export function PaymentSummary({ booking }: PaymentSummaryProps) {
  const { formatPrice, t } = useSettings()
  const property = booking.property
  const room = booking.room

  if (!property || !room) return null

  return (
    <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden sticky top-32 transition-all">
      <div className="relative h-44 w-full">
        {property.main_image_url ? (
          <Image
            src={property.main_image_url}
            alt={property.name}
            fill
            sizes="(max-width: 768px) 100vw, 400px"
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-50 flex items-center justify-center text-gray-300">
            <Home className="w-12 h-12" />
          </div>
        )}
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest text-blue-600 shadow-lg border border-white/20">
          Booking Confirmed
        </div>
      </div>

      <div className="p-8">
        <div className="mb-8">
          <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] mb-2">Reservation Details</p>
          <h3 className="text-2xl font-black text-gray-900 leading-tight mb-2">{property.name}</h3>
          <p className="text-sm text-gray-500 font-medium">{property.city}, {property.country}</p>
        </div>

        <div className="space-y-6 pb-8 border-b border-gray-100">
          <div className="flex items-center gap-4 group">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Calendar size={18} strokeWidth={2.5} />
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-bold text-gray-900">{booking.check_in}</span>
              <ArrowRight size={14} className="text-gray-300" />
              <span className="text-sm font-bold text-gray-900">{booking.check_out}</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Users size={18} strokeWidth={2.5} />
            </div>
            <span className="text-sm font-bold text-gray-900">{booking.guests} {booking.guests === 1 ? 'Guest' : 'Guests'}</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Home size={18} strokeWidth={2.5} />
            </div>
            <span className="text-sm font-bold text-gray-900">{room.name}</span>
          </div>
        </div>

        <div className="pt-8 space-y-4">
          <div className="flex justify-between items-center text-gray-500 text-sm font-medium">
            <span>Total Amount</span>
            <span className="text-gray-900 font-bold">{formatPrice(booking.total_price)}</span>
          </div>
          
          <div className="flex justify-between items-center bg-blue-50/50 p-6 rounded-3xl border border-blue-100">
            <span className="text-blue-900 font-black text-lg uppercase tracking-tight">Amount to Pay</span>
            <span className="text-3xl font-black text-blue-600">{formatPrice(booking.total_price)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
