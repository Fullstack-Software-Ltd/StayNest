import { requireRole } from '@/lib/auth/requireRole'
import { getRoomById } from '@/lib/rooms/getRoomById'
import { getPropertyById } from '@/lib/properties/getPropertyById'
import { RoomForm } from '@/components/rooms/RoomForm'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default async function EditRoomPage({ params }: { params: Promise<{ id: string, roomId: string }> }) {
  const { id, roomId } = await params
  const { profile } = await requireRole(['owner', 'admin'])
  const property = await getPropertyById(id)
  const room = await getRoomById(roomId)

  if (!property || !room) {
    notFound()
  }

  // Security check
  if (property.owner_id !== profile.id && profile.role !== 'admin') {
    redirect('/unauthorized')
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <Link href={`/owner/properties/${id}/rooms/${room.id}`} className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-blue-600 mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Cancel and Go Back
      </Link>

      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Edit "{room.name}"</h1>
        <p className="text-gray-500 mt-2">Update the specifications for this room type at **{property.name}**.</p>
      </div>
      
      <RoomForm propertyId={id} room={room} />
    </div>
  )
}
