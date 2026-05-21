'use client'

import React from 'react'
import { HomeFooter } from '../home/HomeFooter'
import { ChevronRight, Shield, ScrollText, Lock, Cookie, ShieldCheck, Ban } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/utils/cn'

interface LegalLayoutProps {
  title: string
  subtitle: string
  children: React.ReactNode
}

export function LegalLayout({ title, subtitle, children }: LegalLayoutProps) {
  const pathname = usePathname()

  const legalLinks = [
    { name: 'Privacy Policy', path: '/privacy', icon: Lock },
    { name: 'Terms of Service', path: '/terms', icon: ScrollText },
    { name: 'Cookie Policy', path: '/cookies', icon: Cookie },
    { name: 'Safety Information', path: '/safety', icon: ShieldCheck },
    { name: 'Cancellation Info', path: '/cancellation', icon: Ban },
  ]

  return (
    <div className="min-h-screen bg-[var(--warm-white)] flex flex-col">
      {/* Header Area */}
      <header className="pt-32 pb-20 bg-white border-b border-[var(--warm-gray)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 text-[var(--primary)] font-black text-[10px] uppercase tracking-widest mb-4">
                <Shield className="w-4 h-4" />
                <span>Legal Center</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tight leading-none mb-6">
                {title}
              </h1>
              <p className="text-lg text-gray-500 font-medium leading-relaxed">
                {subtitle}
              </p>
            </div>
            <div className="hidden lg:flex items-center gap-4 text-xs font-bold text-gray-400">
               <Link href="/" className="hover:text-gray-900 transition-colors">Home</Link>
               <ChevronRight className="w-3 h-3" />
               <span className="text-gray-900">{title}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
            
            {/* Sidebar selection */}
            <aside className="lg:col-span-1">
              <nav className="sticky top-40 bg-white rounded-3xl border border-[var(--warm-gray)] p-6 shadow-sm">
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-6 px-3">Sections</h3>
                <div className="space-y-1.5">
                  {legalLinks.map((link) => (
                    <Link
                      key={link.path}
                      href={link.path}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 group font-bold text-sm",
                        pathname === link.path 
                          ? "bg-[var(--primary)] text-white shadow-lg shadow-[var(--primary)]/20" 
                          : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                      )}
                    >
                      <link.icon className={cn(
                        "w-4 h-4",
                        pathname === link.path ? "text-white" : "text-gray-400 group-hover:text-gray-600"
                      )} />
                      {link.name}
                    </Link>
                  ))}
                </div>
                
                <div className="mt-8 pt-6 border-t border-[var(--warm-gray)]">
                   <p className="text-[10px] text-gray-400 font-medium leading-relaxed px-3">
                     Last updated: March 2024. For questions, email legal@urugostay.com
                   </p>
                </div>
              </nav>
            </aside>

            {/* Content area */}
            <article className="lg:col-span-3 bg-white rounded-[40px] border border-[var(--warm-gray)] p-8 md:p-16 shadow-none max-w-none">
               <div className="prose prose-slate prose-lg max-w-none prose-headings:font-black prose-headings:tracking-tighter prose-p:font-medium prose-p:text-gray-600 prose-li:font-medium prose-li:text-gray-600 prose-blue prose-img:rounded-3xl">
                 {children}
               </div>
            </article>

          </div>
        </div>
      </main>

      <HomeFooter />
    </div>
  )
}
