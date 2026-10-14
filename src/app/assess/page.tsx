'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  Smartphone, 
  Laptop, 
  Tablet, 
  Tv, 
  Cpu, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  AlertTriangle, 
  Info, 
  ShieldAlert, 
  Sparkles,
  Edit3
} from 'lucide-react';
import { 
  DeviceCategory, 
  DeviceCondition, 
  UserPriority, 
  AssessmentInput 
} from '@/types';
import { evaluateAssessment } from '@/lib/recommendationEngine';
import { saveAssessmentResult, loadJourney } from '@/lib/journeyStorage';

function AssessmentFlow() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Current Step: 1 (Category), 2 (Condition & Diagnostics), 3 (Priority), 4 (Details & Location), 5 (Review)
  const [step, setStep] = useState<number>(1);

  // Form State
  const [category, setCategory] = useState<DeviceCategory>('smartphone');
  const [categoryCustomName, setCategoryCustomName] = useState<string>('');
  
  const [condition, setCondition] = useState<DeviceCondition>('works_normally');
  const [powersOn, setPowersOn] = useState<'yes' | 'intermittent' | 'no' | 'unsure'>('yes');
  const [screenCondition, setScreenCondition] = useState<'flawless' | 'minor_scratches' | 'cracked_working' | 'broken_display' | 'not_applicable'>('flawless');
  const [batteryStatus, setBatteryStatus] = useState<'healthy' | 'drains_quickly' | 'swollen_or_damaged' | 'unknown'>('healthy');
  const [accountLockStatus, setAccountLockStatus] = useState<'fully_accessible' | 'locked_or_password_lost' | 'unsure'>('fully_accessible');
  const [hasAccessories, setHasAccessories] = useState<boolean>(true);

  const [priority, setPriority] = useState<UserPriority>('recover_value');

  const [brandModel, setBrandModel] = useState<string>('');
  const [approxAgeYears, setApproxAgeYears] = useState<string>('2-4 years');
  const [hasPersonalData, setHasPersonalData] = useState<'yes' | 'no' | 'unsure'>('yes');
  const [userLocation, setUserLocation] = useState<string>('');
  const [knownFaultNotes, setKnownFaultNotes] = useState<string>('');

  const [validationError, setValidationError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Check query params or existing journey on mount
  useEffect(() => {
    const queryCat = searchParams.get('category');
    if (queryCat && ['smartphone', 'laptop', 'tablet', 'tv_monitor', 'other'].includes(queryCat)) {
      setCategory(queryCat as DeviceCategory);
    } else {
      const journey = loadJourney();
      if (journey.assessment) {
        // Pre-fill existing assessment if returning
        const a = journey.assessment;
        setCategory(a.category);
        if (a.categoryCustomName) setCategoryCustomName(a.categoryCustomName);
        setCondition(a.condition);
        if (a.powersOn) setPowersOn(a.powersOn);
        if (a.screenCondition) setScreenCondition(a.screenCondition);
        if (a.batteryStatus) setBatteryStatus(a.batteryStatus);
        if (a.accountLockStatus) setAccountLockStatus(a.accountLockStatus);
        if (typeof a.hasAccessories === 'boolean') setHasAccessories(a.hasAccessories);
        setPriority(a.priority);
        if (a.brandModel) setBrandModel(a.brandModel);
        if (a.approxAgeYears) setApproxAgeYears(a.approxAgeYears);
        if (a.hasPersonalData) setHasPersonalData(a.hasPersonalData);
        if (a.userLocation) setUserLocation(a.userLocation);
        if (a.knownFaultNotes) setKnownFaultNotes(a.knownFaultNotes);
      }
    }
  }, [searchParams]);

  // Step Validation
  const validateStep = (currentStep: number): boolean => {
    setValidationError(null);
    if (currentStep === 1) {
      if (!category) {
        setValidationError('Please select a device category to continue.');
        return false;
      }
      if (category === 'other' && !categoryCustomName.trim()) {
        setValidationError('Please specify the type of electronic device.');
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep((prev) => Math.min(prev + 1, 5));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    setValidationError(null);
    setStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    setValidationError(null);

    const input: AssessmentInput = {
      category,
      categoryCustomName: category === 'other' ? categoryCustomName.trim() : undefined,
      condition,
      priority,
      brandModel: brandModel.trim() || undefined,
      approxAgeYears,
      powersOn,
      screenCondition: category === 'other' ? 'not_applicable' : screenCondition,
      batteryStatus,
      accountLockStatus,
      hasPersonalData,
      hasAccessories,
      userLocation: userLocation.trim() || undefined,
      knownFaultNotes: knownFaultNotes.trim() || undefined,
    };

    try {
      const recommendation = evaluateAssessment(input);
      saveAssessmentResult(input, recommendation);
      router.push('/results');
    } catch (err) {
      console.error(err);
      setValidationError('Failed to generate recommendation. Please check your answers and try again.');
      setIsSubmitting(false);
    }
  };

  const stepLabels = [
    { num: 1, title: 'Category' },
    { num: 2, title: 'Condition' },
    { num: 3, title: 'Priority' },
    { num: 4, title: 'Details' },
    { num: 5, title: 'Review' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
      
      {/* Header and Progress Indicator */}
      <div className="mb-10 text-center space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-[#143525]">
          Guided Device Assessment
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0F241A] tracking-tight">
          Find the best pathway for your electronics
        </h1>
        <p className="text-sm text-[#4E6255] max-w-xl mx-auto">
          Answer a few objective questions. We will compare resale, repair, reuse, and recycling without pushing premature disposal.
        </p>

        {/* Multi-step progress bar */}
        <div className="pt-6 max-w-2xl mx-auto">
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-[#E8E6DC] w-full -z-0" />
            <div 
              className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-[#143525] transition-all duration-300 -z-0"
              style={{ width: `${((step - 1) / (stepLabels.length - 1)) * 100}%` }}
            />
            {stepLabels.map((s) => {
              const isPassed = step > s.num;
              const isCurrent = step === s.num;
              return (
                <div key={s.num} className="flex flex-col items-center relative z-10">
                  <button
                    type="button"
                    onClick={() => {
                      if (s.num < step) setStep(s.num);
                    }}
                    disabled={s.num > step}
                    aria-label={`Step ${s.num}: ${s.title}`}
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      isPassed
                        ? 'bg-[#143525] text-white'
                        : isCurrent
                        ? 'bg-[#143525] text-white ring-4 ring-[#C8E6C9]'
                        : 'bg-white border-2 border-[#D7D4C5] text-[#6B7D72]'
                    }`}
                  >
                    {isPassed ? <Check className="w-4 h-4 text-[#34D399]" /> : s.num}
                  </button>
                  <span className={`text-[11px] font-semibold mt-2 hidden sm:block ${
                    isCurrent ? 'text-[#0F241A]' : 'text-[#6B7D72]'
                  }`}>
                    {s.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Error notification if validation fails */}
      {validationError && (
        <div className="mb-6 p-4 rounded-xl bg-[#FEF2F2] border border-[#FCA5A5] text-sm text-[#991B1B] flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 shrink-0" />
          <span>{validationError}</span>
        </div>
      )}

      {/* Step Content Container */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E8E6DC] shadow-sm">
        
        {/* ================= STEP 1: DEVICE CATEGORY ================= */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-[#0F241A]">
                Step 1: What type of electronic device is this?
              </h2>
              <p className="text-xs text-[#52635A] mt-1">
                Smartphones and laptops have the most detailed diagnostic and preparation guidance implemented.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { id: 'smartphone', label: 'Smartphone', desc: 'iPhone, Android, Windows or feature phone', icon: Smartphone, tag: 'Full Guidance' },
                { id: 'laptop', label: 'Laptop or Computer', desc: 'MacBook, Windows PC, Chromebook, desktop tower', icon: Laptop, tag: 'Full Guidance' },
                { id: 'tablet', label: 'Tablet', desc: 'iPad, Android tablet, e-reader', icon: Tablet, tag: 'Standard Guidance' },
                { id: 'tv_monitor', label: 'Television or Monitor', desc: 'LCD, LED screen, display monitor', icon: Tv, tag: 'Standard Guidance' },
                { id: 'other', label: 'Other Electronic Device', desc: 'Audio hardware, console, smart home, accessories', icon: Cpu, tag: 'General Guidance' },
              ].map((item) => {
                const Icon = item.icon;
                const isSelected = category === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setCategory(item.id as DeviceCategory)}
                    className={`p-5 rounded-2xl border text-left flex items-start gap-4 transition-all duration-150 ${
                      isSelected
                        ? 'border-[#143525] bg-[#F5FBF7] ring-2 ring-[#143525]'
                        : 'border-[#E8E6DC] hover:border-[#B8C8BF] bg-white'
                    }`}
                  >
                    <div className={`p-3 rounded-xl shrink-0 ${isSelected ? 'bg-[#143525] text-[#34D399]' : 'bg-[#F4F3EF] text-[#2C3E35]'}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-base text-[#0F241A]">{item.label}</span>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          isSelected ? 'bg-[#E8F5E9] text-[#143525]' : 'bg-[#F0EFE9] text-[#6B7D72]'
                        }`}>
                          {item.tag}
                        </span>
                      </div>
                      <p className="text-xs text-[#52635A] mt-1">{item.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            {category === 'other' && (
              <div className="p-4 rounded-2xl bg-[#FAF9F5] border border-[#E0DED4] space-y-3">
                <label htmlFor="customName" className="block text-xs font-bold uppercase tracking-wider text-[#143525]">
                  Specify device type or category name:
                </label>
                <input
                  id="customName"
                  type="text"
                  placeholder="e.g. Wireless Noise-Cancelling Headphones, Nintendo Switch, Audio Receiver"
                  value={categoryCustomName}
                  onChange={(e) => setCategoryCustomName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#D7D4C5] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#143525]"
                />
                <p className="text-xs text-[#6B7D72]">
                  Note: Guidance for general electronics covers universal recycling, basic cleaning, and generic trade-in principles.
                </p>
              </div>
            )}
          </div>
        )}

        {/* ================= STEP 2: CONDITION & RELEVANT DIAGNOSTICS ================= */}
        {step === 2 && (
          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-bold text-[#0F241A]">
                Step 2: What is the current operating condition?
              </h2>
              <p className="text-xs text-[#52635A] mt-1">
                Choose the baseline state. We will only ask relevant follow-up questions.
              </p>
            </div>

            {/* Condition Radios */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {[
                { id: 'works_normally', label: 'Works normally', desc: 'Powers on, screen and inputs work, holds charge.' },
                { id: 'works_with_issues', label: 'Works but has a problem', desc: 'Powers on, but has cracked screen, weak battery, or glitch.' },
                { id: 'does_not_work', label: 'Does not work', desc: 'Will not turn on, severe liquid/physical damage, dead.' },
                { id: 'unsure', label: 'Unsure', desc: 'Untested, missing charger, or been stored away for years.' },
              ].map((c) => {
                const isSelected = condition === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setCondition(c.id as DeviceCondition)}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'border-[#143525] bg-[#F5FBF7] ring-2 ring-[#143525]'
                        : 'border-[#E8E6DC] hover:border-[#B8C8BF] bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        isSelected ? 'border-[#143525] bg-[#143525]' : 'border-[#9CA3AF]'
                      }`}>
                        {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                      <span className="font-bold text-sm text-[#0F241A]">{c.label}</span>
                    </div>
                    <p className="text-xs text-[#52635A] mt-2 ml-6">{c.desc}</p>
                  </button>
                );
              })}
            </div>

            {/* Category-Specific Diagnostic Questions */}
            <div className="pt-4 border-t border-[#F0EFEA] space-y-6">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#143525]">
                Relevant Diagnostics for {category === 'smartphone' ? 'Smartphones' : category === 'laptop' ? 'Laptops' : 'This Device'}
              </h3>

              {/* Power State */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-[#2C3E35]">
                  Does the device turn on and display a screen?
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'yes', label: 'Yes, boots normally' },
                    { id: 'intermittent', label: 'Intermittent / glitches' },
                    { id: 'no', label: 'No, completely dead' },
                    { id: 'unsure', label: 'Unsure / untried' },
                  ].map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setPowersOn(p.id as any)}
                      className={`p-2.5 rounded-lg text-xs font-medium border text-center transition-all ${
                        powersOn === p.id
                          ? 'bg-[#143525] text-white border-[#143525]'
                          : 'bg-white border-[#E8E6DC] text-[#2C3E35] hover:bg-[#F9F8F5]'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Screen Condition (Smartphones, Laptops, Tablets, TVs) */}
              {category !== 'other' && (
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-[#2C3E35]">
                    Screen / Display condition:
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {[
                      { id: 'flawless', label: 'Intact / Minor scratches' },
                      { id: 'cracked_working', label: 'Cracked glass, but touch/display works' },
                      { id: 'broken_display', label: 'Black screen / Lines / Broken touch' },
                    ].map((sc) => (
                      <button
                        key={sc.id}
                        type="button"
                        onClick={() => setScreenCondition(sc.id as any)}
                        className={`p-3 rounded-lg text-xs font-medium border text-left transition-all ${
                          screenCondition === sc.id
                            ? 'bg-[#143525] text-white border-[#143525]'
                            : 'bg-white border-[#E8E6DC] text-[#2C3E35] hover:bg-[#F9F8F5]'
                        }`}
                      >
                        {sc.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Battery State with Safety Warning */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold text-[#2C3E35]">
                    Battery condition:
                  </label>
                  <span className="text-[11px] text-[#854D0E] font-medium flex items-center gap-1">
                    <ShieldAlert className="w-3.5 h-3.5" /> Safety Sensitive
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {[
                    { id: 'healthy', label: 'Holds decent charge' },
                    { id: 'drains_quickly', label: 'Drains quickly (< 2 hrs)' },
                    { id: 'swollen_or_damaged', label: '⚠️ Bulging / Swollen battery' },
                  ].map((b) => (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => setBatteryStatus(b.id as any)}
                      className={`p-3 rounded-lg text-xs font-medium border text-left transition-all ${
                        batteryStatus === b.id
                          ? b.id === 'swollen_or_damaged'
                            ? 'bg-[#991B1B] text-white border-[#991B1B]'
                            : 'bg-[#143525] text-white border-[#143525]'
                          : 'bg-white border-[#E8E6DC] text-[#2C3E35] hover:bg-[#F9F8F5]'
                      }`}
                    >
                      {b.label}
                    </button>
                  ))}
                </div>
                {batteryStatus === 'swollen_or_damaged' && (
                  <div className="p-3.5 rounded-xl bg-[#FEF2F2] border border-[#FCA5A5] text-xs text-[#991B1B] leading-relaxed flex items-start gap-2 mt-2">
                    <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>
                      <strong>Immediate Safety Notice:</strong> A swollen lithium-ion battery is under gas pressure.
                      Do not plug this device into a charger. Do not mail it in regular post. We will prioritize hazardous material handling for your safety.
                    </span>
                  </div>
                )}
              </div>

              {/* Account Lock Status for Phones / Laptops */}
              {(category === 'smartphone' || category === 'laptop' || category === 'tablet') && (
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-[#2C3E35]">
                    Account / Activation Lock (iCloud / Google FRP / BitLocker):
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {[
                      { id: 'fully_accessible', label: 'Unlocked & I know passwords' },
                      { id: 'locked_or_password_lost', label: 'Locked / Unknown passcode' },
                      { id: 'unsure', label: 'Unsure / not verified' },
                    ].map((acc) => (
                      <button
                        key={acc.id}
                        type="button"
                        onClick={() => setAccountLockStatus(acc.id as any)}
                        className={`p-2.5 rounded-lg text-xs font-medium border text-left transition-all ${
                          accountLockStatus === acc.id
                            ? 'bg-[#143525] text-white border-[#143525]'
                            : 'bg-white border-[#E8E6DC] text-[#2C3E35] hover:bg-[#F9F8F5]'
                        }`}
                      >
                        {acc.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>
        )}

        {/* ================= STEP 3: USER PRIORITY ================= */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-[#0F241A]">
                Step 3: What is your primary objective?
              </h2>
              <p className="text-xs text-[#52635A] mt-1">
                Your priority directly guides the recommendation engine. We do not default everyone to recycling.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                {
                  id: 'recover_value',
                  title: 'Recover value',
                  desc: 'Financial return through peer-to-peer resale, direct trade-in, or parts salvage.',
                  badge: 'Financial Return',
                },
                {
                  id: 'give_useful_life',
                  title: 'Give the device another useful life',
                  desc: 'Pass it to someone who needs it, donate to schools/charities, or repurpose at home.',
                  badge: 'Social & Reuse',
                },
                {
                  id: 'dispose_responsibly',
                  title: 'Dispose of it responsibly',
                  desc: 'Prevent landfill dumping, safely neutralise toxic heavy metals, and recover raw elements.',
                  badge: 'Environmental Safety',
                },
                {
                  id: 'help_me_decide',
                  title: 'Help me decide',
                  desc: 'Compare the effort, costs, and feasibility of all relevant options side-by-side.',
                  badge: 'Objective Comparison',
                },
              ].map((p) => {
                const isSelected = priority === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setPriority(p.id as UserPriority)}
                    className={`p-6 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                      isSelected
                        ? 'border-[#143525] bg-[#F5FBF7] ring-2 ring-[#143525]'
                        : 'border-[#E8E6DC] hover:border-[#B8C8BF] bg-white'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-base text-[#0F241A]">{p.title}</span>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          isSelected ? 'bg-[#143525] text-white' : 'bg-[#F0EFE9] text-[#6B7D72]'
                        }`}>
                          {p.badge}
                        </span>
                      </div>
                      <p className="text-xs text-[#52635A] leading-relaxed">{p.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ================= STEP 4: ADDITIONAL DETAILS & CONTEXT ================= */}
        {step === 4 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-[#0F241A]">
                Step 4: Additional details (all optional)
              </h2>
              <p className="text-xs text-[#52635A] mt-1">
                Provide only what you know. You will never be blocked by unknown technical details.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              {/* Brand & Model */}
              <div className="space-y-2">
                <label htmlFor="modelInput" className="block text-xs font-bold text-[#2C3E35]">
                  Brand & Model (Optional):
                </label>
                <input
                  id="modelInput"
                  type="text"
                  placeholder="e.g. iPhone 12, ThinkPad T490, Dell XPS 13"
                  value={brandModel}
                  onChange={(e) => setBrandModel(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#D7D4C5] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#143525]"
                />
              </div>

              {/* Approximate Age */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-[#2C3E35]">
                  Approximate Age:
                </label>
                <select
                  value={approxAgeYears}
                  onChange={(e) => setApproxAgeYears(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#D7D4C5] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#143525]"
                >
                  <option value="< 2 years">Under 2 years old</option>
                  <option value="2-4 years">2 to 4 years old</option>
                  <option value="5-7 years">5 to 7 years old</option>
                  <option value="8+ years">8+ years old (Legacy / Obsolete)</option>
                  <option value="unsure">Unsure</option>
                </select>
              </div>

              {/* Data Sensitivity */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-[#2C3E35]">
                  Does it hold personal or confidential data?
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'yes', label: 'Yes' },
                    { id: 'no', label: 'No / Cleared' },
                    { id: 'unsure', label: 'Unsure' },
                  ].map((d) => (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => setHasPersonalData(d.id as any)}
                      className={`py-2 px-3 rounded-lg text-xs font-semibold border ${
                        hasPersonalData === d.id
                          ? 'bg-[#143525] text-white border-[#143525]'
                          : 'bg-white border-[#D7D4C5] text-[#2C3E35]'
                      }`}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Location for Dropoff Filtering */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="locationInput" className="block text-xs font-bold text-[#2C3E35]">
                    City or Postal Area (Optional):
                  </label>
                  <span className="text-[11px] text-[#6B7D72]">Only for local filters</span>
                </div>
                <input
                  id="locationInput"
                  type="text"
                  placeholder="e.g. San Francisco, New York, Austin, London"
                  value={userLocation}
                  onChange={(e) => setUserLocation(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#D7D4C5] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#143525]"
                />
              </div>

            </div>

            {/* Freeform Notes */}
            <div className="space-y-2 pt-2">
              <label htmlFor="notesInput" className="block text-xs font-bold text-[#2C3E35]">
                Any specific faults or context you want to note?
              </label>
              <textarea
                id="notesInput"
                rows={2}
                placeholder="e.g. Charging port is loose, volume down button sticks, camera glass has hairline crack"
                value={knownFaultNotes}
                onChange={(e) => setKnownFaultNotes(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-[#D7D4C5] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#143525]"
              />
            </div>

            <div className="p-3.5 rounded-xl bg-[#FAF9F5] border border-[#E8E6DC] text-xs text-[#52635A] flex items-center gap-2">
              <Info className="w-4 h-4 text-[#143525] shrink-0" />
              <span>
                Your responses remain in your browser&apos;s local session. No user account is created or required.
              </span>
            </div>
          </div>
        )}

        {/* ================= STEP 5: REVIEW & SUMMARY ================= */}
        {step === 5 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-[#0F241A]">
                Step 5: Review your assessment before generating advice
              </h2>
              <p className="text-xs text-[#52635A] mt-1">
                Confirm your selections below. You can jump back to edit any section anytime.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Summary Item: Category */}
              <div className="p-4 rounded-xl bg-[#F9F8F5] border border-[#E8E6DC] flex items-start justify-between">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#6B7D72]">
                    Category
                  </span>
                  <p className="font-bold text-sm text-[#0F241A] mt-0.5 capitalize">
                    {category === 'other' ? (categoryCustomName || 'Other Device') : category.replace(/_/g, ' ')}
                  </p>
                  {brandModel && <p className="text-xs text-[#52635A]">{brandModel}</p>}
                </div>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs text-[#143525] font-semibold hover:underline flex items-center gap-1"
                >
                  <Edit3 className="w-3.5 h-3.5" /> Edit
                </button>
              </div>

              {/* Summary Item: Condition */}
              <div className="p-4 rounded-xl bg-[#F9F8F5] border border-[#E8E6DC] flex items-start justify-between">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#6B7D72]">
                    Condition
                  </span>
                  <p className="font-bold text-sm text-[#0F241A] mt-0.5 capitalize">
                    {condition.replace(/_/g, ' ')}
                  </p>
                  <p className="text-xs text-[#52635A]">
                    Power: {powersOn} • Screen: {screenCondition.replace(/_/g, ' ')}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="text-xs text-[#143525] font-semibold hover:underline flex items-center gap-1"
                >
                  <Edit3 className="w-3.5 h-3.5" /> Edit
                </button>
              </div>

              {/* Summary Item: Priority */}
              <div className="p-4 rounded-xl bg-[#F9F8F5] border border-[#E8E6DC] flex items-start justify-between">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#6B7D72]">
                    User Priority
                  </span>
                  <p className="font-bold text-sm text-[#0F241A] mt-0.5 capitalize">
                    {priority.replace(/_/g, ' ')}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="text-xs text-[#143525] font-semibold hover:underline flex items-center gap-1"
                >
                  <Edit3 className="w-3.5 h-3.5" /> Edit
                </button>
              </div>

              {/* Summary Item: Details */}
              <div className="p-4 rounded-xl bg-[#F9F8F5] border border-[#E8E6DC] flex items-start justify-between">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#6B7D72]">
                    Age & Location
                  </span>
                  <p className="font-bold text-sm text-[#0F241A] mt-0.5">
                    Age: {approxAgeYears}
                  </p>
                  <p className="text-xs text-[#52635A]">
                    Location: {userLocation || 'Not specified'} • Data on device: {hasPersonalData}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setStep(4)}
                  className="text-xs text-[#143525] font-semibold hover:underline flex items-center gap-1"
                >
                  <Edit3 className="w-3.5 h-3.5" /> Edit
                </button>
              </div>

            </div>

            {/* Battery Warning in Review if Swollen */}
            {batteryStatus === 'swollen_or_damaged' && (
              <div className="p-4 rounded-xl bg-[#FEF2F2] border border-[#FCA5A5] text-xs text-[#991B1B] flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 shrink-0 text-[#991B1B]" />
                <div>
                  <p className="font-bold mb-0.5">Safety Precaution Detected</p>
                  <p>A swollen battery was reported. The recommendation will prioritize hazardous material handling over regular shipping or reuse.</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Footer Navigation Buttons */}
        <div className="mt-10 pt-6 border-t border-[#E8E6DC] flex items-center justify-between">
          {step > 1 ? (
            <button
              type="button"
              onClick={handleBack}
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[#D7D4C5] bg-white text-xs font-bold text-[#143525] hover:bg-[#F9F8F5] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          {step < 5 ? (
            <button
              type="button"
              onClick={handleNext}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#143525] text-white text-xs font-bold hover:bg-[#1B4933] shadow-sm transition-all"
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4 text-[#34D399]" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-[#143525] text-white text-sm font-bold hover:bg-[#1B4933] shadow-md transition-all duration-150 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Evaluating pathways...</span>
                </>
              ) : (
                <>
                  <span>Generate Personalised Pathways</span>
                  <Sparkles className="w-4 h-4 text-[#34D399]" />
                </>
              )}
            </button>
          )}
        </div>

      </div>

    </div>
  );
}

export default function AssessmentPage() {
  return (
    <Suspense fallback={
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="w-8 h-8 border-3 border-[#143525]/20 border-t-[#143525] rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-[#4E6255]">Loading assessment framework...</p>
      </div>
    }>
      <AssessmentFlow />
    </Suspense>
  );
}
