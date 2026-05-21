import { cn } from '@/utils/cn'

interface SkeletonProps {
  className?: string
}

export function Skeleton({ className }: SkeletonProps) {
  return <div className={cn('animate-shimmer rounded-xl bg-gradient-to-r from-gray-100 via-gray-50 to-gray-100 bg-[length:200%_100%]', className)} />
}

export function SkeletonCard() {
  return (
    <div className="bg-white rounded-[2rem] border border-gray-100 overflow-hidden shadow-sm h-full">
      <Skeleton className="h-64 w-full rounded-none" />
      <div className="p-8 space-y-4">
        <Skeleton className="h-6 w-3/4 rounded-lg" />
        <Skeleton className="h-4 w-1/2 rounded-md" />
        <div className="flex justify-between items-end pt-4">
          <div className="space-y-2">
            <Skeleton className="h-3 w-16 rounded-sm" />
            <Skeleton className="h-5 w-24 rounded-md" />
          </div>
          <Skeleton className="h-12 w-28 rounded-2xl" />
        </div>
      </div>
    </div>
  )
}

export function SkeletonListItem() {
  return (
    <div className="flex gap-6 p-6 border-b border-gray-50 items-center">
      <Skeleton className="w-14 h-14 rounded-2xl shrink-0" />
      <div className="flex-1 space-y-3">
        <Skeleton className="h-5 w-1/3 rounded-md" />
        <Skeleton className="h-4 w-1/4 rounded-sm" />
      </div>
      <Skeleton className="h-8 w-24 rounded-xl" />
    </div>
  )
}

export function SkeletonGrid({ count = 6, columns = 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' }: { count?: number, columns?: string }) {
  return (
    <div className={cn('grid gap-8', columns)}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  )
}
