# AndikaKost — Development + DevOps Status

Last updated: **May 31, 2026 (UTC)**

## 1) Current Development Snapshot

- Branch: `main`
- Docker Compose startup race issue has been fixed (DB healthcheck + backend wait-for-healthy).
- Visible frontend validation change added: persistent light/dark mode toggle.

## 2) Repository & Server Access Status

### Verified Working

- Local repo is connected to remote `origin`.
- `git fetch` / `git pull` / `git push` to `main` work.
- Server-side deployment path is reachable through Cloudflare Access SSH hostname.

### Current CI/CD Status

- GitHub Actions workflow exists at `.github/workflows/ci-cd-main.yml`.
- Deploy script exists at `scripts/deploy.sh`.
- Pipeline flow:
  1. CI validates backend/frontend build.
  2. Deploy job starts `cloudflared access tcp` forwarder on runner (`127.0.0.1:2222`).
  3. Runner SSHes to server via forwarded tunnel.
  4. Server deploy script pulls latest `main` and runs `docker compose up -d --build`.
- Latest deployment test status: **successful**.

## 3) Known Gaps / Issues

- Local-side errors are still reported by project owner (details pending formal log).
- `gh` CLI-based PR operations from this environment are not set up.

## 4) Target State

- Every push to `main` auto-deploys safely to server.
- Public app available through Cloudflare Tunnel using project domain.

## 5) Next Phase: Publish to Cloudflare Tunnel

Planned public hostname:
- `andika-kost.andikanugra.my.id`

Recommended routing:
1. Frontend route:
- Hostname: `andika-kost.andikanugra.my.id`
- Service: `http://localhost:5173`
2. API route (recommended separate hostname):
- Hostname: `api-andika-kost.andikanugra.my.id` (or `api.andikanugra.my.id`)
- Service: `http://localhost:8000`

Important notes:
- DNS names are case-insensitive, but use lowercase format operationally.
- If frontend calls backend directly, set `VITE_API_BASE_URL` to public API hostname.
- Update backend `FRONTEND_ORIGIN` to match published frontend URL.

## 6) Definition of Done (Current + Next)

CI/CD DoD (already achieved):
- Push to `main` triggers workflow.
- CI passes.
- Deploy step updates server and healthcheck passes.

Publishing DoD (next):
- Frontend reachable at `https://andika-kost.andikanugra.my.id`.
- API reachable on chosen API hostname.
- Frontend can call API successfully from browser (no CORS/mixed-content errors).

## 7) Immediate Action Items

1. Document exact local-side error messages in a dedicated issue log.
2. Configure public Cloudflare Tunnel hostname(s) for app + API.
3. Validate production env variables for frontend/backend after hostname publish.
4. Run end-to-end smoke test (login, dashboard, billing upload, complaints flow).
