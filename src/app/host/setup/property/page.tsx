'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import dynamic from 'next/dynamic'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/shared/Button'
import {
  Home,
  MapPin,
  UploadCloud,
  CheckCircle2,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Hotel,
  Building2,
  Palmtree,
  Coffee,
  Check,
  DollarSign,
  Wifi,
  Car,
  Waves,
  Dumbbell,
  Wind,
  Utensils,
  Tv,
  WashingMachine,
  PlusCircle,
  X,
  LayoutGrid,
  Calendar,
  UserCheck,
  CreditCard,
  Smartphone,
  Map,
  ShieldAlert,
  Loader2,
  Globe,
  Building
} from 'lucide-react'
import { useSettings } from '@/context/SettingsContext'
import { createProperty, getHostProfile } from './actions'
import { useSession } from 'next-auth/react'
import { Input } from '@/components/shared/Input'
import { toast } from 'sonner'
import { MultiImageUpload } from '@/components/shared/MultiImageUpload'

// Dynamic Map for Location Picker
const MapView = dynamic(() => import('@/components/maps/map-view'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-gray-50 animate-pulse flex items-center justify-center rounded-[2.5rem]">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="w-8 h-8 text-[var(--primary)] animate-spin opacity-20" />
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Initializing Map Architecture...</span>
      </div>
    </div>
  )
})
const MapMarker = dynamic(() => import('@/components/maps/map-marker'), { ssr: false })

// --- Map Picker Helper ---
import { useMapEvents } from 'react-leaflet'
function MapLocationPicker({ onLocationSelected }: { onLocationSelected: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onLocationSelected(e.latlng.lat, e.latlng.lng)
    },
  })
  return null
}

const steps = [
  { id: 1, title: 'Category', icon: Home, desc: 'What kind of place?' },
  { id: 2, title: 'Location', icon: MapPin, desc: 'Where is it?' },
  { id: 3, title: 'Amenities', icon: Coffee, desc: 'What features?' },
  { id: 4, title: 'Photos', icon: UploadCloud, desc: 'Show it off' },
  { id: 5, title: 'Publish', icon: CheckCircle2, desc: 'Ready to earn' },
]

const PROPERTY_TYPES = [
  { id: 'Hotel', label: 'Hotel', icon: Hotel },
  { id: 'Apartment', label: 'Apartment', icon: Building2 },
  { id: 'Villa', label: 'Villa', icon: Palmtree },
  { id: 'Guesthouse', label: 'Guesthouse', icon: Home },
  { id: 'Other', label: 'Other', icon: Sparkles },
]

