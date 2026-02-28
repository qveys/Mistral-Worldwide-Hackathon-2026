# 🪵 Changelog - EchoMaps 🗺️

Toutes les modifications notables de ce projet seront documentées dans ce fichier. Le format est basé sur [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [Unreleased] - Focus: Real-time Sync & Polish
### 🎯 En cours
- [ ] Optimisation de la latence entre ElevenLabs et Mistral Large.
- [ ] Ajout du "Focus Mode" dans l'UI Next.js.
- [ ] Implémentation du système de "XP" pour la gamification.

### 💡 Idées / Vibe
- Explorer l'utilisation de `Framer Motion` pour des transitions fluides lors de la génération de la roadmap.

---

## [0.1.0] - 2026-02-28 (Initial Hackathon Kickoff)
### 🚀 Added
- **Architecture Core :** Initialisation du monorepo (Frontend Next.js + Backend Express).
- **Agents.md :** Configuration du système d'agents pour Mistral CLI & Antigravity.
- **AWS Bedrock Integration :** Skill `call_mistral_bedrock` fonctionnel pour la structuration JSON.
- **ElevenLabs STT :** Hook `useElevenLabs` pour capturer l'audio en direct via WebSocket.
- **UI Components :**
    - `RoadmapCanvas` : Visualisation verticale des étapes.
    - `BrainDumpInput` : Zone de texte auto-expand avec indicateur d'enregistrement.
    - `PriorityMatrix` : Composant Drag & Drop pour trier les tâches.

### 🧠 AI & Prompt Evolution
- **Structure Prompt v1 :** Création du prompt système pour forcer Mistral à sortir du JSON pur.
- **Schema Validation :** Intégration de `Zod` côté Backend pour valider les sorties du LLM avant de les envoyer au Front.

### 🔧 Fixed
- Correction d'un bug CORS entre le client Next.js et l'API Express lors des appels Bedrock.
- Correction de la perte de contexte WebSocket ElevenLabs lors du changement d'onglet.

---

## [0.0.1] - 2026-02-27
### 🏗️ Setup
- Initialisation du projet avec `npx create-next-app`.
- Configuration de l'environnement AWS (IAM Roles pour Bedrock).
- Rédaction du `README.md` et définition du `JSON Schema` de référence.