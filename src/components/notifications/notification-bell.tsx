'use client'

import { useState, useEffect, useRef } from 'react'
import { Bell } from 'lucide-react'
import { Notification } from '@/types/notification'
import { NotificationList } from './notification-list'
import { getNotificationUpdate } from '@/lib/notifications/getUserNotifications'
import Link from 'next/link'

export function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const fetchNotifications = async () => {
    try {
      const { notifications: notifs, unreadCount: count } = await getNotificationUpdate(5)
      setNotifications(notifs)
      setUnreadCount(count)
    } catch (err) {
      // Gracefully handle background fetch failures
      console.error('Background notification sync failed:', err)
    }
  }

  useEffect(() => {
    fetchNotifications()
    
    // Refresh periodically (every 60s for performance)
    const interval = setInterval(fetchNotifications, 60000)
    
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      clearInterval(interval)
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all group"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-black flex items-center justify-center rounded-full border-2 border-white animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 bg-white rounded-3xl border border-gray-100 shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="p-4 border-b border-gray-50 flex items-center justify-between">
            <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Notifications</h3>
            <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full uppercase tracking-tighter">
              {unreadCount} New
            </span>
          </div>

          <NotificationList 
            notifications={notifications} 
            onNotificationRead={fetchNotifications}
          />

          <Link 
            href="/notifications" 
            onClick={() => setIsOpen(false)}
            className="block p-4 text-center text-xs font-black text-gray-500 hover:text-blue-600 border-t border-gray-50 uppercase tracking-widest bg-gray-50/50 hover:bg-blue-50/50 transition-colors"
          >
            See all notifications
          </Link>
        </div>
      )}
    </div>
  )
}
