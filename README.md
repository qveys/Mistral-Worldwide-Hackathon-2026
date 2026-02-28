# 🗺️ EchoMaps — Chaos to Clarity

**EchoMaps** transforms a chaotic voice/text brain dump into a structured, actionable roadmap in real-time.  
Built for the **Mistral Worldwide Hackathon 2026**.

## ✨ Features

- 🎤 **Voice-First** — speak your mind, watch ideas appear instantly (ElevenLabs WebSocket STT)
- 🧠 **AI Structuring** — Mistral Large organizes your dump into a JSON roadmap (AWS Bedrock)
- 📋 **Priority Matrix** — drag & drop tasks by urgency/importance
- 🗺️ **Visual Roadmap** — clean vertical timeline
- 🔁 **Interactive Revision** — refine the plan conversationally via `POST /revise`
- 🔒 **Type-Safe** — TypeScript strict + Zod validation on all LLM outputs

## 🛠️ Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | Next.js 15 (App Router) + TailwindCSS + Framer Motion |
| Backend | Node.js / Express (TypeScript) |
| AI | AWS Bedrock → Mistral Large (`mistral.mistral-large-2402-v1:0`) |
| Voice | ElevenLabs WebSocket SDK |
| Infra | AWS Amplify Hosting, Lambda, CloudWatch |
| Validation | Zod |

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- AWS Account with Bedrock access (Mistral Large enabled)
- ElevenLabs API Key

### Setup

```bash
git clone <repo-url>
cd Mistral-Worldwide-Hackathon-2026
npm install
cp .env.example .env.local  # fill in your keys
npm run dev                  # http://localhost:3000
```

### Environment Variables

```env
ELEVENLABS_API_KEY=...
AWS_REGION=eu-west-1
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
```

## 🔄 User Flow

1. **Speak** — click mic, speak your brain dump
2. **Transcribe** — text appears in real-time (optimistic UI)
3. **Structure** — AI generates a JSON roadmap via Bedrock
4. **Organize** — drag tasks in Priority Matrix
5. **Refine** — "Move X to urgent" → `POST /revise` → updated plan

## 📂 Project Structure

```
.
├── agents.md            # Agent roles, vibe, coding rules
├── changelog.md         # Keep a Changelog format
├── docs/
│   └── initial-idea.md  # Pitch, JSON schema, 48h roadmap
├── PRPs/                # Product Requirement Prompts
│   ├── README.md        # PRP workflow guide
│   ├── base_template_v1.md
│   └── [feature].md
├── commands/
│   ├── create-prp.md    # /create-prp [feature description]
│   └── explore-and-plan.md  # /explore-and-plan [PRP path]
├── skills/              # Reusable AI agent skills
│   ├── next-best-practices/
│   ├── backend-patterns/
│   ├── prompt-engineering/
│   ├── speech-to-text/
│   ├── aws-solution-architect/
│   └── ui-ux-pro-max/
├── src/
│   ├── app/             # Next.js App Router pages
│   ├── components/      # Atomic UI components
│   ├── hooks/           # useElevenLabs, useBedrock, ...
│   └── lib/             # bedrock.ts, schema.ts, ...
└── backend/             # Express API (TypeScript)
    ├── routes/
    └── prompts/
```

## 🧠 JSON Schema

```jsonc
{
  "projectId": "string",
  "title": "string",
  "createdAt": "ISO timestamp",
  "brainDump": "string",
  "objectives": [{ "id": "string", "text": "string", "priority": "High|Med|Low" }],
  "tasks": [{
    "id": "string", "text": "string", "objectiveId": "string",
    "status": "backlog|doing|done", "estimate": "S|M|L", "priority": "High|Med|Low"
  }],
  "timeline": [{ "taskId": "string", "day": "string", "slot": "AM|PM" }],
  "revisionHistory": [{ "timestamp": "string", "patch": "json-patch" }]
}
```

## 🤖 Vibe Coding Workflow

```bash
# 1. Create a PRP for the next feature
/create-prp Implement real-time ElevenLabs transcription

# 2. Explore codebase, plan & implement
/explore-and-plan PRPs/elevenlabs-transcription.md
```

See `PRPs/README.md` for the full PRP workflow.

## 📜 API Endpoints

| Endpoint | Role |
|----------|------|
| `POST /transcribe` | Audio → text (ElevenLabs) |
| `POST /structure` | Text → structured JSON (Bedrock) |
| `POST /revise` | Patch existing plan (Bedrock) |
| `GET /project/:id` | Retrieve saved project |

## 🧑‍💻 Team (48h Hackathon)

- **Dev 1** — Frontend (WebAudio, Timeline/Roadmap UI)
- **Dev 2** — Backend (API Gateway, Lambda, Auth)
- **Dev 3** — AI (Prompts, JSON schema, ElevenLabs loop)