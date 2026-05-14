# Website Builder Platform MVP Technical Architecture

## 1. Status

This is the current technical architecture baseline for the MVP.

It supersedes older documents that mention Vue, NestJS, MySQL, drag-and-drop editing, or a one-off corporate website.

Current active direction:

- Build a multi-site website builder platform.
- Use Shandong Chunchang Food Technology Co., Ltd. as the first real site produced by the platform.
- Use form-driven template configuration in phase one.
- Reserve drag-and-drop editing for a later phase.
- Reserve the personal blog template until the corporate-site flow is stable.

## 2. Active Stack

| Layer | Technology |
| --- | --- |
| Backend | Spring Boot 3 under `apps/server` |
| Backend language | Java 17 |
| Frontend | Next.js 14 under `apps/web` |
| Frontend language | TypeScript |
| Styling | Tailwind CSS |
| State | Zustand |
| Database | PostgreSQL |
| Cache | Redis |
| Migration | Flyway |
| Backend build | Maven |
| Frontend build | npm |

Non-mainline tracks:

- `blog-server` and `blog-web` are not first-phase mainline.
- Older `admin`, `server`, and `frontend` paths are not current entrypoints.
- Old docs that describe Vue, NestJS, MySQL, or drag-and-drop are historical references only.

## 3. Repository Boundaries

Current mainline directories:

```text
apps/server   Spring Boot backend
apps/web      Next.js frontend
docs          Product, technical, and implementation docs
docker        Local infrastructure
```

Current root commands:

```bash
npm run build:server
npm run build:web
npm run build:all
make dev-up
make db-migrate
make db-status
make start
```

## 4. System Shape

```text
Dashboard UI
  Next.js /dashboard/*
        |
        | authenticated REST API
        v
Spring Boot API
  auth, users, templates, sites, site configs, content, leads, builds
        |
        | JPA + Flyway
        v
PostgreSQL

Public Site UI
  Next.js /sites/{slug}/*
        |
        | public REST API
        v
Spring Boot public site APIs
```

Redis is available for cache/rate-limit/session-adjacent needs, but the MVP should not depend on Redis for core persistence.

## 5. Core Runtime Flows

### 5.1 Create Corporate Site

```text
User logs in
-> Dashboard loads published templates
-> User chooses corporate-site
-> User submits name + slug + template id/code
-> Backend validates slug
-> Backend creates Site
-> Backend creates default SiteConfig
-> Dashboard routes to site edit/preview flow
```

Acceptance:

- Invalid slug is rejected.
- Duplicate slug is rejected.
- Site is tied to the selected template.
- Corporate template creates a `CORPORATE` site.
- Default SiteConfig exists immediately after creation.

### 5.2 Edit Site Config

```text
Dashboard opens site config page
-> GET /api/sites/{siteId}/config
-> User edits structured form fields
-> PUT /api/sites/{siteId}/config
-> Backend validates required sections
-> Backend stores JSONB config
-> Preview reads updated config
```

This is the next backend task after BE-003.

### 5.3 Public Corporate Site

```text
Visitor opens /sites/{slug}
-> Frontend fetches public config and enabled content
-> Template renders pages from structured data
-> Visitor clicks phone, WeChat, or message CTA
-> Lead form posts to public lead endpoint
-> Dashboard user processes lead
```

### 5.4 Publish / Build Record

```text
Dashboard user clicks publish
-> Backend creates Build
-> Build strategy returns output URL placeholder
-> Site status updates
-> Build history is visible
```

Phase one records publish/build state. It does not need real OSS/CDN/custom-domain publishing.

## 6. Backend Modules

Current module layout:

```text
com.xiao9.wb.auth
com.xiao9.wb.user
com.xiao9.wb.template
com.xiao9.wb.site
com.xiao9.wb.media
com.xiao9.wb.common
com.xiao9.wb.config
```

Expected phase-one expansion:

```text
com.xiao9.wb.product
com.xiao9.wb.news
com.xiao9.wb.lead
com.xiao9.wb.publicsite
```

Keep ownership clear:

- `template`: reusable template definitions and versions.
- `site`: site instance, site config, build records.
- `product`: product/service content for corporate sites.
- `news`: corporate news and knowledge content.
- `lead`: visitor inquiries and dashboard lead processing.
- `publicsite`: unauthenticated read APIs by site slug.

## 7. Frontend Architecture

Dashboard routes:

```text
/dashboard
/dashboard/sites
/dashboard/sites/new
/dashboard/sites/[id]
/dashboard/sites/[id]/edit
/dashboard/sites/[id]/preview
/dashboard/sites/[id]/builds
/dashboard/templates
/dashboard/leads
```

Public site routes:

```text
/sites/{siteSlug}
/sites/{siteSlug}/products
/sites/{siteSlug}/about
/sites/{siteSlug}/news
/sites/{siteSlug}/news/{newsSlug}
/sites/{siteSlug}/cooperation
/sites/{siteSlug}/contact
```

Frontend principles:

- Dashboard is a work tool: restrained, dense, predictable.
- Public corporate site should express green, healthy, ecological, professional, stable, simple, and approachable branding.
- First-phase editor is forms over structured JSON, not drag-and-drop.
- Public template components must render from API data, not hardcoded Chunchang values.

## 8. Security And Access Rules

Authentication:

- Dashboard and admin APIs require JWT.
- Public site config/content/lead submission APIs do not require JWT.

Roles:

- `ADMIN` can manage all sites and templates.
- `USER` can manage only owned sites.

Site access:

- USER cannot read or edit another user's site.
- ADMIN can read and edit all sites.
- Public endpoints must return only public-safe fields.

## 9. Migration And Persistence Rules

Flyway is the source of schema history.

Current migrations:

- `V1__init_schema.sql`: initial core tables.
- `V2__seed_data.sql`: initial admin and sample templates.
- `V3__align_mvp_schema.sql`: MVP schema alignment.
- `V4__seed_corporate_site.sql`: corporate-site template and Chunchang default data.

Do not rewrite older migrations once they may have run locally.

Use a new migration for schema or seed changes.

Known risk:

- `application-dev.yml` still uses `spring.jpa.hibernate.ddl-auto=update`.
- This can hide missing migrations during local development.
- A later hardening task should move dev toward migration-driven schema management.

## 10. Current Implementation State

Completed:

- Requirements baseline.
- MVP task breakdown.
- Root command alignment to `apps/server` and `apps/web`.
- Flyway support in Maven.
- MVP schema migration.
- Corporate-site seed migration.
- Site API alignment through BE-003.

Next backend task:

- `BE-004: SiteConfig API`

Next documentation refinements:

- Keep this technical baseline in sync when API or schema contracts change.
