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

## BE-004 Findings

- BE-003 already created default SiteConfig during site creation, so BE-004 could focus on read/update endpoints rather than migration work.
- `SiteConfig.navigationConfig` remains a map/object shape; API validation expects `navigationConfig.items`.
- Backend should allow nullable real-world materials such as logo, QR code, phone, WeChat, and address, but must validate structural sections needed by the template.
- Java pattern variables share method scope in the relevant compiler mode; avoid reusing the same pattern variable name in one method.

## BE-005 Findings

- The `product_services` table already exists in `V3__align_mvp_schema.sql`; no migration is needed for BE-005.
- Existing backend patterns use Spring Boot, Spring MVC controllers, JPA repositories, Lombok entities, record DTOs, and `ApiResponse`.
- `SiteService.requireReadableSite` is public and sufficient for the requested current owner/admin dashboard permission model.
- Site scoping should be enforced both through readable-site authorization and through product lookup by `(productId, siteId)`.
- Hibernate JSONB support is already used in `SiteConfig` via `@JdbcTypeCode(SqlTypes.JSON)`, so `product_services.scenarios` can reuse the same mapping style.
- Because the table and migration call the domain concept `product_services`, the Java entity was named `ProductService`; the Spring service class was named `ProductServiceManager` to avoid a class-name collision.
- Full application context tests are still blocked by missing test datasource configuration.
- Graphify remains unavailable in the local Python environment.

## BE-006 Findings

- The `news` table already exists in `V3__align_mvp_schema.sql`; no migration is needed for BE-006.
- The database already enforces `UNIQUE(site_id, slug)`, but the service should still validate duplicate slugs to return a clear business error before hitting the database constraint.
- Admin News API can follow the BE-005 module pattern: entity, repository, record DTOs, service, controller, and focused service tests.
- Site access should be checked through `SiteService.requireReadableSite`, then individual records should be fetched with `(newsId, siteId)` for get/update/delete/status operations.
- Public visibility rules are documented for BE-008; BE-006 should still support status filtering so the dashboard can manage draft, published, and offline records.
- Status transitions need explicit `publishedAt` behavior:
  - `PUBLISHED` sets `publishedAt` if missing.
  - `DRAFT` and `OFFLINE` clear `publishedAt`.
- Full application context tests remain blocked by missing test datasource configuration.
- Graphify remains unavailable in the local Python environment.

## BE-007 Findings

- The `leads` table already exists in `V3__align_mvp_schema.sql`; no migration is needed for BE-007.
- `SecurityConfig` did not previously permit `/api/public/**`, so public lead submission required a small security change in addition to the lead module.
- `JwtAuthFilter.shouldNotFilter` also needed to skip `/api/public/**`; otherwise public requests without tokens pass through but public requests with malformed auth headers could be unnecessarily parsed.
- Public lead submission resolves the target site by `sites.slug`.
- Public lead response should not expose admin fields such as phone, message, status, or timestamps.
- Dashboard lead management follows the same site-scoping pattern as products and news:
  - authorize site access with `SiteService.requireReadableSite`
  - fetch individual records by `(leadId, siteId)`
- Lead status values are already constrained in the database: `NEW`, `CONTACTED`, `CLOSED`, `INVALID`.
- Full application context tests remain blocked by missing test datasource configuration.
- Graphify remains unavailable in the local Python environment.

## BE-008 Findings

- Public Site APIs can reuse the existing V3/V4 schema and BE-004 through BE-007 modules; no migration is needed.
- Public responses should use dedicated DTOs rather than admin DTOs to avoid exposing owner/admin/build fields.
- Public site lookup should resolve by `sites.slug`.
- Public endpoints should reject `OFFLINE` and `ERROR` sites as not found.
- Phase-one public config can return the public-facing JSONB blocks: SEO, theme, navigation, custom, brand, and content config.
- Public products should query `product_services` with `enabled = true`.
- Public news list should query `news` with `status = PUBLISHED`.
- Public news detail needs an additional repository method: lookup by `(siteId, slug, PUBLISHED)`.
- Public lead submission was already implemented in BE-007; BE-008 keeps that endpoint as part of the public surface.
- Full application context tests remain blocked by missing test datasource configuration.
- Graphify remains unavailable in the local Python environment.

## FE-PUBLIC-001 Findings

- The fastest path to local visual proof is a public frontend page at `/sites/chunchang`, not admin CRUD first.
- The backend and database may not be running during visual review, so the public frontend needs fallback data for the first local preview.
- Server-side fetch to `localhost:8080` can hang long enough to make local preview feel broken; a short fetch timeout is needed before falling back.
- The page should avoid fabricated company facts and keep placeholder content explicit for phone, WeChat, address, product specs, certifications, production capacity, and customer cases.
- The existing root landing page should link directly to the Chunchang preview so the user can find it without remembering the route.
- `npm run build:web` confirms the new dynamic route `/sites/[slug]` compiles successfully.

## FE-LOCALIZE-001 Findings

- The product needed a Chinese-first pass beyond the Chunchang public page; root, auth, dashboard, template, site, preview, loading, and error surfaces could still expose English.
- Some English matches are internal code identifiers (`Template`, `Loading`, `Dashboard`, `LoginData`) and should not be renamed as part of UI localization.
- Running `next dev` and `next build` concurrently can corrupt or race on `.next` output and cause transient local 500 errors. Stop dev or clear `.next` before production builds when needed.
- `next/font/google` made the production build depend on access to `fonts.googleapis.com`; removing the Google font is better for a Chinese local MVP and makes builds deterministic.
- A no-login management demo is useful because the formal dashboard depends on auth/backend/database, while the user needs a visible product immediately.

## FE-MANAGE-001 Findings

