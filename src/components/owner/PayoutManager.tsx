'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/shared/Card'
import { Wallet, Smartphone, Globe, CheckCircle2, Loader2, Landmark, ArrowRight } from 'lucide-react'
import { toast } from 'sonner'
import { updatePayoutMethod, requestWithdrawal } from '@/app/(owner)/owner/earnings/actions'

interface PayoutManagerProps {
  profile: any
  balance: number
}

export function PayoutManager({ profile, balance }: PayoutManagerProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSettings, setShowSettings] = useState(!profile.payout_method || profile.payout_method === 'none')
  const [method, setMethod] = useState(profile.payout_method || 'none')
  const [momoNumber, setMomoNumber] = useState(profile.payout_momo_number || '')
  const [momoProvider, setMomoProvider] = useState(profile.payout_momo_provider || 'mtn')

  const handleUpdateSettings = async () => {
    setIsSubmitting(true)
    try {
      const result = await updatePayoutMethod({
        payout_method: method,
        payout_momo_number: momoNumber,
        payout_momo_provider: momoProvider
      })
      if (result.success) {
        toast.success("Payout settings updated!")
        setShowSettings(false)
      } else {
        throw new Error(result.error)
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to update settings")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleRequestWithdrawal = async () => {
    if (balance <= 0) {
      toast.error("No funds available to withdraw")
      return
    }
    if (!profile.payout_method || profile.payout_method === 'none') {
      toast.error("Please set up your payout method first")
      setShowSettings(true)
      return
    }

    setIsSubmitting(true)
    try {
      const result = await requestWithdrawal(balance)
      if (result.success) {
        toast.success("Withdrawal request sent!", {
          description: "Our team will process your payment within 24-48 hours."
        })
      } else {
        throw new Error(result.error)
      }
    } catch (err: any) {
      toast.error(err.message || "Withdrawal request failed")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black text-gray-900 tracking-tight">Withdrawal Hub</h2>
        {profile.hostCommissionAccepted && (
          <button 
            onClick={() => setShowSettings(!showSettings)}
            className="text-[10px] font-black text-[var(--primary)] uppercase tracking-widest hover:underline"
          >
            {showSettings ? 'Cancel' : 'Update Payout Method'}
          </button>
        )}
      </div>

      {!profile.hostCommissionAccepted ? (
        <Card className="rounded-[2.5rem] border-amber-200 bg-amber-50 p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex-1">
            <h3 className="text-lg font-black text-amber-900 tracking-tight mb-2">Action Required: Commission Agreement</h3>
            <p className="text-xs font-medium text-amber-700 leading-relaxed max-w-xl">
              Before you can configure payouts or request withdrawals, please review and accept the UrugoStay Platform Commission & Transfers policy.
            </p>
          </div>
          <Button
            onClick={() => window.location.href = '/owner/earnings/agreement'}
            className="shrink-0 h-14 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-black uppercase tracking-widest px-8 shadow-lg shadow-amber-600/20"
          >
            Review Agreement
          </Button>
        </Card>
      ) : showSettings ? (
        <Card className="rounded-[2.5rem] border-[var(--primary)]/20 bg-[var(--primary)]/[0.02] p-8 animate-fade-in">
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => setMethod('momo')}
                className={`p-6 rounded-2xl border-2 text-left transition-all ${method === 'momo' ? 'border-[var(--primary)] bg-white shadow-lg' : 'border-gray-100 bg-gray-50'}`}
              >
                <Smartphone className={`w-6 h-6 mb-4 ${method === 'momo' ? 'text-[var(--primary)]' : 'text-gray-400'}`} />
                <p className="text-xs font-black uppercase tracking-widest">Mobile Money</p>
                <p className="text-[10px] font-medium text-gray-500 mt-1">MTN or Airtel Money (Local)</p>
              </button>
              <button
                onClick={() => setMethod('bank')}
                className={`p-6 rounded-2xl border-2 text-left transition-all ${method === 'bank' ? 'border-[var(--primary)] bg-white shadow-lg' : 'border-gray-100 bg-gray-50'}`}
              >
                <Landmark className={`w-6 h-6 mb-4 ${method === 'bank' ? 'text-[var(--primary)]' : 'text-gray-400'}`} />
                <p className="text-xs font-black uppercase tracking-widest">Bank Transfer</p>
                <p className="text-[10px] font-medium text-gray-500 mt-1">Direct to your local bank</p>
              </button>
            </div>

            {method === 'momo' && (
              <div className="space-y-4 animate-slide-up">
                <div className="flex p-1 bg-white rounded-xl border border-gray-200">
                  <button
                    onClick={() => setMomoProvider('mtn')}
                    className={`flex-1 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${momoProvider === 'mtn' ? 'bg-[#FFCC00] text-black shadow-sm' : 'text-gray-400'}`}
                  >
                    MTN
                  </button>
                  <button
                    onClick={() => setMomoProvider('airtel')}
                    className={`flex-1 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${momoProvider === 'airtel' ? 'bg-[#E30613] text-white shadow-sm' : 'text-gray-400'}`}
                  >
                    Airtel
                  </button>
                </div>
                <Input
                  label="Mobile Number"
                  placeholder="078XXXXXXX"
                  value={momoNumber}
                  onChange={(e) => setMomoNumber(e.target.value)}
                  className="h-14 rounded-xl bg-white"
                />
              </div>
            )}

            {method === 'bank' && (
              <div className="p-6 rounded-2xl bg-amber-50 border border-amber-100 text-amber-700 space-y-2 animate-slide-up">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  <p className="text-[10px] font-black uppercase tracking-widest">Bank Setup Note</p>
                </div>
                <p className="text-[11px] font-medium leading-relaxed">
                  Our team will contact you directly to verify your bank details once your first withdrawal exceeds $500.
                </p>
              </div>
            )}

            <Button
              disabled={isSubmitting || method === 'none'}
              onClick={handleUpdateSettings}
              className="w-full h-14 rounded-xl font-black uppercase tracking-widest shadow-xl"
            >
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Payout Preferences'}
            </Button>
          </div>
        </Card>
      ) : (
        <Card className="rounded-[2.5rem] border-gray-100 bg-white p-10 flex flex-col items-center text-center space-y-6">
          <div className="w-20 h-20 rounded-3xl bg-[var(--primary)]/5 flex items-center justify-center text-[var(--primary)] border border-[var(--primary)]/10">
            <Wallet className="w-10 h-10" />
          </div>
          
          <div className="space-y-2">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Available for Withdrawal</p>
            <h3 className="text-5xl font-black text-gray-900 tracking-tighter">
              ${balance.toLocaleString()}
            </h3>
          </div>

          <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-full border border-gray-100">
             <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
             <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">
               Payout Method: {profile.payout_method === 'momo' ? `${profile.payout_momo_provider?.toUpperCase()} (${profile.payout_momo_number})` : profile.payout_method?.toUpperCase()}
             </span>
          </div>

          <Button
            size="lg"
            onClick={handleRequestWithdrawal}
            disabled={isSubmitting || balance <= 0}
            className="w-full max-w-sm h-18 rounded-2xl bg-gray-900 text-white font-black uppercase tracking-widest group shadow-2xl shadow-black/10"
          >
            <span className="flex items-center gap-2">
              {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Request Instant Cash Out'}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
          </Button>

          <p className="text-[10px] font-medium text-gray-400 max-w-xs leading-relaxed">
            Requests are processed manually by UrugoStay Finance team. Funds usually arrive within 24 hours.
          </p>
        </Card>
      )}
    </div>
  )
}
