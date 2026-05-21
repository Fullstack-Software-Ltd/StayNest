'use client'

import { Search } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import { useSettings } from '@/context/SettingsContext'

export function BookingEmptyState() {
  const { t } = useSettings()

  return (
    <div className="flex flex-col items-center justify-center py-20 text-center px-4 bg-white rounded-[3rem] border border-gray-100 shadow-sm">
      <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-6">
        <Search className="w-12 h-12 text-blue-200" />
      </div>
      <h3 className="text-2xl font-black text-gray-900 mb-2">{t('booking.empty_title')}</h3>
      <p className="text-gray-500 max-w-sm mb-8 leading-relaxed">
        {t('booking.empty_description')}
      </p>
      <Link href="/search">
        <Button className="rounded-2xl px-8 py-6 font-bold shadow-xl shadow-blue-100 transition-all hover:-translate-y-1">
          {t('booking.explore_btn')}
        </Button>
      </Link>
    </div>
  )
}
