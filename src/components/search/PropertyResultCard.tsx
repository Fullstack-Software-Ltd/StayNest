'use client'

import Image from 'next/image'
import Link from 'next/link'
import { PropertySearchResult } from '@/types/search'
import { MapPin, Star, Home } from 'lucide-react'
import { SavePropertyButton } from '../wishlist/save-property-button'
import { useSettings } from '@/context/SettingsContext'
import { cn } from '@/utils/cn'

interface PropertyResultCardProps {
  property: PropertySearchResult
  index?: number
}

export function PropertyResultCard({ property, index = 0 }: PropertyResultCardProps) {
  const { t, formatPrice } = useSettings()

  return (
    <div 
      id={`property-${property.id}`}
      className="group relative animate-card-enter opacity-0" 
      style={{ 
        animationFillMode: 'forwards',
        animationDelay: `${index * 80}ms`
      }}
    >
      <Link href={`/properties/${property.id}`} className="block cursor-pointer">
        {/* Card wrapper with sophisticated hover effect */}
        <div className="rounded-[1.5rem] transition-all duration-400 group-hover:-translate-y-1">
          {/* Image Container */}
          <div className="relative aspect-square w-full overflow-hidden rounded-[1.5rem] shadow-sm border border-gray-100 transition-all duration-400 group-hover:shadow-xl group-hover:shadow-[var(--primary)]/5">
            {property.main_image_url ? (
              <Image
                src={property.main_image_url}
                alt={property.name}
                fill
                priority={index < 4}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 400px"
                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
              />
            ) : (
              <div className="w-full h-full bg-gray-50 flex items-center justify-center text-gray-300">
                <Home className="w-10 h-10 opacity-50" />
              </div>
            )}
            
            {/* Elegant Guest Favorite Badge */}
            {(property.average_rating || 0) >= 4.8 && (
              <div className="absolute top-4 left-4 px-3.5 py-1.5 bg-white/95 backdrop-blur-md rounded-full shadow-md shadow-black/5 flex items-center gap-1.5 z-10 animate-fade-in border border-white/20">
                <Star className="w-3 h-3 text-[var(--accent)] fill-[var(--accent)]" />
                <span className="text-[10px] font-black text-[var(--foreground)] uppercase tracking-[0.15em] leading-none mt-0.5">
                  Guest Favorite
                </span>
              </div>
            )}
            {/* Gradient overlay on hover for premium feel */}
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--primary-dark)]/80 via-transparent to-transparent opacity-0 group-hover:opacity-10 transition-opacity duration-400" />
          </div>

          {/* Info Footer */}
          <div className="mt-4 space-y-1 px-1">
            <div className="flex justify-between items-start">
              <h3 className="text-base font-bold text-gray-900 tracking-tight leading-snug line-clamp-1">
                {property.name}
              </h3>
              <div className="flex items-center gap-1 ml-3 shrink-0">
                <Star className="w-3.5 h-3.5 fill-[var(--accent)] text-[var(--accent)]" />
                <span className="font-bold text-sm text-[var(--foreground)] mt-0.5">{(property.average_rating || 0) > 0 ? property.average_rating : 'New'}</span>
              </div>
            </div>
            
            <p className="text-[13px] font-medium text-gray-500 capitalize tracking-tight">
              {t(`common.property_types.${property.type.toLowerCase()}`)} · {property.city}
            </p>
            
            <div className="flex items-baseline gap-1.5 pt-1">
              <span className="font-extrabold text-[var(--foreground)] text-[15px]">{formatPrice(property.starting_price || 0)}</span>
              <span className="font-medium text-gray-400 text-xs">/ {t('property.night')}</span>
            </div>
          </div>
        </div>
      </Link>

      {/* Action Buttons */}
      <div className="absolute top-4 right-4 z-20">
        <SavePropertyButton 
          propertyId={property.id} 
        />
      </div>
    </div>
  )
}
