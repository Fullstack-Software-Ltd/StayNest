import Image from 'next/image'
import Link from 'next/link'
import { MapPin, Home, ChevronRight } from 'lucide-react'
import { Property } from '@/types/property'
import { Button } from '@/components/ui/Button'

interface PropertyCardProps {
  property: Property
}

export function PropertyCard({ property }: PropertyCardProps) {
  const statusColors = {
    draft: 'bg-gray-100 text-gray-700',
    pending: 'bg-amber-50 text-amber-700',
    approved: 'bg-emerald-50 text-emerald-700',
    rejected: 'bg-red-50 text-red-700',
  }

  return (
    <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-lg hover:scale-[1.02] transition-all duration-200 group">
      <div className="relative h-56 w-full bg-gray-50">
        {property.main_image_url ? (
          <Image
            src={property.main_image_url}
            alt={property.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300">
            <Home className="w-12 h-12" />
          </div>
        )}
        <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider ${statusColors[property.status]}`}>
          {property.status}
        </div>
      </div>

      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-bold text-gray-900 truncate flex-1 leading-tight mr-2">
            {property.name}
          </h3>
          <span className="text-[10px] bg-[var(--primary)]/5 text-[var(--primary)] px-2.5 py-1 rounded-lg font-medium uppercase tracking-tight">
            {property.type}
          </span>
        </div>

        <div className="flex items-center text-gray-500 text-sm mb-4">
          <MapPin className="w-3.5 h-3.5 mr-1.5 flex-shrink-0" />
          <span className="truncate">{property.city}, {property.country}</span>
        </div>

        <p className="text-gray-500 text-sm mb-6 line-clamp-2 h-10 leading-relaxed">
          {property.description}
        </p>

        <div className="flex items-center space-x-2 pt-4 border-t border-gray-100">
          <Link href={`/owner/properties/${property.id}`} className="flex-1">
            <Button variant="outline" size="sm" className="w-full">View Details</Button>
          </Link>
          <Link href={`/owner/properties/${property.id}/edit`}>
            <Button variant="ghost" size="sm" className="px-3">Edit</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
