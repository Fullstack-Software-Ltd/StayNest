export default function GuestDashboardLoading() {
  return (
    <div className="min-h-screen bg-[var(--background)] pb-24 sm:pb-32 animate-fade-in">
      {/* Dashboard Header Skeleton */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-[var(--warm-gray)] py-12 sm:py-16 mb-12 sm:mb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-10">
            <div className="flex items-center gap-6 sm:gap-8">
              <div className="w-24 h-24 sm:w-28 sm:h-28 skeleton rounded-[2rem]" />
              <div className="space-y-4">
                <div className="w-56 h-10 skeleton rounded-xl" />
                <div className="flex items-center gap-4">
                  <div className="w-40 h-4 skeleton rounded" />
                  <div className="w-36 h-6 skeleton rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-14">
          {/* Main Content Skeleton */}
          <div className="lg:col-span-2 space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[1, 2].map((i) => (
                <div key={i} className="bg-white rounded-[2.5rem] border border-[var(--warm-gray)] p-8 space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 skeleton rounded-xl" />
                    <div className="space-y-2">
                      <div className="w-28 h-5 skeleton rounded" />
                      <div className="w-20 h-3 skeleton rounded" />
                    </div>
                  </div>
                  <div className="w-full h-4 skeleton rounded" />
                  <div className="w-full h-14 skeleton rounded-2xl" />
                </div>
              ))}
            </div>

            {/* Verification Skeleton */}
            <div className="bg-white rounded-[2.5rem] border border-[var(--warm-gray)] p-8 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 skeleton rounded-xl" />
                <div className="w-40 h-5 skeleton rounded" />
              </div>
              <div className="w-full h-20 skeleton rounded-[2rem]" />
              <div className="w-full h-20 skeleton rounded-[2rem]" />
            </div>
          </div>

          {/* Sidebar Skeleton */}
          <div>
            <div className="bg-white rounded-[2.5rem] sm:rounded-[3.5rem] border border-[var(--warm-gray)] p-10 sm:p-14 min-h-[400px] space-y-8">
              <div className="w-36 h-6 skeleton rounded-full" />
              <div className="w-3/4 h-10 skeleton rounded-xl" />
              <div className="w-full h-4 skeleton rounded" />
              <div className="w-full h-4 skeleton rounded" />
              <div className="mt-auto w-full h-20 skeleton rounded-[1.5rem]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
