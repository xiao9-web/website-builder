#!/usr/bin/env bash
set -Eeuo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BASE_COMPOSE="$ROOT_DIR/docker/docker-compose.yml"
DEV_COMPOSE="$ROOT_DIR/docker/docker-compose.dev.yml"

log() {
  printf "\033[1;34m==>\033[0m %s\n" "$*"
}

warn() {
  printf "\033[1;33mWARN:\033[0m %s\n" "$*" >&2
}

fail() {
  printf "\033[1;31mERROR:\033[0m %s\n" "$*" >&2
  exit 1
}

command -v docker >/dev/null 2>&1 || fail "Docker is not installed or not in PATH."
docker compose version >/dev/null 2>&1 || fail "Docker Compose v2 is required."
docker info >/dev/null 2>&1 || fail "Docker is not running. Start Docker Desktop first."

cd "$ROOT_DIR"

log "Starting required base services: PostgreSQL + Redis"
docker compose -f "$BASE_COMPOSE" up -d

log "Starting optional dev tools: pgAdmin + Redis Commander"
OUTPUT_FILE="$(mktemp)"
set +e
docker compose -f "$BASE_COMPOSE" -f "$DEV_COMPOSE" up -d pgadmin redis-commander 2>&1 | tee "$OUTPUT_FILE"
STATUS="${PIPESTATUS[0]}"
set -e

if [[ "$STATUS" -ne 0 ]]; then
  if grep -Eq "127\\.0\\.0\\.1:7890|proxy|registry-1\\.docker\\.io|connect: connection refused" "$OUTPUT_FILE" 2>/dev/null; then
    warn "Optional dev tools were skipped because Docker cannot reach Docker Hub through its configured proxy."
    warn "The common local symptom is: 127.0.0.1:7890 connect: connection refused."
    warn "PostgreSQL and Redis are still started, so backend development can continue."
    warn "To use pgAdmin/Redis Commander, start/fix the local proxy or run: make docker-proxy-doctor"
  else
    warn "Optional dev tools failed to start. PostgreSQL and Redis are still started."
    warn "Run 'docker compose -f docker/docker-compose.yml -f docker/docker-compose.dev.yml logs' for details."
  fi
fi
rm -f "$OUTPUT_FILE"

cat <<'EOF'

Base services
-------------
PostgreSQL: localhost:5432
Redis:      localhost:6379

Optional dev tools
------------------
pgAdmin:          http://localhost:5050
Redis Commander:  http://localhost:8081

pgAdmin login
-------------
Email:     admin@local.dev
Password:  admin123

If optional dev tools are not available, fix Docker proxy/network access and run:
  make dev-up-full
EOF
