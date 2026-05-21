
import { getPlatformFinancialReport, getPlatformPayments, getPlatformAnalytics } from '@/lib/admin/adminActions'
import { Card, CardHeader, CardContent } from '@/components/shared/Card'
import { BarChart3, TrendingUp, CreditCard, Calendar, ArrowUpRight, DollarSign, PieChart, Activity } from 'lucide-react'
import { format } from 'date-fns'
import { cn } from '@/utils/cn'

export default async function AdminFinancialsPage() {
  const [financialReport, recentPayments, stats] = await Promise.all([
    getPlatformFinancialReport(),
    getPlatformPayments('all'),
    getPlatformAnalytics()
  ])

  return (
    <div className="max-w-7xl mx-auto space-y-12 animate-fade-in pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <h1 className="text-5xl font-black text-gray-900 tracking-tighter leading-none">Financial Oversight</h1>
          <p className="text-gray-500 font-medium text-lg mt-2">Platform revenue, trends, and payment tracking.</p>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card padding="lg" className="bg-white border-gray-100 shadow-sm relative overflow-hidden group">
           <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--primary)]/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:scale-150 transition-transform duration-700" />
           <div className="relative z-10 flex flex-col justify-between h-full">
             <div className="w-12 h-12 rounded-2xl bg-gray-900 text-white flex items-center justify-center mb-10 shadow-xl shadow-black/10">
               <DollarSign className="w-6 h-6" />
             </div>
             <div>
               <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Total Gross Volume</p>
               <h3 className="text-4xl font-black text-gray-900 tracking-tighter tabular-nums">${stats.totalRevenue.toLocaleString()}</h3>
             </div>
           </div>
        </Card>

        <Card padding="lg" className="bg-white border-gray-100 shadow-sm relative overflow-hidden group">
           <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:scale-150 transition-transform duration-700" />
           <div className="relative z-10 flex flex-col justify-between h-full">
             <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center mb-10 shadow-xl shadow-emerald-600/10">
               <TrendingUp className="w-6 h-6" />
             </div>
             <div>
               <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Top Performer Revenue</p>
               <h3 className="text-4xl font-black text-gray-900 tracking-tighter tabular-nums">
                 ${financialReport.topProperties[0]?.[1]?.toLocaleString() || '0'}
               </h3>
             </div>
           </div>
        </Card>

        <Card padding="lg" className="bg-white border-gray-100 shadow-sm relative overflow-hidden group">
           <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:scale-150 transition-transform duration-700" />
           <div className="relative z-10 flex flex-col justify-between h-full">
             <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center mb-10 shadow-xl shadow-blue-600/10">
               <CreditCard className="w-6 h-6" />
             </div>
             <div>
               <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Transaction Count</p>
               <h3 className="text-4xl font-black text-gray-900 tracking-tighter tabular-nums">{recentPayments.length}</h3>
             </div>
           </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Top Properties List */}
        <div className="lg:col-span-1 space-y-6">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center border border-gray-100">
                <PieChart className="w-5 h-5 text-gray-900" />
             </div>
             <h2 className="text-2xl font-black text-gray-900 tracking-tight">Revenue Share</h2>
          </div>
          
          <Card className="border-gray-100 shadow-sm">
            <div className="divide-y divide-gray-50">
              {financialReport.topProperties.map(([name, revenue]: any) => (
                <div key={name} className="p-6 flex items-center justify-between group hover:bg-gray-50 transition-colors">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-black text-gray-900 truncate group-hover:text-[var(--primary)] transition-colors">{name}</p>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Property Performance</p>
                  </div>
                  <div className="text-right ml-4">
                    <p className="text-lg font-black text-gray-900 tracking-tighter tabular-nums">${revenue.toLocaleString()}</p>
                    <div className="flex items-center justify-end gap-1 text-[9px] font-black text-emerald-600 uppercase tracking-widest">
                       <ArrowUpRight className="w-3 h-3" />
                       Strong
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Recent Transactions List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center border border-gray-100">
                  <Activity className="w-5 h-5 text-gray-900" />
               </div>
               <h2 className="text-2xl font-black text-gray-900 tracking-tight">Transaction Ledger</h2>
            </div>
          </div>

          <Card className="border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Transaction</th>
                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">User</th>
                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Amount</th>
                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {recentPayments.slice(0, 15).map((p: any) => {
                    const user = Array.isArray(p.user) ? p.user[0] : p.user
                    return (
                      <tr key={p.id} className="hover:bg-gray-50/80 transition-colors group">
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-white border border-gray-100 flex items-center justify-center shrink-0">
                              <CreditCard className="w-4 h-4 text-gray-400" />
                            </div>
                            <p className="text-xs font-bold text-gray-900 truncate max-w-[120px]">{p.id}</p>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <p className="text-xs font-bold text-gray-900">{user?.full_name || 'System User'}</p>
                          <p className="text-[9px] font-medium text-gray-400 truncate max-w-[100px]">{user?.email}</p>
                        </td>
                        <td className="px-6 py-5">
                          <p className="text-sm font-black text-gray-900 tracking-tighter">${Number(p.amount).toLocaleString()}</p>
                        </td>
                        <td className="px-6 py-5">
                          <span className={cn(
                            "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest",
                            p.status === 'paid' ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                          )}>
                            {p.status}
                          </span>
                        </td>
                        <td className="px-6 py-5 text-right">
                          <p className="text-xs font-bold text-gray-900">{format(new Date(p.created_at), 'MMM d, yyyy')}</p>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
