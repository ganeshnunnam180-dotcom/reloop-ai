import { JourneyState, AssessmentInput, RecommendationResult, PathwayType } from '@/types';

const STORAGE_KEY = 'reloop_user_journey_v1';

export function getDefaultJourneyState(): JourneyState {
  return {
    id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `journey-${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    currentStage: 1,
    assessment: null,
    recommendation: null,
    selectedPathway: null,
    reviewedChecklistIds: [],
    handoverStatus: 'not_started',
    handoverNotes: '',
    completionDate: null,
  };
}

export function loadJourney(): JourneyState {
  if (typeof window === 'undefined') {
    return getDefaultJourneyState();
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return getDefaultJourneyState();
    }
    const parsed = JSON.parse(raw);
    
    // Validate required fields to handle malformed data gracefully
    if (!parsed || typeof parsed !== 'object' || !Array.isArray(parsed.reviewedChecklistIds)) {
      console.warn('ReLoop: Malformed journey state encountered in localStorage. Resetting to defaults.');
      return getDefaultJourneyState();
    }

    return {
      id: parsed.id || `journey-${Date.now()}`,
      createdAt: parsed.createdAt || new Date().toISOString(),
      updatedAt: parsed.updatedAt || new Date().toISOString(),
      currentStage: typeof parsed.currentStage === 'number' && parsed.currentStage >= 1 && parsed.currentStage <= 5 ? parsed.currentStage : 1,
      assessment: parsed.assessment || null,
      recommendation: parsed.recommendation || null,
      selectedPathway: parsed.selectedPathway || null,
      reviewedChecklistIds: Array.isArray(parsed.reviewedChecklistIds) ? parsed.reviewedChecklistIds : [],
      handoverStatus: parsed.handoverStatus || 'not_started',
      handoverNotes: parsed.handoverNotes || '',
      completionDate: parsed.completionDate || null,
    };
  } catch (err) {
    console.error('ReLoop: Failed to parse localStorage journey data:', err);
    return getDefaultJourneyState();
  }
}

export function saveJourney(state: JourneyState): void {
  if (typeof window === 'undefined') return;
  try {
    const updated = {
      ...state,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('ReLoop: Failed to save journey to localStorage:', err);
  }
}

export function saveAssessmentResult(
  assessment: AssessmentInput,
  recommendation: RecommendationResult
): JourneyState {
  const current = loadJourney();
  const nextStage = Math.max(current.currentStage, 2) as 1 | 2 | 3 | 4 | 5;
  const updated: JourneyState = {
    ...current,
    assessment,
    recommendation,
    selectedPathway: current.selectedPathway || recommendation.primaryPathway,
    currentStage: nextStage,
  };
  saveJourney(updated);
  return updated;
}

export function setSelectedPathway(pathway: PathwayType): JourneyState {
  const current = loadJourney();
  const nextStage = Math.max(current.currentStage, 4) as 1 | 2 | 3 | 4 | 5;
  const updated: JourneyState = {
    ...current,
    selectedPathway: pathway,
    currentStage: nextStage,
  };
  saveJourney(updated);
  return updated;
}

export function toggleReviewedChecklistId(stepId: string): JourneyState {
  const current = loadJourney();
  const set = new Set(current.reviewedChecklistIds);
  if (set.has(stepId)) {
    set.delete(stepId);
  } else {
    set.add(stepId);
  }
  const reviewed = Array.from(set);
  const nextStage = reviewed.length > 0 ? (Math.max(current.currentStage, 3) as 1 | 2 | 3 | 4 | 5) : current.currentStage;
  const updated: JourneyState = {
    ...current,
    reviewedChecklistIds: reviewed,
    currentStage: nextStage,
  };
  saveJourney(updated);
  return updated;
}

export function updateHandoverAction(
  status: JourneyState['handoverStatus'],
  notes: string,
  completed: boolean
): JourneyState {
  const current = loadJourney();
  const updated: JourneyState = {
    ...current,
    handoverStatus: status,
    handoverNotes: notes,
    completionDate: completed ? (current.completionDate || new Date().toISOString()) : null,
    currentStage: completed ? 5 : current.currentStage,
  };
  saveJourney(updated);
  return updated;
}

export function resetEntireJourney(): JourneyState {
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.error(e);
    }
  }
  return getDefaultJourneyState();
}
