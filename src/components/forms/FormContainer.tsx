import * as React from "react"
import { cn } from "@/utils/cn"

interface FormContainerProps {
  children: React.ReactNode
  title: string
  subtitle?: string
  className?: string
  onSubmit?: (e: React.FormEvent) => void
}

export function FormContainer({ children, title, subtitle, className, onSubmit }: FormContainerProps) {
  const Component = onSubmit ? 'form' : 'div'
  
  return (
    <Component 
      onSubmit={onSubmit}
      className={cn("w-full max-w-2xl p-8 bg-white rounded-3xl shadow-xl border border-gray-100 mx-auto", className)}
    >
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-gray-900 tracking-tight">{title}</h2>
        {subtitle && <p className="mt-2 text-sm text-gray-600">{subtitle}</p>}
      </div>
      {children}
    </Component>
  )
}
