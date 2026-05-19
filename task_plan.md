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

No active run steps are open.

The latest completed run was:

- `OPS-DEMO-004`: Fix start-demo local mode process lifetime and docs.

Next work should be selected from the backlog below or from a new user request.

## Completed Run Ledger

- done: Capture the final product direction in `docs/REQUIREMENTS_PLATFORM_MVP.md`.
- done: Mark the new document as the current requirements baseline in `docs/README.md`.
- done: Split the requirements into executable tasks in `docs/DEVELOPMENT_TASKS_MVP.md`.
- done: Keep audit findings, progress, and Obsidian notes aligned with the accepted direction.
- done: BE-001: Align Flyway migrations with the MVP schema.
- done: BE-002: Seed corporate template and default Chunchang site data.
- done: Verify backend build and migration command expansion after BE-002.
- done: Update progress, findings, and Obsidian notes with BE-002 results.
- done: BE-003: Site API alignment with slug, template code, and default SiteConfig creation.
- done: DOC-001: Create current MVP technical documentation baseline.
- done: DOC-002: Remove obsolete documents after confirming the new MVP requirements and technical baseline.
- done: OPS-001: Configure workday 17:30 commit and push sync.
- done: BE-004: SiteConfig API for loading and saving corporate-site config.
- done: BE-005: Product Service API.
- done: BE-006: News API.
- done: BE-007: Lead API.
- done: BE-008: Public Site APIs.
- done: FE-PUBLIC-001: Local Chunchang corporate website preview.
- done: FE-LOCALIZE-001: Chinese-language visible product pass.
- done: FE-MANAGE-001: No-login local Chunchang management demo.
- done: FEA-001: Authenticated dashboard content-management page.
- done: FEA-002: Edit existing product services and recent news records.
- done: FEA-003: Real authenticated end-to-end smoke test with Docker database, backend, login, and content APIs.
- done: FEA-004: Editable menus and menu-scoped articles.
- done: FEA-004-T: Menu/article service unit tests and requirement sync.
- done: FEA-005: Public menu pages and article detail pages.
- done: FEA-006: Content-management menu/article UX improvements.
- done: FEA-006-P: Admin-to-public preview links for visible menus and published articles.
- done: PUB-001: Publish/build visibility on site detail.
- done: PUB-002: Build history API and compact site-detail history.
- done: READY-001: Launch material readiness checklist.
- done: E2E-REFRESH: Full local Docker/database/backend/frontend smoke test after Docker recovery.
- done: UX-ADMIN-001: Dedicated build-history page.
- done: FEP-001: Public Chunchang corporate-site polish for Chinese local demo.
- done: UX-ADMIN-002: Article editing publish-readiness hints.
- done: DATA-REAL-001: Real-material URL fields for logo, QR code, product images, and article covers.
- done: DOC-ACCEPT-001: Local demo and acceptance guide.
- done: DOC-LAUNCH-001: Final launch checklist for real company materials and approval.
- done: UX-ADMIN-003: Image URL previews for logo, QR code, product images, and article covers.
- done: REQ-MENU-ARTICLE-001: Clarify menu-scoped articles, rich-text editing, and build/preview visibility requirements.
- done: FEA-MENU-ARTICLE-002: Implement leaf-menu-only article workflow, rich-text editing, public menu routing, and backend enforcement.
- done: DOC-ENG-PORTFOLIO-001: Add interview-oriented engineering expansion roadmap.
- done: ENG-DOCKER-001: Dockerize backend and frontend for a full-stack local demo.
- done: SITE-LIFECYCLE-001: Replace site deletion with offline and re-online lifecycle actions.
- done: ENG-CI-001: Add Jenkins pipeline for backend tests, frontend lint/build, packaging, and optional image build.
- done: CMS-MEDIA-001: Fix template center, rich text media insertion, upload URLs, and public media serving.
- done: FEA-007: Replace article physical delete with offline/archive lifecycle behavior.
- done: ENG-K8S-001: Add Kubernetes local/demo deployment manifests and validation docs.
- done: ENG-OBS-001: Add Prometheus metrics and local observability documentation.
- done: ENG-DEMO-001: Add one-command local demo launcher with readiness checks.
- done: DOC-OPS-001: Update the Chinese operation manual for the current local demo and admin workflow.
- done: OPS-DOCKER-001: Make dev helper startup resilient to Docker proxy pull failures.
- done: OPS-DOCKER-002: Align Docker proxy diagnostics with Clash Verge port 7897.
- done: OPS-DOCKER-003: Make base dev startup skip optional Docker helper images cleanly.
- done: OPS-DEMO-004: Fix start-demo local mode process lifetime and docs.

