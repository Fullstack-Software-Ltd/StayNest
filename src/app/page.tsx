import { getFeaturedProperties } from '@/lib/properties/getFeaturedProperties'
import { getHomepageStats } from '@/lib/stats/getHomepageStats'
import { HomePageClient } from '@/components/home/HomePageClient'
export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const [properties, stats] = await Promise.all([
    getFeaturedProperties(12),
    getHomepageStats()
  ])

  return (
    <HomePageClient 
      initialProperties={properties as any} 
      stats={stats} 
    />
  )
}
