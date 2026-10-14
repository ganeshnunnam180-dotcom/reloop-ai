export type DeviceCategory =
  | 'smartphone'
  | 'laptop'
  | 'tablet'
  | 'tv_monitor'
  | 'other';

export type DeviceCondition =
  | 'works_normally'
  | 'works_with_issues'
  | 'does_not_work'
  | 'unsure';

export type UserPriority =
  | 'recover_value'
  | 'give_useful_life'
  | 'dispose_responsibly'
  | 'help_me_decide';

export interface AssessmentInput {
  category: DeviceCategory;
  categoryCustomName?: string;
  condition: DeviceCondition;
  priority: UserPriority;
  
  // Specific category diagnostics
  brandModel?: string;
  approxAgeYears?: string; // e.g. "< 2 years", "2-4 years", "5-7 years", "8+ years", "unsure"
  powersOn?: 'yes' | 'intermittent' | 'no' | 'unsure';
  screenCondition?: 'flawless' | 'minor_scratches' | 'cracked_working' | 'broken_display' | 'not_applicable';
  batteryStatus?: 'healthy' | 'drains_quickly' | 'swollen_or_damaged' | 'unknown';
  accountLockStatus?: 'fully_accessible' | 'locked_or_password_lost' | 'unsure';
  hasPersonalData?: 'yes' | 'no' | 'unsure';
  hasAccessories?: boolean; // charger, cables, etc.
  userLocation?: string; // City or postal prefix for dropoff filtering
  knownFaultNotes?: string;
}

export type PathwayType =
  | 'resale'
  | 'repair_use'
  | 'donate'
  | 'reuse_repurpose'
  | 'responsible_recycling'
  | 'diagnostic';

export type ViabilityLevel = 'recommended' | 'viable' | 'conditional' | 'not_recommended';
export type EffortLevel = 'low' | 'moderate' | 'high';

export interface PathwayDetail {
  id: PathwayType;
  title: string;
  tagline: string;
  viability: ViabilityLevel;
  viabilityReason: string;
  effort: EffortLevel;
  estimatedReturn: string;
  prerequisites: string[];
  keyTradeoffs: string[];
  recommendedWhen: string;
}

export interface RecommendationResult {
  deviceSummary: {
    category: DeviceCategory;
    categoryLabel: string;
    brandModel: string;
    condition: DeviceCondition;
    priority: UserPriority;
  };
  primaryPathway: PathwayType;
  pathwayTitle: string;
  headline: string;
  explanation: string;
  rationalePoints: string[];
  allPathways: PathwayDetail[];
  potentialBenefits: string[];
  importantTradeoffs: string[];
  missingInformation: string[];
  uncertaintyAnalysis: string;
  actionableSteps: {
    id: string;
    title: string;
    description: string;
    actionType: 'prepare' | 'collection' | 'quote' | 'backup' | 'custom';
    linkUrl?: string;
  }[];
  generatedAt: string;
}

export interface JourneyState {
  id: string;
  createdAt: string;
  updatedAt: string;
  currentStage: 1 | 2 | 3 | 4 | 5; 
  // Stage 1: Device Assessed
  // Stage 2: Options Compared
  // Stage 3: Preparation Guidance Reviewed
  // Stage 4: Pathway Selected
  // Stage 5: Handover Completed or Next Action Recorded
  assessment: AssessmentInput | null;
  recommendation: RecommendationResult | null;
  selectedPathway: PathwayType | null;
  reviewedChecklistIds: string[];
  handoverStatus: 'not_started' | 'scheduled' | 'transferred' | 'retained_at_home';
  handoverNotes: string;
  completionDate: string | null;
}

export interface PreparationStep {
  id: string;
  category: 'backup' | 'account' | 'erasure' | 'hardware' | 'packaging' | 'recipient';
  title: string;
  importance: 'essential' | 'recommended' | 'optional';
  summary: string;
  detailedInstructions: string[];
  applicableDevices: DeviceCategory[];
  officialLinks?: { label: string; url: string }[];
  criticalWarning?: string;
}

export interface ProviderRecord {
  id: string;
  name: string;
  organizationType: 'retail_tradein' | 'certified_recycler' | 'nonprofit_donation' | 'mailin_program' | 'municipal_depot' | 'repair_cafe';
  serviceTypeLabel: string;
  city: string;
  region: string;
  addressSnippet: string;
  deviceCategoriesAccepted: DeviceCategory[];
  conditionsAccepted: ('working' | 'broken' | 'any')[];
  financialModel: 'offers_payment_or_credit' | 'free_dropoff' | 'service_fee_possible' | 'tax_deductible_donation';
  financialNote: string;
  isDemoRecord: boolean;
  verificationBadgeText: string;
  whatToVerifyBeforeVisiting: string[];
  description: string;
  websiteUrl?: string;
}
