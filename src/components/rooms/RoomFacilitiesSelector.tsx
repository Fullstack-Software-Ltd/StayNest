'use client'

import { COMMON_FACILITIES } from '@/types/room'
import { Check, Plus, X } from 'lucide-react'
import { useState } from 'react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

interface RoomFacilitiesSelectorProps {
  selectedFacilities: string[]
  onChange: (facilities: string[]) => void
}

export function RoomFacilitiesSelector({ selectedFacilities, onChange }: RoomFacilitiesSelectorProps) {
  const [customInput, setCustomInput] = useState('')

  const toggleFacility = (facility: string) => {
    if (selectedFacilities.includes(facility)) {
      onChange(selectedFacilities.filter((f) => f !== facility))
    } else {
      onChange([...selectedFacilities, facility])
    }
  }

  const addCustomFacility = () => {
    const trimmed = customInput.trim()
    if (trimmed && !selectedFacilities.includes(trimmed)) {
      onChange([...selectedFacilities, trimmed])
      setCustomInput('')
    }
  }

  const otherFacilities = selectedFacilities.filter(f => !COMMON_FACILITIES.includes(f))

  return (
    <div className="space-y-4">
      <label className="text-sm font-semibold text-gray-700">Room Facilities</label>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {COMMON_FACILITIES.map((facility) => {
          const isSelected = selectedFacilities.includes(facility)
          return (
            <button
              key={facility}
              type="button"
              onClick={() => toggleFacility(facility)}
              className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium border transition-all duration-200 ${
                isSelected
                  ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-100'
                  : 'bg-white border-gray-200 text-gray-600 hover:border-blue-300 hover:bg-blue-50'
              }`}
            >
              <span className="truncate mr-1">{facility}</span>
              {isSelected && <Check className="w-3 h-3 flex-shrink-0" />}
            </button>
          )
        })}

        {otherFacilities.map((facility) => (
          <button
            key={facility}
            type="button"
            onClick={() => toggleFacility(facility)}
            className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium border bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-100 transition-all duration-200"
          >
            <span className="truncate mr-1">{facility}</span>
            <X className="w-3 h-3 flex-shrink-0" />
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2 max-w-sm mt-4">
        <Input 
          placeholder="Add custom facility (e.g. Private Chef)"
          value={customInput}
          onChange={(e) => setCustomInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              addCustomFacility()
            }
          }}
          className="h-10 text-xs"
        />
        <Button 
          type="button"
          onClick={addCustomFacility}
          variant="outline"
          className="h-10 px-3 whitespace-nowrap text-xs font-bold"
        >
          <Plus className="w-3 h-3 mr-1" /> Add
        </Button>
      </div>
    </div>
  )
}
