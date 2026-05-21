'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Room, CreateRoomInput, UpdateRoomInput } from '@/types/room'
import { createRoom } from '@/lib/rooms/createRoom'
import { updateRoom } from '@/lib/rooms/updateRoom'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { FormContainer } from '@/components/forms/FormContainer'
import { RoomFacilitiesSelector } from './RoomFacilitiesSelector'
import { HouseButtonLoader } from '@/components/shared/HouseLoader'
import { MultiImageUpload } from '@/components/shared/MultiImageUpload'
import { useSettings } from '@/context/SettingsContext'
import { toast } from 'sonner'

interface RoomFormProps {
  propertyId: string
  room?: Room
}

export function RoomForm({ propertyId, room }: RoomFormProps) {
  const router = useRouter()
  const { t } = useSettings()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<Omit<CreateRoomInput, 'property_id'>>({
    name: room?.name || '',
    description: room?.description || '',
    price_per_night: room?.price_per_night || 0,
    capacity: room?.capacity || 2,
    available_rooms: room?.available_rooms || 1,
    bed_type: room?.bed_type || 'Double',
    size_sqm: room?.size_sqm || 25,
    facilities: room?.facilities || [],
    images: room?.images || [],
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const val = type === 'number' && value === '' ? '' : (type === 'number' ? parseFloat(value) : value)
    setFormData((prev) => ({ ...prev, [name]: val }))
  }

  const handleImagesUpload = (urls: string[]) => {
    setFormData((prev) => ({ ...prev, images: urls }))
  }

  const handleFacilitiesChange = (facilities: string[]) => {
    setFormData((prev) => ({ ...prev, facilities }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.images || formData.images.length < 2) {
      alert('Please upload at least 2 photos for the room.')
      return
    }

    setLoading(true)
    // ... rest of handleSubmit

    try {
      if (room) {
        await updateRoom(room.id, formData as UpdateRoomInput)
        toast.success(t('owner.room_updated') || 'Room details finalized.')
      } else {
        await createRoom({ ...formData, property_id: propertyId })
        toast.success(t('owner.room_live') || 'Your room is now live and bookable!')
      }
      router.push(`/owner/properties/${propertyId}/rooms`)
      router.refresh()
    } catch (error) {
      console.error('Error saving room:', error)
      toast.error(t('owner.room_save_error') || 'Error saving room. Please check all fields.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <FormContainer 
      title={room ? 'Edit Room' : 'Add New Room Type'} 
      onSubmit={handleSubmit}
      className="max-w-4xl"
    >
      <div className="space-y-8">
        <MultiImageUpload 
          label="Room Photos"
          bucket="room-images"
          initialImages={formData.images}
          onUpload={handleImagesUpload}
          minImages={2}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Room Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g. Deluxe Ocean View Suite"
            required
          />
          <Input
            label="Bed Type"
            name="bed_type"
            value={formData.bed_type || ''}
            onChange={handleChange}
            placeholder="e.g. 1 King Bed or 2 Single Beds"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-gray-700">Room Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe the room features, view, and layout..."
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all h-32 resize-none text-sm"
            required
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <Input
            label="Price / Night ($)"
            name="price_per_night"
            type="number"
            value={formData.price_per_night ?? ''}
            onChange={handleChange}
            min={1}
            required
          />
          <Input
            label="Capacity"
            name="capacity"
            type="number"
            value={formData.capacity ?? ''}
            onChange={handleChange}
            min={1}
            required
          />
          <Input
            label="Total Units"
            name="available_rooms"
            type="number"
            value={formData.available_rooms ?? ''}
            onChange={handleChange}
            min={0}
            required
          />
          <Input
            label="Size (sqm)"
            name="size_sqm"
            type="number"
            value={formData.size_sqm || ''}
            onChange={handleChange}
            min={1}
          />
        </div>

        <RoomFacilitiesSelector 
          selectedFacilities={formData.facilities} 
          onChange={handleFacilitiesChange} 
        />

        <Button type="submit" className="w-full py-6 text-lg rounded-2xl shadow-xl shadow-blue-100" disabled={loading}>
          {loading ? (
            <>
              <HouseButtonLoader />
              Saving Room...
            </>
          ) : (
            room ? 'Update Room Details' : 'Add Room to Property'
          )}
        </Button>
      </div>
    </FormContainer>
  )
}
