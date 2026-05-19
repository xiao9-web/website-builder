#!/usr/bin/env bash
set -Eeuo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BASE_COMPOSE="$ROOT_DIR/docker/docker-compose.yml"
DEV_COMPOSE="$ROOT_DIR/docker/docker-compose.dev.yml"
SKIP_DEV_TOOLS="${SKIP_DEV_TOOLS:-0}"

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
COMPOSE_IGNORE_ORPHANS=True docker compose -f "$BASE_COMPOSE" up -d

if [[ "$SKIP_DEV_TOOLS" == "1" || "$SKIP_DEV_TOOLS" == "true" ]]; then
  warn "Skipping optional dev tools because SKIP_DEV_TOOLS=${SKIP_DEV_TOOLS}."
  cat <<'EOF'

Base services
-------------
PostgreSQL: localhost:5432
Redis:      localhost:6379

Optional dev tools were skipped.
Run without SKIP_DEV_TOOLS after Docker proxy is fixed:
  make dev-up-full
EOF
  exit 0
fi

log "Starting optional dev tools: pgAdmin + Redis Commander"
OUTPUT_FILE="$(mktemp)"
set +e
COMPOSE_IGNORE_ORPHANS=True docker compose -f "$BASE_COMPOSE" -f "$DEV_COMPOSE" up -d pgadmin redis-commander 2>&1 | tee "$OUTPUT_FILE"
STATUS="${PIPESTATUS[0]}"
set -e

if [[ "$STATUS" -ne 0 ]]; then
  if grep -Eq "127\\.0\\.0\\.1:7890|127\\.0\\.0\\.1:7897|proxy|registry-1\\.docker\\.io|connect: connection refused" "$OUTPUT_FILE" 2>/dev/null; then
    warn "Optional dev tools were skipped because Docker cannot reach Docker Hub through its configured proxy."
    warn "Your Clash Verge proxy port is 7897; Docker Desktop may still be pointing at the old 7890 port."
    warn "Set Docker Desktop proxy to http://host.docker.internal:7897 or http://127.0.0.1:7897, then restart Docker Desktop."
    warn "PostgreSQL and Redis are still started, so backend development can continue."
    warn "To use pgAdmin/Redis Commander, start/fix the local proxy or run: make docker-proxy-doctor"
    warn "To skip optional tools next time, run: make dev-up"
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
