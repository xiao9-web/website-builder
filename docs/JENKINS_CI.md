# Jenkins CI Pipeline

This document explains the Jenkins pipeline for the Website Builder platform.

## Purpose

The pipeline is designed as an interview-friendly CI/CD baseline:

- backend unit tests
- backend package
- frontend dependency install
- frontend lint
- frontend production build
- Docker Compose config validation
- optional Docker image build

The default path focuses on quality gates. Docker image build is parameterized because local Docker registry access may depend on proxy/network settings.

## File

```text
Jenkinsfile
```

## Jenkins Agent Requirements

The Jenkins agent should provide:

- JDK 17
- Maven 3.9+
- Node.js 20+
- npm
- Docker CLI
- Docker Compose plugin

Docker is only required when either:

- `RUN_COMPOSE_CONFIG_CHECK=true`
- `BUILD_DOCKER_IMAGES=true`

The backend test profile uses H2 in PostgreSQL compatibility mode so `mvn test` can run in CI without requiring a live PostgreSQL container.

## Parameters

| Name | Default | Purpose |
| --- | --- | --- |
| `BUILD_DOCKER_IMAGES` | `false` | Build backend and frontend Docker images after quality gates pass |
| `RUN_COMPOSE_CONFIG_CHECK` | `true` | Validate `docker/docker-compose.full.yml` |

## Pipeline Stages

### Checkout

Checks out source code and prints the current git commit.

### Toolchain

Prints Java, Maven, Node, and npm versions so failed builds can be diagnosed quickly.

### Backend Unit Tests

Runs:

```bash
mvn -f apps/server/pom.xml test
```

Publishes Surefire reports from:

```text
apps/server/target/surefire-reports/*.xml
```

### Backend Package

Runs:

```bash
mvn -f apps/server/pom.xml -DskipTests package
```

Archives backend jar artifacts from:

```text
apps/server/target/*.jar
```

### Frontend Install

Runs:

```bash
cd apps/web
npm ci
```

### Frontend Lint

Runs:

```bash
cd apps/web
npm run lint
```

### Frontend Build

Runs:

```bash
cd apps/web
rm -rf .next
npm run build
```

The `.next` cleanup avoids dirty-cache issues when dev and production builds share the same workspace.

### Compose Config Check

Runs:

```bash
docker compose -f docker/docker-compose.full.yml config
```

This validates the full local demo stack definition without starting containers.

### Docker Build

Runs only when `BUILD_DOCKER_IMAGES=true`.

Builds:

```bash
website-builder-server:${BUILD_NUMBER}
website-builder-server:latest
website-builder-web:${BUILD_NUMBER}
website-builder-web:latest
```

## Current Local Note

On the current workstation, Docker image build can be blocked before project code runs if Docker is configured to use a local proxy that is not running:

```text
127.0.0.1:7890: connect: connection refused
```

Fix options:

- start Clash Verge and confirm its HTTP proxy port is `7897`
- update Docker Desktop proxy configuration to `http://host.docker.internal:7897` or `http://127.0.0.1:7897`
- run the Jenkins agent in an environment with direct image registry access

## Interview Talking Points

- Quality gates happen before artifact packaging.
- Backend and frontend are separate stages, so failures are easy to locate.
- Test reports and jar artifacts are published.
- Docker image build is optional to avoid making normal CI depend on local registry/proxy availability.
- The same Dockerfiles used by local demo can be used by CI packaging.
