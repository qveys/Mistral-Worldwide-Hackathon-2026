#!/usr/bin/env python3
"""
git-autopilot.py — Synchronisation automatique intelligente du dépôt GitHub

Toutes les minutes :
  1. git pull --rebase (avec résolution de conflits via LLM si besoin)
  2. Découpe granulaire du diff en commits sémantiques avec emoji aléatoire
  3. git push

Usage :
  python3 git-autopilot.py
  ANTHROPIC_API_KEY=sk-... python3 git-autopilot.py

Variables d'environnement :
  ANTHROPIC_API_KEY  → clé Anthropic pour résolution LLM (recommandé)
  GIT_REPO_PATH      → override du chemin du dépôt (sinon auto-détecté)
"""

import subprocess
import os
import random
import sys
import json
import re
import logging
from pathlib import Path
from datetime import datetime

# ─── Configuration ────────────────────────────────────────────────────────────

REPO_PATH = Path(os.environ.get("GIT_REPO_PATH", Path(__file__).parent.resolve()))

EMOJIS = [
    "🚀", "✨", "🔧", "🐛", "📝", "🎉", "♻️", "🔥", "🎨", "⚡",
    "🔐", "📦", "🌟", "💡", "🛠️", "🧹", "🧪", "📊", "🏗️", "🔗",
    "🎯", "💫", "🌈", "🦾", "🧩", "🔄", "🏆", "💎", "🌊", "🎭",
    "🔮", "🧲", "🪄", "🌺", "🦋", "🎸", "🏄", "🌙", "🎪", "🧬",
]

LLM_MODEL_SMART  = "claude-opus-4-5-20251101"
LLM_MODEL_FAST   = "claude-haiku-4-5-20251001"
MAX_DIFF_TOKENS  = 3000   # chars per file diff sent to LLM

# ─── Logging ──────────────────────────────────────────────────────────────────

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [autopilot] %(message)s",
    datefmt="%H:%M:%S",
)
log = logging.getLogger("autopilot")

# ─── Helpers ──────────────────────────────────────────────────────────────────

def run(args: list[str], capture=True, env_extra: dict | None = None) -> subprocess.CompletedProcess:
    env = os.environ.copy()
    if env_extra:
        env.update(env_extra)
    return subprocess.run(
        args,
        capture_output=capture,
        text=True,
        cwd=str(REPO_PATH),
        env=env,
    )

def git(*args, **kwargs) -> subprocess.CompletedProcess:
    return run(["git"] + list(args), **kwargs)

def rand_emoji() -> str:
    return random.choice(EMOJIS)

# ─── LLM client ───────────────────────────────────────────────────────────────

_anthropic_client = None

def get_llm_client():
    global _anthropic_client
    if _anthropic_client is not None:
        return _anthropic_client
    api_key = os.environ.get("ANTHROPIC_API_KEY", "")
    if not api_key:
        return None
    try:
        import anthropic
        _anthropic_client = anthropic.Anthropic(api_key=api_key)
        return _anthropic_client
    except ImportError:
        log.warning("Package 'anthropic' non installé. Installe-le : pip install anthropic")
        return None

def llm(prompt: str, model=LLM_MODEL_FAST, max_tokens=2048) -> str | None:
    client = get_llm_client()
    if client is None:
        return None
    try:
        msg = client.messages.create(
            model=model,
            max_tokens=max_tokens,
            messages=[{"role": "user", "content": prompt}],
        )
        return msg.content[0].text.strip()
    except Exception as e:
        log.warning(f"Appel LLM échoué : {e}")
        return None

# ─── Conflict resolution ───────────────────────────────────────────────────────

CONFLICT_RE = re.compile(
    r"<{7}.*?\n(.*?)\n={7}\n(.*?)\n>{7}.*?\n",
    re.DOTALL,
)

def resolve_conflict_llm(filepath: str, content: str) -> str:
    prompt = f"""Tu es un expert en résolution de conflits git.
Voici un fichier avec des marqueurs de conflit git :

```
{content[:MAX_DIFF_TOKENS]}
```

Résous intelligemment le conflit :
- Conserve TOUTES les modifications importantes des deux côtés
- Supprime TOUS les marqueurs de conflit (<<<<<<<, =======, >>>>>>>)
- Si les deux côtés font la même chose, garde-en un seul exemplaire
- Retourne UNIQUEMENT le contenu résolu du fichier, sans explications
"""
    resolved = llm(prompt, model=LLM_MODEL_SMART, max_tokens=4096)
    if resolved:
        return resolved

    log.info(f"  → Résolution manuelle (fallback) pour {filepath}")
    return resolve_conflict_manual(content)


