'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'

export function AtmosphereSection() {
  return (
    <section className="py-16 sm:py-20 bg-[var(--luxury-cream)] overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-6 sm:px-12 lg:px-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* Left: Atmospheric Image - More Compact */}
          <motion.div 
            className="relative aspect-[16/9] rounded-2xl overflow-hidden shadow-2xl"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <Image
              src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1600&q=90"
              alt="Luxury lodge interior"
              fill
              className="object-cover"
            />
          </motion.div>

          {/* Right: Storytelling & Action - Tightened */}
          <motion.div 
            className="space-y-6 lg:space-y-8"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="space-y-4">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl text-[var(--luxury-green)] leading-[1.1] font-serif italic">
                Curating Atmosphere <br /> Above All Else.
              </h2>
              <div className="w-12 h-0.5 bg-[var(--luxury-gold)]" />
            </div>

            <div className="max-w-lg">
              <p className="text-sm sm:text-base text-gray-500 leading-relaxed font-medium">
                We believe travel is a narrative. UrugoStay doesn’t just provide a bed; we offer an anchor to the Rwandan spirit. Each residence is hand-vetted for its connection to landscape and the art of stillness.
              </p>
            </div>

            {/* Stats / Highlights - Subtly integrated */}
            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-gray-100">
              <div>
                <p className="text-xl font-serif text-[var(--luxury-green)]">24/7</p>
                <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Concierge</p>
              </div>
              <div>
                <p className="text-xl font-serif text-[var(--luxury-green)]">100%</p>
                <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Vetted</p>
              </div>
              <div>
                <p className="text-xl font-serif text-[var(--luxury-green)]">Zero</p>
                <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Placeholders</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