## Backlog

No active backend API backlog items in the current BE-001 through BE-008 slice.

Recommended next slice:

- candidate: FEP-REAL: Public corporate-site polish with real logo, contact details, product photos, certifications, and cases after company materials are available.
- candidate: DATA-REAL: Replace placeholder company materials after the user provides real logo, phone, WeChat, address, product photos, certifications, and cases.
- candidate: ENG-OPS-001: Add optional Apollo, XXL-JOB, alerting, and structured logging slices.

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

Result:

- Added `SiteConfigDTO`.
- Added `UpdateSiteConfigRequest`.
- Added `GET /api/sites/{siteId}/config`.
- Added `PUT /api/sites/{siteId}/config`.
- Reused Site API access rules:
  - ADMIN can read/write all site configs.
  - USER can read/write owned site configs only.
- Added validation for required config sections:
  - `seoConfig.title`
  - `seoConfig.description`
  - `navigationConfig.items`
  - `brandConfig.companyName`
  - `brandConfig.shortName`
  - `brandConfig.businessDirection`
  - `brandConfig.brandWords`
  - `contentConfig.hero`
  - `contentConfig.contact`
  - `contentConfig.about`
  - `contentConfig.cooperation`

Verification:

- `npm run build:server`
- `make -n db-migrate`
- `make -n db-status`

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

## Completed Execution: BE-005

Primary deliverable:

- Add authenticated Product Service API endpoints for managing existing `product_services` records scoped to a site.

Endpoints:

- `GET /api/sites/{siteId}/products`
- `POST /api/sites/{siteId}/products`
- `PUT /api/sites/{siteId}/products/{productId}`
- `DELETE /api/sites/{siteId}/products/{productId}`
- `PATCH /api/sites/{siteId}/products/{productId}/enabled`

Result:

- Added `ProductServiceController`.
- Added `ProductServiceManager`.
- Added `ProductService` JPA entity mapped to the existing `product_services` table.
- Added `ProductServiceRepository`.
- Added product DTOs for response, upsert request, and enabled patch request.
- Reused `SiteService.requireReadableSite` for authenticated site access.
- Enforced product site scope with `findByIdAndSiteId(productId, siteId)` for update, delete, and enabled-state changes.
- Supported optional `enabled=true|false` filtering on list.
- Returned products using repository methods ordered by `sortOrder ASC, createdAt ASC`.
- Applied defaults:
  - `sortOrder = 0`
  - `enabled = true`
- Added focused service tests for listing, filtering, defaults, and cross-site mutation protection.

Verification:

- `mvn test -Dtest=ProductServiceManagerTest` passed.
- `mvn test` still fails on existing `WbApplicationTests.contextLoads` because the test profile lacks datasource/driver configuration.
- Graphify refresh was attempted and remains blocked by `ModuleNotFoundError: No module named 'graphify'`.

## Backlog Next: BE-006

Primary deliverable:

- Add authenticated News API endpoints for managing `news` records scoped to a site.

Expected scope:

- Reuse site access rules.
- Enforce `(newsId, siteId)` scoping for mutations.
- Preserve existing migrations; the `news` table already exists.

Result:

- Added `NewsController`.
- Added `NewsService`.
- Added `News` JPA entity mapped to the existing `news` table.
- Added `NewsRepository`.
- Added news DTOs for response, upsert request, and status patch request.
- Reused `SiteService.requireReadableSite` for authenticated site access.
- Enforced news site scope with `findByIdAndSiteId(newsId, siteId)` for get, update, delete, and status changes.
- Supported optional `status=DRAFT|PUBLISHED|OFFLINE` filtering on list.
- Validated slug format and uniqueness within a site.
- Defaulted new records to `DRAFT` when status is omitted.
- Set `publishedAt` when status becomes `PUBLISHED`; cleared it when status becomes `DRAFT` or `OFFLINE`.
- Added focused service tests for listing, filtering, slug handling, duplicate slug rejection, cross-site mutation protection, and status transitions.