- The no-login `/manage/chunchang` page should be treated as a local demo surface, not the final authenticated admin implementation.
- The demo page should continue to avoid fabricated company facts and should explicitly list missing real materials.
- The most useful local acceptance loop is:
  - homepage -> public Chunchang site
  - homepage -> Chunchang management demo
  - management demo -> public Chunchang site

## FEA-001 Findings

- The backend content APIs from BE-004 through BE-008 were already present; the missing piece was a frontend dashboard surface that calls them.
- The first authenticated content-management slice should prioritize a working path over exhaustive editing:
  - save key SiteConfig fields
  - create/toggle/delete product services
  - create/publish/offline/delete news
  - view and update lead status
- Existing frontend site status handling expected lowercase values such as `published` and `draft`, while backend `SiteDTO` returns uppercase enum names such as `PUBLISHED` and `DRAFT`; status display and publish checks needed compatibility helpers.
- `formatDate()` still used `en-US`; switching to `zh-CN` prevents English month names from appearing in the Chinese UI.
- Running `next build` while `next dev` is serving the same `.next` directory repeatedly caused missing chunk errors; restart dev server and clear `.next` after production builds during local verification.
- Graphify remains unavailable in the local Python environment, so graph refresh cannot complete until the package is installed.

## FEA-002 Findings

- Existing BE-005 and BE-006 backend APIs already support full update for product services and news; no backend change was needed for inline editing.
- Inline list editing is enough for this MVP stage and avoids adding modal complexity before the data model stabilizes.
- Product editing must preserve `enabled`, `sortOrder`, and `imageUrl`; otherwise saving text fields could accidentally change visibility or ordering.
- News editing must preserve `status` and `coverImage`; publishing and offline state remain controlled by the explicit status action.
- The next meaningful verification step is a real authenticated end-to-end run with Docker database, migrations, backend login, and live content API calls.

## FEA-003 Findings

- The existing Docker stack on the machine has unrelated containers under the same compose project namespace; do not use `--remove-orphans` automatically because those services may belong to another local app.
- Ports `8080`, `5432`, and `6379` were free; port `3000` already had a Next dev server for this project.
- Pulling `postgres:16-alpine` and `redis:7-alpine` stalled locally, while `postgres:15-alpine` and `redis:6-alpine` were already available and sufficient for this MVP; the compose file now uses those local-stable images.
- The seed hash in `V2__seed_data.sql` was annotated as `admin123`, but did not authenticate as `admin123`; regenerate the bcrypt hash whenever changing documented default credentials.
- The login response uses snake_case token fields:
  - `access_token`
  - `refresh_token`
  - `token_type`
  - `expires_in`
- `site_configs.navigation_config` is mapped as `Map<String, Object>`, so seed data must use an object. A top-level JSON array causes Hibernate JSON deserialization to fail before service code can run.
- The frontend public-site type already expects `navigationConfig.items`, so `{ "items": [...] }` is also the right API contract shape.
- Running `next build` while `next dev` is active can cause local dev routes to return `500`; clear `apps/web/.next` and restart `npm run dev:web` after production builds.
- Final local acceptance currently depends on three running pieces:
  - compose services from `make dev-up`
  - backend from `npm run dev:server`
  - frontend from `npm run dev:web`

## Login Blocker Findings

- Backend auth responses use snake_case token fields because `TokenResponse` annotates record fields with `@JsonProperty`:
  - `access_token`
  - `refresh_token`
  - `token_type`
  - `expires_in`
- The current backend token response does not include a `user` object.
- Frontend auth code must not assume `response.token` or `response.user` unless the backend contract is changed.
- For now, the frontend can safely store `access_token` and derive a minimal local user identity from the submitted login/register form.
- A future cleanup option is to add a `/api/auth/me` endpoint or include user summary data in `TokenResponse`, then replace the frontend fallback user.

## Dashboard Sites Runtime Findings

- The backend site list contract is paginated:
  - `PageResponse<SiteDTO>`
  - useful array is under `data.content`
- Frontend pages should not assume `api.get("/sites")` returns `Site[]`.
- The correct normalization boundary is the shared store/API layer, not individual React pages, because both `/dashboard` and `/dashboard/sites` consume the same `sites` state.
- The store now supports both old array-shaped responses and current page-shaped responses, which keeps compatibility if mock/fallback callers ever return arrays.

## FEA-004 Menu And Article Findings

- The original MVP only had site config navigation JSON and a flat `news` table. That was insufficient for a real CMS because menus/columns need their own editable model.
- `SiteConfig.navigationConfig` is useful for rendered navigation, but it should not be the only source of truth for editable menu management.
- A separate `site_menus` table is needed so menus can have:
  - stable IDs
  - parent-child hierarchy
  - visibility
  - sort order
  - deletion/update rules
- The first usable model is:
  - `site_menus` for navigation/columns
  - `news.menu_id` for articles under menus
- The "homepage" should be a protected system menu:
  - visible in menu management
  - not deletable
  - not assignable as ordinary article column in the frontend
- Three-level validation should be enforced by backend service, not only frontend UI.
- Menu hierarchy validation also needs backend cycle protection: a menu cannot be moved under itself or under any descendant menu.
- Re-parenting a menu with existing descendants needs subtree validation, because moving a three-level subtree under another parent can create an implicit fourth level without creating a new menu.
- The requirement "homepage cannot be assigned as a normal article column" must be enforced in `NewsService`, not only hidden in the frontend selector.
- A menu with child menus should not be deleted before children are removed; this keeps the hierarchy explicit and avoids surprising cascade deletions in the admin UI.
- A menu without child menus can be deleted even if articles are assigned to it; database `ON DELETE SET NULL` keeps articles and clears their menu assignment.
- This slice adds admin-side menu/article maintenance; public route rendering for arbitrary menu slugs is still a separate required slice.
