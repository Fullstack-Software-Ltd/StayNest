import { getPlatformProperties } from '@/lib/admin/adminActions'
import { PropertyApprovalCard } from '@/components/admin/property-approval-card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs'
import { Search, Plus } from 'lucide-react'
import Link from 'next/link'

interface PageProps {
  searchParams: Promise<{ status?: string }>
}

export default async function AdminPropertiesPage({ searchParams }: PageProps) {
  const { status = 'pending' } = await searchParams
  const properties = await getPlatformProperties(status)

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tighter">Properties</h1>
          <p className="text-gray-500 font-medium mt-1">Manage and moderate platform listings.</p>
        </div>
        <Link href="/owner/properties/new">
          <button className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-2xl font-bold hover:bg-black text-sm shadow-xl shadow-black/5 transition-all active:scale-95">
            <Plus className="w-4 h-4" />
            Add Property
          </button>
        </Link>
      </div>

      <Tabs defaultValue={status} className="w-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <TabsList className="bg-gray-100/50 p-1 rounded-2xl border border-gray-100">
            <TabsTrigger value="pending" href="/admin/properties?status=pending" className="px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:text-[var(--primary)] data-[state=active]:shadow-sm transition-all">
              Pending
            </TabsTrigger>
            <TabsTrigger value="approved" href="/admin/properties?status=approved" className="px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:text-[var(--primary)] data-[state=active]:shadow-sm transition-all">
              Approved
            </TabsTrigger>
            <TabsTrigger value="rejected" href="/admin/properties?status=rejected" className="px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:text-[var(--primary)] data-[state=active]:shadow-sm transition-all">
              Rejected
            </TabsTrigger>
            <TabsTrigger value="all" href="/admin/properties?status=all" className="px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:text-[var(--primary)] data-[state=active]:shadow-sm transition-all">
              All
            </TabsTrigger>
          </TabsList>

          <div className="relative group max-w-sm w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[var(--primary)] transition-colors" />
            <input 
              type="text"
              placeholder="Search by name or city..."
              className="w-full pl-11 pr-4 py-3 rounded-2xl border border-gray-100 bg-white text-sm font-medium focus:outline-none focus:ring-4 focus:ring-[var(--primary)]/5 focus:border-[var(--primary)]/20 transition-all"
            />
          </div>
        </div>

        <TabsContent value={status} className="space-y-6">
          {properties && properties.length > 0 ? (
            <div className="grid grid-cols-1 gap-6">
              {properties.map((property) => (
                <PropertyApprovalCard 
                  key={property.id} 
                  property={property} 
                />
              ))}
            </div>
          ) : (
            <div className="py-32 text-center bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-100">
               <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                  <Search className="w-10 h-10 text-gray-200" />
               </div>
               <h3 className="text-xl font-bold text-gray-900 mb-2">No {status} properties</h3>
               <p className="text-gray-500 font-medium max-w-xs mx-auto">There are currently no listings that match the "{status}" criteria.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