def resolve_conflict_manual(content: str) -> str:
    """Fallback : fusionne les deux côtés, dédupliqué."""
    result = []
    ours, theirs = [], []
    state = "normal"

    for line in content.splitlines(keepends=True):
        if line.startswith("<<<<<<<"):
            state = "ours"
            ours = []
        elif line.startswith("=======") and state == "ours":
            state = "theirs"
            theirs = []
        elif line.startswith(">>>>>>>") and state == "theirs":
            state = "normal"
            result.extend(ours)
            for l in theirs:
                if l not in ours:
                    result.append(l)
        elif state == "ours":
            ours.append(line)
        elif state == "theirs":
            theirs.append(line)
        else:
            result.append(line)

    return "".join(result)


def resolve_all_conflicts() -> bool:
    r = git("diff", "--name-only", "--diff-filter=U")
    files = [f.strip() for f in r.stdout.splitlines() if f.strip()]
    if not files:
        return True

    log.info(f"Résolution de {len(files)} conflit(s) : {files}")
    for f in files:
        path = REPO_PATH / f
        if not path.exists():
            continue
        content = path.read_text(encoding="utf-8", errors="replace")
        if "<<<<<<<" not in content:
            continue
        log.info(f"  Résolution : {f}")
        resolved = resolve_conflict_llm(f, content)
        path.write_text(resolved, encoding="utf-8")
        git("add", f)
        log.info(f"  ✓ {f}")
    return True

# ─── Git pull ──────────────────────────────────────────────────────────────────

def do_pull() -> bool:
    log.info("► git pull --rebase")
    r = git("pull", "--rebase")
    if r.returncode == 0:
        log.info("✓ Pull réussi")
        return True

    output = r.stdout + r.stderr
    if "CONFLICT" in output or "conflict" in output.lower():
        log.info("  Conflits détectés, résolution en cours…")
        resolve_all_conflicts()
        cont = git(
            "rebase", "--continue",
            env_extra={"GIT_EDITOR": "true", "GIT_MERGE_AUTOEDIT": "no"},
        )
        if cont.returncode == 0:
            log.info("✓ Rebase continué avec succès")
            return True
        log.warning(f"  Rebase --continue a échoué : {cont.stderr[:200]}")
        git("rebase", "--abort")
        return False

    if "nothing to pull" in output or "Already up to date" in output:
        log.info("✓ Déjà à jour")
        return True

    log.warning(f"Pull inattendu : {output[:300]}")
    return False

# ─── Commit changes ────────────────────────────────────────────────────────────

def get_status() -> list[dict]:
    r = git("status", "--porcelain")
    items = []
    for line in r.stdout.splitlines():
        if not line.strip():
            continue
        status = line[:2].strip()
        path = line[3:].strip()
        if " -> " in path:          # renamed
            path = path.split(" -> ")[1]
        items.append({"status": status, "path": path})
    return items


def get_diff(files: list[str] | None = None) -> str:
    args = ["diff", "HEAD"]
    if files:
        args += ["--"] + files
    r = git(*args)
    return r.stdout


def group_changes_llm(changes: list[dict]) -> list[dict]:
    """Demande au LLM de regrouper les fichiers en commits sémantiques."""
    summary = []
    for c in changes:
        diff = get_diff([c["path"]])
        if len(diff) > MAX_DIFF_TOKENS:
            diff = diff[:MAX_DIFF_TOKENS] + "\n...(tronqué)"
        summary.append({"file": c["path"], "status": c["status"], "diff": diff})

    prompt = f"""Analyse ces modifications git et regroupe-les en commits logiques et sémantiques.
Chaque commit doit représenter une unité cohérente (fonctionnalité, correction, refactoring, doc, etc.).

Modifications :
{json.dumps(summary, indent=2, ensure_ascii=False)}

Réponds UNIQUEMENT avec un tableau JSON, sans explication :
[
  {{"files": ["path/a.py", "path/b.py"], "message": "Add user authentication"}},
  {{"files": ["README.md"],              "message": "Update setup documentation"}}
]

Règles :
- Messages en anglais, au style impératif (Add, Fix, Update, Refactor…)
- Max 72 caractères par message
- Sans emoji (il sera ajouté automatiquement)
- Tous les fichiers doivent être couverts
"""
    response = llm(prompt, model=LLM_MODEL_FAST)
    if response:
        m = re.search(r"\[.*\]", response, re.DOTALL)
        if m:
            try:
                groups = json.loads(m.group())
                # Vérifier que tous les fichiers sont couverts
                covered = {f for g in groups for f in g.get("files", [])}
                missing = [c["path"] for c in changes if c["path"] not in covered]
                if missing:
                    groups.append({"files": missing, "message": "Update remaining files"})
                return groups
            except json.JSONDecodeError:
                pass

    log.info("  → Groupement heuristique (fallback)")
    return group_changes_heuristic(changes)


