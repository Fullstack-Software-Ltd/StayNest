'use client'

import { ShieldCheck, LifeBuoy, MapPin, CheckCircle2 } from 'lucide-react'
import { useSettings } from '@/context/SettingsContext'

export function TrustSection() {
  const { t } = useSettings()

  const features = [
    {
      icon: ShieldCheck,
      title: 'Secure Booking',
      desc: 'Our platform uses high-end encryption to ensure your payment goes straight to verified hosts without friction.',
      accent: 'text-emerald-600',
      bg: 'bg-emerald-50 border-emerald-100'
    },
    {
      icon: CheckCircle2,
      title: 'Verified Stays Only',
      desc: 'We manually review properties before they are listed. Look for the "Verified" badge for guaranteed quality.',
      accent: 'text-[var(--accent)]',
      bg: 'bg-[var(--accent)]/5 border-[var(--accent)]/10'
    },
    {
      icon: LifeBuoy,
      title: '24/7 Global Support',
      desc: 'No matter the time zone or the issue, our dedicated support team is always just one click away.',
      accent: 'text-blue-600',
      bg: 'bg-blue-50 border-blue-100'
    }
  ]

  return (
    <section className="py-20 sm:py-28 bg-[var(--background)] border-b border-gray-100 relative overflow-hidden">
      <div className="absolute top-1/2 left-0 w-64 h-64 bg-[var(--primary)]/5 rounded-full blur-[80px] -translate-y-1/2" />
      
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-[10px] font-black tracking-[0.2em] uppercase text-[var(--accent)] mb-4 block">
            Why Choose UrugoStay
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[var(--foreground)] tracking-tight mb-6">
            Book with absolute <span className="italic text-gray-500 font-light">confidence</span>.
          </h2>
          <p className="text-gray-500 font-medium leading-relaxed">
            We've built a platform that puts your peace of mind first. From secure transactions to vetted hosts, we handle the friction so you can enjoy the stay.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12 lg:gap-16">
          {[
            {
              icon: ShieldCheck,
              title: t('trust.secure.title') !== 'trust.secure.title' ? t('trust.secure.title') : 'Secure Booking',
              desc: t('trust.secure.desc') !== 'trust.secure.desc' ? t('trust.secure.desc') : 'Our platform uses high-end encryption to ensure your payment goes straight to verified hosts without friction.',
              color: 'text-emerald-500',
              bg: 'bg-emerald-50/50 border-emerald-100/50'
            },
            {
              icon: CheckCircle2,
              title: t('trust.verified.title') !== 'trust.verified.title' ? t('trust.verified.title') : 'Vetted & Verified',
              desc: t('trust.verified.desc') !== 'trust.verified.desc' ? t('trust.verified.desc') : 'We manually review properties before they are listed. Look for the "Verified" badge for guaranteed quality.',
              color: 'text-[var(--accent)]',
              bg: 'bg-[var(--accent)]/5 border-[var(--accent)]/10'
            },
            {
              icon: LifeBuoy,
              title: t('trust.support.title') !== 'trust.support.title' ? t('trust.support.title') : 'Professional 24/7 Support',
              desc: t('trust.support.desc') !== 'trust.support.desc' ? t('trust.support.desc') : 'No matter the time zone or the issue, our dedicated support team is always just one click away.',
              color: 'text-blue-500',
              bg: 'bg-blue-50/50 border-blue-100/50'
            }
          ].map((feature, i) => (
             <div 
               key={i} 
               className="group flex flex-col p-10 rounded-[3rem] bg-white border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-[var(--primary)]/5 hover:-translate-y-2 transition-all duration-500"
             >
               <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center mb-10 border transition-all group-hover:rotate-6 ${feature.bg}`}>
                 <feature.icon className={`w-7 h-7 ${feature.color}`} strokeWidth={1.5} />
               </div>
               <h3 className="text-2xl font-black text-gray-900 tracking-tighter mb-4 group-hover:text-[var(--primary)] transition-colors">
                 {feature.title}
               </h3>
               <p className="text-sm font-medium text-gray-500 leading-relaxed text-pretty opacity-80 group-hover:opacity-100 transition-opacity">
                 {feature.desc}
               </p>
             </div>
          ))}
        </div>
      </div>
    </section>
  )
}
