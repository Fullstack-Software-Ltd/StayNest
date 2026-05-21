import { requireRole } from '@/lib/auth/requireRole'
import { Button } from '@/components/shared/Button'
import { Card, CardHeader, CardContent } from '@/components/shared/Card'
import Link from 'next/link'
import { Calendar, Heart, ShieldCheck, Sparkles, ArrowRight, LayoutDashboard, UserCheck, Mail } from 'lucide-react'
import { ImigongoPattern } from '@/components/shared/imigongo-pattern'

export default async function GuestDashboard() {
  const { profile } = await requireRole(['guest', 'owner', 'admin'])

  if (profile?.role === 'admin') {
    const { redirect } = await import('next/navigation')
    redirect('/admin/dashboard')
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Unable to load profile.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[var(--background)] pb-24 sm:pb-32 animate-fade-in">
      {/* ─── Dashboard Header ─────────────────── */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-[var(--warm-gray)] py-12 sm:py-16 mb-12 sm:mb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-10">
            <div className="flex items-center gap-6 sm:gap-8 group">
              <div className="relative">
                <div className="w-24 h-24 sm:w-28 sm:h-28 bg-gradient-to-br from-[var(--primary)] to-[var(--primary-dark)] rounded-[2rem] flex items-center justify-center text-white text-4xl font-black shadow-2xl shadow-[var(--primary)]/20 transition-transform group-hover:scale-105 duration-500">
                  {profile?.full_name?.charAt(0) || 'G'}
                </div>
                <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-[var(--accent)] rounded-2xl flex items-center justify-center border-4 border-white shadow-lg text-white">
                  <UserCheck className="w-5 h-5" />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl sm:text-5xl font-black text-gray-900 tracking-tighter leading-none">
                    {profile?.full_name?.split(' ')[0] || 'Guest'}'s Hub
                  </h1>
                  <span className="animate-pulse duration-[3s]">
                    <Sparkles className="w-5 h-5 text-[var(--accent)]" />
                  </span>
                </div>
                
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-2 text-gray-400 font-bold text-sm">
                    <Mail className="w-4 h-4 text-gray-300" />
                    {profile.email}
                  </div>
                  <span className="w-1.5 h-1.5 bg-[var(--warm-gray)] rounded-full hidden sm:block"></span>
                  <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border shadow-sm ${
                    profile.role === 'owner' 
                      ? 'bg-[var(--primary)]/5 text-[var(--primary)] border-[var(--primary)]/10' 
                      : 'bg-[var(--accent)]/5 text-[var(--accent)] border-[var(--accent)]/10'
                  }`}>
                    {profile.role === 'owner' ? 'Curated Host Account' : 'Verified Guest Account'}
                  </span>
                </div>
              </div>
            </div>

            {profile.role === 'owner' && (
              <Link href="/owner/dashboard">
                <Button 
                  size="lg" 
                  variant="primary"
                  className="h-16 sm:h-20 px-10 rounded-2xl sm:rounded-[1.5rem] font-black text-xs sm:text-sm uppercase tracking-[0.2em] shadow-2xl shadow-[var(--primary)]/10 group overflow-hidden"
                  leftIcon={<LayoutDashboard className="w-5 h-5 group-hover:rotate-12 transition-transform" />}
                >
                  Host Command Center
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          
          {/* ─── Main Content Areas (8/12 = 66%) ──────────────── */}
          <div className="lg:col-span-8 space-y-12">
            
            {/* Quick Actions Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <Card interactive padding="lg" className="rounded-[2.5rem] border-white/60 shadow-xl shadow-black/[0.02] max-w-lg mx-auto w-full">
                <CardHeader 
                  title="My Bookings"
                  subtitle="Your personal travels"
                  icon={<Calendar className="w-5 h-5 text-[var(--primary)]" />}
                />
                <CardContent className="space-y-6">
                  <p className="text-gray-500 font-medium text-sm leading-relaxed opacity-80">
                    Efficiently manage your upcoming experiences and past adventures.
                  </p>
                  <Link href="/bookings" className="block">
                    <Button variant="outline" className="w-full h-14 rounded-2xl font-black text-[10px] uppercase tracking-widest border-[var(--warm-gray)] hover:bg-[var(--primary)]/5">
                      View Reservation History
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card interactive padding="lg" className="rounded-[2.5rem] border-white/60 shadow-xl shadow-black/[0.02] max-w-lg mx-auto w-full">
                <CardHeader 
                  title="Wishlist"
                  subtitle="Coming Soon"
                  icon={<Heart className="w-5 h-5 text-rose-400" />}
                />
                <CardContent className="space-y-6">
                  <p className="text-gray-500 font-medium text-sm leading-relaxed opacity-80">
                    Your collection of dream stays. Heart your favorites to see them here.
                  </p>
                  <Button disabled variant="outline" className="w-full h-14 rounded-2xl font-black text-[10px] uppercase tracking-widest opacity-50 border-dashed">
                    Curate Your Favorites
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Verification Status Card */}
            <Card padding="lg" className="rounded-[2.5rem] bg-white border-white/60 shadow-xl shadow-black/[0.02]">
              <CardHeader 
                title="Account Verification"
                subtitle="Secure your experience"
                icon={<ShieldCheck className="w-5 h-5 text-[var(--primary)]" />}
              />
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-6 bg-[var(--warm-gray)]/30 rounded-[2rem] border border-[var(--warm-gray)]/40 group hover:bg-white transition-colors duration-500">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-[var(--primary)] flex items-center justify-center shadow-lg shadow-[var(--primary)]/20">
                      <ShieldCheck className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <span className="block font-black text-gray-900 tracking-tight">Email Verified</span>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Connected: {profile.email}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-black text-[var(--primary)] uppercase tracking-widest bg-[var(--primary)]/10 px-4 py-1.5 rounded-full">ACTIVE</span>
                </div>

                <div className="flex items-center justify-between p-6 bg-white rounded-[2rem] border-2 border-dashed border-[var(--warm-gray)]/60 opacity-60 hover:opacity-100 transition-all cursor-pointer group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-[var(--accent)]/10 transition-colors">
                      <LayoutDashboard className="w-5 h-5 text-gray-400 group-hover:text-[var(--accent)]" />
                    </div>
                    <div>
                      <span className="block font-black text-gray-400 group-hover:text-gray-900 transition-colors tracking-tight">Identity Verification</span>
                      <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">Enhanced Security</p>
                    </div>
                  </div>
                  <Button variant="ghost" className="text-[10px] font-black text-[var(--primary)] uppercase tracking-widest p-0 group-hover:translate-x-2 transition-transform">
                    Verify Now <ArrowRight className="w-3 h-3 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* ─── Sidebar Hosting Section (4/12 = 33%) ─────────── */}
          <div className="lg:col-span-4 space-y-8">
            {profile.role === 'owner' ? (
              <Card padding="none" variant="default" className="rounded-[2.5rem] sm:rounded-[3.5rem] border-white/60 shadow-2xl shadow-black/[0.04] h-full overflow-hidden relative group">
                <div className="absolute top-0 right-0 w-48 h-48 bg-[var(--primary)]/5 rounded-full -mr-24 -mt-24 blur-3xl transition-transform group-hover:scale-110 duration-700" />
                
                <div className="p-10 sm:p-14 h-full flex flex-col justify-between min-h-[400px] relative z-10">
                  <div className="space-y-6">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--primary)]/10 text-[var(--primary)] rounded-full text-[10px] font-black uppercase tracking-[0.3em] border border-[var(--primary)]/10 shadow-sm animate-pulse-glow">
                      <Sparkles className="w-3 h-3" />
                      Professional Host
                    </div>
                    <h3 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tighter leading-tight">
                      Elevate your <br /> guest experience
                    </h3>
                    <p className="text-gray-500 font-medium text-lg leading-relaxed text-balance opacity-80">
                      Manage your properties with sophisticated tools and professional insights.
                    </p>
                  </div>
                  
                  <Link href="/owner/properties" className="mt-12">
                    <Button 
                      size="lg" 
                      className="w-full h-18 sm:h-20 rounded-2xl sm:rounded-[1.5rem] bg-[var(--primary)] text-white hover:bg-[var(--primary-dark)] font-black uppercase tracking-[0.2em] shadow-2xl shadow-[var(--primary)]/20 active:scale-95 group/btn"
                      rightIcon={<ArrowRight className="w-5 h-5 group-hover/btn:translate-x-2 transition-transform duration-500" />}
                    >
                      Manage Catalog
                    </Button>
                  </Link>
                </div>
              </Card>
            ) : (
              <Card padding="none" variant="default" className="rounded-[2.5rem] sm:rounded-[3.5rem] border-white/60 bg-gradient-to-br from-[var(--primary)] to-[var(--primary-dark)] text-white shadow-2xl shadow-[var(--primary)]/30 h-full overflow-hidden relative group">
                <div className="absolute inset-0">
                  <ImigongoPattern variant="dark" opacity={0.3} className="absolute inset-0 w-full h-full" />
                </div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl transition-transform group-hover:scale-110 duration-700" />
                
                <div className="p-10 sm:p-14 h-full flex flex-col justify-between min-h-[400px] relative z-10">
                  <div className="space-y-6">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-[0.3em] border border-white/10 shadow-lg">
                      <Sparkles className="w-3 h-3" />
                      Host Potential
                    </div>
                    <h3 className="text-3xl sm:text-4xl font-black tracking-tighter leading-tight text-white shadow-sm">
                      Monetize your <br /> extra space
                    </h3>
                    <p className="text-white/80 font-medium text-lg leading-relaxed text-balance">
                      Transition seamlessly to a host account and start earning on your terms today.
                    </p>
                  </div>
                  
                  <Link href="/become-a-host" className="mt-12">
                    <Button 
                      size="lg" 
                      className="w-full h-18 sm:h-20 rounded-2xl sm:rounded-[1.5rem] bg-[var(--accent)] text-[var(--primary)] hover:bg-[var(--accent-dark)] hover:text-white font-black uppercase tracking-[0.2em] shadow-2xl active:scale-95 border-none group/btn"
                      rightIcon={<ArrowRight className="w-5 h-5 group-hover/btn:translate-x-2 transition-transform duration-500" />}
                    >
                      Unlock Host Mode
                    </Button>
                  </Link>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
