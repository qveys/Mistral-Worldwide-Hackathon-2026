# EchoMaps — Plan d'Implémentation

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Restructurer les 48 issues GitHub existantes en un plan d'implémentation feature-based, organisé par priorité MVP → Nice-to-Have → Wahou, assigné équitablement à 3 développeurs travaillant en parallèle asynchrone.

**Architecture:** Frontend Next.js 15 (App Router) + Backend Express TypeScript déployé sur Lambda. Pipeline : Voxtral WebSocket STT → Mistral Large (AWS Bedrock) → Roadmap JSON validée par Zod → UI React.

**Tech Stack:** Next.js 15, TailwindCSS, Framer Motion, Express TypeScript, AWS Bedrock (Mistral Large), Voxtral WebSocket SDK, Zod, AWS Lambda/Amplify

---

## 📊 Analyse des Issues Existantes (48 issues → reset complet)

### Problèmes identifiés dans les issues actuelles

| Problème                              | Issues concernées                                                                                           |
| ------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| **Doublons**                          | #2 (inject JSON schema) ⊂ #31 (inject dependsOn + schema) → fusionner                                       |
| **Multi-problèmes**                   | #36 = timeline topologique + revise dependsOn (2 problèmes) → séparer                                       |
| **Organisation domain-based**         | Toutes les issues groupées par domaine (AI/Infra/Frontend) au lieu de features                              |
| **Manque d'issues MVP fondamentales** | Pas d'issues pour l'implémentation initiale des endpoints (POST /transcribe, POST /structure, POST /revise) |
| **Numérotation non prioritaire**      | Epic 1 = AI Hardening, Epic 5 = UX — mais UX est plus critique visuellement pour la démo                    |

### Action : fermer les 48 issues, créer 46 stories + 14 epics feature-based

---

## 👥 Répartition par Développeur

| Dev            | Rôle                | Issues assignées |
| -------------- | ------------------- | ---------------- |
| **@qveys**     | Frontend / UI       | 15 issues        |
| **@alice-444** | Backend / Infra     | 16 issues        |
| **@Matlavv**   | AI / Hooks / Schema | 15 issues        |

---

## 🎯 PHASE 1 — MVP (Must-Have)

> Objectif : Speech-to-text via Voxtral → roadmap structurée par Mistral → UI fonctionnelle pour la démo 48h.

---

### 🏗️ [EPIC 1] Fondation Partagée

_Bloquant pour tout le reste — à faire en PREMIER, en parallèle sur 3 fichiers distincts._

| ID      | Titre                                                                   | Assigné    | Priorité    |
| ------- | ----------------------------------------------------------------------- | ---------- | ----------- |
| **1-1** | Schéma Zod partagé — `schema.ts` (Roadmap, Task, Objective, Timeline)   | @Matlavv   | 🔴 critical |
| **1-2** | Backend Express — `server.ts`, middleware CORS, env vars, routing base  | @alice-444 | 🔴 critical |
| **1-3** | Frontend Next.js — `layout.tsx`, globals.css, TailwindCSS config, theme | @qveys     | 🔴 critical |

**Dépendances :** Aucune. Ces 3 issues sont le point zéro.

---

### 🎤 [EPIC 2] Voice Input — Voxtral STT

_Le cœur fonctionnel du produit : parler → texte en temps réel._

| ID      | Titre                                                                                          | Assigné    | Priorité    |
| ------- | ---------------------------------------------------------------------------------------------- | ---------- | ----------- |
| **2-1** | Backend `POST /transcribe` — intégration Voxtral WebSocket audio → texte                       | @alice-444 | 🔴 critical |
| **2-2** | Hook `useVoxtral` — WebSocket client, CommitStrategy.VAD, states (idle/listening/transcribing) | @Matlavv   | 🔴 critical |
| **2-3** | Composant `MicButton` — 3 états visuels (idle/recording/processing) + onde audio animée        | @qveys     | 🔴 critical |
| **2-4** | Composant `TranscriptionLiveView` — mots en temps réel, animation mot par mot                  | @qveys     | 🔴 critical |

**Dépendances :** Nécessite Epic 1 terminé. 2-1 (backend) et 2-2/2-3/2-4 (frontend) parallélisables entre eux.

---

### 🤖 [EPIC 3] AI Structuring — Mistral via Bedrock

