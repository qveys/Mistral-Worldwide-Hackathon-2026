# 🚀 Projet Hackathon – Chaos to Clarity

nom de l'app : EchoMaps


## 📌 Pitch
**Chaos to Clarity** prend un *brain dump* vocal ou textuel désorganisé et le transforme en une **roadmap structurée**, une **liste de tâches prioritaires et un planning clair** en temps réel.  
Objectif : rendre productif immédiatement, avec interactivité, retour utilisateur et visualisation attractive.

---

## 🛠️ 1) Plan en 3 étapes

### 1️⃣ MVP (Must-Have)
- **Input**
  
  - Enregistrement audio (ElevenLabs) ou saisie texte
  - Transcription voix → texte en direct
  - Ajuster le texte généré et générer une roadmap organisée à partir de ce texte, une liste de tâches prioritaires et un planning clair.

### 2️⃣ Nice to Have
- **Templates prédéfinis**
  - Étudiant : révisions
  - Freelance : projet client
  - Productivité perso
- **Notifications légères**
  - “Prochaine action”
  - rappels amicaux (quotidients)
- **Partage public**
  - Lien read-only vers roadmap
  - Export PDF

---

### 3️⃣ Effet “Wouah”
#### Option A — Live Brain Dump
- L’écran se remplit **en direct** pendant que l’utilisateur parle
- L’agent pose des **questions de clarification** pertinentes

#### Option B — Roadmap 1-click
- Entrée : “Je peux travailler 6h/semaine”
- Sortie : planning réaliste, visuel, ajustable

#### Option C — Coach Gamifié
- XP à chaque tâche complétée
- Système de **streak**
- “Boss” = deadline

---

## 🧱 2) Architecture AWS ( idéale pour 48h)

### 🌍 Frontend
**Next.js**  
- Déploiement : **AWS Amplify Hosting**
- Composants :
  - Enregistreur audio
  - Zone de texte avec l'audio retranscrit modifiable
  - Sélecteur d' "Action Items" (To-Do List)
  - Module de "Priorisation" (Matrice de décision)
  - Organisation : Vue Roadmap (Timeline/Steps).
  - Validation : Formulaires de révision interactive.
  - Barres de progression gamifiées
  - Formulaires de révision interactive
  - Graphique d'activités (inspiration Github)
  - Bouton d'Export / Intégration (Connectivité)
  - Sélecteur de "Focus Mode"
  - Smart Reminder (Notification Contextuelle)

---

### 🔗 Backend

Endpoints :
| Endpoint | Rôle |
|----------|-------|
| `POST /transcribe` | Audio → texte |
| `POST /structure` | Texte → JSON structuré |
| `POST /revise` | Revisions (patch sur plan) |
| `GET /project/:id` | Récupérer projet |

---

### 🧠 IA – AWS Bedrock
- Modèles :
  - **Bedrock – Mistral Large**
  - ElevenLabs pour streaming audio
- Jobs :
  - Transcription
  - Structuration
  - Révisions interactives

---

### 📡 Temps réel (Option)
- WebSocket + Lambda → updates en direct
- Fallback : polling toutes les 1–2 sec

---

### 🔍 Observabilité
- **CloudWatch Logs**
- Indicateurs :
  - Latence API
  - Erreurs LLM
  - Coût estimation par request

---

## 🎯 3) 48h Hackathon Roadmap

### 🧑‍💻 Équipe (3 personnes)
- **Dev 1 – Front**
  - WebAudio
  - Timeline / Roadmap
- **Dev 2 – Backend**
  - API Gateway + Lambda
  - S3
  - Auth minimale
- **Dev 3 – ElevenLabs**
  - Prompts LLM
  - JSON schema
  - Boucle interactive
  - Démo script

---

## ✅ 4) Checklist
   - [] frontend du site stylé et utilisable rapidement avec une box avec le texte modifiable, et des questions posées pour 'améliorer' le texte.
   - [] CRUD création de roadmap
   - [] CRUD utilisateurs
   - [] Appels à ElevenLabs AI pour le voice to text
   - [] Génération de roadmap par Mistral AI hébergé et appelé via API
   - [] Best practices de vibe coding (skills, MCP, agents.md, changelog.md)

---

### 🎤 Démo idéale (Pitch 90s)

1) **30s** — Brain dump vocal  
   “Je dois organiser ma semaine, préparer mes cours, répondre à des clients…”
2) **20s** — L’agent affiche Kanban + tâches priorisées  
   “Voilà ce qu’on retient”
3) **20s** — Révision en live  
   “Met ceci en urgent”, “Fusionne X et Y”
4) **20s** — Roadmap auto ou gamification  
   “Voici ton planning interactif”
5) **10s** — CTA  
   “Copie Markdown / Partage / Export PDF”

---

### ⚙️ Anti-pièges à éviter
- Trop de features secondaires
- Multi-agent inutile
- UI qui n’affiche pas clairement le plan
- Prompts instables

---

## 🧠 JSON Schema recommandé

```jsonc
{
  "projectId": "string",
  "title": "string",
  "createdAt": "ISO timestamp",
  "brainDump": "string",
  "objectives": [
    { "id": "string", "text": "string", "priority": "High|Med|Low" }
  ],
  "tasks": [
    {
      "id": "string",
      "text": "string",
      "objectiveId": "string",
      "status": "backlog|doing|done",
      "estimate": "S|M|L",
      "priority": "High|Med|Low"
    }
  ],
  "timeline": [
    { "taskId": "string", "day": "string", "slot": "AM|PM" }
  ],
  "revisionHistory": [
    {
      "timestamp": "ISO timestamp",
      "patch": "json-patch"
    }
  ]
}
```

⸻

🧠 Prompts – Core

Structure Prompt (Bedrock)

```code
You are a project structuring assistant.
Input: a brain dump (text).
Output: valid JSON matching the given schema.
Ensure:
- objectives are distinct and actionable
- tasks are atomic
- priorities assigned logically
- no hallucinations
Respond with JSON ONLY.
```

Revise Prompt

```code
You are a project reviser.
Input:
1) existing project JSON
2) user instruction (text)
Apply instruction as a patch to project JSON.
Return new JSON ONLY.
```

Clarification Prompt
```code
User text is unclear on priority / dependency.
Ask a single question to clarify.
Respond in plain language.
```

⸻

🏁 Résultat attendu
	•	Une webapp fonctionnelle
	•	Une expérience fluide vocale to text → plan
	•	Démo live
	•	Facile à juger + compréhensible en 5 minutes

⸻
