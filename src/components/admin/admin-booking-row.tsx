'use client'

import { Calendar, MapPin, User, ChevronRight } from 'lucide-react'
import Image from 'next/image'
import { FormattedPrice } from '@/components/shared/formatted-price'
import Link from 'next/link'

interface AdminBookingRowProps {
  booking: any
}

export function AdminBookingRow({ booking }: AdminBookingRowProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-emerald-50 text-emerald-600 border-emerald-100'
      case 'pending': return 'bg-amber-50 text-amber-600 border-amber-100'
      case 'cancelled': return 'bg-rose-50 text-rose-600 border-rose-100'
      case 'completed': return 'bg-blue-50 text-blue-600 border-blue-100'
      default: return 'bg-gray-50 text-gray-600 border-gray-100'
    }
  }

  return (
    <div className="bg-white rounded-[2rem] border border-gray-100 p-6 flex flex-col md:flex-row items-center justify-between gap-6 hover:shadow-xl hover:shadow-gray-200/50 transition-all group focus-within:shadow-gray-200/50">
      <div className="flex items-center gap-6 w-full md:w-auto">
        <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-300 relative overflow-hidden shrink-0 shadow-inner">
          {booking.property.main_image_url ? (
            <Image 
              src={booking.property.main_image_url} 
              alt={booking.property.name} 
              fill
              sizes="64px"
              className="object-cover" 
            />
          ) : (
            <MapPin className="w-6 h-6" />
          )}
        </div>
        
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-black text-gray-900 tracking-tight truncate max-w-[200px] sm:max-w-md">
              {booking.property.name}
            </h3>
            <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${getStatusColor(booking.status)}`}>
              {booking.status}
            </span>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 mt-2">
            <p className="text-sm text-gray-500 font-medium flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" />
              <span className="truncate max-w-[150px]">{booking.guest.full_name}</span>
            </p>
            <p className="text-sm text-gray-500 font-medium flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              {new Date(booking.check_in).toLocaleDateString()} - {new Date(booking.check_out).toLocaleDateString()}
            </p>
            <p className="text-xs text-gray-400 font-bold tracking-widest uppercase flex items-center">
              ID: {booking.id.split('-')[0]}
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between w-full md:w-auto gap-6 sm:gap-8 shrink-0 border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-8">
        <div className="text-right">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Value</p>
          <div className="text-xl sm:text-2xl font-black text-[var(--primary)] tracking-tighter">
            <FormattedPrice amount={booking.total_price} />
          </div>
        </div>

        <Link href={`/properties/${booking.property.id}`} target="_blank" className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-[var(--primary)] group-hover:text-white transition-all transform group-hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2">
          <ChevronRight className="w-5 h-5" />
        </Link>
      </div>
    </div>
  )
}
