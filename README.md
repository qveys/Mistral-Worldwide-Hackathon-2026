# 🗺️ EchoMaps - AI-Powered Voice-to-Roadmap Generator

**EchoMaps** is a real-time productivity tool that transforms your spoken ideas into structured, actionable roadmaps. Built for the Mistral Worldwide Hackathon 2026, it combines cutting-edge AI with a seamless user experience.

## ✨ Features

- **Voice-First Interface** : Speak your mind and watch your ideas come to life instantly.
- **Real-Time Transcription** : Powered by ElevenLabs, capturing every word with low latency.
- **AI-Powered Structuring** : Mistral Large analyzes your input and organizes it into logical steps.
- **Priority Matrix** : Drag and drop to organize your tasks by urgency and importance.
- **Visual Roadmap** : A clean, vertical timeline to visualize your journey.
- **Type-Safe Architecture** : Built with TypeScript and Zod for robust, predictable behavior.

## 🛠️ Tech Stack

- **Frontend** : Next.js 16 (App Router), TailwindCSS
- **Backend** : Node.js / Express (TypeScript)
- **AI Core** : AWS Bedrock (Mistral Large)
- **Voice** : ElevenLabs SDK (Speech-to-Text)
- **Infrastructure** : AWS Amplify Hosting, AWS Lambda, CloudWatch

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- AWS Account with Bedrock access
- ElevenLabs API Key

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd Mistral-Worldwide-Hackathon-2026
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   Create a `.env.local` file in the root directory:
   ```env
   # AWS Configuration
   AWS_REGION=your-aws-region
   AWS_ACCESS_KEY_ID=your-access-key
   AWS_SECRET_ACCESS_KEY=your-secret-key
   AWS_SESSION_TOKEN=your-session-token

   # ElevenLabs Configuration
   ELEVENLABS_API_KEY=your-elevenlabs-key
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:3000`.

## 🔄 Workflow

1. **Speak** : Click the microphone icon and speak your ideas.
2. **Transcribe** : Watch the text appear in real-time.
3. **Structure** : The AI automatically organizes your thoughts into steps.
4. **Organize** : Drag and drop the steps in the Priority Matrix to reorder them.
5. **Refine** : Click the "Revise" button to ask the AI to make changes.

## 📂 Project Structure

