# Analyse Frontend & UX — EchoMaps
*Analyst: BMAD Frontend/UX Agent | Date: 2026-02-28*

## Résumé Exécutif

Base technique solide (Next.js 15, Tailwind, Framer Motion, Atomic Design). Les 3 composants initiaux couvrent le coeur du flux. Cependant plusieurs gaps critiques menacent l'impact démo : absence d'états de chargement visuels, absence de feedback audio temps réel, composants "pont" manquants entre input vocal et output roadmap.

**Score actuel : 4.5/10 | Potentiel après 8h : 7.5/10**

## Forces UX Actuelles

- Next.js 15 App Router — SSR + hydratation client, pas d'over-engineering
- Atomic Design dans `src/components/ui/` — composants testables rapidement
- Framer Motion déjà intégré (zéro coût d'installation pendant le sprint)
- `BrainDumpInput`, `RoadmapCanvas`, `PriorityMatrix` couvrent le flow principal
- Référence Linear/Raycast — positionnement sobre et crédible

## Gaps Critiques (composants manquants)

### Priorité 1 — Bloquants pour la démo

| Composant | Risque si absent |
|-----------|-----------------|
| **TranscriptionLiveView** | Phase d'enregistrement semble figée — premier wow absent |
| **LoadingOrchestrator** | Délai Bedrock sans feedback = impression de bug fatal |
| **RoadmapRevisionInput** | Flux "Met ceci en urgent" impossible à démontrer |

### Priorité 2 — Impact fort

| Composant | Effort |
|-----------|--------|
| **MicButton** (3 états visuels) | 1h |
| **ActionItemsList** | 1-2h |
| **ExportButton** | 30min |

### Priorité 3 — Déprioriser absolument

- Focus Mode, Activity Graph, Smart Reminder, Gamification XP — hors scope 48h

## Analyse du Parcours Utilisateur

4 gaps de transition identifiés :
1. **Gap 1** : Micro → transcription (pas de feedback immédiat)
2. **Gap 2** : Texte → traitement IA (2-4s de blanc sans LoadingOrchestrator)
3. **Gap 3** : JSON → rendu roadmap (apparition brutale sans stagger)
4. **Gap 4** : Roadmap → révision (RoadmapRevisionInput absent = 0 découvrabilité)

**Layout recommandé** : 2 colonnes (40% input / 60% output) sur desktop, stack vertical mobile.

## Recommandations Prioritaires

1. **MicButton** 3 états + onde audio canvas (1h)
2. **TranscriptionLiveView** mot par mot + AnimatePresence (1.5h)
3. **LoadingOrchestrator** skeleton + texte rotatif 3 phases (1.5h)
4. **Stagger animation RoadmapCanvas** (45min)
5. **RoadmapRevisionInput** + chips prédéfinis (1h)
6. **ExportButton** Markdown + clipboard (30min)
7. **DEMO_MODE** mock data (30min)
8. **ARIA + focus rings + reduced-motion** (45min)

## Design "Wow" Recommandé

- **Onde audio** : AnalyserNode Web Audio API, 32 barres sous MicButton (2h)
- **Reveal stagger** : `staggerChildren: 0.1`, x:-20→0, 300ms (45min)
- **Pulse validation** : bordure verte 600ms après révision réussie (30min)

**À éviter** : particules/confettis, transitions full-screen, modales d'onboarding.

## Palette recommandée (Calm but powerful)

- Fond : `slate-950`
- Accent : `indigo-500`
- Recording : `red-500` + glow `shadow-red-500/30`
- Success : `emerald-500`
- Priorité High/Med/Low : `rose-600` / `amber-500` / `slate-400`

## Accessibilité & Mobile

- ARIA labels dynamiques sur MicButton
- `aria-live="polite"` sur TranscriptionLiveView
- `focus-visible:ring-2 focus-visible:ring-indigo-500` sur tous les boutons
- `useReducedMotion()` Framer Motion — désactiver translations, garder opacité
- Mobile : D&D remplacé par boutons Haut/Bas sur < 768px
- `text-base` minimum sur les inputs (évite zoom iOS)
