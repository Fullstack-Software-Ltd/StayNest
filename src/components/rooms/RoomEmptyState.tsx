import Link from 'next/link'
import { PlusCircle, Bed } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface RoomEmptyStateProps {
  propertyId: string
}

export function RoomEmptyState({ propertyId }: RoomEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-12 bg-white border-2 border-dashed border-gray-200 rounded-3xl text-center">
      <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-6">
        <Bed className="w-8 h-8" />
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">No rooms listed</h3>
      <p className="text-gray-500 max-w-sm mb-8">
        Your property needs rooms to be bookable. Add your first room type now to start receiving guests.
      </p>
      <Link href={`/owner/properties/${propertyId}/rooms/new`}>
        <Button size="lg" className="shadow-lg shadow-blue-100">
          <PlusCircle className="w-4 h-4 mr-2" />
          Add First Room
        </Button>
      </Link>
    </div>
  )
}
