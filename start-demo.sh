#!/usr/bin/env bash
set -Eeuo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
FULL_COMPOSE_FILE="$ROOT_DIR/docker/docker-compose.full.yml"
PROJECT_NAME="website-builder"
MODE="local"
BUILD_FLAG="--build"
RESET=false
OPEN_BROWSER=false
STOP=false
DETACH=false
RUN_DIR="$ROOT_DIR/.run"
SERVER_LOG="$RUN_DIR/server.log"
WEB_LOG="$RUN_DIR/web.log"
SERVER_PID_FILE="$RUN_DIR/server.pid"
WEB_PID_FILE="$RUN_DIR/web.pid"

usage() {
  cat <<'EOF'
Website Builder local demo launcher

Usage:
  ./start-demo.sh [options]

Default mode:
  Starts PostgreSQL + Redis with Docker, then starts the backend and frontend
  locally with Maven and Next.js. This mode does not pull optional Docker
  images, so it works even while Docker Desktop proxy is still being fixed.

Options:
  --docker      Use the full Docker demo stack instead of local dev mode.
  --reset       Reset Docker volumes before starting. Only applies to --docker.
  --no-build    In --docker mode, start containers without rebuilding images.
  --open        Open key pages in the default browser after services are ready.
  --detach      In local mode, return after startup instead of keeping the
                script attached to backend/frontend processes.
  --stop        Stop local backend/frontend processes and Docker demo services.
  -h, --help    Show this help.

Local mode services:
  Frontend       http://localhost:3000
  Public site    http://localhost:3000/sites/chunchang
  Dashboard      http://localhost:3000/dashboard
  Backend        http://localhost:8080

Full Docker mode also starts:
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
    --docker)
      MODE="docker"
      shift
      ;;
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
    --detach)
      DETACH=true
      shift
      ;;
    --stop)
      STOP=true
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
mkdir -p "$RUN_DIR"

stop_pid_file() {
  local pid_file="$1"
  local name="$2"

  if [[ -f "$pid_file" ]]; then
    local pid
    pid="$(cat "$pid_file")"
    if [[ -n "$pid" ]] && kill -0 "$pid" >/dev/null 2>&1; then
      log "Stopping $name process $pid"
      kill "$pid" >/dev/null 2>&1 || true
    fi
    rm -f "$pid_file"
  fi
}

stop_local_processes() {
  stop_pid_file "$SERVER_PID_FILE" "backend"
  stop_pid_file "$WEB_PID_FILE" "frontend"

  local port_pid
  port_pid="$(lsof -tiTCP:8080 -sTCP:LISTEN || true)"
  if [[ -n "$port_pid" ]]; then
    warn "Port 8080 is still in use by PID(s): $port_pid"
  fi

  port_pid="$(lsof -tiTCP:3000 -sTCP:LISTEN || true)"
  if [[ -n "$port_pid" ]]; then
    warn "Port 3000 is still in use by PID(s): $port_pid"
  fi
}

if [[ "$STOP" == true ]]; then
  stop_local_processes
  log "Stopping full Docker demo stack if it exists"
  docker compose -p "$PROJECT_NAME" -f "$FULL_COMPOSE_FILE" down >/dev/null 2>&1 || true
  exit 0
fi

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

verify_url_still_ready() {
  local name="$1"
  local url="$2"

  if curl -fsS --max-time 5 "$url" >/dev/null 2>&1; then
    return 0
  fi

  warn "$name was ready but is no longer reachable: $url"
  return 1
}

print_urls() {
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
Local logs:  tail -f .run/server.log .run/web.log
Stop:        ./start-demo.sh --stop
Base deps:   make dev-up
Docker demo: ./start-demo.sh --docker
EOF
}

keep_local_processes_attached() {
  if [[ "$DETACH" == true ]]; then
    return 0
  fi

  cat <<'EOF'

Local backend/frontend are running under this launcher.
Keep this terminal open while viewing the site.
Press Ctrl+C to stop local backend/frontend processes.
EOF

  trap 'echo; ./start-demo.sh --stop >/dev/null 2>&1 || true; exit 0' INT TERM

  while true; do
    sleep 5
    local alive=true
    if ! curl -fsS --max-time 5 "http://localhost:8080/actuator/health" >/dev/null 2>&1; then
      warn "Backend is no longer reachable. Check $SERVER_LOG"
      alive=false
    fi
    if ! curl -fsS --max-time 5 "http://localhost:3000/login" >/dev/null 2>&1; then
      warn "Frontend is no longer reachable. Check $WEB_LOG"
      alive=false
    fi
    if [[ "$alive" != true ]]; then
      exit 1
    fi
  done
}

