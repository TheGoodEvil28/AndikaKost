# Phase B Setup Checklist (GitHub Actions CI/CD + Cloudflare Tunnel)

Last updated: **May 31, 2026 (UTC)**

This setup keeps your server private (no public IP required) and enables auto-deploy on push to `main` via Cloudflare Zero Trust.

## 1) What Is Implemented In Repo

- Workflow: `.github/workflows/ci-cd-main.yml`
- Deploy script: `scripts/deploy.sh`

Behavior:
- Push to `main` triggers CI.
- If CI passes, GitHub Actions connects to your server through Cloudflare Access + SSH and runs deploy script.

## 2) What You Must Do In Cloudflare

1. Ensure cloudflared tunnel is running on server side.
2. Publish SSH app route in tunnel:
- Hostname: e.g. `ssh.andikanugra.my.id`
- Service: `ssh://localhost:22`
3. Create a Cloudflare Access application for that SSH hostname.
4. Create a **Service Token** for CI usage.
5. Add an Access policy allowing that service token to the SSH app.

## 3) What You Must Do On Server

1. Create app directory and clone:

```bash
sudo mkdir -p /opt/andikakost
sudo chown -R $USER:$USER /opt/andikakost
git clone https://github.com/TheGoodEvil28/AndikaKost.git /opt/andikakost
```

2. Create backend env file:

```bash
cd /opt/andikakost/AndikaKost-Backend
cp .env.example .env
# edit values as needed
```

3. Ensure server prerequisites:
- Docker + Docker Compose
- `curl`
- deploy user can run Docker
- SSH service enabled for deploy user

4. Test deploy script manually once:

```bash
cd /opt/andikakost
chmod +x scripts/deploy.sh
./scripts/deploy.sh
```

## 4) GitHub Actions Secrets (Required)

In `Repo > Settings > Secrets and variables > Actions`, add:

- `SERVER_HOST` : Cloudflare SSH hostname (example: `ssh.andikanugra.my.id`)
- `SERVER_USER` : deploy SSH username
- `SERVER_SSH_KEY` : private SSH key content
- `SERVER_PORT` : usually `22`
- `SERVER_APP_DIR` : `/opt/andikakost`
- `CF_ACCESS_CLIENT_ID` : Cloudflare Access service token client ID
- `CF_ACCESS_CLIENT_SECRET` : Cloudflare Access service token client secret

## 5) SSH Key Setup (If Needed)

Generate deploy key:

```bash
ssh-keygen -t ed25519 -C "github-actions-deploy" -f ~/.ssh/andikakost_deploy
```

- Add public key to server user `~/.ssh/authorized_keys`.
- Add private key content to `SERVER_SSH_KEY`.

## 6) First End-to-End Test

1. Push a small commit to `main`.
2. Open `GitHub > Actions > CI/CD Main Deploy`.
3. Confirm both jobs pass:
- `Build And Validate`
- `Deploy To Server`
4. Verify from server:

```bash
curl -fsS http://localhost:8000/api/v1/health
```

## 7) Troubleshooting Focus

- Cloudflare Access/SSH step fails:
  - wrong `CF_ACCESS_CLIENT_ID` / `CF_ACCESS_CLIENT_SECRET`
  - service token not allowed by Access policy
  - wrong `SERVER_HOST` (must be Cloudflare-proxied SSH hostname)
- SSH deploy fails:
  - wrong SSH key/user/port
  - server SSH service not available
- Deploy script fails:
  - missing `/opt/andikakost/AndikaKost-Backend/.env`
  - Docker permission issues on deploy user
