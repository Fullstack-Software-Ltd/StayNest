'use client'

import React from 'react'
import Link from 'next/link'
import { cn } from '@/utils/cn'

interface TabsProps {
  defaultValue?: string
  value?: string
  className?: string
  children: React.ReactNode
}

export function Tabs({ className, children }: TabsProps) {
  return <div className={cn("w-full", className)}>{children}</div>
}

interface TabsListProps {
  className?: string
  children: React.ReactNode
}

export function TabsList({ className, children }: TabsListProps) {
  return (
    <div className={cn("inline-flex items-center justify-center p-1", className)}>
      {children}
    </div>
  )
}

interface TabsTriggerProps {
  value: string
  href?: string
  className?: string
  children: React.ReactNode
}

export function TabsTrigger({ value, href, className, children }: TabsTriggerProps) {
  const content = (
    <span className={className} data-state={href?.includes(value) ? 'active' : 'inactive'}>
      {children}
    </span>
  )

  if (href) {
    return (
      <Link href={href} className="contents">
        {content}
      </Link>
    )
  }

  return content
}

interface TabsContentProps {
  value: string
  className?: string
  children: React.ReactNode
}

export function TabsContent({ className, children }: TabsContentProps) {
  return <div className={cn("mt-2", className)}>{children}</div>
}
