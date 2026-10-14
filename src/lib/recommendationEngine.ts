import {
  AssessmentInput,
  RecommendationResult,
  PathwayType,
  PathwayDetail,
  ViabilityLevel,
  DeviceCategory,
} from '@/types';

const CATEGORY_NAMES: Record<DeviceCategory, string> = {
  smartphone: 'Smartphone',
  laptop: 'Laptop / Computer',
  tablet: 'Tablet',
  tv_monitor: 'Television / Monitor',
  other: 'Electronic Device',
};

export function evaluateAssessment(input: AssessmentInput): RecommendationResult {
  const categoryLabel = input.category === 'other' && input.categoryCustomName
    ? input.categoryCustomName
    : CATEGORY_NAMES[input.category] || 'Electronic Device';

  const brandModelLabel = input.brandModel?.trim() || categoryLabel;
  const isSmartphoneOrLaptop = input.category === 'smartphone' || input.category === 'laptop';
  const isSwollenBattery = input.batteryStatus === 'swollen_or_damaged';
  const isPasswordLocked = input.accountLockStatus === 'locked_or_password_lost';
  const doesNotTurnOn = input.powersOn === 'no' || input.condition === 'does_not_work';
  const isUnsureCondition = input.condition === 'unsure' || input.powersOn === 'unsure';
  const hasMinorIssues = input.condition === 'works_with_issues';

  // Determine Primary Pathway
  let primaryPathway: PathwayType;
  let headline = '';
  let explanation = '';
  const rationalePoints: string[] = [];
  const missingInformation: string[] = [];
  const importantTradeoffs: string[] = [];
  const potentialBenefits: string[] = [];

  // Critical Safety Branch: Swollen or damaged lithium battery
  if (isSwollenBattery) {
    primaryPathway = 'responsible_recycling';
    headline = 'Safe Material Handling & Battery E-Waste Drop-Off';
    explanation = `The battery on your ${brandModelLabel} has been reported as swollen or physically compromised. A swollen lithium-ion battery poses a chemical and thermal combustion risk. We strongly advise against attempting to charge, power, or repair this battery at home. The safest next step is taking the unit to an authorized hazardous waste drop-off or certified technician who handles pressurized lithium cells safely.`;
    rationalePoints.push('Swollen lithium cells can vent hazardous gases or cause fires if punctured or charged.');
    rationalePoints.push('Standard postal couriers prohibit shipping compromised lithium-ion batteries.');
    rationalePoints.push('Specialized municipal or certified R2/e-Stewards facilities can stabilize and recycle the materials safely.');
    importantTradeoffs.push('Immediate financial recovery is virtually zero; personal safety and environmental containment take absolute precedence.');
    importantTradeoffs.push('Do not attempt to pierce, compress, or submerge the battery in water.');
    potentialBenefits.push('Prevents household fire hazard and ensures toxic electrolyte is safely neutralised.');
  } 
  // Password Locked / Account Locked Branch
  else if (isPasswordLocked && isSmartphoneOrLaptop) {
    primaryPathway = 'diagnostic';
    headline = 'Account Recovery or De-linking Required Before Transfer';
    explanation = `Your ${brandModelLabel} is currently locked by a forgotten password or manufacturer activation lock (e.g. Apple iCloud Activation Lock or Google FRP). In this state, secondary markets, charity organizations, and repair shops cannot legitimately reassign or reuse the device without original proof of purchase.`;
    rationalePoints.push('Modern smartphones and laptops have anti-theft cryptographic locks that brick the operating system for third parties.');
    rationalePoints.push('Resale platforms and donation centers routinely reject or scrap activation-locked devices.');
    rationalePoints.push('Resolving the lock via the manufacturer account unlocks substantial reuse and value potential.');
    missingInformation.push('Whether original purchase documentation or access to the linked recovery email is retrievable.');
    importantTradeoffs.push('Spending time recovering credentials versus proceeding directly to parts-salvage or recycling.');
    potentialBenefits.push('Unlocking the device restores full resale, donation, and everyday utility options.');
  }
  // Does Not Work / Hardware Failure Branch
  else if (doesNotTurnOn) {
    if (input.priority === 'recover_value') {
      primaryPathway = 'resale';
      headline = 'Parts-Only Salvage or Manufacturer Trade-In Credit';
      explanation = `Since your ${brandModelLabel} does not power on, general consumer resale is not feasible. However, specialized buyers, refurbishers, and hobbyists often purchase non-working units for intact display panels, chassis parts, or camera modules. Alternatively, official manufacturer trade-in programs sometimes offer gift card credits or store discount vouchers even for non-functional hardware.`;
      rationalePoints.push('Repairing a non-booting motherboard frequently exceeds fair market value.');
      rationalePoints.push('Selling "for parts or not working" via transparent marketplaces prevents buyer disputes.');
      rationalePoints.push('Manufacturer trade-ins provide guaranteed baseline credit without peer-to-peer hassle.');
      missingInformation.push('Exact root cause of failure (power supply, charging port, liquid damage, or dead mainboard).');
      missingInformation.push('Whether sensitive unencrypted storage remains readable on internal flash memory.');
      importantTradeoffs.push('Financial returns for non-working hardware are modest compared to functional devices.');
      potentialBenefits.push('Keeps usable micro-components in circulation while yielding modest recovery.');
    } else {
      primaryPathway = 'responsible_recycling';
      headline = 'Certified E-Waste Recycling & Material Recovery';
      explanation = `Because your ${brandModelLabel} is non-functional and repair is unlikely to be economically viable, responsible collection through a certified e-waste partner is the most sensible path. Certified recyclers shred and separate metals (copper, gold, rare earth elements) and safely isolate heavy metals.`;
      rationalePoints.push('Prevents toxic electronic waste from reaching municipal landfills.');
      rationalePoints.push('Recovers critical raw minerals to reduce virgin open-pit mining needs.');
      rationalePoints.push('Simplest logistics when the device no longer holds functional value.');
      missingInformation.push('Whether personal data can be physically destroyed or if internal drive can be removed.');
      importantTradeoffs.push('No direct financial compensation or recipient reuse.');
      potentialBenefits.push('Verified environmental stewardship and zero domestic clutter.');
    }
  }
  // Unsure condition branch
  else if (isUnsureCondition) {
    primaryPathway = 'diagnostic';
    headline = 'Quick Physical Inspection & Function Check';
    explanation = `Because the operating state of your ${brandModelLabel} is uncertain, committing to resale, repair, or recycling right now risks either leaving value on the table or passing on a broken device. A brief 5-minute functional check (powering on, testing touch/screen, and verifying battery charge) will determine the exact pathway.`;
    rationalePoints.push('Working devices command significantly higher resale and donation utility than unverified devices.');
    rationalePoints.push('Knowing whether it powers on determines whether data can be securely erased through standard software tools.');
    missingInformation.push('Does the device charge and display a boot screen?');
    missingInformation.push('Is the internal battery holding a charge for more than 15 minutes?');
    missingInformation.push('Can user accounts be removed from the settings menu?');
    importantTradeoffs.push('A small investment of time testing the device versus immediate convenient recycling.');
    potentialBenefits.push('Prevents prematurely discarding a device that might have years of useful life remaining.');
  }
  // Works with issues branch
  else if (hasMinorIssues) {
    if (input.priority === 'recover_value') {
      if (input.approxAgeYears === '< 2 years' || input.approxAgeYears === '2-4 years') {
        primaryPathway = 'repair_use';
        headline = 'Targeted Repair or As-Is Trade-In';
        explanation = `Your ${brandModelLabel} has relatively modern hardware despite its current defect. If the fault is isolated to a common component (like a cracked glass lens or aged battery), independent repair or certified refurbishment may be cost-effective. Alternatively, trade-in programs often deduct a fixed repair charge while still returning net value.`;
        rationalePoints.push('Modern smartphones and laptops retain significant secondary value even with repair deductions.');
        rationalePoints.push('Battery or screen replacements are standardized for popular brands.');
        missingInformation.push('Official repair quotation versus independent third-party technician estimates.');
        importantTradeoffs.push('Upfront repair cost carries risk if unknown secondary issues exist.');
        potentialBenefits.push('Restores full daily functionality or maximizes net resale proceeds.');
      } else {
        primaryPathway = 'resale';
        headline = 'Sell As-Is with Transparent Fault Disclosure';
        explanation = `For an older ${brandModelLabel} with existing issues, sinking money into professional repair rarely yields a positive return on investment. The most practical approach is listing it as-is with candid descriptions of all known faults, targeting buyers who enjoy DIY repairs or need spare parts.`;
        rationalePoints.push('Repair costs frequently exceed the final post-repair market price for older electronics.');
        rationalePoints.push('Transparent defect listing protects you from return disputes.');
        missingInformation.push('Current market pricing for this specific model in fair/poor condition.');
        importantTradeoffs.push('Lower sale price in exchange for zero repair expenditure and fast turnaround.');
        potentialBenefits.push('Recovers modest cash without risk of throwing good money after bad.');
      }
    } else if (input.priority === 'give_useful_life') {
      primaryPathway = 'reuse_repurpose';
      headline = 'Repurpose for Dedicated or Secondary Utility';
      explanation = `Even if your ${brandModelLabel} has a defect (such as a weak battery or cracked screen), it can frequently serve excellent secondary roles at home where mobility or perfect aesthetics are unnecessary. For example, a laptop with a broken screen works seamlessly plugged into a television via HDMI; an old phone can become a high-definition webcam, dedicated audio streamer, or home automation dashboard.`;
      rationalePoints.push('Avoids the financial cost and environmental impact of buying a new single-purpose gadget.');
      rationalePoints.push('Hardware flaws that ruin daily pocket use are often completely irrelevant for stationary desktop roles.');
      missingInformation.push('Whether the specific fault interferes with stationary power or display output.');
      importantTradeoffs.push('Requires initial setup time and keeps an extra device in the home.');
      potentialBenefits.push('Zero financial expense, creative second life, and zero e-waste generation.');
    } else {
      primaryPathway = 'responsible_recycling';
      headline = 'Responsible Collection & Component Recovery';
      explanation = `Given the defect and your priority to manage the device responsibly without ongoing fuss, sending your ${brandModelLabel} to an authorized electronics recycler ensures that functional components are harvested for spares and remaining materials are processed responsibly.`;
      rationalePoints.push('Ensures no toxic heavy metals enter municipal waste streams.');
      rationalePoints.push('Eliminates the mental overhead of troubleshooting, repairing, or listing defective goods.');
      importantTradeoffs.push('Foregoes potential residual value or DIY repurposing.');
      potentialBenefits.push('Fast, responsible, and compliant environmental disposal.');
    }
  }
  // Works normally branch
  else {
    if (input.priority === 'recover_value') {
      primaryPathway = 'resale';
      headline = 'Direct Peer-to-Peer Resale or Trade-In Program';
      explanation = `Because your ${brandModelLabel} is fully operational, it holds viable consumer utility. Selling directly through peer-to-peer marketplaces (e.g. Swappa, eBay, local classifieds) offers the highest cash recovery, whereas official carrier/manufacturer trade-in programs provide immediate, low-friction store credits.`;
      rationalePoints.push('Fully functioning devices have active secondary buyer demand.');
      rationalePoints.push('Keeps quality technology in productive use without manufacturing replacements.');
      missingInformation.push('Current local secondary market supply and pricing trends for this specific configuration.');
      missingInformation.push('Original packaging, charger, and cable availability (which elevate resale value).');
      importantTradeoffs.push('Peer-to-peer sales require photo staging, buyer communication, and shipping effort.');
      importantTradeoffs.push('Trade-ins offer lower monetary yield but immediate, frictionless settlement.');
      potentialBenefits.push('Highest potential monetary recovery and direct extension of product lifespan.');
    } else if (input.priority === 'give_useful_life') {
      primaryPathway = 'donate';
      headline = 'Direct Donation to Digital Inclusion Programs';
      explanation = `Your working ${brandModelLabel} can make a tangible difference for students, community libraries, or non-profit educational initiatives. Community refurbishers sanitize software and redistribute working technology to individuals who lack digital access.`;
      rationalePoints.push('Directly bridges the digital divide for students or job seekers.');
      rationalePoints.push('High social return on an item that would otherwise gather dust in a drawer.');
      missingInformation.push('Whether local donation partners accept this specific hardware generation.');
      missingInformation.push('Whether you have original charging cables required by most intake programs.');
      importantTradeoffs.push('No direct financial gain; potential tax donation receipt depending on local tax jurisdiction.');
      importantTradeoffs.push('Must perform complete data wipe and account unlinking before handover.');
      potentialBenefits.push('Maximizes human benefit and community empowerment.');
    } else if (input.priority === 'dispose_responsibly') {
      primaryPathway = 'reuse_repurpose';
      headline = 'Consider Reuse Before Recycling';
      explanation = `Although your goal is responsible disposal, your ${brandModelLabel} is in good working order. Recycling a fully functional device prematurely consumes substantial energy shredding and smelting parts that took tremendous resources to manufacture. Giving it a second life—by passing it to a family member, donating, or repurposing—is environmentally superior to premature material recycling.`;
      rationalePoints.push('The electronics waste hierarchy prioritizes Prevention and Reuse far above Material Recycling.');
      rationalePoints.push('Up to 80% of a digital device’s lifetime carbon footprint occurs during manufacturing and raw material extraction.');
      rationalePoints.push('Keeping functional hardware active delays the manufacturing footprint of replacement items.');
      importantTradeoffs.push('Requires finding a recipient or finding a secondary utility role.');
      potentialBenefits.push('Greatest overall lifecycle environmental conservation.');
    } else {
      // Help me decide
      if (input.approxAgeYears === '5-7 years' || input.approxAgeYears === '8+ years') {
        primaryPathway = 'reuse_repurpose';
        headline = 'Home Repurposing or Community Donation';
        explanation = `Your ${brandModelLabel} still works, but due to its age, resale market value is modest. The most rewarding path is either donating to an organization with relaxed software requirements or turning it into a dedicated home device (smart alarm, media player, or digital photo frame).`;
        rationalePoints.push('Older operating systems may no longer receive official security patches for banking apps.');
        rationalePoints.push('Repurposing for non-sensitive tasks sidesteps software obsolescence.');
        potentialBenefits.push('Free utility without clutter or premature e-waste generation.');
      } else {
        primaryPathway = 'resale';
        headline = 'Resale or Manufacturer Trade-In';
        explanation = `With normal working condition and relatively recent hardware, your ${brandModelLabel} is an ideal candidate for resale or trade-in. This delivers monetary return while providing someone else with affordable technology.`;
        rationalePoints.push('Healthy functional devices retain strong demand.');
        rationalePoints.push('Trade-ins provide convenient store vouchers toward future purchases.');
        potentialBenefits.push('Financial return and extended device lifecycle.');
      }
    }
  }

  // Construct All 5 Pathway Details for Comparative Matrix
  const allPathways: PathwayDetail[] = [
    {
      id: 'resale',
      title: 'Resale & Trade-In',
      tagline: 'Sell peer-to-peer or exchange for retailer trade-in credit',
      viability: calculateResaleViability(input),
      viabilityReason: getResaleReason(input),
      effort: 'moderate',
      estimatedReturn: getEstimatedReturnText(input),
      prerequisites: [
        'Device must be removed from iCloud/Google/Microsoft accounts',
        'Factory reset must be completed',
        'Physical cosmetic condition accurately photographed',
      ],
      keyTradeoffs: [
        'Peer-to-peer requires managing buyer messages and shipping',
        'Trade-in programs pay less than direct market rates',
      ],
      recommendedWhen: 'Device works normally or has minor flaws, is under 5 years old, and accounts are unlocked.',
    },
    {
      id: 'repair_use',
      title: 'Targeted Repair',
      tagline: 'Fix specific flaws to continue using or increase resale value',
      viability: calculateRepairViability(input),
      viabilityReason: getRepairReason(input),
      effort: 'high',
      estimatedReturn: 'Restores utility; monetary value depends on repair quote vs market value',
      prerequisites: [
        'Obtain independent repair quote before committing',
        'Confirm replacement parts are available for your model',
        'Verify repair warranty (minimum 90 days recommended)',
      ],
      keyTradeoffs: [
        'Screen/motherboard repairs can cost 50%+ of device worth',
        'Unforeseen internal faults may appear during service',
      ],
      recommendedWhen: 'Defect is isolated (e.g. battery or port), repair quote is below 40% of replacement cost.',
    },
    {
      id: 'donate',
      title: 'Charitable Donation',
      tagline: 'Pass to non-profits, schools, or digital inclusion schemes',
      viability: calculateDonateViability(input),
      viabilityReason: getDonateReason(input),
      effort: 'low',
      estimatedReturn: 'Social impact; possible tax deduction receipt where applicable',
      prerequisites: [
        'Complete data sanitization and account removal',
        'Include functional charging cable if requested by intake rules',
        'Check specific organization device acceptance list',
      ],
      keyTradeoffs: [
        'No direct financial payout',
        'Most charities cannot accept broken or locked devices',
      ],
      recommendedWhen: 'Device functions reliably, is moderately modern, and you want to support digital access.',
    },
    {
      id: 'reuse_repurpose',
      title: 'Repurpose at Home',
      tagline: 'Give it a dedicated second job in your household or workspace',
      viability: calculateReuseViability(input),
      viabilityReason: getReuseReason(input),
      effort: 'low',
      estimatedReturn: 'Saves purchase cost of new single-purpose hardware',
      prerequisites: [
        'Identify a dedicated role (webcam, media streamer, smart clock)',
        'Uninstall unneeded apps and restrict sensitive accounts',
        'Verify battery health if leaving connected to continuous power',
      ],
      keyTradeoffs: [
        'Keeps another gadget in the home instead of clearing space',
        'Requires minor initial configuration',
      ],
      recommendedWhen: 'Device has aesthetic or battery flaws that do not hinder stationary or single-task utility.',
    },
    {
      id: 'responsible_recycling',
      title: 'Certified E-Waste Recycling',
      tagline: 'Drop off at an R2/e-Stewards certified facility or municipal depot',
      viability: calculateRecyclingViability(input),
      viabilityReason: getRecyclingReason(input),
      effort: 'low',
      estimatedReturn: 'No financial payment; certified toxic diversion & raw mineral recovery',
      prerequisites: [
        'Check whether batteries must be removed or insulated with tape',
        'Confirm accepted items list with the specific depot',
        'Ensure SIM/SD cards are physically removed',
      ],
      keyTradeoffs: [
        'Destroys potential remaining utility of functioning hardware',
        'No financial compensation in standard municipal drop-offs',
      ],
      recommendedWhen: 'Hardware is non-functional, obsolete, physically broken, or contains hazardous battery.',
    },
  ];

  // Specific Actionable Steps
  const actionableSteps = generateActionableSteps(primaryPathway, input);

  // Uncertainty Analysis (Calibrated language, no manufactured %s)
  const uncertaintyAnalysis = generateUncertaintyAnalysis(input, primaryPathway);

  return {
    deviceSummary: {
      category: input.category,
      categoryLabel,
      brandModel: brandModelLabel,
      condition: input.condition,
      priority: input.priority,
    },
    primaryPathway,
    pathwayTitle: allPathways.find(p => p.id === primaryPathway)?.title || 'Recommended Pathway',
    headline,
    explanation,
    rationalePoints,
    allPathways,
    potentialBenefits,
    importantTradeoffs,
    missingInformation,
    uncertaintyAnalysis,
    actionableSteps,
    generatedAt: new Date().toISOString(),
  };
}

