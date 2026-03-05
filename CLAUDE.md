# CLAUDE.md

## Project Overview

**2026 Overseas Feasibility Assessment** (2026内贸企业出海可行性自测表) — a React + TypeScript + Vite single-page application that helps Chinese domestic trade enterprises evaluate their readiness to expand internationally. Features an interactive 30-question assessment across 6 dimensions with automated scoring, results categorization, and data collection via webhooks.

## Tech Stack

- **React 19** with TypeScript 5.8
- **Vite 6** (dev server on port 3000, bound to 0.0.0.0)
- **Tailwind CSS** via CDN (no local CSS files)
- **No backend** — fully client-side with localStorage persistence
- **Webhooks** — Make.com (Notion sync, email notifications), Google Sheets

## Repository Structure

All source files are at the root level (flat structure, no `src/` directory):

```
App.tsx          # Main app component, view state machine (intro → assessment → result → dashboard)
Assessment.tsx   # Multi-section questionnaire UI with progress tracking
Result.tsx       # Results display, score breakdown, contact form + webhook submission
Dashboard.tsx    # Industry analytics dashboard with seeded sample data
Intro.tsx        # Landing page with CTA buttons
data.ts          # All assessment questions, dimensions, scoring, and result tiers
types.ts         # TypeScript interfaces (Question, Dimension, ResultCategory, etc.)
storage.ts       # localStorage utility functions (CRUD for assessments & contacts)
index.tsx        # React DOM mount point
index.html       # HTML entry with Tailwind CDN script
vite.config.ts   # Vite config (port, env variable injection)
```

## Commands

```bash
npm run dev       # Start dev server (port 3000)
npm run build     # Production build → dist/
npm run preview   # Preview production build
```

There are no test, lint, or format commands configured.

## Environment Variables

- `GEMINI_API_KEY` — Google Gemini API key, injected at build time via `vite.config.ts` `define` option
- Create `.env.local` for local development (gitignored)

## Code Conventions

- **Components**: PascalCase filenames, functional components typed with `React.FC<Props>`
- **Props interfaces**: Suffixed with `Props` (e.g., `AssessmentProps`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `STORAGE_KEY`, `CONTACT_STORAGE_KEY`)
- **State management**: useState/useEffect only, props drilling (no context or state library)
- **Styling**: Tailwind utility classes inline, no separate CSS files. Responsive via `sm:`/`md:`/`lg:` prefixes
- **Data flow**: Immutable state updates with spread operator
- **Comments**: Minimal — code is self-documenting via TypeScript types

## Architecture Notes

### View State Machine
`App.tsx` manages a `view` state that switches between: `intro` → `assessment` → `result` → `dashboard`

### Assessment System
- 6 dimensions, 30 questions total (defined in `data.ts`)
- Single-select and multi-select question types
- Per-dimension scoring tracked and saved
- Question 21 uses `maxScore: 3` to cap multi-select scoring

### Result Tiers (5 levels)
| Score Range | Category | Stars |
|-------------|----------|-------|
| 90–105 | Golden Players (立即行动型) | 5 |
| 70–89 | Fast Iteration (快速迭代型) | 4 |
| 50–69 | Ready with Gaps (准备就绪型) | 3 |
| 30–49 | Cautious Watch (谨慎观望型) | 2 |
| 0–29 | Not Yet Ready (暂不适宜型) | 1 |

### Data Persistence
- `localStorage` keys: `assessment_results_db_v1`, `contact_submissions_db_v1`
- Seed data auto-populated on first visit for dashboard visualization

### Webhook Integrations (Result.tsx)
- Notion sync, email notification, Google Sheets — all via `Promise.allSettled()` for silent failure
- Google Sheets uses `mode: 'no-cors'` for WeChat browser compatibility

## Branding

PulseAgent branding with custom SVG logo. Links to pulseagent.io.

## Working with This Codebase

- All business logic (questions, scoring, result categories) lives in `data.ts` — edit there to change assessment content
- `Result.tsx` is the largest component (~400 lines) handling results display and contact form submission
- No tests exist — verify changes manually via `npm run dev`
- No CI/CD pipelines configured
- Module system: ESM (`"type": "module"` in package.json)
