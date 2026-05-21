import { requireRole } from '@/lib/auth/requireRole'
import { getPropertyById } from '@/lib/properties/getPropertyById'
import { RoomForm } from '@/components/rooms/RoomForm'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default async function NewRoomPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { profile } = await requireRole(['owner', 'admin'])
  const property = await getPropertyById(id)

  if (!property) {
    console.warn(`[NewRoomPage] Property NOT FOUND: ${id}. User: ${profile.email}`)
    redirect('/owner/dashboard') // Redirect instead of 404 to provide better UX
  }

  // Security check: Only owner or admin can add rooms
  if (property.owner_id !== profile.id && profile.role !== 'admin') {
    console.error(`[NewRoomPage] SECURITY BREACH: User ${profile.email} tried to add a room to property ${id} owned by ${property.owner_id}`)
    redirect('/unauthorized')
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <Link href={`/owner/properties/${id}/rooms`} className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-blue-600 mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Cancel and Back to Rooms
      </Link>

      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Add Room Type</h1>
        <p className="text-gray-500 mt-2">Create a new category for rooms at **{property.name}**.</p>
      </div>
      
      <RoomForm propertyId={id} />
    </div>
  )
}
