export default function OwnerDashboardLoading() {
  return (
    <div className="min-h-screen bg-[var(--background)] pb-24 sm:pb-32 animate-fade-in pt-12 sm:pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Skeleton */}
        <div className="mb-12 sm:mb-16 flex flex-col lg:flex-row lg:items-end justify-between gap-10">
          <div className="flex items-center gap-6 sm:gap-8">
            <div className="w-20 h-20 sm:w-24 sm:h-24 skeleton rounded-[2rem]" />
            <div className="space-y-4">
              <div className="w-56 h-8 skeleton rounded-xl" />
              <div className="w-40 h-4 skeleton rounded" />
            </div>
          </div>
          <div className="w-48 h-16 skeleton rounded-2xl" />
        </div>

        {/* Stats Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 sm:mb-16">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-[2rem] border border-[var(--warm-gray)] p-7 space-y-5">
              <div className="flex items-start justify-between">
                <div className="space-y-4">
                  <div className="w-24 h-3 skeleton rounded" />
                  <div className="w-16 h-10 skeleton rounded-xl" />
                </div>
                <div className="w-12 h-12 skeleton rounded-2xl" />
              </div>
            </div>
          ))}
        </div>

        {/* Content Grid Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-14">
          {/* Properties Sidebar */}
          <div className="space-y-4">
            <div className="flex items-center justify-between px-2 mb-4">
              <div className="w-32 h-3 skeleton rounded" />
              <div className="w-16 h-3 skeleton rounded" />
            </div>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white p-5 rounded-3xl border border-[var(--warm-gray)] flex items-center gap-5">
                <div className="w-16 h-16 skeleton rounded-2xl shrink-0" />
                <div className="flex-1 space-y-3">
                  <div className="w-3/4 h-4 skeleton rounded" />
                  <div className="w-16 h-5 skeleton rounded-full" />
                </div>
              </div>
            ))}
          </div>

          {/* Bookings Table */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between px-2 mb-4">
              <div className="w-36 h-3 skeleton rounded" />
              <div className="w-24 h-6 skeleton rounded-full" />
            </div>
            <div className="bg-white rounded-[2.5rem] border border-[var(--warm-gray)] overflow-hidden">
              <div className="border-b border-[var(--warm-gray)]/50 bg-[var(--warm-gray)]/20 px-8 py-6 flex gap-8">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-24 h-3 skeleton rounded" />
                ))}
              </div>
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="px-8 py-6 flex items-center gap-8 border-b border-[var(--warm-gray)]/30">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-12 h-12 skeleton rounded-2xl shrink-0" />
                    <div className="space-y-2 flex-1">
                      <div className="w-28 h-4 skeleton rounded" />
                      <div className="w-20 h-3 skeleton rounded" />
                    </div>
                  </div>
                  <div className="w-24 h-4 skeleton rounded hidden sm:block" />
                  <div className="w-32 h-4 skeleton rounded hidden md:block" />
                  <div className="w-20 h-5 skeleton rounded" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
