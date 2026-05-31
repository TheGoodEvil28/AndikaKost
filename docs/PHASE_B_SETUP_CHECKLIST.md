# Phase B Setup Checklist (GitHub Actions CI/CD)

Last updated: **May 31, 2026 (UTC)**

This checklist is the exact setup needed so every push to `main` auto-deploys to your server.

## 1) What Is Already Implemented In Repo

- Workflow file: `.github/workflows/ci-cd-main.yml`
- Server deploy script: `scripts/deploy.sh`

Behavior:
- On push to `main`, CI runs backend/frontend validation.
- If CI passes, workflow SSHes into your server and deploys latest `main`.

## 2) What You Must Do On Server

1. Create app directory and clone repo:

```bash
sudo mkdir -p /opt/andikakost
sudo chown -R $USER:$USER /opt/andikakost
git clone https://github.com/TheGoodEvil28/AndikaKost.git /opt/andikakost
```

2. Create backend env file:

```bash
cd /opt/andikakost/AndikaKost-Backend
cp .env.example .env
# edit .env values as needed
```

3. Ensure dependencies exist on server:
- Docker + Docker Compose
- `curl`
- User has permission to run Docker (docker group or sudo policy)

4. Test manual deploy once on server:

```bash
cd /opt/andikakost
chmod +x scripts/deploy.sh
./scripts/deploy.sh
```

## 3) What You Must Do In GitHub Repo Settings

Go to `Repo > Settings > Secrets and variables > Actions > New repository secret` and add:

- `SERVER_HOST` : server IP or domain
- `SERVER_USER` : SSH username for deploy
- `SERVER_SSH_KEY` : private key content (for the deploy user)
- `SERVER_PORT` : SSH port (usually `22`)
- `SERVER_APP_DIR` : `/opt/andikakost`

## 4) SSH Key Setup (If Not Done Yet)

On your local/server machine, generate deploy key pair:

```bash
ssh-keygen -t ed25519 -C "github-actions-deploy" -f ~/.ssh/andikakost_deploy
```

- Put **public key** (`andikakost_deploy.pub`) into server user's `~/.ssh/authorized_keys`.
- Put **private key** (`andikakost_deploy`) into GitHub secret `SERVER_SSH_KEY`.

## 5) First End-to-End Test

1. Push any small commit to `main`.
2. Open `GitHub > Actions > CI/CD Main Deploy`.
3. Confirm:
- `Build And Validate` job passes.
- `Deploy To Server` job passes.
4. Verify server health endpoint:

```bash
curl -fsS http://<server>:8000/api/v1/health
```

## 6) Notes

- This deployment is **main-branch auto-deploy**.
- If you want PR-gated deploy, protect `main` with required checks before merge.
- If CI deploy fails, check the `Deploy To Server` logs first (usually missing secret, SSH access, or server env file).
