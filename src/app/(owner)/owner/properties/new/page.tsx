import { requireRole } from '@/lib/auth/requireRole'
import { PropertyForm } from '@/components/properties/PropertyForm'

export default async function NewPropertyPage() {
  await requireRole(['owner', 'admin'])

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Create Listing</h1>
        <p className="text-gray-500 mt-2">Provide the necessary details to start hosting.</p>
      </div>
      <PropertyForm />
    </div>
  )
}
