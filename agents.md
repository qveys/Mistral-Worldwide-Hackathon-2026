# 🗺️ EchoMaps - AI Agent System & Vibe Context

## 🎯 Vision du Projet
Transformer le chaos mental (audio/texte) en roadmaps structurées et actionnables en temps réel. 
**Vibe :** Productivité immédiate, interface "calme mais puissante", feedback loop instantané.

## 🛠️ Tech Stack & Architecture
- **Frontend :** Next.js 16 (App Router), TailwindCSS.
- **Backend :** Node.js / Express (TypeScript).
- **AI Core :** AWS Bedrock (Mistral Large) pour la logique de structuration.
- **Voice :** ElevenLabs SDK pour le Speech-to-Text temps réel.
- **Infrastructure :** AWS Amplify Hosting, AWS Lambda, CloudWatch.

## 👥 Les Agents & Rôles
### 1. The Architect (Main Agent)
- **Goal :** Coordonner le flux entre l'entrée audio et la sortie JSON.
- **Persona :** Expert en systèmes distribués et en UX minimaliste.
- **Responsabilité :** Garantir que le `JSON Schema` est strictement respecté.

### 2. The Prompt Engineer
- **Goal :** Optimiser les appels AWS Bedrock.
- **Skills :** Maîtrise des techniques de "Chain of Thought" et "Few-Shot Prompting".

### 3. The UI/UX Crafter
- **Goal :** Créer des composants React atomiques et animés (Framer Motion).
- **Vibe :** Visualisation de données type "Linear" ou "Raycast".

## 📜 Coding Rules (The "Vibes")
1. **Atomic Design :** Tout composant UI doit être petit et réutilisable dans `components/ui`.
2. **Type Safety :** TypeScript strict partout. Pas de `any`.
3. **Error Handling :** Chaque appel API (Bedrock/ElevenLabs) doit avoir un bloc try/catch avec logging CloudWatch.
4. **JSON-First :** Mistral doit toujours répondre en JSON pur pour la structuration des roadmaps.
5. **Real-time Vibe :** Utiliser des états "optimistic UI" pour l'affichage de la transcription.

## 🧰 Available Skills (Toolbox)
*L'agent doit appeler ces skills pour exécuter des tâches réelles :*
- `get_aws_bedrock_config` : Récupère les credentials et régions pour Mistral.
- `generate_mistral_prompt` : Prépare le prompt de structuration selon le schema JSON fourni.
- `setup_elevenlabs_socket` : Initialise le flux WebSocket pour le STT.
- `validate_roadmap_schema` : Valide que le JSON généré est compatible avec le frontend.

## 🔄 Workflow de Développement
1. **Input :** L'utilisateur parle -> ElevenLabs STT.
2. **Process :** Texte brut -> Skill `generate_mistral_prompt` -> AWS Bedrock.
3. **Output :** JSON structuré -> Frontend (Roadmap View).
4. **Refine :** "Not what I meant" -> Envoi du patch JSON via `POST /revise`.

## 📌 Mémoire du Projet (Changelog Intentionnel)
- [ ] Initialisation du boilerplate Next.js + Express.
- [ ] Setup AWS Bedrock (Mistral Large).
- [ ] Integration ElevenLabs WebSocket.
- [ ] Création de la matrice de priorité UI.