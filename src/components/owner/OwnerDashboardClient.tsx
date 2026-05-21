'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Profile } from '@/types/profile'
import { Property } from '@/types/property'
import { Booking } from '@/types/booking'
import { Button } from '@/components/shared/Button'
import { Card, CardHeader, CardContent } from '@/components/shared/Card'
import { StatusBadge } from '@/components/shared/status-badge'
import { EmptyState } from '@/components/shared/empty-state'
import { formatDateShort } from '@/lib/utils/formatDate'
import Link from 'next/link'
import Image from 'next/image'
import { Plus, Home, Users, Calendar, TrendingUp, ChevronRight, Sparkles, Building2, Wallet, ShieldCheck } from 'lucide-react'
import { useSettings } from '@/context/SettingsContext'
import { ImigongoPattern } from '@/components/shared/imigongo-pattern'

interface OwnerDashboardClientProps {
  profile: Profile
  properties: Property[]
  bookings: Booking[]
  reviews?: any[]
}

export function OwnerDashboardClient({ profile, properties, bookings, reviews = [] }: OwnerDashboardClientProps) {
  const { formatPrice, t } = useSettings()
  const router = useRouter()
  const [bookingFilter, setBookingFilter] = useState<string>('all')

  // Financial Calculations (10% Platform fee)
  const stats = bookings.reduce((acc, b) => {
    const isRevenue = ['confirmed', 'completed'].includes(b.status)
    const gross = Number(b.total_price)
    
    if (isRevenue) {
      acc.totalGross += gross
      acc.totalNet += gross * 0.9
    }

    if (b.status === 'confirmed') acc.activeBookings += 1
    if (b.status === 'pending') acc.pendingBookings += 1
    
    return acc
  }, { totalGross: 0, totalNet: 0, activeBookings: 0, pendingBookings: 0 })

  const approvedProperties = properties.filter(p => p.status === 'approved').length
  const pendingProperties = properties.filter(p => p.status === 'pending').length

  // Review Calculations
  const averageRating = reviews.length > 0 
    ? (reviews.reduce((acc, r) => acc + (r.rating || 0), 0) / reviews.length).toFixed(1)
    : '0.0'

  // Profile Completion Calculation
  const getCompletionScore = () => {
    let score = 0
    const p = profile as any
    if (p.full_name) score += 20
    if (p.phone) score += 20
    if (p.bio) score += 20
    if (p.payout_method && p.payout_method !== 'none') score += 20
    if (p.hostCommissionAccepted) score += 20
    return score
  }
  const completionScore = getCompletionScore()
  const isVerified = profile.role === 'owner' // Simplified verification check

  // Generate Activity Feed
  const recentBookings = bookings.map(b => ({
    id: b.id,
    type: 'booking',
    title: 'New Booking Request',
    subtitle: `${(b as any).guest?.full_name || 'Guest'} booked ${(b as any).property?.name || 'Property'}`,
    date: b.created_at,
    status: b.status,
    icon: Calendar
  }))
  const recentProperties = properties.map(p => ({
    id: p.id,
    type: 'property',
    title: p.status === 'approved' ? 'Listing Approved' : 'Listing Created',
    subtitle: p.name,
    date: p.created_at,
    status: p.status,
    icon: Building2
  }))
  const recentReviews = reviews.map(r => ({
    id: r.id,
    type: 'review',
    title: `New ${r.rating}-Star Review`,
    subtitle: `"${r.comment}"`,
    date: r.created_at,
    status: 'published',
    icon: Sparkles
  }))
  const activities = [...recentBookings, ...recentProperties, ...recentReviews]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 6)

  return (
    <div className="min-h-screen bg-[var(--background)] pb-24 sm:pb-32 animate-fade-in pt-24 sm:pt-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ─── Header Section ─────────────────── */}
        <div className="mb-12 sm:mb-16 flex flex-col lg:flex-row lg:items-end justify-between gap-10">
          <div className="flex items-center gap-6 sm:gap-8 group">
            <div className="relative">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-[var(--primary)] to-[var(--primary-dark)] rounded-[1.5rem] sm:rounded-[2rem] flex items-center justify-center text-white text-3xl font-black shadow-2xl shadow-[var(--primary)]/20 transition-transform group-hover:scale-105 duration-500">
                {profile.full_name?.charAt(0) || profile.email.charAt(0)}
              </div>
              <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-[var(--accent)] rounded-xl flex items-center justify-center border-4 border-white shadow-lg text-white">
                <Building2 className="w-4 h-4" />
              </div>
            </div>
            
            <div className="space-y-2.5">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tighter leading-none">
                  {t('owner.welcome')}, {profile.preferred_name || profile.full_name?.split(' ')[0] || t('common.user_fallback')}
                </h1>
                <div className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest flex items-center gap-1 ${isVerified ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                  {isVerified ? <ShieldCheck className="w-3 h-3" /> : <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />}
                  {isVerified ? 'Verified Host' : 'Pending Verification'}
                </div>
              </div>
              <div className="flex items-center gap-4">
                <p className="text-[10px] sm:text-xs font-black text-gray-400 uppercase tracking-[0.3em] flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                  Host Management Suite
                </p>
                <div className="h-3 w-px bg-gray-200" />
                <p className="text-[10px] font-black text-[var(--primary)] uppercase tracking-widest flex items-center gap-1.5">
                  Profile {completionScore}% 
                  {completionScore < 100 && <Link href="/host/setup/profile" className="underline decoration-[var(--primary)]/30 hover:decoration-[var(--primary)] ml-1">Complete it</Link>}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ─── Statistics Grid ────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4 lg:gap-6 mb-12 sm:mb-16">
          <Link href="/owner/properties" className="block group/link">
            <Card padding="md" interactive className="h-full rounded-[2rem] border-white/60 shadow-xl shadow-black/[0.02] bg-white group-hover/link:-translate-y-1 transition-transform">
              <div className="flex items-start justify-between">
                <div className="space-y-4">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] group-hover/link:text-[var(--primary)] transition-colors">Live Properties</p>
                  <div className="text-3xl lg:text-4xl font-black text-gray-900 tracking-tighter tabular-nums leading-none">{approvedProperties}</div>
                </div>
                <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-2xl bg-[var(--primary)]/5 flex items-center justify-center text-[var(--primary)] group-hover/link:bg-[var(--primary)] group-hover/link:text-white transition-all duration-500 shrink-0">
                  <Building2 className="w-5 h-5 lg:w-6 lg:h-6" />
                </div>
              </div>
            </Card>
          </Link>

          <Link href="/owner/reservations" className="block group/link">
            <Card padding="md" interactive className="h-full rounded-[2rem] border-white/60 shadow-xl shadow-black/[0.02] bg-white group-hover/link:-translate-y-1 transition-transform">
              <div className="flex items-start justify-between">
                <div className="space-y-4">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] group-hover/link:text-indigo-500 transition-colors">Confirmed</p>
                  <div className="text-3xl lg:text-4xl font-black text-gray-900 tracking-tighter tabular-nums leading-none">{stats.activeBookings + bookings.filter(b => b.status === 'completed').length}</div>
                </div>
                <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-2xl bg-indigo-50/50 flex items-center justify-center text-indigo-500 group-hover/link:bg-indigo-500 group-hover/link:text-white transition-all duration-500 border border-indigo-100 shrink-0">
                  <Calendar className="w-5 h-5 lg:w-6 lg:h-6" />
                </div>
              </div>
            </Card>
          </Link>

          <Link href="/owner/reservations?status=pending" className="block group/link">
            <Card padding="md" interactive className="h-full rounded-[2rem] border-white/60 shadow-xl shadow-black/[0.02] bg-white group-hover/link:-translate-y-1 transition-transform">
              <div className="flex items-start justify-between">
                <div className="space-y-4">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] group-hover/link:text-orange-500 transition-colors">Pending</p>
                  <div className="text-3xl lg:text-4xl font-black text-orange-500 tracking-tighter tabular-nums leading-none">{stats.pendingBookings}</div>
                </div>
                <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-2xl bg-orange-50/50 flex items-center justify-center text-orange-500 group-hover/link:bg-orange-500 group-hover/link:text-white transition-all duration-500 border border-orange-100 shrink-0">
                  <Sparkles className="w-5 h-5 lg:w-6 lg:h-6" />
                </div>
              </div>
            </Card>
          </Link>

          {/* New Review Tracker Card */}
          <Link href="/owner/reviews" className="block group/link">
            <Card padding="md" interactive className="h-full rounded-[2rem] border-white/60 shadow-xl shadow-black/[0.02] bg-white group-hover/link:-translate-y-1 transition-transform">
              <div className="flex items-start justify-between">
                <div className="space-y-4">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] group-hover/link:text-yellow-500 transition-colors">Guest Rating</p>
                  <div className="flex items-baseline gap-2">
                    <div className="text-3xl lg:text-4xl font-black text-gray-900 tracking-tighter tabular-nums leading-none">{averageRating}</div>
                    <span className="text-xs font-bold text-gray-400">/ 5.0</span>
                  </div>
                </div>
                <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-2xl bg-yellow-50/50 flex items-center justify-center text-yellow-500 group-hover/link:bg-yellow-500 group-hover/link:text-white transition-all duration-500 border border-yellow-100 shrink-0">
                  <svg className="w-5 h-5 lg:w-6 lg:h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                </div>
              </div>
              <p className="text-[10px] font-bold text-gray-400 mt-4">{reviews.length} total reviews</p>
            </Card>
          </Link>

          <Link href="/owner/earnings" className="block group/link">
            <Card padding="none" variant="flat" className="h-full rounded-[2rem] bg-gray-900 text-white shadow-2xl shadow-black/20 relative overflow-hidden group-hover/link:-translate-y-1 transition-transform">
              <div className="absolute inset-0">
                <ImigongoPattern variant="dark" opacity={0.3} className="absolute inset-0 w-full h-full" />
              </div>
              <div className="padding-7 p-7 relative z-10 h-full flex flex-col justify-between">
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-4 flex justify-between items-center group-hover/link:text-white transition-colors">
                    Host Payout
                    <span className="text-[var(--accent)]" title="View Commission Policy">
                      <ShieldCheck className="w-4 h-4" />
                    </span>
                  </p>
                  <div className="text-3xl lg:text-4xl font-black tracking-tighter tabular-nums mb-4 text-[var(--accent)]">{formatPrice(stats.totalNet)}</div>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-[0.1em] text-gray-400">
                    <span>Pending: {formatPrice(stats.totalGross * 0.9 * 0.1)}</span>
                    <span>Fees: {formatPrice(stats.totalGross * 0.1)}</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full w-fit">
                    <Wallet className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-black uppercase tracking-[0.1em]">Gross: {formatPrice(stats.totalGross)}</span>
                  </div>
                </div>
              </div>
            </Card>
          </Link>
        </div>

        {/* ─── Main Content ───────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-14">

          {/* Catalog Sidebar */}
          <div className="space-y-8">
            <div className="flex items-center justify-between ml-2">
              <h2 className="text-xs font-black text-gray-400 uppercase tracking-[0.4em]">{t('owner.your_properties')}</h2>
              <Link href="/owner/properties" className="text-[10px] font-black text-[var(--primary)] uppercase tracking-widest hover:underline hover:translate-x-1 transition-all">{t('owner.view_all')}</Link>
            </div>

            {properties.length === 0 ? (
              <Card className="rounded-[2.5rem] border-white/60 shadow-xl shadow-black/[0.02] overflow-hidden">
                <EmptyState 
                  variant="properties" 
                  actionLabel={profile.role !== 'admin' ? t('owner.add_property') : undefined} 
                  actionHref={profile.role !== 'admin' ? "/host/setup/property" : undefined} 
                />
              </Card>
            ) : (
              <div className="space-y-4">
                {properties.slice(0, 5).map((property) => (
                  <div 
                    key={property.id} 
                    onClick={() => router.push(`/owner/properties/${property.id}`)} 
                    className="block group cursor-pointer"
                  >
                    <div className="bg-white p-5 rounded-2xl sm:rounded-3xl border border-white/60 shadow-xl shadow-black/[0.02] group-hover:border-[var(--primary)]/20 group-hover:shadow-2xl group-hover:-translate-y-1 transition-all duration-300 flex items-center gap-5">
                      <div className="w-16 h-16 rounded-2xl overflow-hidden bg-[var(--warm-gray)]/30 shrink-0 border border-white/60 relative">
                        {property.main_image_url ? (
                          <Image 
                            src={property.main_image_url} 
                            alt={property.name} 
                            fill
                            sizes="64px"
                            className="object-cover" 
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-300">
                            <Home className="w-6 h-6" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-black text-gray-900 text-sm truncate tracking-tight">{property.name}</p>
                        <div className="flex items-center justify-between mt-2">
                          <StatusBadge status={property.status} size="sm" />
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Link 
                              href={`/owner/properties/${property.id}/edit`} 
                              className="p-1.5 text-gray-400 hover:text-[var(--primary)] hover:bg-[var(--primary)]/10 rounded-lg transition-colors" 
                              title="Edit Property"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                            </Link>
                            <Link 
                              href={`/owner/properties/${property.id}/rooms`} 
                              className="p-1.5 text-gray-400 hover:text-[var(--primary)] hover:bg-[var(--primary)]/10 rounded-lg transition-colors" 
                              title="Manage Rooms"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Building2 className="w-3.5 h-3.5" />
                            </Link>
                            <button 
                              onClick={(e) => { e.preventDefault(); e.stopPropagation(); }} 
                              className="p-1.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" 
                              title="Toggle Availability"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {pendingProperties > 0 && (
              <div className="bg-[var(--accent)]/5 border border-[var(--accent)]/10 rounded-[1.5rem] p-6 flex items-start gap-4 animate-slide-up mt-8">
                <Sparkles className="w-5 h-5 text-[var(--accent)] shrink-0" />
                <p className="text-[11px] text-[var(--primary)] font-bold leading-relaxed">
                  <strong className="font-black">{pendingProperties}</strong> {pendingProperties === 1 ? t('owner.under_review') : t('owner.properties_under_review')}. Our curators are verifying your excellence.
                </p>
              </div>
            )}
          </div>

          {/* Bookings Performance */}
          <div className="lg:col-span-2 space-y-8">
            <div className="flex items-center justify-between ml-2">
              <h2 className="text-xs font-black text-gray-400 uppercase tracking-[0.4em]">{t('owner.recent_bookings')}</h2>
              <div className="flex gap-2">
                {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map(status => (
                  <button 
                    key={status}
                    onClick={() => setBookingFilter(status)}
                    className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-colors ${bookingFilter === status ? 'bg-[var(--primary)] text-white shadow-md' : 'bg-white border border-[var(--warm-gray)] text-gray-400 hover:border-gray-400'}`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            <Card padding="none" className="rounded-[2.5rem] border-white/60 shadow-2xl shadow-black/[0.03] bg-white overflow-hidden">
              {bookings.length === 0 ? (
                <EmptyState variant="bookings" />
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-[var(--warm-gray)]/50 bg-[var(--warm-gray)]/20">
                        <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">{t('booking.guest')}</th>
                        <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] hidden sm:table-cell">{t('property.type')}</th>
                        <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] hidden md:table-cell">{t('booking.dates')}</th>
                        <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-right">{t('property.total')}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--warm-gray)]/30">
                      {bookings
                        .filter(b => bookingFilter === 'all' || b.status === bookingFilter)
                        .slice(0, 8)
                        .map((booking) => {
                        const guest = (booking as any).guest
                        const payments = (booking as any).payments
                        const isPaid = Array.isArray(payments)
                          ? payments.some((p: any) => p.status === 'paid')
                          : (payments as any)?.status === 'paid'

                        return (
                          <tr 
                            key={booking.id} 
                            onClick={() => router.push(`/owner/reservations/${booking.id}`)}
                            className="group hover:bg-[var(--warm-gray)]/10 transition-colors cursor-pointer"
                          >
                            <td className="px-8 py-6">
                              <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-[var(--primary)]/5 flex items-center justify-center text-[var(--primary)] text-sm font-black shadow-inner">
                                  {guest?.full_name?.charAt(0) ?? <Users className="w-5 h-5" />}
                                </div>
                                <div className="min-w-0">
                                  <p className="font-black text-gray-900 text-xs sm:text-sm tracking-tight truncate">{guest?.full_name ?? t('common.guest_fallback')}</p>
                                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest truncate">{booking.property?.name}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-8 py-6 hidden sm:table-cell">
                              <p className="font-bold text-gray-900 text-xs truncate max-w-[150px] tracking-tight">{booking.property?.name}</p>
                              <p className="text-[9px] text-[var(--accent)] font-black uppercase tracking-widest mt-1 opacity-80">{booking.room?.name}</p>
                            </td>
                            <td className="px-8 py-6 hidden md:table-cell">
                              <p className="text-[11px] font-black text-gray-700 tracking-tight flex items-center gap-2">
                                <Calendar className="w-3 h-3 text-[var(--primary)] opacity-30" />
                                {formatDateShort(booking.check_in)} <span className="text-[var(--warm-gray)]">&bull;</span> {formatDateShort(booking.check_out)}
                              </p>
                            </td>
                            <td className="px-8 py-6 text-right">
                              <p className={`text-sm sm:text-base font-black tabular-nums transition-colors ${isPaid ? 'text-emerald-600' : 'text-gray-400'}`}>
                                {formatPrice(Number(booking.total_price))}
                              </p>
                              <div className="flex justify-end mt-2">
                                <StatusBadge status={isPaid ? 'paid' : 'pending'} size="sm" />
                              </div>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
          </div>

        </div>

        {/* ─── Activity Feed ──────────────────── */}
        <div className="mt-10 lg:mt-14">
          <div className="flex items-center justify-between ml-2 mb-6">
            <h2 className="text-xs font-black text-gray-400 uppercase tracking-[0.4em]">Recent Activity</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activities.length === 0 ? (
              <div className="col-span-full p-8 text-center bg-white rounded-3xl border border-gray-100">
                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">No recent activity</p>
              </div>
            ) : (
              activities.map((activity) => (
                <div key={`${activity.type}-${activity.id}`} className="bg-white p-5 rounded-[2rem] border border-gray-100 shadow-sm flex items-start gap-4 hover:-translate-y-1 hover:shadow-xl hover:border-[var(--primary)]/20 transition-all duration-300">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-inner ${activity.type === 'booking' ? 'bg-indigo-50 text-indigo-500' : 'bg-[var(--primary)]/5 text-[var(--primary)]'}`}>
                    <activity.icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0 pt-1">
                    <p className="text-xs font-black text-gray-900 truncate tracking-tight">{activity.title}</p>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest truncate mt-0.5">{activity.subtitle}</p>
                    <div className="flex items-center justify-between mt-3">
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
                        {new Date(activity.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </p>
                      <StatusBadge status={activity.status} size="sm" />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  )
}
