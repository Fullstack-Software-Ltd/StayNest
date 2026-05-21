'use client'

import { useState } from 'react'
import { BookingForm } from '@/components/bookings/booking-form'
import { BookingSummary } from '@/components/bookings/booking-summary'
import { Property } from '@/types/property'
import { Room } from '@/types/room'
import { CheckoutTrustSidebar } from '@/components/bookings/CheckoutTrustSidebar'

interface BookingFormWrapperProps {
  property: Property
  room: Room
}

export function BookingFormWrapper({ property, room }: BookingFormWrapperProps) {
  const [details, setDetails] = useState({
    checkIn: '',
    checkOut: '',
    guests: 1,
    nights: 0,
    subtotal: 0,
    serviceFee: 0,
    tax: 0,
    total: 0
  })

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
      <div className="lg:col-span-2">
        <BookingForm 
          propertyId={property.id} 
          roomId={room.id} 
          roomPrice={room.price_per_night}
          maxCapacity={room.capacity}
          onDetailsChange={setDetails}
        />
      </div>
      
      <div>
        <BookingSummary 
          property={property} 
          room={room} 
          checkIn={details.checkIn}
          checkOut={details.checkOut}
          guests={details.guests}
          nights={details.nights}
          subtotal={details.subtotal}
          serviceFee={details.serviceFee}
          tax={details.tax}
          totalPrice={details.total}
        />
        
        <CheckoutTrustSidebar />
      </div>
    </div>
  )
}
