#!/usr/bin/env bash
set -Eeuo pipefail

log() {
  printf "\033[1;34m==>\033[0m %s\n" "$*"
}

warn() {
  printf "\033[1;33mWARN:\033[0m %s\n" "$*" >&2
}

ok() {
  printf "\033[1;32mOK:\033[0m %s\n" "$*"
}

command -v docker >/dev/null 2>&1 || {
  warn "Docker is not installed or not in PATH."
  exit 1
}

log "Docker context"
docker context show || true

log "Docker daemon proxy settings"
docker info 2>/dev/null | sed -n '/HTTP Proxy/,+8p' || warn "Docker daemon is not running."

log "User Docker daemon config"
if [[ -f "$HOME/.docker/daemon.json" ]]; then
  sed -n '1,220p' "$HOME/.docker/daemon.json"
else
  warn "$HOME/.docker/daemon.json does not exist."
fi

log "Checking common local proxy port 127.0.0.1:7890"
if command -v nc >/dev/null 2>&1; then
  if nc -z 127.0.0.1 7890 >/dev/null 2>&1; then
    ok "127.0.0.1:7890 is reachable."
  else
    warn "127.0.0.1:7890 is not reachable."
    warn "If Docker Desktop is configured to use this proxy, image pulls will fail."
  fi
else
  warn "'nc' is not available; skipping local port check."
fi

log "Checking registry access from Docker"
set +e
docker pull hello-world:latest
STATUS="$?"
set -e

if [[ "$STATUS" -eq 0 ]]; then
  ok "Docker can pull from registry."
else
  warn "Docker still cannot pull from registry."
  cat <<'EOF'

Recommended fixes:

1. Start your local proxy/VPN client if you normally use one.
2. Or open Docker Desktop -> Settings -> Resources -> Proxies and disable/fix the proxy.
3. Restart Docker Desktop after changing proxy settings.
4. Then run:

   make dev-up-full

If you only need PostgreSQL and Redis, run:

   make dev-up

EOF
  exit "$STATUS"
fi
