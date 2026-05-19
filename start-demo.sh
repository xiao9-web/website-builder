#!/usr/bin/env bash
set -Eeuo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
COMPOSE_FILE="$ROOT_DIR/docker/docker-compose.full.yml"
PROJECT_NAME="website-builder"
BUILD_FLAG="--build"
RESET=false
OPEN_BROWSER=false

usage() {
  cat <<'EOF'
Website Builder local demo launcher

Usage:
  ./start-demo.sh [options]

Options:
  --reset       Stop the demo stack and remove volumes before starting.
  --no-build    Start containers without rebuilding images.
  --open        Open key pages in the default browser after services are ready.
  -h, --help    Show this help.

Services:
  Frontend       http://localhost:3000
  Public site    http://localhost:3000/sites/chunchang
  Dashboard      http://localhost:3000/dashboard
  Backend        http://localhost:8080
  Prometheus     http://localhost:9090
  Grafana        http://localhost:3001
EOF
}

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

while [[ $# -gt 0 ]]; do
  case "$1" in
    --reset)
      RESET=true
      shift
      ;;
    --no-build)
      BUILD_FLAG=""
      shift
      ;;
    --open)
      OPEN_BROWSER=true
      shift
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      fail "Unknown option: $1"
      ;;
  esac
done

command -v docker >/dev/null 2>&1 || fail "Docker is not installed or not in PATH."
docker compose version >/dev/null 2>&1 || fail "Docker Compose v2 is required. Try: docker compose version"
docker info >/dev/null 2>&1 || fail "Docker is not running. Start Docker Desktop first."

cd "$ROOT_DIR"

if [[ "$RESET" == true ]]; then
  log "Resetting local demo stack and volumes"
  docker compose -p "$PROJECT_NAME" -f "$COMPOSE_FILE" down -v
fi

log "Validating Docker Compose config"
docker compose -p "$PROJECT_NAME" -f "$COMPOSE_FILE" config >/dev/null

log "Starting full local demo stack"
COMPOSE_OUTPUT="$(mktemp)"
set +e
if [[ -n "$BUILD_FLAG" ]]; then
  docker compose -p "$PROJECT_NAME" -f "$COMPOSE_FILE" up -d "$BUILD_FLAG" 2>&1 | tee "$COMPOSE_OUTPUT"
else
  docker compose -p "$PROJECT_NAME" -f "$COMPOSE_FILE" up -d 2>&1 | tee "$COMPOSE_OUTPUT"
fi
COMPOSE_STATUS="${PIPESTATUS[0]}"
set -e

if [[ "$COMPOSE_STATUS" -ne 0 ]]; then
  if grep -Eq "127\\.0\\.0\\.1:7890|127\\.0\\.0\\.1:7897|proxy|registry-1\\.docker\\.io|connect: connection refused" "$COMPOSE_OUTPUT" 2>/dev/null; then
    warn "Docker image pull/build failed because Docker is using a proxy that is not reachable."
    warn "Your Clash Verge proxy port is 7897; Docker Desktop may still be pointing at the old 7890 port."
    warn "Fix one of these, then rerun ./start-demo.sh:"
    warn "1. Start Clash Verge and confirm the HTTP proxy port is 7897."
    warn "2. Set Docker Desktop proxy to http://host.docker.internal:7897 or http://127.0.0.1:7897."
    warn "3. Restart Docker Desktop after changing proxy settings."
    warn "4. Or pre-pull required images from a reachable mirror."
  fi
  rm -f "$COMPOSE_OUTPUT"
  fail "Docker Compose startup failed."
fi
rm -f "$COMPOSE_OUTPUT"

wait_for_url() {
  local name="$1"
  local url="$2"
  local timeout_seconds="${3:-180}"
  local start
  start="$(date +%s)"

  printf "Waiting for %-12s %s" "$name" "$url"
  while true; do
    if curl -fsS --max-time 5 "$url" >/dev/null 2>&1; then
      printf " OK\n"
      return 0
    fi

    if (( $(date +%s) - start >= timeout_seconds )); then
      printf " TIMEOUT\n"
      warn "$name did not become ready within ${timeout_seconds}s."
      return 1
    fi

    printf "."
    sleep 3
  done
}

READY=true
wait_for_url "backend" "http://localhost:8080/actuator/health" 240 || READY=false
wait_for_url "frontend" "http://localhost:3000/login" 240 || READY=false
wait_for_url "prometheus" "http://localhost:9090/-/ready" 180 || READY=false
wait_for_url "grafana" "http://localhost:3001/api/health" 180 || READY=false

cat <<'EOF'

Local demo URLs
---------------
Frontend:                 http://localhost:3000
Public Chunchang site:    http://localhost:3000/sites/chunchang
Dashboard:                http://localhost:3000/dashboard
Dashboard content page:   http://localhost:3000/dashboard/sites/1/content
Backend health:           http://localhost:8080/actuator/health
Backend metrics:          http://localhost:8080/actuator/prometheus
Swagger UI:               http://localhost:8080/swagger-ui.html
Prometheus:               http://localhost:9090
Grafana:                  http://localhost:3001

Dashboard login
---------------
Email:     admin@xiao9.com
Password:  admin123

Grafana login
-------------
User:      admin
Password:  admin

Useful commands
---------------
Logs:       make docker-demo-logs
Stop:       make docker-demo-down
Reset:      ./start-demo.sh --reset
No rebuild: ./start-demo.sh --no-build
EOF

if [[ "$OPEN_BROWSER" == true ]]; then
  if command -v open >/dev/null 2>&1; then
    open "http://localhost:3000/sites/chunchang"
    open "http://localhost:3000/dashboard"
    open "http://localhost:3001"
  else
    warn "The --open option is only supported when the 'open' command is available."
  fi
fi

if [[ "$READY" != true ]]; then
  warn "Some services were not ready before timeout. Run 'make docker-demo-logs' to inspect startup logs."
  exit 1
fi
