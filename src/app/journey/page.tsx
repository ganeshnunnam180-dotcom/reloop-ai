'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Compass, 
  CheckCircle2, 
  ShieldCheck, 
  ArrowRight, 
  AlertTriangle, 
  Trash2, 
  Save, 
  Check
} from 'lucide-react';
import { JourneyState } from '@/types';
import { 
  loadJourney, 
  updateHandoverAction, 
  resetEntireJourney
} from '@/lib/journeyStorage';

export default function JourneyPage() {
  const router = useRouter();
  const [journey, setJourney] = useState<JourneyState | null>(null);
  const [handoverNotes, setHandoverNotes] = useState<string>('');
  const [handoverStatus, setHandoverStatus] = useState<JourneyState['handoverStatus']>('not_started');
  const [isSavedNotice, setIsSavedNotice] = useState<boolean>(false);
  const [showResetConfirm, setShowResetConfirm] = useState<boolean>(false);

  useEffect(() => {
    const loaded = loadJourney();
    setJourney(loaded);
    setHandoverNotes(loaded.handoverNotes || '');
    setHandoverStatus(loaded.handoverStatus);
  }, []);

  const handleSaveHandover = () => {
    if (!journey) return;
    const isCompleted = handoverStatus === 'transferred' || handoverStatus === 'retained_at_home';
    const updated = updateHandoverAction(handoverStatus, handoverNotes, isCompleted);
    setJourney(updated);
    setIsSavedNotice(true);
    setTimeout(() => setIsSavedNotice(false), 2500);
  };

  const handleReset = () => {
    resetEntireJourney();
    setShowResetConfirm(false);
    router.push('/assess');
  };

  if (!journey) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center">
        <div className="w-8 h-8 border-3 border-[#143525]/20 border-t-[#143525] rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-[#4E6255]">Loading journey tracker...</p>
      </div>
    );
  }

  const hasAssessment = !!journey.assessment;
  const assessment = journey.assessment;
  const recommendation = journey.recommendation;
  const reviewedCount = journey.reviewedChecklistIds.length;

  const stages = [
    {
      num: 1,
      title: 'Device Assessed',
      desc: assessment ? `${assessment.brandModel || assessment.category} (${assessment.condition.replace(/_/g, ' ')})` : 'Not yet completed',
      completed: hasAssessment,
      actionUrl: '/assess',
      actionLabel: hasAssessment ? 'Review Assessment' : 'Start Assessment',
    },
    {
      num: 2,
      title: 'Options Compared',
      desc: recommendation ? `Analyzed 5 pathways • Primary: ${recommendation.pathwayTitle}` : 'Waiting for assessment',
      completed: !!recommendation,
      actionUrl: '/results',
      actionLabel: recommendation ? 'View Pathways' : 'Assess First',
    },
    {
      num: 3,
      title: 'Preparation Guidance Reviewed',
      desc: `${reviewedCount} checklist items marked as reviewed`,
      completed: reviewedCount > 0,
      actionUrl: '/prepare',
      actionLabel: 'Open Preparation Assistant',
    },
    {
      num: 4,
      title: 'Pathway Selected',
      desc: journey.selectedPathway ? `Selected: ${journey.selectedPathway.replace(/_/g, ' ').toUpperCase()}` : 'No pathway chosen yet',
      completed: !!journey.selectedPathway,
      actionUrl: '/results',
      actionLabel: 'Select Pathway',
    },
    {
      num: 5,
      title: 'Handover / Next Action Logged',
      desc: journey.completionDate ? `Completed on ${new Date(journey.completionDate).toLocaleDateString()}` : 'Awaiting physical or domestic action',
      completed: !!journey.completionDate,
      actionUrl: '#handover-section',
      actionLabel: 'Log Next Action',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16 space-y-10">
      
      {/* Title & Reset Button Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[#E8E6DC]">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#143525]">
            <Compass className="w-4 h-4 text-[#10B981]" />
            <span>Journey Progress Tracker</span>
          </div>
          <h1 className="text-3xl font-extrabold text-[#0F241A] tracking-tight">
            My Electronic Transition Journey
          </h1>
          <p className="text-xs text-[#52635A]">
            Persisted securely in your browser&apos;s localStorage • Resumable at any time
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowResetConfirm(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-[#991B1B] hover:bg-[#FEF2F2] border border-[#FCA5A5] transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Restart Journey</span>
        </button>
      </div>

      {/* Confirmation Modal for Reset */}
      {showResetConfirm && (
        <div className="p-4 rounded-2xl bg-[#FEF2F2] border border-[#FCA5A5] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-[#991B1B] shrink-0 mt-0.5" />
            <div className="text-xs text-[#991B1B]">
              <strong className="block font-bold">Are you sure you want to reset your journey?</strong>
              This will clear your local assessment answers, checklist items, and notes from this browser.
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setShowResetConfirm(false)}
              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-white text-[#4B5563] border border-[#D1D5DB]"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-[#991B1B] text-white hover:bg-[#7F1D1D]"
            >
              Confirm Reset
            </button>
          </div>
        </div>
      )}

      {/* Mandatory Self-Reporting Disclaimer Notice */}
      <div className="rounded-2xl bg-[#F4F3EF] border border-[#E0DED4] p-5 flex items-start gap-3 text-xs text-[#3D5245] leading-relaxed">
        <ShieldCheck className="w-5 h-5 text-[#143525] shrink-0 mt-0.5" />
        <div>
          <strong className="text-[#0F241A] font-bold block mb-0.5">
            User-Reported Progress Notice
          </strong>
          Completion timestamps and recorded milestones are self-reported by you for personal tracking.
          ReLoop does not certify physical chain-of-custody, third-party recycling compliance, or carbon offset figures.
        </div>
      </div>

      {/* 5-Stage Step Progress Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8E6DC] shadow-sm space-y-6">
        <div>
          <h2 className="text-xl font-bold text-[#0F241A]">
            The 5 Transition Stages
          </h2>
          <p className="text-xs text-[#52635A] mt-0.5">
            Current stage reached: Stage {journey.currentStage} of 5
          </p>
        </div>

        <div className="space-y-4">
          {stages.map((st) => (
            <div
              key={st.num}
              className={`p-4 sm:p-5 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                st.completed
                  ? 'bg-[#F7FBF9] border-[#C8E6C9]'
                  : 'bg-white border-[#E8E6DC]'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                  st.completed
                    ? 'bg-[#143525] text-white'
                    : 'bg-[#F4F3EF] border border-[#D7D4C5] text-[#6B7D72]'
                }`}>
                  {st.completed ? <Check className="w-4 h-4 text-[#34D399]" /> : st.num}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm text-[#0F241A]">{st.title}</h3>
                    {st.completed && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E8F5E9] text-[#143525]">
                        Completed
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#52635A] mt-1 leading-relaxed">
                    {st.desc}
                  </p>
                </div>
              </div>

              <Link
                href={st.actionUrl}
                className={`shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  st.completed
                    ? 'bg-white border border-[#D7D4C5] text-[#143525] hover:bg-[#F9F8F5]'
                    : 'bg-[#143525] text-white hover:bg-[#1B4933]'
                }`}
              >
                <span>{st.actionLabel}</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#34D399]" />
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Handover & Next Action Logging Section */}
      <div id="handover-section" className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8E6DC] shadow-sm space-y-6">
        <div>
          <h2 className="text-xl font-bold text-[#0F241A]">
            Stage 5: Record Your Next Action or Handover Status
          </h2>
          <p className="text-xs text-[#52635A] mt-0.5">
            Log your chosen method, drop-off date, and any notes (e.g. buyer name, trade-in receipt code, or depot visited).
          </p>
        </div>

        <div className="space-y-4">
          
          {/* Status selector */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-[#2C3E35]">
              Current Action Status:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {[
                { id: 'not_started', label: 'Not started / Planning', desc: 'Still deciding or preparing hardware' },
                { id: 'scheduled', label: 'Drop-off / Shipment Scheduled', desc: 'Appointment booked or box received' },
                { id: 'transferred', label: 'Transferred / Dropped Off', desc: 'Handed to recipient, retailer, or recycler' },
                { id: 'retained_at_home', label: 'Repurposed / Retained at Home', desc: 'Configured for secondary domestic use' },
              ].map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setHandoverStatus(s.id as any)}
                  className={`p-3.5 rounded-xl border text-left transition-all ${
                    handoverStatus === s.id
                      ? 'border-[#143525] bg-[#F5FBF7] ring-2 ring-[#143525]'
                      : 'border-[#E8E6DC] hover:border-[#CBD5CF] bg-white'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                      handoverStatus === s.id ? 'border-[#143525] bg-[#143525]' : 'border-[#9CA3AF]'
                    }`}>
                      {handoverStatus === s.id && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>
                    <span className="font-bold text-xs text-[#0F241A]">{s.label}</span>
                  </div>
                  <p className="text-[11px] text-[#6B7D72] mt-1 ml-5">{s.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Notes textarea */}
          <div className="space-y-2">
            <label htmlFor="notes" className="block text-xs font-bold text-[#2C3E35]">
              Personal Handover Notes & Proof Details:
            </label>
            <textarea
              id="notes"
              rows={3}
              placeholder="e.g. Dropped at Civic Amenity Site on Saturday; received store voucher receipt #8921; phone successfully reset and passed to cousin."
              value={handoverNotes}
              onChange={(e) => setHandoverNotes(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-[#D7D4C5] bg-[#FAF9F5] text-xs focus:outline-none focus:ring-2 focus:ring-[#143525] focus:bg-white"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            {isSavedNotice ? (
              <span className="text-xs text-[#10B981] font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> Journey updated successfully!
              </span>
            ) : (
              <span className="text-xs text-[#6B7D72]">
                Updated: {new Date(journey.updatedAt).toLocaleTimeString()}
              </span>
            )}

            <button
              type="button"
              onClick={handleSaveHandover}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-[#143525] text-white hover:bg-[#1B4933] shadow-sm transition-all"
            >
              <Save className="w-3.5 h-3.5 text-[#34D399]" />
              <span>Save Progress</span>
            </button>
          </div>

        </div>
      </div>

    </div>
  );
}
