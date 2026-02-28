# Analyse IA, Voice & Prompts — EchoMaps
*Analyst: BMAD AI/Prompt Agent | Date: 2026-02-28*

## Résumé Exécutif

Architecture IA correctement pensée pour un hackathon 48h, mais les 3 prompts actuels sont insuffisamment robustes pour une démo live. Risque principal : retour de prose ou de JSON malformé par Mistral lors du Revise Prompt. Le système json-patch dans `revisionHistory` est sur-complexe.

**Score global IA & Voice : 6.2/10**

## Analyse des Prompts Actuels

### Structure Prompt — Sévérité : HIGH

**Problèmes :**
1. Schéma JSON absent du prompt — Mistral invente ses champs (`objective_id` vs `objectiveId`)
2. Valeurs d'enum non spécifiées — `"medium"` au lieu de `"Med"`, `"todo"` au lieu de `"backlog"`
3. Aucun exemple few-shot — variance élevée sur brain dumps oraux spontanés
4. `"no hallucinations"` — directive sans effet opérationnel
5. Format des IDs non spécifié — jointures `objectiveId → id` peuvent casser

### Revise Prompt — Sévérité : CRITICAL

**Problèmes :**
1. Ambiguïté de "patch" — RFC 6902 vs JSON complet modifié
2. JSON existant potentiellement énorme en input (800-1200 tokens, latence 5-8s)
3. Pas de validation de l'instruction utilisateur (instruction destructive possible)
4. Perte de contexte multi-tours
5. Schéma de sortie absent

### Clarification Prompt — Sévérité : MED

**Problèmes :**
1. Prompt en anglais, application en français
2. Aucun contexte du brain dump original fourni
3. Critère de déclenchement non défini
4. Viole la règle JSON-First (réponse en "plain language")

## Risques Pipeline IA

| # | Risque | Sévérité |
|---|--------|----------|
| R1 | JSON malformé (prose avant/après) | CRITICAL |
| R2 | Schéma incompatible (champs inventés) | CRITICAL |
| R3 | Latence Bedrock > 6s | HIGH |
| R4 | WebSocket ElevenLabs drop | HIGH |
| R5 | Revise Prompt casse le JSON | HIGH |
| R6 | Token ElevenLabs expiré (15min) | HIGH |
| R7 | CommitStrategy.VAD non configuré | HIGH |

## Analyse ElevenLabs STT

- Modèle requis : `scribe_v2_realtime` (pas `scribe_v2` batch)
- `CommitStrategy.VAD` obligatoire pour les `committed_transcript`
- Tokens de sécurité générés backend (endpoint `/scribe-token`) — clé API jamais côté client
- Keyterm prompting disponible pour améliorer précision ("Kanban", "backlog", "sprint")

**Latence totale estimée :**
```
ElevenLabs STT commit : 150-500ms
POST /structure → Bedrock : 2000-5000ms
Total : 2.3s - 5.7s (p50 - p95)
```

## Recommandations Prompt Engineering

### Structure Prompt — Version Renforcée
```
You are a project structuring assistant. Your ONLY output is valid JSON.

SCHEMA (you must match this exactly):
{ "projectId": "nanoid", "title": "string max 60 chars", "createdAt": "ISO 8601 UTC",
  "objectives": [{ "id": "obj-1", "text": "string", "priority": "High|Med|Low" }],
  "tasks": [{ "id": "task-1", "objectiveId": "obj-1", "status": "backlog",
              "estimate": "S|M|L", "priority": "High|Med|Low" }],
  "timeline": [{ "taskId": "task-1", "day": "Day 1", "slot": "AM|PM" }],
  "revisionHistory": [] }

RULES: objectives 2-5, tasks atomic, priority EXACT case, status always "backlog" on creation
NEVER add prose outside JSON.
INPUT: {{brainDump}}
RESPONSE (JSON only, starting with {):
```

### Revise Prompt — Version Renforcée
Abandonner json-patch RFC 6902. Retourner le JSON complet modifié. Plus fiable pour la démo.

### JSON-Only Bulletproofing (3 mécanismes)
1. Prompt se termine par `RESPONSE (JSON only, starting with {):`
2. Guard regex backend : `raw.match(/\{[\s\S]*\}/)`
3. `temperature: 0` sur tous les appels Bedrock de structuration

## Estimation des Coûts Demo

| Service | Coût estimé |
|---------|-------------|
| AWS Bedrock (50 démos + tests) | $5.50 |
| ElevenLabs STT (~75min audio) | $0.50 |
| Lambda + CloudWatch | < $0.11 |
| **Total hackathon** | **~$6.10** |

## Corrections Prioritaires (< 2h total)

| Correction | Temps | Sévérité |
|------------|-------|----------|
| Schéma JSON dans Structure Prompt | 30min | CRITICAL |
| Schéma JSON dans Revise Prompt | 30min | CRITICAL |
| temperature: 0 Bedrock | 5min | CRITICAL |
| Guard extraction JSON regex | 15min | CRITICAL |
| CommitStrategy.VAD | 10min | HIGH |
| Lambda timeout ≥ 60s | 5min | CRITICAL |
| Retry Zod × 2 | 45min | HIGH |

**Après corrections : score IA 6.2/10 → 8.5/10**
