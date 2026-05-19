# Docker Local Demo

This document explains how to run the Website Builder platform as a full local Docker demo.

## Stack

The full demo starts:

- PostgreSQL
- Redis
- Spring Boot backend
- Next.js frontend
- Prometheus
- Grafana

It is meant for interview/demo usage. Normal development can still use `make dev-up`, `npm run dev:server`, and `npm run dev:web`.

## Start

From the repository root:

```bash
./start-demo.sh
```

The script validates Docker, starts the full demo stack, waits for key services, and prints all URLs and credentials.

Common options:

```bash
./start-demo.sh --no-build
./start-demo.sh --reset
./start-demo.sh --open
```

Equivalent Makefile command:

```bash
make demo
```

Equivalent raw Docker command:

```bash
docker compose -f docker/docker-compose.full.yml up -d --build
```

## URLs

| Service | URL |
| --- | --- |
| Frontend | `http://localhost:3000` |
| Public Chunchang site | `http://localhost:3000/sites/chunchang` |
| Dashboard content page | `http://localhost:3000/dashboard/sites/1/content` |
| Backend API | `http://localhost:8080` |
| Backend health | `http://localhost:8080/actuator/health` |
| Backend Prometheus metrics | `http://localhost:8080/actuator/prometheus` |
| Swagger UI | `http://localhost:8080/swagger-ui.html` |
| Prometheus UI | `http://localhost:9090` |
| Grafana UI | `http://localhost:3001` |

Login:

```text
admin@xiao9.com
admin123
```

Grafana login:

```text
admin
admin
```

## Stop

```bash
make docker-demo-down
```

To remove volumes and start from a fresh database:

```bash
make docker-demo-reset
```

## Logs

```bash
make docker-demo-logs
```

Or for one service:

```bash
docker logs -f wb-server
docker logs -f wb-web
```

## Why Two API URLs Exist

The frontend needs two API addresses in Docker mode:

- `NEXT_PUBLIC_API_URL=http://localhost:8080/api`
  - used by browser-side dashboard requests
- `INTERNAL_API_URL=http://server:8080/api`
  - used by Next.js server-side rendering inside the Docker network

Without `INTERNAL_API_URL`, server-rendered public pages inside the web container would try to call their own `localhost`, not the backend container.

## Health Checks

Docker Compose waits for:

- PostgreSQL readiness through `pg_isready`
- Redis readiness through `redis-cli ping`
- backend readiness through `/actuator/health`
- frontend readiness through `/login`
- Prometheus scrapes backend metrics through `/actuator/prometheus`
- Grafana loads the Prometheus data source and Website Builder dashboard from provisioning files

This makes the startup order explainable for interviews and future Kubernetes probes.

## Troubleshooting

If ports are already occupied:

```bash
lsof -i :3000
lsof -i :8080
lsof -i :5432
lsof -i :6379
```

If the database has stale local data:

```bash
make docker-demo-reset
make docker-demo-up
```

If image builds are stale:

```bash
docker compose -f docker/docker-compose.full.yml build --no-cache
```

If Docker image pull fails with a proxy error such as `127.0.0.1:7890 connect: connection refused`, Docker Desktop is configured to use a local proxy that is not running. Start the proxy/VPN client, or disable/fix Docker Desktop proxy settings, then rerun:

```bash
./start-demo.sh
```