Verification:

- `mvn -f apps/server/pom.xml -Dtest=NewsServiceTest test` passed.
- `npm run build:server` passed.

## Backlog Next: BE-007

Primary deliverable:

- Add Lead API endpoints for public visitor submissions and authenticated dashboard lead management.

Endpoints:

- `POST /api/public/sites/{slug}/leads`
- `GET /api/sites/{siteId}/leads`
- `GET /api/sites/{siteId}/leads/{leadId}`
- `PATCH /api/sites/{siteId}/leads/{leadId}/status`

Result:

- Added `LeadController` for authenticated dashboard lead management.
- Added `PublicLeadController` for public visitor lead submission.
- Added `LeadService`.
- Added `Lead` JPA entity mapped to the existing `leads` table.
- Added `LeadRepository`.
- Added lead DTOs for public submit request, public response, admin response, and status patch request.
- Public submissions resolve sites by slug and create `NEW` leads.
- Public response returns only a lead id and success message.
- Dashboard list supports optional `status=NEW|CONTACTED|CLOSED|INVALID` filtering.
- Dashboard get/status operations reuse `SiteService.requireReadableSite` and fetch records by `(leadId, siteId)`.
- Added focused service tests for public submit, status filtering, cross-site protection, and status updates.
- Opened `/api/public/**` in Spring Security and skipped JWT filtering for that path.

Verification:

- `mvn -f apps/server/pom.xml -Dtest=LeadServiceTest test` passed.
- `npm run build:server` passed.

## Backlog Next: BE-008

Primary deliverable:

- Add Public Site APIs for public-safe config, enabled products, published news, and published news details.

Endpoints:

- `GET /api/public/sites/{slug}/config`
- `GET /api/public/sites/{slug}/products`
- `GET /api/public/sites/{slug}/news`
- `GET /api/public/sites/{slug}/news/{newsSlug}`
- `POST /api/public/sites/{slug}/leads` (implemented in BE-007)

Result:

- Added `PublicSiteController`.
- Added `PublicSiteService`.
- Added public DTOs for site config, product services, and news.
- Added `NewsRepository.findBySiteIdAndSlugAndStatus`.
- Public config returns site identity and public configuration JSON only.
- Public products return enabled products only.
- Public news list returns published news only.
- Public news detail resolves by slug and published status only.
- Offline and error sites return not found from public endpoints.
- Public lead submission remains handled by `PublicLeadController` from BE-007.
- Added focused service tests for public config, enabled products, published news, published news detail, draft rejection, and offline site rejection.

Verification:

- `mvn -f apps/server/pom.xml -Dtest=PublicSiteServiceTest test` passed.
- `npm run build:server` passed.

## Completed Execution: FE-PUBLIC-001

Primary deliverable:

- Make the Shandong Chunchang corporate website visible locally in the browser.

Result:

- Added a public corporate-site page at `/sites/[slug]`.
- Added Chunchang fallback content so `/sites/chunchang` renders even when the backend/database are not running.
- Added public-site frontend types, fallback data, and API helpers.
- Added a lead form component that submits to `POST /api/public/sites/{slug}/leads` when the backend is available.
- Updated the root home page with a direct link to `/sites/chunchang`.
- Added a short API timeout so server-side rendering falls back quickly when `localhost:8080` is unavailable.

Verification:

- `npm run build:web` passed.
- `npm run build:server` passed.
- Local Next.js dev server is running at `http://localhost:3000`.
- `http://localhost:3000/sites/chunchang` returns the Chunchang preview page with fallback data.

## Completed Execution: FE-LOCALIZE-001

Primary deliverable:

- Make the visible web product Chinese-first after the user reported the site still showed English UI.

Result:

