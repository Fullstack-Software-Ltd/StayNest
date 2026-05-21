'use client'

import React from 'react'
import { Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import { useSettings } from '@/context/SettingsContext'

// Custom StayNest Marker Icon Factory
const createStayNestIcon = (price?: string, isHighlighted?: boolean) => L.divIcon({
  className: 'custom-div-icon',
  html: `
    <div style="
      background-color: ${isHighlighted ? 'var(--primary)' : 'white'}; 
      color: ${isHighlighted ? 'white' : 'var(--primary)'};
      padding: 6px 10px;
      border-radius: 12px;
      border: 2px solid var(--primary);
      box-shadow: 0 4px 12px -2px rgb(0 0 0 / 0.15);
      font-weight: 800;
      font-size: 11px;
      white-space: nowrap;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      transform: scale(${isHighlighted ? '1.1' : '1'});
      z-index: ${isHighlighted ? '1000' : '1'};
    ">
      ${price || 'Stay'}
    </div>
  `,
  iconSize: [60, 32],
  iconAnchor: [30, 32],
  popupAnchor: [0, -32],
})

interface MapMarkerProps {
    position: [number, number]
    title?: string
    price?: number
    image?: string
    rating?: number
    isHighlighted?: boolean
    draggable?: boolean
    onDragEnd?: (lat: number, lng: number) => void
    onClick?: () => void
}

export default function MapMarker({ 
    position, 
    title, 
    price, 
    image, 
    rating, 
    isHighlighted, 
    draggable,
    onDragEnd,
    onClick 
}: MapMarkerProps) {
    const { formatPrice } = useSettings()

    const icon = createStayNestIcon(price ? formatPrice(price) : undefined, isHighlighted)

    return (
        <Marker 
          position={position} 
          icon={icon}
          draggable={draggable}
          eventHandlers={{
            click: onClick,
            dragend: (e) => {
              const marker = e.target
              const position = marker.getLatLng()
              onDragEnd?.(position.lat, position.lng)
            }
          }}
        >
            {title && (
                <Popup className="staynest-popup rounded-3xl overflow-hidden shadow-2xl border-none">
                    <div className="w-56 overflow-hidden">
                        {image && (
                          <div className="h-32 w-full relative">
                            <img src={image} alt={title} className="w-full h-full object-cover" />
                          </div>
                        )}
                        <div className="p-4 space-y-2">
                            <div className="flex justify-between items-start gap-2">
                              <h4 className="text-sm font-black text-gray-900 tracking-tight leading-tight">{title}</h4>
                              {rating && (
                                <div className="flex items-center gap-1 text-xs font-bold text-gray-900">
                                  <span>★</span>
                                  <span>{rating}</span>
                                </div>
                              )}
                            </div>
                            {price && (
                                <div className="text-[12px] font-black text-[var(--primary)] uppercase tracking-widest tabular-nums">
                                    {formatPrice(price)}<span className="text-[8px] opacity-60">/night</span>
                                </div>
                            )}
                        </div>
                    </div>
                </Popup>
            )}
        </Marker>
    )
}
