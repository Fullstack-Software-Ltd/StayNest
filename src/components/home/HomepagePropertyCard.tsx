'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { PropertySearchResult } from '@/types/search'
import { ArrowRight } from 'lucide-react'
import { useSettings } from '@/context/SettingsContext'
import { SavePropertyButton } from '@/components/wishlist/save-property-button'
import { cn } from '@/utils/cn'

interface HomepagePropertyCardProps {
  property: PropertySearchResult
  featured?: boolean
  user?: any
  index?: number
}

export function HomepagePropertyCard({ property, featured = false, user, index = 0 }: HomepagePropertyCardProps) {
  const { formatPrice, t } = useSettings()

  return (
    <div
      className="group relative animate-card-enter opacity-0"
      style={{ 
        animationDelay: `${index * 80}ms`, 
        animationFillMode: 'forwards' 
      }}
    >
      <Link 
        href={`/properties/${property.id}`}
        className="block cursor-pointer"
      >
        <div className="flex flex-col space-y-2">
          {/* Image Container - Sharp Architectural Edges (Extra Small Compact Ratio) */}
          <div className="relative w-full aspect-[3/4.2] overflow-hidden bg-[var(--luxury-cream)] transition-all duration-700">
            {property.main_image_url ? (
              <Image
                src={property.main_image_url}
                alt={property.name}
                fill
                priority={index < 4}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 20vw"
                className="object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
              />
            ) : (
              <div className="w-full h-full bg-gray-50 flex items-center justify-center text-gray-300">
                <span className="text-[7px] font-black uppercase tracking-widest">No Image</span>
              </div>
            )}
            
            {/* Wishlist Button - Top Right (Extra Small) */}
            <div 
              className="absolute top-2.5 right-2.5 z-20"
              onClick={(e) => e.stopPropagation()}
            >
              <SavePropertyButton propertyId={property.id} />
            </div>
          </div>

          {/* Metadata Section - Extra Compact Editorial Spacing */}
          <div className="space-y-2 px-0.5">
            <div className="space-y-0.5">
              {/* Location Label - Above Name */}
              <p className="text-[7.5px] font-bold text-gray-400 uppercase tracking-[0.3em]">
                {property.city || 'Kigali'} · RWANDA
              </p>
              
              {/* Property Name - Lowercase Serif Italic (Visual Anchor) */}
              <h3 
                className="text-base font-serif italic text-[var(--luxury-green)] tracking-tight leading-tight lowercase"
                style={{ fontFamily: 'var(--font-serif), serif' }}
              >
                {property.name.toLowerCase()}
              </h3>
            </div>
            
            {/* Pricing & Reservation Action */}
            <div className="flex items-center justify-between pt-1 border-t border-black/5">
              <div className="flex items-baseline gap-1">
                <span className="text-[7.5px] font-bold text-gray-400 uppercase tracking-widest">Fr</span>
                <span className="font-serif italic text-[var(--luxury-green)] text-sm">
                  {property.starting_price ? formatPrice(property.starting_price) : 'Contact'}
                </span>
              </div>

              {/* Minimal Circle Arrow Action (Extra Small) */}
              <div className="flex items-center group/btn">
                <div className="w-5 h-5 rounded-full bg-[var(--luxury-green)] flex items-center justify-center text-white transition-transform group-hover:scale-110">
                  <ArrowRight className="w-3 h-3" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  )
}
