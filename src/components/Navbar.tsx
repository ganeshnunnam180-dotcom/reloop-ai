'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  RotateCcw, 
  Menu, 
  X, 
  Sparkles, 
  Compass, 
  ShieldCheck, 
  MapPin, 
  Info 
} from 'lucide-react';
import { loadJourney } from '@/lib/journeyStorage';

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hasActiveJourney, setHasActiveJourney] = useState(false);
  const [journeyStage, setJourneyStage] = useState(1);

  useEffect(() => {
    const journey = loadJourney();
    if (journey.assessment) {
      setHasActiveJourney(true);
      setJourneyStage(journey.currentStage);
    }
  }, [pathname]);

  const navLinks = [
    { href: '/assess', label: 'Assessment', icon: Sparkles },
    { href: '/prepare', label: 'Preparation', icon: ShieldCheck },
    { href: '/collection', label: 'Collection Options', icon: MapPin },
    { href: '/journey', label: 'My Journey', icon: Compass, badge: hasActiveJourney ? `Stage ${journeyStage}` : undefined },
    { href: '/about', label: 'How It Works', icon: Info },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#FBFBFA]/95 backdrop-blur-md border-b border-[#E8E6DC]/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          
          {/* Logo & Brand */}
          <Link 
            href="/" 
            className="flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#143525] rounded-lg p-1"
            aria-label="ReLoop Home"
          >
            <div className="w-10 h-10 rounded-xl bg-[#143525] flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-105 duration-200">
              <RotateCcw className="w-5 h-5 text-[#34D399]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-xl tracking-tight text-[#0F241A]">ReLoop</span>
                <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#E8F5E9] text-[#143525] border border-[#C8E6C9]">
                  AI
                </span>
              </div>
              <p className="text-xs text-[#52635A] font-medium hidden sm:block">
                Informed electronics transitions
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-[#143525] text-white shadow-sm'
                      : 'text-[#2C3E35] hover:text-[#0F241A] hover:bg-[#F0EFE9]'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#34D399]' : 'text-[#6B7D72]'}`} />
                  <span>{link.label}</span>
                  {link.badge && (
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                      isActive ? 'bg-[#34D399] text-[#0F241A]' : 'bg-[#E8F5E9] text-[#143525]'
                    }`}>
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Action Button & Mobile Menu Toggle */}
          <div className="flex items-center gap-3">
            <Link
              href="/assess"
              className="hidden lg:inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-[#143525] text-white hover:bg-[#1B4933] shadow-sm hover:shadow transition-all duration-150"
            >
              <span>Assess a Device</span>
              <Sparkles className="w-4 h-4 text-[#34D399]" />
            </Link>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-[#2C3E35] hover:bg-[#F0EFE9] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#143525]"
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#E8E6DC] bg-[#FBFBFA] px-4 pt-2 pb-6 space-y-2">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                  isActive
                    ? 'bg-[#143525] text-white'
                    : 'text-[#2C3E35] hover:bg-[#F0EFE9]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 ${isActive ? 'text-[#34D399]' : 'text-[#6B7D72]'}`} />
                  <span>{link.label}</span>
                </div>
                {link.badge && (
                  <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                    isActive ? 'bg-[#34D399] text-[#0F241A]' : 'bg-[#E8F5E9] text-[#143525]'
                  }`}>
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}
          <div className="pt-2">
            <Link
              href="/assess"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-base font-semibold bg-[#143525] text-white hover:bg-[#1B4933] shadow-sm"
            >
              <span>Start Assessment</span>
              <Sparkles className="w-4 h-4 text-[#34D399]" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
