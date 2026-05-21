'use client'

import { cn } from '@/utils/cn'

/**
 * HouseLoader — The single, unified loading component for UrugoStay.
 * A small house SVG icon that rotates in green, used everywhere.
 */

interface HouseLoaderProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  label?: string
  className?: string
  fullPage?: boolean
}

const sizeMap = {
  xs: { icon: 14, ring: 28, border: 2 },
  sm: { icon: 18, ring: 36, border: 2 },
  md: { icon: 24, ring: 48, border: 3 },
  lg: { icon: 32, ring: 64, border: 3 },
  xl: { icon: 40, ring: 80, border: 4 },
}

function HouseIcon({ size = 24, className = '' }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Roof */}
      <path
        d="M3 12L12 3L21 12"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* House body */}
      <path
        d="M5 10V20C5 20.5523 5.44772 21 6 21H18C18.5523 21 19 20.5523 19 20V10"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Door */}
      <path
        d="M9 21V15C9 14.4477 9.44772 14 10 14H14C14.5523 14 15 14.4477 15 15V21"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function HouseLoader({
  size = 'md',
  label,
  className,
  fullPage = false,
}: HouseLoaderProps) {
  const s = sizeMap[size]

  const loader = (
    <div className={cn('flex flex-col items-center justify-center gap-3', className)}>
      <div
        className="relative flex items-center justify-center"
        style={{ width: s.ring, height: s.ring }}
      >
        {/* Orbiting ring */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            border: `${s.border}px solid rgba(15, 47, 35, 0.08)`,
            borderTopColor: 'var(--primary)',
            animation: 'house-orbit 1s cubic-bezier(0.5, 0, 0.5, 1) infinite',
          }}
        />
        {/* House icon in center */}
        <div
          className="relative z-10 text-[var(--primary)]"
          style={{ animation: 'house-pulse 2s ease-in-out infinite' }}
        >
          <HouseIcon size={s.icon} />
        </div>
      </div>

      {label && (
        <p
          className="text-[10px] font-black uppercase tracking-[0.25em] text-[var(--primary)]/50"
          style={{ animation: 'house-pulse 2s ease-in-out infinite 0.3s' }}
        >
          {label}
        </p>
      )}
    </div>
  )

  if (fullPage) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[var(--warm-white)]/80 backdrop-blur-sm">
        {loader}
      </div>
    )
  }

  return loader
}

/** Inline button loader — very small house spinner for buttons */
export function HouseButtonLoader({ className }: { className?: string }) {
  return (
    <div className={cn('inline-flex items-center justify-center mr-2', className)}>
      <div
        className="relative flex items-center justify-center"
        style={{ width: 20, height: 20 }}
      >
        <div
          className="absolute inset-0 rounded-full"
          style={{
            border: '2px solid rgba(255,255,255,0.2)',
            borderTopColor: 'currentColor',
            animation: 'house-orbit 0.8s cubic-bezier(0.5, 0, 0.5, 1) infinite',
          }}
        />
        <HouseIcon size={10} className="relative z-10 opacity-70" />
      </div>
    </div>
  )
}

/** Full-page loading — used for route loading.tsx files */
export function PageHouseLoading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--background)]">
      <HouseLoader size="lg" label="Loading" />
    </div>
  )
}

export { HouseIcon }
