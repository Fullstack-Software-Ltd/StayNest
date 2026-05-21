import { getUserNotifications } from '@/lib/notifications/getUserNotifications'
import { NotificationItem } from '@/components/notifications/notification-item'
import { EmptyState } from '@/components/shared/empty-state'
import { PageHeader } from '@/components/shared/page-header'
import { Bell, CheckSquare } from 'lucide-react'
import { markAllAsRead } from '@/lib/notifications/markAsRead'
import { revalidatePath } from 'next/cache'

export const dynamic = 'force-dynamic'

export default async function NotificationsPage() {
  const notifications = await getUserNotifications(100)
  const unreadCount = notifications.filter(n => !n.is_read).length

  async function handleMarkAllRead() {
    'use server'
    await markAllAsRead()
    revalidatePath('/notifications')
  }

  return (
    <div className="bg-gray-50/30 min-h-screen pt-8 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <PageHeader
          title="Notifications"
          subtitle={unreadCount > 0 ? `You have ${unreadCount} unread alert${unreadCount > 1 ? 's' : ''}.` : "You're all caught up!"}
          action={
            unreadCount > 0 ? (
              <form action={handleMarkAllRead}>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-100 text-gray-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-50 transition-colors shadow-sm"
                >
                  <CheckSquare className="w-4 h-4" />
                  Mark all read
                </button>
              </form>
            ) : undefined
          }
        />

        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden divide-y divide-gray-50">
          {notifications.length === 0 ? (
            <EmptyState variant="notifications" />
          ) : (
            notifications.map((notification) => (
              <NotificationItem key={notification.id} notification={notification} />
            ))
          )}
        </div>
      </div>
    </div>
  )
}
