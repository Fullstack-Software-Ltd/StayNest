'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Checkbox } from '@/components/ui/checkbox'
import { Card } from '@/components/shared/Card'
import { ShieldCheck, TrendingDown, Wallet, ArrowRight, Loader2, Info } from 'lucide-react'
import { toast } from 'sonner'
import { acceptHostCommissionAgreement } from './actions'

export default function HostCommissionAgreementPage() {
  const router = useRouter()
  const [isAccepted, setIsAccepted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!isAccepted) return

    setIsSubmitting(true)
    try {
      const result = await acceptHostCommissionAgreement()
      if (result.success) {
        toast.success("Agreement Accepted", {
          description: "Your commission settings have been saved successfully."
        })
        router.push('/owner/earnings')
      } else {
        throw new Error(result.error)
      }
    } catch (err: any) {
      toast.error("Failed to save", {
        description: err.message || "An unexpected error occurred. Please try again."
      })
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-[var(--warm-white)] min-h-screen pt-8 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg shadow-[var(--primary)]/10 mx-auto mb-6">
            <ShieldCheck className="w-8 h-8 text-[var(--primary)]" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight mb-4">
            Platform Commission & Transfers
          </h1>
          <p className="text-sm font-medium text-gray-500 max-w-xl mx-auto">
            Please review and accept our transparent fee structure to enable withdrawals and ensure smooth financial operations for your hosting business.
          </p>
        </div>

        {/* The Formula Card */}
        <Card className="rounded-[2.5rem] border-gray-100 bg-white p-8 sm:p-10 shadow-xl shadow-black/5 mb-8">
          <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-8">The UrugoStay Formula</h2>
          
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 bg-gray-50 p-6 rounded-3xl border border-gray-100">
            <div className="text-center sm:text-left flex-1">
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Booking Amount</p>
              <p className="text-2xl font-black text-gray-900 tracking-tight">100%</p>
            </div>
            
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm shrink-0">
              <TrendingDown className="w-4 h-4 text-red-500" />
            </div>

            <div className="text-center flex-1">
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Platform Fee</p>
              <div className="flex items-center justify-center gap-1.5">
                <span className="text-2xl font-black text-red-500 tracking-tight">10%</span>
                <div className="group relative">
                  <Info className="w-4 h-4 text-gray-400 cursor-help" />
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-3 bg-gray-900 text-white text-[10px] font-medium rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 text-center">
                    Only applied to successfully completed bookings.
                  </div>
                </div>
              </div>
            </div>

            <div className="w-8 h-8 bg-[var(--primary)] rounded-full flex items-center justify-center shadow-sm shrink-0">
              <span className="text-white font-black text-sm">=</span>
            </div>

            <div className="text-center sm:text-right flex-1">
              <p className="text-[10px] font-bold text-[var(--primary)] uppercase tracking-widest mb-2">Host Earnings</p>
              <p className="text-2xl font-black text-[var(--primary)] tracking-tight">90%</p>
            </div>
          </div>

          <div className="mt-8 space-y-4">
            <div className="flex gap-4">
              <div className="w-6 h-6 rounded-full bg-green-50 flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-green-600 font-black text-[10px]">1</span>
              </div>
              <p className="text-sm font-medium text-gray-600 leading-relaxed">
                <strong className="text-gray-900 font-bold block mb-1">Success-based fee</strong>
                We only succeed when you succeed. The 10% platform fee is exclusively deducted from successfully completed bookings. Cancelled or refunded bookings incur no platform fee.
              </p>
            </div>
            
            <div className="flex gap-4">
              <div className="w-6 h-6 rounded-full bg-green-50 flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-green-600 font-black text-[10px]">2</span>
              </div>
              <p className="text-sm font-medium text-gray-600 leading-relaxed">
                <strong className="text-gray-900 font-bold block mb-1">What the fee covers</strong>
                Your contribution powers 24/7 global support, premium marketing for your properties, secure payment processing, and ongoing improvements to the UrugoStay platform.
              </p>
            </div>
          </div>
        </Card>

        {/* Agreement Action */}
        <div className="bg-gray-900 p-8 sm:p-10 rounded-[2.5rem] shadow-2xl shadow-black/20">
          <div className="flex items-start gap-4 mb-8">
            <Checkbox 
              id="agreement" 
              checked={isAccepted}
              onCheckedChange={(checked: boolean | "indeterminate") => setIsAccepted(checked === true)}
              className="mt-1 border-gray-600 data-[state=checked]:bg-[var(--accent)] data-[state=checked]:border-[var(--accent)]"
            />
            <label 
              htmlFor="agreement" 
              className="text-sm font-medium text-gray-300 leading-relaxed cursor-pointer hover:text-white transition-colors"
            >
              I understand and accept UrugoStay's 10% commission policy. I acknowledge that this fee will be automatically deducted from my gross booking revenue before payouts are processed.
            </label>
          </div>

          <Button
            size="lg"
            onClick={handleSubmit}
            disabled={!isAccepted || isSubmitting}
            className="w-full h-16 sm:h-20 rounded-2xl bg-[var(--accent)] hover:bg-[var(--accent)]/90 text-black font-black uppercase tracking-widest group transition-all"
          >
            <span className="flex items-center justify-center gap-2">
              {isSubmitting ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Saving...</>
              ) : (
                <>Accept & Enable Withdrawals <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></>
              )}
            </span>
          </Button>
        </div>

      </div>
    </div>
  )
}
