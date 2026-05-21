import { requireAuth } from '@/lib/auth/requireAuth'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // 1. Force basic auth at the layout level
  // This is a reliable and performant alternative to middleware
  await requireAuth()

  return (
    <div className="min-h-screen bg-gray-50/30">
      {children}
    </div>
  )
}
