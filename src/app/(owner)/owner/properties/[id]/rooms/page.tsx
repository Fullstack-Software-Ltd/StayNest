import { requireRole } from '@/lib/auth/requireRole'
import { getPropertyRooms } from '@/lib/rooms/getPropertyRooms'
import { getPropertyById } from '@/lib/properties/getPropertyById'
import { RoomCard } from '@/components/rooms/RoomCard'
import { RoomEmptyState } from '@/components/rooms/RoomEmptyState'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import { Plus, ArrowLeft, Home } from 'lucide-react'
import { notFound, redirect } from 'next/navigation'

export default async function PropertyRoomsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { profile } = await requireRole(['owner', 'admin'])
  const property = await getPropertyById(id)

  if (!property) {
    notFound()
  }

  // Security check
  if (property.owner_id !== profile.id && profile.role !== 'admin') {
    redirect('/unauthorized')
  }

  const rooms = await getPropertyRooms(id)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link href={`/owner/properties/${id}`} className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-blue-600 mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Property Details
      </Link>

      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
        <div>
          <div className="flex items-center space-x-2 text-blue-600 mb-1">
            <Home className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-widest">{property.name}</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Room Inventory</h1>
          <p className="text-gray-500 mt-2">Manage the different room types and pricing for this property.</p>
        </div>
        
        {rooms.length > 0 && (
          <Link href={`/owner/properties/${id}/rooms/new`}>
            <Button className="shadow-lg shadow-blue-100">
              <Plus className="w-4 h-4 mr-2" />
              Add New Room
            </Button>
          </Link>
        )}
      </div>

      <div className="bg-blue-50/50 rounded-3xl p-8 mb-10 border border-blue-100/50">
        <div className="flex flex-wrap gap-8 items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-white rounded-2xl shadow-sm">
              <span className="text-2xl font-black text-blue-600">{rooms.length}</span>
            </div>
            <div>
              <div className="text-sm font-bold text-gray-900 leading-none">Total Room Types</div>
              <div className="text-[10px] text-gray-400 font-bold uppercase tracking-tight mt-1">Listed</div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-white rounded-2xl shadow-sm">
              <span className="text-2xl font-black text-blue-600">
                {rooms.reduce((acc: number, room: any) => acc + room.available_rooms, 0)}
              </span>
            </div>
            <div>
              <div className="text-sm font-bold text-gray-900 leading-none">Total Units</div>
              <div className="text-[10px] text-gray-400 font-bold uppercase tracking-tight mt-1">Available for Booking</div>
            </div>
          </div>
          <div className="hidden lg:block">
            <p className="text-xs text-blue-400/80 max-w-xs leading-tight">
              Pricing and availability changes updated here will take effect immediately on guest search.
            </p>
          </div>
        </div>
      </div>

      {rooms.length === 0 ? (
        <RoomEmptyState propertyId={id} />
      ) : (
        <div className="space-y-6">
          {rooms.map((room: any) => (
            <RoomCard key={room.id} room={room} propertyId={id} />
          ))}
        </div>
      )}
    </div>
  )
}
