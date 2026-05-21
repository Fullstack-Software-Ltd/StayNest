import { cn } from '@/utils/cn'

interface SectionCardProps {
  children: React.ReactNode
  className?: string
  title?: string
  subtitle?: string
  action?: React.ReactNode
  noPadding?: boolean
}

export function SectionCard({ children, className, title, subtitle, action, noPadding }: SectionCardProps) {
  return (
    <div className={cn('bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden', className)}>
      {(title || action) && (
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-50">
          <div>
            {title && <h2 className="text-base font-black text-gray-900 uppercase tracking-widest">{title}</h2>}
            {subtitle && <p className="text-xs text-gray-400 font-medium mt-0.5">{subtitle}</p>}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      <div className={cn(noPadding ? '' : 'p-6')}>{children}</div>
    </div>
  )
}

interface StatCardProps {
  label: string
  value: string | number
  icon?: React.ReactNode
  trend?: string
  trendUp?: boolean
  className?: string
}

export function StatCard({ label, value, icon, trend, trendUp, className }: StatCardProps) {
  return (
    <div className={cn('bg-white rounded-2xl border border-gray-100 p-6 shadow-sm', className)}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">{label}</p>
          <p className="text-3xl font-black text-gray-900 tracking-tight">{value}</p>
          {trend && (
            <p className={cn('text-xs font-bold mt-2', trendUp ? 'text-green-600' : 'text-red-500')}>
              {trend}
            </p>
          )}
        </div>
        {icon && (
          <div className="w-12 h-12 bg-[var(--primary)]/5 rounded-2xl flex items-center justify-center text-[var(--primary)] shrink-0">
            {icon}
          </div>
        )}
      </div>
    </div>
  )
}
