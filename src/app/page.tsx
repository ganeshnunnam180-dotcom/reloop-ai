import React from 'react';
import Link from 'next/link';
import { 
  ArrowRight, 
  Smartphone, 
  Laptop, 
  Tablet, 
  Tv, 
  Cpu, 
  RotateCcw, 
  CheckCircle2, 
  ShieldCheck, 
  Compass, 
  Sparkles, 
  Wrench, 
  Coins, 
  Heart, 
  Recycle, 
  HelpCircle,
  AlertCircle
} from 'lucide-react';

export default function HomePage() {
  const categories = [
    {
      id: 'smartphone',
      label: 'Smartphone',
      desc: 'iPhones, Android phones, and feature phones',
      icon: Smartphone,
      accent: 'bg-[#E8F5E9] text-[#143525]',
      status: 'Full Guidance',
    },
    {
      id: 'laptop',
      label: 'Laptop / Computer',
      desc: 'MacBooks, Windows laptops, and desktops',
      icon: Laptop,
      accent: 'bg-[#E8F5E9] text-[#143525]',
      status: 'Full Guidance',
    },
    {
      id: 'tablet',
      label: 'Tablet',
      desc: 'iPads, Android tablets, and e-readers',
      icon: Tablet,
      accent: 'bg-[#F4F3EF] text-[#2C3E35]',
      status: 'Standard Guidance',
    },
    {
      id: 'tv_monitor',
      label: 'Television / Monitor',
      desc: 'LCD, LED, OLED, and computer monitors',
      icon: Tv,
      accent: 'bg-[#F4F3EF] text-[#2C3E35]',
      status: 'Standard Guidance',
    },
    {
      id: 'other',
      label: 'Other Electronics',
      desc: 'Audio gear, consoles, cables, and wearables',
      icon: Cpu,
      accent: 'bg-[#F4F3EF] text-[#2C3E35]',
      status: 'General Guidance',
    },
  ];

  const pathways = [
    {
      title: 'Resale & Trade-In',
      tagline: 'Recover fair monetary return',
      icon: Coins,
      idealFor: 'Working devices under 4-5 years old with intact screens',
      tradeoff: 'Requires photographing, testing, or waiting for courier appraisal',
    },
    {
      title: 'Targeted Repair',
      tagline: 'Fix isolated faults economically',
      icon: Wrench,
      idealFor: 'Recent hardware with swappable battery, cracked lens, or port wear',
      tradeoff: 'Cost risk if motherboard or proprietary parts exceed device worth',
    },
    {
      title: 'Charitable Donation',
      tagline: 'Empower students & non-profits',
      icon: Heart,
      idealFor: 'Functional electronics ready for software reset with working charger',
      tradeoff: 'Most organizations cannot accept broken or activation-locked devices',
    },
    {
      title: 'Repurpose at Home',
      tagline: 'New dedicated household roles',
      icon: RotateCcw,
      idealFor: 'Stationary tasks (smart speaker, webcam, media server, alarm)',
      tradeoff: 'Requires initial setup and keeps hardware in the household',
    },
    {
      title: 'Responsible Recycling',
      tagline: 'Certified mineral & toxics recovery',
      icon: Recycle,
      idealFor: 'Non-functional hardware, damaged lithium cells, or obsolete gear',
      tradeoff: 'Permanently concludes product life without monetary compensation',
    },
  ];

  return (
    <div className="space-y-16 lg:space-y-24 pb-20">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 lg:pt-20 lg:pb-24">
        {/* Subtle background ambient styling */}
        <div className="absolute inset-0 pointer-events-none opacity-40">
          <div className="absolute -top-40 right-1/4 w-96 h-96 rounded-full bg-[#E2F0D9] blur-3xl" />
          <div className="absolute top-20 -left-20 w-80 h-80 rounded-full bg-[#E8E6DC] blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            
            {/* Pill tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EBF5EE] border border-[#C8E6C9] text-xs font-semibold text-[#143525]">
              <Sparkles className="w-3.5 h-3.5 text-[#10B981]" />
              <span>Honest, Multi-Pathway Electronic Transitions</span>
            </div>

            {/* Required Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#0F241A] leading-[1.12]">
              Your unused electronics deserve a better next step.
            </h1>

            {/* Required Supporting Text */}
            <p className="text-lg sm:text-xl text-[#3D5245] leading-relaxed max-w-2xl mx-auto">
              Find the right path for your old devices. Explore reuse, repair, resale, and responsible recycling with personalised guidance.
            </p>

            {/* Primary & Secondary CTAs */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/assess"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl text-base font-semibold bg-[#143525] text-white hover:bg-[#1B4933] shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5"
              >
                <span>Find My Device&apos;s Next Step</span>
                <ArrowRight className="w-5 h-5 text-[#34D399]" />
              </Link>
              
              <Link
                href="/about"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl text-base font-semibold bg-white text-[#143525] hover:bg-[#F5F4EF] border border-[#D7D4C5] shadow-sm transition-all duration-200"
              >
                <span>How It Works</span>
              </Link>
            </div>

            {/* Trust disclaimer badge */}
            <p className="text-xs text-[#6B7D72] pt-2">
              No account required • Deterministic logic with optional AI • We never default blindly to recycling
            </p>
          </div>
        </div>
      </section>

      {/* Advisory Guidance Notice */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-[#F4F3EF] border border-[#E0DED4] p-5 sm:p-6 flex flex-col sm:flex-row items-start gap-4 shadow-sm">
          <div className="p-2.5 rounded-xl bg-white text-[#143525] border border-[#D7D4C5] shrink-0">
            <AlertCircle className="w-5 h-5 text-[#143525]" />
          </div>
          <div className="space-y-1.5 text-sm text-[#3D5245]">
            <h2 className="text-base font-bold text-[#0F241A]">
              Guidance & Verification Notice
            </h2>
            <p className="leading-relaxed">
              Recommendations generated by ReLoop represent advisory guidance based on your reported device condition and priorities.
              Commercial trade-in values, charitable donation intake criteria, and local collection facility opening hours
              fluctuate and must be independently verified with respective providers before traveling or transferring hardware.
            </p>
          </div>
        </div>
      </section>

      {/* Three Core Benefits Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#143525] mb-2">
            Why ReLoop
          </h2>
          <p className="text-2xl sm:text-3xl font-bold text-[#0F241A] tracking-tight">
            Designed to bridge the gap between drawers and practical next steps
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Benefit 1 */}
          <div className="bg-white rounded-2xl p-7 border border-[#E8E6DC] shadow-sm hover:shadow-md transition-shadow space-y-4">
            <div className="w-12 h-12 rounded-xl bg-[#E8F5E9] flex items-center justify-center text-[#143525]">
              <Compass className="w-6 h-6 text-[#143525]" />
            </div>
            <h3 className="text-xl font-bold text-[#0F241A]">
              1. Make an informed decision
            </h3>
            <p className="text-sm text-[#4E6255] leading-relaxed">
              Electronics decisions aren&apos;t one-size-fits-all. We systematically weigh repair feasibility,
              resale liquidity, domestic reuse, and recycling without pushing premature destruction.
            </p>
          </div>

          {/* Benefit 2 */}
          <div className="bg-white rounded-2xl p-7 border border-[#E8E6DC] shadow-sm hover:shadow-md transition-shadow space-y-4">
            <div className="w-12 h-12 rounded-xl bg-[#E8F5E9] flex items-center justify-center text-[#143525]">
              <ShieldCheck className="w-6 h-6 text-[#143525]" />
            </div>
            <h3 className="text-xl font-bold text-[#0F241A]">
              2. Prepare your device responsibly
            </h3>
            <p className="text-sm text-[#4E6255] leading-relaxed">
              Step-by-step guidance for verifying data backups, de-linking cloud accounts (Apple iCloud, Google FRP),
              sanitizing local storage, and removing physical SIM/microSD cards.
            </p>
          </div>

          {/* Benefit 3 */}
          <div className="bg-white rounded-2xl p-7 border border-[#E8E6DC] shadow-sm hover:shadow-md transition-shadow space-y-4">
            <div className="w-12 h-12 rounded-xl bg-[#E8F5E9] flex items-center justify-center text-[#143525]">
              <CheckCircle2 className="w-6 h-6 text-[#143525]" />
            </div>
            <h3 className="text-xl font-bold text-[#0F241A]">
              3. Identify a practical next step
            </h3>
            <p className="text-sm text-[#4E6255] leading-relaxed">
              Explore filterable collection models—including municipal hazardous drop-offs, mail-in kits,
              retail trade-in desks, and community repair initiatives with clear intake checklists.
            </p>
          </div>

        </div>
      </section>

      {/* Select Device Category Quick-Start */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#143525] rounded-3xl p-8 sm:p-12 text-white shadow-xl">
          <div className="max-w-2xl mb-8 space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#34D399]">
              Start Your Assessment
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              What device is sitting in your drawer?
            </h2>
            <p className="text-sm sm:text-base text-[#C2D6CB]">
              Select a category below to launch our guided 2-minute assessment. We prioritize smartphones and laptops for detailed diagnostic depth.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <Link
                  key={cat.id}
                  href={`/assess?category=${cat.id}`}
                  className="group bg-[#1C4532] hover:bg-[#23533D] rounded-2xl p-5 border border-[#2B6047] transition-all duration-200 flex flex-col justify-between"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="p-3 rounded-xl bg-[#143525] text-[#34D399] group-hover:scale-105 transition-transform">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-[#143525] text-[#A3C8B5] border border-[#2B6047]">
                      {cat.status}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-white group-hover:text-[#34D399] transition-colors flex items-center justify-between">
                      <span>{cat.label}</span>
                      <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-1" />
                    </h3>
                    <p className="text-xs text-[#A3C8B5] mt-1">
                      {cat.desc}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pathways Comparison Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#143525]">
            The 5 Decision Pathways
          </h2>
          <p className="text-2xl sm:text-3xl font-bold text-[#0F241A] tracking-tight">
            Every device has trade-offs. Here is how we evaluate them.
          </p>
          <p className="text-sm text-[#4E6255]">
            We never assume recycling is the default when reuse or repair is practical and safe.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pathways.map((path, idx) => {
            const Icon = path.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl p-6 border border-[#E8E6DC] shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2.5 rounded-xl bg-[#E8F5E9] text-[#143525]">
                      <Icon className="w-5 h-5 text-[#143525]" />
                    </div>
                    <div>
                      <h3 className="font-bold text-base text-[#0F241A]">{path.title}</h3>
                      <p className="text-xs text-[#6B7D72]">{path.tagline}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2.5 mt-4 text-xs">
                    <div>
                      <span className="font-semibold text-[#143525]">Ideal for: </span>
                      <span className="text-[#3D5245]">{path.idealFor}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-[#854D0E]">Key trade-off: </span>
                      <span className="text-[#524430]">{path.tradeoff}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-[#F0EFEA]">
                  <Link
                    href={`/assess`}
                    className="text-xs font-semibold text-[#143525] hover:text-[#1B4933] inline-flex items-center gap-1.5"
                  >
                    <span>Assess your device for this path</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#10B981]" />
                  </Link>
                </div>
              </div>
            );
          })}

          {/* Quick Info Box */}
          <div className="bg-[#FAF9F5] rounded-2xl p-6 border border-dashed border-[#D7D4C5] flex flex-col justify-between">
            <div>
              <div className="p-2.5 rounded-xl bg-[#E8E6DC] text-[#143525] w-fit mb-3">
                <HelpCircle className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-[#0F241A]">Unsure about condition?</h3>
              <p className="text-xs text-[#4E6255] mt-2 leading-relaxed">
                You do not need to know technical specs or exact fault codes. Our assessment accommodates &ldquo;Unsure&rdquo;
                at every step and helps you run safe diagnostic checks at home.
              </p>
            </div>
            <div className="mt-5 pt-4">
              <Link
                href="/assess"
                className="w-full inline-flex items-center justify-center py-2.5 px-4 rounded-xl text-xs font-bold bg-[#143525] text-white hover:bg-[#1B4933]"
              >
                Start Guided Assessment
              </Link>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}
