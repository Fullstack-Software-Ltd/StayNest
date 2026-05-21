'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Property, CreatePropertyInput, UpdatePropertyInput } from '@/types/property'
import { createProperty } from '@/lib/properties/createProperty'
import { updateProperty } from '@/lib/properties/updateProperty'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { FormContainer } from '@/components/forms/FormContainer'
import { MultiImageUpload } from '@/components/shared/MultiImageUpload'
import { HouseButtonLoader } from '@/components/shared/HouseLoader'
import { useSettings } from '@/context/SettingsContext'
import { LayoutGrid, Home, Calendar, Sparkles, Users, Wifi, Car, Waves, Dumbbell, Wind, Utensils, Tv, WashingMachine, PlusCircle, X } from 'lucide-react'

interface PropertyFormProps {
  property?: Property
}

export function PropertyForm({ property }: PropertyFormProps) {
  const router = useRouter()
  const { t } = useSettings()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<CreatePropertyInput>({
    name: property?.name || '',
    type: property?.type || 'Hotel',
    description: property?.description || '',
    country: property?.country || '',
    city: property?.city || '',
    address: property?.address || '',
    latitude: property?.latitude ?? undefined,
    longitude: property?.longitude ?? undefined,
    main_image_url: property?.main_image_url || '',
    images: property?.images || [],
    amenities: property?.amenities || [],
    is_whole_unit: property?.is_whole_unit ?? (property?.type ? ['Apartment', 'Villa', 'Guesthouse'].includes(property.type) : false),
    offers_monthly: property?.offers_monthly ?? false,
    offers_daily: property?.offers_daily ?? true,
    monthly_price: property?.monthly_price ?? undefined,
    daily_price: property?.daily_price ?? undefined,
    max_guests: property?.max_guests ?? 1,
  })
  
  const [customType, setCustomType] = useState('')
  const [isOtherType, setIsOtherType] = useState(
    property?.type ? !['Hotel', 'Apartment', 'Villa', 'Resort', 'Guesthouse'].includes(property.type) : false
  )
  const [customAmenityInput, setCustomAmenityInput] = useState('')

  const STANDARD_AMENITIES = [
    { id: 'wifi', label: 'High-speed WiFi', icon: 'Wifi' },
    { id: 'parking', label: 'Free Parking', icon: 'Car' },
    { id: 'pool', label: 'Swimming Pool', icon: 'Waves' },
    { id: 'gym', label: 'Fitness Center', icon: 'Dumbbell' },
    { id: 'ac', label: 'Air Conditioning', icon: 'Wind' },
    { id: 'kitchen', label: 'Full Kitchen', icon: 'Utensils' },
    { id: 'tv', label: 'Smart TV', icon: 'Tv' },
    { id: 'washer', label: 'Washer / Dryer', icon: 'WashingMachine' },
  ]

  useEffect(() => {
    if (isOtherType && property?.type) {
      setCustomType(property.type)
    }
  }, [property, isOtherType])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const val = type === 'number' && value === '' ? '' : (type === 'number' ? parseFloat(value) : value)
    setFormData((prev) => ({ ...prev, [name]: val }))
  }

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }))
  }

  const handleImagesUpload = (urls: string[]) => {
    setFormData((prev: CreatePropertyInput) => ({ 
      ...prev, 
      images: urls,
      main_image_url: urls.length > 0 ? urls[0] : '' 
    }))
  }
  
  const toggleAmenity = (id: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities?.includes(id)
        ? prev.amenities.filter(a => a !== id)
        : [...(prev.amenities || []), id]
    }))
  }

  const addCustomAmenity = () => {
    if (!customAmenityInput.trim()) return
    const newAmenity = customAmenityInput.trim()
    if (!formData.amenities?.includes(newAmenity)) {
      setFormData(prev => ({
        ...prev,
        amenities: [...(prev.amenities || []), newAmenity]
      }))
    }
    setCustomAmenityInput('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // TEMPORARY BYPASS FOR STRESS TEST
    /*
    if ((formData.images?.length || 0) < 2) {
      alert(t('property_form.min_photos_error', { count: '2' }) || 'Please upload at least 2 photos.')
      setLoading(false)
      return
    }
    */

    setLoading(true)

    const submissionData = {
      ...formData,
      type: isOtherType ? customType : formData.type
    }

    try {
      if (property) {
        await updateProperty(property.id, submissionData as UpdatePropertyInput)
      } else {
        await createProperty(submissionData as CreatePropertyInput)
      }
      router.push('/owner/properties')
      router.refresh()
    } catch (error) {
      console.error('Error saving property:', error)
      alert(t('property_form.save_error'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <FormContainer 
      title={property ? t('property_form.edit_title') : t('property_form.list_title')} 
      onSubmit={handleSubmit}
    >
      <div className="space-y-8">
        <MultiImageUpload 
          label={t('property_form.photos_label')}
          bucket="property-images"
          initialImages={formData.images}
          onUpload={handleImagesUpload}
          minImages={2}
        />

        {/* ─── Basic Info ────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label={t('property_form.name_label')}
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder={t('property_form.name_placeholder')}
            required
          />
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700">{t('property_form.type_label')}</label>
            <select
              name="type"
              value={isOtherType ? 'Other' : formData.type}
              onChange={(e) => {
                const val = e.target.value;
                if (val === 'Other') {
                  setIsOtherType(true)
                } else {
                  setIsOtherType(false)
                  setFormData(prev => ({ 
                    ...prev, 
                    type: val,
                    is_whole_unit: ['Apartment', 'Villa'].includes(val)
                  }))
                }
              }}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)] outline-none transition-all duration-200 text-sm"
            >
              <option value="Hotel">{t('common.property_types.hotel')}</option>
              <option value="Apartment">{t('common.property_types.apartment')}</option>
              <option value="Villa">{t('common.property_types.villa')}</option>
              <option value="Resort">{t('common.property_types.resort')}</option>
              <option value="Guesthouse">{t('common.property_types.guesthouse')}</option>
              <option value="Other">{t('common.property_types.other') || 'Other (Specify)'}</option>
            </select>
          </div>
        </div>

        {isOtherType && (
          <Input
            label={t('property_form.custom_type_label') || 'Specify Property Type'}
            value={customType}
            onChange={(e) => setCustomType(e.target.value)}
            placeholder="e.g. Treehouse, Boutique Hotel, etc."
            required
          />
        )}

        {/* ─── Listing Setup ────────────────────── */}
        <div className="bg-gray-50/50 rounded-2xl p-6 border border-gray-100 space-y-6">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-[var(--primary)]" />
            <h3 className="text-sm font-black uppercase tracking-widest text-gray-900">Listing Settings</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Whole Unit vs Multi-Room */}
            <div className="space-y-4">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Listing Architecture</label>
              <div className="flex p-1 bg-white border border-gray-200 rounded-2xl">
                <button
                  type="button"
                  onClick={() => handleCheckboxChange('is_whole_unit', false)}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all ${!formData.is_whole_unit ? 'bg-[var(--primary)] text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}
                >
                  <LayoutGrid className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-widest">Hotel Style</span>
                </button>
                <button
                  type="button"
                  disabled={['Hotel', 'Guesthouse', 'Resort'].includes(formData.type)}
                  onClick={() => handleCheckboxChange('is_whole_unit', true)}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all ${
                    formData.is_whole_unit ? 'bg-[var(--primary)] text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'
                  } ${['Hotel', 'Guesthouse', 'Resort'].includes(formData.type) ? 'opacity-30 cursor-not-allowed' : ''}`}
                >
                  <Home className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-widest">Whole Unit</span>
                </button>
              </div>
              <p className="text-[10px] text-gray-400 font-medium italic">
                {formData.is_whole_unit 
                  ? "Rented as one unit (e.g. Apartment, Villa). Prices apply to the entire property." 
                  : "Rented per room (e.g. Hotel, Motel). You will add individual rooms later."}
              </p>
            </div>

            {/* Rental Policies */}
            <div className="space-y-4">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Rental Policies</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleCheckboxChange('offers_daily', !formData.offers_daily)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl border transition-all ${formData.offers_daily ? 'border-[var(--primary)] bg-[var(--primary)]/5 text-[var(--primary)]' : 'border-gray-200 text-gray-400 grayscale'}`}
                >
                  <Calendar className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-widest">Daily</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleCheckboxChange('offers_monthly', !formData.offers_monthly)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl border transition-all ${formData.offers_monthly ? 'border-[var(--primary)] bg-[var(--primary)]/5 text-[var(--primary)]' : 'border-gray-200 text-gray-400 grayscale'}`}
                >
                  <Calendar className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-widest">Monthly</span>
                </button>
              </div>
              <p className="text-[10px] text-gray-400 font-medium italic">
                {formData.offers_monthly ? "Monthly rentals require a minimum stay of 30 days." : "Only nightly stays allowed."}
              </p>
            </div>
          </div>

          {/* Pricing & Capacity for Whole Unit */}
          {formData.is_whole_unit && (
            <div className="pt-6 border-t border-gray-100 grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
              {formData.offers_daily && (
                <Input
                  label="Daily Price (USD)"
                  name="daily_price"
                  type="number"
                  value={formData.daily_price || ''}
                  onChange={handleChange}
                  placeholder="e.g. 50"
                  required
                />
              )}
              {formData.offers_monthly && (
                <Input
                  label="Monthly Price (USD)"
                  name="monthly_price"
                  type="number"
                  value={formData.monthly_price || ''}
                  onChange={handleChange}
                  placeholder="e.g. 1200"
                  required
                />
              )}
              <Input
                label="Max Capacity"
                name="max_guests"
                type="number"
                value={formData.max_guests}
                onChange={handleChange}
                placeholder="Number of guests"
                required
              />
            </div>
          )}
        </div>

        {/* ─── Amenities ─────────────────────────── */}
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[var(--accent)]" />
            <h3 className="text-sm font-black uppercase tracking-widest text-gray-900">Amenities & Features</h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {STANDARD_AMENITIES.map((amenity) => {
              const Icon = { Wifi, Car, Waves, Dumbbell, Wind, Utensils, Tv, WashingMachine }[amenity.icon] as any
              const isSelected = formData.amenities?.includes(amenity.id)
              return (
                <button
                  key={amenity.id}
                  type="button"
                  onClick={() => toggleAmenity(amenity.id)}
                  className={`flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all ${
                    isSelected 
                      ? 'border-[var(--primary)] bg-[var(--primary)]/5 text-[var(--primary)]' 
                      : 'border-gray-100 text-gray-400 hover:border-gray-200'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isSelected ? 'animate-bounce-subtle' : ''}`} />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-center">{amenity.label}</span>
                </button>
              )
            })}
          </div>

          {/* Custom Amenities */}
          <div className="space-y-4">
            <div className="flex gap-2">
              <div className="flex-1">
                <input
                  type="text"
                  value={customAmenityInput}
                  onChange={(e) => setCustomAmenityInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      addCustomAmenity()
                    }
                  }}
                  placeholder="Add a non-listed amenity (e.g. Private Chef, Rooftop...)"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-[var(--primary)]/10 focus:border-[var(--primary)] outline-none text-sm transition-all"
                />
              </div>
              <button
                type="button"
                onClick={addCustomAmenity}
                className="px-4 bg-gray-900 text-white rounded-xl hover:bg-black transition-colors"
              >
                <PlusCircle className="w-5 h-5" />
              </button>
            </div>

            {/* Custom Amenity Tags */}
            <div className="flex flex-wrap gap-2">
              {formData.amenities?.filter(a => !STANDARD_AMENITIES.find(s => s.id === a)).map((amenity) => (
                <span 
                  key={amenity}
                  className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-xs font-bold border border-gray-200 group"
                >
                  {amenity}
                  <button
                    type="button"
                    onClick={() => toggleAmenity(amenity)}
                    className="hover:text-red-500 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-gray-700">{t('property_form.description_label')}</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder={t('property_form.description_placeholder')}
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)] outline-none transition-all duration-200 text-sm h-32 resize-none"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label={t('property_form.country_label')}
            name="country"
            value={formData.country}
            onChange={handleChange}
            placeholder="e.g. Rwanda"
            required
          />
          <Input
            label={t('property_form.city_label')}
            name="city"
            value={formData.city}
            onChange={handleChange}
            placeholder="e.g. Kigali"
            required
          />
        </div>

        <Input
          label={t('property_form.address_label')}
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="e.g. KN 3 Rd, Kigali"
          required
        />

        {/* Manual Latitude/Longitude removed for better UX, uses address search / profile default */}

        <Button type="submit" className="w-full py-6 text-lg" disabled={loading}>
          {loading ? (
            <>
              <HouseButtonLoader />
              {t('common.saving')}
            </>
          ) : (
            property ? t('property_form.submit_update') : t('property_form.submit_list')
          )}
        </Button>
      </div>
    </FormContainer>
  )
}
