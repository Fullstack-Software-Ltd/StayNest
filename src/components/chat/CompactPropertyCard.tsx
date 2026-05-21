'use client'

import Image from 'next/image'
import Link from 'next/link'
import { MapPin, Star, Home } from 'lucide-react'
import { Property } from '@/types/property'
import { useSettings } from '@/context/SettingsContext'

interface CompactPropertyCardProps {
  property: Property
}

export function CompactPropertyCard({ property }: CompactPropertyCardProps) {
  const { formatPrice } = useSettings()

  return (
    <Link href={`/properties/${property.id}`} className="block border border-gray-100 rounded-2xl p-2 bg-white/50 hover:bg-white transition-colors group">
      <div className="flex gap-3">
        <div className="relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0">
          {property.main_image_url ? (
            <Image
              src={property.main_image_url}
              alt={property.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full bg-gray-50 flex items-center justify-center text-gray-300">
              <Home className="w-6 h-6" />
            </div>
          )}
        </div>
        
        <div className="flex-1 min-w-0 flex flex-col justify-center">
          <div className="flex justify-between items-start gap-1">
            <h4 className="font-bold text-gray-900 text-sm truncate">{property.name}</h4>
          </div>
          
          <p className="text-[10px] text-gray-500 font-medium flex items-center mt-1">
            <MapPin className="w-2.5 h-2.5 mr-1 text-[var(--primary)]" />
            {property.city}
          </p>
          
          <div className="flex items-center gap-1.5 mt-2">
            <span className="font-extrabold text-[var(--primary)] text-xs">{formatPrice(property.daily_price || 0)}</span>
            <span className="text-[9px] text-gray-400">/ night</span>
          </div>
        </div>
      </div>
    </Link>
  )
}
