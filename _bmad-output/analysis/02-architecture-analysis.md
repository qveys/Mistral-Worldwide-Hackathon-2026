# Architecture & Tech Stack — EchoMaps

_Analyst: BMAD Architecture Agent | Date: 2026-02-28_

## Résumé Exécutif

Architecture ambitieuse et cohérente, mais sur-ingéniée pour 48h sur plusieurs axes. La valeur démo repose entièrement sur la fiabilité de deux services tiers (Voxtral + Bedrock) et d'une infrastructure AWS à provisionner correctement.

**Score Architecture : 6.5 / 10**

## Forces Architecturales

- JSON Schema contractuel + validation Zod — meilleure décision de l'architecture
- Séparation frontend/backend claire (Next.js ↔ Express TypeScript sur Lambda)
- Optimistic UI sur la transcription — masque la latence perçue
- Observabilité CloudWatch avec structured logging
- Mistral Large via Bedrock — bon fit pour la complexité de structuration JSON

## Risques Critiques

### [CRITICAL] Absence totale de persistance de données

- `projectId` dans le schema, `GET /project/:id` dans les endpoints, mais zéro stockage
- Solution : S3 (15 lignes de code, 2h) ou localStorage (30min pour la démo)

### [CRITICAL] Timeout Lambda pour les appels Bedrock

- API Gateway : timeout dur 29s. Mistral Large : 8-25s possible
- Solution : Lambda Function URL (pas de limite 29s) + timeout Lambda 60s minimum

### [HIGH] Cold Start Lambda + Express

- Bundle TypeScript + AWS SDK : cold start 3-8s
- Solution : Provisioned Concurrency (1 instance, ~$0.01/2h) ou ping EventBridge 5min

### [HIGH] Fiabilité Voxtral WebSocket

- Sensible aux coupures réseau, changements d'onglet, WiFi instable
- Solution : exponential backoff + fallback input texte toujours visible

### [HIGH] Stabilité prompt Mistral — Hallucinations sur le schema JSON

- `"medium"` au lieu de `"Med"`, `"todo"` au lieu de `"backlog"` → Zod échoue
- Solution : injecter le schéma complet dans le prompt + retry × 2

## Composants Manquants

| Composant             | Priorité | Solution                    | Effort   |
| --------------------- | -------- | --------------------------- | -------- |
| Persistance données   | P0       | S3 ou localStorage          | 30min-2h |
| Retry logic Bedrock   | P0       | 2 retries + logging         | 1h       |
| Warmup Lambda         | P1       | Provisioned Concurrency     | 30min    |
| Fallback input texte  | P1       | Textarea toujours visible   | 1h       |
| Gestion d'erreur UI   | P1       | Toast + bouton Réessayer    | 2h       |
| Loading state Bedrock | P1       | Skeleton + message          | 1h       |
| Health check          | P2       | GET /health → {status:"ok"} | 15min    |
| Rate limiting         | P2       | express-rate-limit          | 1h       |

## Recommandations Architecturales

1. **S3 > DynamoDB** pour ce cas (pas de requêtes complexes, 15 lignes de code)
2. **Envisager Route Handlers Next.js** à la place d'Express Lambda (même deploy, zéro cold start)
3. **Streaming Bedrock** (`InvokeModelWithResponseStream`) pour masquer la latence
4. **Mode fallback demo** : Ctrl+Shift+D pour charger JSON pré-généré

## Alternative si Bedrock/Lambda instable

Migration vers Vercel AI SDK + Mistral API direct : 30min, zero cold start, streaming natif.

```typescript
import { createMistral } from '@ai-sdk/mistral';
const mistral = createMistral({ apiKey: process.env.MISTRAL_API_KEY });
```

## Score Architecture par Critère

| Critère              | Score |
| -------------------- | ----- |
| Choix technologiques | 8/10  |
| Robustesse démo      | 5/10  |
| Simplicité 48h       | 5/10  |
| Observabilité        | 7/10  |
| Sécurité             | 6/10  |
| Persistance          | 2/10  |
| Gestion d'erreur     | 6/10  |
