import { getPublicPropertyById } from '@/lib/properties/getPublicPropertyById'
import { getPublicPropertyRooms } from '@/lib/properties/getPublicPropertyRooms'
import { calculateAverageRating } from '@/lib/reviews/calculateAverageRating'
import { PropertyHeader } from '@/components/properties/PropertyHeader'
import { PropertyOverview } from '@/components/properties/PropertyOverview'
import { PropertyRoomList } from '@/components/properties/PropertyRoomList'
import { PropertyStickyBooking } from '@/components/properties/PropertyStickyBooking'
import { MobileBookingBar } from '@/components/properties/MobileBookingBar'
import { ScrollToTop } from '@/components/shared/ScrollToTop'
import { notFound } from 'next/navigation'
import { isAdmin } from '@/lib/auth/access'
import { auth } from '@/auth'
import { Plus, Edit, Shield, User } from 'lucide-react'
import { Button } from '@/components/shared/Button'
import { PropertyHostInfo } from '@/components/properties/PropertyHostInfo'
import Link from 'next/link'

export default async function PublicPropertyDetailsPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params
  
  const isSystemAdmin = await isAdmin()
  const session = await auth()
  const user = session?.user
  
  const [property, rooms, rating] = await Promise.all([
    getPublicPropertyById(id, isSystemAdmin),
    getPublicPropertyRooms(id),
    calculateAverageRating(id)
  ])

  if (!property) {
    notFound()
  }

  const isOwner = user?.id === property.owner_id


  return (
    <div className="min-h-screen bg-[var(--background)] pb-20 sm:pb-32 lg:pb-32">
      <ScrollToTop />

      {(isSystemAdmin || isOwner) && (
        <div className="bg-gray-900 text-white py-3 px-6 flex items-center justify-between sticky top-0 z-[100] shadow-2xl">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
              {isSystemAdmin ? <Shield className="w-4 h-4 text-emerald-400" /> : <User className="w-4 h-4 text-emerald-400" />}
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400 leading-none">
                {isSystemAdmin ? 'Admin Perspective' : 'Owner Perspective'}
              </span>
              <span className="text-xs font-bold text-white/70">
                {isSystemAdmin 
                  ? 'You are previewing this property with full system privileges.' 
                  : 'You are viewing your own property listing.'}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link href={`/owner/properties/${id}`}>
              <Button size="sm" variant="secondary" className="h-8 rounded-lg text-[10px] font-black uppercase tracking-widest">
                <Shield className="w-3 h-3 mr-1.5" /> Open Management View
              </Button>
            </Link>
            <Link href={`/owner/properties/${id}/edit`}>
              <Button size="sm" className="h-8 rounded-lg text-[10px] font-black uppercase tracking-widest bg-emerald-500 hover:bg-emerald-600 text-white border-0">
                <Edit className="w-3 h-3 mr-1.5" /> Edit Property
              </Button>
            </Link>
          </div>
        </div>
      )}

      <PropertyHeader 
        name={property.name}
        address={property.address}
        city={property.city}
        country={property.country}
        imageUrl={property.main_image_url ?? null}
        images={property.images ?? []}
        type={property.type}
      />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 mt-12 sm:mt-16 lg:mt-24 flex flex-col lg:flex-row gap-16 sm:gap-20 lg:gap-24 items-start">
        {/* Left Column: Main Content */}
        <div className="w-full lg:w-[60%] xl:w-[65%] space-y-16 sm:space-y-24">
          <PropertyOverview property={property} />

          <div className="pt-16 sm:pt-24 border-t border-gray-100/60">
            <PropertyHostInfo host={property.host} />
          </div>

          <div className="pt-16 sm:pt-24 border-t border-gray-100/60">
            <PropertyRoomList 
              rooms={rooms} 
              isWholeUnit={property.is_whole_unit}
            />
          </div>
        </div>

        {/* Right Column: Sticky Booking Widget — Desktop only */}
        <div className="hidden lg:block w-full lg:w-[40%] xl:w-[35%] relative">
           <div className="sticky top-28">
             <PropertyStickyBooking 
               property={property as any} 
               rooms={rooms}
               averageRating={rating.average}
               reviewCount={rating.count}
             />
           </div>
        </div>
      </div>

      {/* Mobile Booking Bar — shown only on mobile */}
      <MobileBookingBar
        property={property as any}
        rooms={rooms}
        averageRating={rating.average}
        reviewCount={rating.count}
      />
    </div>
  )
}
