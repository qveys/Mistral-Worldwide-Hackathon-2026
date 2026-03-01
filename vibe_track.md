# 🎛️ Vibe Track — EchoMaps × Mistral Vibe Hackathon 2026

> Comment nous avons structuré le meilleur environnement de **vibe coding en équipe** pour un hackathon 48h avec Mistral Vibe (DevCode) + BMAD Method.

---

## 🧠 Philosophie

Notre approche : **ne jamais coder "à l'aveugle"**. Avant d'écrire une seule ligne, chaque agent IA (et chaque développeur) dispose d'un contexte riche, structuré et actionnable. Le résultat : du code production-ready dès le premier prompt, zéro allers-retours inutiles.

---

## 📐 1. `agents.md` — Le cerveau partagé de l'équipe

**Fichier :** `agents.md` (racine du projet)

C'est le **fichier de contexte central** lu par tous les agents IA (Mistral Vibe / GitHub Copilot / tout IDE AI). Il contient :

| Section            | Rôle                                                                                |
| ------------------ | ----------------------------------------------------------------------------------- |
| **Project Vision** | Pitch en 1 phrase pour cadrer chaque réponse IA                                     |
| **Tech Stack**     | Stack exacte (Next.js 16, Express TS, Bedrock Mistral Large, Voxtral, Zod)          |
| **Coding Rules**   | 7 règles non-négociables (Atomic Design, TS strict, JSON-First, Optimistic UI…)     |
| **Agent Roles**    | 3 personas (Architect, Prompt Engineer, UI/UX Crafter) avec responsabilités claires |
| **Data Flow**      | Pipeline complet : User speaks → Voxtral → Bedrock → Zod → UI                       |
| **Skills Toolbox** | Mapping skill → dossier → quand l'utiliser                                          |
| **Anti-Patterns**  | Ce qu'il ne faut JAMAIS faire (évite les hallucinations de l'IA)                    |

**Impact :** Chaque agent IA produit du code aligné avec l'architecture, le style et les contraintes du projet sans qu'on ait besoin de tout ré-expliquer.

---

## 🏭 2. BMAD Method — Framework d'orchestration multi-agents

**Dossier :** `_bmad/`