// Helper calculation functions

function calculateResaleViability(input: AssessmentInput): ViabilityLevel {
  if (input.batteryStatus === 'swollen_or_damaged') return 'not_recommended';
  if (input.accountLockStatus === 'locked_or_password_lost') return 'conditional';
  if (input.powersOn === 'no' || input.condition === 'does_not_work') return 'conditional'; // parts only
  if (input.condition === 'works_normally') return 'recommended';
  if (input.condition === 'works_with_issues') return 'viable';
  return 'conditional';
}

function getResaleReason(input: AssessmentInput): string {
  if (input.batteryStatus === 'swollen_or_damaged') {
    return 'Unsafe to ship or sell due to hazardous swollen battery.';
  }
  if (input.accountLockStatus === 'locked_or_password_lost') {
    return 'Secondary buyers cannot activate a password-locked device.';
  }
  if (input.condition === 'does_not_work' || input.powersOn === 'no') {
    return 'Viable only as parts-salvage or retailer trade-in recycle credit.';
  }
  if (input.condition === 'works_normally') {
    return 'High buyer demand for fully operational devices.';
  }
  return 'Viable with transparent defect disclosure or trade-in deduction.';
}

function calculateRepairViability(input: AssessmentInput): ViabilityLevel {
  if (input.batteryStatus === 'swollen_or_damaged') return 'conditional'; // professional battery removal
  if (input.condition === 'works_normally') return 'not_recommended'; // no repair needed
  if (input.condition === 'works_with_issues') return 'viable';
  if (input.condition === 'does_not_work') return 'conditional';
  return 'conditional';
}

