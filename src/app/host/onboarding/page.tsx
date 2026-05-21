'use client'

import React, { useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { motion } from 'framer-motion'
import { 
  UserCheck, 
  Home, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight,
  Shield,
  Camera,
  MapPin,
  Users,
  Loader2
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/utils/cn'

const steps = [
  {
    id: 1,
    title: "Complete your host profile",
    desc: "Tell the community about yourself and your hospitality style.",
    icon: UserCheck,
    color: "bg-blue-500"
  },
  {
    id: 2,
    title: "Add your property details",
    desc: "Showcase your space with high-quality photos and accurate descriptions.",
    icon: Home,
    color: "bg-[var(--primary)]"
  },
  {
    id: 3,
    title: "Submit listing for approval",
    desc: "Our team reviews every listing to maintain the UrugoStay standard.",
    icon: ShieldCheck,
    color: "bg-[var(--accent)]"
  },
  {
    id: 4,
    title: "Start receiving bookings",
    desc: "Welcome guests from around the world and start earning.",
    icon: Sparkles,
    color: "bg-emerald-500"
  }
]

const safetyGuidelines = [
  { icon: Shield, text: "Use real property information" },
  { icon: MapPin, text: "Add accurate location" },
  { icon: Camera, text: "Upload clear photos/videos" },
  { icon: Users, text: "Respect guests and platform rules" },
  { icon: CheckCircle2, text: "Listings must be approved before going live" }
]

export default function HostOnboardingIntroPage() {
  const router = useRouter()
  const { status } = useSession()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?redirect=/host/onboarding')
    }
  }, [status, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-[var(--background)] flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 text-[var(--primary)] animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[var(--background)] pt-32 pb-20 px-6 sm:px-12">
      <div className="max-w-5xl mx-auto">
        
        {/* Header Section */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl sm:text-6xl font-serif text-[var(--luxury-green)] mb-6">
              Become a host on <span className="italic">UrugoStay</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-500 max-w-2xl mx-auto font-medium">
              Earn money by listing your property and welcoming guests to the most distinctive stays in Rwanda.
            </p>
          </motion.div>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group p-8 rounded-3xl bg-white border border-gray-100 shadow-sm hover:shadow-xl hover:border-[var(--luxury-gold)]/20 transition-all duration-500"
            >
              <div className={cn(
                "w-12 h-12 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg",
                step.color
              )}>
                <step.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-3">
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-300">Step 0{step.id}</span>
                {step.title}
              </h3>
              <p className="text-gray-500 leading-relaxed">
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Safety & Trust Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-[var(--primary)] text-white rounded-[3rem] p-8 sm:p-16 relative overflow-hidden mb-20"
        >
          {/* Decorative Background */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-[var(--accent)]/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

          <div className="relative z-10 max-w-3xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl font-serif italic mb-10">Commitment to Safety & Quality</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-left mb-12">
              {safetyGuidelines.map((item, i) => (
                <div key={i} className="flex items-center gap-4 bg-white/5 backdrop-blur-sm p-4 rounded-2xl border border-white/10">
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                    <item.icon className="w-4 h-4 text-[var(--accent-light)]" />
                  </div>
                  <span className="text-xs font-medium text-white/90">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* CTA Section */}
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Link href="/host/setup/profile">
              <Button 
                size="lg" 
                className="h-16 px-12 rounded-2xl text-base font-black uppercase tracking-[0.2em] shadow-2xl shadow-[var(--primary)]/20 group"
              >
                Start Hosting
                <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-2 transition-transform" />
              </Button>
            </Link>
            <p className="mt-6 text-[10px] font-black uppercase tracking-widest text-gray-400">
              No listing fees. Pay only when you get a booking.
            </p>
          </motion.div>
        </div>

      </div>
    </div>
  )
}