def group_changes_heuristic(changes: list[dict]) -> list[dict]:
    """Fallback : regroupe par extension / répertoire racine."""
    buckets: dict[str, list[str]] = {}
    labels: dict[str, str] = {}

    for c in changes:
        p = Path(c["path"])
        key = p.suffix or p.parts[0] if p.parts else "misc"

        ext_labels = {
            ".py":   "Update Python source files",
            ".ts":   "Update TypeScript files",
            ".tsx":  "Update React components",
            ".js":   "Update JavaScript files",
            ".md":   "Update documentation",
            ".json": "Update configuration / data",
            ".yml":  "Update YAML configuration",
            ".yaml": "Update YAML configuration",
            ".css":  "Update styles",
            ".html": "Update HTML templates",
        }
        buckets.setdefault(key, []).append(c["path"])
        labels.setdefault(key, ext_labels.get(key, f"Update {key} files"))

    return [{"files": files, "message": labels[k]} for k, files in buckets.items()]


def do_commits() -> int:
    changes = get_status()
    if not changes:
        log.info("Aucune modification locale.")
        return 0

    log.info(f"► {len(changes)} fichier(s) modifié(s), regroupement en cours…")

    # Stage tout pour obtenir des diffs complets
    git("add", "-A")

    # Puis on réinitialise pour un staging sélectif
    git("reset", "HEAD")

    groups = group_changes_llm(changes)
    log.info(f"  → {len(groups)} commit(s) planifié(s)")

    emojis_used: set[str] = set()
    created = 0

    for i, group in enumerate(groups):
        files   = group.get("files", [])
        message = group.get("message", "Update files")

        for f in files:
            git("add", f)

        # Vérifier qu'il y a bien quelque chose à committer
        staged = git("diff", "--cached", "--name-only")
        if not staged.stdout.strip():
            continue

        # Emoji aléatoire unique pour ce commit
        available = [e for e in EMOJIS if e not in emojis_used] or EMOJIS
        emoji = random.choice(available)
        emojis_used.add(emoji)

        commit_msg = f"{emoji} {message}"
        r = git("commit", "-m", commit_msg)
        if r.returncode == 0:
            log.info(f"  ✓ [{i+1}/{len(groups)}] {commit_msg}")
            created += 1
        else:
            log.warning(f"  ✗ Commit échoué : {r.stderr[:120]}")

    # Reste éventuellement des fichiers non couverts
    staged = git("diff", "--cached", "--name-only")
    if staged.stdout.strip():
        emoji = random.choice([e for e in EMOJIS if e not in emojis_used] or EMOJIS)
        git("commit", "-m", f"{emoji} Update uncategorized files")
        created += 1

    return created

# ─── Git push ──────────────────────────────────────────────────────────────────

def do_push() -> bool:
    log.info("► git push")
    r = git("push")
    if r.returncode == 0:
        log.info("✓ Push réussi")
        return True

    output = r.stdout + r.stderr
    if "rejected" in output or "behind" in output:
        log.info("  Push rejeté (remote en avance), pull + retry…")
        if do_pull():
            r2 = git("push")
            if r2.returncode == 0:
                log.info("✓ Push réussi après pull")
                return True

    log.warning(f"✗ Push échoué : {output[:300]}")
    return False

# ─── Main ──────────────────────────────────────────────────────────────────────

def main():
    log.info(f"═══ git-autopilot démarré — {REPO_PATH} ═══")
    llm_ok = get_llm_client() is not None
    log.info(f"  LLM : {'✓ Anthropic API connectée' if llm_ok else '⚠ Pas de clé API — mode heuristique'}")

    pull_ok = do_pull()
    if not pull_ok:
        log.warning("  Pull a rencontré des problèmes, on continue quand même…")

    n = do_commits()
    if n:
        log.info(f"  {n} commit(s) créé(s)")
        do_push()
    else:
        log.info("  Rien à pousser.")

    log.info("═══ Terminé ═══\n")


if __name__ == "__main__":
    main()
