---
description: Explore codebase, plan & implement a feature following EPCT workflow for EchoMaps
---

# Explore → Plan → Code → Test (EPCT)

At the end of this message I will give you a task or a PRP path. Follow this workflow strictly.

---

## 1. Explore

Read the PRP file if given, then use **parallel subagents** to gather all context:

- `agents.md` — project vibe, stack, coding rules
- `docs/initial-idea.md` — JSON schema & feature scope
- `changelog.md` — current state
- All files listed in the PRP's "Files to Reference" section
- Relevant skill folders in `skills/` (next-best-practices, backend-patterns, speech-to-text, prompt-engineering, aws-solution-architect)

Subagents must return: relevant file paths + key patterns + gotchas found.

---

## 2. Plan

Write a detailed implementation plan including:

- List of files to create/modify (exact paths)
- Key decisions with brief justification (DRY, KISS, SOLID)
- TypeScript types / Zod schemas to define
- Prompt engineering if Mistral is involved (JSON-only output strategy)
- ElevenLabs WebSocket flow if voice is involved
- Error handling strategy (try/catch + CloudWatch log pattern)
- Optimistic UI if real-time update is needed

If something is unclear → **ask the user before coding**.

---

## 3. Code

Follow the EchoMaps coding rules from `agents.md`:

1. **Atomic Design** — small, reusable components in `components/ui/`
2. **TypeScript strict** — no `any`, use Zod for LLM outputs
3. **Error handling** — every Bedrock/ElevenLabs call gets try/catch + structured log
4. **JSON-First** — Mistral always returns pure JSON
5. **Optimistic UI** — show transcription state immediately

Code style: prefer clearly named variables over inline comments. Run autoformat when done.

---

## 4. Test

Use subagents to verify:

- TypeScript compiles (`npm run build` — fix errors if any)
- No CORS issue between Next.js and Express
- Zod validates the LLM JSON output correctly
- UI displays loading/error states properly
- If UX is affected → use browser subagent to verify the full flow

If tests fail → go back to Plan, think hard, iterate.

---

## 5. Write-Up

When done, write a short PR description in the repo's `changelog.md` following the existing format:

```markdown
## [x.x.x] - YYYY-MM-DD
### 🚀 Added / 🧠 AI / 🔧 Fixed
- Short bullet: what changed and why
```

---

**Task / PRP:** $ARGUMENTS
