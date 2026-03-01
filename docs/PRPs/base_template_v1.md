# [Feature Name] PRP

> Minimum viable packet for an AI agent to ship production-ready EchoMaps code on the first pass.

## Goal

[One sentence: "Enable [user] to [action] so that [benefit]"]

## Why

- **Benefit:** [Who gains what]
- **Problem solved:** [Current pain point]
- **Priority:** High / Medium / Low

## What

### Feature Description

[What it does from the user's perspective — UX flow in 3-5 steps]

### Scope

**In:**

- [included aspect]

**Out:**

- [explicitly excluded aspect]

### User Story

As a user doing a **brain dump**, I want [action] so that [benefit].

---

## Technical Context

### Stack

- **Frontend:** Next.js 15 App Router + TailwindCSS (Framer Motion for animations)
- **Backend:** Node.js / Express (TypeScript)
- **AI:** AWS Bedrock → `mistral.mistral-large-2402-v1:0` (JSON-only output)
- **Voice:** Voxtral WebSocket SDK
- **Validation:** Zod (validates all LLM outputs before frontend)
- **Infra:** AWS Amplify Hosting, CloudWatch Logs

### JSON Schema Impact

Does this feature add or modify fields in the project JSON?

```jsonc
// Paste only the affected part of the schema
{
    // existing field: unchanged
    // new field: { type, description }
}
```

### Files to Reference (Read-Only)

| File                      | Purpose                   |
| ------------------------- | ------------------------- |
| `src/hooks/useVoxtral.ts` | Voxtral WebSocket pattern |
| `src/lib/bedrock.ts`      | AWS Bedrock call pattern  |
| `src/components/ui/`      | Atomic component examples |

### Files to Create/Modify

| File      | Action | Description    |
| --------- | ------ | -------------- |
| `src/...` | CREATE | [what it does] |
| `src/...` | MODIFY | [what changes] |

### Pattern to Follow

```typescript
// Copy this pattern from the codebase for consistency
// e.g. Bedrock call with Zod validation + CloudWatch log
try {
    const result = await callBedrock(prompt);
    const parsed = MySchema.parse(result); // Zod
    return parsed;
} catch (err) {
    console.error({ err }, 'Bedrock call failed'); // CloudWatch
    throw err;
}
```

---

## Implementation Details

### API Endpoint (if applicable)

**`POST /api/[endpoint]`**

**Request:**

```typescript
{
    input: string;
}
```

**Response:**

```typescript
{
    success: boolean;
    data: RoadmapSchema;
}
```

### Mistral Prompt (if applicable)

```
System: You are a project structuring assistant.
Input: [brain dump text]
Output: valid JSON matching the given schema. JSON ONLY, no prose.
```

### Voxtral Flow (if applicable)

1. `setup_Voxtral_socket` → open WebSocket
2. Stream audio chunks
3. Receive `transcript` event → update optimistic UI state
4. On `done` → trigger Bedrock structuring

### Components

| Component       | Path              | Key Props    |
| --------------- | ----------------- | ------------ |
| `ComponentName` | `src/components/` | `prop: Type` |

---

## Validation Criteria

### Functional

- [ ] [Testable requirement 1]
- [ ] [Testable requirement 2]

### Technical

- [ ] TypeScript strict — zero `any`
- [ ] Zod validates LLM output before frontend receives it
- [ ] No CORS errors (Next.js ↔ Express)
- [ ] Loading state shown during Bedrock call
- [ ] Error state shown on failure (Voxtral / Bedrock)
- [ ] CloudWatch log on each external API call

### Anti-patterns to Avoid

- ❌ Multi-agent chaining unless strictly necessary
- ❌ Secondary features before MVP is stable
- ❌ Prompts that don't enforce JSON-only output

### Testing Steps

1. Start voice recording → verify transcript appears in real-time
2. Submit brain dump → verify JSON schema match (log Zod result)
3. Check error state: disconnect Voxtral → UI shows error cleanly
4. `npm run build` → zero TypeScript errors

## Skills to Use

- `skills/next-best-practices/` — Next.js 15 patterns
- `skills/backend-patterns/` — Express API structure
- `skills/prompt-engineering/` — Mistral prompt techniques
- `skills/speech-to-text/` — Voxtral integration
- `skills/aws-solution-architect/` — Bedrock config & CloudWatch

---

**Created:** [YYYY-MM-DD]  
**Status:** Draft → Ready → In Progress → Done
