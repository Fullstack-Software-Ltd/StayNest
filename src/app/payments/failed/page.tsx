'use client'

import { useRouter } from 'next/navigation'
import { XCircle, RefreshCcw, Home, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/shared/Button'

export default function PaymentFailedPage() {
    const router = useRouter()

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="max-w-md w-full text-center space-y-10 animate-fade-in">
                <div className="relative mx-auto w-32 h-32">
                    <div className="absolute inset-0 bg-red-500/10 rounded-full animate-pulse" />
                    <div className="relative bg-white rounded-[2.5rem] w-full h-full border border-red-50 flex items-center justify-center shadow-2xl">
                        <XCircle className="w-16 h-16 text-red-500" />
                    </div>
                </div>
                
                <div className="space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-50 text-red-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-red-100 shadow-sm">
                        Transaction Refused
                    </div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight leading-[0.9]">Payment Unsuccessful</h1>
                    <p className="text-gray-500 font-medium">Your payment could not be processed at this time. This may be due to insufficient funds, an expired card, or a temporary gateway error.</p>
                </div>

                <div className="p-6 bg-amber-50/50 rounded-[2rem] border border-amber-100 flex gap-4 text-left">
                    <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
                    <p className="text-xs text-amber-800 font-bold leading-relaxed">
                        No funds have been deducted from your account. If you believe this is an error, please contact your bank or try a different payment method.
                    </p>
                </div>

                <div className="pt-6 flex flex-col gap-4">
                    <Button 
                        size="lg"
                        className="w-full h-16 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-red-500/10 active:scale-95"
                        onClick={() => router.push('/bookings')}
                        variant="primary"
                        rightIcon={<RefreshCcw className="w-4 h-4" />}
                    >
                        Return to Bookings
                    </Button>
                    <Button 
                        variant="secondary"
                        className="w-full h-16 rounded-2xl font-black text-xs uppercase tracking-widest bg-white border-gray-200"
                        onClick={() => router.push('/')}
                        leftIcon={<Home className="w-4 h-4" />}
                    >
                        Back to Home
                    </Button>
                </div>
            </div>
        </div>
    )
}
