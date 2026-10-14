# ReLoop AI — Informed Electronics Decision Guidance

> **Event:** PromptWars  
> **Role:** Senior Full-Stack Engineer, AI Product Architect, UX Designer, and QA Engineer  
> **Platform:** Next.js (App Router), React 19, TypeScript, Tailwind CSS, Lucide React

---

## 1. The Problem

Millions of unused electronic devices languish in household drawers and storage boxes. People often keep unused devices not out of apathy, but because the next step is fraught with uncertainty:
- **Unclear Trade-Offs:** Is it worth repairing a cracked screen or weak battery, or will repair labor exceed the device's remaining market value?
- **Data Privacy Anxiety:** Fear that personal photos, banking sessions, or cloud accounts might linger on hardware after disposal.
- **Logistical Friction:** Unclear local drop-off rules, confusing activation lock requirements, and untrustworthy trade-in quotes.

When faced with this friction, devices are neither reused nor recycled—they languish until their batteries degrade, rendering them permanently obsolete.

---

## 2. Product Vision & Principles

**ReLoop** helps people make informed decisions about unused electronic devices and identify practical next steps.

### Core Principles
1. **Never Default to Recycling:** Up to 80% of a digital device's lifetime carbon footprint occurs during manufacturing and raw material extraction. Shredding and smelting a functioning phone or laptop destroys that embedded energy. ReLoop evaluates reuse, resale, and repair first.
2. **Deterministic Recommendation Engine:** Hardcoded in TypeScript with explicit decision rules. It never hallucinates providers, invents prices, or ignores safety flags.
3. **Safety-First Battery Handling:** Swollen or compromised lithium-ion batteries are immediately flagged with urgent hazardous material drop-off protocols, prohibiting regular post shipping.
4. **Calibrated, Honest Communication:** No manufactured carbon offset statistics (e.g. "You saved 42 kg of CO2"), no fake user testimonials, and no false "100% Data Secure" guarantees.
5. **No Account Required:** Completely accessible without registration; journey state is safely persisted in the user's browser `localStorage`.

---

## 3. The 7-Step Core User Journey

1. **Device Assessment (`/assess`):** Guided 5-step assessment (Category, Condition & Diagnostics, Priority, Details & Location, Review) with back navigation, step validation, and review summary.
2. **Understanding Priorities:** Differentiates between recovering monetary value, social donation/reuse, responsible disposal, and objective comparison.
3. **Comparing Relevant Pathways:** Full side-by-side matrix across 5 pathways:
   - **Resale & Trade-In** (Peer-to-peer marketplaces and direct retail buybacks)
   - **Targeted Repair** (Restoring specific faults economically)
   - **Charitable Donation** (Digital inclusion for students and non-profits)
   - **Repurpose at Home** (Smart speaker, webcam, home automation dashboard)
   - **Certified Recycling** (Zero-landfill R2/e-Stewards material recovery)
4. **Personalized Explanation (`/results`):** Tailored rationale, trade-off breakdowns, missing information disclosures, qualitative uncertainty analysis, and actionable next steps.
5. **Device Preparation Assistant (`/prepare`):** 6-topic checklist covering backups, account unlinking (iCloud / Google FRP / BitLocker), cryptographic factory resets, SIM removal, battery safety, and recipient verification with official manufacturer links.
6. **Collection Options Directory (`/collection`):** Clean, filterable directory with demonstration and verified archetypes by category, service type, city, and accepted condition, complete with a pre-visit verification modal.
7. **My Journey Tracker (`/journey`):** Local lifecycle tracker persisting the 5 stages (Assessed, Compared, Prepared, Selected, Logged) with self-reporting disclosures and reset capabilities.

---

## 4. Technical Architecture

- **Framework:** Next.js 16 (App Router with Turbopack)
- **UI & Components:** React 19, Vanilla Tailwind CSS (v4), Lucide React
- **Language:** TypeScript 5 with strict typings for all assessment inputs, pathway viability, and provider records
- **Persistence:** Browser `localStorage` with safe JSON parsing, schema fallbacks, and zero external database dependency
- **Recommendation Engine (`src/lib/recommendationEngine.ts`):** Pure deterministic function isolating business logic from UI components
- **Server-Side AI Hybrid (`src/app/api/explain`):** Works 100% reliably out of the box with zero external API key via a deterministic synthesis engine; optionally connects to Google Gemini / OpenAI when environment keys are supplied.

---

## 5. Project Structure

```
reloop-ai/
├── src/
│   ├── app/
│   │   ├── page.tsx               # Home landing page with benefits & category quick-start
│   │   ├── layout.tsx             # Root layout with navbar, footer, metadata
│   │   ├── globals.css            # Design system, warm palette, accessible focus
│   │   ├── assess/page.tsx        # 5-step guided assessment wizard
│   │   ├── results/page.tsx       # Personalized results & comparative matrix
│   │   ├── prepare/page.tsx       # Preparation checklist with manufacturer docs
│   │   ├── collection/page.tsx    # Filterable collection directory & verification modal
│   │   ├── journey/page.tsx       # 5-stage transition progress tracker
│   │   ├── about/page.tsx         # Problem, hierarchy, methodology & ethics
│   │   └── api/explain/route.ts   # Server-side AI endpoint with deterministic fallback
│   ├── components/
│   │   ├── Navbar.tsx             # Responsive header with live journey progress pill
│   │   └── Footer.tsx             # Disclosures, advisory notices, navigation
│   ├── data/
│   │   ├── preparationSteps.ts    # Official manufacturer instructions & security steps
│   │   └── providers.ts           # Structured collection directory dataset
│   ├── lib/
│   │   ├── recommendationEngine.ts # Core deterministic recommendation engine
│   │   └── journeyStorage.ts      # Safe browser localStorage management
│   └── types/
│       └── index.ts               # Core TypeScript definitions
├── scripts/
│   └── verify-scenarios.ts        # Automated test suite covering 7 edge-case scenarios
├── package.json
└── README.md
```

---

## 6. Verification & Automated Testing

ReLoop includes an automated test runner validating the decision engine against real-world scenarios:

```bash
# Run lint check (0 errors, 0 warnings)
npm run lint

# Run type check & production build
npm run build

# Run automated scenario test suite
npm test
```

### Verified Scenarios:
1. **Working Unused Smartphone (iPhone 13):** Recommends direct resale/trade-in without forcing recycling.
2. **Damaged Laptop (ThinkPad T490):** Evaluates home repurposing and repair feasibility against cost risk.
3. **Dead / Obsolete Hardware:** Recommends certified recycling for raw mineral reclamation.
4. **Safety Critical (Swollen Battery):** Overrides commercial options to prioritize immediate hazardous lithium drop-off.
5. **Incomplete / Unsure Condition:** Recommends safe physical diagnostic checks before committing.
6. **Account / Password Locked Device:** Highlights cryptographic de-linking requirement before any transfer.
7. **Custom Electronic Category:** Handles non-standard hardware categories with general circularity principles.

---

## 7. Git & Submission Instructions

To commit and push the project cleanly to your repository:

```bash
# 1. Review status
git status

# 2. Stage all clean source files
git add .

# 3. Commit with a structured message
git commit -m "feat: complete ReLoop AI electronics transition platform"

# 4. Push to remote main branch
git push origin main
```
