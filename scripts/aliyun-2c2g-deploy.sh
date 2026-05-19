#!/usr/bin/env bash
set -Eeuo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "${ROOT_DIR}"

COMPOSE_FILE="docker-compose.prod.aliyun-2c2g.yml"

if [ ! -f ".env.prod" ]; then
  echo "Missing .env.prod. Copy .env.prod.example to .env.prod and edit secrets first."
  exit 1
fi

if grep -q "change-this" .env.prod; then
  echo ".env.prod still contains placeholder secrets. Please edit it before deployment."
  exit 1
fi

BUILD_FLAG="--build"
if [ "${1:-}" = "--no-build" ]; then
  BUILD_FLAG=""
fi
if [ "${1:-}" = "--build" ]; then
  BUILD_FLAG="--build"
fi

echo "==> Validating compose config"
docker compose -f "${COMPOSE_FILE}" --env-file .env.prod config >/dev/null

echo "==> Starting Website Builder production stack"
docker compose -f "${COMPOSE_FILE}" --env-file .env.prod up -d ${BUILD_FLAG}

echo "==> Waiting for health checks"
for i in $(seq 1 60); do
  if curl -fsS http://127.0.0.1/healthz >/dev/null 2>&1 &&
     curl -fsS http://127.0.0.1/actuator/health >/dev/null 2>&1; then
    echo "Deployment healthy."
    docker compose -f "${COMPOSE_FILE}" --env-file .env.prod ps
    exit 0
  fi
  sleep 3
done

echo "Deployment started but health checks did not pass in time."
docker compose -f "${COMPOSE_FILE}" --env-file .env.prod ps
echo "Use: docker compose -f ${COMPOSE_FILE} --env-file .env.prod logs --tail=200"
exit 1
