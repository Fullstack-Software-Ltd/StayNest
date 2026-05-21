'use client'

import { Notification } from '@/types/notification'
import { NotificationItem } from './notification-item'
import { BellOff } from 'lucide-react'
import { useSettings } from '@/context/SettingsContext'

interface NotificationListProps {
  notifications: Notification[]
  onNotificationRead?: () => void
}

export function NotificationList({ notifications, onNotificationRead }: NotificationListProps) {
  const { t } = useSettings()

  if (notifications.length === 0) {
    return (
      <div className="p-12 text-center">
        <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-gray-300">
          <BellOff className="w-8 h-8" />
        </div>
        <h3 className="text-sm font-bold text-gray-900">{t('notifications.empty_title')}</h3>
        <p className="text-xs text-gray-500 mt-1">{t('notifications.empty_desc')}</p>
      </div>
    )
  }

  return (
    <div className="divide-y divide-gray-100 max-h-[400px] overflow-y-auto">
      {notifications.map((notification) => (
        <NotificationItem 
          key={notification.id} 
          notification={notification} 
          onRead={onNotificationRead}
        />
      ))}
    </div>
  )
}
