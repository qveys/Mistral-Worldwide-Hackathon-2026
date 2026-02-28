---
goal: EchoMaps — Full Hackathon Implementation Plan (3 Developers)
version: 1.0
date_created: 2026-02-28
last_updated: 2026-02-28
owner: Team EchoMaps
status: 'In progress'
tags: [feature, architecture, hackathon, voice, ai, roadmap]
---

# Introduction

![Status: In progress](https://img.shields.io/badge/status-In%20progress-yellow)

**EchoMaps** transforms a chaotic voice/text brain dump into a structured, actionable roadmap.
This plan splits the 48h hackathon work across **3 developer tracks**, each owning their full vertical slice (frontend + backend). Merge points are explicitly defined.

> Each developer owns one feature end-to-end. They merge into `main` at defined sync points.

---

## 1. Requirements & Constraints

- **REQ-001**: App must work end-to-end: voice → transcript → JSON → roadmap UI
- **REQ-002**: Each developer owns both frontend and backend for their feature
- **REQ-003**: TypeScript strict mode (`"strict": true`) — zero `any`
- **REQ-004**: All AI/LLM output validated with Zod before reaching the frontend
- **REQ-005**: Merge into `develop` at defined sync points (Phase 0, end of Phase 1, end of Phase 2)
- **SEC-001**: API keys must only live in `.env.local` — never committed
- **SEC-002**: No hardcoded AWS credentials — use env vars or IAM roles
- **CON-001**: 48h time box — secondary features blocked until MVP is green
- **CON-002**: Single shared JSON schema (`RoadmapSchema`) — must not diverge between devs
- **PAT-001**: Atomic Design — components live in `src/components/ui/`, pages in `src/app/`
- **PAT-002**: Separation of Concerns — UI in `src/components/`, logic in `src/hooks/` + `src/lib/`
- **PAT-003**: Optimistic UI — show transcription state immediately; reconcile after Bedrock reply
- **GUD-001**: All Express routes: `try/catch` + CloudWatch structured log on error
- **GUD-002**: DRY + KISS — shared helpers in `src/lib/` and `backend/lib/`

---

## 2. Implementation Steps

---

### 🔴 PHASE 0 — Shared Foundation (All 3 Devs Together · ~2h)

> **GOAL-000**: Bootstrap monorepo, agree on shared types, and establish merge baseline before splitting.

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| TASK-001 | Init Next.js 16 project: `npx create-next-app@latest . --ts --tailwind --app --eslint` | | |
| TASK-002 | Init Express backend: `mkdir backend && cd backend && npm init -y && npx tsc --init` | | |
| TASK-003 | Create `src/lib/schema.ts` — export `RoadmapSchema` (Zod) matching `docs/initial-idea.md` JSON schema | | |
| TASK-004 | Create `.env.example` with all keys: `ELEVENLABS_API_KEY`, `AWS_REGION`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY` | | |
| TASK-005 | Create `src/types/roadmap.ts` with inferred TypeScript types from `RoadmapSchema` | | |
| TASK-006 | **MERGE** → push `main` branch with boilerplate. Each dev branches: `dev1/stt`, `dev2/roadmap-ui`, `dev3/auth` | | |

---

### 🟡 PHASE 1 — Feature Tracks

---

#### 👤 DEV 1 — Speech-to-Text (ElevenLabs)

> **GOAL-001**: Full STT vertical — mic capture → ElevenLabs WebSocket stream → live transcript → `POST /transcribe` → text stored in app state.

**Backend (Express)**

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| TASK-101 | Install WebSocket and ElevenLabs client dependencies: `npm i @elevenlabs/client ws` in `backend/` | | |
| TASK-102 | Create ElevenLabs helper `backend/lib/elevenlabs.ts` to manage API key and connections | | |
| TASK-103 | Create Express router skeleton `backend/routes/transcribe.ts` without logic | | |
| TASK-104 | Implement `audio/webm` chunk receiving in `POST /transcribe` | | |
| TASK-105 | Implement WebSocket connection to ElevenLabs in `POST /transcribe` | | |
| TASK-106 | Implement logic to stream audio from client to ElevenLabs WebSocket | | |
| TASK-107 | Implement logic to receive text chunks from ElevenLabs and pipe to client | | |
| TASK-108 | Add structured error logging (`console.error({ error }, '...')`) on disconnect/failure | | |
| TASK-109 | Export router in `backend/index.ts` at `/api/transcribe` | | |

**Frontend (Next.js)**

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| TASK-110 | Scaffold `src/hooks/useAudioRecorder.ts` — manage `AudioContext` and `MediaRecorder` | | |
| TASK-111 | Implement `navigator.mediaDevices.getUserMedia` logic in `useAudioRecorder` with error handling | | |
| TASK-112 | Scaffold `src/hooks/useElevenLabs.ts` — exposes `{ transcript, isRecording }` | | |
| TASK-113 | Implement WebSocket client logic in `useElevenLabs` to connect to `ws://localhost:<port>/api/transcribe` | | |
| TASK-114 | Wire `useAudioRecorder` audio chunks into `useElevenLabs` WebSocket stream | | |
| TASK-115 | Create `src/components/ui/MicButton.tsx` (UI purely, no animation logic) | | |
| TASK-116 | Add Framer Motion pulse animations to `MicButton` when `isRecording` is true | | |
| TASK-117 | Create `src/components/ui/TranscriptBox.tsx` (UI purely, standard textarea) | | |
| TASK-118 | Wire `TranscriptBox` `onChange` to local component state (for manual edits) | | |
| TASK-119 | Wire `MicButton` & `TranscriptBox` in `src/app/page.tsx` with optimistic UI updates | | |
| TASK-120 | Add offline detection hook `useNetworkState` and UI toast fallback if offline | | |

---

#### 👤 DEV 2 — JSON → Roadmap UI

> **GOAL-002**: Full roadmap vertical — call `POST /structure` (Bedrock) → Zod validate → render `RoadmapCanvas` + `PriorityMatrix` + drag-and-drop + `POST /revise`.

**Backend (Express) - Branch: `dev2/roadmap-backend`**

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| TASK-201 | Install dependencies: `npm i @aws-sdk/client-bedrock-runtime zod` in `backend/` | | |
| TASK-202 | Create AWS client helper `backend/lib/bedrock.ts` with `BedrockRuntimeClient` setup | | |
| TASK-203 | Write Bedrock wrapper function `callMistral(prompt: string)` explicitly calling `mistral.mistral-large-2402-v1:0` | | |
| TASK-204 | Extract 'Structure' prompt from `docs/initial-idea.md` into `backend/prompts/structure.txt` | | |
| TASK-205 | Extract 'Revise' prompt from `docs/initial-idea.md` into `backend/prompts/revise.txt` | | |
| TASK-206 | Create route logic skeleton `backend/routes/structure.ts` | | |
| TASK-207 | Implement parsing of `{ brainDump: string }` and Bedrock API call in `POST /structure` | | |
| TASK-208 | Implement Zod validation (`RoadmapSchema.parse()`) on Bedrock's response in `POST /structure` | | |
| TASK-209 | Create route logic skeleton `backend/routes/revise.ts` | | |
| TASK-210 | Implement JSON patch instruction parsing + Bedrock API call in `POST /revise` | | |
| TASK-211 | Implement Zod validation on Bedrock's response in `POST /revise` | | |
| TASK-212 | Wire both routes into `backend/index.ts` at `/api/structure` and `/api/revise` | | |

**Frontend (Next.js)**

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| TASK-213 | Create typed API helper `src/lib/api.ts` -> `structureBrainDump(text)` | | |
| TASK-214 | Create typed API helper `src/lib/api.ts` -> `reviseProject(project, instruction)` | | |
| TASK-215 | Setup Zustand store skeleton `src/store/roadmapStore.ts` with TS types | | |
| TASK-216 | Implement `setProject` and `updateProject` actions in Zustand store | | |
| TASK-217 | Create `TaskCard.tsx` component (Static UI, Title & Status Chip) | | |
| TASK-218 | Create `RoadmapCanvas.tsx` component (Vertical timeline layout) | | |
| TASK-219 | Map `project.timeline` dates to render `TaskCard` inside `RoadmapCanvas` | | |
| TASK-220 | Create `PriorityMatrix.tsx` component (Static 2x2 Grid) | | |
| TASK-221 | Implement `@dnd-kit/core` drag context inside `PriorityMatrix.tsx` | | |
| TASK-222 | Implement drop logic to update task priority and dispatch to Zustand | | |
| TASK-223 | Create `RevisionInput.tsx` (Chat input for revisions) | | |
| TASK-224 | Wire `RevisionInput.tsx` to call `reviseProject` and update store on output | | |
| TASK-225 | Implement Loading skeletons (`RoadmapSkeleton.tsx`) when waiting for Bedrock | | |
| TASK-226 | Add React Error Boundary `ErrorBoundary.tsx` around Roadmap sections | | |

---

#### 👤 DEV 3 — Authentication

> **GOAL-003**: Full auth vertical — user sign-up/login (Supabase Auth or NextAuth), session guard on API routes, user project persistence.

**Backend (Express) - Branch: `dev3/auth-backend`**

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| TASK-301 | Install dependencies `@supabase/supabase-js` | | |
| TASK-302 | Create Server Client `backend/lib/supabase.ts` with explicit API Keys verification | | |
| TASK-303 | Create database schema `projects` table (SQL query text in a script or via dashboard) | | |
| TASK-304 | Create `backend/middleware/auth.ts` -> `verifyJWT` to parse Bearer tokens | | |
| TASK-305 | Implement `supabase.auth.getUser(token)` logic inside `verifyJWT` middleware | | |
| TASK-306 | Create route skeleton `backend/routes/project.ts` | | |
| TASK-307 | Implement `POST /project` logic: Insert or update project row belonging to `req.user.id` | | |
| TASK-308 | Implement `GET /project/:id` logic: Fetch project row where user owns it | | |
| TASK-309 | Require `verifyJWT` on `/api/structure` and `/api/revise` endpoints | | |

**Frontend (Next.js) - Branch: `dev3/auth-frontend`**

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| TASK-310 | Install dependencies `@supabase/ssr` `cookies-next` | | |
| TASK-311 | Create Client Supabase initialization `src/lib/supabase.ts` | | |
| TASK-312 | Create Middleware `src/middleware.ts` for Next.js app router route protection | | |
| TASK-313 | Structure `useAuth.ts` hook exposing `signIn`, `signUp`, `signOut`, `user` | | |
| TASK-314 | Implement login/logout interaction with Supabase inside `useAuth.ts` | | |
| TASK-315 | Create `AuthModal.tsx` wrapper and Backdrop | | |
| TASK-316 | Create Sign Up / Sign In forms inside `AuthModal.tsx` with email/pwd validation | | |
| TASK-317 | Handle Error states (Invalid crdentials, user exists) in `AuthModal.tsx` | | |
| TASK-318 | Create `UserMenu.tsx` component (Avatar + Dropdown) | | |
| TASK-319 | Wire `AuthModal` display toggle into `src/app/layout.tsx` based on `useAuth` user state | | |
| TASK-320 | Implement debounced (2s) auto-saving to `POST /project` triggered by Zustand store changes | | |
| TASK-321 | Implement data hydration on load: call `GET /project/:id` if user logged in and populate Zustand | | |
---

### 🟢 PHASE 2 — Integration & Polish (All 3 · ~10h)

> **GOAL-004**: Merge all branches, wire the full E2E flow, polish UI, and prep the demo.

**Merge Point**: Each dev opens a PR to `main`. Order: `dev3/auth` → `dev2/roadmap-ui` → `dev1/stt`.

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| TASK-401 | **MERGE** `dev3/auth` → `main`. Resolve conflicts. Smoke test auth flow. | | |
| TASK-402 | **MERGE** `dev2/roadmap-ui` → `main`. Resolve conflicts. Smoke test roadmap render. | | |
| TASK-403 | **MERGE** `dev1/stt` → `main`. Resolve conflicts. Smoke test mic → transcript. | | |
| TASK-404 | Wire full E2E: `MicButton` → `useElevenLabs` → `TranscriptBox` → "Generate Roadmap" button → `structureBrainDump()` → `setProject()` → `RoadmapCanvas` | | |
| TASK-405 | Add `"Generate Roadmap"` button in `src/app/page.tsx` — disabled until transcript is non-empty | | |
| TASK-406 | Create `src/app/layout.tsx` global layout: `UserMenu` top-right, dark theme, Inter font via `next/font` | | |
| TASK-407 | Polish: add Framer Motion fade-in on `RoadmapCanvas` appearance (`initial={{ opacity: 0 }} animate={{ opacity: 1 }}`) | | |
| TASK-408 | Add toast notifications (`sonner` or `react-hot-toast`): success on roadmap generated, error on API failure | | |
| TASK-409 | Deploy frontend to **AWS Amplify**: connect repo, set env vars, trigger build | | |
| TASK-410 | Deploy backend to **AWS Lambda** via `serverless` or manually zip + upload; set API Gateway endpoint | | |
| TASK-411 | Update `NEXT_PUBLIC_API_URL` in `.env.local` to point to Lambda endpoint | | |
| TASK-412 | Run full demo script from `docs/initial-idea.md` (90s pitch): voice → roadmap → revise → export | | |

---

### 🏁 PHASE 3 — Demo Prep (All 3 · ~2h)

> **GOAL-005**: Rehearse demo flow and prepare pitch materials.

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| TASK-501 | Record demo video (90s) following script in `docs/initial-idea.md §Démo idéale` | | |
| TASK-502 | Prepare fallback: pre-recorded transcript + pre-generated JSON in case live mic fails during demo | | |
| TASK-503 | Update `README.md` with final deploy URL and team credits | | |
| TASK-504 | Update `changelog.md` with all shipped features | | |

---

## 3. Alternatives

- **ALT-001**: Use **Vercel** instead of AWS Amplify for frontend — faster deploy, but AWS preferred for hackathon judging alignment.
- **ALT-002**: Use **NextAuth** instead of Supabase Auth — more config needed; Supabase is faster for MVP.
- **ALT-003**: Use **polling** instead of WebSocket for STT — simpler but worse UX; WebSocket preferred.
- **ALT-004**: Use **Prisma + Postgres** for DB instead of Supabase — more setup; Supabase gives DB + Auth + SDK in one.

---

## 4. Dependencies

- **DEP-001**: `@elevenlabs/client` — ElevenLabs WebSocket STT SDK (Dev 1)
- **DEP-002**: `@aws-sdk/client-bedrock-runtime` — AWS Bedrock Mistral Large (Dev 2)
- **DEP-003**: `zod` — LLM output validation (shared)
- **DEP-004**: `zustand` — client state management for roadmap (Dev 2)
- **DEP-005**: `@dnd-kit/core` + `@dnd-kit/sortable` — drag-and-drop Priority Matrix (Dev 2)
- **DEP-006**: `@supabase/supabase-js` + `@supabase/ssr` — auth + DB (Dev 3)
- **DEP-007**: `framer-motion` — animations (shared UI)
- **DEP-008**: `sonner` — toast notifications (Phase 2)

---

## 5. Files

Key files by developer track:

| File | Owner | Description |
|------|-------|-------------|
| `src/lib/schema.ts` | Shared | Zod `RoadmapSchema` — single source of truth for JSON shape |
| `src/types/roadmap.ts` | Shared | Inferred TS types from schema |
| `src/hooks/useElevenLabs.ts` | Dev 1 | STT hook — mic capture + WebSocket lifecycle |
| `src/components/ui/MicButton.tsx` | Dev 1 | Animated mic button |
| `src/components/ui/TranscriptBox.tsx` | Dev 1 | Editable live transcript area |
| `backend/lib/bedrock.ts` | Dev 2 | `callMistral()` helper |
| `backend/prompts/structure.txt` | Dev 2 | Bedrock structure prompt |
| `backend/prompts/revise.txt` | Dev 2 | Bedrock revise prompt |
| `backend/routes/structure.ts` | Dev 2 | `POST /structure` route |
| `backend/routes/revise.ts` | Dev 2 | `POST /revise` route |
| `src/store/roadmapStore.ts` | Dev 2 | Zustand project store |
| `src/components/roadmap/RoadmapCanvas.tsx` | Dev 2 | Visual timeline |
| `src/components/roadmap/PriorityMatrix.tsx` | Dev 2 | Drag-and-drop 2×2 matrix |
| `backend/lib/supabase.ts` | Dev 3 | Supabase server client |
| `backend/middleware/auth.ts` | Dev 3 | JWT verify middleware |
| `backend/routes/project.ts` | Dev 3 | Project CRUD routes |
| `src/hooks/useAuth.ts` | Dev 3 | Auth hook |
| `src/components/auth/AuthModal.tsx` | Dev 3 | Login/signup modal |
| `src/lib/api.ts` | Dev 2/Shared | Typed API fetch helpers |

---

## 6. Testing

- **TEST-001**: `useElevenLabs` — unit test with mock `MediaRecorder`; assert `transcript` updates on stream chunks
- **TEST-002**: `POST /structure` — integration test: send known brain dump text, assert response matches `RoadmapSchema`
- **TEST-003**: `POST /revise` — send existing project JSON + instruction, assert patched JSON still valid under schema
- **TEST-004**: `verifyJWT` middleware — test with invalid token → 401, valid token → `req.user` set
- **TEST-005**: `PriorityMatrix` — drag task from Low to High; assert Zustand store updated
- **TEST-006**: E2E happy path — mock mic input → assert `RoadmapCanvas` renders with tasks

---

## 7. Risks & Assumptions

- **RISK-001**: ElevenLabs WebSocket latency spikes under load — mitigation: show transcript optimistically, reconcile on WS message
- **RISK-002**: Bedrock cold start on Lambda (~3s) — mitigation: show loading skeleton + keep Lambda warm with ping
- **RISK-003**: Merge conflicts on `src/app/page.tsx` (all 3 devs touch it) — mitigation: Dev 1 owns page layout in Phase 0; others only add props to pre-agreed component slots
- **RISK-004**: Supabase free tier row limits — mitigation: only persist one project per user for MVP
- **ASSUMPTION-001**: All devs have AWS credentials configured locally before Phase 0 starts
- **ASSUMPTION-002**: ElevenLabs API key is valid and STT model is available
- **ASSUMPTION-003**: Each dev has Node.js v18+ installed locally

---

## 8. Related Specifications / Further Reading

- [`docs/initial-idea.md`](../docs/initial-idea.md) — Original pitch, JSON schema, prompts
- [`agents.md`](../agents.md) — Agent roles, coding rules, anti-patterns
- [`README.md`](../README.md) — Tech stack, API endpoints, user flow
- [`PRPs/README.md`](../PRPs/README.md) — PRP workflow for feature sub-tasks
- [ElevenLabs WebSocket STT Docs](https://elevenlabs.io/docs/websockets)
- [AWS Bedrock Mistral Docs](https://docs.aws.amazon.com/bedrock/latest/userguide/model-parameters-mistral.html)
- [Supabase Auth SSR Guide](https://supabase.com/docs/guides/auth/server-side/nextjs)
- [dnd kit Docs](https://docs.dndkit.com/)
