import { requireRole } from '@/lib/auth/requireRole'
import { getOwnerProperties } from '@/lib/properties/getOwnerProperties'
import { PropertyCard } from '@/components/properties/PropertyCard'
import { PropertyEmptyState } from '@/components/properties/PropertyEmptyState'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import { Plus, ArrowLeft } from 'lucide-react'

export default async function OwnerPropertiesPage() {
  await requireRole(['owner', 'admin'])
  const properties = await getOwnerProperties()

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link href="/owner/dashboard" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-blue-600 mb-8 transition-colors group">
        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
        Back to Dashboard
      </Link>
      
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">My Properties</h1>
          <p className="text-gray-500 mt-2">Manage your listings and property details.</p>
        </div>
        {properties.length > 0 && (
          <Link href="/owner/properties/new">
            <Button className="shadow-lg shadow-blue-100">
              <Plus className="w-4 h-4 mr-2" />
              Add Property
            </Button>
          </Link>
        )}
      </div>

      {properties.length === 0 ? (
        <PropertyEmptyState />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {properties.map((property: any) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      )}
    </div>
  )
}