_Transformer le brain dump texte en roadmap JSON structurée._

| ID      | Titre                                                                                          | Assigné    | Priorité    |
| ------- | ---------------------------------------------------------------------------------------------- | ---------- | ----------- |
| **3-1** | Backend `POST /structure` — callMistral, temperature=0, Zod parse, JSON extraction guard       | @alice-444 | 🔴 critical |
| **3-2** | Prompt Structure — injection schéma JSON complet dans le prompt, JSON-only output              | @Matlavv   | 🔴 critical |
| **3-3** | Backend `POST /revise` — instruction utilisateur → Mistral → Roadmap complète re-validée       | @alice-444 | 🔴 critical |
| **3-4** | Prompt Revise — format instruction clair, retour JSON complet (abandonner json-patch RFC 6902) | @Matlavv   | 🔴 critical |

**Dépendances :** Nécessite 1-1 (schema) et 1-2 (backend). 3-1 et 3-3 parallèles après 1-2.

---

### 💾 [EPIC 4] Data & API Projet

_Persistance minimale pour le hackathon + partage par lien._

| ID      | Titre                                                                      | Assigné    | Priorité    |
| ------- | -------------------------------------------------------------------------- | ---------- | ----------- |
| **4-1** | Service `storage.ts` — `saveProject()` / `getProject()` (filesystem ou S3) | @alice-444 | 🔴 critical |
| **4-2** | Endpoint `GET /project/:id` — retourner Roadmap ou 404                     | @alice-444 | 🔴 critical |

**Dépendances :** Nécessite 1-1 (schema) et 1-2 (backend).

---

### 🎨 [EPIC 5] Frontend Core — Input & Affichage Roadmap

_L'expérience utilisateur principale : saisie → affichage roadmap._

| ID      | Titre                                                                                       | Assigné | Priorité    |
| ------- | ------------------------------------------------------------------------------------------- | ------- | ----------- |
| **5-1** | `app/page.tsx` — Homepage : CTA "Nouveau projet" + chargement projet existant par ID        | @qveys  | 🔴 critical |
| **5-2** | Composant `BrainDumpInput` — textarea éditable + bouton envoi + transcription optimistic UI | @qveys  | 🔴 critical |
| **5-3** | Composant `RoadmapCanvas` — timeline verticale, affichage tasks, animation stagger reveal   | @qveys  | 🔴 critical |
| **5-4** | Composant `ActionItemsList` + `TaskCard` — liste tâches, badges priorité/statut, clickable  | @qveys  | 🔴 critical |
| **5-5** | Composant `LoadingOrchestrator` — masquer latence Bedrock avec états animés progressifs     | @qveys  | 🔴 critical |

**Dépendances :** Nécessite 1-3 (frontend setup). 5-1 débloque 5-2, 5-2 débloque 5-3/5-4/5-5.

---

### ✏️ [EPIC 6] Système de Révision

_Affiner la roadmap conversationnellement._

| ID      | Titre                                                                                        | Assigné  | Priorité |
| ------- | -------------------------------------------------------------------------------------------- | -------- | -------- |
| **6-1** | Composant `ReviseInput` — champ texte + chips prédéfinis ("Met en urgent", "Déplace en J2")  | @qveys   | 🟠 high  |
| **6-2** | Hook `useBedrock` — appels `POST /structure` et `POST /revise`, optimistic update + rollback | @Matlavv | 🟠 high  |

**Dépendances :** Nécessite Epic 3 + Epic 5. Parallélisables entre eux.

---

### 🛡️ [EPIC 7] Résilience Démo

_Garantir que la démo fonctionne même si un service externe est down._

| ID      | Titre                                                                             | Assigné    | Priorité    |
| ------- | --------------------------------------------------------------------------------- | ---------- | ----------- |
| **7-1** | `DEMO_MODE` env flag — mock JSON activable, bypass Bedrock + Voxtral              | @Matlavv   | 🔴 critical |
| **7-2** | Fallback input texte — bypass Voxtral si WebSocket down, textarea directe         | @alice-444 | 🟠 high     |
| **7-3** | Error States UI — toast notification, bouton "Réessayer", Error Boundary React    | @qveys     | 🟠 high     |
| **7-4** | Voxtral WebSocket — reconnexion avec exponential backoff (max 3 tentatives)       | @alice-444 | 🟠 high     |
| **7-5** | Bedrock retry + logs CloudWatch — max 2 tentatives sur échec Zod, logs structurés | @alice-444 | 🟠 high     |

