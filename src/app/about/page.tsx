import { HomeHero } from "@/components/home/HomeHero";
import { SectionHeader } from "@/components/home/SectionHeader";
import { HomeFooter } from "@/components/home/HomeFooter";
import { ImigongoPattern } from "@/components/shared/imigongo-pattern";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[var(--warm-white)]">
      <section className="relative py-24 bg-[var(--primary-dark)] text-white overflow-hidden">
        <ImigongoPattern variant="dark" opacity={0.15} className="absolute inset-0 w-full h-full" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h1 className="text-5xl md:text-7xl font-black mb-8 tracking-tighter">
            Redefining <span className="text-[var(--accent)]">Hospitality</span> in the heart of Africa.
          </h1>
          <p className="text-xl md:text-2xl text-white/70 max-w-2xl leading-relaxed font-medium">
            Urugostay is more than just a booking platform. We're a community dedicated to connecting travelers with unique, local experiences across Rwanda and beyond.
          </p>
        </div>
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[var(--primary)]/20 to-transparent pointer-events-none" />
      </section>

      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div>
            <SectionHeader
              label="Our Story"
              title="From Kigali to the World"
              subtitle="Founded in 2024, Urugostay was born out of a passion for showing the authentic beauty of the Land of a Thousand Hills."
            />
            <div className="mt-8 space-y-6 text-gray-600 leading-loose text-lg font-medium">
              <p>
                We noticed a gap in the market: travelers wanted something more than a generic hotel room. They wanted a home. They wanted a neighbor. They wanted a nest.
              </p>
              <p>
                Today, we host thousands of unique properties, from boutique hotels in the heart of Kigali to serene villas on the shores of Lake Kivu. Each space is vetted for quality and character.
              </p>
            </div>
          </div>
          <div className="relative h-[500px] rounded-[40px] overflow-hidden shadow-2xl skew-y-1">
             <img 
              src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=1200" 
              alt="Luxury hotel"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          </div>
        </div>
      </section>

      <section className="py-24 bg-white border-y border-[var(--warm-gray)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { title: "Local First", desc: "We prioritize local hosts and businesses to ensure authentic experiences." },
              { title: "Premium Quality", desc: "Every property is hand-picked and verified for your comfort and safety." },
              { title: "Global Vision", desc: "While we start in Rwanda, our dream is to provide a nest for travelers worldwide." }
            ].map((stat, i) => (
              <div key={i} className="p-10 bg-[var(--warm-white)] rounded-3xl border border-[var(--warm-gray)] hover:shadow-xl transition-all duration-500 group">
                <h3 className="text-2xl font-black mb-4 group-hover:text-[var(--primary)] transition-colors">{stat.title}</h3>
                <p className="text-gray-500 font-medium leading-relaxed">{stat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <HomeFooter />
    </div>
  );
}
