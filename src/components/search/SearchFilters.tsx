'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Filter, X, ChevronDown, Check, Sparkles, Star, ArrowUpNarrowWide, ArrowDownWideNarrow, Clock } from 'lucide-react'
import { useSettings } from '@/context/SettingsContext'
import { Input } from '@/components/shared/Input'
import { Button } from '@/components/shared/Button'

export function SearchFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { t, currency, formatPrice } = useSettings()
  
  const currentType = searchParams.get('type') || t('common.all')
  const currentCapacity = searchParams.get('capacity') || t('common.any')
  const currentMinPrice = searchParams.get('minPrice') || ''
  const currentMaxPrice = searchParams.get('maxPrice') || ''
  const currentSort = searchParams.get('sort') || 'newest'
  const currentAmenities = searchParams.get('amenities')?.split(',') || []

  const updateFilters = (key: string, value: string | string[]) => {
    const params = new URLSearchParams(searchParams.toString())
    
    if (Array.isArray(value)) {
       if (value.length > 0) {
          params.set(key, value.join(','))
       } else {
          params.delete(key)
       }
    } else {
      if (value && value !== t('common.all') && value !== t('common.any')) {
        params.set(key, value)
      } else {
        params.delete(key)
      }
    }
    router.push(`/search?${params.toString()}`, { scroll: false })
  }

  const toggleAmenity = (amenity: string) => {
    const next = currentAmenities.includes(amenity)
      ? currentAmenities.filter(a => a !== amenity)
      : [...currentAmenities, amenity]
    updateFilters('amenities', next)
  }

  const clearFilters = () => {
    router.push('/search')
  }

  const propertyTypes = [
    { label: t('common.all'), value: t('common.all') },
    { label: 'Hotel', value: 'Hotel' },
    { label: 'Apartment', value: 'Apartment' },
    { label: 'Villa', value: 'Villa' },
    { label: 'Resort', value: 'Resort' },
    { label: 'Guest house', value: 'Guesthouse' },
  ]
  
  const capacities = [t('common.any'), '1', '2', '3', '4', '5+']

  const amenities = [
    'WiFi', 'Pool', 'Gym', 'Parking', 'Kitchen', 'Workspace', 'Security', 'AC', 'Breakfast'
  ]

  const sortOptions = [
    { id: 'newest', label: 'Newest first', icon: Clock },
    { id: 'price_asc', label: 'Price: Low to High', icon: ArrowUpNarrowWide },
    { id: 'price_desc', label: 'Price: High to Low', icon: ArrowDownWideNarrow },
    { id: 'rating_desc', label: 'Top Rated', icon: Star },
  ]

  return (
    <div className="sticky top-[180px] space-y-6">
      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl shadow-black/[0.02] p-8 overflow-hidden">
        <div className="flex items-center justify-between mb-10">
           <div>
              <h3 className="text-xl font-black text-gray-900 tracking-tighter">Filters.</h3>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Refine your results</p>
           </div>
           <button 
             onClick={clearFilters}
             className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-50 text-gray-400 hover:bg-gray-100 transition-colors"
           >
              <X className="w-5 h-5" />
           </button>
        </div>

        <div className="space-y-12">
          {/* Sorting */}
          <div className="space-y-4">
             <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Sort By</label>
             <div className="grid grid-cols-1 gap-2">
                {sortOptions.map((opt) => (
                   <button
                     key={opt.id}
                     onClick={() => updateFilters('sort', opt.id)}
                     className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
                       currentSort === opt.id 
                        ? 'border-[var(--primary)] bg-[var(--primary)]/5 text-[var(--primary)] shadow-sm' 
                        : 'border-gray-50 bg-gray-50/50 text-gray-500 hover:border-gray-100'
                     }`}
                   >
                      <div className="flex items-center gap-3">
                         <opt.icon className="w-4 h-4" />
                         <span className="text-xs font-bold">{opt.label}</span>
                      </div>
                      {currentSort === opt.id && <Check className="w-4 h-4" />}
                   </button>
                ))}
             </div>
          </div>

          {/* Property Type */}
          <div className="space-y-4">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Stay Category</label>
            <div className="flex flex-wrap gap-2">
              {propertyTypes.map((type) => (
                <button
                  key={type.value}
                  onClick={() => updateFilters('type', type.value)}
                  className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                    currentType === type.value 
                      ? 'bg-gray-900 text-white shadow-lg shadow-black/10' 
                      : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="space-y-4">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Budget Range</label>
            <div className="grid grid-cols-2 gap-3">
              <div className="relative group">
                 <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-gray-400 group-focus-within:text-[var(--primary)] transition-colors">MIN</span>
                 <input
                    type="number"
                    value={currentMinPrice}
                    onChange={(e) => updateFilters('minPrice', e.target.value)}
                    className="w-full h-14 pl-12 pr-4 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-[var(--primary)]/10 text-xs font-bold tabular-nums"
                 />
              </div>
              <div className="relative group">
                 <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-gray-400 group-focus-within:text-[var(--primary)] transition-colors">MAX</span>
                 <input
                    type="number"
                    value={currentMaxPrice}
                    onChange={(e) => updateFilters('maxPrice', e.target.value)}
                    className="w-full h-14 pl-12 pr-4 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-[var(--primary)]/10 text-xs font-bold tabular-nums"
                 />
              </div>
            </div>
          </div>

          {/* Amenities */}
          <div className="space-y-4">
             <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Amenities</label>
             <div className="grid grid-cols-2 gap-2">
                {amenities.map((amenity) => {
                  const isSelected = currentAmenities.includes(amenity)
                  return (
                    <button
                      key={amenity}
                      onClick={() => toggleAmenity(amenity)}
                      className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                        isSelected 
                          ? 'border-[var(--primary)] bg-[var(--primary)]/5 text-[var(--primary)]' 
                          : 'border-gray-50 bg-gray-50/50 text-gray-500 hover:border-gray-100'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded flex items-center justify-center border transition-colors ${
                        isSelected ? 'bg-[var(--primary)] border-[var(--primary)]' : 'bg-white border-gray-200'
                      }`}>
                         {isSelected && <Check className="w-3 h-3 text-white" />}
                      </div>
                      <span className="text-[10px] font-bold">{amenity}</span>
                    </button>
                  )
                })}
             </div>
          </div>
        </div>
      </div>

      {/* Quick Promotion Card */}
      <div className="bg-gradient-to-br from-[var(--primary)] to-[var(--primary-dark)] rounded-[2.5rem] p-8 text-white relative overflow-hidden group shadow-2xl shadow-[var(--primary)]/10">
         <Sparkles className="absolute -top-4 -right-4 w-24 h-24 text-white/5 group-hover:scale-125 transition-transform duration-700" />
         <div className="relative z-10 space-y-4">
            <h4 className="text-xl font-black tracking-tight leading-tight">Become a Host.</h4>
            <p className="text-xs font-medium text-white/60 leading-relaxed">
               Earn up to {formatPrice(1200)}/month by sharing your space in Rwanda.
            </p>
            <button 
               onClick={() => router.push('/become-a-host')}
               className="h-12 px-6 bg-white text-[var(--primary)] rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[var(--accent)] hover:text-white transition-all transform group-hover:translate-x-1"
            >
               Learn More
            </button>
         </div>
      </div>
    </div>
  )
}