**Dépendances :** 7-1 dès Epic 1. 7-2/7-3 après Epics 2+5. 7-4 après 2-1. 7-5 après 3-1.

---

## ✨ PHASE 2 — Nice to Have

> Objectif : améliorer la qualité, la robustesse, et préparer la croissance post-hackathon.

---

### 🔗 [EPIC 8] Système de Dépendances (dependsOn)

_Feature différenciante : tâches prérequises, détection de cycles, UI bloquée/disponible._

| ID      | Titre                                                                                      | Assigné    | Priorité |
| ------- | ------------------------------------------------------------------------------------------ | ---------- | -------- |
| **8-1** | Schéma Zod étendu — ajout `dependsOn` + prompt Structure mis à jour                        | @Matlavv   | 🟠 high  |
| **8-2** | `src/lib/dependencyGraph.ts` — `hasCycle()` + `topologicalSort()` (DFS)                    | @Matlavv   | 🟠 high  |
| **8-3** | Backend validation — intégrité référentielle `dependsOn` + contrainte timeline             | @alice-444 | 🟠 high  |
| **8-4** | Hook `useTaskConditioning` — `isBlocked()`, `getAvailableTasks()`, `getTopologicalOrder()` | @Matlavv   | 🟠 high  |
| **8-5** | `TaskCard` indicateur visuel — bloquée (grisée + icône 🔒) vs disponible (cliquable)       | @qveys     | 🟠 high  |
| **8-6** | `PriorityMatrix` drag constraints — refus de déplacement si tâche bloquée                  | @Matlavv   | 🟠 high  |
| **8-7** | `POST /revise` met à jour `dependsOn` + timeline topologique re-ordonnée                   | @alice-444 | 🟠 high  |

**Dépendances :** Nécessite MVP complet. 8-1 débloque 8-2, 8-3, 8-4. 8-4 débloque 8-5, 8-6.

---

### 🎨 [EPIC 9] UI Atoms, Accessibilité & Polish

_Composants réutilisables + accessibilité + responsive._

| ID      | Titre                                                                               | Assigné  | Priorité  |
| ------- | ----------------------------------------------------------------------------------- | -------- | --------- |
| **9-1** | Atoms UI — `Button`, `Input`, `Badge`, `Card`, `Spinner` + molécule `ObjectiveCard` | @qveys   | 🟡 medium |
| **9-2** | ARIA labels, focus rings, `prefers-reduced-motion` sur animations Framer Motion     | @qveys   | 🟡 medium |
| **9-3** | Layout responsive — 2 colonnes desktop, mobile-first (375px, 768px)                 | @qveys   | 🟡 medium |
| **9-4** | `ExportButton` — copie Markdown dans clipboard + téléchargement JSON                | @Matlavv | 🟡 medium |

**Dépendances :** Peut commencer dès Epic 5 terminé.

---

### ⚙️ [EPIC 10] Infrastructure & Performance

_Stabilité Lambda, monitoring, santé API._

| ID       | Titre                                                                    | Assigné    | Priorité  |
| -------- | ------------------------------------------------------------------------ | ---------- | --------- |
| **10-1** | Lambda timeout ≥60s + stratégie warmup pré-démo (éviter cold start 3-8s) | @alice-444 | 🟡 medium |
| **10-2** | `GET /health` endpoint + rate limiting Express (protection abuse)        | @alice-444 | 🟡 medium |

**Dépendances :** Après Epic 4.

---

### 📋 [EPIC 11] Templates de Roadmaps

_Démarrer avec un template au lieu d'un brain dump vide._

| ID       | Titre                                                                                     | Assigné    | Priorité  |
| -------- | ----------------------------------------------------------------------------------------- | ---------- | --------- |
| **11-1** | Backend templates — 3 roadmaps JSON pré-construites (étudiant, freelance, product launch) | @alice-444 | 🟡 medium |
| **11-2** | UI sélection de template — page de sélection avant BrainDumpInput                         | @Matlavv   | 🟡 medium |

**Dépendances :** Après Epic 4 (storage) et Epic 5 (UI).

---

## 🚀 PHASE 3 — Effet Wahou

