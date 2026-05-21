'use client'

import { useState, useEffect } from 'react'
import { Heart } from 'lucide-react'
import { cn } from '@/utils/cn'
import { toggleWishlist, getIsWishlisted } from '@/lib/wishlist/wishlistActions'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { useSession } from 'next-auth/react'

interface SavePropertyButtonProps {
  propertyId: string
  className?: string
  size?: number
}

export function SavePropertyButton({ propertyId, className, size = 20 }: SavePropertyButtonProps) {
  const [isSaved, setIsSaved] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { data: session } = useSession()

  useEffect(() => {
    async function checkStatus() {
      const status = await getIsWishlisted(propertyId)
      setIsSaved(status)
    }
    checkStatus()
  }, [propertyId])

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!session?.user) {
      toast.error('Please sign in to save properties to your wishlist.')
      const params = new URLSearchParams()
      params.set('redirect', `/properties/${propertyId}`)
      router.push(`/login?${params.toString()}`)
      return
    }

    setLoading(true)
    try {
      await toggleWishlist(propertyId)
      setIsSaved(!isSaved)
      toast.success(isSaved ? 'Removed from wishlist' : 'Saved to wishlist')
    } catch (error) {
      toast.error('Failed to update wishlist')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={cn(
        "p-2 rounded-full backdrop-blur-md transition-all active:scale-90",
        isSaved 
          ? "bg-[var(--accent)] text-white shadow-lg shadow-[var(--accent)]/20" 
          : "bg-white/70 text-gray-900 border border-white/50 hover:bg-white",
        className
      )}
    >
      <Heart 
        size={size} 
        className={cn(isSaved && "fill-current")} 
      />
    </button>
  )
}
