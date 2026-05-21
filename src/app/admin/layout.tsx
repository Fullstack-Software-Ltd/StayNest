import { requireRole } from '@/lib/auth/requireRole'
import Link from 'next/link'
import { Home, LayoutDashboard, Building2, Users, Settings, CalendarCheck, BarChart3 } from 'lucide-react'
import { AdminHeaderActions } from '@/components/admin/admin-header-actions'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // 1. Force role-based security at the layout level
  await requireRole(['admin'])

  const navItems = [
    { href: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/admin/properties", icon: Building2, label: "Properties" },
    { href: "/admin/bookings", icon: CalendarCheck, label: "Bookings" },
    { href: "/admin/financials", icon: BarChart3, label: "Financials" },
    { href: "/admin/users", icon: Users, label: "Users" },
  ]

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 text-gray-900 font-sans">

      {/* Sidebar */}
      <aside className="w-64 hidden md:flex flex-col shrink-0 border-r border-gray-100 bg-white relative">
        {/* Subtle top-left ambient glow (Reduced for light theme) */}
        <div className="pointer-events-none absolute top-0 left-0 w-48 h-48 rounded-full bg-indigo-500/5 blur-3xl -translate-x-1/2 -translate-y-1/2" />

        {/* Logo */}
        <div className="h-16 flex items-center px-5 border-b border-gray-100 shrink-0">
          <Link href="/admin/dashboard" className="flex items-center gap-3 group">
            <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-500/30 group-hover:shadow-indigo-500/50 transition-shadow">
              <Home className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-[15px] tracking-tight text-gray-900">
              Admin<span className="text-gray-400 font-normal">Panel</span>
            </span>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-5 space-y-0.5">
          <p className="px-3 mb-3 text-[10px] font-semibold tracking-[0.12em] uppercase text-gray-400">
            Navigation
          </p>
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-500 hover:text-[var(--primary)] hover:bg-gray-50 transition-all duration-150"
            >
              <item.icon className="w-[18px] h-[18px] shrink-0 text-gray-400 group-hover:text-[var(--primary)] transition-colors" />
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Bottom settings */}
        <div className="p-3 border-t border-gray-100">
          <Link
            href="/settings"
            className="group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:text-[var(--primary)] hover:bg-gray-50 transition-all duration-150"
          >
            <Settings className="w-[18px] h-[18px] shrink-0 text-gray-300 group-hover:text-[var(--primary)] transition-colors" />
            Settings
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">

        {/* Header */}
        <header className="h-16 shrink-0 z-20 flex items-center justify-between px-8 border-b border-gray-100 bg-white/80 backdrop-blur-xl">
          <div className="flex flex-col gap-0.5">
            <h2 className="text-[15px] font-semibold text-gray-900 tracking-tight leading-none">
              Admin Portal
            </h2>
            <p className="text-[10px] font-medium text-gray-400 uppercase tracking-[0.14em]">
              System Management
            </p>
          </div>

          {/* Right-side pill divider + actions */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] font-medium text-emerald-600 tracking-wide">Live</span>
            </div>
            <AdminHeaderActions />
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-6 lg:p-8 relative">
          {children}
        </div>

      </main>
    </div>
  )
}
