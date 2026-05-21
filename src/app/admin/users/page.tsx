
import { getPlatformAnalytics } from '@/lib/admin/adminActions'
import { prisma } from '@/lib/prisma'
import { Card } from '@/components/shared/Card'
import { Users, Search, UserCheck, Shield, Mail, Calendar, MoreVertical, Star } from 'lucide-react'
import { format } from 'date-fns'
import { cn } from '@/utils/cn'

export default async function AdminUsersPage() {
  const stats = await getPlatformAnalytics()
  
  // Fetch users with profiles
  const users = await prisma.user.findMany({
    include: {
      profile: true
    },
    orderBy: {
      created_at: 'desc'
    },
    take: 50
  })

  return (
    <div className="max-w-7xl mx-auto space-y-12 animate-fade-in pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <h1 className="text-5xl font-black text-gray-900 tracking-tighter leading-none">User Directory</h1>
          <p className="text-gray-500 font-medium text-lg mt-2">Manage and monitor platform members.</p>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card padding="lg" className="bg-white border-gray-100 shadow-sm relative overflow-hidden group">
           <div className="relative z-10 space-y-4">
             <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100">
               <Users className="w-6 h-6" />
             </div>
             <div>
               <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Total Community</p>
               <h3 className="text-4xl font-black text-gray-900 tracking-tighter tabular-nums">{stats.totalUsers}</h3>
             </div>
           </div>
        </Card>

        <Card padding="lg" className="bg-white border-gray-100 shadow-sm relative overflow-hidden group">
           <div className="relative z-10 space-y-4">
             <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
               <UserCheck className="w-6 h-6" />
             </div>
             <div>
               <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Active Hosts</p>
               <h3 className="text-4xl font-black text-gray-900 tracking-tighter tabular-nums">{stats.totalOwners}</h3>
             </div>
           </div>
        </Card>

        <Card padding="lg" className="bg-white border-gray-100 shadow-sm relative overflow-hidden group">
           <div className="relative z-10 space-y-4">
             <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100">
               <Shield className="w-6 h-6" />
             </div>
             <div>
               <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">System Admins</p>
               <h3 className="text-4xl font-black text-gray-900 tracking-tighter tabular-nums">
                 {users.filter(u => u.profile?.role === 'admin').length}
               </h3>
             </div>
           </div>
        </Card>
      </div>

      {/* Search and User Table */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative group max-w-sm w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[var(--primary)] transition-colors" />
            <input 
              type="text"
              placeholder="Search by name, email, or role..."
              className="w-full pl-11 pr-4 py-3 rounded-2xl border border-gray-100 bg-white text-sm font-medium focus:outline-none focus:ring-4 focus:ring-[var(--primary)]/5 focus:border-[var(--primary)]/20 transition-all"
            />
          </div>
        </div>

        <Card className="border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">User Details</th>
                  <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Platform Role</th>
                  <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Joined On</th>
                  <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Verification</th>
                  <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50/80 transition-colors group">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-[var(--primary)] flex items-center justify-center text-white text-xs font-bold border-2 border-white shadow-sm shrink-0 overflow-hidden">
                          {user.profile?.avatar_url ? (
                            <img src={user.profile.avatar_url} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <span>{(user.profile?.full_name || 'U').charAt(0)}</span>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-black text-gray-900 truncate leading-tight">{user.profile?.full_name || 'System User'}</p>
                          <p className="text-[10px] font-bold text-gray-400 truncate mt-0.5">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className={cn(
                        "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border",
                        user.profile?.role === 'admin' ? "bg-amber-50 text-amber-700 border-amber-100" : 
                        user.profile?.role === 'owner' ? "bg-indigo-50 text-indigo-700 border-indigo-100" : 
                        "bg-gray-50 text-gray-600 border-gray-100"
                      )}>
                        {user.profile?.role || 'guest'}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2 text-gray-500">
                        <Calendar className="w-3.5 h-3.5 opacity-40" />
                        <span className="text-xs font-bold">{format(new Date(user.created_at), 'MMM d, yyyy')}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <div className={cn(
                          "w-2 h-2 rounded-full",
                          user.profile?.isHostOnboarded ? "bg-emerald-500" : "bg-gray-300"
                        )} />
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                          {user.profile?.isHostOnboarded ? 'Fully Verified' : 'Standard'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-900">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  )
}
