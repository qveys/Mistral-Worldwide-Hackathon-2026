# EchoMaps — Architecture du Système

Bienvenue dans la documentation d'architecture de **EchoMaps**, l'application qui transforme un brain dump vocal ou textuel chaotique en roadmap structurée et actionnable en temps réel.

## 🏗️ Vue d'Ensemble

L'application repose sur une architecture découplée :

- **Frontend :** Next.js 16 (App Router) + TailwindCSS + Framer Motion.
- **Backend :** API Express (TypeScript) déployée sur AWS Lambda.
- **Base de Données :** Stockage des projets (S3 ou persistance minimale pour le hackathon 48h).

## 🔐 Authentification & Accès

### Accès Ouvert (MVP Hackathon)

Pour le MVP 48h, l'authentification est **minimale** :

- Pas de compte utilisateur obligatoire.
- Chaque projet est identifié par un ID unique (`projectId`).
- Partage possible via lien read-only : `/project/:id`.

### Évolution Possible

- MagicLink ou OAuth léger pour sauvegarder ses projets.
- Cognito pour une auth AWS native.

## 👥 Rôles & Permissions

Le système distingue deux types d'accès par projet :

| Rôle         | Description                        | Permissions                                        |
| ------------ | ---------------------------------- | -------------------------------------------------- |
| **Créateur** | Utilisateur à l'origine du projet. | Création, modification, révision, export, partage. |
| **Lecteur**  | Accès via lien partagé.            | Vue read-only de la roadmap et des tâches.         |

## 🔗 Conditionnement des Tâches

Le **conditionnement des tâches** gère les dépendances, prérequis et ordre d'exécution pour une roadmap actionnable.

### Dépendances entre Tâches

Chaque tâche peut déclarer des **prérequis** via le champ `dependsOn` :

- **Dépendance :** une tâche B ne peut commencer qu'une fois la tâche A terminée.
- **Blocage :** une tâche est _bloquée_ tant que ses dépendances ne sont pas `done`.
- **Ordre topologique :** la timeline respecte le graphe de dépendances.

### Extraction par IA (Mistral)

L'IA extrait les dépendances implicites du brain dump :

- Identifier les prérequis logiques (ex. "rédiger le devis" avant "envoyer au client").
- Produire `dependsOn` pour chaque tâche.
- Ne pas inventer de dépendances ; en cas de doute, laisser `dependsOn: []`.

### Validation & Affichage

- **Détection de cycles :** validation Zod rejette tout graphe contenant un cycle (A→B→A).
- **UI :** tâches bloquées grisées, tâches disponibles cliquables.
- **Revise :** "Y doit être fait avant X" → Mistral met à jour `dependsOn` et la timeline.

## 🛠️ Stack Technique & Flux

1. **Frontend (Next.js)** → Utilisateur parle ou saisit du texte.
2. **Voxtral WebSocket** → Transcription audio en temps réel.
3. **Backend (Express)** → `POST /structure` : envoi du texte à AWS Bedrock (Mistral Large).
4. **Mistral** → Génère JSON structuré (objectives, tasks avec `dependsOn`, timeline).
5. **Zod** → Validation du schéma, détection de cycles.
6. **Frontend** → Affichage RoadmapCanvas (ordre topologique) + PriorityMatrix.
7. **Révision** → `POST /revise` : instruction utilisateur → patch JSON → re-validation → re-render.
