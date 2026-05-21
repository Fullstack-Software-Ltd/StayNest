'use client'

import Link from 'next/link'
import { useSettings } from '@/context/SettingsContext'
import { Globe, Link as LinkIcon, Share2 } from 'lucide-react'

export function HomeFooter() {
  const { t } = useSettings()

  return (
    <footer className="bg-[var(--luxury-cream)] text-[var(--luxury-green)] pt-24 pb-12 overflow-hidden border-t border-gray-100">
      <div className="max-w-[1440px] mx-auto px-6 sm:px-12 lg:px-20">
        <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-5 gap-12 sm:gap-16 mb-24">
          
          {/* Brand Column */}
          <div className="col-span-2 xl:col-span-2 space-y-8">
            <Link href="/" className="text-4xl font-serif tracking-tighter hover:opacity-70 transition-opacity">
              Urugo<span className="font-light text-gray-400">stay</span>
            </Link>
            <p className="text-sm font-medium text-gray-500 leading-relaxed max-w-sm">
              The elevated sanctuary of Rwandan hospitality. We curate the country’s most distinctive stays for the modern traveler.
            </p>
            <div className="flex items-center gap-4">
               {[Globe, LinkIcon, Share2].map((Icon, i) => (
                 <a key={i} href="#" className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center text-gray-400 hover:text-[var(--luxury-green)] hover:border-[var(--luxury-green)] transition-all">
                   <Icon className="w-4 h-4" />
                 </a>
               ))}
            </div>
          </div>

          {/* Explore */}
          <div className="space-y-8">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--luxury-gold)]">
              Explore
            </h3>
            <ul className="space-y-4 text-xs font-bold uppercase tracking-widest">
              <li><Link href="/search" className="text-gray-500 hover:text-[var(--luxury-green)] transition-colors">Our Properties</Link></li>
              <li><Link href="/magazine" className="text-gray-500 hover:text-[var(--luxury-green)] transition-colors">Editorial</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-8">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--luxury-gold)]">
              Support
            </h3>
            <ul className="space-y-4 text-xs font-bold uppercase tracking-widest">
              <li><Link href="/help" className="text-gray-500 hover:text-[var(--luxury-green)] transition-colors">Guest Safety</Link></li>
              <li><Link href="/terms" className="text-gray-500 hover:text-[var(--luxury-green)] transition-colors">Terms of Service</Link></li>
              <li><Link href="/privacy" className="text-gray-500 hover:text-[var(--luxury-green)] transition-colors">Privacy Policy</Link></li>
              <li><Link href="/contact" className="text-gray-500 hover:text-[var(--luxury-green)] transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Community */}
          <div className="space-y-8">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--luxury-gold)]">
              Community
            </h3>
            <ul className="space-y-4 text-xs font-bold uppercase tracking-widest">
              <li><Link href="/become-a-host" className="text-gray-500 hover:text-[var(--luxury-green)] transition-colors">Become a Host</Link></li>
              <li><Link href="/host/onboarding" className="text-gray-500 hover:text-[var(--luxury-green)] transition-colors">Host Guidelines</Link></li>
              <li><Link href="/foundation" className="text-gray-500 hover:text-[var(--luxury-green)] transition-colors">Giving Back</Link></li>
            </ul>
          </div>

        </div>

        {/* Footer Bottom */}
        <div className="pt-12 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            <Globe className="w-3 h-3" />
            <span>Kigali, Rwanda</span>
          </div>
          
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            &copy; {new Date().getFullYear()} UrugoStay Elite Booking. Design with Intention.
          </p>
        </div>
      </div>
    </footer>
  )
}
