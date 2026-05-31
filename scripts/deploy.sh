#!/usr/bin/env bash
set -euo pipefail

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$PROJECT_ROOT"

if [ ! -f "AndikaKost-Backend/.env" ]; then
  echo "Missing AndikaKost-Backend/.env on server. Create it before deploy."
  exit 1
fi

if ! command -v docker >/dev/null 2>&1; then
  echo "Docker is not installed on server."
  exit 1
fi

if ! command -v curl >/dev/null 2>&1; then
  echo "curl is not installed on server."
  exit 1
fi

docker compose up -d --build

HEALTH_URL="http://localhost:8000/api/v1/health"
MAX_RETRIES=30
SLEEP_SECONDS=2

for ((i=1; i<=MAX_RETRIES; i++)); do
  if curl -fsS "$HEALTH_URL" >/dev/null; then
    echo "Deploy successful. Backend health check passed."
    exit 0
  fi

  echo "Waiting for backend health ($i/$MAX_RETRIES)..."
  sleep "$SLEEP_SECONDS"
done

echo "Backend health check failed after deploy."
exit 1
