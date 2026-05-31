# Phase B Setup Checklist (GitHub Actions CI/CD + Cloudflare Tunnel)

Last updated: **May 31, 2026 (UTC)**

This setup keeps your server private and enables auto-deploy on push to `main` via Cloudflare Zero Trust.

## 1) What Is Implemented In Repo

- Workflow: `.github/workflows/ci-cd-main.yml`
- Deploy script: `scripts/deploy.sh`

Behavior:
- Push to `main` triggers CI.
- If CI passes, GitHub Actions starts a local `cloudflared access tcp` forwarder to your SSH hostname and deploys through `127.0.0.1:2222`.

## 2) Cloudflare Requirements (Deploy Path)

1. Tunnel running on server.
2. Public hostname route for deploy SSH:
- Hostname: `worker2-vm1-ssh.andikanugra.my.id`
- Service: `ssh://localhost:22`
3. Access application exists for that hostname.
4. Access policy includes `Service Auth` with your service token.

## 3) Server Requirements

1. Repo path exists: `/opt/andikakost`
2. Backend env exists:

```bash
cd /opt/andikakost/AndikaKost-Backend
cp .env.example .env
# edit values
```

3. `docker`, `docker compose`, and `curl` installed.
4. Deploy user can run Docker.

## 4) GitHub Secrets (Required)

- `SERVER_HOST=worker2-vm1-ssh.andikanugra.my.id`
- `SERVER_USER=worker2-vm1`
- `SERVER_SSH_KEY=<private key content>`
- `SERVER_APP_DIR=/opt/andikakost`
- `CF_ACCESS_CLIENT_ID=<service token client id>`
- `CF_ACCESS_CLIENT_SECRET=<service token client secret>`

Note:
- `SERVER_PORT` is not used by the current workflow.

## 5) Quick Secret Sanity Check

- `CF_ACCESS_CLIENT_ID` usually ends with `.access`.
- `CF_ACCESS_CLIENT_SECRET` is a long random string.
- `SERVER_HOST` must be your Cloudflare SSH hostname.
- `SERVER_SSH_KEY` must include full BEGIN/END lines.

## 6) First End-to-End Test (CI/CD)

1. Push to `main` (or run workflow manually).
2. In Actions, check both jobs.
3. If deploy fails, inspect step `Dump cloudflared logs on failure` for root cause.

## 7) Next: Publish App to Public Subdomain

Target frontend hostname:
- `andika-kost.andikanugra.my.id`

Recommended API hostname:
- `api-andika-kost.andikanugra.my.id` (or `api.andikanugra.my.id`)

Cloudflare tunnel routes:
1. Frontend:
- Hostname: `andika-kost.andikanugra.my.id`
- Service: `http://localhost:5173`
2. API:
- Hostname: `api-andika-kost.andikanugra.my.id`
- Service: `http://localhost:8000`

After route publish, set runtime vars:
- Frontend `VITE_API_BASE_URL=https://<api-hostname>`
- Backend `FRONTEND_ORIGIN=https://andika-kost.andikanugra.my.id`

Then run smoke checks:
- Open frontend URL
- Login
- Verify API calls succeed (no CORS/mixed-content errors)
