'use client'

import { NotificationBell } from '@/components/notifications/notification-bell'
import { Settings, LogOut, Bell } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { Button } from '@/components/ui/Button'

export function AdminHeaderActions() {
  const router = useRouter()

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/login' })
  }

  return (
    <div className="flex items-center gap-2 sm:gap-4">
      {/* Notifications */}
      <div className="hidden sm:block">
        <NotificationBell />
      </div>

      {/* Settings */}
      <Link href="/settings">
        <Button 
          variant="ghost" 
          size="sm" 
          className="w-10 h-10 rounded-xl p-0 flex items-center justify-center text-gray-400 hover:text-[var(--primary)] hover:bg-gray-50 border border-transparent hover:border-gray-100 transition-all"
          title="Account Settings"
        >
          <Settings className="w-5 h-5" />
        </Button>
      </Link>

      {/* Logout */}
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={handleLogout}
        className="w-10 h-10 rounded-xl p-0 flex items-center justify-center text-red-400 hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-100 transition-all"
        title="Logout"
      >
        <LogOut className="w-5 h-5" />
      </Button>

      <div className="h-8 w-[1px] bg-gray-100 mx-2 hidden sm:block" />

      {/* Admin Initial (Minimal) */}
      <div className="w-9 h-9 rounded-xl bg-[var(--primary)] flex items-center justify-center text-white text-xs font-black shadow-lg shadow-[var(--primary)]/20 border border-[var(--primary-light)]">
        AD
      </div>
    </div>
  )
}
