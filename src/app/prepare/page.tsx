'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  ExternalLink, 
  Smartphone, 
  Laptop, 
  Tablet, 
  ArrowRight, 
  Check, 
  Layers
} from 'lucide-react';
import { PREPARATION_STEPS } from '@/data/preparationSteps';
import { DeviceCategory } from '@/types';
import { loadJourney, toggleReviewedChecklistId } from '@/lib/journeyStorage';

export default function PreparePage() {
  const [selectedCategory, setSelectedCategory] = useState<DeviceCategory | 'all'>('smartphone');
  const [reviewedIds, setReviewedIds] = useState<string[]>([]);
  const [deviceName, setDeviceName] = useState<string | null>(null);

  useEffect(() => {
    const journey = loadJourney();
    if (journey.reviewedChecklistIds) {
      setReviewedIds(journey.reviewedChecklistIds);
    }
    if (journey.assessment) {
      setSelectedCategory(journey.assessment.category);
      if (journey.assessment.brandModel) {
        setDeviceName(journey.assessment.brandModel);
      }
    }
  }, []);

  const handleToggle = (stepId: string) => {
    const updatedJourney = toggleReviewedChecklistId(stepId);
    setReviewedIds(updatedJourney.reviewedChecklistIds);
  };

  const filteredSteps = PREPARATION_STEPS.filter((step) => {
    if (selectedCategory === 'all') return true;
    return step.applicableDevices.includes(selectedCategory);
  });

  const totalSteps = filteredSteps.length;
  const completedCount = filteredSteps.filter((s) => reviewedIds.includes(s.id)).length;
  const progressPercent = totalSteps > 0 ? Math.round((completedCount / totalSteps) * 100) : 0;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16 space-y-10">
      
      {/* Title & Introduction */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#143525]">
          <ShieldCheck className="w-4 h-4 text-[#10B981]" />
          <span>Device Preparation Assistant</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0F241A] tracking-tight">
          Prepare your device safely before handover
        </h1>
        <p className="text-sm sm:text-base text-[#4E6255] max-w-2xl leading-relaxed">
          {deviceName ? `Tailored preparation steps for your ${deviceName}. ` : ''}
          Review essential procedures for backups, account de-linking, cryptographic resets, and physical media removal.
        </p>
      </div>

      {/* Prominent Mandatory Safety & Verification Banner */}
      <div className="rounded-2xl bg-[#FFFBEB] border border-[#FDE68A] p-5 sm:p-6 flex flex-col sm:flex-row items-start gap-4">
        <div className="p-2.5 rounded-xl bg-white text-[#92400E] border border-[#FCD34D] shrink-0">
          <AlertTriangle className="w-5 h-5 text-[#92400E]" />
        </div>
        <div className="space-y-1.5 text-xs sm:text-sm text-[#78350F] leading-relaxed">
          <h2 className="font-bold text-[#92400E] text-base">
            Guidance Review vs. Cryptographic Verification Notice
          </h2>
          <p>
            Checking these guidance items documents that you have performed self-guided procedures.
            It does <strong>not</strong> independently certify that all data sectors are permanently destroyed or unrecoverable.
            Never rely on an informal checklist as a guarantee of 100% data security. If your device handled regulated, financial,
            or confidential health information, adhere strictly to institutional degaussing or certified shredding standards.
          </p>
        </div>
      </div>

      {/* Progress & Category Switcher Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8E6DC] shadow-sm space-y-6">
        
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-[#143525]">
            <span>Review Progress: {completedCount} of {totalSteps} items reviewed</span>
            <span>{progressPercent}% Complete</span>
          </div>
          <div className="w-full h-3 rounded-full bg-[#E8E6DC] overflow-hidden">
            <div 
              className="h-full bg-[#143525] rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <p className="text-[11px] text-[#6B7D72]">
            Progress is stored locally in your browser. Completing these checks records your diligence in My Journey.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="pt-4 border-t border-[#F0EFEA] flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-[#2C3E35] mr-2">Filter guidance for:</span>
          {[
            { id: 'smartphone', label: 'Smartphones', icon: Smartphone },
            { id: 'laptop', label: 'Laptops / PCs', icon: Laptop },
            { id: 'tablet', label: 'Tablets', icon: Tablet },
            { id: 'all', label: 'All Steps', icon: Layers },
          ].map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id as any)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  isSelected
                    ? 'bg-[#143525] text-white shadow-sm'
                    : 'bg-[#F4F3EF] hover:bg-[#EAE8E0] text-[#2C3E35]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Step by Step Guidance Items */}
      <div className="space-y-6">
        {filteredSteps.map((step, index) => {
          const isReviewed = reviewedIds.includes(step.id);

          return (
            <div
              key={step.id}
              className={`rounded-3xl p-6 sm:p-8 border transition-all duration-200 ${
                isReviewed
                  ? 'bg-[#F7FBF9] border-[#A7F3D0]'
                  : 'bg-white border-[#E8E6DC] hover:border-[#CBD5CF] shadow-sm'
              }`}
            >
              <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                
                {/* Step Title & Importance Badge */}
                <div className="flex items-start gap-4">
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                    isReviewed ? 'bg-[#143525] text-white' : 'bg-[#E8F5E9] text-[#143525]'
                  }`}>
                    {isReviewed ? <Check className="w-4 h-4 text-[#34D399]" /> : index + 1}
                  </span>

                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        step.importance === 'essential'
                          ? 'bg-[#FEE2E2] text-[#991B1B]'
                          : 'bg-[#E0E7FF] text-[#3730A3]'
                      }`}>
                        {step.importance}
                      </span>
                      <span className="text-xs text-[#6B7D72] capitalize">
                        {step.category}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-[#0F241A]">
                      {step.title}
                    </h3>
                    <p className="text-xs text-[#52635A] mt-1 leading-relaxed">
                      {step.summary}
                    </p>
                  </div>
                </div>

                {/* Mark as Reviewed Toggle Button */}
                <button
                  type="button"
                  onClick={() => handleToggle(step.id)}
                  className={`shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    isReviewed
                      ? 'bg-[#143525] text-white shadow-sm'
                      : 'border border-[#D7D4C5] bg-white text-[#143525] hover:bg-[#F9F8F5]'
                  }`}
                >
                  {isReviewed ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-[#34D399]" />
                      <span>Reviewed</span>
                    </>
                  ) : (
                    <span>Mark as Reviewed</span>
                  )}
                </button>
              </div>

              {/* Detailed Procedural Instructions */}
              <div className="mt-5 pt-4 border-t border-[#F0EFEA] space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-[#143525] block">
                  Detailed Instructions:
                </span>
                <ul className="space-y-2">
                  {step.detailedInstructions.map((instruction, idx) => (
                    <li key={idx} className="text-xs text-[#3D5245] leading-relaxed flex items-start gap-2.5">
                      <span className="text-[#10B981] font-bold mt-0.5">•</span>
                      <span>{instruction}</span>
                    </li>
                  ))}
                </ul>

                {/* Official Links */}
                {step.officialLinks && step.officialLinks.length > 0 && (
                  <div className="pt-3">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#6B7D72] block mb-2">
                      Official Manufacturer Support Documentation:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {step.officialLinks.map((link, idx) => (
                        <a
                          key={idx}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FAF9F5] border border-[#E0DED4] text-xs font-semibold text-[#143525] hover:bg-[#F4F3EF] transition-colors"
                        >
                          <span>{link.label}</span>
                          <ExternalLink className="w-3 h-3 text-[#6B7D72]" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Critical Warning if present */}
                {step.criticalWarning && (
                  <div className="mt-3 p-3 rounded-xl bg-[#FEF2F2] border border-[#FECACA] text-xs text-[#991B1B] leading-relaxed flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{step.criticalWarning}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Navigation */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 rounded-2xl bg-white border border-[#E8E6DC] shadow-sm">
        <div>
          <h4 className="font-bold text-sm text-[#0F241A]">Ready for the next step?</h4>
          <p className="text-xs text-[#52635A]">
            Once you have reviewed preparation, explore local collection centers or log your progress.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Link
            href="/collection"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold bg-[#143525] text-white hover:bg-[#1B4933] shadow-sm"
          >
            <span>Explore Collection Options</span>
            <ArrowRight className="w-4 h-4 text-[#34D399]" />
          </Link>
          <Link
            href="/journey"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold border border-[#D7D4C5] bg-white text-[#143525] hover:bg-[#F9F8F5]"
          >
            <span>My Journey</span>
          </Link>
        </div>
      </div>

    </div>
  );
}
