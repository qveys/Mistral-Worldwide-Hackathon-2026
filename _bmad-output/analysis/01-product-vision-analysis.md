# Analyse Produit & Vision — EchoMaps

_Analyst: BMAD Product Agent | Date: 2026-02-28_

## Résumé Exécutif

EchoMaps possède un concept fort, immédiatement compréhensible, et une proposition de valeur différenciante pour un hackathon : transformer l'anxiété cognitive d'un brain dump en plan d'action structuré, en temps réel, sans friction. Le positionnement "voix → roadmap actionnable" est rare et mémorable pour un jury. Cependant, le périmètre technique est ambitieux pour 48h, et trois risques majeurs menacent la cohérence de la démo : la latence de la chaîne Voxtral→Bedrock, la stabilité des prompts JSON sous pression, et la surcharge de composants UI non prioritaires.

**Score Global : 7.5 / 10**

## Forces du Concept

- Proposition de valeur instantanément lisible — "Brain dump vocal → roadmap" se pitche en une phrase
- Démo naturellement narrative (script 5 actes synchronisable avec précision)
- Différenciation technique visible : Voxtral STT + Mistral Large + révision conversationnelle
- JSON Schema bien conçu (`objectives → tasks → timeline → revisionHistory`)
- Fondations de code solides (bugs CORS et WebSocket résolus en v0.1.0)
- Validation Zod côté backend — pattern rare et mature en hackathon
- Cible utilisateur universelle : entrepreneurs, étudiants, freelances

## Faiblesses & Risques

- **[HIGH]** Latence chaîne vocale → IA → UI (3-8s potentiels de blanc sans état de chargement)
- **[HIGH]** Instabilité des prompts JSON sur inputs atypiques (courts, multilingues, ambigus)
- **[HIGH]** Périmètre UI trop large — 11 composants pour 1 dev front = 11 médiocres
- **[MED]** Dépendance à deux services tiers critiques sans fallback (Voxtral + Bedrock)
- **[MED]** Absence de persistance utilisateur (projectId sans stockage)
- **[MED]** Complexité du système de révision par json-patch
- **[LOW]** Incohérence Next.js 15 vs 16 dans les fichiers de contexte

## Priorités MVP Recommandées

1. Pipeline voix → texte transcrit visible en temps réel (Voxtral WebSocket)
2. POST /structure → rendu RoadmapCanvas + PriorityMatrix avec données réelles
3. États de loading intermédiaires explicites ("IA en train de structurer...")
4. Révision conversationnelle minimale via POST /revise
5. Fallback texte en cas d'échec de la transcription vocale
6. Persistance minimale en session (localStorage)
7. Mobile-friendliness basique

## Recommandations "Wow Effect"

**Option A unanime : Live Brain Dump**

- Seule option qui crée un effet visuel _pendant_ le discours
- Afficher transcript mot par mot en temps réel dans BrainDumpInput
- Lancer POST /structure à l'arrêt de l'enregistrement
- Animer les cartes Kanban en cascade (Framer Motion stagger)

## Features Manquantes Identifiées

- Aucun état d'erreur utilisateur défini (crash Zod = écran blanc)
- Pas de persona "voix" pour la révision (voix serait un 2e wow fort)
- Aucune stratégie de démo pré-chargée (mode fallback)
- Drag & Drop PriorityMatrix non validé end-to-end avec vraies données Mistral
- Pas de CTA post-démo fonctionnel (Export Markdown/PDF)

## Suggestions Stratégiques

1. Geler le périmètre UI à 4 composants max (BrainDumpInput, PriorityMatrix, RoadmapCanvas, RevisionChat)
2. Préparer 3 brain dumps scriptés et testés (simple/moyen/complexe)
3. Implémenter DEMO_MODE=true avec JSON pré-calculé local
4. Investir 2-3h dans les animations Framer Motion sur RoadmapCanvas
5. Définir 3-4 patterns de révision garantis ("changer priorité", "déplacer", "fusionner", "supprimer")
6. Ne pas implémenter le CRUD utilisateurs (sessionId localStorage suffit)
