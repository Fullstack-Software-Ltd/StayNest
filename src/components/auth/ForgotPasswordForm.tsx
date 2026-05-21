'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Mail, ArrowLeft, CheckCircle, Users, Home, Star, AlertCircle } from 'lucide-react'
import { useSettings } from '@/context/SettingsContext'
import { ImigongoPattern } from '@/components/shared/imigongo-pattern'

interface ForgotPasswordFormProps {
  stats: {
    totalUsers: number
    totalProperties: number
    averageRating: number
  }
}

export function ForgotPasswordForm({ stats }: ForgotPasswordFormProps) {
  const { t } = useSettings()
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    // In the new stack, this would call a server action to send a reset email.
    // For now, we show a maintenance message or a simulated success.
    setSubmitted(true)
  }

  if (submitted) {
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

        <div className="flex-1 flex items-center justify-center px-5 sm:px-6 py-10 bg-[var(--warm-white)]">
          <div className="w-full max-w-sm text-center animate-scale-in">
            <div className="w-20 h-20 bg-amber-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 text-amber-600 border border-amber-100 shadow-xl shadow-amber-500/5">
              <AlertCircle className="w-10 h-10" />
            </div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-4">
              Feature Under Maintenance
            </h1>
            <p className="text-gray-500 font-medium mb-8">
              The password recovery system is currently being upgraded. Please contact support if you need immediate assistance.
            </p>
            <Link 
              href="/login" 
              className="inline-flex items-center gap-2 text-sm font-black text-[var(--primary)] hover:underline underline-offset-4 decoration-2 uppercase tracking-widest"
            >
              <ArrowLeft className="w-4 h-4" />
              {t('auth.back_to_login')}
            </Link>
          </div>
        </div>
      </div>
    )
  }

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
      </div>

      <div className="flex-1 flex items-center justify-center px-5 sm:px-6 py-10 bg-[var(--warm-white)]">
        <div className="w-full max-w-sm animate-slide-up">
          <div className="mb-10">
            <Link href="/login" className="inline-flex items-center gap-2 text-[10px] font-black text-gray-400 hover:text-[var(--primary)] mb-8 transition-colors uppercase tracking-[0.2em]">
              <ArrowLeft className="w-3 h-3" />
              {t('auth.back_to_login')}
            </Link>
            <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight mb-3">
              {t('auth.forgot_password_title')}
            </h1>
            <p className="text-gray-400 font-medium text-sm sm:text-base leading-relaxed">
              {t('auth.forgot_password_subtitle')}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              name="email"
              label={t('auth.email')}
              type="email"
              placeholder="email@example.com"
              required
              className="rounded-2xl border-[var(--primary)]/10 bg-white"
            />

            <Button
              type="submit"
              className="w-full h-12 sm:h-14 rounded-2xl text-sm font-black gap-2 mt-3 sm:mt-4 shadow-xl shadow-[var(--primary)]/10 hover:shadow-[var(--primary)]/20 active:scale-[0.98] transition-all"
            >
              <Mail className="w-4 h-4" />
              {t('auth.send_reset_link')}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
