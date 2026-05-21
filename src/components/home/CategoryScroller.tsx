'use client'

import { useRef, useState } from 'react'
import Link from 'next/link'
import { Building2, Warehouse, Sparkles, Castle, Home } from 'lucide-react'
import { useSettings } from '@/context/SettingsContext'

export function CategoryScroller() {
  const { t } = useSettings()
  const scrollRef = useRef<HTMLDivElement>(null)
  const [activeType, setActiveType] = useState<string | null>('Hotel')

  const categories = [
    { icon: Building2, label: 'Hotels', type: 'Hotel' },
    { icon: Warehouse, label: 'Guesthouses', type: 'Guesthouse' },
    { icon: Sparkles, label: 'Resorts', type: 'Resort' },
    { icon: Castle, label: 'Villas', type: 'Villa' },
    { icon: Home, label: 'Apartments', type: 'Apartment' },
  ]

  return (
    <div className="relative group/scroller bg-transparent">
      {/* Scrollable Container */}
      <div
        ref={scrollRef}
        className="flex items-center gap-10 sm:gap-16 overflow-x-auto py-6 scrollbar-none snap-x"
      >
        {categories.map((cat) => (
          <Link
            key={cat.type}
            href={`/search?type=${cat.type}`}
            onClick={() => setActiveType(cat.type)}
            className={`
              relative flex flex-col items-center gap-2 
              transition-all duration-300 cursor-pointer snap-start group/item
              ${activeType === cat.type ? 'text-[var(--luxury-green)]' : 'text-gray-400 hover:text-[var(--luxury-green)]'}
            `}
          >
            {/* Icon - Minimalist Scale */}
            <div className={`
              transition-transform duration-500 group-hover/item:scale-110
              ${activeType === cat.type ? 'text-[var(--luxury-green)]' : 'text-gray-300'}
            `}>
              <cat.icon className="w-5 h-5" strokeWidth={1} />
            </div>

            <span className="text-[8px] font-black uppercase tracking-[0.25em] whitespace-nowrap">
              {cat.label}
            </span>

            {/* Subtle underlined active state */}
            {activeType === cat.type && (
              <div className="absolute -bottom-1 left-0 right-0 h-[1.5px] bg-[var(--luxury-green)]" />
            )}
          </Link>
        ))}
        
        {/* Minimal Filter Button */}
        <div className="ml-auto hidden sm:flex items-center gap-3 pl-8 border-l border-gray-100">
           <span className="text-[8px] font-black uppercase tracking-[0.25em] text-gray-400">Filters</span>
        </div>
      </div>
    </div>
  )
}