export default function HostPropertySetupPage() {
  const searchParams = useSearchParams()
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [propertyDraft, setPropertyDraft] = useState({
    name: '',
    type: 'Apartment',
    description: '',
    city: 'Kigali',
    country: 'Rwanda',
    address: '',
    latitude: -1.9441,
    longitude: 30.0619,
    daily_price: 100,
    amenities: [] as string[],
    images: [] as string[],
    main_image_url: '' as string,
    is_whole_unit: true,
    offers_daily: true,
    offers_monthly: false,
    monthly_price: 0,
    max_guests: 1 as number | '',
    // Host Profile info
    hosting_business_name: '',
    bio: '',
    payout_method: 'none' as 'stripe' | 'momo' | 'none',
    payout_momo_number: '',
    payout_momo_provider: 'mtn' as 'mtn' | 'airtel',
    stripe_connect_id: ''
  })
  const [customAmenityInput, setCustomAmenityInput] = useState('')
  const [customType, setCustomType] = useState('')

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

  const router = useRouter()
  const { setHostMode, t } = useSettings()
  const { data: session, status } = useSession()
  const [isSearchingLocation, setIsSearchingLocation] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?redirect=/host/setup/property')
    }
  }, [status, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 text-[var(--primary)] animate-spin" />
      </div>
    )
  }

  const handleAddressSearch = async () => {
    if (!propertyDraft.address.trim()) {
      toast.error("Please enter a street address first.")
      return
    }

    setIsSearchingLocation(true)
    try {
      const query = `${propertyDraft.address}, ${propertyDraft.city}, Rwanda`
      const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`, {
        headers: { 'User-Agent': 'StayNest-Host-Onboarding' }
      })

      const data = await response.json()
      if (data && data.length > 0) {
        const { lat, lon } = data[0]
        const newLat = parseFloat(lat)
        const newLon = parseFloat(lon)

        setPropertyDraft(prev => ({
          ...prev,
          latitude: newLat,
          longitude: newLon
        }))

        toast.success("Location found!", {
          description: "We've updated the map pin based on your address."
        })
      } else {
        toast.error("Location not found", {
          description: "Try adding more detail to your address or pin it manually."
        })
      }
    } catch (err) {
      toast.error("Search failed. Please try pinning manually.")
    } finally {
      setIsSearchingLocation(false)
    }
  }

  const nextStep = () => {
    // Validation
    if (currentStep === 1) {
      if (propertyDraft.type === 'Other' && !customType.trim()) {
        toast.error('Please specify what type of property it is.')
        return
      }
    } else if (currentStep === 2) {
      if (!propertyDraft.city.trim() || !propertyDraft.address.trim()) {
        toast.error('Please provide a valid city and address.')
        return
      }
      if (propertyDraft.address.length < 5) {
        toast.error('Please provide a more detailed address for guest verification.')
        return
      }
    } else if (currentStep === 4) {
      if (!propertyDraft.name.trim() || !propertyDraft.description.trim()) {
        toast.error('Please provide a title and description for your listing.')
        return
      }
      if (propertyDraft.images.length < 2) {
        toast.error('Please upload at least 2 photos of your property.')
        return
      }
    }

    setCurrentStep(prev => Math.min(steps.length, prev + 1))
  }

  const prevStep = () => setCurrentStep(prev => Math.max(1, prev - 1))

  const handleComplete = async () => {
    // Final Validation
    if (propertyDraft.daily_price <= 0) {
      toast.error('Please set a valid nightly rate.')
      return
    }

    setIsSubmitting(true)
    try {
    if (!session?.user) {
      router.push('/login?redirect=/host/onboarding')
      return
    }

      const finalType = propertyDraft.type === 'Other' ? customType : propertyDraft.type

      // 1. Create the property
      const result = await createProperty({
        ...propertyDraft,
        max_guests: propertyDraft.max_guests === '' ? 1 : Number(propertyDraft.max_guests),
        type: finalType
      })

      if (!result.success) throw new Error('Failed to create property')

      // 3. Switch to host mode
      setHostMode(true)
      toast.success("Listing submitted for review!")
      router.push('/owner/dashboard')

    } catch (error: any) {
      toast.error(error.message || "Failed to create listing")
    } finally {
      setIsSubmitting(false)
    }
  }

  const [isConnectingStripe, setIsConnectingStripe] = useState(false)
  const handleStripeConnect = async () => {
    setIsConnectingStripe(true)
    try {
      const response = await fetch('/api/stripe/connect', { method: 'POST' })
      const data = await response.json()

      if (data.url) {
        // Redirect to Stripe Onboarding
        window.location.href = data.url
      } else {
        throw new Error(data.error || 'Failed to generate link')
      }
    } catch (err: any) {
      toast.error(err.message || "Stripe Connect Error")
    } finally {
      setIsConnectingStripe(false)
    }
  }

  // Effect to check for returned Stripe connection or existing ID
  useEffect(() => {
    const checkInitialState = async () => {
      if (session?.user) {
        const profile = await getHostProfile()
        if (profile) {
          setPropertyDraft(prev => ({
            ...prev,
            hosting_business_name: profile.hosting_business_name || prev.hosting_business_name,
            bio: profile.bio || prev.bio,
            payout_method: (profile.payout_method as any) || prev.payout_method,
            payout_momo_number: profile.payout_momo_number || prev.payout_momo_number,
            payout_momo_provider: (profile.payout_momo_provider as any) || prev.payout_momo_provider,
            stripe_connect_id: profile.stripe_connect_id || ''
          }))
        }
      }
    }
    checkInitialState()

    // Handle Redirect Success from Stripe
    const success = searchParams.get('success')
    const step = searchParams.get('step')
    if (success === 'true' && step === '6') {
      setCurrentStep(6)
      toast.success("Stripe account connected successfully!", {
        description: "Your professional payouts are now verified."
      })
    }
  }, [searchParams])

  return (
    <div className="flex-1 flex flex-col bg-white overflow-hidden min-h-screen">
      {/* ─── Persistent Wizard Header ─────────────── */}
      <div className="border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 py-6 sm:py-8 flex items-center justify-between">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">Become a Host</h1>
            <p className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">
              {steps[currentStep - 1].title} — {steps[currentStep - 1].desc}
            </p>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-3">
            {steps.map((step) => (
              <div
                key={step.id}
                className={`w-8 h-1.5 sm:w-16 sm:h-2 rounded-full transition-all duration-500 ${currentStep >= step.id ? 'bg-[var(--primary)]' : 'bg-gray-100'
                  }`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 max-w-7xl mx-auto w-full px-6 py-12 sm:py-20 grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">

        {/* ─── Main Form Area ───────────────────── */}
        <div className="lg:col-span-2 flex flex-col items-center">

          {/* STEP 1: CATEGORY */}
          {currentStep === 1 && (
            <div className="w-full space-y-12 animate-fade-in-up">
              <div className="text-center space-y-4">
                <div className="w-20 h-20 rounded-[2rem] bg-[var(--primary)]/5 flex items-center justify-center text-[var(--primary)] mx-auto border border-[var(--primary)]/10 shadow-xl shadow-black/5">
                  <Home className="w-10 h-10" />
                </div>
                <h2 className="text-3xl sm:text-5xl font-black text-gray-900 tracking-tighter">What type of <span className="text-[var(--primary)]">place</span> is it?</h2>
                <p className="text-gray-500 font-medium text-lg max-w-md mx-auto">Choose the category that best describes your accommodation.</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
                {PROPERTY_TYPES.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setPropertyDraft(prev => ({
                      ...prev,
                      type: item.id,
                      is_whole_unit: ['Apartment', 'Villa'].includes(item.id)
                    }))}
                    className={`flex flex-col items-center gap-4 p-8 rounded-3xl border-2 transition-all duration-300 group ${propertyDraft.type === item.id
                      ? 'border-[var(--primary)] bg-[var(--primary)]/5 shadow-xl shadow-[var(--primary)]/5'
                      : 'border-gray-100 bg-white hover:border-gray-200 hover:shadow-lg'
                      }`}
                  >
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${propertyDraft.type === item.id ? 'bg-[var(--primary)] text-white' : 'bg-gray-50 text-gray-400 group-hover:bg-gray-100'
                      }`}>
                      <item.icon className="w-6 h-6" />
                    </div>
                    <span className={`text-sm font-black uppercase tracking-widest ${propertyDraft.type === item.id ? 'text-[var(--primary)]' : 'text-gray-400'}`}>
                      {item.label}
                    </span>
                  </button>
                ))}
              </div>

              {propertyDraft.type === 'Other' && (
                <div className="max-w-md mx-auto mt-6 animate-fade-in-up">
                  <Input
                    label="Specify Property Type"
                    value={customType}
                    onChange={(e) => setCustomType(e.target.value)}
                    placeholder="e.g. Treehouse, Boutique Hotel, Tent..."
                    className="h-14 rounded-2xl bg-gray-50"
                  />
                </div>
              )}
            </div>
          )}

          {/* STEP 2: LOCATION */}
          {currentStep === 2 && (
            <div className="w-full space-y-12 animate-fade-in-up">
              <div className="text-center space-y-4">
                <h2 className="text-3xl sm:text-5xl font-black text-gray-900 tracking-tighter">Where is it <span className="text-[var(--primary)]">located?</span></h2>
                <p className="text-gray-500 font-medium text-lg">Pin your exact location on the map.</p>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <Input
                    label="City"
                    value={propertyDraft.city}
                    onChange={(e) => setPropertyDraft(prev => ({ ...prev, city: e.target.value }))}
                    className="h-14 rounded-2xl bg-gray-50"
                  />
                  <div className="relative group/search">
                    <Input
                      label="Street Address"
                      placeholder="e.g. KN 2 St, Kiyovu"
                      value={propertyDraft.address}
                      onChange={(e) => setPropertyDraft(prev => ({ ...prev, address: e.target.value }))}
                      onKeyDown={(e) => e.key === 'Enter' && handleAddressSearch()}
                      className="h-16 rounded-2xl bg-gray-50 text-base font-bold pr-36"
                    />
                    <button
                      onClick={handleAddressSearch}
                      disabled={isSearchingLocation}
                      className="absolute right-3 top-[34px] bg-gray-900 text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all flex items-center gap-2 group transform active:scale-95 disabled:opacity-50"
                    >
                      {isSearchingLocation ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <MapPin className="w-3 h-3 text-[var(--accent)]" />
                      )}
                      <span>Find on Map</span>
                    </button>
                  </div>
                </div>

                <div className="h-[450px] rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-2xl relative group">
                  <MapView
                    center={[propertyDraft.latitude, propertyDraft.longitude]}
                    zoom={15}
                    className="z-0"
                  >
                    <MapLocationPicker
                      onLocationSelected={(lat, lng) => {
                        setPropertyDraft(prev => ({ ...prev, latitude: lat, longitude: lng }))
                        toast.success("Location pinned!", {
                          description: `Coordinates updated to ${lat.toFixed(4)}, ${lng.toFixed(4)}`
                        })
                      }}
                    />
                    <MapMarker
                      position={[propertyDraft.latitude, propertyDraft.longitude]}
                      title="Your Property Site"
                      draggable={true}
                      onDragEnd={(lat, lng) => {
                        setPropertyDraft(prev => ({ ...prev, latitude: lat, longitude: lng }))
                        toast.success("Pin moved successfully")
                      }}
                    />
                  </MapView>

                  {/* Decorative Overlay for interaction cues */}
                  <div className="absolute top-6 left-6 z-[1000] flex flex-col gap-3">
                    <div className="bg-white/90 backdrop-blur-xl px-4 py-2 rounded-2xl shadow-xl border border-white/50 flex items-center gap-3 animate-slide-up">
                      <div className="w-2 h-2 rounded-full bg-[var(--primary)] animate-pulse" />
                      <span className="text-[10px] font-black uppercase text-gray-900 tracking-widest">Interactive Picker</span>
                    </div>
                    <div className="bg-black/80 backdrop-blur-md px-4 py-2 rounded-2xl shadow-xl border border-white/10 flex items-center gap-3 animate-fade-in delay-300">
                      <MapPin className="w-3 h-3 text-[var(--accent)]" />
                      <span className="text-[10px] font-medium text-white/80 uppercase tracking-tighter">Click anywhere to move the pin</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: AMENITIES */}
          {currentStep === 3 && (
            <div className="w-full space-y-12 animate-fade-in-up">
              <div className="text-center space-y-4">
                <h2 className="text-3xl sm:text-5xl font-black text-gray-900 tracking-tighter">Essential <span className="text-[var(--primary)]">Amenities.</span></h2>
                <p className="text-gray-500 font-medium text-lg">What makes your place special?</p>
              </div>

              <div className="space-y-8">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {STANDARD_AMENITIES.map((amenity) => {
                    const Icon = { Wifi, Car, Waves, Dumbbell, Wind, Utensils, Tv, WashingMachine }[amenity.icon] as any
                    const isSelected = propertyDraft.amenities.includes(amenity.id)
                    return (
                      <button
                        key={amenity.id}
                        onClick={() => {
                          setPropertyDraft(prev => ({
                            ...prev,
                            amenities: isSelected
                              ? prev.amenities.filter(a => a !== amenity.id)
                              : [...prev.amenities, amenity.id]
                          }))
                        }}
                        className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${isSelected
                          ? 'border-[var(--primary)] bg-[var(--primary)]/5 text-[var(--primary)] shadow-[var(--primary)]/5'
                          : 'border-gray-50 bg-gray-50 text-gray-500 hover:border-gray-100 hover:bg-white hover:text-gray-900'
                          }`}
                      >
                        <Icon className={`w-6 h-6 ${isSelected ? 'animate-bounce-subtle' : ''}`} />
                        <span className={`text-[10px] font-black uppercase tracking-widest text-center mt-1`}>{amenity.label}</span>
                      </button>
                    )
                  })}
                </div>

                <div className="space-y-4 pt-4 border-t border-gray-100">
                  <h3 className="text-sm font-black uppercase tracking-widest text-gray-900">Custom Features</h3>
                  <div className="flex gap-2">
                    <Input
                      value={customAmenityInput}
                      onChange={(e) => setCustomAmenityInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          if (!customAmenityInput.trim()) return
                          const newAmenity = customAmenityInput.trim()
                          if (!propertyDraft.amenities.includes(newAmenity)) {
                            setPropertyDraft(prev => ({ ...prev, amenities: [...prev.amenities, newAmenity] }))
                          }
                          setCustomAmenityInput('')
                        }
                      }}
                      placeholder="e.g. Private Chef, Helipad..."
                      className="flex-1 h-14 rounded-2xl bg-gray-50"
                    />
                    <button
                      onClick={() => {
                        if (!customAmenityInput.trim()) return
                        const newAmenity = customAmenityInput.trim()
                        if (!propertyDraft.amenities.includes(newAmenity)) {
                          setPropertyDraft(prev => ({ ...prev, amenities: [...prev.amenities, newAmenity] }))
                        }
                        setCustomAmenityInput('')
                      }}
                      className="w-14 h-14 rounded-2xl bg-gray-900 text-white flex items-center justify-center hover:bg-black transition-colors"
                    >
                      <PlusCircle className="w-6 h-6" />
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {propertyDraft.amenities.filter(a => !STANDARD_AMENITIES.find(s => s.id === a)).map((amenity) => (
                      <span
                        key={amenity}
                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-xl text-sm font-bold border border-gray-200"
                      >
                        {amenity}
                        <button
                          onClick={() => setPropertyDraft(prev => ({ ...prev, amenities: prev.amenities.filter(a => a !== amenity) }))}
                          className="hover:text-red-500 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: DETAILS & PHOTOS */}
          {currentStep === 4 && (
            <div className="w-full space-y-12 animate-fade-in-up">
              <div className="text-center space-y-4">
                <h2 className="text-3xl sm:text-5xl font-black text-gray-900 tracking-tighter">Fine <span className="text-[var(--primary)]">Details.</span></h2>
                <p className="text-gray-500 font-medium text-lg">Title and describe your beautiful stay.</p>
              </div>

              <div className="space-y-8">
                <Input
                  label="Property Title"
                  placeholder="e.g. Luxury Penthouse with City View"
                  value={propertyDraft.name}
                  onChange={(e) => setPropertyDraft(prev => ({ ...prev, name: e.target.value }))}
                  className="h-16 rounded-2xl bg-gray-50 text-xl font-bold"
                />

                <div className="space-y-4">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">About the place</label>
                  <textarea
                    rows={6}
                    value={propertyDraft.description}
                    onChange={(e) => setPropertyDraft(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Tell guests what's unique about your home..."
                    className="w-full p-6 bg-gray-50 rounded-3xl border-none outline-none focus:ring-2 focus:ring-[var(--primary)]/10 text-gray-900 font-medium leading-relaxed"
                  />
                </div>

                <div className="space-y-4">
                  <MultiImageUpload
                    bucket="property-images"
                    label="Property Photos"
                    minImages={2}
                    initialImages={propertyDraft.images}
                    onUpload={(urls) => setPropertyDraft(prev => ({
                      ...prev,
                      images: urls,
                      main_image_url: urls[0] || ''
                    }))}
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: PRICING & PUBLISH */}
          {currentStep === 5 && (
            <div className="w-full space-y-12 animate-fade-in-up">
              <div className="text-center space-y-4">
                <h2 className="text-3xl sm:text-5xl font-black text-gray-900 tracking-tighter">Final <span className="text-[var(--accent)] italic">Step.</span></h2>
                <p className="text-gray-500 font-medium text-lg">Configure your optimal rental strategy and pricing.</p>
              </div>

              <div className="max-w-3xl mx-auto space-y-12">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Whole Unit vs Multi-Room */}
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Listing Architecture</label>
                    <div className="flex p-1 bg-white border border-gray-200 rounded-2xl">
                      <button
                        type="button"
                        onClick={() => setPropertyDraft(prev => ({ ...prev, is_whole_unit: false }))}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all ${!propertyDraft.is_whole_unit ? 'bg-[var(--primary)] text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}
                      >
                        <LayoutGrid className="w-4 h-4" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Hotel Style</span>
                      </button>
                      <button
                        type="button"
                        disabled={['Hotel', 'Guesthouse', 'Resort'].includes(propertyDraft.type)}
                        onClick={() => setPropertyDraft(prev => ({ ...prev, is_whole_unit: true }))}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all ${propertyDraft.is_whole_unit ? 'bg-[var(--primary)] text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'
                          } ${['Hotel', 'Guesthouse', 'Resort'].includes(propertyDraft.type) ? 'opacity-30 cursor-not-allowed' : ''}`}
                      >
                        <Home className="w-4 h-4" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Whole Unit</span>
                      </button>
                    </div>
                  </div>

                  {/* Rental Policies */}
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Rental Options</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setPropertyDraft(prev => ({ ...prev, offers_daily: !prev.offers_daily }))}
                        className={`flex items-center justify-center gap-3 px-4 py-3 rounded-2xl border-2 transition-all ${propertyDraft.offers_daily ? 'border-[var(--primary)] bg-[var(--primary)]/5 text-[var(--primary)]' : 'border-gray-50 bg-gray-50 text-gray-400'}`}
                      >
                        <Calendar className="w-4 h-4" />
                        <span className="text-[10px] font-black uppercase tracking-widest mt-0.5">Daily</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setPropertyDraft(prev => ({ ...prev, offers_monthly: !prev.offers_monthly }))}
                        className={`flex items-center justify-center gap-3 px-4 py-3 rounded-2xl border-2 transition-all ${propertyDraft.offers_monthly ? 'border-[var(--primary)] bg-[var(--primary)]/5 text-[var(--primary)]' : 'border-gray-50 bg-gray-50 text-gray-400'}`}
                      >
                        <Calendar className="w-4 h-4" />
                        <span className="text-[10px] font-black uppercase tracking-widest mt-0.5">Monthly</span>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="pt-8 border-t border-gray-100 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
                  {propertyDraft.offers_daily && (
                    <Input
                      label="Daily Rate (USD)"
                      type="number"
                      value={propertyDraft.daily_price || ''}
                      onChange={(e) => setPropertyDraft(prev => ({ ...prev, daily_price: parseInt(e.target.value) || 0 }))}
                      placeholder="e.g. 100"
                      className="h-16 rounded-2xl bg-gray-50 text-xl font-bold font-mono"
                    />
                  )}
                  {propertyDraft.offers_monthly && (
                    <Input
                      label="Monthly Rate (USD)"
                      type="number"
                      value={propertyDraft.monthly_price || ''}
                      onChange={(e) => setPropertyDraft(prev => ({ ...prev, monthly_price: parseInt(e.target.value) || 0 }))}
                      placeholder="e.g. 2000"
                      className="h-16 rounded-2xl bg-gray-50 text-xl font-bold font-mono"
                    />
                  )}
                  {propertyDraft.is_whole_unit && (
                    <Input
                      label="Max Guests"
                      type="number"
                      value={propertyDraft.max_guests || ''}
                      onChange={(e) => setPropertyDraft(prev => ({ ...prev, max_guests: e.target.value === '' ? '' : (parseInt(e.target.value) || 1) }))}
                      placeholder="e.g. 4"
                      className="h-16 rounded-2xl bg-gray-50 text-xl font-bold font-mono"
                    />
                  )}
                </div>

                <div className="bg-emerald-50 rounded-3xl border border-emerald-100 p-8 flex gap-6 mt-12">
                  <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center text-emerald-500 shadow-sm shrink-0">
                    <Sparkles className="w-7 h-7" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-emerald-900 mb-1">You're ready to host!</h4>
                    <p className="text-sm text-emerald-700 font-medium leading-relaxed opacity-80">
                      {propertyDraft.name || 'Your property'} will be submitted for a quick review by our team to maintain platform quality.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* ─── Pro Tips Sidebar ────────────────────── */}
        <aside className="hidden lg:block space-y-6 sticky top-32">
          <div className="p-8 rounded-[2.5rem] bg-[var(--primary)] text-white shadow-xl shadow-[var(--primary)]/20 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:scale-150 transition-transform duration-700" />

            <div className="relative z-10 space-y-6">
              <div className="flex items-center gap-3">
                <Sparkles className="w-6 h-6 text-[var(--accent)]" />
                <span className="text-[10px] font-black uppercase tracking-[0.25em]">Expert Guidance</span>
              </div>

              <h4 className="text-xl font-black tracking-tight leading-tight">
                {currentStep === 1 ? 'Build Global Trust' :
                  currentStep === 2 ? 'Categorize for Success' :
                    currentStep === 3 ? 'Location is Everything' :
                      currentStep === 4 ? 'Boost your Value' :
                        currentStep === 5 ? 'Visual Storytelling' :
                          currentStep === 6 ? 'Secure Payouts' :
                            'Strategic Pricing'}
              </h4>

              <p className="text-sm font-medium text-white/70 leading-relaxed text-pretty">
                {currentStep === 1 ? "Your professional bio and business name are what guests see first. A clear, welcoming narrative increases booking rates by up to 30%." :
                  currentStep === 2 ? "Choosing the right category ensures you appear in specific guest searches. Villas and Boutique Hotels are currently our most requested categories in Rwanda." :
                    currentStep === 3 ? "Privacy is our priority. We only reveal your exact street address to guests after their booking is fully confirmed and vetted." :
                      currentStep === 4 ? "Properties with 'Free WiFi' and 'Workspace' see 40% more bookings. Consider these as baseline essentials for the modern traveler." :
                        currentStep === 5 ? "A great cover photo is your first impression. Use natural light and wide angles to make your space feel open and inviting." :
                          currentStep === 6 ? "We support global cards via Stripe and local convenience via Mobile Money. Choose the one that fits your business operations best." :
                            "New hosts often start with a competitive price to build their first 5-star reviews. You can increase your rates as your reputation grows."}
              </p>

              <div className="pt-4 flex items-center gap-2 group/help cursor-help">
                <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] inline-block" />
                <span className="text-[10px] font-black uppercase tracking-widest text-white/50 group-hover/help:text-white transition-colors">Learn more about hosting</span>
              </div>
            </div>
          </div>

          <div className="p-8 rounded-[2rem] bg-gray-50 border border-gray-100">
            <h5 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">Onboarding Progress</h5>
            <div className="space-y-4">
              {steps.map((step) => (
                <div key={step.id} className="flex items-center gap-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-black border transition-all ${currentStep > step.id ? 'bg-[var(--primary)] text-white border-[var(--primary)]' :
                    currentStep === step.id ? 'bg-white text-[var(--primary)] border-[var(--primary)] shadow-sm' :
                      'bg-white text-gray-300 border-gray-100'
                    }`}>
                    {currentStep > step.id ? <Check className="w-4 h-4" /> : step.id}
                  </div>
                  <span className={`text-[10px] font-black uppercase tracking-widest transition-colors ${currentStep >= step.id ? 'text-gray-900' : 'text-gray-300'
                    }`}>
                    {step.title}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </aside>

      </div>

      {/* ─── Persistent Footer Navigation ─────────── */}
      <footer className="border-t border-gray-100 bg-white/90 backdrop-blur-xl py-6 sm:py-8 sticky bottom-0 z-40 px-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            className={`flex items-center gap-2 text-sm font-black uppercase tracking-widest text-gray-900 disabled:opacity-0 transition-opacity`}
          >
            <ChevronLeft className="w-5 h-5" />
            Back
          </button>

          <div className="flex items-center gap-6">
            <span className="hidden sm:block text-[10px] font-black text-gray-400 uppercase tracking-widest">
              Progress: {Math.round((currentStep / steps.length) * 100)}%
            </span>
            {currentStep < steps.length ? (
              <Button
                size="lg"
                onClick={nextStep}
                className="h-14 sm:h-16 px-10 rounded-2xl bg-gray-900 text-white hover:bg-black transition-all font-black uppercase tracking-widest group"
                rightIcon={<ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
              >
                Continue
              </Button>
            ) : (
              <Button
                size="lg"
                onClick={handleComplete}
                disabled={isSubmitting}
                className="h-14 sm:h-16 px-10 rounded-2xl bg-[var(--accent)] text-[var(--primary)] hover:bg-[var(--accent-dark)] hover:text-white transition-all font-black uppercase tracking-widest border-none shadow-2xl shadow-[var(--accent)]/10"
              >
                {isSubmitting ? 'Publishing...' : 'Publish Listing'}
              </Button>
            )}
          </div>
        </div>
      </footer>
    </div>
  )
}
