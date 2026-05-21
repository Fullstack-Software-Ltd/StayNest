'use client'

import { cn } from '@/utils/cn'

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
}

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn('animate-shimmer bg-[var(--warm-gray)] rounded-xl relative overflow-hidden', className)}
      {...props}
    >
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
    </div>
  )
}

export function PropertyCardSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="aspect-[4/3] rounded-[2rem]" />
      <div className="space-y-2">
        <div className="flex justify-between items-start">
          <Skeleton className="h-6 w-2/3" />
          <Skeleton className="h-6 w-12" />
        </div>
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-1/3" />
      </div>
    </div>
  )
}

export function ListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex gap-4 items-center p-4 bg-white rounded-2xl border border-[var(--warm-gray)]">
          <Skeleton className="w-16 h-16 rounded-xl shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-1/3" />
            <Skeleton className="h-4 w-1/4" />
          </div>
          <Skeleton className="w-20 h-8 rounded-lg" />
        </div>
      ))}
    </div>
  )
}

export function GridSkeleton({ count = 8, columns = 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4' }: { count?: number; columns?: string }) {
  return (
    <div className={cn('grid gap-6', columns)}>
      {Array.from({ length: count }).map((_, i) => (
        <PropertyCardSkeleton key={i} />
      ))}
    </div>
  )
}
