'use client'

import { Notification } from '@/types/notification'
import { formatRelativeTime } from '@/lib/utils/formatDate'
import { Bell, CreditCard, MessageSquare, CheckCircle, Info } from 'lucide-react'
import { markAsRead } from '@/lib/notifications/markAsRead'
import { useState } from 'react'

interface NotificationItemProps {
  notification: Notification
  onRead?: () => void
}

export function NotificationItem({ notification, onRead }: NotificationItemProps) {
  const [isRead, setIsRead] = useState(notification.is_read)

  const handleMarkAsRead = async () => {
    if (isRead) return
    const result = await markAsRead(notification.id)
    if (result.success) {
      setIsRead(true)
      if (onRead) onRead()
    }
  }

  const getIcon = () => {
    switch (notification.type) {
      case 'booking':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'payment':
        return <CreditCard className="w-5 h-5 text-blue-500" />
      case 'review':
        return <MessageSquare className="w-5 h-5 text-purple-500" />
      default:
        return <Info className="w-5 h-5 text-gray-400" />
    }
  }

  return (
    <div 
      className={`p-4 hover:bg-[var(--luxury-cream)]/50 transition-colors cursor-pointer border-l-4 ${
        isRead ? 'border-transparent bg-transparent' : 'border-[var(--luxury-gold)] bg-[var(--luxury-gold)]/5'
      }`}
      onClick={handleMarkAsRead}
    >
      <div className="flex gap-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
          isRead ? 'bg-black/5' : 'bg-white/40 shadow-sm backdrop-blur-sm'
        }`}>
          {getIcon()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h4 className={`text-sm font-bold truncate ${isRead ? 'text-gray-900' : 'text-blue-900'}`}>
              {notification.title}
            </h4>
            <span className="text-[10px] text-gray-400 font-medium shrink-0 pt-0.5">
              {formatRelativeTime(notification.created_at)}
            </span>
          </div>
          <p className={`text-xs mt-1 leading-relaxed ${isRead ? 'text-gray-500' : 'text-gray-700 font-medium'}`}>
            {notification.message}
          </p>
        </div>
      </div>
    </div>
  )
}
