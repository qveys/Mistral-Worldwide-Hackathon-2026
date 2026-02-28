# PRP Flow — EchoMaps

Un **PRP (Product Requirement Prompt)** est le packet minimum qu'un agent IA a besoin pour livrer du code production-ready du premier coup.

## Différence avec un PRD classique

| PRD | PRP |
|-----|-----|
| Décrit **quoi** | Décrit **quoi + comment** |
| Pour les humains | Optimisé pour les agents IA |
| Descriptions vagues | Chemins de fichiers exacts |

## Les 3 couches d'un PRP

1. **Contexte** — chemins de fichiers, stack, JSON schema, env vars
2. **Implémentation** — endpoints, prompt Mistral, flow ElevenLabs, composants
3. **Validation** — checklist testable + anti-patterns à éviter

## Workflow Vibe Coding

```
/create-prp [description]
   ↓ Agent explore codebase + skills/ + docs/
   ↓ Agent génère PRPs/[feature].md
   ↓ Tu valides (scope correct ? approche ok ? hackathon-feasible ?)
   ↓ /explore-and-plan PRPs/[feature].md
   ↓ Code production-ready + changelog mis à jour
```

## Structure du projet

```
.
├── agents.md            # Vibe, stack, coding rules, agent roles
├── changelog.md         # Historique des modifications (Keep a Changelog)
├── docs/
│   └── initial-idea.md  # Pitch, JSON schema, architecture AWS
├── PRPs/
│   ├── README.md        # Ce fichier
│   ├── base_template_v1.md
│   └── [feature].md     # PRPs générés
├── commands/
│   ├── create-prp.md    # /create-prp [description]
│   └── explore-and-plan.md  # /explore-and-plan [PRP path]
└── skills/
    ├── next-best-practices/
    ├── backend-patterns/
    ├── prompt-engineering/
    ├── speech-to-text/
    ├── aws-solution-architect/
    └── ui-ux-pro-max/
```

## Principe fondamental

> "Context is king" in agentic prompt engineering.
>
> Un LLM génère du code de meilleure qualité avec des références directes (chemins de fichiers, extraits de code, JSON schema exact) plutôt que des descriptions abstraites.

## Comment créer un PRP

```bash
# Dans Antigravity / Claude Code :
/create-prp Ajouter la transcription ElevenLabs en temps réel
/create-prp Endpoint POST /structure avec validation Zod
/create-prp Composant PriorityMatrix drag-and-drop
```

## Règles de vibe coding EchoMaps

- **Atomic Design** — composants petits et réutilisables dans `components/ui/`
- **TypeScript strict** — pas de `any`, Zod sur toutes les sorties LLM
- **JSON-First** — Mistral répond toujours en JSON pur
- **Error Handling** — try/catch + log CloudWatch sur chaque appel externe
- **Optimistic UI** — afficher la transcription immédiatement, corriger après
