'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { signIn } from 'next-auth/react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { LoadingSpinner } from '@/components/shared/loading-spinner'
import { AlertCircle, CheckCircle, LogIn, Users, Home, Star } from 'lucide-react'
import { useSettings } from '@/context/SettingsContext'
import { toast } from 'sonner'
import { ImigongoPattern } from '@/components/shared/imigongo-pattern'

interface LoginFormProps {
  stats: {
    totalUsers: number
    totalProperties: number
    averageRating: number
  }
}

export function LoginForm({ stats }: LoginFormProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || searchParams.get('callbackUrl')
  const verified = searchParams.get('verified') === 'true'
  const errorParam = searchParams.get('error')
  const { t } = useSettings()
  
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (errorParam === 'invalid-link' || errorParam === 'link-expired') {
      toast.error(t('auth.errors.invalid_link') || 'This link is invalid or has expired.')
    } else if (errorParam === 'auth-error' || errorParam === 'auth-callback-error') {
      toast.error(t('auth.errors.invalid_credentials') || 'Authentication failed. Please try again.')
    } else if (errorParam) {
      toast.error(t('common.error') || 'An unexpected error occurred.')
    }
  }, [errorParam, t])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)

    const formData = new FormData(event.currentTarget)
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    if (!email || !password) {
      toast.error(t('auth.errors.fill_all') || 'Please fill in all fields')
      setLoading(false)
      return
    }

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })

    if (result?.error) {
      toast.error(t('auth.errors.invalid_credentials') || 'Invalid email or password.')
      setLoading(false)
    } else {
      toast.success(t('auth.login_success') || 'Welcome back!')
      
      // If there's a specific redirect, use it. Otherwise, fetch session to determine role-based home.
      if (redirect) {
        router.push(redirect)
      } else {
        const { getSession } = await import('next-auth/react')
        const session = await getSession()
        const role = (session?.user as any)?.role
        
        if (role === 'admin') {
          router.push('/admin/dashboard')
        } else if (role === 'owner') {
          router.push('/owner/dashboard')
        } else {
          router.push('/')
        }
      }
      
      router.refresh()
    }
  }

  return (
    <div className="min-h-screen flex bg-[var(--background)]">
      {/* Left panel - decorative */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[var(--primary-dark)] via-[var(--primary)] to-[var(--primary-light)] relative overflow-hidden flex-col justify-between p-12 xl:p-16">
        {/* Imigongo heritage pattern */}
        <ImigongoPattern variant="dark" opacity={0.2} className="absolute inset-0 w-full h-full" />
        {/* Animated orbs */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 -right-20 w-80 h-80 bg-[var(--accent)]/10 rounded-full animate-float" style={{ animationDelay: '0s' }} />
          <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-[var(--primary-light)]/20 rounded-full animate-float" style={{ animationDelay: '1.5s' }} />
          <div className="absolute top-1/2 left-1/3 w-40 h-40 bg-[var(--accent)]/5 rounded-full animate-float" style={{ animationDelay: '3s' }} />
        </div>

        <div className="relative z-10 animate-fade-in">
          <Link href="/" className="text-3xl font-black text-white tracking-tight">
            Urugo<span className="text-[var(--accent)]">stay</span>
          </Link>
        </div>

        <div className="relative z-10 animate-slide-up" style={{ animationDelay: '0.2s', animationFillMode: 'backwards' }}>
          <blockquote className="text-2xl xl:text-3xl font-black text-white leading-tight mb-4 italic">
            "{t('auth.benefits.quote')}"
          </blockquote>
          <p className="text-[var(--accent)] text-xs font-bold uppercase tracking-[0.2em]">— {t('auth.benefits.team')}</p>
        </div>

        <div className="relative z-10 flex gap-8 xl:gap-12 animate-fade-in" style={{ animationDelay: '0.4s', animationFillMode: 'backwards' }}>
          {[
            { icon: Users, value: stats.totalUsers.toLocaleString(), label: 'Total Users' },
            { icon: Home, value: stats.totalProperties.toLocaleString(), label: 'Properties' },
            { icon: Star, value: stats.averageRating > 0 ? stats.averageRating : '0.0', label: 'Avg Rating' },
          ].map(({ icon: Icon, value, label }, i) => (
            <div key={label} className="group" style={{ animationDelay: `${0.5 + i * 0.1}s` }}>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center group-hover:bg-[var(--accent)]/20 transition-all group-hover:scale-110">
                  <Icon className="w-4 h-4 text-[var(--accent)]" />
                </div>
                <p className="text-2xl xl:text-3xl font-black text-white">{value}</p>
              </div>
              <p className="text-white/30 text-[9px] font-bold uppercase tracking-[0.2em]">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel - form */}
      <div className="flex-1 flex items-center justify-center px-5 sm:px-6 py-10 sm:py-12 md:py-20 bg-[var(--warm-white)]">
        <div className="w-full max-w-sm animate-slide-up" style={{ animationDelay: '0.1s', animationFillMode: 'backwards' }}>
          <div className="mb-10 sm:mb-12">
            <Link href="/" className="text-2xl font-black text-[var(--primary)] tracking-tight lg:hidden block mb-8 sm:mb-10">
              Urugo<span className="text-[var(--accent)]">stay</span>
            </Link>
            <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight mb-2 sm:mb-3">
              {t('auth.login_title')}
            </h1>
            <p className="text-gray-400 font-medium text-sm sm:text-base">
              {t('auth.login_subtitle')}
            </p>
          </div>

          {verified && (
            <div className="mb-6 p-4 rounded-2xl bg-green-50 border border-green-100 flex items-start gap-3 animate-scale-in">
              <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center shrink-0">
                <CheckCircle className="w-4 h-4 text-green-600" />
              </div>
              <p className="text-sm font-medium text-green-800 pt-1.5">
                {t('auth.verified_success')}
              </p>
            </div>
          )}

          {errorParam && (
            <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-100 flex items-start gap-3 animate-shake">
              <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center shrink-0">
                <AlertCircle className="w-4 h-4 text-red-600" />
              </div>
              <p className="text-sm font-medium text-red-800 pt-1.5">
                {errorParam === 'auth-callback-error' 
                  ? t('auth.errors.invalid_link') 
                  : (t('auth.errors.generic') || 'Authentication failed. Please try again.')}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">

            <div className="space-y-4 sm:space-y-5">
              <Input
                name="email"
                label={t('auth.email')}
                type="email"
                placeholder="email@example.com"
                required
                autoComplete="email"
                className="rounded-2xl border-[var(--primary)]/10 bg-white focus:border-[var(--primary)]/30 focus:ring-2 focus:ring-[var(--primary)]/5"
              />

              <Input
                name="password"
                label={t('auth.password')}
                type="password"
                placeholder="••••••••"
                required
                autoComplete="current-password"
                className="rounded-2xl border-[var(--primary)]/10 bg-white focus:border-[var(--primary)]/30 focus:ring-2 focus:ring-[var(--primary)]/5"
              />

              <div className="flex justify-end">
                <Link 
                  href="/forgot-password" 
                  className="text-[10px] sm:text-xs font-bold text-[var(--primary)] hover:underline uppercase tracking-widest"
                >
                  {t('auth.forgot_password_link')}
                </Link>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 sm:h-14 rounded-2xl text-sm font-black gap-2 mt-3 sm:mt-4 shadow-xl shadow-[var(--primary)]/10 hover:shadow-[var(--primary)]/20 active:scale-[0.98] transition-all"
              disabled={loading}
            >
              {loading ? (
                <>
                  <LoadingSpinner size="sm" label="" />
                  {t('auth.signing_in')}
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  {t('auth.sign_in')}
                </>
              )}
            </Button>

            <p className="text-center text-[10px] sm:text-xs text-gray-400 pt-3 sm:pt-4 font-bold uppercase tracking-widest">
              {t('auth.no_account')}{' '}
              <Link href="/register" className="text-[var(--primary)] font-black hover:underline underline-offset-4 decoration-2">
                {t('auth.create_account')}
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}