function getRepairReason(input: AssessmentInput): string {
  if (input.condition === 'works_normally') {
    return 'Device operates normally; repair is unnecessary.';
  }
  if (input.batteryStatus === 'swollen_or_damaged') {
    return 'Requires professional hazardous battery replacement; do not DIY.';
  }
  if (input.condition === 'works_with_issues') {
    return 'Feasible if repair cost is under 40% of replacement value.';
  }
  return 'Cost-effectiveness is uncertain without technician diagnostic bench testing.';
}

function calculateDonateViability(input: AssessmentInput): ViabilityLevel {
  if (input.batteryStatus === 'swollen_or_damaged') return 'not_recommended';
  if (input.accountLockStatus === 'locked_or_password_lost') return 'not_recommended';
  if (input.condition === 'does_not_work' || input.powersOn === 'no') return 'not_recommended';
  if (input.condition === 'works_normally') return 'recommended';
  if (input.condition === 'works_with_issues') return 'conditional';
  return 'conditional';
}

function getDonateReason(input: AssessmentInput): string {
  if (input.condition === 'does_not_work' || input.powersOn === 'no') {
    return 'Donation centers do not have resources to repair dead hardware.';
  }
  if (input.accountLockStatus === 'locked_or_password_lost') {
    return 'Charities cannot distribute activation-locked devices.';
  }
  if (input.condition === 'works_normally') {
    return 'Ideal candidate for community digital inclusion programs.';
  }
  return 'Most recipients require devices to boot and hold a charge.';
}

