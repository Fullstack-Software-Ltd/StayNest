export type NotificationType = 
  | 'booking' 
  | 'payment' 
  | 'review' 
  | 'system'
  | 'booking_confirmed'
  | 'booking_cancelled'
  | 'booking_status_updated'
  | 'payment_success'
  | 'property_approved'
  | 'property_rejected'
  | 'review_received'

export interface Notification {
  id: string
  user_id: string
  title: string
  message: string
  type: NotificationType
  is_read: boolean
  link?: string
  created_at: string | Date
}

export interface CreateNotificationInput {
  user_id: string
  title: string
  message: string
  type: NotificationType
  link?: string
}
