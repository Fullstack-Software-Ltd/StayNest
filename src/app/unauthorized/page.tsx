'use client'

import Link from 'next/link'
import { Button } from '@/components/shared/Button'
import { ShieldAlert, Home, ArrowLeft, Lock, Sparkles } from 'lucide-react'

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-[var(--background)] flex items-center justify-center px-4 overflow-hidden relative">
      {/* Background Decorative elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[var(--primary)]/5 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[var(--accent)]/5 rounded-full blur-[120px] animate-pulse" />

      <div className="max-w-xl w-full text-center relative z-10">
        <div className="relative inline-block mb-12">
          {/* Main Icon Container */}
          <div className="w-32 h-32 bg-white rounded-[2.5rem] flex items-center justify-center mx-auto shadow-2xl shadow-black/[0.05] border border-white/60 relative group">
            <div className="absolute inset-0 bg-red-50 rounded-[2.5rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <ShieldAlert className="w-14 h-14 text-red-500 relative z-10 transform group-hover:scale-110 transition-transform duration-500" />
            
            {/* Animated Ring */}
            <div className="absolute inset-[-8px] rounded-[3rem] border-2 border-dashed border-red-200/50 animate-[spin_10s_linear_infinite]" />
          </div>

          {/* Floating Badges */}
          <div className="absolute -top-4 -right-4 px-4 py-2 bg-white rounded-2xl shadow-xl border border-white/60 animate-bounce cursor-default">
            <Lock className="w-4 h-4 text-red-500" />
          </div>
        </div>

        <div className="space-y-6 mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-rose-50 text-rose-600 rounded-full text-[10px] font-black uppercase tracking-[0.3em] border border-rose-100 shadow-sm">
            <ShieldAlert className="w-4 h-4" />
            Security Protocol 403
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-gray-900 tracking-tighter leading-none text-balance">
            Access <span className="italic text-[var(--primary)]">Denied</span>
          </h1>
          
          <p className="text-gray-500 font-medium text-lg sm:text-xl max-w-md mx-auto leading-relaxed text-balance">
            Your current account credentials do not have the required permissions to access this restricted zone.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 px-6">
          <Link href="/" className="w-full sm:w-auto">
            <Button size="lg" className="w-full h-16 sm:px-8 rounded-2xl font-black uppercase tracking-[0.2em] shadow-xl shadow-[var(--primary)]/10 group">
              <Home className="w-5 h-5 mr-3 group-hover:-translate-y-1 transition-transform" />
              Return Home
            </Button>
          </Link>
          <Link href="/login" className="w-full sm:w-auto">
            <Button variant="outline" size="lg" className="w-full h-16 sm:px-8 rounded-2xl font-black uppercase tracking-[0.2em] border-[var(--warm-gray)] hover:bg-white transition-all shadow-sm group">
              <ArrowLeft className="w-5 h-5 mr-3 group-hover:-translate-x-1 transition-transform" />
              Different Account
            </Button>
          </Link>
        </div>

        <div className="mt-16 pt-12 border-t border-[var(--warm-gray)]/50">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] mb-4">
            UrugoStay System Infrastructure
          </p>
          <div className="flex items-center justify-center gap-6">
            <div className="flex items-center gap-2 text-[var(--primary)]">
               <Sparkles className="w-3 h-3" />
               <span className="text-[10px] font-bold">Secure Access Only</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
