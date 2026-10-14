import { NextRequest, NextResponse } from 'next/server';
import { AssessmentInput, RecommendationResult } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const assessment: AssessmentInput = body.assessment;
    const recommendation: RecommendationResult = body.recommendation;

    if (!assessment || !recommendation) {
      return NextResponse.json(
        { error: 'Missing assessment or recommendation data' },
        { status: 400 }
      );
    }

    const deviceName = assessment.brandModel || recommendation.deviceSummary.categoryLabel;
    const priority = assessment.priority.replace(/_/g, ' ');

    // Check if an AI API key is configured
    const geminiKey = process.env.GEMINI_API_KEY;
    const _openaiKey = process.env.OPENAI_API_KEY;

    if (geminiKey) {
      try {
        const prompt = `You are ReLoop's technical assistant. Your goal is to explain the following structured electronic device transition decision with precision and honesty.
CRITICAL RULES:
1. Do NOT invent prices, exact carbon emission numbers, or specific external providers.
2. Do NOT claim 100% data security. Always remind the user that software resets are guidance and require user diligence.
3. Keep the tone helpful, objective, and realistic.
4. Output 2 to 3 concise, structured paragraphs explaining:
   - Why the pathway "${recommendation.pathwayTitle}" aligns with their priority ("${priority}") and condition ("${assessment.condition}").
   - The primary trade-off they should weigh.
   - The immediate first step before anything leaves their possession.

Device: ${deviceName}
Category: ${assessment.category}
Condition: ${assessment.condition}
Priority: ${priority}
Specific faults: ${assessment.knownFaultNotes || 'None reported'}
Battery status: ${assessment.batteryStatus || 'Unknown'}
Primary recommendation: ${recommendation.pathwayTitle}
Headline: ${recommendation.headline}
Base explanation: ${recommendation.explanation}`;

        const geminiRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
              generationConfig: {
                temperature: 0.3,
                maxOutputTokens: 500,
              },
            }),
            signal: AbortSignal.timeout(6000), // 6 second safety timeout
          }
        );

        if (geminiRes.ok) {
          const geminiData = await geminiRes.json();
          const generatedText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;
          if (generatedText && generatedText.trim().length > 30) {
            return NextResponse.json({
              source: 'ai_enhanced',
              text: generatedText.trim(),
              disclaimer: 'This tailored briefing was synthesized by AI using only the specific attributes of your device assessment.',
            });
          }
        }
      } catch (aiErr) {
        console.warn('ReLoop: External AI request failed or timed out. Falling back to deterministic synthesis:', aiErr);
      }
    }

    // High-quality deterministic fallback synthesis
    const fallbackText = generateDeterministicTailoredExplanation(assessment, recommendation);

    return NextResponse.json({
      source: 'deterministic_engine',
      text: fallbackText,
      disclaimer: 'This synthesis was generated directly by ReLoop’s verified decision matrix without external AI calls.',
    });
  } catch (error) {
    console.error('Error in /api/explain:', error);
    return NextResponse.json(
      { error: 'Internal server error processing explanation' },
      { status: 500 }
    );
  }
}

function generateDeterministicTailoredExplanation(
  assessment: AssessmentInput,
  recommendation: RecommendationResult
): string {
  const deviceName = assessment.brandModel || recommendation.deviceSummary.categoryLabel;
  const conditionDesc = assessment.condition === 'works_normally'
    ? 'is in full working order'
    : assessment.condition === 'works_with_issues'
    ? 'has functional defects'
    : assessment.condition === 'does_not_work'
    ? 'does not power on or function'
    : 'has an unverified operating status';

  const paragraphs: string[] = [];

  paragraphs.push(
    `Based on your assessment, your ${deviceName} ${conditionDesc}. Because your stated priority is to "${assessment.priority.replace(/_/g, ' ')}", our engine prioritized ${recommendation.pathwayTitle} as the most balanced option. This approach directly honors your goals while ensuring practical feasibility.`
  );

  if (recommendation.primaryPathway === 'resale') {
    paragraphs.push(
      `The key trade-off here is effort versus monetary return. Direct peer-to-peer sales yield higher returns but require photo staging and buyer communication, whereas retail trade-ins provide swift, guaranteed vouchers at a modest discount.`
    );
  } else if (recommendation.primaryPathway === 'repair_use') {
    paragraphs.push(
      `Before committing funds, request an itemized diagnostic estimate. A general rule of thumb is that if repair costs exceed 40% of the cost of a comparable refurbished model, repairing may not be financially optimal.`
    );
  } else if (recommendation.primaryPathway === 'donate') {
    paragraphs.push(
      `Donation provides immediate social utility. However, most receiving community partners require devices to be factory reset and de-linked from all personal cloud accounts so their volunteers can install fresh software without security locks.`
    );
  } else if (recommendation.primaryPathway === 'reuse_repurpose') {
    paragraphs.push(
      `Repurposing sidesteps the depreciation of old hardware by transforming it into a dedicated home utility—such as a smart speaker, secondary display, or security dashboard. It generates zero waste and requires zero external coordination.`
    );
  } else {
    paragraphs.push(
      `Certified material recycling ensures hazardous elements (such as lead and lithium) are safely captured rather than leaching in municipal landfills, while precious trace metals are recycled back into industrial supply chains.`
    );
  }

  paragraphs.push(
    `Next mandatory action: Prior to transferring or opening this hardware, review our preparation checklist to backup critical files and ensure that personal accounts and SIM cards are fully removed.`
  );

  return paragraphs.join('\n\n');
}
