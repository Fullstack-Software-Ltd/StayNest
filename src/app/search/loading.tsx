'use client'

import React from 'react'
import { GridSkeleton } from '@/components/shared/SkeletonLoader'
import { SlidersHorizontal } from 'lucide-react'

export default function SearchLoading() {
  return (
    <div className="min-h-screen bg-[var(--background)] pb-24 sm:pb-32">
      {/* ─── Sticky Search Header (Simulated) ────── */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-[var(--warm-gray)] py-6 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-14 w-full bg-gray-100 animate-pulse rounded-2xl" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 lg:gap-16">
          
          {/* ─── Filters Sidebar Skeleton ────────────── */}
          <aside className="lg:col-span-1 hidden lg:block">
            <div className="sticky top-40 space-y-8">
              <div className="flex items-center gap-3 px-1">
                <div className="w-8 h-8 rounded-xl bg-gray-100 animate-pulse" />
                <div className="h-4 w-20 bg-gray-100 animate-pulse rounded-full" />
              </div>
              <div className="space-y-6">
                {[1, 2, 3].map(i => (
                  <div key={i} className="space-y-3">
                    <div className="h-4 w-24 bg-gray-100 animate-pulse rounded-full" />
                    <div className="h-10 w-full bg-gray-100 animate-pulse rounded-[1.5rem]" />
                  </div>
                ))}
              </div>
            </div>
          </aside>

          {/* ─── Results Main Skeleton ───────────────── */}
          <main className="lg:col-span-3">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-10 pb-8 border-b border-[var(--warm-gray)]">
              <div className="space-y-4">
                <div className="h-8 w-48 bg-gray-100 animate-pulse rounded-full" />
                <div className="h-4 w-64 bg-gray-100 animate-pulse rounded-full" />
              </div>
            </div>

            <GridSkeleton count={8} columns="grid-cols-1 md:grid-cols-2" />
          </main>
        </div>
      </div>
    </div>
  )
}
