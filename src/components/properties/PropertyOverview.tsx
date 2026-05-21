'use client'

import { Property } from '@/types/property'
import { Info, ShieldCheck, Map, Sparkles, MapPin, Home, Star, Wifi, Car, Waves, Dumbbell, Wind, Utensils, Tv, WashingMachine } from 'lucide-react'
import { useSettings } from '@/context/SettingsContext'
import { Card, CardHeader, CardContent } from '@/components/shared/Card'
import dynamic from 'next/dynamic'
import { MAP_CONFIG } from '@/lib/maps/map-config'

const MapView = dynamic(() => import('@/components/maps/map-view'), { 
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-gray-50 animate-pulse rounded-2xl flex items-center justify-center min-h-[240px]">
      <span className="text-gray-400 font-bold text-xs uppercase tracking-widest">Loading Map...</span>
    </div>
  )
})
const MapMarker = dynamic(() => import('@/components/maps/map-marker'), { ssr: false })

interface PropertyOverviewProps {
  property: Property
}

export function PropertyOverview({ property }: PropertyOverviewProps) {
  const { t } = useSettings()

  const hasCoordinates = property.latitude && property.longitude
  const position: [number, number] | null = hasCoordinates
    ? [Number(property.latitude), Number(property.longitude)]
    : null

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
      {/* Main Content */}
      <div className="lg:col-span-2 space-y-8">
        <Card variant="default" padding="lg" className="rounded-2xl border-gray-100">
          <CardHeader
            title={t('details.about')}
            icon={<Info className="w-5 h-5 text-[var(--primary)]" />}
          />
          <CardContent>
            <div className="text-gray-600 text-base sm:text-lg whitespace-pre-wrap leading-relaxed font-normal text-balance">
              {property.description}
            </div>
          </CardContent>
        </Card>

        {/* Amenities section */}
        {property.amenities && property.amenities.length > 0 && (
          <Card variant="outline" padding="lg" className="rounded-2xl border-gray-100">
            <CardHeader
              title={t('details.amenities') || 'Amenities & Features'}
              icon={<Sparkles className="w-5 h-5 text-[var(--accent)]" />}
            />
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                {property.amenities.map((amenity) => {
                  const standardMap: Record<string, { label: string, icon: any }> = {
                    wifi: { label: 'High-speed WiFi', icon: Wifi },
                    parking: { label: 'Free Parking', icon: Car },
                    pool: { label: 'Swimming Pool', icon: Waves },
                    gym: { label: 'Fitness Center', icon: Dumbbell },
                    ac: { label: 'Air Conditioning', icon: Wind },
                    kitchen: { label: 'Full Kitchen', icon: Utensils },
                    tv: { label: 'Smart TV', icon: Tv },
                    washer: { label: 'Washer / Dryer', icon: WashingMachine },
                  }
                  
                  const isStandard = !!standardMap[amenity]
                  const Icon = isStandard ? standardMap[amenity].icon : Sparkles
                  const label = isStandard ? standardMap[amenity].label : amenity

                  return (
                    <div key={amenity} className="flex items-center gap-3 group">
                      <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center border border-gray-100 group-hover:bg-[var(--primary)]/5 group-hover:border-[var(--primary)]/20 transition-all">
                        <Icon className="w-5 h-5 text-gray-500 group-hover:text-[var(--primary)] transition-colors" />
                      </div>
                      <span className="text-sm font-medium text-gray-600 group-hover:text-gray-900 transition-colors capitalize">
                        {label}
                      </span>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        )}

        <Card variant="glass" padding="lg" className="rounded-2xl border-[var(--primary)]/5">
          <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
            <div className="w-14 h-14 rounded-xl bg-[var(--primary)]/10 flex items-center justify-center shrink-0 border border-[var(--primary)]/10">
              <ShieldCheck className="w-7 h-7 text-[var(--primary)]" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight text-balance">
                {t('details.guarantee_title')}
              </h2>
              <p className="text-gray-500 font-medium text-sm sm:text-base leading-relaxed max-w-2xl">
                {t('details.guarantee_text')}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Sidebar Info removed as requested */}
    </div>
  )
}