- Localized visible auth, dashboard, site, template, preview, loading, and error fallback copy.
- Removed the external Google Fonts dependency from `apps/web/src/app/layout.tsx` so local builds do not block on `fonts.googleapis.com`.
- Kept TypeScript/interface names unchanged where they are internal code, not visible UI.

Verification:

- `npm run build:web` passed after clearing the stale `.next` cache.
- `npm run build:server` passed.
- `http://localhost:3000/` returns HTTP `200`.
- `http://localhost:3000/sites/chunchang` returns HTTP `200`.

## Completed Execution: FE-MANAGE-001

Primary deliverable:

- Add a no-login local management page so the user can see the product shape without needing backend auth or database setup.

Result:

- Added `apps/web/src/app/manage/chunchang/page.tsx`.
- The page shows:
  - site status
  - product service count and table
  - recent news placeholders
  - demo lead follow-up view
  - site config overview
  - missing real company materials checklist
  - direct links to the Chunchang public site and formal dashboard

Verification:

- `http://localhost:3000/manage/chunchang` returns HTTP `200`.
- Page content includes `山东春昌食品科技股份有限公司` and `本地运营管理台`.

## Completed Execution: FEA-001

Primary deliverable:

- Add an authenticated dashboard content-management surface for site config, product services, recent news, and leads.

Result:

- Added content-management frontend types and API helpers:
  - `apps/web/src/lib/content-management/types.ts`
  - `apps/web/src/lib/content-management/api.ts`
- Added authenticated content management page:
  - `apps/web/src/app/dashboard/sites/[id]/content/page.tsx`
- Added entry links from:
  - site detail page
  - site list page
- Added Chinese site-status helpers and fixed status display for backend uppercase enum values:
  - `apps/web/src/lib/site-status.ts`
- Changed shared date formatting to Chinese locale.

Verification:

- `npm run build:web` passed.
- `npm run build:server` passed.
- Restarted Next.js dev server after production build to avoid `.next` cache conflict.
- `http://localhost:3000/dashboard/sites/1/content` returns HTTP `200`.
- `http://localhost:3000/dashboard/sites` returns HTTP `200`.
- `http://localhost:3000/` returns HTTP `200`.
- Graphify refresh was attempted and remains blocked by missing local `graphify` Python package.

## Completed Execution: FEA-002

Primary deliverable:

- Add editing for existing product service and recent news records in the authenticated dashboard content-management page.

Result:

- Product services can now be edited inline:
  - name
  - summary
  - description
  - scenarios
- Recent news can now be edited inline:
  - title
  - slug
  - category
  - summary
  - content
- Inline edit mode supports save and cancel.
- Saves use existing authenticated backend APIs:
  - `PUT /api/sites/{siteId}/products/{productId}`
  - `PUT /api/sites/{siteId}/news/{newsId}`
- Existing status values are preserved when editing records.

Verification:

- `npm run build:web` passed.
- `npm run build:server` passed.
- Restarted Next.js dev server after production build to avoid `.next` cache conflict.
- `http://localhost:3000/dashboard/sites/1/content` returns HTTP `200`.
- `http://localhost:3000/` returns HTTP `200`.
- Graphify refresh was attempted and remains blocked by missing local `graphify` Python package.

## Completed Execution: FEA-003

Primary deliverable:

- Start the full local service stack and run a real authenticated end-to-end smoke test against Docker PostgreSQL, Redis, Spring Boot, and Next.js.

Result:

- Started project Docker services through the standard `make dev-up` path:
  - `wb-postgres` on `localhost:5432`
  - `wb-redis` on `localhost:6379`
- Ran Flyway migrations against the compose-managed database.
- Started Spring Boot backend on `http://localhost:8080`.
- Restarted Next.js frontend on `http://localhost:3000` after clearing `.next`.
- Fixed default admin seed password so `admin@xiao9.com / admin123` works on fresh databases.
- Fixed Chunchang seed navigation config shape from JSON array to `{ "items": [...] }`, matching the backend `Map<String, Object>` entity and validator.
- Adjusted the base Docker compose images to local-stable versions:
  - `postgres:15-alpine`
  - `redis:6-alpine`

