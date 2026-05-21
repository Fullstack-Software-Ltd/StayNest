'use client'

import { AlertTriangle, X } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { motion, AnimatePresence } from 'framer-motion'

interface ConfirmationDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  variant?: 'danger' | 'warning' | 'info'
  isLoading?: boolean
}

export function ConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'danger',
  isLoading = false
}: ConfirmationDialogProps) {
  if (!isOpen) return null

  const variantStyles = {
    danger: 'bg-red-50 text-red-600',
    warning: 'bg-amber-50 text-amber-600',
    info: 'bg-blue-50 text-blue-600'
  }

  const iconColors = {
    danger: 'text-red-600',
    warning: 'text-amber-600',
    info: 'text-blue-600'
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        />

        {/* Dialog */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative bg-white rounded-[2rem] shadow-2xl w-full max-w-md overflow-hidden"
        >
          <div className="p-8">
            <div className="flex justify-between items-start mb-6">
              <div className={cn("p-3 rounded-2xl", variantStyles[variant])}>
                <AlertTriangle className={cn("w-6 h-6", iconColors[variant])} />
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                disabled={isLoading}
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <h3 className="text-2xl font-black text-gray-900 mb-3 tracking-tight">
              {title}
            </h3>
            <p className="text-gray-500 font-medium leading-relaxed mb-8">
              {message}
            </p>

            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1 rounded-2xl py-6"
                onClick={onClose}
                disabled={isLoading}
              >
                {cancelLabel}
              </Button>
              <Button
                variant={variant === 'danger' ? 'primary' : 'secondary'}
                className={cn(
                  "flex-1 rounded-2xl py-6 shadow-xl",
                  variant === 'danger' && "bg-red-600 hover:bg-red-700 shadow-red-200"
                )}
                onClick={onConfirm}
                disabled={isLoading}
              >
                {isLoading ? 'Processing...' : confirmLabel}
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ')
}
