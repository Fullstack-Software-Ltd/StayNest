'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useSettings } from '@/context/SettingsContext'
import { motion } from 'framer-motion'

export function CTASection() {
  const { t } = useSettings()

  return (
    <section className="relative w-full h-[450px] sm:h-[550px] rounded-2xl overflow-hidden group">
      {/* Heavy Atmospheric Background Image */}
      <Image
        src="https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=1600&q=90" 
        alt="Rwandan Mist"
        fill
        className="object-cover group-hover:scale-105 transition-transform duration-[3000ms] ease-out"
      />
      
      {/* Dark Cinematic Overlay */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

      <div className="relative z-10 h-full max-width-luxury px-6 sm:px-12 lg:px-20 flex flex-col items-center justify-center text-center">
        
        <motion.div 
          className="max-w-2xl"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          <h2 className="text-4xl sm:text-5xl lg:text-7xl font-serif text-white leading-[0.9] mb-6 italic">
            Ready to explore <br /> the mist?
          </h2>
          
          <p className="text-white/80 text-sm sm:text-base leading-relaxed mb-10 font-medium max-w-lg mx-auto">
            Join our community of hosts and travelers discovering the soul of Rwanda.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="w-full sm:w-auto px-10 py-4 bg-white text-[var(--luxury-green)] font-black rounded-full transition-all duration-300 hover:scale-105 text-[10px] uppercase tracking-[0.3em]"
            >
              Start journey
            </Link>

            <Link
              href="/contact"
              className="w-full sm:w-auto px-10 py-4 bg-[var(--luxury-green)]/40 backdrop-blur-md border border-white/20 text-white font-black rounded-full transition-all duration-300 hover:bg-[var(--luxury-gold)] hover:text-[var(--luxury-green)] text-[10px] uppercase tracking-[0.3em]"
            >
              Contact
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