Verification:

- `npm run build:server` passed.
- `npm run build:web` passed.
- Login API returns success and an access token for `admin@xiao9.com / admin123`.
- Final smoke test returned HTTP `200` for:
  - `http://localhost:3000/`
  - `http://localhost:3000/sites/chunchang`
  - `http://localhost:3000/manage/chunchang`
  - `http://localhost:3000/dashboard/sites/1/content`
  - `http://localhost:8080/api/public/sites/chunchang/config`
  - `http://localhost:8080/api/public/sites/chunchang/products`
  - `http://localhost:8080/api/public/sites/chunchang/news`
  - `http://localhost:8080/api/sites/1/config`
  - `http://localhost:8080/api/sites/1/products`
  - `http://localhost:8080/api/sites/1/leads`
- Docker health checks confirmed:
  - Postgres accepts connections.
  - Redis returns `PONG`.

Recommended next slice:

- `FEA-004`: Improve the authenticated dashboard UX around login persistence, first-run guidance, and direct navigation from the public Chunchang site to the admin content workflow.
- `FEP`: Public corporate-site polish with real logo, phone, WeChat, address, product photos, certifications, and case materials after the company assets are available.

## Completed Hotfix: Admin Login Token Handling

Primary deliverable:

- Fix the browser login flow so the authenticated dashboard can be entered with the live backend token response.

Result:

- Updated frontend auth response typing to match the backend snake_case token contract.
- Updated the auth store to persist `access_token` instead of the obsolete `token` field.
- Added a minimal local user fallback because the backend token response does not currently include a user object.

Verification:

- `npm run build:web` passed.
- Restarted Next.js dev server after clearing `.next`.
- Login API returns code `200` and token present.
- Authenticated API calls returned HTTP `200` for:
  - `/api/sites`
  - `/api/sites/1/config`
  - `/api/sites/1/products`
  - `/api/sites/1/leads`
- Frontend login and dashboard content pages return HTTP `200`.

## Completed Hotfix: Dashboard Sites Pagination Handling

Primary deliverable:

- Fix `TypeError: sites.map is not a function` on the dashboard page.

Result:

- Updated `apps/web/src/stores/siteStore.ts`.
- `fetchSites()` now normalizes both supported shapes:
  - legacy array response: `Site[]`
  - backend paginated response: `{ content: Site[] }`
- Dashboard pages now receive an array in store state before calling `.map()`.

Verification:

- `npm run build:web` passed.
- Restarted Next.js dev server after clearing `.next`.
- `http://localhost:3000/dashboard` returns HTTP `200`.
- `http://localhost:3000/dashboard/sites` returns HTTP `200`.

## Completed Execution: FEA-004

Primary deliverable:

- Add editable menus/columns and menu-scoped articles. Menus support at most three levels and can be nested under any valid parent; articles can only be maintained under leaf, non-homepage menus.

Result:

- Added database migration:
  - `apps/server/src/main/resources/db/migration/V5__menus_and_articles.sql`
- Added backend menu module:
  - `apps/server/src/main/java/com/xiao9/wb/menu/entity/SiteMenu.java`
  - `apps/server/src/main/java/com/xiao9/wb/menu/repository/SiteMenuRepository.java`
  - `apps/server/src/main/java/com/xiao9/wb/menu/dto/SiteMenuDTO.java`
  - `apps/server/src/main/java/com/xiao9/wb/menu/dto/UpsertSiteMenuRequest.java`
  - `apps/server/src/main/java/com/xiao9/wb/menu/service/SiteMenuService.java`
  - `apps/server/src/main/java/com/xiao9/wb/menu/controller/SiteMenuController.java`
- Extended article/news backend:
  - `news.menu_id`
  - `News.menu`
  - `NewsDTO.menuId`
  - `UpsertNewsRequest.menuId`
  - optional `menuId` filtering on `GET /api/sites/{siteId}/news`
- Extended authenticated content-management frontend:
  - added `菜单栏目` tab
  - can create first-level, second-level, and third-level menus
  - can edit menu label, slug, parent, sort, and visibility
  - homepage is visible as a system menu and cannot be deleted
  - news/articles can be assigned to a selected menu
  - article list shows assigned menu
