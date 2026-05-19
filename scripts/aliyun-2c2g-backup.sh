#!/usr/bin/env bash
set -Eeuo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "${ROOT_DIR}"

if [ ! -f ".env.prod" ]; then
  echo "Missing .env.prod."
  exit 1
fi

set -a
# shellcheck disable=SC1091
. ./.env.prod
set +a

BACKUP_DIR="${ROOT_DIR}/backups"
mkdir -p "${BACKUP_DIR}"

TS="$(date +%Y%m%d-%H%M%S)"
DB_FILE="${BACKUP_DIR}/website-builder-db-${TS}.sql.gz"
UPLOADS_FILE="${BACKUP_DIR}/website-builder-uploads-${TS}.tar.gz"

echo "==> Backing up PostgreSQL to ${DB_FILE}"
docker exec wb-prod-postgres pg_dump -U "${POSTGRES_USER}" "${POSTGRES_DB}" | gzip > "${DB_FILE}"

echo "==> Backing up uploads volume to ${UPLOADS_FILE}"
docker run --rm \
  -v website-builder-prod_wb_prod_uploads:/data:ro \
  -v "${BACKUP_DIR}:/backup" \
  alpine:3.20 \
  tar -czf "/backup/$(basename "${UPLOADS_FILE}")" -C /data .

echo "==> Backup complete"
ls -lh "${DB_FILE}" "${UPLOADS_FILE}"
