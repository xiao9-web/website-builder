# Project Plan

## Goal

Build the Website Builder Platform MVP around the active implementation direction.

## Scope

- Multi-site website builder platform requirements
- Corporate-site MVP for Shandong Chunchang Food Technology Co., Ltd.
- Personal blog as the second real site after the corporate-site flow
- Admin dashboard, public site, data model, API, UI, and acceptance scope
- Active implementation track under `apps/server` and `apps/web`

## Out of Scope

- No drag-and-drop editor in phase one
- No one-off hardcoded corporate website
- No real OSS/CDN publishing in phase one
- No invented company facts such as founding year, certifications, production capacity, or customer names

## Current Run Steps

1. [complete] Capture the final product direction in `docs/REQUIREMENTS_PLATFORM_MVP.md`.
2. [complete] Mark the new document as the current requirements baseline in `docs/README.md`.
3. [complete] Split the requirements into executable tasks in `docs/DEVELOPMENT_TASKS_MVP.md`.
4. [complete] Keep audit findings, progress, and Obsidian notes aligned with the accepted direction.
5. [complete] BE-001: Align Flyway migrations with the MVP schema.
6. [complete] BE-002: Seed corporate template and default Chunchang site data.
7. [complete] Verify backend build and migration command expansion after BE-002.
8. [complete] Update progress, findings, and Obsidian notes with BE-002 results.
9. [complete] BE-003: Site API alignment with slug, template code, and default SiteConfig creation.
10. [complete] DOC-001: Create current MVP technical documentation baseline.
11. [complete] DOC-002: Remove obsolete documents after confirming the new MVP requirements and technical baseline.
12. [complete] OPS-001: Configure workday 17:30 commit and push sync.

## Backlog

1. BE-004: SiteConfig API for loading and saving corporate-site config.
2. BE-005: Product Service API.
3. BE-006: News API.
4. BE-007: Lead API.
5. BE-008: Public Site APIs.

## Completed Execution: BE-001

Primary deliverable:

- Align Flyway migrations with the MVP schema while preserving existing compatible tables.

Worker packets:

- `BE001-W1`: add a Flyway migration for missing MVP schema pieces.
- `BE001-W2`: read-only schema consistency review against requirements, existing migrations, and JPA entities.

Verification:

- `npm run build:server`
- `make -n db-migrate`
- `make -n db-status`

Result:

- Added `apps/server/src/main/resources/db/migration/V3__align_mvp_schema.sql`.
- Backend build passed.
- Dry-run database migration commands expand correctly.
- Progress, findings, and Obsidian notes were updated.
- Graphify refresh was attempted and remains blocked because the local Python environment does not have the `graphify` package installed.
- Live `make db-migrate` remains pending until PostgreSQL is running.

## Current Execution: BE-002

Primary deliverable:

- Add a new Flyway migration that seeds the `corporate-site` template and a default Shandong Chunchang corporate site without inventing unverified company facts.

Planned file:

- `apps/server/src/main/resources/db/migration/V4__seed_corporate_site.sql`

Seed data:

- `corporate-site` template code.
- Template version 1 with corporate-site schema.
- Default Chunchang site and site config.
- Default product service rows:
  - 黄油产品
  - 乳制品原料
  - 企业采购服务
  - 渠道合作
- Draft placeholder news rows only.

Verification:

- `npm run build:server`
- `make -n db-migrate`
- `make -n db-status`

Result:

- Added `apps/server/src/main/resources/db/migration/V4__seed_corporate_site.sql`.
- Seeded `corporate-site` template and template version.
- Seeded default `chunchang` site, `SiteConfig`, product services, and draft placeholder news.
- Backend build passed.
- Dry-run database migration commands expand correctly.

## Completed Execution: BE-003

Primary deliverable:

- Align backend Site API behavior with the MVP requirements.

Key gaps to handle:

- JPA entities and DTOs do not yet expose V3 fields such as `sites.slug`, `templates.code`, `site_configs.brand_config`, and `site_configs.content_config`.
- Site creation should validate slug format and uniqueness.
- Creating a site with template `corporate-site` should create a default `SiteConfig`.
- USER access should be limited to owned sites; ADMIN access should be handled deliberately.

