'use client'

import React, { useEffect, useState } from 'react'
import { MapContainer, TileLayer, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { MAP_CONFIG, MAP_CONTAINER_STYLE } from '@/lib/maps/map-config'
import L from 'leaflet'
import { Map as MapIcon, Layers } from 'lucide-react'

// Fix for default marker icons in Leaflet with Next.js
const fixLeafletMarkers = () => {
    // @ts-ignore
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    });
};

interface MapViewProps {
  center?: [number, number]
  zoom?: number
  children?: React.ReactNode
  className?: string
}

// Helper to update map center when props change
function MapCenterController({ center }: { center: [number, number] }) {
  const map = useMap()
  useEffect(() => {
    if (center) {
      map.setView(center, map.getZoom())
    }
  }, [center, map])
  return null
}

export default function MapView({
  center = MAP_CONFIG.DEFAULT_CENTER,
  zoom = MAP_CONFIG.DEFAULT_ZOOM,
  children,
  className,
}: MapViewProps) {
  const [isMounted, setIsMounted] = useState(false)
  const [isSatellite, setIsSatellite] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    fixLeafletMarkers()
  }, [])

  if (!isMounted) {
    return (
      <div 
        className={`w-full h-full bg-gray-100 animate-pulse rounded-[1.5rem] flex items-center justify-center ${className}`}
        style={{ minHeight: '400px' }}
      >
        <span className="text-gray-400 font-bold text-sm uppercase tracking-widest">Loading Map...</span>
      </div>
    )
  }

  return (
    <div className={`w-full h-full relative group ${className}`} style={{ minHeight: '400px' }}>
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={false}
        style={MAP_CONTAINER_STYLE}
      >
        <TileLayer
          key={isSatellite ? 'satellite' : 'standard'}
          attribution={isSatellite ? MAP_CONFIG.SATELLITE_ATTRIBUTION : MAP_CONFIG.ATTRIBUTION}
          url={isSatellite ? MAP_CONFIG.SATELLITE_TILE_LAYER : MAP_CONFIG.TILE_LAYER}
          maxZoom={isSatellite ? 19 : 18}
        />
        <MapCenterController center={center} />
        {children}
      </MapContainer>

      {/* Satellite Toggle Control */}
      <div className="absolute bottom-6 right-6 z-[400]">
        <button
          onClick={() => setIsSatellite(!isSatellite)}
          className="flex items-center gap-2 px-4 py-2.5 bg-white/95 backdrop-blur-md border border-gray-100 rounded-xl shadow-2xl hover:bg-white transition-all active:scale-95 group/btn overflow-hidden"
          title={isSatellite ? "Switch to Map View" : "Switch to Satellite View"}
        >
          <div className={`p-1.5 rounded-lg transition-colors ${isSatellite ? 'bg-[var(--primary)]/10 text-[var(--primary)]' : 'bg-gray-100 text-gray-500'}`}>
            {isSatellite ? <MapIcon className="w-3.5 h-3.5" /> : <Layers className="w-3.5 h-3.5" />}
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest text-gray-900 pr-1">
            {isSatellite ? 'Standard' : 'Satellite'}
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:animate-shimmer" />
        </button>
      </div>
    </div>
  )
}