open_pages() {
  if [[ "$OPEN_BROWSER" == true ]]; then
    if command -v open >/dev/null 2>&1; then
      open "http://localhost:3000/sites/chunchang"
      open "http://localhost:3000/dashboard"
      if [[ "$MODE" == "docker" ]]; then
        open "http://localhost:3001"
      fi
    else
      warn "The --open option is only supported when the 'open' command is available."
    fi
  fi
}

start_full_docker_demo() {
  if [[ "$RESET" == true ]]; then
    log "Resetting full Docker demo stack and volumes"
    docker compose -p "$PROJECT_NAME" -f "$FULL_COMPOSE_FILE" down -v
  fi

  log "Validating full Docker Compose config"
  docker compose -p "$PROJECT_NAME" -f "$FULL_COMPOSE_FILE" config >/dev/null

  log "Starting full Docker demo stack"
  local compose_output
  compose_output="$(mktemp)"
  set +e
  if [[ -n "$BUILD_FLAG" ]]; then
    docker compose -p "$PROJECT_NAME" -f "$FULL_COMPOSE_FILE" up -d "$BUILD_FLAG" 2>&1 | tee "$compose_output"
  else
    docker compose -p "$PROJECT_NAME" -f "$FULL_COMPOSE_FILE" up -d 2>&1 | tee "$compose_output"
  fi
  local compose_status="${PIPESTATUS[0]}"
  set -e

  if [[ "$compose_status" -ne 0 ]]; then
    if grep -Eq "127\\.0\\.0\\.1:7890|127\\.0\\.0\\.1:7897|proxy|registry-1\\.docker\\.io|connect: connection refused" "$compose_output" 2>/dev/null; then
      warn "Docker image pull/build failed because Docker is using a proxy that is not reachable."
      warn "Your Clash Verge proxy port is 7897; Docker Desktop may still be pointing at the old 7890 port."
      warn "Fix Docker Desktop proxy, or run default local mode without --docker."
    fi
    rm -f "$compose_output"
    fail "Docker Compose startup failed."
  fi
  rm -f "$compose_output"

  local ready=true
  wait_for_url "backend" "http://localhost:8080/actuator/health" 240 || ready=false
  wait_for_url "frontend" "http://localhost:3000/login" 240 || ready=false
  wait_for_url "prometheus" "http://localhost:9090/-/ready" 180 || ready=false
  wait_for_url "grafana" "http://localhost:3001/api/health" 180 || ready=false

  print_urls
  open_pages

  if [[ "$ready" != true ]]; then
    warn "Some services were not ready before timeout. Run 'make docker-demo-logs' to inspect startup logs."
    exit 1
  fi
}

start_local_demo() {
  if [[ "$RESET" == true ]]; then
    warn "--reset only applies to --docker mode. Use 'make dev-reset' if you want to reset base dev services."
  fi

  log "Starting base dependencies with Docker"
  make dev-up

  if [[ -n "$(lsof -tiTCP:8080 -sTCP:LISTEN || true)" ]]; then
    warn "Backend port 8080 is already in use; not starting another backend process."
  else
    log "Starting backend locally; log: $SERVER_LOG"
    nohup sh -c 'exec env DB_USERNAME=wb_user DB_PASSWORD=wb_pass mvn -f apps/server/pom.xml spring-boot:run' >"$SERVER_LOG" 2>&1 &
    echo "$!" >"$SERVER_PID_FILE"
  fi

  if [[ -n "$(lsof -tiTCP:3000 -sTCP:LISTEN || true)" ]]; then
    warn "Frontend port 3000 is already in use; not starting another frontend process."
  else
    log "Starting frontend locally; log: $WEB_LOG"
    nohup sh -c 'cd apps/web && exec npm run dev' >"$WEB_LOG" 2>&1 &
    echo "$!" >"$WEB_PID_FILE"
  fi

  local ready=true
  wait_for_url "backend" "http://localhost:8080/actuator/health" 240 || ready=false
  wait_for_url "frontend" "http://localhost:3000/login" 240 || ready=false

  if [[ "$ready" == true ]]; then
    sleep 3
    verify_url_still_ready "backend" "http://localhost:8080/actuator/health" || ready=false
    verify_url_still_ready "frontend" "http://localhost:3000/login" || ready=false
  fi

  print_urls
  open_pages

  if [[ "$ready" != true ]]; then
    warn "Some services were not ready before timeout."
    warn "Backend log: tail -f $SERVER_LOG"
    warn "Frontend log: tail -f $WEB_LOG"
    exit 1
  fi

  keep_local_processes_attached
}

if [[ "$MODE" == "docker" ]]; then
  start_full_docker_demo
else
  start_local_demo
fi
