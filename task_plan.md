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

## Steps

1. [complete] Capture the final product direction in `docs/REQUIREMENTS_PLATFORM_MVP.md`.
2. [complete] Mark the new document as the current requirements baseline in `docs/README.md`.
3. [complete] Split the requirements into executable tasks in `docs/DEVELOPMENT_TASKS_MVP.md`.
4. [complete] Keep audit findings, progress, and Obsidian notes aligned with the accepted direction.
5. [complete] BE-001: Align Flyway migrations with the MVP schema.
6. [complete] BE-002: Seed corporate template and default Chunchang site data.
7. [complete] Verify backend build and migration command expansion after BE-002.
8. [complete] Update progress, findings, and Obsidian notes with BE-002 results.
9. [pending] BE-003: Site API alignment with slug, template code, and default SiteConfig creation.

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

## Next Execution: BE-003

Primary deliverable:

- Align backend Site API behavior with the MVP requirements.

Key gaps to handle:

- JPA entities and DTOs do not yet expose V3 fields such as `sites.slug`, `templates.code`, `site_configs.brand_config`, and `site_configs.content_config`.
- Site creation should validate slug format and uniqueness.
- Creating a site with template `corporate-site` should create a default `SiteConfig`.
- USER access should be limited to owned sites; ADMIN access should be handled deliberately.
