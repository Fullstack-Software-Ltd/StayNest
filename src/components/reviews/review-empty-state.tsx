'use client'

import { MessageSquare } from 'lucide-react'
import { useSettings } from '@/context/SettingsContext'

export function ReviewEmptyState({ message }: { message?: string }) {
  const { t } = useSettings()
  const displayMessage = message || t('common.reviews.no_reviews_desc')

  return (
    <div className="py-20 text-center bg-white rounded-[3rem] border border-gray-100 shadow-sm border-dashed">
      <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-gray-300">
        <MessageSquare size={32} strokeWidth={1.5} />
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">{t('common.reviews.empty')}</h3>
      <p className="text-gray-400 max-w-xs mx-auto text-sm">
        {displayMessage}
      </p>
    </div>
  )
}