[BMAD](https://github.com/bmadcode/BMAD-METHOD) (Business + Marketing + Architecture + Development) est un framework open-source qui structure le travail d'agents IA spécialisés. On l'a installé et configuré pour piloter notre hackathon.

### Agents BMAD disponibles (10 agents)

| Agent                      | Persona              | Rôle clé                                                    |
| -------------------------- | -------------------- | ----------------------------------------------------------- |
| 🧙 **BMad Master**         | Orchestrateur        | Charge les workflows, dispatche les tâches, gère la mémoire |
| 📊 **Mary** (Analyst)      | Business Analyst     | Recherche marché, analyse concurrentielle                   |
| 🏗️ **Winston** (Architect) | Architecte           | Systèmes distribués, API design, infra cloud                |
| 💻 **Amelia** (Dev)        | Développeuse         | Exécution de stories, TDD, implémentation                   |
| 📋 **John** (PM)           | Product Manager      | PRD, discovery, alignement stakeholders                     |
| 🧪 **Quinn** (QA)          | QA Engineer          | Tests auto, API testing, E2E, couverture                    |
| 🚀 **Barry** (Quick Flow)  | Solo Dev rapide      | Specs lean, implémentation rapide, minimum de cérémonie     |
| 🏃 **Bob** (SM)            | Scrum Master         | Sprint planning, stories, backlog                           |
| 📚 **Paige** (Tech Writer) | Rédactrice technique | Documentation, diagrammes Mermaid                           |
| 🎨 **Sally** (UX Designer) | Designer UX          | Recherche utilisateur, UI patterns                          |

### Workflows BMAD utilisés

Les workflows couvrent tout le cycle de vie du projet, organisés par phase :

- **Phase 1 — Analyse :** `create-product-brief`, `domain-research`, `market-research`, `technical-research`
- **Phase 2 — Planning :** `create-prd`, `create-ux-design`
- **Phase 3 — Solutioning :** `create-architecture`, `create-epics-and-stories`, `check-implementation-readiness`
- **Phase 4 — Implémentation :** `dev-story`, `create-story`, `sprint-planning`, `code-review`, `correct-course`
- **Quick Flow :** `quick-spec` → `quick-dev` (pour les changements rapides)

### Analyse consolidée BMAD

Le BMad Master a orchestré **4 agents en parallèle** pour auditer le projet et produire un rapport consolidé (`docs/analysis/00-summary-consolide.md`) :

- Score global : **6.2/10** (potentiel 8.5/10)
- **5 risques critiques** identifiés et priorisés
- **7 risques élevés** avec temps de correction estimé
- Ordre de build des composants UI optimisé pour l'impact démo
- Total des corrections IA critiques : **< 2h de travail**

---

## 📋 3. Méthode PRP — Product Requirement Prompts

**Dossier :** `docs/PRPs/`

Un **PRP** (Product Requirement Prompt) est notre alternative aux PRD classiques, **optimisé pour les agents IA** :

| PRD classique       | PRP (notre méthode)                           |
| ------------------- | --------------------------------------------- |
| Décrit **quoi**     | Décrit **quoi + comment**                     |
| Pour les humains    | Optimisé pour les agents IA                   |
| Descriptions vagues | Chemins de fichiers exacts, patterns à suivre |

### Les 3 couches d'un PRP

1. **Contexte** — Chemins de fichiers, stack, JSON schema, variables d'env
2. **Implémentation** — Endpoints, prompt Mistral, flow Voxtral, composants React
3. **Validation** — Checklist testable + anti-patterns à éviter

### Template structuré

`docs/PRPs/base_template_v1.md` fournit un template complet avec :

- Goal / Why / What (scope in/out)
- Technical Context (stack, schema JSON, fichiers à lire/créer)
- Pattern à suivre (code snippet copié du codebase)
- Implementation Details (API, prompt, UI)
- Checklist de validation

**Impact :** L'agent IA reçoit un PRP et peut implémenter la feature complète en un seul pass, sans questions.

---

## ⚡ 4. Custom Commands — Workflows en 1 commande

**Dossier :** `commands/`

Deux commandes custom qui enchaînent automatiquement exploration → planification → code :

### `/create-prp [description]`

Workflow automatisé :

1. Lit `agents.md`, `docs/initial-idea.md`, `changelog.md`
2. Explore `skills/` pour trouver les patterns réutilisables
3. Explore le codebase pour identifier les fichiers similaires
4. Génère un PRP complet dans `docs/PRPs/[feature].md`

### `/explore-and-plan [PRP path]`

Workflow **EPCT** (Explore → Plan → Code → Test) :

1. **Explore** — Lit le PRP + rassemble tout le contexte via subagents parallèles
2. **Plan** — Fichiers à créer/modifier, types TS, schemas Zod, stratégie d'erreur
3. **Code** — Implémente en suivant les 7 coding rules d'`agents.md`
4. **Test** — Build TS, vérification CORS, validation Zod, états UI
5. **Write-Up** — Met à jour `changelog.md`

**Impact :** Un développeur tape une commande, l'IA fait tout le reste.

---

## 🧰 5. Skills — Connaissances spécialisées injectables

**Dossier :** `skills/` | **Lock :** `skills-lock.json`

Les skills sont des **packs de connaissances domaine** que l'IA charge à la demande. 7 skills installés :

| Skill                          | Source                                 | Usage                                          |
| ------------------------------ | -------------------------------------- | ---------------------------------------------- |
| **next-best-practices**        | `vercel-labs/next-skills`              | App Router, RSC, data fetching                 |
| **backend-patterns**           | `affaan-m/everything-claude-code`      | Routes Express, middleware, error handling     |
| **prompt-engineering**         | `inference-sh-9/skills`                | Conception de prompts Mistral (JSON-only, CoT) |
| **speech-to-text**             | `Voxtral/skills`                       | Intégration Voxtral Scribe v2, WebSocket STT   |
| **aws-solution-architect**     | `alirezarezvani/claude-skills`         | Bedrock, Lambda, CloudWatch, Amplify           |
| **ui-ux-pro-max**              | `nextlevelbuilder/ui-ux-pro-max-skill` | Design system, composants, animations          |
| **create-implementation-plan** | `github/awesome-copilot`               | Plans d'implémentation structurés              |

**Impact :** L'IA ne se base pas sur ses connaissances génériques — elle applique les best practices exactes de chaque technologie.

---

## 📚 6. `docs/` — Documentation vivante du projet

**Dossier :** `docs/`

Documentation complète générée et maintenue par les agents BMAD, servant de **source de vérité** pour tout le codebase :

| Document                                | Contenu                                                                                                                                      |
| --------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| [initial-idea.md](docs/initial-idea.md) | Pitch, MVP scope, architecture AWS, JSON schema, roadmap 48h, répartition équipe                                                             |
| [architecture.md](docs/architecture.md) | Vue système, auth, conditionnement des tâches, dépendances, flux complet                                                                     |
| [components.md](docs/components.md)     | Catalogue de tous les composants UI (atomes → organismes), hooks, hiérarchie pages                                                           |
| [services.md](docs/services.md)         | 4 services backend (Transcribe, Structure, Revise, Project) + services externes                                                              |
| [patterns.md](docs/patterns.md)         | Design patterns backend (Route Handler, Zod validation, error handling) et frontend (Server/Client Components, Atomic Design, Optimistic UI) |
| [database.md](docs/database.md)         | Schéma de données JSON (Project, Objectives, Tasks avec dependsOn, Timeline)                                                                 |
| [i18n.md](docs/i18n.md)                 | Stratégie d'internationalisation (next-intl, fr/en, routing)                                                                                 |

### Analyses BMAD (`docs/analysis/`)

4 rapports d'analyse spécialisés produits par les agents :

| Rapport                           | Agent                     |
| --------------------------------- | ------------------------- |
| `01-product-vision-analysis.md`   | 🎯 Product Agent          |
| `02-architecture-analysis.md`     | 🏗️ Architecture Agent     |
| `03-frontend-ux-analysis.md`      | 🎨 Frontend/UX Agent      |
| `04-ai-voice-prompts-analysis.md` | 🤖 AI/Prompt Agent        |
| `00-summary-consolide.md`         | 🧙 BMad Master (synthèse) |

### Plan d'implémentation (`docs/plans/`)

Plan feature-based avec **46 stories** réparties en **14 epics**, assignées à 3 développeurs (@qveys, @alice-444, @Matlavv) travaillant en parallèle asynchrone.

---

## 🤖 7. `git-autopilot.py` — Sync automatique intelligente

**Fichier :** `git-autopilot.py`

Script Python qui tourne en arrière-plan et :

1. **Pull --rebase** toutes les minutes (résolution de conflits via LLM si besoin)
2. **Découpe granulaire** du diff en commits sémantiques (un commit = un changement logique)
3. **Push** automatique

**Impact :** 3 développeurs codent en parallèle sans jamais se bloquer sur des conflits git. Zéro friction de synchronisation pendant le hackathon.

---

## 📝 8. `changelog.md` — Historique structuré

**Fichier :** `changelog.md`

Format [Keep a Changelog](https://keepachangelog.com/) avec sections :

- 🚀 Added / 🧠 AI & Prompt Evolution / 🔧 Fixed
- Mis à jour automatiquement par le workflow EPCT après chaque feature

**Impact :** Chaque agent IA lit le changelog pour connaître l'état exact du projet avant de coder.

---

## 🔄 Le Workflow Complet en Action

```
1. Vision & Analyse
   └─ agents.md + docs/ + BMAD analysts → contexte riche

2. Planification
   └─ /create-prp "nouvelle feature"
   └─ Agent explore codebase + skills/ + docs/
   └─ Génère PRPs/[feature].md (optimisé pour l'IA)

3. Implémentation
   └─ /explore-and-plan PRPs/[feature].md
   └─ Agent lit PRP → Plan → Code → Test → Changelog

4. Synchronisation
   └─ git-autopilot.py sync en continu (pull/rebase/push)
   └─ 3 devs × parallèle asynchrone × zéro conflit

5. Itération
   └─ BMAD code-review + correct-course + retrospective
```

---

## 🏆 Pourquoi c'est la meilleure utilisation de Mistral Vibe

| Critère           | Notre approche                                                   |
| ----------------- | ---------------------------------------------------------------- |
| **Contexte IA**   | `agents.md` + 7 docs + 4 analyses = l'IA comprend tout le projet |
| **Méthodologie**  | BMAD (10 agents spécialisés, 25+ workflows, mémoire persistante) |
| **Productivité**  | PRPs + custom commands = feature complète en 1 prompt            |
| **Connaissances** | 7 skills domaine installés (Voxtral, Bedrock, Next.js, UX…)      |
| **Équipe**        | 3 devs en parallèle, sync automatique, plan feature-based        |
| **Qualité**       | Zod validation, coding rules strictes, anti-patterns documentés  |
| **Traçabilité**   | Changelog auto, analyses BMAD, plan d'implémentation détaillé    |

> **En résumé :** On n'a pas juste "vibé avec un LLM". On a construit un **système complet** où chaque agent IA a le bon contexte, les bonnes règles, et les bons outils pour produire du code de qualité — en équipe, en parallèle, en 48h.
