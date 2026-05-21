'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { verifyPayment } from '@/lib/payments/verifyPayment'
import { CheckCircle2, ArrowRight, Home } from 'lucide-react'
import { HouseLoader } from '@/components/shared/HouseLoader'
import { Button } from '@/components/shared/Button'
import { Card } from '@/components/shared/Card'
import { useSettings } from '@/context/SettingsContext'
import { toast } from 'sonner'
import Link from 'next/link'

export default function PaymentSuccessPage() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const { t } = useSettings()
    
    const [verifying, setVerifying] = useState(true)
    const [status, setStatus] = useState<'success' | 'failed' | 'pending'>('pending')
    const [bookingId, setBookingId] = useState<string | null>(null)
    const [hostPhone, setHostPhone] = useState<string | null>(null)

    const session_id = searchParams.get('session_id')
    const statusParam = searchParams.get('status')

    useEffect(() => {
        async function runVerification() {
            if (!session_id) {
                setVerifying(false)
                setStatus('failed')
                return
            }

            try {
                const result = await verifyPayment(session_id)
                if (result.success) {
                    setStatus('success')
                    setBookingId(result.bookingId as string)
                    setHostPhone(result.hostPhone as string || null)
                } else {
                    setStatus('failed')
                }
            } catch (error: any) {
                console.error('Verification error:', error)
                toast.error(error.message || 'Verification failed')
                setStatus('failed')
            } finally {
                setVerifying(false)
            }
        }

        if (session_id) {
            runVerification()
        } else if (statusParam === 'cancelled') {
            setVerifying(false)
            setStatus('failed')
        } else {
            setVerifying(false)
        }
    }, [session_id, statusParam])

    if (verifying) return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <div className="flex flex-col items-center gap-6">
                <HouseLoader size="xl" />
                <div className="text-center space-y-2">
                    <h2 className="text-xl font-black text-gray-900 tracking-tighter uppercase">Securing Your Stay</h2>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Verifying transaction with Stripe...</p>
                </div>
            </div>
        </div>
    )

    if (status === 'failed') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
                <div className="max-w-md w-full text-center space-y-8 animate-fade-in">
                    <div className="w-20 h-20 bg-red-100 rounded-[2rem] flex items-center justify-center mx-auto shadow-xl shadow-red-500/10">
                        <Home className="w-10 h-10 text-red-600 rotate-12" />
                    </div>
                    <div className="space-y-3">
                        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Payment Incomplete</h1>
                        <p className="text-gray-500 font-medium">We couldn't verify your payment. This might be due to a cancellation or a temporary issue with the gateway.</p>
                    </div>
                    <div className="pt-4 flex flex-col gap-4">
                        <Button 
                            className="h-14 rounded-2xl font-black text-xs uppercase tracking-widest"
                            onClick={() => router.push('/bookings')}
                        >
                            Return to My Bookings
                        </Button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="max-w-md w-full text-center space-y-10 animate-slide-up">
                <div className="relative mx-auto w-32 h-32">
                    <div className="absolute inset-0 bg-green-500/5 rounded-full animate-ping" />
                    <div className="relative bg-white rounded-[2.5rem] w-full h-full border border-gray-100 shadow-2xl flex items-center justify-center">
                        <CheckCircle2 className="w-16 h-16 text-green-500" />
                    </div>
                </div>
                
                <div className="space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-50 text-green-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-green-100 shadow-sm">
                        Reservation Confirmed
                    </div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight">Booking Secured</h1>
                    <p className="text-gray-500 font-medium">Your payment was successful and your luxury experience is officially locked in. Prepare for Rwanda.</p>
                </div>

                <Card variant="default" className="bg-white/40 backdrop-blur-sm border-gray-100 p-6 rounded-[2rem]">
                    <div className="flex justify-between items-center text-left">
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Booking Reference</p>
                            <p className="text-sm font-bold text-gray-900">{bookingId?.split('-')[0].toUpperCase()}</p>
                        </div>
                        <Link href={`/bookings/${bookingId}`} className="text-[10px] font-black text-[var(--primary)] uppercase tracking-widest border-b-2 border-transparent hover:border-[var(--accent)] transition-all pb-1">
                            View Details
                        </Link>
                    </div>
                </Card>

                <div className="pt-6 flex flex-col gap-4">
                    {hostPhone && (
                        <Button 
                            variant="outline"
                            className="w-full h-14 rounded-2xl font-black text-xs uppercase tracking-widest border-2 border-emerald-100 text-emerald-600 hover:bg-emerald-50 transition-all"
                            onClick={() => window.open(`https://wa.me/${hostPhone.replace(/\D/g, '')}`, '_blank')}
                        >
                            Message Host on WhatsApp
                        </Button>
                    )}
                    <Button 
                        size="lg"
                        className="w-full h-16 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-[var(--primary)]/20 active:scale-95"
                        onClick={() => router.push('/bookings')}
                        rightIcon={<ArrowRight className="w-5 h-5" />}
                    >
                        Go to My Dashboard
                    </Button>
                </div>
            </div>
        </div>
    )
}