- Updated requirements and API docs for menus and menu-scoped articles.

Verification:

- `npm run build:server` passed.
- `npm run build:web` passed.
- `make db-migrate` applied V5 successfully.
- Restarted backend and frontend dev servers.
- API smoke verified:
  - `GET /api/sites/1/menus` -> HTTP `200`
  - creating first-level menu succeeded
  - creating second-level menu succeeded
  - creating third-level menu succeeded
  - creating fourth-level menu returned HTTP `400`
  - creating article with `menuId` succeeded
- `http://localhost:3000/dashboard/sites/1/content` returns HTTP `200`.

Recommended next slice:

- `FEA-007`: Replace article delete with offline/archive if the product rule should match site lifecycle.
- `FEA-008`: Improve menu/article editor ergonomics with reorder controls, clearer tree display, and a later TipTap-based rich text editor if interview polish is desired.
- `OPS-002`: Fix Docker registry/proxy access, then verify full image build and `make docker-demo-up`.

## Completed Execution: CMS-MEDIA-001

Primary deliverable:

- Fix template center error and close the rich text + media upload URL loop.

Result:

- Template center now accepts backend paginated template responses and derives categories locally.
- Dashboard can upload images for Logo, WeChat QR code, product image, and article cover; uploaded URLs are filled into the corresponding URL fields.
- Article rich text now supports heading, paragraph, lists, quote, divider, clear format, links, image URL insertion, image upload insertion, video URL insertion, and video upload insertion.
- Rich text toolbar now preserves selection on toolbar interaction so buttons respond more reliably.
- Backend serves uploaded files publicly under `/uploads/**`.
- Backend upload storage uses normalized absolute paths so Tomcat no longer writes relative paths under its temporary directory.
- Public article pages sanitize and render safe links, images, videos, quotes, and dividers.

URL rule:

- The image/video URL comes from `POST /api/media/upload`.
- The response field is `data.url`.
- Local example: `http://localhost:8080/uploads/{filename}`.

Verification:

- `mvn -f apps/server/pom.xml test` passed with 58 tests.
- `npm run lint:web` passed.
- `npm run build:web` passed.
- Upload smoke returned HTTP 200 and media URL readback returned HTTP 200.
- `/dashboard/templates` returned HTTP 200.
- `/dashboard/sites/1/content` returned HTTP 200.

## Completed Execution: FEA-007

Primary deliverable:

- Replace article physical delete with offline lifecycle behavior.

Result:

- The existing `DELETE /api/sites/{siteId}/news/{newsId}` endpoint is retained for backward compatibility, but now sets article status to `OFFLINE` and clears `publishedAt`.
- Backend no longer physically deletes articles through the dashboard delete path.
- Dashboard article action text changed from `删除` to `下线`.
- Offline articles remain in the dashboard and can be published again later.

Verification:

- Added `NewsServiceTest.deleteOfflineArticleInsteadOfPhysicallyDeletingIt`.
- Focused red/green test passed after implementation.

## Completed Execution: ENG-K8S-001

Primary deliverable:

- Add Kubernetes local/demo deployment manifests and validation docs.

Result:

- Added `deploy/k8s/` manifests for namespace, runtime config, secret example, backend app, frontend app, service discovery, and ingress routing.
- Added `deploy/k8s/kustomization.yaml` for one-command rendering.
- Added `deploy/k8s/README.md` with local image, Kind, validation, apply, routing, and security notes.
- Added `make k8s-validate`.
- Updated `docs/ENGINEERING_PORTFOLIO_ROADMAP.md`.

Verification:

- `make k8s-validate` passed using local `kubectl kustomize deploy/k8s` rendering.

Notes:

- `kubectl apply --dry-run=client` was not suitable on this machine because Docker Desktop Kubernetes is not running and kubectl still attempted API resource discovery.

## Completed Execution: ENG-OBS-001

Primary deliverable:

- Add a small local observability layer for backend health and Prometheus metrics.

Result:

