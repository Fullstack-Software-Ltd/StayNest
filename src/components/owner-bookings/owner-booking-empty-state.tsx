'use client'

import { Calendar } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'

export function OwnerBookingEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      <div className="w-20 h-20 bg-gray-50 text-gray-300 rounded-[2rem] flex items-center justify-center mb-6 border border-gray-100">
        <Calendar className="w-10 h-10" />
      </div>
      <h3 className="text-2xl font-black text-gray-900 mb-2 tracking-tight">No bookings yet</h3>
      <p className="text-gray-500 max-w-sm font-medium leading-relaxed mb-8">
        Your properties haven't received any bookings yet. Make sure your listings are complete and visible to guests.
      </p>
      <Link href="/owner/properties">
        <Button className="rounded-2xl px-10 py-4 shadow-xl shadow-[var(--primary)]/10">
          Manage Properties
        </Button>
      </Link>
    </div>
  )
}
