'use client'

import { Room } from '@/types/room'
import { Users, BedDouble, MousePointer2, CheckCircle2, ChevronRight, Sparkles } from 'lucide-react'
import { Button } from '@/components/shared/Button'
import Link from 'next/link'
import { useSettings } from '@/context/SettingsContext'
import { Card, CardHeader, CardContent } from '@/components/shared/Card'

interface PropertyRoomListProps {
  rooms: Room[]
  isWholeUnit?: boolean
}

export function PropertyRoomList({ rooms, isWholeUnit = false }: PropertyRoomListProps) {
  const { formatPrice, t } = useSettings()
  
  if (isWholeUnit) return null

  return (
    <div className="space-y-10 sm:space-y-12" id="rooms">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 px-1">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[var(--primary)]/5 rounded-full border border-[var(--primary)]/10">
            <Sparkles className="w-3.5 h-3.5 text-[var(--primary)]" />
            <span className="text-[11px] font-semibold text-[var(--primary)] tracking-tight">{t('rooms.available_rooms')}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight leading-tight">{t('rooms.available_choice') || 'Choose Your Space'}</h2>
        </div>
        <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-[0.2em] bg-gray-50 px-4 py-2 rounded-full">
          {rooms.length} {rooms.length === 1 ? t('rooms.room_type') : t('rooms.room_types')}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {rooms.map((room, i) => (
          <Card 
            key={room.id} 
            variant="default" 
            padding="none"
            className="group overflow-hidden rounded-2xl border border-gray-100 transition-all duration-200 animate-slide-up opacity-0"
            style={{ animationFillMode: 'forwards', animationDelay: `${i * 150}ms` }}
          >
            <div className="flex flex-col lg:flex-row">
              {/* Room Content */}
              <div className="flex-1 p-6 sm:p-10 space-y-8">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-px bg-[var(--primary)]/20" />
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">{room.name}</h3>
                  </div>
                  <p className="text-gray-500 leading-relaxed text-sm sm:text-base font-medium max-w-2xl text-balance">
                    {room.description}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <div className="flex items-center space-x-2 bg-gray-50 border border-gray-100 px-4 py-2.5 rounded-xl text-[11px] font-semibold text-gray-600">
                    <Users className="w-3.5 h-3.5 text-[var(--primary)]" />
                    <span>
                      {t('rooms.up_to')} {room.capacity} {room.capacity === 1 ? t('property.guest') : t('property.guests')}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 bg-gray-50 border border-gray-100 px-4 py-2.5 rounded-xl text-[11px] font-semibold text-gray-600">
                    <BedDouble className="w-3.5 h-3.5 text-[var(--primary)]" />
                    <span>{room.bed_type}</span>
                  </div>
                  {room.size_sqm && (
                    <div className="flex items-center space-x-2 bg-gray-50 border border-gray-100 px-4 py-2.5 rounded-xl text-[11px] font-semibold text-gray-600">
                      <MousePointer2 className="w-3.5 h-3.5 text-[var(--primary)]" />
                      <span>{room.size_sqm} m²</span>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-4 gap-x-6 pt-6 border-t border-gray-100">
                  {room.facilities.slice(0, 6).map((facility) => (
                    <div key={facility} className="flex items-center space-x-2.5 text-[11px] text-gray-600 font-medium group/fac">
                      <div className="w-6 h-6 rounded-lg bg-[var(--primary)]/5 flex items-center justify-center group-hover/fac:bg-[var(--primary)]/10 transition-colors duration-200">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[var(--primary)]" />
                      </div>
                      <span className="uppercase tracking-wider opacity-80">{facility}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pricing & CTA */}
              <div className="lg:w-72 flex flex-col items-center justify-center p-6 sm:p-8 bg-gray-50/50 border-t lg:border-t-0 lg:border-l border-gray-100 text-center space-y-6 relative">
                
                <div className="relative z-10 w-full">
                  <div className="text-[11px] text-gray-400 font-semibold uppercase tracking-widest mb-2">{t('rooms.per_night')}</div>
                  <div className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight tabular-nums">
                    {formatPrice(room.price_per_night)}
                  </div>
                </div>
                
                <div className="relative z-10 w-full space-y-4">
                  <Link href={`/bookings/confirm/${room.id}`} className="block">
                    <Button 
                      size="lg"
                      variant="primary"
                      className="w-full h-12 rounded-xl font-bold text-xs uppercase tracking-widest shadow-md shadow-[var(--primary)]/10 active:scale-95 group/btn"
                    >
                      {t('rooms.reserve')}
                    </Button>
                  </Link>
                  <p className="text-[10px] font-semibold text-[var(--primary)] uppercase tracking-widest flex items-center justify-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-pulse" />
                    {t('rooms.only')} {room.available_rooms} {t('rooms.left')}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