- Added `micrometer-registry-prometheus` to the backend.
- Exposed `/actuator/prometheus` through Spring Boot Actuator.
- Added a stable `application` metrics tag.
- Added Prometheus to `docker/docker-compose.full.yml`.
- Added `docker/prometheus/prometheus.yml` to scrape `server:8080/actuator/prometheus`.
- Added Grafana to `docker/docker-compose.full.yml`.
- Added a provisioned Grafana Prometheus data source and `Website Builder Overview` dashboard.
- Added `make docker-demo-config`.
- Added `docs/OBSERVABILITY_LOCAL_DEMO.md`.
- Updated Docker demo docs and engineering roadmap.

Verification:

- `mvn -f apps/server/pom.xml test` passed with 59 tests.
- `npm run lint:web` passed.
- `make docker-demo-config` passed.
- `make k8s-validate` passed.
- Graphify rebuild was attempted but remains blocked by `ModuleNotFoundError: No module named 'graphify'`.

## Completed Execution: ENG-DEMO-001

Primary deliverable:

- Add a one-command local demo startup script for the full Docker stack.

Result:

- Added `start-demo.sh` at the repository root.
- Added `make demo` as the friendly Makefile entrypoint.
- Script validates Docker, Docker Compose v2, and Docker daemon availability.
- Script validates the full Docker Compose config before startup.
- Script starts the full local stack and waits for backend, frontend, Prometheus, and Grafana readiness.
- Script prints all local URLs and dashboard/Grafana credentials.
- Script supports:
  - `--reset`
  - `--no-build`
  - `--open`
- Script diagnoses the known Docker proxy failure where Docker points at `127.0.0.1:7890` but that proxy is not running.
- Updated `docs/DOCKER_LOCAL_DEMO.md`.

Verification:

- `bash -n start-demo.sh` passed.
- `./start-demo.sh --help` passed.
- `make docker-demo-config` passed.
- Full startup was attempted with `./start-demo.sh --no-build`, but Docker image pull failed because Docker is configured to use an unavailable local proxy at `127.0.0.1:7890`.
- Graphify rebuild was attempted but remains blocked by `ModuleNotFoundError: No module named 'graphify'`.

## Completed Execution: DOC-OPS-001

Primary deliverable:

- Refresh the Chinese operation manual so it matches the current product, Docker demo, and admin workflow.

Result:

- Replaced the outdated `使用说明.md` content that still described the old page/component editor flow.
- Documented one-command startup through `./start-demo.sh` and `make demo`.
- Documented local URLs, dashboard credentials, Grafana credentials, stop/reset/log commands, and Docker proxy troubleshooting.
- Documented current admin workflows:
  - site config
  - media upload
  - product services
  - menu columns
  - leaf-menu-only articles
  - rich text editing
  - preview
  - leads
  - build history
- Added interview demo suggestions and links to related docs.
- Updated `docs/README.md` to link to the operation manual.

Verification:

- Confirmed `使用说明.md` exists and contains the refreshed current workflow.
- Searched the operation manual for old page/component editor wording; no stale matches remain in `使用说明.md`.
- `bash -n start-demo.sh` passed.
- `make docker-demo-config` passed.
- Graphify rebuild was attempted but remains blocked by `ModuleNotFoundError: No module named 'graphify'`.

## Completed Execution: OPS-DOCKER-001

Primary deliverable:

- Fix the local `pgAdmin` / `Redis Commander` startup failure caused by Docker proxy pull errors.

Result:

- Added `scripts/dev-up-full.sh`.
- Changed `make dev-up-full` to start required base services first:
  - PostgreSQL
  - Redis
- `make dev-up-full` then attempts optional dev tools:
  - pgAdmin
  - Redis Commander
- If optional dev-tool image pulls fail because Docker is using an unavailable proxy such as `127.0.0.1:7890`, the script now warns and keeps the base services running instead of failing the whole local development startup.
- Added `scripts/docker-proxy-doctor.sh`.
- Added `make docker-proxy-doctor` for Docker proxy/registry diagnosis.
- Updated `docs/DOCKER_LOCAL_DEMO.md` and `使用说明.md`.

Verification:

