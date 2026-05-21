'use client'

import React from 'react'
import { Skeleton } from '@/components/shared/SkeletonLoader'

export default function PropertyDetailsLoading() {
  return (
    <div className="min-h-screen bg-[var(--background)] pb-24 sm:pb-32 animate-fade-in">
      {/* ─── Header Skeleton ─────────────────────── */}
      <section className="bg-[var(--background)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pt-8 pb-6 sm:pt-12 sm:pb-8">
          {/* Title area */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <div className="space-y-5">
              <div className="flex items-center gap-3">
                <Skeleton className="h-6 w-24 rounded-full" />
                <div className="w-1.5 h-1.5 rounded-full bg-gray-200 animate-pulse" />
                <Skeleton className="h-4 w-28 rounded-full" />
              </div>
              <Skeleton className="h-12 sm:h-16 w-[80%] max-w-xl rounded-2xl" />
              <div className="flex items-center gap-3">
                <Skeleton className="w-4 h-4 rounded-full" />
                <Skeleton className="h-4 w-64 rounded-full" />
              </div>
            </div>
          </div>

          {/* Gallery skeleton — matching actual grid layout */}
          <div className="rounded-2xl sm:rounded-3xl overflow-hidden border border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 h-[40vh] sm:h-[50vh] md:h-[60vh]">
              <Skeleton className="w-full h-full rounded-none" />
              <div className="hidden md:grid grid-cols-2 grid-rows-2 gap-2 h-full">
                <Skeleton className="w-full h-full rounded-none" />
                <Skeleton className="w-full h-full rounded-none" />
                <Skeleton className="w-full h-full rounded-none" />
                <Skeleton className="w-full h-full rounded-none" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Content Skeleton ────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 mt-8 sm:mt-12 flex flex-col lg:flex-row gap-12 sm:gap-16 lg:gap-20">
        {/* Left Column */}
        <div className="w-full lg:w-[60%] xl:w-[65%] space-y-12">
          {/* Overview skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 space-y-4">
                <Skeleton className="h-6 w-32 rounded-full" />
                <Skeleton className="h-4 w-full rounded-full" />
                <Skeleton className="h-4 w-5/6 rounded-full" />
                <Skeleton className="h-4 w-4/6 rounded-full" />
                <Skeleton className="h-4 w-3/4 rounded-full" />
              </div>
              <div className="bg-white/50 rounded-2xl border border-gray-100 p-6 flex items-center gap-5">
                <Skeleton className="w-14 h-14 rounded-xl shrink-0" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-5 w-48 rounded-full" />
                  <Skeleton className="h-4 w-full rounded-full" />
                </div>
              </div>
            </div>
            <div>
              <div className="bg-white/40 rounded-2xl border border-gray-200/50 p-6 space-y-4">
                <Skeleton className="h-5 w-32 rounded-full" />
                <Skeleton className="h-4 w-full rounded-full" />
                <Skeleton className="aspect-square w-full rounded-2xl" />
              </div>
            </div>
          </div>

          {/* Rooms skeleton */}
          <div className="pt-10 border-t border-gray-200 space-y-8">
            <div className="space-y-3">
              <Skeleton className="h-6 w-36 rounded-full" />
              <Skeleton className="h-8 w-56 rounded-full" />
            </div>
            {[1, 2].map(i => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-10 flex flex-col lg:flex-row gap-8">
                <div className="flex-1 space-y-5">
                  <Skeleton className="h-6 w-48 rounded-full" />
                  <Skeleton className="h-4 w-full rounded-full" />
                  <div className="flex gap-3">
                    <Skeleton className="h-9 w-28 rounded-xl" />
                    <Skeleton className="h-9 w-28 rounded-xl" />
                  </div>
                </div>
                <div className="lg:w-72 flex flex-col items-center gap-4 p-6 bg-gray-50/50 rounded-xl">
                  <Skeleton className="h-4 w-20 rounded-full" />
                  <Skeleton className="h-8 w-32 rounded-full" />
                  <Skeleton className="h-12 w-full rounded-xl" />
                </div>
              </div>
            ))}
          </div>

          {/* Host skeleton */}
          <div className="pt-10 border-t border-gray-200">
            <div className="bg-white rounded-2xl border border-gray-100 p-6 flex items-center gap-5">
              <Skeleton className="w-20 h-20 rounded-full shrink-0" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-6 w-40 rounded-full" />
                <Skeleton className="h-4 w-56 rounded-full" />
              </div>
            </div>
          </div>

          {/* Reviews skeleton */}
          <div className="pt-10 border-t border-gray-200 space-y-8">
            <div className="flex items-end justify-between">
              <div className="space-y-3">
                <Skeleton className="h-5 w-32 rounded-full" />
                <Skeleton className="h-10 w-56 rounded-full" />
              </div>
              <Skeleton className="h-16 w-32 rounded-xl" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="bg-white p-5 rounded-3xl border border-gray-100 space-y-4">
                  <div className="flex items-center gap-3">
                    <Skeleton className="w-10 h-10 rounded-full" />
                    <div className="space-y-1.5">
                      <Skeleton className="h-4 w-24 rounded-full" />
                      <Skeleton className="h-3 w-20 rounded-full" />
                    </div>
                  </div>
                  <Skeleton className="h-4 w-full rounded-full" />
                  <Skeleton className="h-4 w-3/4 rounded-full" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column — Booking card skeleton */}
        <div className="hidden lg:block w-full lg:w-[40%] xl:w-[35%]">
          <div className="sticky top-28 bg-white rounded-[2rem] border border-gray-100 shadow-xl p-6 lg:p-8 space-y-6">
            <div className="flex justify-between items-baseline">
              <Skeleton className="h-8 w-28 rounded-full" />
              <Skeleton className="h-5 w-32 rounded-full" />
            </div>
            <div className="border border-gray-200 rounded-2xl overflow-hidden">
              <div className="grid grid-cols-2 divide-x divide-gray-200 border-b border-gray-200">
                <div className="p-3 space-y-1.5">
                  <Skeleton className="h-3 w-16 rounded-full" />
                  <Skeleton className="h-4 w-24 rounded-full" />
                </div>
                <div className="p-3 space-y-1.5">
                  <Skeleton className="h-3 w-16 rounded-full" />
                  <Skeleton className="h-4 w-24 rounded-full" />
                </div>
              </div>
              <div className="p-3 space-y-1.5">
                <Skeleton className="h-3 w-12 rounded-full" />
                <Skeleton className="h-4 w-40 rounded-full" />
              </div>
            </div>
            <Skeleton className="h-14 w-full rounded-xl" />
            <Skeleton className="h-4 w-40 mx-auto rounded-full" />
          </div>
        </div>
      </div>
    </div>
  )
}
