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

MAX_RETRIES=30
SLEEP_SECONDS=2

wait_for_url() {
  local name="$1"
  local url="$2"

  for ((i=1; i<=MAX_RETRIES; i++)); do
    if curl -fsS "$url" >/dev/null; then
      echo "$name health check passed."
      return 0
    fi

    echo "Waiting for $name health ($i/$MAX_RETRIES)..."
    sleep "$SLEEP_SECONDS"
  done

  echo "$name health check failed after deploy."
  return 1
}

wait_for_url "Backend" "http://localhost:8000/api/v1/health"
wait_for_url "Frontend" "http://localhost:5173/"
wait_for_url "Public API" "http://localhost:8000/api/v1/public/rooms"

FRONTEND_HTML="$(curl -fsS http://localhost:5173/)"
if grep -q '/@vite/client\|/src/main.tsx' <<<"$FRONTEND_HTML"; then
  echo "Frontend is exposing the Vite development server; refusing production deploy."
  exit 1
fi

if ! grep -q '/assets/' <<<"$FRONTEND_HTML"; then
  echo "Frontend production assets were not found in the served HTML."
  exit 1
fi

echo "Deploy successful. Frontend, backend, and public API checks passed."
