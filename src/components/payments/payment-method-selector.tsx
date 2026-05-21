'use client'

import { PaymentMethod } from '@/types/payment'
import { CreditCard, Smartphone, Wallet, CheckCircle2 } from 'lucide-react'
import { clsx } from 'clsx'

interface PaymentMethodSelectorProps {
  selectedMethod: PaymentMethod
  onMethodChange: (method: PaymentMethod) => void
}

export function PaymentMethodSelector({ selectedMethod, onMethodChange }: PaymentMethodSelectorProps) {
  const methods = [
    {
      id: 'card' as PaymentMethod,
      name: 'Credit / Debit Card',
      description: 'Pay instantly with Visa, Mastercard, or Amex',
      icon: CreditCard,
      color: 'blue'
    },
    {
      id: 'mobile_money' as PaymentMethod,
      name: 'Mobile Money',
      description: 'M-Pesa, MTN, or Airtel Money',
      icon: Smartphone,
      color: 'amber'
    },
    {
      id: 'pay_at_property' as PaymentMethod,
      name: 'Pay at Property',
      description: 'Cash or card on arrival',
      icon: Wallet,
      color: 'slate'
    }
  ]

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-gray-900 mb-6">Select Payment Method</h3>
      <div className="grid grid-cols-1 gap-4">
        {methods.map((method) => {
          const Icon = method.icon
          const isSelected = selectedMethod === method.id
          
          return (
            <button
              key={method.id}
              onClick={() => onMethodChange(method.id)}
              className={clsx(
                'relative flex items-center p-6 rounded-[2rem] border-2 transition-all text-left outline-none',
                isSelected 
                  ? 'border-blue-600 bg-blue-50/30' 
                  : 'border-gray-100 bg-white hover:border-gray-200'
              )}
            >
              <div className={clsx(
                'w-14 h-14 rounded-2xl flex items-center justify-center mr-6',
                isSelected ? 'bg-blue-600 text-white' : 'bg-gray-50 text-gray-500'
              )}>
                <Icon size={28} strokeWidth={2.5} />
              </div>
              
              <div className="flex-1">
                <p className={clsx(
                  'font-black text-lg leading-tight uppercase tracking-tight',
                  isSelected ? 'text-blue-900' : 'text-gray-900'
                )}>
                  {method.name}
                </p>
                <p className="text-sm text-gray-500 font-medium mt-1">
                  {method.description}
                </p>
              </div>

              {isSelected && (
                <div className="absolute top-6 right-6 text-blue-600 animate-in fade-in zoom-in duration-300">
                  <CheckCircle2 size={24} fill="currentColor" stroke="white" />
                </div>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
