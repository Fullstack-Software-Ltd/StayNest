import { LegalLayout } from "@/components/shared/LegalLayout";
import { ShieldCheck, Lock, LifeBuoy } from 'lucide-react'

export default function SafetyPage() {
  return (
    <LegalLayout 
      title="Safety Information" 
      subtitle="Your safety is our priority. We're committed to ensuring your experience is as secure as possible."
    >
      <div className="space-y-12">
        <section className="space-y-6">
          <div className="flex items-center gap-3 text-[var(--accent)] mb-2">
            <ShieldCheck className="w-6 h-6" />
            <h2 className="text-2xl font-black tracking-tight mb-0">The UrugoStay Verification Standard</h2>
          </div>
          <p>
            Unlike open marketplaces, UrugoStay maintains an elite standard for every property. Our "Verified" badge is only awarded after a manual 50-point inspection involving security, cleanliness, and host responsiveness. When you see the badge, you're booking with absolute certainty.
          </p>
        </section>

        <section className="space-y-6 pt-8 border-t border-gray-100">
          <div className="flex items-center gap-3 text-[var(--primary)] mb-2">
            <Lock className="w-6 h-6" />
            <h2 className="text-2xl font-black tracking-tight mb-0">Architectural Payment Security</h2>
          </div>
          <p>
            We utilize high-end, bank-grade encryption for every transaction. Payments are held in a secure escrow system and only released to the host after a successful check-in. This protects both guests and hosts from fraudulent activity and ensures a friction-free financial experience.
          </p>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <li className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl font-bold text-sm">
               <div className="w-2 h-2 rounded-full bg-emerald-500" />
               PCI-DSS Level 1 Compliant
            </li>
            <li className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl font-bold text-sm">
               <div className="w-2 h-2 rounded-full bg-emerald-500" />
               End-to-End Escrow Protection
            </li>
          </ul>
        </section>

        <section className="space-y-6 pt-8 border-t border-gray-100">
          <div className="flex items-center gap-3 text-amber-600 mb-2">
            <LifeBuoy className="w-6 h-6" />
            <h2 className="text-2xl font-black tracking-tight mb-0">24/7 Priority Support</h2>
          </div>
          <p>
            Safety doesn't sleep. Our dedicated support team is stationed in Kigali and available 24/7 to assist with any on-site issues, check-in friction, or travel emergencies. We pride ourselves on a sub-10-minute response time for all active bookings.
          </p>
        </section>

        <section className="p-10 rounded-[2.5rem] bg-[var(--primary)] text-white shadow-xl shadow-[var(--primary)]/10">
           <h3 className="text-2xl font-black tracking-tight mb-4">Travel with Peace of Mind</h3>
           <p className="text-white/70 font-medium mb-8">
             Your experience in Rwanda should be defined by beauty and hospitality, not worry. We've built the systems so you can focus on the journey.
           </p>
           <button className="px-8 py-4 bg-[var(--accent)] text-[var(--primary)] rounded-xl font-black uppercase tracking-widest text-xs hover:bg-[var(--accent-light)] transition-all active:scale-[0.98]">
             Connect with Support
           </button>
        </section>
      </div>
    </LegalLayout>
  );
}
