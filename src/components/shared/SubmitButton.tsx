'use client'

import { useFormStatus } from 'react-dom'
import { Button } from '@/components/ui/Button'
import React from 'react'

export function SubmitButton({ 
  children, 
  className 
}: { 
  children: React.ReactNode, 
  className?: string 
}) {
  const { pending } = useFormStatus()
  
  return (
    <Button 
      type="submit" 
      disabled={pending} 
      className={className}
    >
      {pending ? (
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          <span>Processing...</span>
        </div>
      ) : children}
    </Button>
  )
}
