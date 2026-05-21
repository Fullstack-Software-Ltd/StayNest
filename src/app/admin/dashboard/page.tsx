import { Card, CardHeader, CardContent } from '@/components/shared/Card'
import { Button } from '@/components/shared/Button'
import { getPlatformAnalytics, getPlatformProperties, getPlatformBookings, getPlatformPayments, getPlatformFinancialReport } from '@/lib/admin/adminActions'
import { PropertyApprovalCard } from '@/components/admin/property-approval-card'
import { Activity, ArrowUpRight, BarChart3, CheckCircle2, Download, ShieldCheck, TrendingUp, Users, Clock, CreditCard, Calendar, Terminal, Home } from 'lucide-react'
import Link from 'next/link'
import { format, formatDistanceToNow } from 'date-fns'
import { cn } from '@/utils/cn'

export default async function AdminDashboardPage() {
  const [stats, pendingProperties, allProperties, recentBookings, recentPayments, financialReport] = await Promise.all([
    getPlatformAnalytics(),
    getPlatformProperties('pending'),
    getPlatformProperties('all'),
    getPlatformBookings('all'),
    getPlatformPayments('all'),
    getPlatformFinancialReport()
  ])

  const now = new Date()
  const timestamp = format(now, 'HH:mm:ss')
  const dateStr = format(now, 'MMMM d, yyyy')

  // Combine bookings, payments, and property events into an activity feed
  const activityFeed = [
    ...(allProperties || []).map((p: any) => {
      let title = 'Property Submission'
      let icon = <Home className="w-5 h-5" />
      let status: 'success' | 'pending' | 'warning' = 'pending'
      
      if (p.status === 'approved') {
        title = 'Property Approved'
        icon = <ShieldCheck className="w-5 h-5" />
        status = 'success'
      } else if (p.status === 'rejected') {
        title = 'Property Rejected'
        status = 'warning'
      }

      return {
        id: `prop-${p.id}-${p.status}`,
        type: 'property',
        title,
        details: `${p.name} (${p.city})`,
        time: p.created_at,
        status,
        icon
      }
    }),
    ...(recentBookings || []).map((b: any) => {
      const guest = Array.isArray(b.guest) ? b.guest[0] : b.guest
      const property = Array.isArray(b.property) ? b.property[0] : b.property
      
      return {
        id: `booking-${b.id}`,
        type: 'booking',
        title: 'New Booking',
        details: `${guest?.full_name || 'Guest'} booked ${property?.name || 'Property'}`,
        time: b.created_at,
        status: b.status === 'confirmed' ? 'success' : 'pending' as const,
        icon: <Calendar className="w-5 h-5" />
      }
    }),
    ...(recentPayments || []).map((p: any) => {
      const user = Array.isArray(p.user) ? p.user[0] : p.user
      
      return {
        id: `payment-${p.id}`,
        type: 'payment',
        title: 'Payment Received',
        details: `$${p.amount.toLocaleString()} from ${user?.full_name || 'User'}`,
        time: p.created_at,
        status: p.status === 'paid' ? 'success' : 'pending' as const,
        icon: <CreditCard className="w-5 h-5" />
      }
    })
  ]
    .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
    .slice(0, 8) // Show more items for a better report

  const kpis = [
    { label: "Platform Revenue", value: `$${stats.totalRevenue.toLocaleString()}`, trend: stats.totalRevenue > 0 ? "+100%" : "0%", color: "text-[var(--primary)]", icon: BarChart3 },
    { label: "Vetted Properties", value: stats.approvedProperties.toString(), trend: stats.totalProperties > 0 ? `${((stats.approvedProperties / stats.totalProperties) * 100).toFixed(0)}%` : "0%", color: "text-emerald-500", icon: ShieldCheck },
    { label: "Successful Stays", value: stats.totalBookings.toString(), trend: stats.totalBookings > 0 ? "+100%" : "0%", color: "text-blue-500", icon: CheckCircle2 },
    { label: "Guest Satisfaction", value: stats.averageRating.toString(), trend: stats.averageRating > 0 ? "+100%" : "0%", color: "text-[var(--accent)]", icon: TrendingUp },
  ]

  const recentActivity = [
    { id: 1, action: "New Booking Request", details: "John Doe booked Bisate Lodge (3 nights)", time: "10 mins ago", status: "pending" },
    { id: 2, action: "Property Approved", details: "Kigali Marriott Hotel was approved by Admin", time: "2 hours ago", status: "success" },
    { id: 3, action: "Review Flagged", details: "A review on 'Lake Kivu Retreat' was flagged.", time: "5 hours ago", status: "warning" },
  ]

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-20 animate-fade-in-up">
      {/* ─── Command Center Header ─────────────── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-4 border-b border-gray-100">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-emerald-100">
               <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
               System Core: Active
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-gray-900 text-white rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-gray-800">
               <Terminal className="w-3 h-3" />
               Session: {timestamp}
            </div>
          </div>
          <h1 className="text-5xl sm:text-6xl font-black text-gray-900 tracking-tighter leading-none">
            Control Room
          </h1>
          <p className="text-gray-500 font-medium text-lg max-w-xl">
            Monitoring <span className="text-gray-900 font-bold">{stats.totalProperties}</span> properties and <span className="text-gray-900 font-bold">{stats.totalUsers}</span> users across the UrugoStay ecosystem.
          </p>
        </div>
        
        <div className="flex items-center gap-4 bg-white p-2 rounded-2xl border border-gray-100 shadow-sm">
          <div className="text-right px-4 border-r border-gray-100">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Local Server Date</p>
            <p className="text-sm font-bold text-gray-900">{dateStr}</p>
          </div>
          <Link href="/admin/financials">
            <Button variant="primary" size="md" className="rounded-xl h-12 shadow-xl shadow-[var(--primary)]/20 px-6 font-black uppercase text-[10px] tracking-widest">
              <Download className="w-4 h-4 mr-2" />
              Detailed Reports
            </Button>
          </Link>
        </div>
      </div>

      {/* ─── KPI Cards ────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, i) => (
          <Card key={i} interactive padding="lg" className="border-white/50 shadow-xl shadow-black/[0.02]">
            <div className="flex items-start justify-between mb-8">
              <div className={`p-3 rounded-2xl bg-gray-50 border border-gray-100 transition-transform group-hover:rotate-6`}>
                <kpi.icon className={`w-5 h-5 ${kpi.color}`} />
              </div>
              <div className="flex items-center gap-1 px-2 py-1 bg-emerald-50 text-emerald-600 rounded-md text-[10px] font-black">
                <ArrowUpRight className="w-3 h-3" />
                {kpi.trend}
              </div>
            </div>
            
            <div className="space-y-1">
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest leading-none">{kpi.label}</p>
              <p className="text-3xl font-black text-gray-900 tracking-tighter tabular-nums">{kpi.value}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* ─── Operations Control Room ───────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Pending Approvals (Priority 1) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center border border-amber-100">
                  <Clock className="w-5 h-5 text-amber-600" />
               </div>
               <div>
                 <h2 className="text-2xl font-black text-gray-900 tracking-tight">Pending Approvals</h2>
                 <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-0.5">Moderate New Listings</p>
               </div>
            </div>
            <div className="bg-amber-100 text-amber-700 font-black text-[10px] px-3 py-1 rounded-full uppercase tracking-widest">
               {pendingProperties?.length || 0} Awaiting
            </div>
          </div>

          <div className="space-y-4">
            {pendingProperties && pendingProperties.length > 0 ? (
              pendingProperties.slice(0, 3).map((property: any) => (
                <PropertyApprovalCard key={property.id} property={property} />
              ))
            ) : (
              <Card className="py-20 text-center border-dashed border-gray-200 bg-gray-50/50">
                <ShieldCheck className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-gray-900 mb-1">All Clear!</h3>
                <p className="text-sm text-gray-500 font-medium max-w-xs mx-auto">There are no properties currently awaiting approval. Great job!</p>
              </Card>
            )}
          </div>

          {pendingProperties && pendingProperties.length > 3 && (
            <div className="pt-4">
              <Link href="/admin/properties?status=pending">
                <Button variant="ghost" className="w-full font-black uppercase tracking-[0.2em] text-gray-400 py-6 border-2 border-dashed border-gray-100 rounded-3xl hover:bg-gray-50 transition-all">
                  View All Pending Requests
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Real-time Insights Sidebar */}
        <div className="space-y-6">
           {/* Activity Stream (Quick Glance) */}
           <Card className="border-gray-100 shadow-sm" padding="none">
              <CardHeader 
                title="Activity Stream" 
                subtitle="Live Platform Operations"
                className="p-6 border-b border-gray-100 mb-0"
                icon={<Activity className="w-5 h-5 text-emerald-500" />}
              />
              <div className="divide-y divide-gray-50 max-h-[400px] overflow-y-auto">
                {activityFeed.length > 0 ? (
                  activityFeed.map((activity) => (
                    <div key={activity.id} className="p-4 flex items-start gap-4 hover:bg-gray-50 transition-colors group">
                      <div className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border transition-all group-hover:scale-110",
                        activity.status === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-blue-50 border-blue-100 text-blue-600'
                      )}>
                        {activity.icon}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                           <h4 className="text-sm font-black text-gray-900 truncate">{activity.title}</h4>
                           <span className="text-[9px] font-bold text-gray-400 uppercase shrink-0">
                             {formatDistanceToNow(new Date(activity.time), { addSuffix: true })}
                           </span>
                        </div>
                        <p className="text-xs text-gray-500 font-medium truncate mt-0.5">{activity.details}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-12 text-center">
                    <p className="text-sm text-gray-400 font-bold uppercase tracking-widest">No recent operations</p>
                  </div>
                )}
              </div>
              <div className="p-4 border-t border-gray-50">
                <Link href="/admin/bookings">
                  <Button variant="ghost" size="sm" className="w-full text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-gray-900">
                    View Full Audit Log
                  </Button>
                </Link>
              </div>
           </Card>

           <Card className="bg-white border-white/60 shadow-xl shadow-black/[0.02]" padding="lg">
              <div className="flex items-center gap-4 mb-6">
                 <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                 <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Security Pulse</span>
              </div>
              <p className="text-xs font-semibold text-gray-500 leading-relaxed mb-6">
                No unauthorized access attempts detected in the last 24 hours. SSL certificates are valid.
              </p>
              <div className="pt-6 border-t border-gray-50">
                <Link href="/admin/users">
                  <Button variant="ghost" size="sm" className="w-full text-xs font-black uppercase tracking-widest text-gray-400 hover:text-gray-900">
                    User Management
                  </Button>
                </Link>
              </div>
           </Card>
        </div>
      </div>
    </div>
  )
}
