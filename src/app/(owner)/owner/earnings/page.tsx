import { requireRole } from '@/lib/auth/requireRole'
import { getOwnerBookings } from '@/lib/bookings/getOwnerBookings'
import { PageHeader } from '@/components/shared/page-header'
import { calculatePayout, formatCurrency } from '@/lib/utils/finance'
import { BarChart3, TrendingUp, Wallet, ArrowUpRight, DollarSign } from 'lucide-react'
import { FormattedPrice } from '@/components/shared/formatted-price'
import { format, parseISO, startOfMonth } from 'date-fns'
import { auth } from '@/auth'
import { getProfile } from '@/lib/auth/getProfile'
import { PayoutManager } from '@/components/owner/PayoutManager'

export default async function OwnerEarningsPage() {
  await requireRole(['owner', 'admin'])
  const session = await auth()
  const bookings = await getOwnerBookings()
  
  if (!session?.user?.id) return null
  const profile = await getProfile(session.user.id)

  // Filter only paid/confirmed/completed bookings for revenue
  const validBookings = bookings.filter((b: any) => ['confirmed', 'completed'].includes(b.status))
  
  const totalGross = validBookings.reduce((sum: number, b: any) => sum + Number(b.total_price), 0)
  const { fee: totalFees, net: totalNet } = calculatePayout(totalGross)

  // Aggregate by month
  const monthlyData: Record<string, number> = {}
  validBookings.forEach((b: any) => {
    const month = format(startOfMonth(parseISO(b.created_at)), 'MMM yyyy')
    monthlyData[month] = (monthlyData[month] || 0) + Number(b.total_price)
  })

  return (
    <div className="bg-[var(--warm-white)] min-h-screen pt-8 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <PageHeader
          title="Earnings & Finance"
          subtitle="Track your revenue, platform fees, and payouts."
        />

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-110 transition-transform">
              <Wallet className="w-24 h-24 text-[var(--primary)]" />
            </div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Total Gross Revenue</p>
            <h3 className="text-4xl font-black text-gray-900 tracking-tight">
              {formatCurrency(totalGross)}
            </h3>
            <div className="mt-6 flex items-center text-xs font-bold text-green-600 bg-green-50 w-fit px-3 py-1 rounded-full border border-green-100">
              <ArrowUpRight className="w-3 h-3 mr-1" /> All time
            </div>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-110 transition-transform">
              <BarChart3 className="w-24 h-24 text-red-600" />
            </div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Platform Commission (10%)</p>
            <h3 className="text-4xl font-black text-red-600 tracking-tight">
              -{formatCurrency(totalFees)}
            </h3>
            <p className="mt-6 text-xs font-bold text-gray-400">Deducted automatically</p>
          </div>

          <div className="bg-gray-900 p-8 rounded-[2.5rem] shadow-2xl shadow-black/20 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-[0.1] group-hover:scale-110 transition-transform">
              <TrendingUp className="w-24 h-24 text-[var(--accent)]" />
            </div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Net Owner Payout</p>
            <h3 className="text-4xl font-black text-white tracking-tight">
              {formatCurrency(totalNet)}
            </h3>
            <div className="mt-6 flex items-center text-xs font-bold text-[var(--accent)] bg-white/10 w-fit px-3 py-1 rounded-full">
               Verified balance
            </div>
          </div>
        </div>

        {/* Withdrawal Hub */}
        <div className="mt-16">
          <PayoutManager profile={JSON.parse(JSON.stringify(profile))} balance={totalNet} />
        </div>

        {/* Transactions List */}
        <div className="mt-16">
          <h2 className="text-2xl font-black text-gray-900 tracking-tight mb-8">Payout History</h2>
          <div className="bg-white rounded-[3rem] border border-gray-100 shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">Date</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">Property</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">Gross</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">Fee (10%)</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">Net Payout</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {validBookings.length > 0 ? (
                  validBookings.map((b: any) => {
                    const { fee, net } = calculatePayout(Number(b.total_price))
                    return (
                      <tr key={b.id} className="hover:bg-gray-50/30 transition-colors">
                        <td className="px-8 py-5 text-sm font-bold text-gray-500">{format(parseISO(b.created_at), 'MMM dd, yyyy')}</td>
                        <td className="px-8 py-5">
                          <p className="text-sm font-black text-gray-900 leading-none">{b.property?.name}</p>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter mt-1">{b.status}</p>
                        </td>
                        <td className="px-8 py-5 text-sm font-bold text-gray-900">{formatCurrency(Number(b.total_price))}</td>
                        <td className="px-8 py-5 text-sm font-bold text-red-500">-{formatCurrency(fee)}</td>
                        <td className="px-8 py-5">
                          <span className="text-sm font-black text-gray-900 bg-gray-100 px-3 py-1.5 rounded-xl border border-gray-200">
                             {formatCurrency(net)}
                          </span>
                        </td>
                      </tr>
                    )
                  })
                ) : (
                  <tr>
                    <td colSpan={5} className="px-8 py-20 text-center">
                       <DollarSign className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                       <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">No earnings recorded yet</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
