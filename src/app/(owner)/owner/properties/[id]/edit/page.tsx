import { requireRole } from '@/lib/auth/requireRole'
import { getPropertyById } from '@/lib/properties/getPropertyById'
import { PropertyEditForm } from '@/components/properties/PropertyEditForm'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'

export default async function EditPropertyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { profile } = await requireRole(['owner', 'admin'])
  const property = await getPropertyById(id)

  if (!property) {
    notFound()
  }

  // Security check: Only the owner or admin can edit
  if (property.owner_id !== profile.id && profile.role !== 'admin') {
    redirect('/unauthorized')
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <Link href={`/owner/properties/${id}`} className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-[var(--primary)] mb-8 transition-colors group">
        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
        Back to Property
      </Link>

      <div className="mb-12">
        <h1 className="text-4xl font-black text-gray-900 tracking-tighter">Edit <span className="text-[var(--primary)]">Listing.</span></h1>
        <p className="text-gray-500 font-medium text-lg mt-2">Update your property details and visibility.</p>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl shadow-black/[0.02] p-8 sm:p-12">
        <PropertyEditForm property={property} />
      </div>
    </div>
  )
}
