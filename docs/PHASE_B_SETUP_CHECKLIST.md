# Phase B Setup Checklist (GitHub Actions CI/CD + Tailscale)

Last updated: **May 31, 2026 (UTC)**

This setup keeps your server private (no public IP required) and still enables auto-deploy on push to `main`.

## 1) What Is Implemented In Repo

- Workflow: `.github/workflows/ci-cd-main.yml`
- Deploy script: `scripts/deploy.sh`

Behavior:
- Push to `main` triggers CI.
- If CI passes, GitHub Actions joins your Tailnet, SSHes to server, and runs deploy script.

## 2) What You Must Do On Server

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

## 3) Configure Tailscale For GitHub Actions

1. In Tailscale admin, create an OAuth client for CI usage.
2. Grant it permission to create tagged devices with `tag:ci` (or adjust workflow tag).
3. Make sure your server ACL allows access from `tag:ci` to SSH port `22`.

## 4) GitHub Actions Secrets (Required)

In `Repo > Settings > Secrets and variables > Actions`, add:

- `SERVER_HOST` : server **Tailscale IP** (`100.x.y.z`) or **MagicDNS name** (`host.tailnet.ts.net`)
- `SERVER_USER` : deploy SSH username
- `SERVER_SSH_KEY` : private SSH key content
- `SERVER_PORT` : usually `22`
- `SERVER_APP_DIR` : `/opt/andikakost`
- `TS_OAUTH_CLIENT_ID` : from Tailscale OAuth client
- `TS_OAUTH_SECRET` : from Tailscale OAuth client

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
4. Verify from server (or over Tailnet):

```bash
curl -fsS http://localhost:8000/api/v1/health
```

## 7) Troubleshooting Focus

- Tailscale step fails:
  - invalid OAuth secrets
  - missing ACL/tag permission for `tag:ci`
- SSH step fails:
  - wrong `SERVER_HOST` (must be Tailscale address)
  - wrong SSH key/user/port
- Deploy script fails:
  - missing `/opt/andikakost/AndikaKost-Backend/.env`
  - Docker permission issues on deploy user
