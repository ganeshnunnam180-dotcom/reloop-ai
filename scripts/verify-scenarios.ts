import { evaluateAssessment } from '../src/lib/recommendationEngine';
import { AssessmentInput } from '../src/types';

function runTestSuite() {
  console.log('====================================================');
  console.log('RELOOP AI: SYSTEMATIC SCENARIO VERIFICATION');
  console.log('====================================================\n');

  // Test 1: Working Unused Smartphone
  console.log('TEST 1: Working Unused Smartphone (iPhone 13, Recover Value)');
  const input1: AssessmentInput = {
    category: 'smartphone',
    condition: 'works_normally',
    priority: 'recover_value',
    brandModel: 'iPhone 13',
    approxAgeYears: '2-4 years',
    powersOn: 'yes',
    screenCondition: 'flawless',
    batteryStatus: 'healthy',
    accountLockStatus: 'fully_accessible',
    hasPersonalData: 'yes',
  };
  const result1 = evaluateAssessment(input1);
  console.log('  → Primary Pathway:', result1.primaryPathway);
  console.log('  → Pathway Title:', result1.pathwayTitle);
  console.log('  → Headline:', result1.headline);
  if (result1.primaryPathway !== 'resale') {
    throw new Error('Test 1 Failed: Expected resale for working phone with recover_value');
  }
  console.log('  ✓ Test 1 Passed: Resale correctly recommended without forcing recycling.\n');

  // Test 2: Damaged Laptop with repair priority
  console.log('TEST 2: Damaged Laptop (ThinkPad T490, cracked screen, give useful life)');
  const input2: AssessmentInput = {
    category: 'laptop',
    condition: 'works_with_issues',
    priority: 'give_useful_life',
    brandModel: 'ThinkPad T490',
    approxAgeYears: '2-4 years',
    powersOn: 'yes',
    screenCondition: 'cracked_working',
    batteryStatus: 'drains_quickly',
    accountLockStatus: 'fully_accessible',
  };
  const result2 = evaluateAssessment(input2);
  console.log('  → Primary Pathway:', result2.primaryPathway);
  console.log('  → Pathway Title:', result2.pathwayTitle);
  console.log('  → Headline:', result2.headline);
  if (result2.primaryPathway !== 'reuse_repurpose' && result2.primaryPathway !== 'repair_use') {
    throw new Error('Test 2 Failed: Expected reuse_repurpose or repair_use');
  }
  console.log('  ✓ Test 2 Passed: Domestic repurposing / repair recommended considering trade-offs.\n');

  // Test 3: Dead / Severely Damaged Hardware
  console.log('TEST 3: Dead Hardware (No boot, dispose responsibly)');
  const input3: AssessmentInput = {
    category: 'laptop',
    condition: 'does_not_work',
    priority: 'dispose_responsibly',
    brandModel: 'Old Dell Inspiron',
    approxAgeYears: '8+ years',
    powersOn: 'no',
    batteryStatus: 'unknown',
  };
  const result3 = evaluateAssessment(input3);
  console.log('  → Primary Pathway:', result3.primaryPathway);
  console.log('  → Pathway Title:', result3.pathwayTitle);
  if (result3.primaryPathway !== 'responsible_recycling') {
    throw new Error('Test 3 Failed: Expected responsible_recycling for dead obsolete hardware');
  }
  console.log('  ✓ Test 3 Passed: Certified recycling recommended when hardware is dead.\n');

  // Test 4: Critical Safety - Swollen Lithium Battery
  console.log('TEST 4: Safety Critical - Swollen Battery');
  const input4: AssessmentInput = {
    category: 'smartphone',
    condition: 'works_with_issues',
    priority: 'recover_value',
    brandModel: 'Galaxy Note',
    batteryStatus: 'swollen_or_damaged',
  };
  const result4 = evaluateAssessment(input4);
  console.log('  → Primary Pathway:', result4.primaryPathway);
  console.log('  → Headline:', result4.headline);
  if (result4.primaryPathway !== 'responsible_recycling' || !result4.headline.includes('Safe Material Handling')) {
    throw new Error('Test 4 Failed: Expected hazardous battery dropoff priority');
  }
  console.log('  ✓ Test 4 Passed: Safety hazard overrides commercial resale safely.\n');

  // Test 5: Incomplete / Unsure Answers
  console.log('TEST 5: Incomplete / Unsure Condition & Help Me Decide');
  const input5: AssessmentInput = {
    category: 'tablet',
    condition: 'unsure',
    priority: 'help_me_decide',
    powersOn: 'unsure',
  };
  const result5 = evaluateAssessment(input5);
  console.log('  → Primary Pathway:', result5.primaryPathway);
  console.log('  → Headline:', result5.headline);
  console.log('  → Missing Info Count:', result5.missingInformation.length);
  if (result5.primaryPathway !== 'diagnostic') {
    throw new Error('Test 5 Failed: Expected diagnostic check for unsure condition');
  }
  console.log('  ✓ Test 5 Passed: Diagnostic verification recommended before committing.\n');

  // Test 6: Account Locked Device
  console.log('TEST 6: Account / Password Locked Device');
  const input6: AssessmentInput = {
    category: 'smartphone',
    condition: 'works_normally',
    priority: 'recover_value',
    accountLockStatus: 'locked_or_password_lost',
  };
  const result6 = evaluateAssessment(input6);
  console.log('  → Primary Pathway:', result6.primaryPathway);
  console.log('  → Headline:', result6.headline);
  if (result6.primaryPathway !== 'diagnostic') {
    throw new Error('Test 6 Failed: Expected account recovery / diagnostic for locked device');
  }
  console.log('  ✓ Test 6 Passed: Unlocking prerequisite highlighted before transfer.\n');

  // Test 7: Unsupported / Other Category
  console.log('TEST 7: Other / Custom Category (Analog Audio Receiver)');
  const input7: AssessmentInput = {
    category: 'other',
    categoryCustomName: 'Analog Audio Receiver',
    condition: 'works_normally',
    priority: 'give_useful_life',
  };
  const result7 = evaluateAssessment(input7);
  console.log('  → Device Summary Label:', result7.deviceSummary.brandModel);
  console.log('  → Primary Pathway:', result7.primaryPathway);
  if (result7.deviceSummary.brandModel !== 'Analog Audio Receiver') {
    throw new Error('Test 7 Failed: Custom category label not reflected');
  }
  console.log('  ✓ Test 7 Passed: Custom category respected with general guidance.\n');

  console.log('====================================================');
  console.log('ALL 7 SYSTEMATIC SCENARIOS PASSED WITH 100% SUCCESS!');
  console.log('====================================================');
}

runTestSuite();
