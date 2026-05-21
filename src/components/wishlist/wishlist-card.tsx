'use client'

import { PropertySearchResult } from '@/types/search'
import { PropertyResultCard } from '../search/PropertyResultCard'
import { SavePropertyButton } from './save-property-button'
import { cn } from '@/utils/cn'

interface WishlistCardProps {
  property: PropertySearchResult
}

export function WishlistCard({ property }: WishlistCardProps) {
  return (
    <div className="relative group">
      <PropertyResultCard property={property} />
      {/* Overriding the default favorite button position or style if needed, 
          but PropertyResultCard already has it. 
          For Wishlist page, we might want a 'Remove' specific look but let's keep it consistent. */}
    </div>
  )
}