function calculateReuseViability(input: AssessmentInput): ViabilityLevel {
  if (input.batteryStatus === 'swollen_or_damaged') return 'not_recommended';
  if (input.condition === 'does_not_work' && input.powersOn === 'no') return 'not_recommended';
  if (input.condition === 'works_normally') return 'recommended';
  return 'viable';
}

function getReuseReason(input: AssessmentInput): string {
  if (input.batteryStatus === 'swollen_or_damaged') {
    return 'Safety hazard precludes keeping swollen battery in home.';
  }
  if (input.condition === 'does_not_work' && input.powersOn === 'no') {
    return 'Cannot be repurposed without operational power.';
  }
  return 'Stationary tasks (media streamer, webcam, monitor) bypass many mobile defects.';
}

function calculateRecyclingViability(input: AssessmentInput): ViabilityLevel {
  if (input.batteryStatus === 'swollen_or_damaged') return 'recommended';
  if (input.condition === 'does_not_work' || input.powersOn === 'no') return 'recommended';
  if (input.condition === 'works_normally' && input.priority === 'recover_value') return 'not_recommended';
  return 'viable';
}

function getRecyclingReason(input: AssessmentInput): string {
  if (input.batteryStatus === 'swollen_or_damaged') {
    return 'Safest and most urgent pathway for compromised lithium batteries.';
  }
  if (input.condition === 'does_not_work' || input.powersOn === 'no') {
    return 'Optimal destination for dead hardware to recover copper, gold, and tin.';
  }
  if (input.condition === 'works_normally') {
    return 'Permissible, though reuse or resale yields higher environmental efficiency.';
  }
  return 'Always available as a safe baseline when other pathways are rejected.';
}

