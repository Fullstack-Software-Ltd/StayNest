'use client'

import { Receipt, Calendar, User, CreditCard } from 'lucide-react'
import { FormattedPrice } from '@/components/shared/formatted-price'

interface AdminPaymentRowProps {
  payment: any
}

export function AdminPaymentRow({ payment }: AdminPaymentRowProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': 
      case 'succeeded': return 'bg-emerald-50 text-emerald-600 border-emerald-100'
      case 'pending': return 'bg-amber-50 text-amber-600 border-amber-100'
      case 'failed': return 'bg-rose-50 text-rose-600 border-rose-100'
      case 'refunded': return 'bg-purple-50 text-purple-600 border-purple-100'
      default: return 'bg-gray-50 text-gray-600 border-gray-100'
    }
  }

  return (
    <div className="bg-white rounded-[2rem] border border-gray-100 p-6 flex flex-col md:flex-row items-center justify-between gap-6 hover:shadow-xl hover:shadow-gray-200/50 transition-all group focus-within:shadow-gray-200/50">
      <div className="flex items-center gap-6 w-full md:w-auto">
        <div className="w-14 h-14 bg-[var(--primary)]/5 rounded-2xl flex items-center justify-center text-[var(--primary)] group-hover:bg-[var(--primary)] group-hover:text-white transition-colors">
          <Receipt className="w-6 h-6" />
        </div>
        
        <div className="min-w-0">
          <div className="flex items-center gap-3 mb-1">
            <h3 className="text-lg font-black text-gray-900 tracking-tight flex items-center gap-2">
              <FormattedPrice amount={payment.amount} />
            </h3>
            <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${getStatusColor(payment.status)}`}>
              {payment.status}
            </span>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 mt-2">
            {payment.user?.email && (
              <p className="text-sm text-gray-500 font-medium flex items-center gap-1.5 bg-gray-50 px-3 py-1 rounded-full max-w-fit">
                <User className="w-3.5 h-3.5" />
                {payment.user.email}
              </p>
            )}
            {payment.transaction_reference && (
              <span className="text-[10px] text-gray-400 font-medium block mt-1">
                Ref: {payment.transaction_reference.slice(-8)}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between w-full md:w-auto gap-4 md:gap-8 shrink-0 border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-8">
        <div>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Transaction Date</p>
          <div className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-gray-400" />
            {new Date(payment.created_at).toLocaleString(undefined, {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