> Objectif : impression démo, différenciation maximale, fun.

---

### 🧠 [EPIC 12] Live Brain Dump (IA qui pose des questions en live)

_L'IA analyse le brain dump en direct et pose des questions de clarification._

| ID       | Titre                                                                                 | Assigné    | Priorité  |
| -------- | ------------------------------------------------------------------------------------- | ---------- | --------- |
| **12-1** | Composant `ClarificationBubble` — bulle IA, animation slide-in, réponse/ignorer       | @qveys     | 🟡 medium |
| **12-2** | Backend `POST /clarify` + prompt clarification — détecter ambiguïté, poser 1 question | @alice-444 | 🟡 medium |

---

### 🎮 [EPIC 13] Gamification (Coach Gamifié)

_XP, streaks, achievements pour complétion de tâches._

| ID       | Titre                                                                                    | Assigné  | Priorité |
| -------- | ---------------------------------------------------------------------------------------- | -------- | -------- |
| **13-1** | XP + streak system — calcul points par tâche complétée, jours consécutifs (localStorage) | @Matlavv | 🟢 low   |
| **13-2** | Achievement badges + animations — badges débloquables, animation confetti sur complétion | @Matlavv | 🟢 low   |

---

### 🔗 [EPIC 14] Partage & Visualisation Avancée

_Partage public read-only + visualisation graphe de dépendances._

| ID       | Titre                                                                                | Assigné    | Priorité |
| -------- | ------------------------------------------------------------------------------------ | ---------- | -------- |
| **14-1** | Lien de partage read-only — bouton "Partager", copie URL `/project/:id`, vue lecteur | @alice-444 | 🟢 low   |
| **14-2** | `DependencyGraph` (optionnel) — vue graphe nœuds/arêtes via reactflow                | @qveys     | 🟢 low   |

---

## 📊 Récapitulatif Global

| Phase            | Epics     | Stories |
| ---------------- | --------- | ------- |
| **MVP**          | 7 (1-7)   | 25      |
| **Nice to Have** | 4 (8-11)  | 15      |
| **Wahou**        | 3 (12-14) | 6       |
| **TOTAL**        | **14**    | **46**  |

### Distribution par développeur

| Dev            | MVP | Nice-to-Have | Wahou | **Total** |
| -------------- | --- | ------------ | ----- | --------- |
| **@qveys**     | 9   | 4            | 2     | **15**    |
| **@alice-444** | 10  | 5            | 1     | **16**    |
| **@Matlavv**   | 6   | 6            | 3     | **15**    |
| TOTAL          | 25  | 15           | 6     | **46**    |

### Détail des assignations

**@qveys** (Frontend/UI): 1-3, 2-3, 2-4, 5-1, 5-2, 5-3, 5-4, 5-5, 6-1, 7-3, 8-5, 9-1, 9-2, 9-3, 12-1, 14-2 → **15**

**@alice-444** (Backend/Infra): 1-2, 2-1, 3-1, 3-3, 4-1, 4-2, 7-2, 7-4, 7-5, 8-3, 8-7, 10-1, 10-2, 11-1, 12-2, 14-1 → **16**

**@Matlavv** (AI/Hooks/Schema): 1-1, 2-2, 3-2, 3-4, 6-2, 7-1, 8-1, 8-2, 8-4, 8-6, 9-4, 11-2, 13-1, 13-2 → **14** _(+ 14-2 si @qveys surchargé)_ → **15**

---

## 🔄 Ordre d'Exécution Recommandé

```
Semaine 1 (Hackathon 48h):
├── Heure 1-2: Epic 1 (tous en parallèle — fondation)
├── Heure 2-12: Epic 2 + Epic 3 + Epic 4 (parallèle: @qveys UI / @alice-444 Backend / @Matlavv AI)
├── Heure 12-24: Epic 5 + Epic 6 (frontend affichage + révision)
├── Heure 24-36: Epic 7 (résilience démo) + début Epic 8
└── Heure 36-48: Polish, démo prep, Nice-to-Have si le temps le permet
```

---

## ⚠️ Issues à Fermer (48 existantes)

Fermer avec commentaire : _"Réorganisation feature-based — remplacé par le plan d'implémentation [docs/plans/2026-02-28-echomaps-implementation.md]"_

Issues à fermer : #1 à #48 (toutes)
