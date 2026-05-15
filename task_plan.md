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
13. [complete] BE-004: SiteConfig API for loading and saving corporate-site config.
14. [complete] BE-005: Product Service API.
15. [complete] BE-006: News API.
16. [complete] BE-007: Lead API.
17. [complete] BE-008: Public Site APIs.
18. [complete] FE-PUBLIC-001: Local Chunchang corporate website preview.
19. [complete] FE-LOCALIZE-001: Chinese-language visible product pass.
20. [complete] FE-MANAGE-001: No-login local Chunchang management demo.
21. [complete] FEA-001: Authenticated dashboard content-management page.
22. [complete] FEA-002: Edit existing product services and recent news records.

## Backlog

No active backend API backlog items in the current BE-001 through BE-008 slice.

Recommended next slice:

1. [pending] FEA-003: Real authenticated end-to-end smoke test with Docker database, backend, login, and content APIs.
2. [pending] FEP: Public corporate-site polish with real assets after company materials are available.

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

- Add editable menus/columns and menu-scoped articles. Menus support at most three levels, and non-homepage menus can maintain articles.

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

- `FEA-005`: Render editable menus and menu-scoped articles on the public site routes, including `/sites/{slug}/{menuSlug}` and article detail pages.
- `FEA-006`: Improve menu/article editor ergonomics with reorder controls, clearer tree display, and richer article editing.