- `bash -n scripts/dev-up-full.sh scripts/docker-proxy-doctor.sh start-demo.sh` passed.
- `docker compose -f docker/docker-compose.yml -f docker/docker-compose.dev.yml config` passed.
- `make dev-up-full` now exits successfully even when optional pgAdmin / Redis Commander image pulls fail due the unavailable `127.0.0.1:7890` proxy.
- Confirmed required base containers are healthy:
  - `wb-postgres`
  - `wb-redis`
- `make docker-proxy-doctor` correctly reports that `127.0.0.1:7890` is unreachable and Docker registry pull still fails until the local proxy/Docker Desktop proxy config is fixed.

## Completed Execution: OPS-DOCKER-002

Primary deliverable:

- Align Docker proxy scripts and docs with the actual Clash Verge proxy port `7897`.

Result:

- Updated `scripts/docker-proxy-doctor.sh` to check `127.0.0.1:7897` by default.
- Kept compatibility with old error detection for Docker output that still mentions `127.0.0.1:7890`.
- Updated `scripts/dev-up-full.sh` and `start-demo.sh` warnings to tell the user Docker Desktop may still point to the old `7890` port.
- Documented recommended Docker Desktop proxy values:
  - `http://host.docker.internal:7897`
  - fallback: `http://127.0.0.1:7897`
- Updated Docker demo docs, Jenkins docs, and Chinese operation manual.

Verification:

- `bash -n scripts/docker-proxy-doctor.sh scripts/dev-up-full.sh start-demo.sh` passed.
- `make docker-proxy-doctor` now checks `127.0.0.1:7897` and confirms the Clash Verge port is reachable.
- `make docker-proxy-doctor` still reports Docker registry pull failure because Docker Desktop is still routing registry traffic to old `127.0.0.1:7890`.
- Next manual action: update Docker Desktop proxy settings to `http://host.docker.internal:7897` or `http://127.0.0.1:7897`, then restart Docker Desktop.

## Completed Execution: OPS-DOCKER-003

Primary deliverable:

- Make the normal local development startup avoid optional Docker helper image pulls while Docker Desktop proxy is still misconfigured.

Result:

- Changed `make dev-up` to call `scripts/dev-up-full.sh` with `SKIP_DEV_TOOLS=1`.
- `make dev-up` now starts only PostgreSQL and Redis and skips pgAdmin / Redis Commander.
- Added `make dev-up-tools` to retry only optional helper tools after Docker Desktop proxy is fixed.
- Avoided `--remove-orphans` because it can remove unrelated local compose containers.
- Used `COMPOSE_IGNORE_ORPHANS=True` to suppress orphan warnings without destructive cleanup.
- Updated Docker local demo docs and Chinese operation manual.

Verification:

- `bash -n scripts/dev-up-full.sh` passed.
- `make dev-up` passed.
- `make dev-up` output confirms:
  - `wb-postgres` running
  - `wb-redis` running
  - optional dev tools skipped

## Completed Execution: OPS-DEMO-004

Primary deliverable:

- Fix `start-demo.sh` so the default startup path works while Docker image pulling is still blocked by proxy settings.

Result:

- Changed `start-demo.sh` default mode to local development startup:
  - Docker starts PostgreSQL and Redis.
  - Maven starts the backend locally.
  - Next.js starts the frontend locally.
- Moved full Docker startup behind explicit `--docker`.
- Added `--stop` for local process cleanup.
- Added `.run/` to `.gitignore` for local logs and pid files.
- Fixed the local-mode control flow so the script stays in the foreground by default.
- Added `--detach` as an explicit opt-in, with foreground mode recommended.
- Updated Docker local demo docs and Chinese operation manual.

Verification:

- `bash -n start-demo.sh` passed.
- `./start-demo.sh --help` passed.
- `./start-demo.sh` passed in foreground mode and printed the keep-terminal-open message.
- HTTP smoke passed while the script was running:
  - `/sites/chunchang` -> 200
  - `/dashboard` -> 200
  - `/login` -> 200
  - `/actuator/health` -> 200
- `./start-demo.sh --stop` stops local backend/frontend processes.
