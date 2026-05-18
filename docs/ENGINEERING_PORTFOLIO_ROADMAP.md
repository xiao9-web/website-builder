# Engineering Portfolio Roadmap

This document defines the engineering-expansion roadmap for using the Website Builder project as an interview portfolio.

The goal is not to add technology names for decoration. Every added component must have a clear role in the platform and a clear story for interviews.

## 1. Positioning

The project has two layers:

1. Product layer: multi-site website builder for corporate websites and later personal blogs.
2. Engineering layer: production-style platform engineering around build, deploy, configuration, scheduling, observability, and operations.

The product layer should stay understandable and demoable. The engineering layer should show that the system can evolve toward real production operation.

## 2. Principles

- Keep the current Spring Boot + Next.js + PostgreSQL + Redis path as the mainline.
- Add infrastructure in phases, not all at once.
- Prefer components that are common in Java backend interviews.
- Each component must solve a visible project problem.
- Each phase should be runnable locally or clearly documented when it requires external infrastructure.
- Avoid letting infrastructure block normal local development.

## 3. Target Technology Map

| Area | Technology | Why It Fits This Project | Interview Talking Point |
| --- | --- | --- | --- |
| CI/CD | Jenkins | Build backend/frontend, run tests, package images, deploy to local/server/K8s | Pipeline stages, quality gates, artifact flow, rollback |
| Configuration Center | Apollo | Manage environment-specific backend config, feature switches, contact/build settings | Config isolation, runtime refresh, gray release of config |
| Distributed Job | XXL-JOB | Scheduled build cleanup, lead follow-up reminders, sitemap generation, publish sync | Job sharding, retry, idempotency, executor design |
| Containerization | Docker / Docker Compose | Local reproducible development and demo environment | Service dependencies, health checks, environment isolation |
| Orchestration | Kubernetes | Deploy backend, frontend, PostgreSQL/Redis dev dependencies or external references | Deployment, Service, Ingress, ConfigMap, Secret, probes |
| Gateway / Reverse Proxy | Nginx or Ingress Controller | Route public site, dashboard, API under one entry | Path routing, static assets, API proxy, HTTPS boundary |
| Observability | Actuator + Prometheus + Grafana | Monitor API health, JVM, HTTP latency, DB/Redis availability | Metrics design, dashboards, alert dimensions |
| Logging | Logback JSON + Loki/ELK option | Centralize request and error logs | Trace request path, structured logs, troubleshooting |
| API Documentation | OpenAPI / Swagger | Make backend APIs inspectable for demo and testing | Contract-first discussion and frontend/backend collaboration |
| Security | JWT + RBAC hardening | Existing auth flow can be deepened | Access control, token expiry, ownership boundary |

## 4. Recommended Phases

### Phase E1: Container And Local Ops Baseline

Goal:

Make the whole project easy to run and easy to explain.

Scope:

- Keep PostgreSQL and Redis under Docker Compose.
- Add backend Dockerfile.
- Add frontend Dockerfile.
- Add an all-in-one local compose profile for backend + frontend + PostgreSQL + Redis.
- Add health checks and documented URLs.
- Keep current `npm run dev:web` and `npm run dev:server` flows working.

Acceptance:

- `docker compose` can start the demo stack.
- Backend health endpoint is reachable.
- Frontend can call backend from inside the compose network.
- README documents one-command local startup and troubleshooting.

Interview story:

- "I separated developer-mode startup from containerized demo startup, so local coding stays fast while the full stack is reproducible."

Implementation status:

- `ENG-DOCKER-001` added backend and frontend Dockerfiles.
- `ENG-DOCKER-001` added `docker/docker-compose.full.yml` for PostgreSQL, Redis, backend, and frontend.
- `ENG-DOCKER-001` added `make docker-demo-up`, `make docker-demo-down`, `make docker-demo-reset`, and `make docker-demo-logs`.
- `ENG-DOCKER-001` added `docs/DOCKER_LOCAL_DEMO.md`.

### Phase E2: CI Pipeline With Jenkins

Goal:

Show real build discipline.

Scope:

- Add `Jenkinsfile`.
- Pipeline stages:
  - checkout
  - backend unit tests
  - backend package
  - frontend lint
  - frontend build
  - Docker image build
  - optional deployment stage
- Archive build artifacts.
- Publish test results when possible.

Acceptance:

- Pipeline can run in Jenkins or be reviewed as a complete declarative pipeline.
- Failing tests stop packaging.
- Build logs clearly show backend and frontend stages.

Interview story:

- "The CI pipeline enforces quality gates before packaging images. I split backend and frontend stages so failures are easier to locate."

Implementation status:

- `ENG-CI-001` added `Jenkinsfile`.
- `ENG-CI-001` added backend tests, backend package, frontend install, frontend lint, frontend build, compose config validation, and optional Docker image build stages.
- `ENG-CI-001` added `docs/JENKINS_CI.md`.

