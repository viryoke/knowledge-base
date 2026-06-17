---
name: hermes-config-backup
description: "Backup and migrate Hermes Agent state: config, skills, memory, sessions, cron jobs. Distinguishes installation artifacts from user-accumulated assets."
version: 1.0.0
author: agent
license: MIT
platforms: [linux, macos]
metadata:
  hermes:
    tags: [hermes, backup, migration, config, state]
---

# Hermes Config Backup and Migration

Backup Hermes Agent state to Git (typically a private GitHub repo) and restore on another machine. The core challenge is separating **installation artifacts** (recreated by `hermes setup`) from **user-accumulated assets** (config, skills, memory, sessions).

## When to Use

- Migrating Hermes to a new machine
- Backing up config/state to version control
- Syncing Hermes state across workstations

## User-Accumulated Assets (BACKUP THESE)

Only these carry user-specific value and survive reinstallation:

**Configuration:**
- `config.yaml` — user preferences, model settings, tool enablement
- `.env` — API keys and secrets (handle with care, private repo only)
- `auth.json` — OAuth tokens and credential pools
- `SOUL.md` — custom agent personality
- `personas/` — user-defined personas

**State:**
- `state.db` — session database (SQLite + FTS5, typically 50-100MB)
- `kanban.db` — kanban board state
- `memories/` — persistent memory files (MEMORY.md, USER.md)
- `cron/jobs.json` + `cron/output/` — scheduled tasks and their history
- `pairing/` — platform authorization records (feishu-approved.json, etc.)

**Skills:**
- `skills/` — all skill files (bundled skills are lightweight; user-created/modified skills are critical)
- `skills/.usage.json` — curator tracking data

## Installation Artifacts (EXCLUDE THESE)

These are recreated by installation or are runtime-only:

- `hermes-agent/` — source code clone (1.1GB with venv, node_modules, .git)
- `bin/` — installed binaries (tirith, etc.)
- `logs/` — gateway and error logs
- `cache/` — model catalogs, screenshots
- `pastes/` — temporary paste files
- `sessions/sessions.json` — session index (regenerated from state.db)
- `sessions/request_dump_*.json` — debug dumps
- `config.yaml.bak.*` — old config backups
- Runtime files: `*.lock`, `*.pid`, `*.shm`, `*.wal`, `gateway_state.json`, `processes.json`
- Install metadata: `.install_method`, `.update_check`, `.skills_prompt_snapshot.json`, `.hermes_history`
- Skill hub cache: `skills/.hub/`, `skills/.bundled_manifest`, `skills/.curator_state`

## Pitfalls

### Nested Git Repository (CRITICAL)

`hermes-agent/` contains its own `.git/` directory (it's a git clone). This creates a nested repo situation and includes a 259MB pack file that exceeds GitHub's 100MB limit.

**Fix:** When copying to temp directory, exclude the nested `.git`:
```bash
rsync -a ~/.hermes/ /tmp/hermes-sync/ --exclude='hermes-agent/.git'
```

If you forget this, `git add -A` will try to add the entire nested history.

### `git add -A` on Orphan Branch Re-adds Everything

When creating an orphan branch (`git checkout --orphan clean`), `git add -A` adds ALL files from disk, not just previously tracked files. This undoes all your `git rm --cached` work.

**Fix:** After `git add -A` on orphan, immediately run your exclusion commands again, then `git commit --amend`.

### Multiple Force Pushes Required

Filtering files requires iterative `git rm --cached` → `git commit` cycles. The commit history becomes messy. Use orphan branches to start fresh:

```bash
git checkout --orphan clean
git add -A
# Remove unwanted files
git rm --cached <unwanted>
git commit -m "Clean backup"
git branch -D main
git branch -m clean main
git push --force origin main
```

### state.db Size Warning

GitHub warns about files >50MB (soft limit) but allows up to 100MB (hard limit). `state.db` is typically 60-70MB. The push succeeds with a warning; this is acceptable for a private repo.

### SSH Blocked by Proxy

If SSH is blocked (common in corporate networks), use HTTPS:
```bash
git remote add origin https://github.com/user/hermes-config.git
```

The `gh` CLI handles HTTPS authentication via `gh auth login`.

### Sensitive Files in Private Repo

`.env` and `auth.json` contain secrets. **Only use private repos.** After cloning to new machine:
- `.env` works as-is (API keys are portable)
- `auth.json` OAuth tokens may need re-authentication (`hermes auth add <provider>`)

## Workflow

1. **Create private repo:**
   ```bash
   gh repo create user/hermes-config --private --description "Hermes Agent config backup"
   ```

2. **Copy to temp, exclude nested .git:**
   ```bash
   rsync -a ~/.hermes/ /tmp/hermes-sync/ --exclude='hermes-agent/.git'
   ```

3. **Initialize and add:**
   ```bash
   cd /tmp/hermes-sync
   git init
   git checkout -b main
   git add -A
   ```

4. **Remove installation artifacts:**
   ```bash
   git rm -r --cached hermes-agent/ bin/ logs/ cache/ pastes/ sessions/
   git rm --cached config.yaml.bak.* gateway.* processes.json *.lock *.shm *.wal
   git rm --cached .install_method .update_check .skills_prompt_snapshot.json .hermes_history
   git rm -r --cached skills/.hub/ skills/.bundled_manifest skills/.curator_state
   ```

5. **Commit and push:**
   ```bash
   git commit -m "Hermes Agent backup: config, skills, memory, sessions, cron"
   git remote add origin https://github.com/user/hermes-config.git
   git push -u origin main
   ```

6. **Clean history (optional but recommended):**
   Use orphan branch to remove large files from history entirely.

## Migration to New Machine

1. Install Hermes on new machine: `curl -fsSL https://raw.githubusercontent.com/NousResearch/hermes-agent/main/scripts/install.sh | bash`
2. Clone backup: `git clone https://github.com/user/hermes-config.git ~/.hermes`
3. Re-authenticate OAuth: `hermes auth add <provider>` for each OAuth provider
4. Verify: `hermes doctor`
5. Start using: `hermes`

## Verification

After backup, check what's tracked:
```bash
git ls-files | cut -d/ -f1 | sort | uniq -c | sort -rn
```

Expected: mostly `skills/`, plus single files for config, state, memory, cron.
Should NOT see: `hermes-agent/`, `bin/`, `logs/`, `cache/`, `pastes/`.

## Related Skills

- `hermes-agent` — general Hermes configuration and usage
