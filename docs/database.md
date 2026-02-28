# EchoMaps — Schéma de Données

Modèle de données pour la gestion des projets et des roadmaps.

---

## 📦 MVP : Stockage JSON (S3 / Fichiers)

Pour le hackathon 48h, la persistance est **document-oriented** : un projet = un document JSON.

### Structure d'un projet

```jsonc
{
  "projectId": "uuid",
  "title": "string",
  "createdAt": "ISO 8601",
  "brainDump": "string",
  "objectives": [
    { "id": "string", "text": "string", "priority": "High|Med|Low" }
  ],
  "tasks": [
    {
      "id": "string",
      "text": "string",
      "objectiveId": "string",
      "dependsOn": ["taskId1", "taskId2"],
      "status": "backlog|doing|done",
      "estimate": "S|M|L",
      "priority": "High|Med|Low"
    }
  ],
  "timeline": [
    { "taskId": "string", "day": "string", "slot": "AM|PM" }
  ],
  "revisionHistory": [
    { "timestamp": "ISO 8601", "patch": "json-patch" }
  ]
}
```

### Stockage S3

- **Clé :** `projects/{projectId}.json`
- **Format :** JSON minifié ou pretty-print pour debug.
- **Accès :** lecture/écriture via SDK AWS.

---

## 📊 Évolution : Schéma Relationnel (PostgreSQL)

Si passage à une base relationnelle (post-MVP) :

### Tables principales

| Table | Colonnes | Rôle |
| ----- | -------- | ---- |
| **projects** | id, title, brain_dump, created_at, updated_at | Projets. |
| **objectives** | id, project_id, text, priority | Objectifs liés à un projet. |
| **tasks** | id, objective_id, text, status, estimate, priority, created_at | Tâches. |
| **task_dependencies** | task_id, depends_on_task_id | Graphe de dépendances (dependsOn). |
| **timeline_slots** | task_id, day, slot | Planification AM/PM. |
| **revision_history** | id, project_id, timestamp, patch | Historique des révisions. |

### Relations

- `objectives.project_id` → `projects.id`
- `tasks.objective_id` → `objectives.id`
- `task_dependencies.task_id` → `tasks.id`
- `task_dependencies.depends_on_task_id` → `tasks.id`
- `timeline_slots.task_id` → `tasks.id`
- `revision_history.project_id` → `projects.id`

---

## 🔒 Sécurité & Intégrité

### Indexation (PostgreSQL)

- `projects(id)` — clé primaire.
- `tasks(project_id)` — requêtes par projet.
- `task_dependencies(task_id, depends_on_task_id)` — unicité, lookup rapide.

### Contraintes

- **Cycles :** validation applicative (Zod + `hasCycle()`) avant écriture.
- **Références :** tous les `dependsOn` doivent référencer des `task.id` existants.
- **Timeline :** une tâche ne peut être planifiée avant ses dépendances (vérification applicative).

### MVP (JSON)

- Pas de contraintes DB ; validation Zod côté backend avant sauvegarde.
