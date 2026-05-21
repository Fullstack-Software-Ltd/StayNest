'use client'

import dynamic from 'next/dynamic'
import { Card } from '@/components/shared/Card'
import { MAP_CONFIG } from '@/lib/maps/map-config'
import { MapPin } from 'lucide-react'

// Dynamic imports for Leaflet components (client-side only)
const MapView = dynamic(() => import('./map-view'), { 
  ssr: false,
  loading: () => (
    <div className="w-full h-[400px] bg-gray-100 animate-pulse rounded-[1.5rem] flex items-center justify-center">
      <span className="text-gray-400 font-bold text-sm uppercase tracking-widest">Loading Map...</span>
    </div>
  )
})

const MapMarker = dynamic(() => import('./map-marker'), { ssr: false })

interface PropertyMapProps {
  latitude?: number | null
  longitude?: number | null
  address?: string
  propertyName?: string
  price?: number
}

export function PropertyMap({ latitude, longitude, address, propertyName, price }: PropertyMapProps) {
  if (!latitude || !longitude) {
    return (
      <Card variant="default" className="p-12 text-center bg-gray-50 border-dashed border-2 border-gray-200">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
            <MapPin className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-gray-900 tracking-tight">Location Not Available</h4>
            <p className="text-xs text-gray-500 max-w-xs mx-auto">This property doesn't have exact coordinates set. Address: {address}</p>
          </div>
        </div>
      </Card>
    )
  }

  const position: [number, number] = [Number(latitude), Number(longitude)]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between px-2">
        <div className="space-y-1">
          <h3 className="text-lg font-bold text-gray-900 tracking-tight">Location</h3>
          <p className="text-sm text-gray-500 font-medium">{address}</p>
        </div>
      </div>
      
      <div className="h-[400px] w-full rounded-[2rem] overflow-hidden border border-gray-100 shadow-xl shadow-black/[0.02]">
        <MapView center={position} zoom={MAP_CONFIG.PROPERTY_ZOOM}>
          <MapMarker 
            position={position} 
            title={propertyName} 
            price={price} 
          />
        </MapView>
      </div>
    </div>
  )
}
