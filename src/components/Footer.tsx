'use client';

import React from 'react';
import Link from 'next/link';
import { RotateCcw, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#14261D] text-[#D8E2DC] mt-auto border-t border-[#233B2E]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          
          {/* Brand & Purpose */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#234A36] flex items-center justify-center text-white">
                <RotateCcw className="w-5 h-5 text-[#34D399]" />
              </div>
              <span className="font-bold text-xl text-white tracking-tight">ReLoop</span>
            </div>
            <p className="text-sm text-[#A3B8AD] leading-relaxed max-w-md">
              Helping individuals make informed, practical decisions about unused electronics.
              We systematically compare reuse, repair, resale, and certified recycling without default bias.
            </p>
            <div className="flex items-center gap-2 text-xs text-[#8BA094] pt-2">
              <ShieldCheck className="w-4 h-4 text-[#34D399]" />
              <span>Independent Guidance • No Account Required • Privacy First</span>
            </div>
          </div>

          {/* Core Navigation */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-white mb-4">
              Core Pathways
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/assess" className="hover:text-white transition-colors">
                  Device Assessment
                </Link>
              </li>
              <li>
                <Link href="/prepare" className="hover:text-white transition-colors">
                  Preparation Assistant
                </Link>
              </li>
              <li>
                <Link href="/collection" className="hover:text-white transition-colors">
                  Collection Options
                </Link>
              </li>
              <li>
                <Link href="/journey" className="hover:text-white transition-colors">
                  My Journey Tracker
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  How It Works & Methodology
                </Link>
              </li>
            </ul>
          </div>

          {/* Transparent Principles */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-white mb-4">
              Methodology & Ethics
            </h3>
            <ul className="space-y-2.5 text-sm text-[#A3B8AD]">
              <li>Deterministic decision rules</li>
              <li>No manufactured carbon claims</li>
              <li>No false 100% data secure guarantees</li>
              <li>Honest sample provider labeling</li>
            </ul>
          </div>

        </div>

        {/* Regulatory & Advisory Notice Box */}
        <div className="mt-10 p-4 rounded-xl bg-[#0D1C14] border border-[#233B2E] text-xs text-[#95ACA0] leading-relaxed flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-[#FBBF24] shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-[#E2ECE6] mb-1">
              Important Guidance & Verification Notice
            </p>
            <p>
              ReLoop provides educational guidance and structured options. We do not provide financial appraisals,
              guarantee third-party service availability, or certify data destruction. Always confirm operating hours,
              accepted items, and policies directly with organizations before visiting, and follow official manufacturer
              instructions for data backup and hardware resets.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-[#233B2E] flex flex-col sm:flex-row items-center justify-between text-xs text-[#7F9589] gap-4">
          <p>© 2026 ReLoop AI. Built for the PromptWars Challenge.</p>
          <div className="flex items-center gap-6">
            <Link href="/about" className="hover:text-[#D8E2DC]">About Methodology</Link>
            <Link href="/prepare" className="hover:text-[#D8E2DC]">Data Safety Rules</Link>
            <Link href="/journey" className="hover:text-[#D8E2DC]">Manage Stored Journey</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
