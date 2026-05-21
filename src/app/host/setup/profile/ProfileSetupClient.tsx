'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  UserCircle, 
  Phone, 
  AlignLeft, 
  ArrowRight, 
  Loader2,
  CheckCircle2,
  ChevronRight
} from 'lucide-react'
import { cn } from '@/utils/cn'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { updateHostProfile } from '@/app/actions/onboarding'
import { toast } from 'sonner'
import { useSession } from 'next-auth/react'

interface HostProfileSetupClientProps {
  initialProfile?: any
}

export default function HostProfileSetupClient({ initialProfile }: HostProfileSetupClientProps) {
  const router = useRouter()
  const { update } = useSession()
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(1)

  const [formData, setFormData] = useState({
    full_name: initialProfile?.full_name || '',
    phone: initialProfile?.phone || '',
    bio: initialProfile?.bio || ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleNext = () => {
    if (step === 1 && (!formData.full_name || !formData.phone)) {
      toast.error('Please provide your name and phone number')
      return
    }
    setStep(prev => prev + 1)
  }

  const handleSubmit = async () => {
    if (!formData.bio) {
      toast.error('Please tell us a bit about yourself')
      return
    }

    setLoading(true)
    try {
      const result = await updateHostProfile(formData)
      if (result.success) {
        // Force refresh the local session with the new role
        await update({ 
          role: 'owner', 
          isHostOnboarded: true 
        })
        
        toast.success('Host profile updated successfully!')
        setStep(3) // Success step
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex-1 w-full flex flex-col items-center justify-center py-6 px-6 relative">
      <div className="max-w-md w-full">
        
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="text-center space-y-2">
                <div className="w-16 h-16 bg-[var(--primary)]/5 rounded-2xl border border-[var(--primary)]/10 shadow-inner flex items-center justify-center mx-auto mb-4">
                  <UserCircle className="w-8 h-8 text-[var(--primary)]" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-serif italic text-[var(--luxury-green)] tracking-tight">Your Identity</h1>
                <p className="text-xs text-gray-500 font-medium leading-relaxed max-w-xs mx-auto">
                  Start by telling us how you'd like to be seen by guests on the platform.
                </p>
              </div>

              <div className="luxury-glass p-6 sm:p-8 rounded-[2rem] shadow-lg space-y-4">
                <Input
                  label="Display Name / Full Name"
                  name="full_name"
                  placeholder="e.g., Jean de Dieu"
                  icon={UserCircle}
                  value={formData.full_name}
                  onChange={handleChange}
                  className="h-11 rounded-xl bg-white/70 border border-gray-100 hover:border-gray-200 transition-all font-semibold"
                />
                <Input
                  label="Phone Number"
                  name="phone"
                  type="tel"
                  placeholder="e.g., +250 788 000 000"
                  icon={Phone}
                  value={formData.phone}
                  onChange={handleChange}
                  className="h-11 rounded-xl bg-white/70 border border-gray-100 hover:border-gray-200 transition-all font-semibold"
                />
              </div>

              <button 
                onClick={handleNext} 
                className="w-full h-12 rounded-xl bg-[var(--primary)] text-white hover:bg-[var(--primary-dark)] text-[10px] font-black uppercase tracking-[0.25em] shadow-lg shadow-[var(--primary)]/10 hover-lift group flex items-center justify-center gap-2 cursor-pointer"
              >
                Next Step
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="text-center space-y-2">
                <div className="w-16 h-16 bg-[var(--accent)]/5 rounded-2xl border border-[var(--accent)]/10 shadow-inner flex items-center justify-center mx-auto mb-4">
                  <AlignLeft className="w-8 h-8 text-[var(--accent)]" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-serif italic text-[var(--luxury-green)] tracking-tight">Your Story</h1>
                <p className="text-xs text-gray-500 font-medium leading-relaxed max-w-xs mx-auto">
                  Write a short bio. Guests love knowing more about their hosts before booking.
                </p>
              </div>

              <div className="luxury-glass p-6 sm:p-8 rounded-[2rem] shadow-lg space-y-4">
                <Textarea
                  label="Host Bio"
                  name="bio"
                  placeholder="Share a little bit about yourself, your hosting style, or your properties..."
                  value={formData.bio}
                  onChange={handleChange}
                  className="rounded-xl bg-white/70 border border-gray-100 hover:border-gray-200 transition-all font-semibold min-h-[120px]"
                />
              </div>

              <div className="flex gap-3">
                <button 
                  onClick={() => setStep(1)} 
                  className="h-12 px-6 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 text-[10px] font-black uppercase tracking-[0.2em] transition-all hover-lift cursor-pointer"
                >
                  Back
                </button>
                <button 
                  onClick={handleSubmit} 
                  disabled={loading}
                  className="flex-1 h-12 rounded-xl bg-[var(--primary)] text-white hover:bg-[var(--primary-dark)] text-[10px] font-black uppercase tracking-[0.25em] shadow-lg shadow-[var(--primary)]/10 hover-lift group flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      Complete Setup
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="text-center space-y-6"
            >
              <div className="w-20 h-20 bg-emerald-50/50 rounded-[2rem] border border-emerald-100 flex items-center justify-center mx-auto mb-4 shadow-inner animate-bounce-in">
                <CheckCircle2 className="w-10 h-10 text-emerald-500" />
              </div>
              <div className="space-y-2 animate-fade-in-up">
                <h1 className="text-2xl sm:text-3xl font-serif italic text-[var(--luxury-green)] tracking-tight">You're all set!</h1>
                <p className="text-xs text-gray-500 font-medium leading-relaxed max-w-xs mx-auto">
                  Your host profile has been created. You can now access your dashboard and start listing properties.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button 
                  onClick={() => {
                    router.push('/host/setup/property')
                    router.refresh()
                  }}
                  className="flex-1 h-12 rounded-xl bg-[var(--primary)] text-white hover:bg-[var(--primary-dark)] text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-[var(--primary)]/10 hover-lift group flex items-center justify-center gap-2 cursor-pointer"
                >
                  List Your First Property
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
                <button 
                  onClick={() => {
                    router.push('/owner/dashboard')
                    router.refresh()
                  }}
                  className="flex-1 h-12 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 text-[10px] font-black uppercase tracking-[0.2em] transition-all hover-lift flex items-center justify-center cursor-pointer"
                >
                  Go to Dashboard
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Progress Dots */}
        {step < 3 && (
          <div className="flex justify-center gap-2 mt-8">
            {[1, 2].map((i) => (
              <div 
                key={i}
                className={cn(
                  "h-1 rounded-full transition-all duration-500",
                  step === i ? "w-8 bg-[var(--accent)]" : "w-1 bg-gray-200"
                )}
              />
            ))}
          </div>
        )}

      </div>
    </div>
  )
}
