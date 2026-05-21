'use client'

import Link from 'next/link'
import { Room } from '@/types/room'
import { Users, BedDouble, MousePointer2, Edit, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useSettings } from '@/context/SettingsContext'

interface RoomCardProps {
  room: Room
  propertyId: string
}

export function RoomCard({ room, propertyId }: RoomCardProps) {
  const { formatPrice, t } = useSettings()

  return (
    <div className="bg-white rounded-[2rem] border border-gray-100 p-6 flex flex-col md:flex-row md:items-center justify-between gap-8 hover:shadow-2xl hover:shadow-[var(--primary)]/[0.04] transition-all duration-500 group">
      <div className="flex-1 space-y-4">
        <div className="flex items-center justify-between md:justify-start md:space-x-4">
          <h3 className="text-lg font-bold text-gray-900 tracking-tight leading-none">{room.name}</h3>
          <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-[var(--primary)]/5 text-[var(--primary)] tracking-tight">
            {room.bed_type || 'Standard'}
          </span>
        </div>
        
        <p className="text-sm text-gray-500 line-clamp-2 max-w-2xl leading-relaxed">
          {room.description}
        </p>
 
        <div className="flex flex-wrap gap-3 text-xs font-bold text-gray-600">
          <div className="flex items-center space-x-2 bg-gray-50/80 px-4 py-2 rounded-xl">
            <Users className="w-4 h-4 text-[var(--primary)]" />
            <span className="tracking-tight">Up to {room.capacity} guests</span>
          </div>
          <div className="flex items-center space-x-2 bg-gray-50/80 px-4 py-2 rounded-xl">
            <BedDouble className="w-4 h-4 text-[var(--primary)]" />
            <span className="tracking-tight">{room.available_rooms} rooms left</span>
          </div>
          {room.size_sqm && (
            <div className="flex items-center space-x-2 bg-gray-50/80 px-4 py-2 rounded-xl">
              <MousePointer2 className="w-4 h-4 text-[var(--primary)]" />
              <span className="tracking-tight">{room.size_sqm} m²</span>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center border-t md:border-t-0 md:border-l border-gray-50 pt-6 md:pt-0 md:pl-10 space-y-0 md:space-y-4">
        <div className="text-right">
          <div className="text-xl font-bold text-[var(--primary)] tracking-tight">{formatPrice(room.price_per_night)}</div>
          <div className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">per night</div>
        </div>
        <div className="flex space-x-2">
          <Link href={`/owner/properties/${propertyId}/rooms/${room.id}`}>
            <Button variant="ghost" size="sm" className="px-3">View</Button>
          </Link>
          <Link href={`/owner/properties/${propertyId}/rooms/${room.id}/edit`}>
            <Button variant="outline" size="sm" className="px-3">
              <Edit className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
