'use client'

import { cn } from '@/utils/cn'
import { InboxIcon, SearchX, HomeIcon, CalendarX, BellOff, StarOff, Plus, ArrowRight } from 'lucide-react'
import { Button } from '@/components/shared/Button'
import Link from 'next/link'
import { useSettings } from '@/context/SettingsContext'

export type EmptyStateVariant = 'default' | 'search' | 'bookings' | 'properties' | 'notifications' | 'reviews'

interface EmptyStateProps {
  variant?: EmptyStateVariant
  title?: string
  description?: string
  actionLabel?: string
  actionHref?: string
  onAction?: () => void
  icon?: React.ElementType
  className?: string
}

export function EmptyState({
  variant = 'default',
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
  icon: CustomIcon,
  className,
}: EmptyStateProps) {
  const { t } = useSettings()

  const presets: Record<EmptyStateVariant, { icon: React.ElementType; title: string; description: string }> = {
    default: {
      icon: InboxIcon,
      title: t('common.empty.default_title') || 'Nothing here yet',
      description: t('common.empty.default_desc') || 'Check back later for updates.',
    },
    search: {
      icon: SearchX,
      title: t('common.empty.search_title') || 'No results found',
      description: t('common.empty.search_desc') || "We couldn't find anything matching your filters.",
    },
    bookings: {
      icon: CalendarX,
      title: t('common.empty.bookings_title') || 'No bookings found',
      description: t('common.empty.bookings_desc') || 'You haven\'t made any bookings yet.',
    },
    properties: {
      icon: HomeIcon,
      title: t('common.empty.properties_title') || 'No properties yet',
      description: t('common.empty.properties_desc') || 'Start by listing your first property.',
    },
    notifications: {
      icon: BellOff,
      title: t('common.empty.notifications_title') || 'No notifications',
      description: t('common.empty.notifications_desc') || 'We\'ll alert you when something happens.',
    },
    reviews: {
      icon: StarOff,
      title: t('common.empty.reviews_title') || 'No reviews yet',
      description: t('common.empty.reviews_desc') || 'Feedback from guests will appear here.',
    },
  }

  const preset = presets[variant]
  const Icon = CustomIcon ?? preset.icon
  const displayTitle = title ?? preset.title
  const displayDesc = description ?? preset.description

  return (
    <div className={cn(
      'flex flex-col items-center justify-center py-24 px-8 text-center max-w-xl mx-auto rounded-[3rem] animate-fade-in relative overflow-hidden',
      'bg-white/40 backdrop-blur-md border border-[var(--warm-gray)]/50 shadow-2xl shadow-black/[0.02]',
      className
    )}>
      {/* Background Micro-Decoration */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-[var(--primary)]/5 rounded-full blur-3xl opacity-50" />
      <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-[var(--accent)]/5 rounded-full blur-3xl opacity-50" />

      {/* Modern Icon Container */}
      <div className="relative mb-10 group">
        <div className="absolute inset-0 bg-[var(--primary)]/10 rounded-full blur-2xl group-hover:bg-[var(--primary)]/20 transition-all duration-700 animate-pulse" />
        <div className="relative w-32 h-32 bg-white rounded-[2.5rem] flex items-center justify-center text-[var(--primary)] shadow-2xl shadow-black/[0.06] border border-white transition-all duration-500 group-hover:scale-105 group-hover:rotate-3">
          <Icon className="w-12 h-12 opacity-90 stroke-[1.25]" />
          
          {/* Accent decoration */}
          <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-xl bg-[var(--accent)] flex items-center justify-center shadow-lg shadow-[var(--accent)]/20 text-white animate-bounce-slow">
            <Plus className="w-4 h-4 stroke-[3]" />
          </div>
        </div>
      </div>
      
      <div className="relative z-10 space-y-4 max-w-sm">
        <h3 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tighter leading-none text-balance">
          {displayTitle}
        </h3>
        <p className="text-gray-500 font-medium text-base leading-relaxed text-balance">
          {displayDesc}
        </p>
      </div>

      {(actionLabel && (actionHref || onAction)) && (
        <div className="mt-12 group">
          {actionHref ? (
            <Link href={actionHref}>
              <Button 
                size="lg" 
                className="rounded-[1.25rem] h-16 px-12 text-sm font-black uppercase tracking-[0.25em] shadow-xl shadow-[var(--primary)]/10 hover:shadow-[var(--primary)]/20 active:scale-[0.98] transition-all"
                rightIcon={<ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />}
              >
                {actionLabel}
              </Button>
            </Link>
          ) : (
            <Button 
              size="lg" 
              onClick={onAction}
              className="rounded-[1.25rem] h-16 px-12 text-sm font-black uppercase tracking-[0.25em] shadow-xl shadow-[var(--primary)]/10 hover:shadow-[var(--primary)]/20 active:scale-[0.98] transition-all"
              rightIcon={<ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />}
            >
              {actionLabel}
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
