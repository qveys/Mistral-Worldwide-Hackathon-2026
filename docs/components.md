# EchoMaps — Composants Frontend

Liste des composants clés de l'interface EchoMaps. Organisation selon l'**Atomic Design** : composants petits et réutilisables dans `src/components/ui/`.

---

## 🧱 Composants UI (Atomes)

Composants de base réutilisables dans `src/components/ui/` :

| Composant | Rôle |
| --------- | ---- |
| **Button** | Bouton primaire/secondaire (CTA, actions). |
| **Input** | Champ de saisie texte. |
| **Textarea** | Zone de texte multi-lignes (brain dump éditable). |
| **Badge** | Indicateur de statut (backlog, doing, done) ou priorité (High, Med, Low). |
| **Card** | Conteneur pour TaskCard, objectif, etc. |
| **Spinner** | Indicateur de chargement (transcription, structuration). |

---

## 📥 Input & Transcription

| Composant | Rôle |
| --------- | ---- |
| **BrainDumpInput** | Zone principale : saisie texte + enregistrement audio. Affiche la transcription en temps réel (optimistic UI). |
| **AudioRecorder** | Bouton micro, gestion WebAudio, envoi du flux vers ElevenLabs. |
| **TranscriptEditor** | Zone de texte modifiable après transcription. Permet d'ajuster le texte avant structuration. |

---

## 🗺️ Roadmap & Tâches

| Composant | Rôle |
| --------- | ---- |
| **RoadmapCanvas** | Timeline verticale des tâches, ordonnée par **ordre topologique** (dépendances respectées). |
| **TaskCard** | Carte d'une tâche : texte, statut, priorité. Indicateur visuel : **bloquée** (grisée) vs **disponible** (cliquable). |
| **PriorityMatrix** | Matrice drag & drop urgence/importance. Déplacement limité : une tâche ne peut être placée avant ses dépendances. |
| **DependencyGraph** | (Optionnel) Vue graphe : nœuds = tâches, arêtes = `dependsOn`. |
| **ObjectiveCard** | Carte d'un objectif avec ses tâches associées. |

---

## ✏️ Révision & Actions

| Composant | Rôle |
| --------- | ---- |
| **ReviseInput** | Champ pour instruction de révision ("Met X en urgent", "Y dépend de Z"). Déclenche `POST /revise`. |
| **ClarificationBubble** | Bulle affichant une question de clarification de l'IA. |
| **ExportButton** | Export Markdown / PDF / lien partagé. |

---

## 🪝 Hooks

| Hook | Rôle |
| ---- | ---- |
| **useElevenLabs** | Connexion WebSocket ElevenLabs, transcription temps réel, état (idle, listening, transcribing). |
| **useBedrock** | Appels `POST /structure` et `POST /revise`, gestion loading/error. |
| **useTaskConditioning** | `isBlocked(task)`, `getAvailableTasks()`, `getTopologicalOrder()`. Logique de conditionnement des tâches. |

---

## 📐 Hiérarchie des Pages

```text
app/
├── page.tsx                 # Page d'accueil / nouveau projet
├── project/
│   └── [id]/
│       └── page.tsx         # Vue projet : BrainDumpInput + RoadmapCanvas + PriorityMatrix
└── layout.tsx
```

---

## 🎨 Conventions

- **Tailwind** uniquement, pas de styles en dur.
- **Framer Motion** pour les animations (apparition, transitions).
- Références visuelles : Linear, Raycast.
- Vibe : calme mais puissant, productivité-first.
