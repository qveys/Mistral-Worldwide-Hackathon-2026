# 🗺️ EchoMaps — AI Agent Context

## 🎯 Project Vision
Transform a chaotic voice/text **brain dump** into a structured, actionable roadmap in real-time.  
**Vibe:** Productivity-first. Interface "calm but powerful". Instant feedback loop.

## 🛠️ Tech Stack
| Layer | Tech | Key detail |
|-------|------|------------|
| Frontend | Next.js 16 App Router + TailwindCSS | Framer Motion for animations |
| Backend | Express (TypeScript) | Deployed on AWS Lambda |
| AI | AWS Bedrock → Mistral Large | `mistral.mistral-large-2402-v1:0` |
| Voice | ElevenLabs WebSocket SDK | Real-time STT stream |
| Validation | Zod | All LLM outputs validated before frontend |
| Infra | AWS Amplify Hosting, CloudWatch | Logs: latency, LLM errors, cost/request |

## 📜 Coding Rules (Non-Negotiable)
1. **Atomic Design** — UI components must be small & reusable in `src/components/ui/`
2. **TypeScript Strict** — zero `any`. Zod validates every LLM JSON output.
3. **Error Handling** — every Bedrock/ElevenLabs call: `try/catch` + CloudWatch structured log
4. **JSON-First** — Mistral always responds in pure JSON. No prose in AI responses.
5. **Optimistic UI** — show transcription state immediately; reconcile after Bedrock reply
6. **DRY + KISS** — extract shared logic to `src/lib/`. Avoid over-engineering.
7. **Separation of Concerns** — UI (`src/components/`) ↔ Logic (`src/hooks/`, `src/lib/`)

## � Agent Roles

### 🏛️ The Architect (Main Agent)
- Coordinates the audio input → JSON output flow
- Enforces the JSON schema (see `docs/initial-idea.md`)
- Reviews PRPs in `PRPs/` before implementation starts

### ⚗️ The Prompt Engineer
- Owns all Bedrock prompt files in `backend/prompts/`
- Technique: Chain-of-Thought + JSON-only output enforcement
- Always validates prompt output against Zod schema before shipping

### 🎨 The UI/UX Crafter
- Builds atomic React components (Framer Motion animations)
- Visual references: Linear, Raycast design systems
- Never hardcodes styles — uses Tailwind utility classes

## 🔄 Data Flow
```
User speaks
  → ElevenLabs WebSocket → transcript (optimistic UI update)
  → POST /structure → AWS Bedrock (Mistral Large)
  → Zod validates JSON → RoadmapSchema
  → Frontend renders: RoadmapCanvas + PriorityMatrix
  → User says "revise X" → POST /revise → patch JSON → re-render
```

## 🧰 Skills Toolbox
| Skill | Path | Use when |
|-------|------|----------|
| Next.js best practices | `skills/next-best-practices/` | App Router, RSC, data fetching |
| Backend patterns | `skills/backend-patterns/` | Express routes, middleware |
| Prompt engineering | `skills/prompt-engineering/` | Mistral prompt design |
| Speech-to-text | `skills/speech-to-text/` | ElevenLabs WebSocket setup |
| AWS architecture | `skills/aws-solution-architect/` | Bedrock, Lambda, CloudWatch |
| UI/UX | `skills/ui-ux-pro-max/` | Component design, animations |

## Current State (see changelog.md)
- [] Next.js + Express boilerplate
- [] AWS Bedrock Mistral integration (`call_mistral_bedrock` skill)
- [] ElevenLabs hook (`useElevenLabs` WebSocket)
- [] UI: `RoadmapCanvas`, `BrainDumpInput`, `PriorityMatrix`
- [ ] Focus Mode
- [ ] XP/Gamification system
- [ ] Real-time sync optimization (WebSocket latency)

## ⚠️ Anti-Patterns to Avoid
- Multi-agent chaining without clear necessity
- Secondary features before MVP is stable
- UI that doesn't clearly display the plan
- Prompts that allow non-JSON output from Mistral
- Hardcoded AWS credentials (always use env vars)