Result:

- Added `UpdateSiteRequest`.
- Added `slug` and `publishedAt` to `Site`.
- Added `code` to `Template`.
- Added `brandConfig` and `contentConfig` to `SiteConfig`.
- Site DTOs now expose slug, template code, and published time.
- Site API now supports `PUT /api/sites/{id}`.
- ADMIN can list/read/write all sites; USER is restricted to owned sites.
- Creating a site validates slug format and uniqueness.
- Creating a site creates a default `SiteConfig`.
- Template `corporate-site` or corporate category now infers `CORPORATE` site type when no explicit site type is provided.

Verification:

- `npm run build:server`
- `make -n db-migrate`
- `make -n db-status`

## Backlog Next: BE-004

Primary deliverable:

- Add SiteConfig API endpoints so the dashboard can load and save structured corporate-site config.

Endpoints:

- `GET /api/sites/{siteId}/config`
- `PUT /api/sites/{siteId}/config`

## Current Execution: DOC-001

Primary deliverable:

- Create current technical documentation that matches the accepted MVP direction and clearly supersedes old Vue/NestJS/MySQL/drag-and-drop documents.

Planned files:

- `docs/TECHNICAL_ARCHITECTURE_MVP.md`
- `docs/DATA_MODEL_MVP.md`
- `docs/API_SPEC_MVP.md`
- `docs/SITE_CONFIG_SCHEMA_MVP.md`

Also update:

- `docs/README.md`

Verification:

- Documents reference current stack and current implementation direction.
- Documents do not present old architecture as active.
- `docs/README.md` points developers to the new technical baseline.

Result:

- Added `docs/TECHNICAL_ARCHITECTURE_MVP.md`.
- Added `docs/DATA_MODEL_MVP.md`.
- Added `docs/API_SPEC_MVP.md`.
- Added `docs/SITE_CONFIG_SCHEMA_MVP.md`.
- Updated `docs/README.md` to identify the new technical baseline and mark old technical docs as historical references.

## Completed Execution: DOC-002

Primary deliverable:

- Remove obsolete documentation files that conflict with the confirmed MVP requirements and technical baseline.

Deleted obsolete files:

- `docs/architecture.md`
- `docs/architecture-design.md`
- `docs/IMPLEMENTATION_SPEC.md`
- `docs/DATABASE_SCHEMA.sql`
- `docs/COMPONENT_SCHEMA.md`
- `docs/THEME_DESIGN.md`
- `docs/REQUIREMENTS_SIMPLE.md`
- `docs/REQUIREMENTS_V2.md`
- `docs/requirements-blog.md`
- `docs/PROJECT_PLAN.md`
- `docs/DEVELOPMENT_PLAN_2WEEKS.md`
- `docs/QUICK_START_V2.md`
- `docs/QUICK_START.md`
- `docs/AI_COLLABORATION.md`

Result:

- `docs/README.md` was rewritten as the current MVP documentation hub.
- `docs/` now keeps only current baseline documents and general non-conflicting references.
- Future confirmed requirement/technology pivots should delete or rewrite obsolete docs rather than leaving conflicting guidance in place.

## Current Execution: OPS-001

Primary deliverable:

- Every workday around 17:30, commit and push safe mainline changes so the user can continue from home.

Files:

- `scripts/workday-sync.sh`
- `/Users/xiao9/Library/LaunchAgents/com.xiao9.website-builder.workday-sync.plist`

Rules:

- Runs Monday through Friday at 17:30.
- Runs only on `main`.
- Skips when there are no changes.
- Stages only safe mainline paths, excluding local/runtime/side-branch files such as `.claude/settings.json`, `.codex/`, `blog-server/`, and `blog-web/`.
- Runs `npm run build:server` before committing when npm is available.
- Commits with `Daily sync YYYY-MM-DD HH:MM`.
- Pushes to `origin main`.

Result:

- LaunchAgent was loaded.
- Manual sync created local commit `374b865 Daily sync 2026-05-14 17:44`.
- Push failed because this machine could not connect to GitHub over HTTPS port 443.
- User said they will push manually and asked Codex to stop.
