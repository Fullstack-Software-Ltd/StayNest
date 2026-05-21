import { searchProperties } from '@/lib/search/searchProperties'
import { SearchBar } from '@/components/search/SearchBar'
import { SearchFilters as SearchFiltersType } from '@/types/search'
import { SearchClientWrapper } from '@/components/search/SearchClientWrapper'

export default async function SearchPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ [key: string]: string | string[] | undefined }> 
}) {
  const params = await searchParams
  
  const filters: SearchFiltersType = {
    destination: params.destination as string,
    type: params.type as string,
    minPrice: params.minPrice ? parseInt(params.minPrice as string) : undefined,
    maxPrice: params.maxPrice ? parseInt(params.maxPrice as string) : undefined,
    capacity: params.capacity ? parseInt(params.capacity as string) : (params.guests ? parseInt(params.guests as string) : undefined),
    checkIn: params.checkIn as string,
    checkOut: params.checkOut as string,
    guests: params.guests ? parseInt(params.guests as string) : undefined,
  }

  const results = await searchProperties(filters)
  const hasActiveFilters = Object.values(filters).some(v => v !== undefined && v !== '')

  return (
    <div className="flex flex-col min-h-screen bg-[var(--background)]">
      {/* ─── Sticky Search Header ───────────────── */}
      <div className="bg-white/85 backdrop-blur-xl border-b border-gray-100 py-4 sm:py-5 sticky top-[72px] sm:top-[84px] z-40 shadow-sm px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-4xl mx-auto">
          <SearchBar />
        </div>
      </div>

      {/* ─── Split Screen Content ───────────────── */}
      <SearchClientWrapper 
        results={results as any}
        hasActiveFilters={hasActiveFilters}
        destination={filters.destination}
        totalCount={results.length}
      />
    </div>
  )
}
