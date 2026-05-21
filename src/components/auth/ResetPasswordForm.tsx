'use client'

import Link from 'next/link'
import { AlertCircle, ArrowLeft, Users, Home, Star } from 'lucide-react'
import { useSettings } from '@/context/SettingsContext'
import { ImigongoPattern } from '@/components/shared/imigongo-pattern'

interface ResetPasswordFormProps {
  stats: {
    totalUsers: number
    totalProperties: number
    averageRating: number
  }
}

export function ResetPasswordForm({ stats }: ResetPasswordFormProps) {
  const { t } = useSettings()

  return (
    <div className="min-h-screen flex bg-[var(--background)]">
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[var(--primary-dark)] via-[var(--primary)] to-[var(--primary-light)] relative overflow-hidden flex-col justify-between p-12 xl:p-16">
        <ImigongoPattern variant="dark" opacity={0.2} className="absolute inset-0 w-full h-full" />
        <div className="relative z-10">
          <Link href="/" className="text-3xl font-black text-white tracking-tight">
            Urugo<span className="text-[var(--accent)]">stay</span>
          </Link>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-5 sm:px-6 py-10 bg-[var(--background)]">
        <div className="w-full max-w-sm text-center animate-scale-in">
          <div className="w-20 h-20 bg-amber-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 text-amber-600 border border-amber-100 shadow-xl shadow-amber-500/5">
            <AlertCircle className="w-10 h-10" />
          </div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-4">
            Link Expired or Invalid
          </h1>
          <p className="text-gray-500 font-medium mb-8">
            The password reset link has either expired or already been used as part of our security upgrade. Please request a new one if available or contact support.
          </p>
          <Link 
            href="/forgot-password" 
            className="inline-flex items-center gap-2 h-12 px-8 rounded-2xl bg-[var(--primary)] text-white text-sm font-black shadow-xl shadow-[var(--primary)]/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            Request New Link
          </Link>
          <div className="mt-6">
            <Link 
              href="/login" 
              className="inline-flex items-center gap-2 text-xs font-black text-gray-400 hover:text-[var(--primary)] transition-colors uppercase tracking-widest"
            >
              <ArrowLeft className="w-3 h-3" />
              {t('auth.back_to_login')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
