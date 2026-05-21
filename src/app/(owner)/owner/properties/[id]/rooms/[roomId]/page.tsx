import { requireRole } from '@/lib/auth/requireRole'
import { getRoomById } from '@/lib/rooms/getRoomById'
import { getPropertyById } from '@/lib/properties/getPropertyById'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import { ArrowLeft, Edit, Trash2, Users, BedDouble, MousePointer2, CheckCircle2 } from 'lucide-react'
import { notFound, redirect } from 'next/navigation'
import { deleteRoom } from '@/lib/rooms/deleteRoom'

export default async function RoomDetailsPage({ params }: { params: Promise<{ id: string, roomId: string }> }) {
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
    <div className="max-w-5xl mx-auto px-4 py-12">
      <Link href={`/owner/properties/${id}/rooms`} className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-blue-600 mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Inventory
      </Link>

      <div className="flex flex-col md:flex-row md:items-start justify-between mb-10 gap-6">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight mb-2">{room.name}</h1>
          <p className="text-lg text-gray-500 italic">Room type at {property.name}</p>
        </div>

        <div className="flex items-center space-x-3">
          <Link href={`/owner/properties/${id}/rooms/${room.id}/edit`}>
            <Button variant="outline" size="sm" className="shadow-sm">
              <Edit className="w-4 h-4 mr-2" />
              Edit Room
            </Button>
          </Link>
          <form action={async () => {
            'use server'
            await deleteRoom(roomId)
            redirect(`/owner/properties/${id}/rooms`)
          }}>
            <Button variant="ghost" size="sm" className="text-red-500 hover:bg-red-50 hover:text-red-600">
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
          </form>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-6">About this room type</h2>
            <div className="text-gray-600 leading-relaxed whitespace-pre-wrap">
              {room.description}
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Facilities</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {room.facilities.map((facility: any) => (
                <div key={facility} className="flex items-center space-x-2 text-sm text-gray-600">
                  <CheckCircle2 className="w-4 h-4 text-blue-500 flex-shrink-0" />
                  <span>{facility}</span>
                </div>
              ))}
              {room.facilities.length === 0 && (
                <p className="text-sm text-gray-400 italic">No facilities listed for this room.</p>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-blue-600 p-8 rounded-3xl text-white shadow-xl shadow-blue-100">
            <div className="mb-8 pb-6 border-b border-blue-500/30 text-center">
              <div className="text-4xl font-black mb-1">${room.price_per_night}</div>
              <div className="text-[10px] font-bold text-blue-100 uppercase tracking-widest">per night</div>
            </div>

            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-blue-200" />
                  <span className="text-sm font-medium">Max Occupancy</span>
                </div>
                <span className="font-bold">{room.capacity} Guests</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <BedDouble className="w-4 h-4 text-blue-200" />
                  <span className="text-sm font-medium">Availability</span>
                </div>
                <span className="font-bold">{room.available_rooms} Units</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <MousePointer2 className="w-4 h-4 text-blue-200" />
                  <span className="text-sm font-medium">Room Size</span>
                </div>
                <span className="font-bold">{room.size_sqm || '--'} m²</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-blue-200/20 rounded flex items-center justify-center font-bold text-[8px]">BT</div>
                  <span className="text-sm font-medium">Bed Type</span>
                </div>
                <span className="font-bold">{room.bed_type || 'Standard'}</span>
              </div>
            </div>
          </div>

          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight text-center px-4 leading-relaxed">
            Guests will be able to select this room type once your property is approved by an administrator.
          </p>
        </div>
      </div>
    </div>
  )
}
