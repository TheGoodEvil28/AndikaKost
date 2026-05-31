# AndikaKost — Development + Repo Access + CI/CD Plan

Last updated: **May 31, 2026 (UTC)**

## 1) Current Development Snapshot

- Branch: `main`
- Latest commit on `main`: `4e7f455` — `fix(compose): wait for healthy postgres before backend startup`
- Previous base commit: `ecac44d` — `feat: initial PoC (admin, tenant, public booking)`
- Docker Compose startup race has been fixed:
  - Postgres now has a healthcheck.
  - Backend now waits for healthy DB before running migrations/startup.

## 2) Repository Access Status (Verified From Server)

### Verified OK

- Remote configured:
  - `origin https://github.com/TheGoodEvil28/AndikaKost.git`
- Read operations:
  - `git fetch origin` works.
  - `git pull --ff-only --dry-run` works.
- Write operations:
  - `git push origin main` works (verified by successful push of commit `4e7f455`).

### Not Yet Verified

- Pull Request operations directly from server CLI are **not configured yet**.
- `gh` command is not installed in this environment, so PR create/list/merge via CLI is not available yet.

## 3) Target State

Goal: **any push to GitHub (especially `main`) should automatically reflect on server** with safe deployment flow.

## 4) Plan: Mirror + CI/CD

## Phase A — Prepare Server Mirror

1. Create a deploy directory on server, e.g. `/opt/andikakost`.
2. Create SSH deploy key (read-only is enough for pull/deploy).
3. Add deploy key to GitHub repo (`Settings > Deploy keys`).
4. Clone repository on server:
   - normal clone (recommended for deploy): `git clone git@github.com:TheGoodEvil28/AndikaKost.git /opt/andikakost`
   - optional true mirror clone (bare): `git clone --mirror ...` if you need full ref mirror for backup.
5. Create deploy script (example behavior):
   - `git fetch --all --prune`
   - `git checkout main`
   - `git reset --hard origin/main`
   - `docker compose up -d --build`
   - health checks + rollback signal on failure.

## Phase B — GitHub Actions CI/CD (Recommended)

1. Add workflow trigger on push to `main`.
2. CI job:
   - checkout code
   - run tests/lint/build (backend + frontend)
3. Deploy job (only if CI passes):
   - SSH to server
   - run deploy script in `/opt/andikakost`
4. Protect `main` with required checks to avoid broken deploys.

## Phase C — PR Workflow (Recommended)

1. Use feature branches for development.
2. Require PR review before merge to `main`.
3. Auto-deploy only from `main` after merge.

## 5) Minimal Secrets/Config Needed

In GitHub Actions Secrets:

- `SERVER_HOST`
- `SERVER_USER`
- `SERVER_SSH_KEY` (private key for deploy user)
- `SERVER_PORT` (optional, default 22)
- Optional: `ENV_FILE_CONTENT` or environment-specific secrets for runtime.

On server:

- Docker + Docker Compose installed
- `.env` files present for backend/frontend runtime
- deploy user with permission to run Docker commands

## 6) Definition of Done for Next Step

- Push a test commit to `main` from any machine.
- GitHub Actions pipeline runs automatically.
- Server updates to latest commit automatically.
- Health endpoint `http://<server>:8000/api/v1/health` returns success after deploy.
- Frontend serves latest build at `http://<server>:5173` (or configured domain).

## 7) Recommended Immediate Next Action

Implement `Phase B` first (GitHub Actions deploy over SSH), then add optional mirror hardening if needed.
