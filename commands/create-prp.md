# /create-prp — EchoMaps Feature PRP Generator

You are tasked with creating a comprehensive PRP for a new feature in **EchoMaps** (Hackathon 2026).

## What is a PRP?

A **PRP (Product Requirement Prompt)** = minimum viable packet for an AI agent to ship production-ready code on the first pass.

It combines: product requirement + codebase intelligence + implementation guidance + validation criteria.

## Research Process (do this FIRST)

### 1. Project Context
- Read `agents.md` → vibe, tech stack, coding rules
- Read `docs/initial-idea.md` → feature scope & JSON schema
- Read `changelog.md` → current state of the project
- Check `.env.example` → available environment variables

### 2. Codebase Exploration
- Explore `skills/` to find reusable patterns (next-best-practices, backend-patterns, etc.)
- Identify files that match the feature: look in `src/app/`, `src/components/`, `src/lib/`
- Find the closest existing implementation to use as pattern reference

### 3. Web Research (if needed)
- ElevenLabs SDK docs (Speech-to-Text/WebSocket)
- AWS Bedrock + Mistral Large API
- Next.js 15 App Router latest patterns

### 4. Template
- Use `PRPs/base_template_v1.md` as structural guide

---

## PRP Output Structure

Create the file at `PRPs/[feature-name].md`:

```markdown
# [Feature Name] PRP

## Goal
[One sentence: "Enable [user] to [action] so that [benefit]"]

## Why
- Who benefits & how
- Priority: High / Medium / Low

## What
### Feature Description
[What it does, UX flow]

### Scope
**In:** - item  
**Out:** - item

### User Stories
1. As a [user], I want [action] so that [benefit]

## Technical Context

### Stack Constraints
- Frontend: Next.js 15 App Router + TailwindCSS
- Backend: Node.js/Express (TypeScript)
- AI: AWS Bedrock → Mistral Large (JSON-only responses)
- Voice: ElevenLabs WebSocket SDK
- Validation: Zod

### Files to Reference (Read-Only)
| File | Purpose |
|------|---------|
| `src/...` | [why] |

### Files to Create/Modify
| File | Action | Description |
|------|--------|-------------|
| `src/...` | CREATE/MODIFY | [what] |

### Patterns to Follow
```typescript
// Paste a short pattern snippet from the codebase here
```

### JSON Schema Impact
[Does this feature add fields to the project JSON schema? Specify here]

## Implementation Details

### API Endpoint (if applicable)
**`POST /api/[endpoint]`**
- Request: `{ field: type }`
- Response: `{ success: boolean, data: {...} }`

### AWS Bedrock Call (if applicable)
- Model: `mistral.mistral-large-2402-v1:0`
- Prompt strategy: [system prompt intent]
- Output: valid JSON matching schema

### ElevenLabs Integration (if applicable)
- WebSocket flow: [describe events]

### Components (if applicable)
| Component | Path | Key Props |
|-----------|------|-----------|
| `ComponentName` | `src/components/` | `prop: type` |

## Validation Criteria

### Functional
- [ ] [Testable requirement]

### Technical
- [ ] TypeScript strict — no `any`
- [ ] Zod validates all LLM outputs before sending to frontend
- [ ] No CORS errors (check Next.js/Express config)
- [ ] Loading & error states in UI
- [ ] CloudWatch log on each Bedrock/ElevenLabs call

### Testing Steps
1. [Step → expected result]

## Skills to Use
- `skills/next-best-practices/` — Next.js patterns
- `skills/backend-patterns/` — Express/API patterns
- `skills/prompt-engineering/` — Mistral prompts
- `skills/speech-to-text/` — ElevenLabs integration
- `skills/aws-solution-architect/` — Bedrock config

---
**Created:** [Date]  
**Status:** Draft → Ready → In Progress → Done
```

## User Confirmation

Before saving the PRP, confirm:
1. Scope is correct
2. Approach aligns with hackathon constraints (48h, 3 devs)
3. No missing requirements

If confirmed, save to `PRPs/[feature-name].md` and reply: "PRP ready — run `/explore-and-plan PRPs/[feature-name].md` to start implementation."

---

**Input:** $ARGUMENTS
