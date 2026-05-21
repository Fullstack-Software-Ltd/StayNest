'use client'

import { ShieldAlert } from 'lucide-react'
import { useSettings } from '@/context/SettingsContext'

export function TwoFactorSection() {
  const { t } = useSettings()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between p-6 bg-[var(--warm-gray)] rounded-2xl border border-[var(--warm-gray-dark)]/20 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-amber-50">
            <ShieldAlert className="w-6 h-6 text-amber-600" />
          </div>
          <div>
            <h3 className="text-sm font-black text-gray-900 mb-1">
              {t('common.settings.two_factor.title')}
            </h3>
            <p className="text-xs text-gray-500 font-medium">
              Two-factor authentication is currently undergoing maintenance as part of our platform upgrade.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
