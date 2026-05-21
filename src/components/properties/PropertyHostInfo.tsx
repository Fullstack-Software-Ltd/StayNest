'use client'

import { ShieldCheck, Star, Phone, MessageSquare, Mail } from 'lucide-react'
import Image from 'next/image'
import { Card, CardContent } from '@/components/shared/Card'
import { useSettings } from '@/context/SettingsContext'

interface PropertyHostInfoProps {
  host?: {
    full_name: string
    avatar_url: string | null
    created_at: string
    phone?: string | null
    email?: string | null
  }
}

export function PropertyHostInfo({ host }: PropertyHostInfoProps) {
  const { t } = useSettings()

  if (!host) return null
  
  const joinDate = new Date(host.created_at).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })
  return (
    <Card variant="default" padding="lg" className="rounded-2xl border-gray-100 bg-white">
      <CardContent className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
          <div className="relative w-20 h-20 rounded-full overflow-hidden shrink-0 border-4 border-white shadow-md bg-gray-100">
             {host.avatar_url ? (
               <Image 
                 src={host.avatar_url} 
                 alt={host.full_name} 
                 fill 
                 className="object-cover" 
               />
             ) : (
               <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <Star className="w-8 h-8" />
               </div>
             )}
          </div>
          <div className="flex-1 space-y-2">
            <h3 className="text-2xl font-bold text-gray-900 tracking-tight">Hosted by {host.full_name}</h3>
            <div className="flex items-center gap-3 text-sm font-medium text-gray-500">
              <span className="flex items-center gap-1">
                <Star className="w-4 h-4 text-[var(--accent)] fill-[var(--accent)]" />
                4.9 
              </span>
              <span className="w-1 h-1 rounded-full bg-gray-300" />
              <span className="text-[var(--primary)] font-bold">Premium Host</span>
              <span className="w-1 h-1 rounded-full bg-gray-300" />
              <span>Hosting since {joinDate}</span>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            {host.phone && (
              <a 
                href={`https://wa.me/${host.phone.replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-6 py-3 bg-[#25D366] hover:bg-[#128C7E] text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all w-full sm:w-auto shadow-lg shadow-green-500/10"
              >
                <MessageSquare className="w-4 h-4" />
                WhatsApp
              </a>
            )}
            <button className="px-6 py-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-900 rounded-xl text-xs font-bold uppercase tracking-widest transition-colors w-full sm:w-auto">
              Contact Host
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-6 border-y border-gray-100">
           {host.phone && (
             <div className="flex items-center gap-3 p-4 rounded-2xl bg-gray-50/50 border border-gray-100">
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm text-gray-400">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                   <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Phone Number</p>
                   <p className="text-sm font-bold text-gray-900">{host.phone}</p>
                </div>
             </div>
           )}
           {host.email && (
             <div className="flex items-center gap-3 p-4 rounded-2xl bg-gray-50/50 border border-gray-100">
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm text-gray-400">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                   <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Direct Email</p>
                   <p className="text-sm font-bold text-gray-900">{host.email}</p>
                </div>
             </div>
           )}
        </div>
        
        <div className="pt-6 border-t border-gray-100 flex gap-4">
           <ShieldCheck className="w-6 h-6 text-[var(--primary)] shrink-0" />
           <p className="text-sm text-gray-600 leading-relaxed max-w-2xl text-balance">
             To protect your payment, never transfer money or communicate outside of the UrugoStay website or app.
           </p>
        </div>
      </CardContent>
    </Card>
  )
}
