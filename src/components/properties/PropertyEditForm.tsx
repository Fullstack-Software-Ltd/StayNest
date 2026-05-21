'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Property, PropertyStatus } from '@/types/property'
import { updateProperty } from '@/lib/properties/updateProperty'
import { Button } from '@/components/shared/Button'
import { Input } from '@/components/shared/Input'
import { 
  Save, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  CheckCircle2, 
  MapPin, 
  Info,
  Sparkles
} from 'lucide-react'
import { toast } from 'sonner'

interface PropertyEditFormProps {
  property: Property
}

export function PropertyEditForm({ property }: PropertyEditFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: property.name,
    type: property.type,
    description: property.description,
    city: property.city,
    country: property.country,
    address: property.address,
    status: property.status
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {
      await updateProperty(property.id, formData)
      toast.success('Property updated successfully')
      router.push(`/owner/properties/${property.id}`)
      router.refresh()
    } catch (error: any) {
      toast.error(error.message || 'Failed to update property')
    } finally {
      setLoading(false)
    }
  }

  const isDraft = formData.status === 'draft'
  const isPending = formData.status === 'pending'
  const isApproved = formData.status === 'approved'

  return (
    <form onSubmit={handleSubmit} className="space-y-10 group">
      
      {/* ─── Header Info ────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-10 border-b border-gray-100">
        <div className="space-y-1">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Property Name</label>
          <Input 
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            className="text-2xl font-black text-gray-900 border-none bg-transparent h-auto p-0 focus:ring-0 focus:text-[var(--primary)] transition-colors"
            placeholder="Property Name"
          />
        </div>
        
        <div className="flex items-center gap-3">
          <div className={`px-4 py-2 rounded-2xl flex items-center gap-2 border ${
            isApproved ? 'bg-emerald-50 border-emerald-100 text-emerald-700' :
            isPending ? 'bg-amber-50 border-amber-100 text-amber-700' :
            'bg-gray-50 border-gray-200 text-gray-500'
          }`}>
             {isApproved ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
             <span className="text-[10px] font-black uppercase tracking-widest">{formData.status}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-10">
          {/* Detailed Info Section */}
          <div className="space-y-6">
            <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest flex items-center gap-2">
              <Info className="w-4 h-4 text-[var(--primary)]" />
              Core Information
            </h3>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Property Type</label>
                  <select 
                    value={formData.type}
                    onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                    className="w-full h-14 px-5 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-[var(--primary)]/10 text-sm font-bold text-gray-700"
                  >
                    {['Hotel', 'Apartment', 'Villa', 'Guesthouse', 'Resort'].map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">City</label>
                  <Input 
                    value={formData.city}
                    onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                    className="h-14 rounded-2xl bg-gray-50"
                  />
                </div>
              </div>

              <div className="space-y-2">
                 <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Full Address</label>
                 <Input 
                   value={formData.address}
                   onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                   className="h-14 rounded-2xl bg-gray-50"
                   icon={<MapPin className="w-4 h-4 text-gray-400" />}
                 />
              </div>

              <div className="space-y-2">
                 <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Description</label>
                 <textarea 
                   rows={6}
                   value={formData.description}
                   onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                   className="w-full p-6 bg-gray-50 rounded-3xl border-none outline-none focus:ring-2 focus:ring-[var(--primary)]/10 text-gray-700 font-medium leading-relaxed"
                   placeholder="Describe your property..."
                 />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-10">
          {/* Status & Visibility Section */}
          <div className="space-y-6">
            <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest flex items-center gap-2">
              <Eye className="w-4 h-4 text-[var(--accent)]" />
              Visibility & Publishing
            </h3>

            <div className={`p-8 rounded-[2.5rem] border ${
              isDraft ? 'bg-gray-50 border-gray-100' : 'bg-[var(--primary)]/5 border-[var(--primary)]/10'
            } transition-colors`}>
               <div className="flex gap-6 items-start">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border ${
                    isDraft ? 'bg-white text-gray-400 border-gray-100' : 'bg-[var(--primary)] text-white border-[var(--primary)]'
                  } shadow-lg shadow-black/5`}>
                     {isDraft ? <EyeOff className="w-7 h-7" /> : <Eye className="w-7 h-7" />}
                  </div>
                  <div className="space-y-2">
                     <h4 className="text-lg font-bold text-gray-900 leading-none">Public Visibility</h4>
                     <p className="text-xs text-gray-500 font-medium leading-relaxed">
                        {isDraft 
                          ? 'This listing is private and hidden from search results. Only you can see it.'
                          : 'This listing is visible to travelers. Changes may require review.'
                        }
                     </p>
                     
                     <div className="pt-4 flex gap-3">
                        <button 
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, status: 'draft' }))}
                          className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                            isDraft ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-900 border-gray-200 hover:border-gray-900'
                          }`}
                        >
                          Keep Draft
                        </button>
                        <button 
                          type="button"
                          disabled={isApproved || isPending}
                          onClick={() => setFormData(prev => ({ ...prev, status: 'pending' }))}
                          className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                            isPending ? 'bg-[var(--primary)] text-white border-[var(--primary)]' : 
                            (isApproved ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-white text-gray-900 border-gray-200 hover:border-gray-900')
                          } disabled:cursor-not-allowed`}
                        >
                          {isApproved ? 'Listing Active' : 'Request Publish'}
                        </button>
                     </div>
                  </div>
               </div>
            </div>

            {isApproved && (
               <div className="p-8 rounded-[2.5rem] bg-emerald-50 border border-emerald-100 flex gap-6 items-start">
                  <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-emerald-500 shadow-sm shrink-0">
                     <Sparkles className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                     <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Premium Listing</p>
                     <h4 className="text-base font-bold text-emerald-900 leading-tight">Your property is live!</h4>
                     <p className="text-xs text-emerald-700/80 font-medium leading-relaxed">
                        It's currently appearing in search results and ready for bookings.
                     </p>
                  </div>
               </div>
            )}
          </div>
        </div>
      </div>

      {/* ─── Form Actions ────────────────────────── */}
      <div className="pt-10 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-6">
        <p className="text-xs font-medium text-gray-400 italic">
          Last updated recently. All changes are saved to the platform securely.
        </p>
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <Button 
            type="button"
            variant="ghost" 
            onClick={() => router.push(`/owner/properties/${property.id}`)}
            className="rounded-2xl px-8 font-black text-xs uppercase tracking-widest"
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            isLoading={loading}
            className="flex-1 sm:flex-none h-16 px-12 rounded-2xl shadow-xl shadow-[var(--primary)]/10 font-black text-xs uppercase tracking-[0.2em]"
            rightIcon={<Save className="w-4 h-4" />}
          >
            Save Changes
          </Button>
        </div>
      </div>
    </form>
  )
}
