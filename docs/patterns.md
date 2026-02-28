# EchoMaps — Design Patterns & Conventions

Patterns architecturaux utilisés pour garantir la robustesse et la maintenabilité d'EchoMaps.

---

## 🏗️ Backend (Express)

### 1. Route Handler Pattern

Chaque endpoint suit une structure cohérente :

```typescript
// Validation input → Appel service → Validation output → Réponse
router.post('/structure', async (req, res) => {
    try {
        const { text } = req.body;
        const validated = structureInputSchema.parse({ text });
        const result = await callBedrockStructure(validated.text);
        const roadmap = roadmapSchema.parse(result);
        res.json(roadmap);
    } catch (error) {
        logToCloudWatch(error);
        res.status(500).json({ error: 'Structure failed' });
    }
});
```

### 2. Validation Zod (Input & Output)

- **Input :** valider le body de la requête avant tout traitement.
- **Output :** valider la réponse Bedrock avant de l'envoyer au frontend.
- Ne jamais faire confiance au JSON brut de l'IA.

### 3. Error Handling

- Chaque appel Bedrock/Voxtral dans un `try/catch`.
- Log structuré vers CloudWatch (latence, erreur, coût estimé).
- Réponse HTTP cohérente : `{ error: string }` en cas d'échec.

---

## 🎨 Frontend (Next.js)

### 1. Server Components vs Client Components

- **Server Components** par défaut pour les pages et layouts (données statiques, SEO).
- **Client Components** (`"use client"`) pour : BrainDumpInput, AudioRecorder, PriorityMatrix (drag), RoadmapCanvas (interactif), tout ce qui utilise des hooks ou des événements.

### 2. Composition Pattern (Atomic Design)

- **Atomes** dans `src/components/ui/` : Button, Input, Badge, Card.
- **Molécules** : TaskCard = Card + Badge + texte.
- **Organismes** : RoadmapCanvas = liste de TaskCard, PriorityMatrix = grille de TaskCard.
- Pas de composant monolithique ; composition par props et children.

### 3. Optimistic UI

- Transcription : afficher le texte dès réception du stream Voxtral, sans attendre la fin.
- Structuration : afficher un Spinner pendant l'appel Bedrock, puis remplacer par le résultat validé.
- En cas d'erreur : rollback visuel + message d'erreur.

### 4. Separation of Concerns

- **UI** (`src/components/`) : rendu uniquement, pas de logique métier.
- **Logic** (`src/hooks/`, `src/lib/`) : useVoxtral, useBedrock, useTaskConditioning, dependencyGraph.

---

## 🤖 IA (Bedrock / Mistral)

### 1. JSON-First

- Tous les prompts exigent une réponse **JSON uniquement**, sans prose.
- Format : `Respond with valid JSON ONLY. No markdown, no explanation.`

### 2. Schema-Driven Prompts

- Le prompt inclut le schéma JSON attendu (objectives, tasks avec `dependsOn`, timeline).
- Le modèle est guidé pour produire une structure compatible Zod.

### 3. Chain-of-Thought (optionnel)

- Pour les révisions complexes : demander au modèle de raisonner avant de produire le JSON.
- Toujours terminer par une instruction explicite de sortie JSON.

---

## 🔗 Conditionnement des Tâches

### 1. Dependency Graph

- Fonctions dans `src/lib/dependencyGraph.ts` : `hasCycle()`, `topologicalSort()`.
- Utilisées avant affichage et après toute modification des tâches.

### 2. isBlocked Logic

- `task` est bloquée ⟺ ∃ d ∈ `task.dependsOn` : `tasks.find(t => t.id === d).status !== "done"`.
- Centraliser dans `useTaskConditioning` pour éviter la duplication.

### 3. Drag Constraints

- Dans PriorityMatrix : une tâche ne peut être déplacée avant ses dépendances.
- Vérifier `!isBlocked(task)` avant d'autoriser le passage en `doing`.

---

## 💬 Conventions de Code

| Règle           | Détail                                                                      |
| --------------- | --------------------------------------------------------------------------- |
| **Langue**      | Commentaires en anglais, documentation et messages utilisateur en français. |
| **TypeScript**  | Strict mode, zéro `any`.                                                    |
| **Naming**      | camelCase pour variables/fonctions, PascalCase pour composants/types.       |
| **Styles**      | Tailwind uniquement, pas de CSS inline ou fichiers .css custom.             |
| **Credentials** | Variables d'environnement uniquement, jamais en dur.                        |
