'use client'

import React from 'react'
import Link from 'next/link'
import { CheckCircle2, Home, Globe, ShieldCheck, DollarSign, ArrowRight, Sparkles } from 'lucide-react'
import { Button } from '@/components/shared/Button'
import { ImigongoPattern } from '@/components/shared/imigongo-pattern'

export default function BecomeHostLandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* ─── Hero Section ────────────────────────── */}
      <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-32 overflow-hidden bg-[var(--primary-dark)]">
        <ImigongoPattern variant="dark" opacity={0.15} className="absolute inset-0 w-full h-full" />
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[var(--primary)]/20 to-transparent pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full border border-white/20 mb-8 backdrop-blur-md animate-fade-in shadow-xl shadow-black/10">
              <Sparkles className="w-4 h-4 text-[var(--accent)]" />
              <span className="text-[11px] font-black text-white uppercase tracking-[0.2em]">Unlock Your Property's Potential</span>
            </div>
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-white tracking-tighter leading-[0.9] mb-8 animate-slide-up">
              Host your space <br />
              on <span className="text-[var(--accent)] italic">Urugo</span>stay.
            </h1>
            <p className="text-white/60 text-lg sm:text-xl font-medium leading-relaxed mb-12 max-w-2xl animate-slide-up" style={{ animationDelay: '0.1s', animationFillMode: 'backwards' }}>
              Join a curated community of hosts sharing the best of Rwanda. From modern Kigali apartments to serene Kivu retreats, earn more while sharing your heritage.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 animate-slide-up" style={{ animationDelay: '0.2s', animationFillMode: 'backwards' }}>
              <Link href="/host/onboarding">
                <Button 
                  size="lg" 
                  className="h-16 px-10 rounded-2xl bg-[var(--accent)] text-[var(--primary-dark)] hover:bg-white transition-all font-black uppercase tracking-widest border-none shadow-2xl shadow-[var(--accent)]/10"
                >
                  Start Hosting Now
                </Button>
              </Link>
              <div className="flex items-center gap-4 px-6 py-4 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm">
                <div className="flex -space-x-3">
                  {[1,2,3].map(i => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-[var(--primary-dark)] bg-gray-500 overflow-hidden">
                      <div className="w-full h-full bg-gradient-to-br from-gray-400 to-gray-600" />
                    </div>
                  ))}
                </div>
                <span className="text-xs font-bold text-white/80">Joined by 200+ local hosts</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Benefits Grid ───────────────────────── */}
      <section className="py-24 sm:py-32 bg-[var(--warm-white)]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
          <div className="text-center mb-20">
            <h2 className="text-3xl sm:text-5xl font-black text-gray-900 tracking-tight leading-none mb-4">Why host on Urugostay?</h2>
            <p className="text-gray-500 font-medium text-lg">Everything you need to succeed as a premium host in Rwanda.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: DollarSign,
                title: "Earn Extra Income",
                desc: "Turn your spare space into an earning asset. Our hosts earn an average of $800/month in peak seasons."
              },
              {
                icon: ShieldCheck,
                title: "Total Protection",
                desc: "We provide comprehensive guest verification and insurance support for every curated stay."
              },
              {
                icon: Globe,
                title: "Global Reach",
                desc: "Connect with international travelers looking for authentic, premium Rwandan experiences."
              }
            ].map((benefit, i) => (
              <div key={i} className="group p-10 bg-white rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="w-16 h-16 rounded-2xl bg-[var(--primary)]/5 flex items-center justify-center text-[var(--primary)] mb-8 group-hover:bg-[var(--primary)] group-hover:text-white transition-all duration-300">
                  <benefit.icon className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4 tracking-tight">{benefit.title}</h3>
                <p className="text-gray-500 font-medium leading-relaxed">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── How it Works ────────────────────────── */}
      <section className="py-24 sm:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            <div className="relative aspect-square rounded-[3rem] overflow-hidden bg-gray-100 shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary)]/20 to-transparent" />
              <div className="absolute inset-12 border-2 border-dashed border-[var(--primary)]/10 rounded-[2rem]" />
              <div className="absolute inset-0 flex items-center justify-center">
                 <Home className="w-32 h-32 text-[var(--primary)]/10" />
              </div>
            </div>

            <div className="space-y-12">
              <div>
                <h2 className="text-3xl sm:text-5xl font-black text-gray-900 tracking-tight leading-none mb-6">Simple 3-step setup</h2>
                <p className="text-gray-500 font-medium text-lg leading-relaxed">We've streamlined the onboarding process so you can start receiving bookings in under 15 minutes.</p>
              </div>

              <div className="space-y-10">
                {[
                  { step: "01", title: "List your space", desc: "Share details, photos, and your house rules." },
                  { step: "02", title: "Set your price", desc: "You maintain total control over your rates and availability." },
                  { step: "03", title: "Welcome guests", desc: "Manage bookings and get paid securely through our platform." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-6 items-start group">
                    <span className="text-4xl font-black text-[var(--primary)]/10 group-hover:text-[var(--accent)] transition-colors">{item.step}</span>
                    <div>
                      <h4 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h4>
                      <p className="text-gray-500 font-medium leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Link href="/host/onboarding" className="inline-block pt-4">
                <Button 
                   variant="outline"
                   size="lg"
                   className="h-14 px-8 rounded-xl border-gray-200 hover:border-[var(--primary)] hover:bg-[var(--primary)]/5 transition-all font-black text-xs uppercase tracking-widest group"
                   rightIcon={<ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                >
                  Create your listing
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Final CTA ───────────────────────────── */}
      <section className="py-20 sm:py-32 px-6">
        <div className="max-w-5xl mx-auto relative overflow-hidden rounded-[3rem] bg-gray-900 p-12 sm:p-20 text-center">
          <ImigongoPattern variant="dark" opacity={0.1} className="absolute inset-0 w-full h-full" />
          <div className="relative z-10 space-y-8">
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-none px-4">
              Ready to host your first guest?
            </h2>
            <p className="text-white/40 text-lg sm:text-xl font-medium max-w-2xl mx-auto">
              Join the future of Rwandan hospitality. Start listing your property today and unlock a world of possibilities.
            </p>
            <Link href="/host/onboarding" className="inline-block">
              <Button 
                size="lg" 
                className="h-16 px-12 rounded-2xl bg-white text-gray-900 hover:bg-[var(--accent)] transition-all font-black uppercase tracking-widest border-none shadow-2xl"
              >
                Let's get started
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
