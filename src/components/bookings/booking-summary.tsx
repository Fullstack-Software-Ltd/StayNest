import Image from 'next/image'
import { Property } from '@/types/property'
import { Room } from '@/types/room'
import { Calendar, Users, Home, MapPin, Sparkles, CreditCard } from 'lucide-react'
import { useSettings } from '@/context/SettingsContext'
import { Card, CardHeader, CardContent, CardFooter } from '@/components/shared/Card'

interface BookingSummaryProps {
  property: Property
  room: Room
  checkIn?: string
  checkOut?: string
  guests?: number
  nights: number
  subtotal: number
  serviceFee: number
  tax: number
  totalPrice: number
}

export function BookingSummary({ 
  property, 
  room, 
  checkIn, 
  checkOut, 
  guests, 
  nights, 
  subtotal,
  serviceFee,
  tax,
  totalPrice 
}: BookingSummaryProps) {
  const { formatPrice, t } = useSettings()

  return (
    <Card 
      variant="default" 
      padding="none" 
      className="overflow-hidden rounded-2xl sm:rounded-[2.5rem] border border-white/60 shadow-2xl shadow-black/[0.04] sticky top-24"
    >
      {/* Property Image Header */}
      <div className="relative h-32 sm:h-40 w-full group overflow-hidden">
        {property.main_image_url ? (
          <Image
            src={property.main_image_url}
            alt={property.name}
            fill
            sizes="(max-width: 768px) 100vw, 450px"
            className="object-cover group-hover:scale-110 transition-transform duration-[2s] ease-out"
          />
        ) : (
          <div className="w-full h-full bg-gray-100 flex flex-col items-center justify-center text-gray-400">
            <Home className="w-12 h-12 mb-2" />
            <span className="text-[11px] font-bold uppercase tracking-widest">No Selection</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />
        
        {/* Floating Badge */}
        <div className="absolute top-4 right-4">
          <div className="px-3 py-1.5 bg-white border border-gray-100 rounded-full shadow-lg flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-[var(--primary)]" />
            <span className="text-[11px] font-bold text-gray-900 tracking-tight leading-none">Curated Luxury</span>
          </div>
        </div>
      </div>

      <div className="p-8 sm:p-10 space-y-10">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <MapPin className="w-3.5 h-3.5 text-[var(--primary)]" />
            <span className="text-[11px] font-bold text-gray-400 tracking-tight">{property.city}, {property.country}</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight leading-tight">{property.name}</h3>
        </div>

        <div className="space-y-6">
          <div className="p-6 bg-gray-50 rounded-3xl space-y-5 border border-gray-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--primary)]/5 rounded-full -mr-16 -mt-16 blur-3xl" />
            
            <div className="flex items-center justify-between relative z-10">
              <span className="text-[11px] font-bold text-gray-400 tracking-tight">{t('confirm.room_type') || 'Suite Selection'}</span>
              <span className="text-xs font-bold text-gray-900 tracking-tight">{room.name}</span>
            </div>
            
            <div className="flex items-center justify-between relative z-10">
              <span className="text-[11px] font-bold text-gray-400 tracking-tight">{t('confirm.price_per_night') || 'Rate'}</span>
              <span className="text-sm font-bold text-[var(--primary)] tracking-tight">{formatPrice(room.price_per_night)}</span>
            </div>
          </div>

          {/* Host Info in Summary */}
          {property.host && (
            <div className="p-6 border border-gray-100 rounded-3xl flex items-center gap-4">
              <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-sm shrink-0 bg-gray-50">
                {property.host.avatar_url ? (
                  <Image src={property.host.avatar_url} alt={property.host.full_name} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-50">
                    <Users className="w-5 h-5" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Your Host</p>
                <p className="text-sm font-bold text-gray-900 leading-none">{property.host.full_name}</p>
              </div>
            </div>
          )}

          <div className="space-y-4 px-2">
            <div className="flex justify-between items-center text-[11px] font-bold text-gray-400 tracking-tight">
              <span className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5" />
                {t('confirm.nights') || 'Duration'}
              </span>
              <span className="text-gray-900">{nights} {nights === 1 ? 'night' : 'nights'}</span>
            </div>
            
            <div className="flex justify-between items-center text-[11px] font-bold text-gray-400 tracking-tight">
              <span className="flex items-center gap-2">
                <Users className="w-3.5 h-3.5" />
                {t('confirm.num_guests') || 'Guests'}
              </span>
              <span className="text-gray-900">{guests || 1} {guests === 1 ? 'guest' : 'guests'}</span>
            </div>

            <div className="pt-4 space-y-3 border-t border-gray-100/50">
              <div className="flex justify-between items-center text-[11px] font-bold text-gray-400 tracking-tight">
                <span>{formatPrice(room.price_per_night)} x {nights} nights</span>
                <span className="text-gray-900">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between items-center text-[11px] font-bold text-gray-400 tracking-tight">
                <span>Service Fee (5%)</span>
                <span className="text-gray-900 font-medium">{formatPrice(serviceFee)}</span>
              </div>
              <div className="flex justify-between items-center text-[11px] font-bold text-gray-400 tracking-tight">
                <span>Taxes & VAT (18%)</span>
                <span className="text-gray-900 font-medium">{formatPrice(tax)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-[var(--warm-gray)]/50">
          <div className="flex items-end justify-between">
            <div className="space-y-2">
              <span className="text-[11px] text-gray-400 font-bold uppercase tracking-widest">{t('confirm.total_price') || 'Total Due'}</span>
              <div className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight tabular-nums leading-none">
                {formatPrice(totalPrice)}
              </div>
            </div>
            <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center border border-gray-100">
              <CreditCard className="w-6 h-6 text-gray-400" />
            </div>
          </div>
          
          <p className="inline-block mt-8 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-lg text-[9px] font-black uppercase tracking-widest border border-emerald-100 shadow-sm">
            {t('confirm.best_price') || 'Guaranteed best rate through UrugoStay'}
          </p>
        </div>
      </div>
    </Card>
  )
}
