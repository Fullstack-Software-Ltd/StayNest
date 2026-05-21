import Link from 'next/link'
import { PlusCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export function PropertyEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center p-12 bg-white border-2 border-dashed border-gray-200 rounded-2xl text-center">
      <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-6">
        <PlusCircle className="w-8 h-8" />
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">No properties yet</h3>
      <p className="text-gray-500 max-w-sm mb-8">
        Ready to start hosting? Create your first property listing and reach travelers from around the world.
      </p>
      <Link href="/owner/properties/new">
        <Button size="lg">Add Your First Property</Button>
      </Link>
    </div>
  )
}
