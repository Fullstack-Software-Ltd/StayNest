import { Suspense } from 'react';
import { SearchBar } from "@/components/search/SearchBar";

export default function Hero() {
  return (
    <section className="relative py-24 md:py-32 overflow-hidden bg-white">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[500px] h-[500px] bg-[var(--primary)]/5 rounded-full blur-3xl opacity-50" />
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[var(--accent)]/5 rounded-full blur-3xl opacity-30" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center space-x-2 bg-[var(--primary)]/5 px-4 py-2 rounded-full mb-8 border border-[var(--primary)]/10">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--accent)] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--accent)]"></span>
          </span>
          <span className="text-xs font-bold text-[var(--primary)] uppercase tracking-widest">New properties added daily</span>
        </div>

        <h1 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tight mb-6 leading-[1.1]">
          Urugo<span className="text-[var(--accent)]">stay</span> <br className="hidden md:block" /> anywhere in the world.
        </h1>
        <p className="max-w-2xl mx-auto text-xl text-gray-500 mb-16 leading-relaxed">
          Discover unique accommodations for every trip, from cozy cabins to luxury resorts. Your next adventure begins here.
        </p>
        
        <div className="z-10 relative">
          <Suspense fallback={null}>
            <SearchBar />
          </Suspense>
        </div>
        
        <div className="mt-20 flex flex-wrap justify-center gap-12 opacity-40 grayscale group-hover:grayscale-0 transition-all duration-500">
          <div className="flex flex-col items-center">
            <span className="text-2xl font-black text-gray-900">2.5M+</span>
            <span className="text-[10px] font-bold uppercase tracking-widest">Properties</span>
          </div>
          <div className="flex flex-col items-center border-l border-gray-200 pl-12">
            <span className="text-2xl font-black text-gray-900">500k+</span>
            <span className="text-[10px] font-bold uppercase tracking-widest">Verified Reviews</span>
          </div>
          <div className="flex flex-col items-center border-l border-gray-200 pl-12">
            <span className="text-2xl font-black text-gray-900">24/7</span>
            <span className="text-[10px] font-bold uppercase tracking-widest">Expert Support</span>
          </div>
        </div>
      </div>
    </section>
  )
}
