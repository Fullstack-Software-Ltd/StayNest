'use client'

import { PageHeader } from '@/components/shared/page-header'
import { 
  BookOpen, 
  Search, 
  Calendar, 
  ShieldCheck, 
  HelpCircle,
  Smartphone
} from 'lucide-react'
import { useSettings } from '@/context/SettingsContext'
import { ImigongoPattern } from '@/components/shared/imigongo-pattern'

export default function HelpPage() {
  const { t } = useSettings()

  const sections = [
    {
      title: t('help.sections.getting_started.title'),
      icon: BookOpen,
      items: [
        { q: t('help.sections.getting_started.q1'), a: t('help.sections.getting_started.a1') },
        { q: t('help.sections.getting_started.q2'), a: t('help.sections.getting_started.a2') },
      ]
    },
    {
      title: t('help.sections.booking.title'),
      icon: Calendar,
      items: [
        { q: t('help.sections.booking.q1'), a: t('help.sections.booking.a1') },
        { q: t('help.sections.booking.q2'), a: t('help.sections.booking.a2') },
      ]
    },
    {
      title: t('help.sections.hosting.title'),
      icon: Smartphone,
      items: [
        { q: t('help.sections.hosting.q1'), a: t('help.sections.hosting.a1') },
        { q: t('help.sections.hosting.q2'), a: t('help.sections.hosting.a2') },
      ]
    },
    {
      title: t('help.sections.security.title'),
      icon: ShieldCheck,
      items: [
        { q: t('help.sections.security.q1'), a: t('help.sections.security.a1') },
        { q: t('help.sections.security.q2'), a: t('help.sections.security.a2') },
      ]
    }
  ]

  return (
    <div className="bg-[var(--warm-white)] min-h-screen pt-8 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <PageHeader 
          title={t('help.title')} 
          subtitle={t('help.subtitle')}
        />

        {/* Search help */}
        <div className="mt-8 relative max-w-2xl">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder={t('help.search_placeholder')}
            className="block w-full pl-12 pr-4 py-4 bg-white border border-[var(--warm-gray-dark)]/50 rounded-2xl shadow-sm focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent outline-none transition-all"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-16">
          {sections.map((section) => (
            <div key={section.title} className="bg-white p-8 rounded-3xl border border-[var(--warm-gray-dark)]/50 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-[var(--warm-gray)] rounded-xl flex items-center justify-center text-[var(--primary)]">
                  <section.icon className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-black text-gray-900">{section.title}</h2>
              </div>
              
              <div className="space-y-6">
                {section.items.map((item) => (
                  <div key={item.q}>
                    <h3 className="text-sm font-bold text-gray-900 mb-2">{item.q}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed font-medium">{item.a}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Contact Support */}
        <div className="mt-20 bg-[var(--primary)] rounded-3xl p-10 text-center text-white relative overflow-hidden">
          <ImigongoPattern variant="dark" opacity={0.2} className="absolute inset-0 w-full h-full" />
          <div className="relative z-10">
          <HelpCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <h2 className="text-2xl font-black mb-2">{t('help.still_help')}</h2>
          <p className="text-white/70 mb-8 max-w-md mx-auto">
            {t('help.still_help_desc')}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="px-8 py-3 bg-[var(--accent)] text-[var(--primary-dark)] font-black rounded-xl hover:bg-[var(--accent-light)] transition-all">
              {t('help.contact_support')}
            </button>
            <button className="px-8 py-3 bg-white/10 text-white font-black rounded-xl hover:bg-white/20 transition-all border border-white/20">
              {t('help.live_chat')}
            </button>
          </div>
          </div>
        </div>
      </div>
    </div>
  )
}
