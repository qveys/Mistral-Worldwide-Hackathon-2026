# EchoMaps — Définition des Services

Description des services backend et de leurs responsabilités.

---

## 📡 Services API (Backend Express)

### 1. Transcribe Service

**Route :** `POST /transcribe`

**Responsabilité :** Convertir l'audio en texte via Voxtral.

| Aspect         | Détail                                             |
| -------------- | -------------------------------------------------- |
| **Input**      | Audio (stream ou fichier) selon le format Voxtral. |
| **Output**     | Texte transcrit.                                   |
| **Dépendance** | Voxtral API (WebSocket ou REST).                   |
| **Erreur**     | `try/catch` + log CloudWatch si échec Voxtral.     |

---

### 2. Structure Service

**Route :** `POST /structure`

**Responsabilité :** Transformer un brain dump (texte) en roadmap JSON structurée via Mistral.

| Aspect         | Détail                                                         |
| -------------- | -------------------------------------------------------------- |
| **Input**      | `{ text: string }` — brain dump brut.                          |
| **Output**     | `Roadmap` — objectives, tasks (avec `dependsOn`), timeline.    |
| **Dépendance** | AWS Bedrock (Mistral Large `mistral.mistral-large-2402-v1:0`). |
| **Validation** | Zod : `roadmapSchema.parse(result)` avant envoi au client.     |
| **Erreur**     | Rejet si JSON invalide ou cycle détecté dans les dépendances.  |

---

### 3. Revise Service

**Route :** `POST /revise`

**Responsabilité :** Appliquer une instruction utilisateur sur un plan existant (patch JSON).

| Aspect         | Détail                                                                  |
| -------------- | ----------------------------------------------------------------------- |
| **Input**      | `{ projectId: string, instruction: string, roadmap: Roadmap }`.         |
| **Output**     | `Roadmap` — plan mis à jour (objectives, tasks, timeline, `dependsOn`). |
| **Dépendance** | AWS Bedrock (Mistral Large).                                            |
| **Validation** | Zod + détection de cycles avant retour.                                 |
| **Erreur**     | Rejet si instruction ambiguë ou JSON invalide.                          |

---

### 4. Project Service

**Route :** `GET /project/:id`

**Responsabilité :** Récupérer un projet sauvegardé.

| Aspect          | Détail                                 |
| --------------- | -------------------------------------- |
| **Input**       | `id` — identifiant du projet.          |
| **Output**      | `Roadmap` ou 404 si inexistant.        |
| **Dépendance**  | S3 ou stockage local (hackathon 48h).  |
| **Permissions** | Lecture seule pour les liens partagés. |

---

## 🌐 Services Externes

### Voxtral

- **Rôle :** Speech-to-Text (STT) en temps réel.
- **Usage :** WebSocket pour streaming audio → transcription.
- **Config :** `MISTRAL_API_KEY` en variable d'environnement.

### AWS Bedrock (Mistral Large)

- **Rôle :** Structuration et révision du plan.
- **Modèle :** `mistral.mistral-large-2402-v1:0`.
- **Config :** `AWS_REGION`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`.

### AWS S3 (optionnel)

- **Rôle :** Persistance des projets.
- **Usage :** Stockage JSON par `projectId`.

### CloudWatch

- **Rôle :** Logs structurés, métriques.
- **Usage :** Latence API, erreurs LLM, coût estimé par requête.

---

## 📂 Organisation Backend

```text
app/backend/
├── routes/
│   ├── transcribe.ts    # POST /transcribe
│   ├── structure.ts     # POST /structure
│   ├── revise.ts        # POST /revise
│   └── project.ts       # GET /project/:id
├── services/
│   ├── Voxtral.ts    # Client Voxtral
│   ├── bedrock.ts       # Client Bedrock, callMistral
│   └── storage.ts       # S3 ou persistance
├── prompts/
│   ├── structure.ts     # Prompt structuration
│   └── revise.ts        # Prompt révision
└── lib/
    └── schema.ts        # Schémas Zod
```
