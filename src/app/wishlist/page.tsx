'use client'

import { getUserWishlist } from '@/lib/wishlist/wishlistActions'
import { WishlistCard } from '@/components/wishlist/wishlist-card'
import { PageHeader } from '@/components/shared/page-header'
import { EmptyState } from '@/components/shared/empty-state'
import { useEffect, useState } from 'react'
import { PropertySearchResult } from '@/types/search'
import { useSettings } from '@/context/SettingsContext'
import { HouseLoader } from '@/components/shared/HouseLoader'

export default function WishlistPage() {
  const { t } = useSettings()
  const [wishlist, setWishlist] = useState<PropertySearchResult[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchWishlist() {
      try {
        const data = await getUserWishlist()
        setWishlist(data)
      } catch (error) {
        console.error('Error fetching wishlist:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchWishlist()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--warm-white)]">
        <HouseLoader size="lg" label="Loading wishlist" />
      </div>
    )
  }

  return (
    <div className="bg-[var(--warm-white)] min-h-screen pt-8 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <PageHeader
          title="My Wishlist"
          subtitle="All the places you've saved for your next adventure."
        />

        {wishlist.length === 0 ? (
          <div className="mt-12">
            <EmptyState
              variant="search"
              title="Your wishlist is empty"
              description="Start exploring and save your favorite properties to see them here."
              actionLabel="Explore Properties"
              actionHref="/search"
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            {wishlist.map((property) => (
              <WishlistCard key={property.id} property={property} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
