'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Sparkles, 
  RotateCcw, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  Coins, 
  Wrench, 
  Heart, 
  Recycle, 
  HelpCircle, 
  Edit3, 
  Check, 
  Info,
  ChevronRight
} from 'lucide-react';
import { RecommendationResult, AssessmentInput, PathwayType } from '@/types';
import { loadJourney, setSelectedPathway } from '@/lib/journeyStorage';

export default function ResultsPage() {
  const router = useRouter();
  const [recommendation, setRecommendation] = useState<RecommendationResult | null>(null);
  const [assessment, setAssessment] = useState<AssessmentInput | null>(null);
  const [chosenPathway, setChosenPathway] = useState<PathwayType | null>(null);
  
  // AI tailored explanation state
  const [aiText, setAiText] = useState<string | null>(null);
  const [aiDisclaimer, setAiDisclaimer] = useState<string | null>(null);
  const [isLoadingAi, setIsLoadingAi] = useState<boolean>(false);
  const [hasRequestedAi, setHasRequestedAi] = useState<boolean>(false);

  useEffect(() => {
    const journey = loadJourney();
    if (!journey.recommendation || !journey.assessment) {
      // If no assessment exists in local storage, route to assessment
      router.push('/assess');
      return;
    }
    setRecommendation(journey.recommendation);
    setAssessment(journey.assessment);
    setChosenPathway(journey.selectedPathway || journey.recommendation.primaryPathway);
  }, [router]);

  const handleSelectPathway = (pathway: PathwayType) => {
    setChosenPathway(pathway);
    setSelectedPathway(pathway);
  };

  const requestAiTailoredExplanation = async () => {
    if (!assessment || !recommendation) return;
    setIsLoadingAi(true);
    try {
      const res = await fetch('/api/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assessment, recommendation }),
      });
      if (res.ok) {
        const data = await res.json();
        setAiText(data.text);
        setAiDisclaimer(data.disclaimer);
        setHasRequestedAi(true);
      }
    } catch (err) {
      console.error('Failed to fetch explanation:', err);
    } finally {
      setIsLoadingAi(false);
    }
  };

  if (!recommendation || !assessment) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center">
        <div className="w-8 h-8 border-3 border-[#143525]/20 border-t-[#143525] rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-[#4E6255]">Loading personalized recommendation...</p>
      </div>
    );
  }

  const getPathwayIcon = (type: PathwayType) => {
    switch (type) {
      case 'resale': return Coins;
      case 'repair_use': return Wrench;
      case 'donate': return Heart;
      case 'reuse_repurpose': return RotateCcw;
      case 'responsible_recycling': return Recycle;
      default: return HelpCircle;
    }
  };

  const getViabilityBadge = (v: string) => {
    switch (v) {
      case 'recommended':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#E8F5E9] text-[#143525] border border-[#C8E6C9]">Recommended</span>;
      case 'viable':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#EFF6FF] text-[#1E40AF] border border-[#BFDBFE]">Viable Option</span>;
      case 'conditional':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A]">Conditional</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#F3F4F6] text-[#4B5563]">Not Recommended</span>;
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16 space-y-12">
      
      {/* Top Bar: Device Breadcrumb & Edit Button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[#E8E6DC]">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#143525]">
            <span>Personalised Assessment Result</span>
            <span>•</span>
            <span className="text-[#6B7D72]">{new Date(recommendation.generatedAt).toLocaleDateString()}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F241A] mt-1">
            Pathways for your {recommendation.deviceSummary.brandModel}
          </h1>
          <p className="text-xs text-[#52635A] mt-1">
            Condition: <strong className="capitalize">{assessment.condition.replace(/_/g, ' ')}</strong> • Priority: <strong className="capitalize">{assessment.priority.replace(/_/g, ' ')}</strong>
          </p>
        </div>

        <Link
          href="/assess"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border border-[#D7D4C5] bg-white text-[#143525] hover:bg-[#F9F8F5] transition-colors"
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>Edit Answers</span>
        </Link>
      </div>

      {/* Main Recommended Pathway Hero Card */}
      <div className="bg-[#143525] rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-4xl space-y-6">
          
          <div className="flex flex-wrap items-center gap-3">
            <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-[#34D399] text-[#0F241A]">
              PRIMARY RECOMMENDATION
            </span>
            <span className="text-xs font-medium text-[#A3C8B5]">
              Category: {recommendation.deviceSummary.categoryLabel}
            </span>
          </div>

          <div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              {recommendation.headline}
            </h2>
            <p className="text-base sm:text-lg text-[#C2D6CB] mt-3 leading-relaxed">
              {recommendation.explanation}
            </p>
          </div>

          {/* Rationale Bullet Points */}
          <div className="pt-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#34D399] mb-3">
              Why this pathway was selected:
            </h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              {recommendation.rationalePoints.map((point, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs text-[#E1EFE8] leading-relaxed">
                  <CheckCircle2 className="w-4 h-4 text-[#34D399] shrink-0 mt-0.5" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Action CTAs */}
          <div className="pt-4 flex flex-wrap items-center gap-4 border-t border-[#23533D]">
            <Link
              href="/prepare"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold bg-white text-[#143525] hover:bg-[#F5F4EF] shadow transition-all duration-150"
            >
              <ShieldCheck className="w-4 h-4 text-[#10B981]" />
              <span>Step 1: Review Preparation Checklist</span>
            </Link>

            <Link
              href="/collection"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold bg-[#1C4532] text-white hover:bg-[#255C43] border border-[#2B6047] transition-all"
            >
              <span>Step 2: Find Collection & Transfer Points</span>
              <ArrowRight className="w-4 h-4 text-[#34D399]" />
            </Link>

            <Link
              href="/journey"
              className="inline-flex items-center gap-2 text-xs font-semibold text-[#A3C8B5] hover:text-white transition-colors ml-auto"
            >
              <span>View in My Journey</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

        </div>
      </div>

      {/* Optional AI Tailored Synthesis Section */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E8E6DC] shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#E8F5E9] text-[#143525]">
              <Sparkles className="w-5 h-5 text-[#10B981]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#0F241A]">
                Tailored Decision Synthesis
              </h3>
              <p className="text-xs text-[#52635A]">
                Generate an in-depth explanatory briefing based solely on your specific device profile.
              </p>
            </div>
          </div>

          {!hasRequestedAi && (
            <button
              type="button"
              onClick={requestAiTailoredExplanation}
              disabled={isLoadingAi}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-[#143525] text-white hover:bg-[#1B4933] transition-all disabled:opacity-50"
            >
              {isLoadingAi ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Synthesizing...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-[#34D399]" />
                  <span>Generate Tailored Briefing</span>
                </>
              )}
            </button>
          )}
        </div>

        {aiText && (
          <div className="pt-4 border-t border-[#F0EFEA] space-y-3">
            <div className="text-sm text-[#2C3E35] leading-relaxed whitespace-pre-line bg-[#FAF9F5] p-5 rounded-xl border border-[#E8E6DC]">
              {aiText}
            </div>
            {aiDisclaimer && (
              <p className="text-[11px] text-[#6B7D72] italic">
                {aiDisclaimer}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Comparative Pathways Matrix */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-xl font-bold text-[#0F241A]">
              Full Pathways Comparison Matrix
            </h2>
            <p className="text-xs text-[#52635A]">
              Compare all 5 pathways for your device. Click on any card to select it for your journey.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendation.allPathways.map((pathway) => {
            const Icon = getPathwayIcon(pathway.id);
            const isPrimary = pathway.id === recommendation.primaryPathway;
            const isChosen = chosenPathway === pathway.id;

            return (
              <div
                key={pathway.id}
                className={`rounded-2xl p-6 border transition-all duration-200 flex flex-col justify-between ${
                  isChosen
                    ? 'border-[#143525] bg-white ring-2 ring-[#143525] shadow-md'
                    : 'border-[#E8E6DC] bg-white hover:border-[#CBD5CF] shadow-sm'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-2.5 rounded-xl bg-[#F4F3EF] text-[#143525]">
                      <Icon className="w-5 h-5 text-[#143525]" />
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      {getViabilityBadge(pathway.viability)}
                      {isPrimary && (
                        <span className="text-[10px] font-bold text-[#143525] uppercase tracking-wider">
                          ReLoop Pick
                        </span>
                      )}
                    </div>
                  </div>

                  <h3 className="font-bold text-lg text-[#0F241A]">{pathway.title}</h3>
                  <p className="text-xs text-[#6B7D72] mt-0.5">{pathway.tagline}</p>
                  
                  <p className="text-xs text-[#3D5245] mt-3 bg-[#FAF9F5] p-2.5 rounded-lg border border-[#EFECE6]">
                    <strong>Assessment:</strong> {pathway.viabilityReason}
                  </p>

                  {/* Financial & Effort Outlook */}
                  <div className="mt-4 pt-3 border-t border-[#F0EFEA] space-y-1.5 text-xs">
                    <div>
                      <span className="font-semibold text-[#143525]">Outlook: </span>
                      <span className="text-[#3D5245]">{pathway.estimatedReturn}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-[#143525]">Effort: </span>
                      <span className="capitalize text-[#3D5245]">{pathway.effort}</span>
                    </div>
                  </div>

                  {/* Prerequisites */}
                  <div className="mt-3 pt-3 border-t border-[#F0EFEA]">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#6B7D72] block mb-1">
                      Prerequisites:
                    </span>
                    <ul className="space-y-1">
                      {pathway.prerequisites.map((p, idx) => (
                        <li key={idx} className="text-[11px] text-[#4E6255] flex items-start gap-1.5">
                          <span className="text-[#10B981]">•</span>
                          <span>{p}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Key Trade-offs */}
                  <div className="mt-3 pt-3 border-t border-[#F0EFEA]">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#854D0E] block mb-1">
                      Key Trade-Offs:
                    </span>
                    <ul className="space-y-1">
                      {pathway.keyTradeoffs.map((t, idx) => (
                        <li key={idx} className="text-[11px] text-[#524430] flex items-start gap-1.5">
                          <span className="text-[#F59E0B]">•</span>
                          <span>{t}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-[#F0EFEA]">
                  <button
                    type="button"
                    onClick={() => handleSelectPathway(pathway.id)}
                    className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                      isChosen
                        ? 'bg-[#143525] text-white shadow-sm'
                        : 'bg-[#F4F3EF] hover:bg-[#EAE8E0] text-[#143525]'
                    }`}
                  >
                    {isChosen ? (
                      <>
                        <Check className="w-4 h-4 text-[#34D399]" />
                        <span>Selected for My Journey</span>
                      </>
                    ) : (
                      <span>Select This Pathway</span>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Uncertainty & Unknown Information Disclosures */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Missing Information Callout */}
        <div className="bg-[#FAF9F5] rounded-2xl p-6 border border-[#E0DED4] space-y-3">
          <div className="flex items-center gap-2.5 text-[#143525]">
            <HelpCircle className="w-5 h-5 text-[#143525]" />
            <h3 className="font-bold text-sm text-[#0F241A]">
              Information That Remains Unknown
            </h3>
          </div>
          <p className="text-xs text-[#52635A] leading-relaxed">
            Without physical diagnostic bench testing or external market queries, the following details cannot be verified automatically:
          </p>
          <ul className="space-y-2 text-xs text-[#3D5245]">
            {recommendation.missingInformation.length > 0 ? (
              recommendation.missingInformation.map((info, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-[#854D0E] font-bold">?</span>
                  <span>{info}</span>
                </li>
              ))
            ) : (
              <li className="flex items-start gap-2">
                <span className="text-[#10B981]">✓</span>
                <span>Sufficient baseline attributes provided for general categorization.</span>
              </li>
            )}
            <li className="flex items-start gap-2">
              <span className="text-[#854D0E] font-bold">?</span>
              <span>Exact technician repair quote or live carrier trade-in adjustment rate.</span>
            </li>
          </ul>
        </div>

        {/* Qualitative Uncertainty Explanation */}
        <div className="bg-[#FAF9F5] rounded-2xl p-6 border border-[#E0DED4] space-y-3">
          <div className="flex items-center gap-2.5 text-[#143525]">
            <Info className="w-5 h-5 text-[#143525]" />
            <h3 className="font-bold text-sm text-[#0F241A]">
              Calibrated Confidence Assessment
            </h3>
          </div>
          <p className="text-xs text-[#3D5245] leading-relaxed">
            {recommendation.uncertaintyAnalysis}
          </p>
          <div className="pt-2 text-[11px] text-[#6B7D72] border-t border-[#E8E6DC]">
            ReLoop provides calibrated qualitative reasoning rather than manufactured numerical percentages.
          </div>
        </div>

      </div>

      {/* Recommended Next Actions Checklist */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8E6DC] shadow-sm space-y-6">
        <div>
          <h2 className="text-xl font-bold text-[#0F241A]">
            Actionable Next Steps
          </h2>
          <p className="text-xs text-[#52635A] mt-1">
            Follow these sequential steps to execute your transition safely and systematically.
          </p>
        </div>

        <div className="space-y-3">
          {recommendation.actionableSteps.map((step, idx) => (
            <div
              key={step.id}
              className="p-4 rounded-2xl border border-[#E8E6DC] hover:border-[#143525] bg-[#FAF9F6] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-colors"
            >
              <div className="flex items-start gap-3.5">
                <span className="w-7 h-7 rounded-full bg-[#143525] text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <div>
                  <h4 className="font-bold text-sm text-[#0F241A]">{step.title}</h4>
                  <p className="text-xs text-[#52635A] mt-0.5 leading-relaxed">{step.description}</p>
                </div>
              </div>

              {step.linkUrl && (
                <Link
                  href={step.linkUrl}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#143525] text-white hover:bg-[#1B4933] shrink-0"
                >
                  <span>Open</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#34D399]" />
                </Link>
              )}
            </div>
          ))}
        </div>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[#F0EFEA]">
          <Link
            href="/journey"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-bold bg-[#143525] text-white hover:bg-[#1B4933] shadow-sm"
          >
            <span>Proceed to My Journey Tracker</span>
            <ArrowRight className="w-4 h-4 text-[#34D399]" />
          </Link>

          <Link
            href="/prepare"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold border border-[#D7D4C5] bg-white text-[#143525] hover:bg-[#F9F8F5]"
          >
            <ShieldCheck className="w-4 h-4 text-[#10B981]" />
            <span>Open Preparation Assistant</span>
          </Link>
        </div>
      </div>

    </div>
  );
}
