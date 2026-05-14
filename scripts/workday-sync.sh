#!/usr/bin/env bash
set -euo pipefail

REPO_DIR="/Users/xiao9/workSpace/website-builder"
BRANCH="main"
REMOTE="origin"
LOG_DIR="$REPO_DIR/.meta-kim/logs"
LOG_FILE="$LOG_DIR/workday-sync.log"

mkdir -p "$LOG_DIR"

log() {
  printf '[%s] %s\n' "$(date '+%Y-%m-%d %H:%M:%S %Z')" "$*" | tee -a "$LOG_FILE"
}

cd "$REPO_DIR"

day_of_week="$(date '+%u')"
if [ "$day_of_week" -gt 5 ]; then
  log "skip: weekend"
  exit 0
fi

current_branch="$(git branch --show-current)"
if [ "$current_branch" != "$BRANCH" ]; then
  log "skip: current branch is $current_branch, expected $BRANCH"
  exit 0
fi

if [ -z "$(git status --porcelain)" ]; then
  log "skip: no changes"
  exit 0
fi

log "start: staging safe mainline paths"

git add \
  Makefile \
  README.md \
  package.json \
  docs \
  task_plan.md \
  progress.md \
  findings.md \
  apps/server/src/main/java \
  apps/server/src/main/resources/db/migration \
  apps/server/pom.xml \
  apps/web \
  scripts \
  2>&1 | tee -a "$LOG_FILE"

if git diff --cached --quiet; then
  log "skip: no safe staged changes after filtering"
  exit 0
fi

if command -v npm >/dev/null 2>&1; then
  log "verify: npm run build:server"
  npm run build:server 2>&1 | tee -a "$LOG_FILE"
else
  log "warn: npm not found, skipping build verification"
fi

commit_message="Daily sync $(date '+%Y-%m-%d %H:%M')"
log "commit: $commit_message"
git commit -m "$commit_message" 2>&1 | tee -a "$LOG_FILE"

log "push: $REMOTE $BRANCH"
git push "$REMOTE" "$BRANCH" 2>&1 | tee -a "$LOG_FILE"

log "done"