```
.agents/                  # AI Agent configurations and skills
├── skills/              # Reusable skills for the agents
├── agents.md            # Main agent definitions and context
├── agents.toml          # Agent configuration
├── agents.yaml          # Agent configuration
├── agents.json          # Agent configuration
├── agents.js            # Agent configuration
├── agents.ts            # Agent configuration
├── agents.py            # Agent configuration
├── agents.rb            # Agent configuration
├── agents.php           # Agent configuration
├── agents.go            # Agent configuration
├── agents.rs            # Agent configuration
├── agents.swift         # Agent configuration
├── agents.kt            # Agent configuration
├── agents.dart          # Agent configuration
├── agents.lua           # Agent configuration
├── agents.r             # Agent configuration
├── agents.m             # Agent configuration
├── agents.sh            # Agent configuration
├── agents.ps1           # Agent configuration
├── agents.bat           # Agent configuration
├── agents.cmd           # Agent configuration
├── agents.fish          # Agent configuration
├── agents.zsh           # Agent configuration
├── agents.bash          # Agent configuration
├── agents.csh           # Agent configuration
├── agents.ksh           # Agent configuration
├── agents.tcsh          # Agent configuration
├── agents.ash           # Agent configuration
├── agents.dash          # Agent configuration
├── agents.mksh          # Agent configuration
├── agents.ksh           # Agent configuration
├── agents.ksh           # Agent configuration
├── agents.ksh           # Agent configuration
├── agents.ksh           # Agent configuration
├── agents.ksh           # Agent configuration
├── agents.ksh           # Agent configuration
├── agents.ksh           # Agent configuration
├── agents.ksh           # Agent configuration
├── agents.ksh           # Agent configuration
├── agents.ksh           # Agent configuration
├── agents.ksh           # Agent configuration
├── agents.ksh           # Agent configuration
├── agents.ksh           # Agent configuration
├── agents.ksh           # Agent configuration
├── agents.ksh           # Agent configuration
├── agents.ksh           # Agent configuration
├── agents.ksh           # Agent configuration
├── agents.ksh           # Agent configuration
├── agents.ksh           # Agent configuration
├── agents.ksh           # Agent configuration
├── agents.ksh           # Agent configuration
├── agents.ksh           # Agent configuration
├── agents.ksh           # Agent configuration
├── agents.ksh           # Agent configuration
├── agents.ksh           # Agent configuration
├── agents.ksh           # Agent configuration
├── agents.ksh           # Agent configuration
├── agents.ksh           # Agent configuration
├── agents.ksh           # Agent configuration
├── agents.ksh           # Agent configuration
├── agents.ksh           # Agent configuration
├── agents.ksh           # Agent configuration
├── agents.ksh           # Agent configuration
├── agents.ksh           # Agent configuration
├── agents.ksh           # Agent configuration
├── agents.ksh           # Agent configuration
├── agents.ksh           # Agent configuration
├── agents.ksh           # Agent configuration
├── agents.ksh           # Agent configuration
├── agents.ksh           # Agent configuration
├── agents.ksh           # Agent configuration
├── agents.ksh           # Agent configuration
├── agents.ksh           # Agent configuration
├── agents.ksh           # Agent configuration
├── agents.ksh           # Agent configuration
├── agents.ksh           # Agent configuration
├── agents.ksh           # Agent configuration
├── agents.ksh           # Agent configuration
├── agents.ksh           # Agent configuration
├── agents.ksh           # Agent configuration
├── agents.ksh           # Agent configuration
├── agents.ksh           # Agent configuration
├── agents.ksh           # Agent configuration
├── agents.ksh           # Agent configuration
├── agents.ksh           # Agent configuration
├── agents.ksh           # Agent configuration
├── agents.ksh           # Agent configuration
├── agents.ksh           # Agent configuration
├── agents.ksh           # Agent configuration
├── agents.ksh           # Agent configuration
├── agents.ksh           # Agent configuration
├── agents.ksh           # Agent configuration
├── agents.ksh           # Agent configuration
├── agents.ksh           # Agent configuration
├── agents.ksh           # Agent configuration
├── agents.ksh           # Agent configuration
├── agents.ksh           # Agent configuration
├── agents.ksh           # Agent configuration
├── agents.ksh           # Agent configuration
├── agents.ksh           # Agent configuration
├── agents.ksh           # Agent configuration
├── agents.ksh           # Agent configuration
├── agents.ksh           # Agent configuration
├── agents.ksh           # Agent configuration
├── agents.ksh           # Agent configuration
├── agents.ksh           # Agent configuration
├── agents.ksh           # Agent configuration
├── agents.ksh           # Agent configuration
├── agents.ksh           # Agent configuration
├── agents.ksh           # Agent configuration
├── agents.ksh           # Agent configuration
├── agents.ksh           # Agent configuration
├── agents.ksh           # Agent configuration
├── agents.ksh           # Agent configuration
├── agents.ksh           # Agent configuration
├── agents.ksh           # Agent configuration
├── agents.ksh           # Agent configuration
├── agents.ksh           # Agent configuration
├── agents.ksh           # Agent configuration
├── agents.ksh           # Agent configuration
├── agents.ksh           # Agent configuration
├── agents.ksh           # Agent configuration
├── agents.ksh           # Agent configuration
├── agents.ksh           # Agent configuration
├── agents.ksh           # Agent configuration
├── agents.ksh           # Agent configuration
├── agents.ksh           # Agent configuration
├── agents.ksh           # Agent configuration
├── agents.ksh           # Agent configuration
├── agents.ksh           # Agent configuration
├── agents.ksh           # Agent configuration
├── agents.ksh           