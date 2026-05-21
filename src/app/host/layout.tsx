import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function HostLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col">
      {/* Minimal Header for Onboarding */}
      <header className="bg-white border-b border-gray-100 py-4 px-6 md:px-12 flex items-center justify-between sticky top-0 z-50">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-2xl font-black tracking-tight text-[var(--primary)]">
            Urugo<span className="text-[var(--accent)]">stay</span>
          </span>
        </Link>
        <Link 
          href="/" 
          className="text-sm font-bold text-gray-500 hover:text-gray-900 flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Exit
        </Link>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col">
        {children}
      </main>
    </div>
  )
}
