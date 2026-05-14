# Project Audit Findings

## Initial Findings

- The repository appears to contain multiple implementation tracks.
- The root README describes a platform based on `apps/server` and `apps/web`.
- The root `package.json` still points to older `admin`, `server`, and `frontend` directories.
- Untracked blog-specific files and directories are present, including `blog-server`, `blog-web`, `Makefile.blog`, and blog Docker configuration.

## Main Platform Track

- `apps/server` is a Spring Boot backend with tracked Java source, migrations, auth, site, template, media, and user modules.
- `apps/server` uses Maven (`pom.xml`), but `README.md` and `Makefile` describe/call Gradle commands.
- `mvn -q -f apps/server/pom.xml -DskipTests package` completed successfully.
- `mvn -q -f apps/server/pom.xml test` failed while downloading `junit-platform-commons` from Maven Central because the remote SSL handshake was terminated.
- `apps/web` is a Next.js app with routes for auth, dashboard, site management, template browsing, and preview.
- `npm run build` in `apps/web` completed successfully.

## Blog Track

- `blog-server` is an untracked Spring Boot/Gradle skeleton with only the application class and configuration.
- `blog-server/gradlew` is not executable and the Gradle wrapper jar is missing, so `bash ./gradlew test` fails with `ClassNotFoundException: org.gradle.wrapper.GradleWrapperMain`.
- `blog-web` is an untracked Next.js skeleton with a simple landing page, API helper, and type definitions.
- `npm run build` in `blog-web` fails because dependencies are not installed and `next` is missing.
- Blog database SQL under `docker/postgres/init` is more complete than the Java implementation, defining admin users, menus, tags, articles, comments, media, and settings.
- `docker/docker-compose.blog.yml` expects `../.env`, while the repository currently has `.env.blog.example`.

## Root/Tooling Mismatches

- Root `package.json` still targets `admin`, `server`, and `frontend`, not the documented `apps/server` and `apps/web` layout.
- `README.md` says Java 21 and Gradle; current backend `pom.xml` targets Java 17 and Maven.
- `Makefile` calls `./gradlew` under `apps/server`, but no `apps/server/gradlew` exists.
- `docker/mysql` exists as tracked files while the current README describes PostgreSQL/Redis.

## Entrypoint Fixes Applied

- Root `package.json` now targets `apps/server` and `apps/web`.
- `Makefile` now uses Maven for backend build/start/migration commands.
- `apps/server/pom.xml` now declares Flyway runtime and Maven plugin support for database migrations.
- `README.md` now reflects Java 17, Maven, npm, and the seeded admin email.

## Requirements Direction

- The product should be a full multi-site website builder platform, not a one-off corporate website.
- The first real site is Shandong Chunchang Food Technology Co., Ltd. corporate website.
- The second real site is the personal blog, implemented after the corporate-site flow is stable.
- Phase one uses form-driven template configuration, not a drag-and-drop editor.
- The corporate-site template focuses on green, healthy, ecological, professional, stable, and approachable branding.
- The corporate-site business goal is lead generation through phone, WeChat, consultation forms, service understanding, cases, recent news, and cooperation opportunities.
- The current requirements baseline is `docs/REQUIREMENTS_PLATFORM_MVP.md`.
- The current development task baseline is `docs/DEVELOPMENT_TASKS_MVP.md`.

## BE-001 Findings

- Existing V1 schema already had `users`, `templates`, `template_versions`, `sites`, `site_configs`, `builds`, and `media`.
- BE-001 required missing schema pieces: `product_services`, `news`, `leads`, `sites.slug`, `sites.published_at`, `templates.code`, `site_configs.brand_config`, and `site_configs.content_config`.
- Added `apps/server/src/main/resources/db/migration/V3__align_mvp_schema.sql` to preserve Flyway history instead of rewriting V1.
- V3 uses PostgreSQL-compatible constructs including `JSONB`, `ALTER TABLE ... ADD COLUMN IF NOT EXISTS`, `CREATE TABLE IF NOT EXISTS`, and `CREATE INDEX IF NOT EXISTS`.
- V3 adds required lookup indexes for site slug, template code, product services, news, leads, and builds.
- `application-dev.yml` still uses `spring.jpa.hibernate.ddl-auto=update`; this may hide missing Flyway migrations during local development and should be revisited in a later task.

## Open Questions

- Which real logo file should be used for Shandong Chunchang Food Technology Co., Ltd.?
- What are the real phone number, WeChat/QR code, address, and product details?
- The next recommended implementation task is `BE-002: Seed Corporate Template and Default Chunchang Site Data`.

## BE-002 Planning Findings

- V2 already seeded generic `blog-minimal` and `corporate-starter` templates, but those do not use the current required `corporate-site` code.
- V3 added `templates.code`, `sites.slug`, `site_configs.brand_config`, and `site_configs.content_config`, so BE-002 should target those new MVP fields.
- Because V2 may already exist in deployed databases, BE-002 should use a new V4 migration and idempotent upsert-style SQL rather than editing V2.
- Existing JPA entities do not yet expose `templates.code`, `sites.slug`, `site_configs.brand_config`, or `site_configs.content_config`, so V4 can seed the database but later BE/API tasks still need entity and DTO alignment.

## BE-002 Findings

- Added `apps/server/src/main/resources/db/migration/V4__seed_corporate_site.sql` as the seed migration for the first real site.
- V4 uses a PostgreSQL `DO $$` block so it can look up the seeded admin user, template, and site ids before inserting dependent rows.
- V4 keeps seed content conservative:
  - Uses the known company name.
  - Uses the known business direction: 黄油等乳制品相关产品与食品科技服务.
  - Leaves contact and media fields as null until real materials are provided.
  - Adds draft placeholder news only, not public fake news.
- BE-003 now has a concrete schema/API gap to close: the Java entity layer still needs to represent `slug`, `code`, `brandConfig`, and `contentConfig`.

## BE-003 Findings

- The frontend already expects `site.slug`, but the backend `SiteDTO` did not return it before BE-003.
- The frontend create-site flow sends `slug` and `templateId`; backend previously accepted `subdomain` but not `slug`, so create-site could not fully match the MVP URL model.
- Existing backend security required authentication globally, but Site API methods themselves did not check ownership on read; BE-003 adds service-level access checks.
- Existing templates from V2 do not all have `code`, but V4 seeds `corporate-site`; backend now supports resolving templates by either id or code.
- SiteConfig default generation is now done during site creation, but a dedicated SiteConfig API is still needed for dashboard editing.

## DOC-001 Findings

- Current product requirements and task breakdown are already present, but current technical documentation was missing.
- Existing technical docs in `docs/` contain historical stack assumptions, including Vue, NestJS, MySQL, drag-and-drop editing, and one-off CMS structures.
- Developers need a current technical baseline before continuing BE-004 and frontend config editing work.
- Added current docs for architecture, data model, API contracts, and SiteConfig schema.
- `docs/README.md` now distinguishes current MVP baseline documents from historical references.

## DOC-002 Findings

- Keeping obsolete docs as "historical references" still creates risk because developers can follow stale links or outdated examples.
- The current docs directory should prefer a small trusted baseline over a large mixed archive.
- Obsolete Vue/NestJS/MySQL/drag-and-drop documents were deleted after the new MVP requirements and technical baseline were confirmed.
- General references that do not directly conflict, such as `DEV_STANDARDS.md` and `AI_PIPELINE_GUIDE.md`, were kept for now.