### Phase E3: Configuration Center With Apollo

Goal:

Move environment-sensitive values out of code and static local files.

Good candidates:

- public backend base URL
- JWT expiration
- lead notification toggles
- publish/build strategy switch
- rate-limit switches
- company-site feature flags

Scope:

- Add Spring Boot Apollo client integration behind a profile.
- Keep local `.yml` config as fallback.
- Document namespaces and sample keys.
- Add one feature flag path that can be toggled by config.

Acceptance:

- App starts without Apollo in normal local mode.
- App can read Apollo config when the Apollo profile is enabled.
- At least one non-critical behavior is controlled by config.

Interview story:

- "Apollo is introduced as optional runtime configuration, not as a hard dependency for local development. This lets the system keep sane defaults while supporting environment-specific operations."

### Phase E4: Scheduled Jobs With XXL-JOB

Goal:

Add a real distributed-job use case without inventing fake business.

Good job candidates:

- cleanup old failed build records
- daily lead follow-up reminder summary
- generate public sitemap for published sites
- refresh site build status
- scan unpublished draft content and produce dashboard reminders

Scope:

- Add backend XXL-JOB executor integration behind a profile.
- Implement one idempotent job first.
- Add job parameter parsing.
- Document admin setup and retry behavior.

Acceptance:

- Job can be triggered manually from XXL-JOB admin.
- Job is idempotent.
- Job logs include site/job identifiers.
- Failure behavior is documented.

Interview story:

- "I chose idempotent scheduled tasks because retries are normal in distributed job systems. The job can be safely re-run without corrupting state."

### Phase E5: Kubernetes Deployment

Goal:

Show production-style deployment model.

Scope:

- Add `deploy/k8s/` manifests:
  - namespace
  - backend Deployment/Service
  - frontend Deployment/Service
  - ConfigMap
  - Secret example
  - Ingress
  - probes
- Prefer external PostgreSQL/Redis references for production docs.
- Provide local Minikube or Kind notes if needed.

Acceptance:

- Manifests are valid.
- Image names and environment variables are documented.
- Health probes map to real endpoints.
- Ingress routes dashboard, public site, and API.

Interview story:

- "The Kubernetes layer makes deployment boundaries explicit: stateless app pods, externalized configuration, service discovery, health probes, and ingress routing."

### Phase E6: Observability

Goal:

Make operational health visible.

Scope:

- Add Spring Boot Actuator endpoints.
- Expose Prometheus metrics.
- Add sample Prometheus config.
- Add a Grafana dashboard JSON or documentation.
- Add structured request/error logging conventions.

Acceptance:

- Health endpoint distinguishes app, DB, and Redis.
- Metrics include HTTP latency/status and JVM basics.
- Dashboard or screenshots can explain system health.

Interview story:

- "I can observe the system at three levels: service liveness/readiness, HTTP/API behavior, and JVM/resource indicators."

## 5. What Not To Add Yet

Avoid these until the above is stable:

- Full service mesh.
- Complex microservice split.
- Real payment or order system.
- Overcomplicated event sourcing.
- Multi-tenant billing.
- Heavy distributed tracing stack before traffic volume justifies it.

These are easy to name, but hard to justify for the current project.

## 6. Suggested Implementation Order

1. Dockerize backend and frontend.
2. Add Actuator health endpoints.
3. Add Jenkins pipeline.
4. Add OpenAPI documentation.
5. Add XXL-JOB for one idempotent scheduled task.
6. Add Apollo as optional profile-based configuration center.
7. Add Kubernetes manifests.
8. Add Prometheus/Grafana observability.

## 7. Resume Framing

Possible resume bullet:

```text
Built a Spring Boot + Next.js multi-site website-builder platform with PostgreSQL, Redis, Flyway, JWT auth, content management, public-site rendering, Dockerized local deployment, CI/CD pipeline design, configuration-center integration plan, distributed scheduled-job design, and Kubernetes deployment manifests.
```

Stronger version after implementation:

```text
Built and containerized a multi-site website-builder platform; added Jenkins CI/CD quality gates, Apollo-based runtime configuration, XXL-JOB scheduled maintenance tasks, Kubernetes deployment manifests, and Prometheus/Grafana observability for production-style operation.
```

## 8. Interview Q&A Anchors

Prepare to explain:

- Why PostgreSQL rather than MySQL for this project.
- Why Flyway is the schema source of truth.
- Why Redis is available but not used for core persistence.
- How JWT and site ownership boundaries work.
- How menu/article rules are enforced in both frontend and backend.
- Why site deletion is modeled as offline/re-publish instead of physical deletion.
- How Jenkins stages prevent bad builds from being packaged.
- How Apollo config differs from environment variables.
- How XXL-JOB handles retry/idempotency.
- How K8s probes differ from business health.
- How public site rendering stays data-driven instead of hardcoded.
