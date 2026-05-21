'use client'

import { ShieldCheck, LifeBuoy, CreditCard, Lock, CheckCircle2, Info } from 'lucide-react'
import { useSettings } from '@/context/SettingsContext'

export function CheckoutTrustSidebar() {
  const { t } = useSettings()

  return (
    <div className="space-y-6 mt-8">
      {/* ─── Security Cluster ───────────────── */}
      <div className="p-8 rounded-[2rem] bg-white border border-gray-100 shadow-sm border-l-4 border-l-[var(--primary)]">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-[var(--primary)]/5 flex items-center justify-center text-[var(--primary)]">
            <Lock className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-black uppercase tracking-widest text-gray-900">Secure Checkout</h3>
        </div>
        
        <p className="text-xs font-semibold text-gray-400 leading-relaxed mb-6">
          Your payment information is encrypted and securely processed. We never store your full credit card details.
        </p>

        <div className="flex items-center gap-4 py-4 border-y border-gray-50">
          <CreditCard className="w-5 h-5 text-gray-400" />
          <div className="flex gap-2">
            <div className="w-8 h-5 bg-gray-100 rounded-md" />
            <div className="w-8 h-5 bg-gray-100 rounded-md" />
            <div className="w-8 h-5 bg-gray-100 rounded-md" />
          </div>
        </div>
      </div>

      {/* ─── UrugoStay Promise ─────────────── */}
      <div className="p-8 rounded-[2rem] bg-[var(--primary)] text-white shadow-xl shadow-[var(--primary)]/20 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:scale-150 transition-transform duration-700" />
        
        <div className="relative z-10 space-y-6">
          <div className="flex items-center gap-3">
             <ShieldCheck className="w-6 h-6 text-[var(--accent)]" />
             <span className="text-[10px] font-black uppercase tracking-[0.25em]">UrugoStay Guarantee</span>
          </div>
          
          <h4 className="text-xl font-black tracking-tight leading-tight">
            Book with absolute <span className="italic text-[var(--accent)]">confidence</span>.
          </h4>
          
          <ul className="space-y-4">
            {[
              'Vetted & Verified Hosts',
              '24/7 Priority Assistance',
              'Transparent Pricing',
              'Anti-Fraud Protection'
            ].map((item, i) => (
              <li key={i} className="flex items-center gap-3 text-[11px] font-bold text-white/80">
                <CheckCircle2 className="w-4 h-4 text-[var(--accent)]" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* End of Sidebar Sidebar */}
    </div>
  )
}
