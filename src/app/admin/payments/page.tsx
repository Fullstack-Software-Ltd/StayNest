'use client'

import { getPlatformPayments } from '@/lib/admin/adminActions'
import { AdminPaymentRow } from '@/components/admin/admin-payment-row'
import { PageHeader } from '@/components/shared/page-header'
import { useEffect, useState } from 'react'
import { Receipt, Search, ShieldCheck } from 'lucide-react'
import { Input } from '@/components/shared/Input'
import { Card } from '@/components/shared/Card'
import { FormattedPrice } from '@/components/shared/formatted-price'

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const fetchPayments = async () => {
    setLoading(true)
    try {
      const data = await getPlatformPayments(statusFilter)
      setPayments(data)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPayments()
  }, [statusFilter])

  const filteredPayments = payments.filter(payment => 
    payment.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.transaction_reference?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const totalFilteredValue = filteredPayments.reduce((acc: number, payment: any) => acc + (payment.amount || 0), 0)

  return (
    <div className="min-h-screen bg-[var(--background)] pb-24 sm:pb-32 animate-fade-in pt-12 sm:pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ─── Page Header ────────────────────── */}
        <div className="mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2.5 px-4 py-2 bg-rose-50 text-rose-600 rounded-full text-[10px] font-black uppercase tracking-[0.3em] border border-rose-100 shadow-sm mb-6 flex-shrink-0">
            <ShieldCheck className="w-4 h-4" />
            Financial Core
          </div>
          <PageHeader
            title="Transaction Ledger"
            subtitle="Authoritative log of all platform financial movements."
          />
        </div>

        {/* ─── Control Bar ────────────────────── */}
        <div className="mb-12 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="w-full lg:max-w-lg relative group">
            <Input
              placeholder="Search by email, system ID, or provider ref..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<Search className="w-5 h-5 text-gray-400 group-focus-within:text-[var(--primary)] transition-colors" />}
              className="h-16 rounded-[1.5rem] border-white/60 bg-white/50 backdrop-blur-sm shadow-xl shadow-black/[0.02] focus:shadow-2xl transition-all font-bold"
            />
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="flex bg-white/50 backdrop-blur-sm shadow-sm rounded-2xl p-1.5 border border-white/60">
              {['all', 'pending', 'completed', 'failed', 'refunded'].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-4 sm:px-6 py-2.5 rounded-[1.125rem] text-[10px] font-black uppercase tracking-widest transition-all ${
                    statusFilter === status 
                      ? 'bg-[var(--primary)] text-white shadow-md' 
                      : 'text-gray-400 hover:text-gray-900 hover:bg-white'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>

            <div className="w-full sm:w-auto flex items-center justify-center gap-3 px-6 py-3 bg-emerald-50 rounded-2xl border border-emerald-100 text-[10px] font-black text-emerald-600 uppercase tracking-widest shadow-sm">
              <Receipt className="w-4 h-4 opacity-70 shrink-0" />
              Volume: <FormattedPrice amount={totalFilteredValue} />
            </div>
          </div>
        </div>

        {/* ─── Directory Listing ────────────────── */}
        {loading ? (
          <div className="py-32 flex flex-col items-center justify-center space-y-6 animate-pulse">
            <div className="w-20 h-20 rounded-full border-4 border-emerald-100 border-t-emerald-600 animate-spin shadow-2xl shadow-emerald-500/20" />
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Syncing financial ledgers...</p>
          </div>
        ) : filteredPayments.length === 0 ? (
          <Card padding="xl" className="rounded-[3rem] border-white/60 bg-white shadow-2xl shadow-black/[0.03] text-center">
            <div className="w-24 h-24 bg-[var(--warm-gray)]/30 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 text-gray-300">
              <Search className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-black text-gray-900 tracking-tight mb-2">No transactions found</h3>
            <p className="text-gray-400 font-bold uppercase tracking-[0.2em] text-xs">Verify your criteria or status gate</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-6 animate-slide-up">
            {filteredPayments.map((payment) => (
              <AdminPaymentRow 
                key={payment.id} 
                payment={payment} 
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
