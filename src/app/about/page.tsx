import React from 'react';
import Link from 'next/link';
import { 
  RotateCcw, 
  AlertTriangle, 
  ArrowRight
} from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16 space-y-12">
      
      {/* Page Header */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#143525]">
          <RotateCcw className="w-4 h-4 text-[#10B981]" />
          <span>About ReLoop AI & Methodology</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0F241A] tracking-tight">
          How ReLoop works and the principles behind it
        </h1>
        <p className="text-base text-[#4E6255] leading-relaxed max-w-2xl">
          A transparent look at the electronics transition dilemma, our deterministic decision engine,
          the boundaries of AI assistance, and our strict commitment to truthful communication.
        </p>
      </div>

      {/* 1. The Problem ReLoop Addresses */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8E6DC] shadow-sm space-y-4">
        <h2 className="text-xl font-bold text-[#0F241A] flex items-center gap-2.5">
          <span className="w-7 h-7 rounded-full bg-[#143525] text-white flex items-center justify-center text-xs font-bold">1</span>
          <span>The Problem ReLoop Addresses</span>
        </h2>
        <div className="text-xs sm:text-sm text-[#3D5245] leading-relaxed space-y-3">
          <p>
            Millions of functional or repairable electronic devices sit idle in household drawers and storage boxes.
            People often keep unused devices not out of apathy, but because the next step is fraught with uncertainty:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-[#52635A]">
            <li><strong>Unclear trade-offs:</strong> Is it worth fixing a cracked screen, or will repair labor exceed the device&apos;s remaining market value?</li>
            <li><strong>Data privacy anxiety:</strong> Fear that personal photos, banking sessions, or cloud accounts might linger on hardware after disposal.</li>
            <li><strong>Logistical friction:</strong> Unclear local drop-off rules, confusing activation lock requirements, and untrustworthy trade-in quotes.</li>
          </ul>
          <p>
            When faced with this friction, devices are neither reused nor recycled—they languish until their batteries degrade,
            rendering them permanently obsolete.
          </p>
        </div>
      </section>

      {/* 2. Why All Pathways Are Considered */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8E6DC] shadow-sm space-y-4">
        <h2 className="text-xl font-bold text-[#0F241A] flex items-center gap-2.5">
          <span className="w-7 h-7 rounded-full bg-[#143525] text-white flex items-center justify-center text-xs font-bold">2</span>
          <span>The Electronics Hierarchy: Why We Do Not Default to Recycling</span>
        </h2>
        <div className="text-xs sm:text-sm text-[#3D5245] leading-relaxed space-y-3">
          <p>
            A common misconception in sustainability campaigns is that recycling should always be the immediate answer.
            In reality, the electronics waste hierarchy prioritizes:
          </p>
          <div className="p-4 rounded-2xl bg-[#FAF9F5] border border-[#E8E6DC] space-y-2 text-xs">
            <div className="flex items-center gap-2 font-bold text-[#143525]">
              <span className="px-2 py-0.5 rounded bg-[#E8F5E9]">Level 1</span> Continued Use &amp; Domestic Reuse (Zero manufacturing footprint)
            </div>
            <div className="flex items-center gap-2 font-bold text-[#143525]">
              <span className="px-2 py-0.5 rounded bg-[#E8F5E9]">Level 2</span> Direct Resale or Donation (Extends active functional lifespan)
            </div>
            <div className="flex items-center gap-2 font-bold text-[#143525]">
              <span className="px-2 py-0.5 rounded bg-[#E8F5E9]">Level 3</span> Targeted Repair &amp; Refurbishment (Economical restoration)
            </div>
            <div className="flex items-center gap-2 font-bold text-[#854D0E]">
              <span className="px-2 py-0.5 rounded bg-[#FEF3C7]">Level 4</span> Certified Material Recycling (Raw mineral &amp; heavy metal reclamation)
            </div>
          </div>
          <p>
            Up to 80% of a digital device&apos;s lifetime carbon footprint occurs during manufacturing, mining, and chip fabrication.
            Shredding and smelting a fully functioning iPhone or laptop destroys that embedded energy. ReLoop evaluates reuse and resale first,
            reserving recycling for non-functional or safety-compromised units.
          </p>
        </div>
      </section>

      {/* 3. How the Recommendation Engine Works */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8E6DC] shadow-sm space-y-4">
        <h2 className="text-xl font-bold text-[#0F241A] flex items-center gap-2.5">
          <span className="w-7 h-7 rounded-full bg-[#143525] text-white flex items-center justify-center text-xs font-bold">3</span>
          <span>Deterministic Decision Logic vs. AI Synthesis</span>
        </h2>
        <div className="text-xs sm:text-sm text-[#3D5245] leading-relaxed space-y-3">
          <p>
            ReLoop separates core decision rules from language synthesis:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div className="p-4 rounded-2xl bg-[#F7FBF9] border border-[#C8E6C9] space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#143525]">
                Deterministic Rule Engine (The Core)
              </span>
              <p className="text-xs text-[#2C3E35]">
                Hardcoded in TypeScript. It maps device category, physical operating condition, specific faults (like swollen batteries),
                and user priorities to vetted pathway rules. It never hallucinates providers or ignores safety flags.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAF9F5] border border-[#E0DED4] space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#6B7D72]">
                Server-Side AI Synthesis (The Explainer)
              </span>
              <p className="text-xs text-[#52635A]">
                When requested, server-side models format a conversational briefing. If an AI API key is missing or offline,
                our deterministic fallback engine produces equivalent verified text without disruption.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Truth in Data & Service Limitations */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8E6DC] shadow-sm space-y-4">
        <h2 className="text-xl font-bold text-[#0F241A] flex items-center gap-2.5">
          <span className="w-7 h-7 rounded-full bg-[#143525] text-white flex items-center justify-center text-xs font-bold">4</span>
          <span>Data Limitations &amp; Ethical Disclosures</span>
        </h2>
        <div className="text-xs sm:text-sm text-[#3D5245] leading-relaxed space-y-3">
          <div className="p-4 rounded-2xl bg-[#FFFBEB] border border-[#FDE68A] text-xs text-[#92400E] space-y-2">
            <p className="font-bold flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-[#92400E]" />
              Our Strict Commitments:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>No manufactured statistics:</strong> We do not claim ReLoop has already saved 50,000 kg of CO2 or diverted 10,000 devices.</li>
              <li><strong>No fake reviews:</strong> You will not find fictional user testimonials or made-up corporate partner badges on this platform.</li>
              <li><strong>No false 100% security guarantees:</strong> We explicitly distinguish self-guided review from independent forensic data destruction.</li>
              <li><strong>Honest directory labeling:</strong> Sample provider entries are clearly declared as demonstration records rather than active real-time booking integrations.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* 5. How Future Impact Could Be Evaluated */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8E6DC] shadow-sm space-y-4">
        <h2 className="text-xl font-bold text-[#0F241A] flex items-center gap-2.5">
          <span className="w-7 h-7 rounded-full bg-[#143525] text-white flex items-center justify-center text-xs font-bold">5</span>
          <span>How Future Impact Could Be Evaluated</span>
        </h2>
        <div className="text-xs sm:text-sm text-[#3D5245] leading-relaxed space-y-3">
          <p>
            If ReLoop were deployed at scale, genuine environmental and social impact should be measured through:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-[#52635A]">
            <li><strong>Verified Chain-of-Custody:</strong> Tracking API receipts from certified R2 or e-Stewards recyclers showing actual metric tonnage processed.</li>
            <li><strong>Verified Device Life Extension:</strong> Follow-up telemetry or refurbisher intake receipts confirming repaired devices remained active 12+ months longer.</li>
            <li><strong>Digital Inclusion Metrics:</strong> Documenting vetted hardware deliveries to non-profit educational partners with recipient verification.</li>
          </ul>
        </div>
      </section>

      {/* CTA Bottom Card */}
      <div className="p-8 rounded-3xl bg-[#143525] text-white text-center space-y-4">
        <h3 className="text-2xl font-bold">Ready to find your device&apos;s next step?</h3>
        <p className="text-xs sm:text-sm text-[#C2D6CB] max-w-md mx-auto">
          Take 2 minutes to assess your unused device and compare your viable options objectively.
        </p>
        <div className="pt-2">
          <Link
            href="/assess"
            className="inline-flex items-center gap-2 px-7 py-3 rounded-xl text-sm font-bold bg-white text-[#143525] hover:bg-[#F5F4EF] shadow transition-all"
          >
            <span>Start Device Assessment</span>
            <ArrowRight className="w-4 h-4 text-[#10B981]" />
          </Link>
        </div>
      </div>

    </div>
  );
}
