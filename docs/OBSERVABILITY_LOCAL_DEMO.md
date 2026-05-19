# Observability Local Demo

This document explains the first local observability layer for the Website Builder platform.

## Goal

Make backend service health and runtime metrics visible during local Docker demos and interviews.

This slice is intentionally small:

- Spring Boot Actuator health endpoints stay available.
- Prometheus metrics are exposed at `/actuator/prometheus`.
- Docker Compose starts Prometheus with the full local demo stack.
- Prometheus scrapes the backend container through the Docker network.
- Grafana starts with a pre-provisioned Prometheus data source and overview dashboard.

## Start

From the repository root:

```bash
make docker-demo-up
```

Validate the compose file without starting containers:

```bash
make docker-demo-config
```

## URLs

| Service | URL |
| --- | --- |
| Backend health | `http://localhost:8080/actuator/health` |
| Backend Prometheus metrics | `http://localhost:8080/actuator/prometheus` |
| Prometheus UI | `http://localhost:9090` |
| Grafana UI | `http://localhost:3001` |

Grafana login:

```text
admin
admin
```

Preloaded dashboard:

```text
Website Builder / Website Builder Overview
```

Prometheus target status:

```text
http://localhost:9090/targets
```

The expected scrape target is:

```text
website-builder-server -> server:8080/actuator/prometheus
```

## Useful Prometheus Queries

Run these in the Prometheus UI:

```promql
up
```

```promql
jvm_memory_used_bytes{application="website-builder"}
```

```promql
http_server_requests_seconds_count{application="website-builder"}
```

```promql
sum by (uri, method, status) (http_server_requests_seconds_count{application="website-builder"})
```

## Backend Configuration

The backend exposes:

```yaml
management:
  endpoints:
    web:
      exposure:
        include: health,info,prometheus
  endpoint:
    health:
      probes:
        enabled: true
  metrics:
    tags:
      application: website-builder
```

The `application` tag keeps metrics easy to filter when more services are added later.

## Interview Talking Points

- Actuator provides liveness and readiness probes for Docker and Kubernetes.
- Micrometer exports JVM, process, HTTP, and application metrics.
- Prometheus scrapes metrics instead of the application pushing them.
- The Docker network target is `server:8080`, while the browser-visible backend URL is `localhost:8080`.
- Grafana provisioning keeps the demo repeatable: data source and dashboard are loaded from repository files.
- This is the foundation for later alert rules.

## Next Steps

- Add alerting rules for backend down, high error rate, and slow API response.
- Add structured JSON logs and trace/request IDs.
