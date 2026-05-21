'use client'

interface SectionHeaderProps {
  label?: string
  title: string
  subtitle?: string
  className?: string
}

export function SectionHeader({ label, title, subtitle, className = '' }: SectionHeaderProps) {
  return (
    <div className={`mb-10 ${className}`}>
      {label && (
        <span className="text-[10px] font-bold text-[var(--accent-dark)] uppercase tracking-[0.2em] mb-2 block">
          {label}
        </span>
      )}
      <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">{title}</h2>
      {subtitle && (
        <p className="text-gray-500 mt-2 text-sm sm:text-base max-w-lg leading-relaxed">{subtitle}</p>
      )}
    </div>
  )
}