function getEstimatedReturnText(input: AssessmentInput): string {
  if (input.condition === 'does_not_work') {
    return 'Low / Parts-Only (Typically £5–£35 or modest store voucher)';
  }
  if (input.condition === 'works_with_issues') {
    return 'Fair / Discounted (Subject to estimated repair deductions)';
  }
  if (input.approxAgeYears === '< 2 years') {
    return 'High (Recent generation devices maintain 40–70% of retail price)';
  }
  if (input.approxAgeYears === '2-4 years') {
    return 'Moderate (Steady secondary demand on active marketplaces)';
  }
  return 'Modest (Older generations yield lower cash but immediate clearance)';
}

function generateActionableSteps(
  pathway: PathwayType,
  _input: AssessmentInput
): RecommendationResult['actionableSteps'] {
  const steps: RecommendationResult['actionableSteps'] = [];

  // Step 1: Preparation is always first
  steps.push({
    id: 'prep_data',
    title: 'Review Data & Security Preparation Checklist',
    description: 'Ensure personal data, cloud accounts, and SIM cards are removed prior to any transfer or repair.',
    actionType: 'prepare',
    linkUrl: '/prepare',
  });

  if (pathway === 'resale') {
    steps.push({
      id: 'resale_quotes',
      title: 'Compare Direct Resale vs Retail Trade-In',
      description: 'Check benchmark trade-in quotes from official outlets or assess peer-to-peer listing prices.',
      actionType: 'quote',
    });
    steps.push({
      id: 'find_outlet',
      title: 'Select Trade-in or Shipping Method',
      description: 'Review verified collection locations and mail-in options accepting your device condition.',
      actionType: 'collection',
      linkUrl: '/collection',
    });
  } else if (pathway === 'repair_use') {
    steps.push({
      id: 'repair_quote',
      title: 'Request Preliminary Diagnostic Quotation',
      description: 'Obtain an itemized parts-and-labour estimate before authorizing service.',
      actionType: 'quote',
    });
    steps.push({
      id: 'local_repair',
      title: 'Locate Certified Technicians or Repair Cafés',
      description: 'Explore community repair initiatives or authorized manufacturer service centers.',
      actionType: 'collection',
      linkUrl: '/collection',
    });
  } else if (pathway === 'donate') {
    steps.push({
      id: 'verify_charity',
      title: 'Confirm Charity Device Intake Criteria',
      description: 'Contact local digital inclusion programs to confirm they accept your exact model and accessories.',
      actionType: 'collection',
      linkUrl: '/collection',
    });
  } else if (pathway === 'reuse_repurpose') {
    steps.push({
      id: 'configure_app',
      title: 'Configure Dedicated Setup',
      description: 'Strip unnecessary software, enable kiosk/stationary mode, and connect to permanent power.',
      actionType: 'custom',
    });
  } else if (pathway === 'responsible_recycling') {
    steps.push({
      id: 'locate_recycler',
      title: 'Identify Certified E-Waste Drop-Off Point',
      description: 'Find municipal depots or certified recyclers adhering to strict environmental standards.',
      actionType: 'collection',
      linkUrl: '/collection',
    });
  } else {
    // Diagnostic
    steps.push({
      id: 'check_power',
      title: 'Perform Basic Power & Display Test',
      description: 'Connect to verified working charger for 20 minutes to confirm whether mainboard boots.',
      actionType: 'custom',
    });
  }

  return steps;
}

function generateUncertaintyAnalysis(input: AssessmentInput, _pathway: PathwayType): string {
  const parts: string[] = [];

  parts.push('Confidence Assessment (Qualitative):');
  
  if (input.batteryStatus === 'swollen_or_damaged') {
    parts.push('High certainty regarding safety hazards. Pressurized lithium-ion cells require immediate caution.');
  } else if (input.condition === 'works_normally') {
    parts.push('High certainty regarding baseline device viability. Normal operation provides multiple flexible pathways.');
  } else if (input.condition === 'does_not_work') {
    parts.push('High certainty that general consumer resale is unviable; moderate uncertainty regarding parts salvage value.');
  } else {
    parts.push('Moderate certainty. Feasibility hinges on the precise nature of the internal fault and repair parts pricing.');
  }

  parts.push(
    'Note: ReLoop does not verify market quotes, technician labor rates, or provider opening hours. All pricing estimates reflect general market guidelines rather than guaranteed transactions.'
  );

  return parts.join(' ');
}
