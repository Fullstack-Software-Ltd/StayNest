'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { registerUser } from '@/app/(auth)/register/actions'
import { signIn } from 'next-auth/react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { LoadingSpinner, UrugostayLoader } from '@/components/shared/loading-spinner'
import { AlertCircle, CheckCircle, UserPlus, Users, Home, Star } from 'lucide-react'
import { useSettings } from '@/context/SettingsContext'
import { toast } from 'sonner'
import { ImigongoPattern } from '@/components/shared/imigongo-pattern'

interface RegisterFormProps {
  stats: {
    totalUsers: number
    totalProperties: number
    averageRating: number
  }
}

export function RegisterForm({ stats }: RegisterFormProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect')
  const { t } = useSettings()
  
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)

    const formData = new FormData(event.currentTarget)
    const fullName = formData.get('fullName') as string
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    if (!fullName || !email || !password) {
      toast.error(t('auth.errors.fill_all') || 'Please fill in all fields')
      setLoading(false)
      return
    }

    if (password.length < 6) {
      toast.error(t('auth.errors.password_length') || 'Password must be at least 6 characters')
      setLoading(false)
      return
    }

    try {
      const result = await registerUser({ fullName, email, password })
      if (!result.success) throw new Error('Registration failed')
      
      toast.success(t('auth.success.title') || 'Account created!')
      setSuccess(true)
      
      // Auto-login
      const signInResult = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      setTimeout(() => {
        if (signInResult?.error) {
          router.push('/login')
        } else {
          router.push('/')
        }
      }, 2000)
    } catch (signUpError: any) {
      console.error('[SIGNUP ERROR]', signUpError)
      toast.error(signUpError.message || t('common.error'))
      setLoading(false)
    }
  }

  return (
    <div className="h-screen overflow-hidden flex bg-[var(--background)]">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 h-full bg-gradient-to-br from-[var(--primary-dark)] via-[var(--primary)] to-[var(--primary-light)] relative overflow-hidden flex-col justify-between p-12 xl:p-16">
        {/* Imigongo heritage pattern */}
        <ImigongoPattern variant="dark" opacity={0.2} className="absolute inset-0 w-full h-full" />
        {/* Animated orbs */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 -right-20 w-80 h-80 bg-[var(--accent)]/10 rounded-full animate-float" style={{ animationDelay: '0s' }} />
          <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-[var(--primary-light)]/20 rounded-full animate-float" style={{ animationDelay: '1.5s' }} />
          <div className="absolute top-1/3 right-1/4 w-32 h-32 bg-[var(--accent)]/5 rounded-full animate-float" style={{ animationDelay: '3s' }} />
        </div>

        <div className="relative z-10 animate-fade-in">
          <Link href="/" className="text-3xl font-black text-white tracking-tight">
            Urugo<span className="text-[var(--accent)]">stay</span>
          </Link>
        </div>

        <div className="relative z-10 space-y-6 xl:space-y-8 animate-slide-up" style={{ animationDelay: '0.2s', animationFillMode: 'backwards' }}>
          {[
            t('auth.benefits.feature_stays'),
            t('auth.benefits.feature_secure'),
            t('auth.benefits.feature_reviews')
          ].map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-4 group animate-fade-in"
              style={{ animationDelay: `${0.3 + i * 0.15}s`, animationFillMode: 'backwards' }}
            >
              <div className="w-10 h-10 bg-white/10 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-[var(--accent)]/20 group-hover:scale-110 transition-all">
                <CheckCircle className="w-5 h-5 text-[var(--accent)]" />
              </div>
              <p className="text-white font-bold text-base xl:text-lg tracking-tight">{item}</p>
            </div>
          ))}
        </div>

        <div className="relative z-10 flex gap-8 xl:gap-12 animate-fade-in" style={{ animationDelay: '0.6s', animationFillMode: 'backwards' }}>
          {[
            { icon: Users, value: stats.totalUsers.toLocaleString(), label: 'Total Users' },
            { icon: Home, value: stats.totalProperties.toLocaleString(), label: 'Properties' },
            { icon: Star, value: stats.averageRating > 0 ? stats.averageRating : '0.0', label: 'Avg Rating' },
          ].map(({ icon: Icon, value, label }) => (
            <div key={label} className="group">
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
      <div className="flex-1 h-full overflow-y-auto bg-[var(--warm-white)] flex flex-col justify-center py-8">
        <div className="w-full max-w-sm mx-auto px-5 sm:px-6 animate-slide-up" style={{ animationDelay: '0.1s', animationFillMode: 'backwards' }}>
          <div className="mb-8">
            <Link href="/" className="text-2xl font-black text-[var(--primary)] tracking-tight lg:hidden block mb-6">
              Urugo<span className="text-[var(--accent)]">stay</span>
            </Link>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-2">
              {t('auth.register_title')}
            </h1>
            <p className="text-gray-400 font-medium text-sm">
              {t('auth.register_subtitle')}
            </p>
          </div>

          {success ? (
            <div className="flex flex-col items-center gap-6 py-10 animate-scale-in">
              <div className="w-20 h-20 bg-[var(--primary)]/5 rounded-[2.5rem] flex items-center justify-center text-[var(--primary)] border border-[var(--primary)]/10 shadow-xl shadow-[var(--primary)]/10 animate-pulse-glow">
                <CheckCircle className="w-10 h-10" />
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-black text-gray-900 mb-2">{t('auth.success.title')}</h3>
                <p className="text-gray-500 text-sm font-medium">{t('auth.success.redirecting')}</p>
              </div>
              <UrugostayLoader size="sm" />
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">

              <div className="space-y-4 sm:space-y-5">
                <Input
                  name="fullName"
                  label={t('auth.full_name')}
                  type="text"
                  placeholder="John Doe"
                  required
                  autoComplete="name"
                  className="rounded-2xl border-[var(--primary)]/10 bg-white"
                />

                <Input
                  name="email"
                  label={t('auth.email')}
                  type="email"
                  placeholder="email@example.com"
                  required
                  autoComplete="email"
                  className="rounded-2xl border-[var(--primary)]/10 bg-white"
                />

                <div className="space-y-2">
                  <Input
                    name="password"
                    label={t('auth.password')}
                    type="password"
                    placeholder="••••••••"
                    required
                    minLength={6}
                    autoComplete="new-password"
                    className="rounded-2xl border-[var(--primary)]/10 bg-white"
                  />
                  <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-1 ml-1">
                    {t('auth.errors.password_length')}
                  </p>
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
                    {t('auth.creating_account')}
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    {t('auth.create_account')}
                  </>
                )}
              </Button>

              <p className="text-center text-[10px] sm:text-xs text-gray-400 pt-3 sm:pt-4 font-bold uppercase tracking-widest">
                {t('auth.have_account')}{' '}
                <Link 
                  href={redirect ? `/login?redirect=${encodeURIComponent(redirect)}` : '/login'} 
                  className="text-[var(--primary)] font-black hover:underline underline-offset-4 decoration-2"
                >
                  {t('auth.sign_in')}
                </Link>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
