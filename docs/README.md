# Website Builder Platform Docs

This directory is the documentation hub for the current MVP.

## Current Baseline

Read these documents first:

| Document | Purpose |
| --- | --- |
| [REQUIREMENTS_PLATFORM_MVP.md](./REQUIREMENTS_PLATFORM_MVP.md) | Product requirements baseline |
| [DEVELOPMENT_TASKS_MVP.md](./DEVELOPMENT_TASKS_MVP.md) | MVP implementation task breakdown |
| [TECHNICAL_ARCHITECTURE_MVP.md](./TECHNICAL_ARCHITECTURE_MVP.md) | Technical architecture baseline |
| [DATA_MODEL_MVP.md](./DATA_MODEL_MVP.md) | Data model and migration baseline |
| [API_SPEC_MVP.md](./API_SPEC_MVP.md) | API contract baseline |
| [SITE_CONFIG_SCHEMA_MVP.md](./SITE_CONFIG_SCHEMA_MVP.md) | SiteConfig JSON schema baseline |
| [LOCAL_DEMO_ACCEPTANCE.md](./LOCAL_DEMO_ACCEPTANCE.md) | Local demo URLs, login, and acceptance checks |
| [../使用说明.md](../使用说明.md) | Chinese operation manual for startup, admin usage, content maintenance, and troubleshooting |
| [FINAL_LAUNCH_CHECKLIST.md](./FINAL_LAUNCH_CHECKLIST.md) | Final company-material and launch approval checklist |
| [ENGINEERING_PORTFOLIO_ROADMAP.md](./ENGINEERING_PORTFOLIO_ROADMAP.md) | Interview-oriented engineering expansion roadmap |
| [DOCKER_LOCAL_DEMO.md](./DOCKER_LOCAL_DEMO.md) | Full Docker local demo startup and troubleshooting |
| [JENKINS_CI.md](./JENKINS_CI.md) | Jenkins CI pipeline stages, parameters, and troubleshooting |
| [DEV_STANDARDS.md](./DEV_STANDARDS.md) | General development standards |
| [AI_PIPELINE_GUIDE.md](./AI_PIPELINE_GUIDE.md) | AI-assisted workflow reference |

## Active Direction

- Build a multi-site website builder platform.
- The first real site is the Shandong Chunchang Food Technology Co., Ltd. corporate website.
- The personal blog is reserved until the corporate-site flow is stable.
- Phase one uses form-driven template configuration.
- Phase one does not include drag-and-drop editing.
- Phase one does not include real OSS/CDN/custom-domain publishing.

## Active Stack

| Layer | Current Choice |
| --- | --- |
| Backend | Spring Boot 3 under `apps/server` |
| Backend build | Maven |
| Frontend | Next.js 14 under `apps/web` |
| Frontend build | npm |
| Database | PostgreSQL |
| Cache | Redis |
| Migration | Flyway |

## Mainline Directories

```text
apps/server
apps/web
docs
docker
```

Do not treat old `admin`, `server`, `frontend`, `blog-server`, or `blog-web` tracks as the phase-one implementation path unless the project direction explicitly changes again.

## Useful Commands

```bash
npm run build:server
npm run build:web
npm run build:all
make docker-demo-up
make -n start
make -n db-migrate
make -n db-status
```

Run live database migration only when PostgreSQL is running:

```bash
make db-migrate
make db-status
```

## Current Milestones

| Milestone | Goal | Status |
| --- | --- | --- |
| M1 | Platform skeleton and corporate preview | Complete |
| M2 | Lead generation | Complete |
| M3 | Product service management and display | Complete |
| M4 | News/menu management and public display | Complete |
| M5 | Publish/build records | Complete |
| M6 | Local demo acceptance package | Complete |
| M7 | Personal blog planning | Later |

## Completed Implementation Notes

- `BE-001`: MVP schema alignment through Flyway migration `V3__align_mvp_schema.sql`.
- `BE-002`: Corporate-site template and Chunchang default seed through `V4__seed_corporate_site.sql`.
- `BE-003`: Site API alignment with slug, template code, default SiteConfig creation, and site access boundaries.
- `DOC-001`: Current MVP technical documentation baseline.
- `BE-004` through `BE-008`: SiteConfig, product service, news, lead, and public-site APIs.
- `FEA-004` through `FEA-006`: editable menus, menu-scoped articles, public menu pages, and admin preview links.
- `PUB-001` through `PUB-002`: publish/build visibility and build-history API.
- `UX-ADMIN-001`: dedicated build-history page.
- `UX-ADMIN-002`: article publish-readiness hints.
- `DATA-REAL-001`: logo, QR code, product image, and article cover URL entry points.
- `DOC-LAUNCH-001`: final launch checklist for real company materials and approval.

## Next Backlog Items

- Real company materials: logo, phone, WeChat, address, product photos, product specs, certificates, cases, and real news.
- Interview-oriented engineering expansion: Dockerized full stack, Jenkins CI/CD, Apollo config center, XXL-JOB scheduled tasks, Kubernetes manifests, and observability.
- Local observability demo: `docs/OBSERVABILITY_LOCAL_DEMO.md`.
- Personal blog planning after the corporate-site flow is stable.

## Redundant Documents Policy

When a new requirement baseline or technical baseline is confirmed, remove obsolete documents that would mislead implementation.

Do not keep old docs that present deprecated stack choices, including:

- Vue as current frontend.
- NestJS as current backend.
- MySQL as current database.
- Drag-and-drop editor as phase-one requirement.
- One-off corporate website as the product target.

If historical material is still valuable, migrate the useful parts into the current MVP documents instead of keeping conflicting files in place.
