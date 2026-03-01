# 🗺️ EchoMaps — Chaos to Clarity

**EchoMaps** transforms a chaotic voice/text brain dump into a structured, actionable roadmap in real-time.  
Built for the **Mistral Worldwide Hackathon 2026**.

## ✨ Features

- 🎤 **Voice-First** — speak your mind, watch ideas appear instantly (Voxtral WebSocket STT)
- 🧠 **AI Structuring** — Mistral Large organizes your dump into a JSON roadmap (AWS Bedrock)
- 📋 **Priority Matrix** — drag & drop tasks by urgency/importance
- 🗺️ **Visual Roadmap** — clean vertical timeline
- 🔁 **Interactive Revision** — refine the plan conversationally via `POST /revise`
- 🔒 **Type-Safe** — TypeScript strict + Zod validation on all LLM outputs

## 🛠️ Tech Stack

| Layer      | Tech                                                            |
| ---------- | --------------------------------------------------------------- |
| Frontend   | Next.js 16 (App Router) + TailwindCSS + Framer Motion           |
| Backend    | Node.js / Express (TypeScript)                                  |
| AI         | AWS Bedrock → Mistral Large (`mistral.mistral-large-2402-v1:0`) |
| Voice      | Voxtral WebSocket SDK                                           |
| Infra      | AWS Amplify Hosting, Lambda, CloudWatch                         |
| Validation | Zod                                                             |

## 🚀 Getting Started

### Prerequisites

- Node.js v18+
- AWS Account with Bedrock access (Mistral Large enabled)
- Voxtral API Key

### Setup

From the **repo root**:

```bash
git clone <repo-url>
cd Mistral-Worldwide-Hackathon-2026

# Frontend (http://localhost:3000)
cd app/frontend
npm install
npm run dev

# Backend API (http://localhost:3001)
cd ../backend
npm install
cp env.example .env
npm run dev
```

### Environment Variables

```env
MISTRAL_API_KEY=...
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
├── app/
│   ├── frontend/        # Next.js app
│   │   ├── app/         # App Router routes/pages
│   │   ├── components/  # Atomic UI components
│   │   └── lib/         # shared frontend logic/types
│   └── backend/         # Express API (TypeScript)
│       └── src/
│           ├── routes/
│           └── prompts/
```

## 🧠 JSON Schema

```jsonc
{
    "projectId": "179b1942-7527-4968-9ca5-02f14dfcce96",
    "title": "Organisation travail et sport",
    "createdAt": "2026-02-28T20:23:13.000Z",
    "brainDump": "Je veux aller faire du sport mais avant ça j'ai du travail",
    "objectives": [
        {
            "id": "obj-1",
            "text": "Terminer le travail en cours",
            "priority": "high",
        },
        {
            "id": "obj-2",
            "text": "Aller faire du sport",
            "priority": "medium",
        },
    ],
    "tasks": [
        {
            "id": "task-1",
            "title": "Identifier les tâches de travail à compléter",
            "objectiveId": "obj-1",
            "status": "backlog",
            "estimate": "S",
            "priority": "high",
            "dependsOn": [],
        },
        {
            "id": "task-2",
            "title": "Réaliser le travail prioritaire",
            "objectiveId": "obj-1",
            "status": "backlog",
            "estimate": "M",
            "priority": "high",
            "dependsOn": ["task-1"],
        },
        {
            "id": "task-3",
            "title": "Préparer les affaires de sport",
            "objectiveId": "obj-2",
            "status": "backlog",
            "estimate": "S",
            "priority": "medium",
            "dependsOn": [],
        },
        {
            "id": "task-4",
            "title": "Aller à la salle de sport",
            "objectiveId": "obj-2",
            "status": "backlog",
            "estimate": "M",
            "priority": "medium",
            "dependsOn": ["task-2", "task-3"],
        },
    ],
    "revisionHistory": [],
}
```

## 🤖 Vibe Coding Workflow

```bash
# 1. Create a PRP for the next feature
/create-prp Implement real-time Voxtral transcription

# 2. Explore codebase, plan & implement
/explore-and-plan PRPs/Voxtral-transcription.md
```

See `PRPs/README.md` for the full PRP workflow.

## 📜 API Endpoints

| Endpoint           | Role                             |
| ------------------ | -------------------------------- |
| `POST /transcribe` | Audio → text (Voxtral)           |
| `POST /structure`  | Text → structured JSON (Bedrock) |
| `POST /revise`     | Patch existing plan (Bedrock)    |
| `GET /project/:id` | Retrieve saved project           |

## 🧑‍💻 Team (48h Hackathon)

- **Dev 1** — Frontend (WebAudio, Timeline/Roadmap UI)
- **Dev 2** — Backend (API Gateway, Lambda, Auth)
- **Dev 3** — AI (Prompts, JSON schema, Voxtral loop)
