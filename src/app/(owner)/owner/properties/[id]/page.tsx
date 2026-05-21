import { requireRole } from '@/lib/auth/requireRole'
import { getPropertyById } from '@/lib/properties/getPropertyById'
import { Button } from '@/components/shared/Button'
import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Home, ArrowLeft, Edit, Trash2, Bed, CheckCircle, Plus } from 'lucide-react'
import { revalidatePath } from 'next/cache'
import { notFound, redirect } from 'next/navigation'
import { deleteProperty } from '@/lib/properties/deleteProperty'
import { getPropertyRooms } from '@/lib/rooms/getPropertyRooms'
import { RoomCard } from '@/components/rooms/RoomCard'
import { RoomEmptyState } from '@/components/rooms/RoomEmptyState'
import { approveProperty } from '@/lib/properties/approveProperty'

export default async function PropertyDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { profile } = await requireRole(['owner', 'admin'])
  const [property, rooms] = await Promise.all([
    getPropertyById(id),
    getPropertyRooms(id)
  ])

  if (!property) {
    notFound()
  }

  // Security check: Only the owner or admin can view this private page
  if (property.owner_id !== profile.id && profile.role !== 'admin') {
    redirect('/unauthorized')
  }

  const statusColors = {
    draft: 'bg-gray-100 text-gray-800',
    pending: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <Link href="/owner/properties" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-blue-600 mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Properties
      </Link>

      <div className="flex flex-col md:flex-row md:items-start justify-between mb-8 gap-6">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <h1 className="text-4xl font-bold text-gray-900 tracking-tight">{property.name}</h1>
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest ${statusColors[property.status as keyof typeof statusColors]}`}>
              {property.status}
            </span>
          </div>
          <div className="flex items-center text-gray-500">
            <MapPin className="w-4 h-4 mr-2 text-blue-500" />
            <span className="text-lg">{property.address}, {property.city}, {property.country}</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {profile.role === 'admin' && property.status !== 'approved' && (
            <form action={async () => {
              'use server'
              await approveProperty(id)
              revalidatePath(`/owner/properties/${id}`)
            }}>
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/20 rounded-xl px-6 font-bold" leftIcon={<CheckCircle className="w-4 h-4" />}>
                Approve Property
              </Button>
            </form>
          )}
          <Link href={`/owner/properties/${property.id}/rooms/new`}>
            <Button className="bg-[var(--primary)] hover:bg-[var(--primary)]/90 shadow-lg shadow-[var(--primary)]/10 rounded-xl px-6 font-bold">
              <Plus className="w-4 h-4 mr-2" />
              Add Unit / Room
            </Button>
          </Link>
          <Link href={`/owner/properties/${property.id}/edit`}>
            <Button variant="outline" className="rounded-xl px-6 font-bold">
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
          </Link>
          <form action={async () => {
            'use server'
            let success = false
            try {
              await deleteProperty(id)
              revalidatePath('/owner/properties')
              success = true
            } catch (err) {
              console.error('Failed to delete property:', err)
            }
            if (success) {
              redirect('/owner/properties')
            } else {
              redirect(`/owner/properties/${id}?error=delete-failed`)
            }
          }}>
            <Button variant="ghost" size="sm" className="text-red-600 hover:bg-red-50 hover:text-red-700">
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
          </form>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
          <div className="relative h-[400px] w-full rounded-3xl overflow-hidden border border-gray-100 shadow-xl shadow-blue-50">
            {property.main_image_url ? (
              <Image 
                src={property.main_image_url} 
                alt={property.name} 
                fill 
                sizes="(max-width: 1024px) 100vw, 800px"
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-50 flex items-center justify-center text-gray-300">
                <Home className="w-24 h-24" />
              </div>
            )}
          </div>

          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm leading-relaxed">
            <h2 className="text-xl font-bold mb-4 text-gray-900">About this property</h2>
            <div className="text-gray-600 whitespace-pre-wrap">
              {property.description}
            </div>
          </div>

          <div className="pt-10 space-y-6">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[var(--primary)]/5 flex items-center justify-center text-[var(--primary)]">
                  <Bed className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-gray-900 tracking-tight">Accommodation Inventory</h2>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-0.5">Manage Room pricing and availability</p>
                </div>
              </div>
              <div className="bg-gray-100 text-gray-500 font-black text-[10px] px-3 py-1 rounded-full uppercase tracking-widest">
                {rooms.length} Types
              </div>
            </div>

            {rooms.length === 0 ? (
              <RoomEmptyState propertyId={id} />
            ) : (
              <div className="space-y-4">
                {rooms.map((room: any) => (
                  <RoomCard key={room.id} room={room} propertyId={id} />
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-blue-600 p-8 rounded-3xl text-white shadow-xl shadow-blue-200">
            <h3 className="text-lg font-bold mb-4">Property Overview</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-blue-500/30">
                <span className="text-blue-100 text-sm">Type</span>
                <span className="font-semibold">{property.type}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-blue-500/30">
                <span className="text-blue-100 text-sm">Status</span>
                <span className="font-semibold capitalize">{property.status}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-blue-500/30">
                <span className="text-blue-100 text-sm">City</span>
                <span className="font-semibold">{property.city}</span>
              </div>
              <div className="pt-4">
                <p className="text-xs text-blue-100 leading-tight">
                  This property is currently in {property.status} status. It will be visible to travelers once approved by an administrator.
                </p>
              </div>
            </div>
          </div>

          <Link href="/owner/dashboard" className="block">
            <Button variant="outline" className="w-full justify-between group">
              Back to Dashboard
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

function ChevronRight(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
  )
}
