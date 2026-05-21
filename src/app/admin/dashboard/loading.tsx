export default function AdminDashboardLoading() {
  return (
    <div className="min-h-screen bg-[var(--background)] pb-24 sm:pb-32 animate-fade-in pt-12 sm:pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Skeleton */}
        <div className="mb-12 sm:mb-16 flex flex-col lg:flex-row lg:items-end justify-between gap-10">
          <div className="space-y-6">
            <div className="w-48 h-8 skeleton rounded-full" />
            <div className="space-y-3">
              <div className="w-72 h-12 skeleton rounded-2xl" />
              <div className="w-96 h-5 skeleton rounded" />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-40 h-16 skeleton rounded-2xl" />
            <div className="w-40 h-16 skeleton rounded-2xl" />
          </div>
        </div>

        {/* Stats Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 sm:mb-16">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-[2.5rem] border border-[var(--warm-gray)] p-8 space-y-5">
              <div className="flex items-start justify-between">
                <div className="space-y-4">
                  <div className="w-24 h-3 skeleton rounded" />
                  <div className="w-20 h-10 skeleton rounded-xl" />
                </div>
                <div className="w-14 h-14 skeleton rounded-2xl" />
              </div>
            </div>
          ))}
        </div>

        {/* Content Grid Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-14">
          {/* Main Health Panel */}
          <div className="lg:col-span-2 space-y-8">
            <div className="flex items-center justify-between px-2">
              <div className="w-40 h-3 skeleton rounded" />
              <div className="w-56 h-6 skeleton rounded-full" />
            </div>
            <div className="bg-white rounded-[3rem] border border-[var(--warm-gray)] p-10 space-y-10">
              <div className="space-y-4">
                <div className="w-48 h-3 skeleton rounded" />
                <div className="w-64 h-7 skeleton rounded-xl" />
                <div className="w-full h-4 skeleton rounded-full" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="p-6 bg-[var(--warm-gray)]/20 rounded-[1.5rem] border border-[var(--warm-gray)]/50 space-y-3">
                    <div className="w-20 h-3 skeleton rounded mx-auto" />
                    <div className="w-16 h-7 skeleton rounded mx-auto" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Actions Panel */}
          <div className="space-y-8">
            <div className="w-40 h-3 skeleton rounded ml-2" />
            <div className="bg-gradient-to-br from-[var(--primary)]/20 to-[var(--primary-dark)]/20 rounded-[3rem] p-10 sm:p-12 min-h-[450px] space-y-8">
              <div className="w-36 h-6 skeleton rounded-full opacity-40" />
              <div className="w-3/4 h-10 skeleton rounded-xl opacity-30" />
              <div className="w-full h-4 skeleton rounded opacity-20" />
              <div className="space-y-4 mt-auto">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-full h-16 skeleton rounded-[1.25rem] opacity-20" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
