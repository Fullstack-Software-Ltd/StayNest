'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Mail, ArrowLeft, CheckCircle, Users, Home, Star } from 'lucide-react'
import { useSettings } from '@/context/SettingsContext'
import { ImigongoPattern } from '@/components/shared/imigongo-pattern'

interface VerifyEmailFormProps {
  stats: {
    totalUsers: number
    totalProperties: number
    averageRating: number
  }
}

export function VerifyEmailForm({ stats }: VerifyEmailFormProps) {
  const searchParams = useSearchParams()
  const email = searchParams.get('email') || ''
  const { t } = useSettings()
  
  return (
    <div className="min-h-screen flex bg-[var(--background)]">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[var(--primary-dark)] via-[var(--primary)] to-[var(--primary-light)] relative overflow-hidden flex-col justify-between p-12 xl:p-16">
        <ImigongoPattern variant="dark" opacity={0.2} className="absolute inset-0 w-full h-full" />
        <div className="relative z-10">
          <Link href="/" className="text-3xl font-black text-white tracking-tight">
            Urugo<span className="text-[var(--accent)]">stay</span>
          </Link>
        </div>
        <div className="relative z-10 flex gap-8 xl:gap-12 text-white/50">
           {[
            { icon: Users, value: stats.totalUsers.toLocaleString(), label: 'Total Users' },
            { icon: Home, value: stats.totalProperties.toLocaleString(), label: 'Properties' },
            { icon: Star, value: stats.averageRating > 0 ? stats.averageRating : '0.0', label: 'Avg Rating' },
          ].map(({ icon: Icon, value, label }) => (
            <div key={label} className="group">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center">
                  <Icon className="w-4 h-4 text-[var(--accent)]" />
                </div>
                <p className="text-2xl xl:text-3xl font-black text-white">{value}</p>
              </div>
              <p className="text-white/30 text-[9px] font-bold uppercase tracking-[0.2em]">{label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-5 sm:px-6 py-10 bg-[var(--warm-white)]">
        <div className="w-full max-w-md text-center animate-scale-in">
          <div className="w-24 h-24 bg-green-50 rounded-[3rem] flex items-center justify-center mx-auto mb-8 text-green-600 border border-green-100 shadow-xl shadow-green-500/5">
            <CheckCircle className="w-12 h-12" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight mb-4">
            Registration Successful!
          </h1>
          <p className="text-gray-500 font-medium text-lg leading-relaxed mb-8">
            Welcome to UrugoStay. Your account has been created successfully. You can now sign in to start exploring.
          </p>
          <div className="space-y-4">
            <Link 
              href="/login" 
              className="inline-flex items-center justify-center h-14 w-full rounded-2xl bg-[var(--primary)] text-white text-sm font-black shadow-xl shadow-[var(--primary)]/20 hover:scale-[1.02] active:scale-[0.98] transition-all uppercase tracking-widest"
            >
              Go to Login
            </Link>
            <Link 
              href="/" 
              className="flex items-center justify-center gap-2 h-14 w-full text-sm font-black text-gray-400 hover:text-[var(--primary)] transition-all uppercase tracking-widest"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
