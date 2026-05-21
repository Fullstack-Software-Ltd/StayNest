'use client'

import * as React from 'react'
import { AlertTriangle, X, Info, HelpCircle } from 'lucide-react'
import { Button } from '@/components/shared/Button'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/utils/cn'

interface ConfirmDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  variant?: 'danger' | 'warning' | 'info' | 'primary'
  isLoading?: boolean
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'danger',
  isLoading = false
}: ConfirmDialogProps) {
  // Use React.useEffect to handle body scroll lock
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const variantConfig = {
    danger: {
      icon: AlertTriangle,
      bg: 'bg-red-50',
      text: 'text-red-600',
      border: 'border-red-100',
      btn: 'danger' as const
    },
    warning: {
      icon: AlertTriangle,
      bg: 'bg-amber-50',
      text: 'text-amber-600',
      border: 'border-amber-100',
      btn: 'secondary' as const
    },
    info: {
      icon: Info,
      bg: 'bg-blue-50',
      text: 'text-blue-600',
      border: 'border-blue-100',
      btn: 'primary' as const
    },
    primary: {
      icon: HelpCircle,
      bg: 'bg-[var(--primary)]/5',
      text: 'text-[var(--primary)]',
      border: 'border-[var(--primary)]/10',
      btn: 'primary' as const
    }
  }

  const config = variantConfig[variant]
  const Icon = config.icon

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
          />

          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md overflow-hidden border border-[var(--warm-gray)]"
          >
            <div className="p-8 sm:p-10">
              <div className="flex justify-between items-start mb-8">
                <div className={cn("p-4 rounded-[1.5rem] border", config.bg, config.text, config.border)}>
                  <Icon className="w-7 h-7" />
                </div>
                <button 
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors group"
                  disabled={isLoading}
                >
                  <X className="w-5 h-5 text-gray-400 group-hover:text-gray-900 transition-colors" />
                </button>
              </div>

              <h3 className="text-2xl sm:text-3xl font-black text-gray-900 mb-4 tracking-tight leading-tight">
                {title}
              </h3>
              <p className="text-gray-500 font-medium leading-relaxed mb-10 text-balance">
                {message}
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  variant="outline"
                  size="lg"
                  className="flex-1 rounded-2xl order-2 sm:order-1"
                  onClick={onClose}
                  disabled={isLoading}
                >
                  {cancelLabel}
                </Button>
                <Button
                  variant={config.btn}
                  size="lg"
                  className="flex-1 rounded-2xl order-1 sm:order-2 shadow-xl"
                  onClick={onConfirm}
                  isLoading={isLoading}
                >
                  {confirmLabel}
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
