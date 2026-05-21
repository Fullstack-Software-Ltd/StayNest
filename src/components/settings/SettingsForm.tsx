'use client'

import { useState, useEffect, useCallback } from 'react'
import { updateProfile } from '@/lib/auth/updateProfile'
import { Profile } from '@/types/profile'
import { Input } from '@/components/ui/Input'
import { LoadingSpinner } from '@/components/shared/loading-spinner'
import { FileUpload } from '@/components/shared/FileUpload'
import { PasswordChangeSection } from './PasswordChangeSection'
import { TwoFactorSection } from './TwoFactorSection'
import { useSettings } from '@/context/SettingsContext'
import { 
  CheckCircle, 
  AlertCircle, 
  User, 
  ShieldCheck, 
  Globe, 
  Smartphone,
  Mail,
  Lock,
  ChevronRight
} from 'lucide-react'
import { cn } from '@/utils/cn'

interface SettingsFormProps {
  initialProfile: Profile
}

export function SettingsForm({ initialProfile }: SettingsFormProps) {
  const { setLanguage, setCurrency, t } = useSettings()
  const [activeTab, setActiveTab] = useState<'personal' | 'security' | 'preferences'>('personal')
  const [profile, setProfile] = useState(initialProfile)
  const [baselineProfile, setBaselineProfile] = useState(initialProfile)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle')
  const [error, setError] = useState<string | null>(null)

  const saveChanges = async () => {
    setSaveStatus('saving')
    setError(null)
    try {
      // 1. Update Profile in Database (using Prisma action)
      await updateProfile(profile)
      
      // 2. Sync Global Context
      if (profile.language) setLanguage(profile.language as any)
      if (profile.currency) setCurrency(profile.currency)

      // 3. Handle Email Update (Legacy Supabase logic removed)
      if (profile.email !== baselineProfile.email) {
        // In the new Prisma/NextAuth stack, email updates should be handled 
        // via a dedicated verification flow. For now, we inform the user.
        alert('Email updates require verification. Please contact support or use the verification link sent to your new address (Feature in progress).')
      }

      setSaveStatus('success')
      setTimeout(() => setSaveStatus('idle'), 3000)
      setBaselineProfile(profile)
    } catch (err: any) {
      console.error('Save error:', err)
      setSaveStatus('error')
      setError(err.message || 'Failed to save changes.')
    }
  }

  const hasChanges = JSON.stringify(profile) !== JSON.stringify(baselineProfile)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setProfile(prev => ({ ...prev, [name]: value }))
  }

  const handleAvatarUpload = (url: string) => {
    setProfile(prev => ({ ...prev, avatar_url: url }))
  }

  const tabs = [
    { id: 'personal', label: t('settings.tabs.personal'), icon: User },
    { id: 'security', label: t('settings.tabs.security'), icon: ShieldCheck },
    { id: 'preferences', label: t('settings.tabs.preferences'), icon: Globe },
  ]

  return (
    <>
      <div className="flex flex-col lg:flex-row gap-10">
        
        {/* Sidebar Tabs */}
        <div className="lg:w-72 shrink-0">
          <div className="bg-white rounded-3xl border border-[var(--warm-gray-dark)]/50 shadow-sm overflow-hidden overflow-y-auto max-h-[calc(100vh-200px)] sticky top-28">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  'w-full flex items-center justify-between px-6 py-5 text-sm font-bold transition-all border-b border-[var(--warm-gray)] last:border-0',
                  activeTab === tab.id 
                    ? 'bg-[var(--primary)] text-white' 
                    : 'text-gray-600 hover:bg-[var(--warm-gray)]'
                )}
              >
                <div className="flex items-center gap-3">
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </div>
                <ChevronRight className={cn('w-4 h-4 opacity-50', activeTab === tab.id && 'text-white')} />
              </button>
            ))}
          </div>

          {/* Save Status (Desktop) */}
          <div className="mt-6 px-4 hidden lg:block">
            {saveStatus === 'saving' && (
              <div className="flex items-center gap-2 text-xs font-bold text-gray-400 animate-pulse">
                <LoadingSpinner size="sm" label="" /> {t('common.saving')}
              </div>
            )}
            {saveStatus === 'success' && (
              <div className="flex items-center gap-2 text-xs font-bold text-green-600">
                <CheckCircle className="w-4 h-4" /> {t('settings.personal.save_success')}
              </div>
            )}
            {saveStatus === 'error' && (
              <div className="flex items-center gap-2 text-xs font-bold text-red-600">
                <AlertCircle className="w-4 h-4" /> {error}
              </div>
            )}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 min-w-0 pb-32">
          {activeTab === 'personal' && (
            <div className="space-y-8 animate-fade-in">
              <div className="bg-white p-8 rounded-3xl border border-[var(--warm-gray-dark)]/50 shadow-sm">
                <h2 className="text-2xl font-black text-gray-900 mb-8">{t('settings.tabs.personal')}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-6">
                    <FileUpload 
                      label={t('settings.personal.profile_picture')} 
                      bucket="avatars"
                      initialImage={profile.avatar_url}
                      onUpload={handleAvatarUpload}
                      aspectRatio="square"
                    />
                  </div>
                  <div className="space-y-6">
                    <Input label={t('settings.personal.legal_name')} name="legal_name" value={profile.legal_name || ''} onChange={handleChange} />
                    <Input label={t('settings.personal.preferred_name')} name="preferred_name" value={profile.preferred_name || ''} onChange={handleChange} />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-10 border-t border-[var(--warm-gray)] pt-10">
                  <div className="space-y-6">
                    <Input label={t('settings.personal.email')} name="email" value={profile.email} onChange={handleChange} icon={Mail} />
                    <Input label={t('settings.personal.phone')} name="phone" value={profile.phone || ''} onChange={handleChange} icon={Smartphone} />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">{t('settings.personal.bio')}</label>
                    <textarea name="status" value={profile.status || ''} onChange={handleChange} rows={4} className="w-full px-4 py-3 bg-[var(--warm-gray)] border-none rounded-2xl text-sm font-semibold text-gray-900 h-[115px] resize-none focus:ring-2 focus:ring-[var(--primary)] outline-none" />
                  </div>
                </div>
              </div>
            </div>
          )}
          {activeTab === 'security' && (
            <div className="animate-fade-in">
              <div className="bg-white p-8 rounded-3xl border border-[var(--warm-gray-dark)]/50 shadow-sm">
                <h2 className="text-2xl font-black text-gray-900 mb-8">{t('settings.tabs.security')}</h2>
                
                <div className="space-y-8">
                  <PasswordChangeSection />
                  <TwoFactorSection />
                </div>
              </div>
            </div>
          )}
          {activeTab === 'preferences' && (
            <div className="animate-fade-in">
              <div className="bg-white p-8 rounded-3xl border border-[var(--warm-gray-dark)]/50 shadow-sm">
                <h2 className="text-2xl font-black text-gray-900 mb-8">{t('settings.tabs.preferences')}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">{t('common.settings.language_label')}</label>
                    <select name="language" value={profile.language || 'English'} onChange={handleChange} className="w-full px-4 py-4 bg-[var(--warm-gray)] border-none rounded-2xl text-sm font-bold text-gray-900 focus:ring-2 focus:ring-[var(--primary)] outline-none appearance-none cursor-pointer">
                      <option value="English">English (Worldwide)</option>
                      <option value="French">Français (FR)</option>
                      <option value="Spanish">Español (ES)</option>
                      <option value="German">Deutsch (DE)</option>
                      <option value="Arabic">العربية (Arabic)</option>
                      <option value="Chinese">中文 (Chinese)</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">{t('common.settings.currency_label')}</label>
                    <select name="currency" value={profile.currency || 'USD'} onChange={handleChange} className="w-full px-4 py-4 bg-[var(--warm-gray)] border-none rounded-2xl text-sm font-bold text-gray-900 focus:ring-2 focus:ring-[var(--primary)] outline-none appearance-none cursor-pointer">
                      <option value="USD">USD ($) - US Dollar</option>
                      <option value="EUR">EUR (€) - Euro</option>
                      <option value="GBP">GBP (£) - British Pound</option>
                      <option value="JPY">JPY (¥) - Japanese Yen</option>
                      <option value="RWF">RWF (FRw) - Rwandan Franc</option>
                      <option value="CAD">CAD ($) - Canadian Dollar</option>
                      <option value="AUD">AUD ($) - Australian Dollar</option>
                      <option value="CNY">CNY (¥) - Chinese Yuan</option>
                    </select>
                  </div>
                </div>
                <div className="mt-12 p-6 bg-amber-50 rounded-2xl border border-amber-100 flex items-start gap-4">
                  <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-extrabold text-amber-900 leading-none mb-1">{t('common.settings.regional_title')}</h4>
                    <p className="text-xs text-amber-700 font-medium leading-relaxed">
                      {t('common.settings.regional_desc')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Manual Save Bar (Sticky Bottom) */}
      {hasChanges && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="bg-white/80 backdrop-blur-xl border border-[var(--warm-gray-dark)]/50 p-4 rounded-3xl shadow-2xl flex items-center justify-between">
            <div className="hidden sm:flex items-center gap-4 ml-2">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-xs font-black text-gray-900">{t('settings.unsaved')}</p>
                <p className="text-[10px] font-bold text-gray-400">{t('common.settings.modified_hint')}</p>
              </div>
            </div>

            <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-10">
              <button 
                onClick={() => setProfile(initialProfile)}
                className="px-6 py-3 text-xs font-black uppercase tracking-widest text-gray-500 hover:text-gray-900 transition-colors"
              >
                {t('settings.discard')}
              </button>
              <button 
                onClick={saveChanges}
                disabled={saveStatus === 'saving'}
                className="px-8 py-3 bg-[var(--primary)] text-white text-xs font-black uppercase tracking-widest rounded-2xl shadow-lg shadow-[var(--primary)]/20 hover:bg-[var(--primary-dark)] transition-all flex items-center gap-2"
              >
                {saveStatus === 'saving' ? <LoadingSpinner size="sm" label="" /> : t('settings.save')}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
