'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { CheckCircle, AlertCircle, Lock } from 'lucide-react'
import { HouseButtonLoader } from '@/components/shared/HouseLoader'
import { useSettings } from '@/context/SettingsContext'
import { changePassword } from '@/app/actions/settings'

export function PasswordChangeSection() {
  const { t } = useSettings()
  const [isEditing, setIsEditing] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [error, setError] = useState<string | null>(null)
  
  const handleUpdate = async () => {
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      setStatus('error')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      setStatus('error')
      return
    }

    setStatus('loading')
    setError(null)

    try {
      await changePassword(currentPassword, password)
      
      setStatus('success')
      setPassword('')
      setConfirmPassword('')
      setCurrentPassword('')
      setTimeout(() => {
        setIsEditing(false)
        setStatus('idle')
      }, 2000)
    } catch (err: any) {
      console.error('Password Update Error:', err)
      setError(err.message || 'Failed to update password')
      setStatus('error')
    }
  }

  if (!isEditing) {
    return (
      <div className="flex items-center justify-between p-6 bg-[var(--warm-gray)] rounded-2xl border border-[var(--warm-gray-dark)]/20 transition-all hover:border-[var(--warm-gray-dark)]/40">
        <div>
          <h3 className="text-sm font-bold text-gray-900 mb-1">{t('common.settings.password_title')}</h3>
          <p className="text-xs text-gray-500 font-medium">{t('common.settings.password_subtitle')}</p>
        </div>
        <button 
          onClick={() => setIsEditing(true)}
          className="px-4 py-2 bg-white text-[var(--primary)] text-xs font-black uppercase tracking-widest rounded-lg border border-[var(--warm-gray-dark)] shadow-sm hover:bg-[var(--warm-gray)] transition-all"
        >
          {t('common.update')}
        </button>
      </div>
    )
  }

  return (
    <div className="p-6 bg-[var(--warm-gray)] rounded-2xl border-2 border-[var(--primary)]/20 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-bold text-gray-900">{t('common.settings.change_password')}</h3>
        <button onClick={() => setIsEditing(false)} className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-gray-600">{t('common.cancel')}</button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <Input 
          type="password" 
          label={t('auth.current_password')} 
          icon={Lock}
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          placeholder="••••••••"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input 
            type="password" 
            label={t('auth.new_password')} 
            icon={Lock}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
          <Input 
            type="password" 
            label={t('auth.confirm_password')} 
            icon={Lock}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
          />
        </div>
      </div>

      <div className="flex items-center justify-between pt-2">
        {status === 'success' ? (
          <div className="flex items-center gap-2 text-xs font-bold text-green-600">
            <CheckCircle className="w-4 h-4" /> Password updated!
          </div>
        ) : status === 'error' ? (
          <div className="flex items-center gap-2 text-xs font-bold text-red-600">
            <AlertCircle className="w-4 h-4" /> {error}
          </div>
        ) : <div />}

        <Button 
          onClick={handleUpdate} 
          disabled={status === 'loading' || !password}
          className="px-6 h-10 text-[10px] font-black uppercase tracking-widest"
        >
          {status === 'loading' ? <HouseButtonLoader /> : t('common.settings.change_password')}
        </Button>
      </div>
    </div>
  )
}
