'use client'

import { useState, useTransition } from 'react'
import { Heart } from 'lucide-react'
import { toggleFavorite } from '@/lib/favorites/favoriteActions'
import { cn } from '@/utils/cn'

interface FavoriteButtonProps {
  propertyId: string
  initialIsFavorited: boolean
  className?: string
}

export function FavoriteButton({ propertyId, initialIsFavorited, className }: FavoriteButtonProps) {
  const [isFavorited, setIsFavorited] = useState(initialIsFavorited)
  const [isPending, startTransition] = useTransition()

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    // Optimistic UI
    const nextState = !isFavorited
    setIsFavorited(nextState)

    startTransition(async () => {
      try {
        await toggleFavorite(propertyId)
      } catch (err) {
        // Rollback on error
        setIsFavorited(!nextState)
        console.error('Failed to toggle favorite:', err)
      }
    })
  }

  return (
    <button
      onClick={handleToggle}
      disabled={isPending}
      className={cn(
        'w-9 h-9 flex items-center justify-center rounded-full transition-all active:scale-90',
        'bg-white/80 backdrop-blur-sm shadow-sm border border-gray-100',
        'hover:bg-white hover:scale-105',
        className
      )}
    >
      <Heart
        className={cn(
          'w-5 h-5 transition-colors',
          isFavorited ? 'fill-red-500 text-red-500' : 'text-gray-400 group-hover:text-gray-600'
        )}
      />
    </button>
  )
}
