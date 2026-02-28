# 🚀 Projet Hackathon – Chaos to Clarity

## 📌 Pitch
**Chaos to Clarity** prend un *brain dump* vocal ou textuel désorganisé et le transforme en une **roadmap structurée**, une **liste de tâches prioritaires et un planning clair** en temps réel.  
Objectif : rendre productif immédiatement, avec interactivité, retour utilisateur et visualisation attractive.

---

## 🛠️ 1) Plan en 3 étapes

### 1️⃣ MVP (Must-Have)
- **Input**
  - Enregistrement audio (WebAudio) ou saisie texte
  - Transcription voix → texte
- **Processing**
  - LLM structure :
    - Objectifs principaux
    - Liste des tâches atomiques
    - Dépendances simples
    - Estimation (Small / Medium / Large)
    - Priorités automatiques
  - JSON structuré
- **Output**
  - UI « Kanban » (Backlog / Doing / Done)
  - Checklist exportable (Markdown / JSON)
  - Boucle interactive :  
    - commandes vocales ou textuelles pour :
      - modifier priorité
      - fusionner/supprimer une tâche
      - renommer / reclasser

---

### 2️⃣ Nice to Have
- **Roadmap hebdomadaire automatique**
- **Templates prédéfinis**
  - Étudiant : révisions
  - Freelance : projet client
  - Productivité perso
- **Notifications légères**
  - “Prochaine action”
  - rappels amicaux
- **Partage public**
  - Lien read-only vers roadmap
  - Export PDF

---

### 3️⃣ Effet “Wouah”
Choisir **une seule** option spectaculaire (à implémenter après MVP solide) :

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
**Next.js / React**  
- Déploiement : **AWS Amplify Hosting**
- Composants :
  - Enregistreur audio
  - Kanban / Timeline
  - Barres de progression gamifiées
  - Formulaires de révision interactive

---

### 🔗 Backend

**API Gateway** → **AWS Lambda (Python)**

Endpoints :
| Endpoint | Rôle |
|----------|-------|
| `POST /transcribe` | Audio → texte |
| `POST /structure` | Texte → JSON structuré |
| `POST /revise` | Revisions (patch sur plan) |
| `GET /project/:id` | Récupérer projet |

Option temps réel :
- **WebSocket API Gateway** pour events (suggestions, clarification)

---

### 🧠 IA – AWS Bedrock
- Modèles :
  - **Bedrock – Mistral Large**
  - (Option) **Amazon Transcribe** pour streaming audio si disponible
- Jobs :
  - Transcription
  - Structuration
  - Révisions interactives

---

### 💾 Stockage
- **S3** : audio upload temporaire
- **DynamoDB**
  - Projets
  - Tâches
  - Versions
  - Historique de révision

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
  - UI Kanban
  - Timeline / Roadmap
- **Dev 2 – Backend**
  - API Gateway + Lambda
  - DynamoDB
  - S3
  - Auth minimale
- **Dev 3 – Produit / Prompts**
  - Prompts LLM
  - JSON schema
  - Boucle interactive
  - Démo script

---

### 🗓️ Planning recommandé

#### Jour 1 – Matin (0–4h)
- Projet scaffolding
- Structure API basique (`/structure`)
- UI minimal affichant JSON structuré

#### Jour 1 – Après-midi (4–10h)
- Ajout audio → transcription
- Boucle révision (patch)
- Stockage DynamoDB + persist

#### Jour 1 – Soir (10–14h)
- Stabilisation fundamentals
- Début d’option “Wouah”

#### Jour 2 – Matin (14–20h)
- Finaliser “Wouah”
- Scénarios utiles (3)
- Export / partage

#### Jour 2 – Midi – Soir (20–24h)
- Freeze features
- Tests finaux
- Pitch + vidéos / captures

---

## 🏆 4) Optimisation pour gagner

### ✅ Ce qui tape fort avec ce projet
- **Input naturel** vocal ou texte désorganisé
- **Output concret** → plan d’action
- **Interactions bidirectionnelles**
- **Visualisation attractive**
- **Multi-modalité** (voix / texte / visual)

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
	•	Une webapp fonctionnelle dans 48h
	•	Une expérience fluide vocal → plan
	•	Démo live qui impressionne
	•	Facile à juger + compréhensible en 5 minutes

⸻

🏆 Bonus pour gagner
	•	Tests automatisés basiques
	•	Documentation pitch + captures
	•	Landing page simple mais claire

⸻


---

Si tu veux, je peux aussi te générer :
✅ la **landing page HTML/MDX**  
✅ une **checklist QA**  
✅ un **script de pitch vidéo de 90s**  
prêt à l’enregistrer pour ta soumission hackathon.