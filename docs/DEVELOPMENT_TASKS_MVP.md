# Website Builder Platform MVP Development Tasks

This task list implements the current requirements baseline:

- `docs/REQUIREMENTS_PLATFORM_MVP.md`

The active product direction is a full multi-site website builder platform. The first real site is the Shandong Chunchang Food Technology Co., Ltd. corporate website. The personal blog is reserved until the corporate-site flow is stable.

## 1. Delivery Rules

### Current Stack

- Backend: Spring Boot under `apps/server`
- Frontend: Next.js under `apps/web`
- Database: PostgreSQL
- Cache: Redis
- Build tools: Maven and npm

### Phase-One Principle

Build the platform path, not a one-off corporate website.

All Chunchang content must be default seed/config data for the `corporate-site` template. Reusable template components must receive data through props or API responses.

### Done Means

A task is done only when:

- Code is implemented.
- The relevant build passes.
- Data validation is covered where applicable.
- User-facing empty, loading, success, and error states are handled.
- The task acceptance checks pass.

### Out of Scope

Do not implement these during phase one:

- Drag-and-drop editor.
- Real OSS/CDN publishing.
- Custom domain verification.
- Multi-language.
- Team collaboration.
- Shopping cart or payment.
- Complex CRM.
- AI-generated content.

## 2. Milestones

### M1: Platform Skeleton and Corporate Preview

Goal:

Users can create a corporate-site site, edit core config, and preview the corporate homepage.

### M2: Lead Generation

Goal:

Visitors can submit inquiries, and dashboard users can process them.

### M3: Product Services

Goal:

Dashboard users can manage products/services, and public pages can display enabled items.

### M4: News

Goal:

Dashboard users can manage company news, product knowledge, and industry information.

### M5: Build Records

Goal:

The platform has a publish action and build history.

### M6: Personal Blog Planning

Goal:

Start blog implementation only after M1-M5 are stable.

## 3. Backend Tasks

### BE-001: Align Database Migrations With MVP Schema

Owner:

Backend

Depends on:

None

Work:

- Review existing migrations under `apps/server/src/main/resources/db/migration`.
- Add missing tables or columns required by the MVP requirements.
- Ensure these MVP entities are represented:
  - `sites`
  - `templates`
  - `template_versions`
  - `site_configs`
  - `product_services`
  - `news`
  - `leads`
  - `builds`
- Preserve existing compatible tables when possible.
- Add indexes for common lookups:
  - site owner
  - site slug
  - template code
  - product site/status/sort
  - news site/status/slug
  - lead site/status/created time
  - build site/created time

Acceptance:

- `make db-migrate` can create a fresh database schema after PostgreSQL is running.
- Existing seed data still inserts successfully or is replaced by valid MVP seed data.
- No table relies on MySQL-specific syntax.

### BE-002: Seed Corporate Template and Default Chunchang Site Data

Owner:

Backend

Depends on:

BE-001

Work:

- Seed `corporate-site` template.
- Seed a template version with the corporate-site schema.
- Seed default Chunchang SiteConfig values from `docs/REQUIREMENTS_PLATFORM_MVP.md`.
- Seed default product services:
  - 黄油产品
  - 乳制品原料
  - 企业采购服务
  - 渠道合作
- Seed default news placeholders only when no real news exists.

Acceptance:

- New corporate sites can be created with complete default config.
- Seed content does not invent unverified facts such as founding year, certificates, production capacity, or customer names.

### BE-003: Site API

Owner:

Backend

Depends on:

BE-001, BE-002

Endpoints:

```text
GET /api/sites
POST /api/sites
GET /api/sites/{siteId}
PUT /api/sites/{siteId}
DELETE /api/sites/{siteId}
```

Work:

- Implement site list, detail, create, update, and delete.
- Validate slug format.
- Ensure slug uniqueness.
- On create, bind selected template and create default SiteConfig.
- Restrict USER access to owned sites.
- Allow ADMIN access to all sites.

Acceptance:

- Creating a site with template `corporate-site` creates both `Site` and `SiteConfig`.
- Invalid slugs are rejected.
- Duplicate slugs are rejected.
- USER cannot edit another user's site.

### BE-004: SiteConfig API

Owner:

Backend

Depends on:

BE-003

Endpoints:

```text
GET /api/sites/{siteId}/config
PUT /api/sites/{siteId}/config
```

Work:

- Implement retrieval and update of site config.
- Store structured config in existing JSONB-compatible fields or the agreed schema.
- Validate required config sections:
  - brand
  - hero
  - contact
  - about
  - cooperation
  - seo
- Do not allow public-only updates without authentication.

Acceptance:

- Dashboard can load and save Chunchang corporate config.
- Missing required config sections are rejected or filled with defaults.
- Saved config is returned consistently.

### BE-005: Product Service API

Owner:

Backend

Depends on:

BE-003

Endpoints:

```text
GET /api/sites/{siteId}/products
POST /api/sites/{siteId}/products
PUT /api/sites/{siteId}/products/{productId}
DELETE /api/sites/{siteId}/products/{productId}
PATCH /api/sites/{siteId}/products/{productId}/enabled
```

Work:

- Implement CRUD for product/service items.
- Support enabled filtering.
- Support sort order.
- Validate required name and summary.
- Keep records scoped to site.

Acceptance:

- Dashboard can create, edit, delete, enable, disable, and sort product services.
- Public API returns enabled products only.
- Product from another site cannot be edited through the wrong site path.

### BE-006: News API

Owner:

Backend

Depends on:

BE-003

Endpoints:

```text
GET /api/sites/{siteId}/news
POST /api/sites/{siteId}/news
GET /api/sites/{siteId}/news/{newsId}
PUT /api/sites/{siteId}/news/{newsId}
DELETE /api/sites/{siteId}/news/{newsId}
PATCH /api/sites/{siteId}/news/{newsId}/status
```

Work:

- Implement CRUD for news.
- Support categories:
  - 公司动态
  - 产品知识
  - 行业资讯
- Support statuses:
  - Draft
  - Published
  - Offline
- Validate slug uniqueness within a site.

Acceptance:

- Draft news is not returned by public list.
- Published news is accessible by slug.
- Offline news is hidden from public pages.

### BE-007: Lead API

Owner:

Backend

Depends on:

BE-003

Admin endpoints:

```text
GET /api/sites/{siteId}/leads
GET /api/sites/{siteId}/leads/{leadId}
PATCH /api/sites/{siteId}/leads/{leadId}/status
```

Public endpoint:

```text
POST /api/public/sites/{slug}/leads
```

Work:

- Implement public lead submission.
- Implement dashboard lead list/detail/status updates.
- Validate phone and message as required.
- Store source page.
- Support statuses:
  - NEW
  - CONTACTED
  - CLOSED
  - INVALID

Acceptance:

- Visitor can submit lead without logging in.
- Missing phone or message is rejected.
- Dashboard can mark lead status.
- Public endpoint does not expose admin fields.

### BE-008: Public Site APIs

Owner:

Backend

Depends on:

BE-004, BE-005, BE-006, BE-007

Endpoints:

```text
GET /api/public/sites/{slug}/config
GET /api/public/sites/{slug}/products
GET /api/public/sites/{slug}/news
GET /api/public/sites/{slug}/news/{newsSlug}
POST /api/public/sites/{slug}/leads
```

Work:

- Return public-safe config.
- Return enabled product services only.
- Return published news only.
- Return 404 for missing/offline sites.

Acceptance:

- Public corporate pages can be fully rendered from these endpoints.
- Public responses omit internal owner/admin/build fields.

### BE-009: Build API

Owner:

Backend

Depends on:

BE-003

Endpoints:

```text
POST /api/sites/{siteId}/builds
GET /api/sites/{siteId}/builds
GET /api/sites/{siteId}/builds/{buildId}
```

Work:

- Create build record when user publishes.
- Phase one can mark build success after validating saved content.
- Store output URL.
- Store trigger user.

Acceptance:

- Dashboard can create a publish/build record.
- Build history is visible.
- Failed build can store a readable log.

## 4. Admin Frontend Tasks

### FEA-001: Dashboard Shell

Owner:

Admin frontend

Depends on:

Existing auth routes

Work:

- Implement consistent dashboard layout.
- Add sidebar items:
  - Dashboard
  - Sites
  - Templates
  - Leads
  - Media
  - Settings
- Add top bar with current user, create site, logout.
- Use neutral admin styling.

Acceptance:

- All dashboard pages share the same shell.
- Mobile layout remains usable.
- Active navigation item is clear.

### FEA-002: Dashboard Home

Owner:

Admin frontend

Depends on:

FEA-001, BE-003, BE-007, BE-009

Work:

- Add statistics cards.
- Add quick actions.
- Add recent sites table.
- Add recent leads table.
- Add empty state for no sites.

Acceptance:

- User can jump to create site, site list, and leads.
- Empty state says `还没有站点，创建第一个站点开始使用。`

### FEA-003: Site List

Owner:

Admin frontend

Depends on:

FEA-001, BE-003

Route:

```text
/dashboard/sites
```

Work:

- Implement site list table.
- Add filters for keyword, template type, status, created time.
- Add actions: edit, preview, publish, detail.
- Add delete confirmation.

Acceptance:

- Site list loads from API.
- User can navigate to edit, preview, and detail.
- Delete requires confirmation.

### FEA-004: Create Site Flow

Owner:

Admin frontend

Depends on:

FEA-001, BE-003

Route:

```text
/dashboard/sites/new
```

Work:

- Build site creation form.
- Add template selection cards.
- Enable corporate-site template.
- Show personal-blog as `即将支持` or hide it.
- Generate slug from site name and allow manual editing.
- Submit to `POST /api/sites`.

Acceptance:

- User can create a corporate-site site.
- Invalid slug displays validation message.
- Successful creation redirects to `/dashboard/sites/{id}/edit`.

### FEA-005: Site Detail

Owner:

Admin frontend

Depends on:

BE-003, BE-007, BE-009

Route:

```text
/dashboard/sites/[id]
```

Work:

- Display site metadata.
- Display recent builds.
- Display recent leads.
- Add edit, preview, publish actions.

Acceptance:

- User can understand current site state from one page.
- Publish action creates a build record.

### FEA-006: Site Edit Tabs and Save State

Owner:

Admin frontend

Depends on:

BE-004

Route:

```text
/dashboard/sites/[id]/edit
```

Work:

- Implement tabbed editing layout.
- Add fixed top action area.
- Add save state:
  - unsaved changes
  - saving
  - saved
  - failed
- Warn before leaving with unsaved changes.

Acceptance:

- Config loads into forms.
- Saving updates SiteConfig.
- Unsaved changes are visible.

### FEA-007: Basic Info Tab

Owner:

Admin frontend

Depends on:

FEA-006

Work:

- Implement fields:
  - company name
  - logo URL/upload hook
  - slogan
  - primary color
  - accent color
  - SEO title
  - SEO description
  - SEO keywords
- Add preview for logo and colors.

Acceptance:

- User can update brand and SEO config.
- Saved values appear in preview.

### FEA-008: Homepage Content Tab

Owner:

Admin frontend

Depends on:

FEA-006

Work:

- Implement hero fields.
- Implement advantages list editor.
- Implement scenarios list editor.
- Implement about summary fields.
- Add list item add/delete/reorder/visible controls.

Acceptance:

- User can modify homepage text and lists.
- Hidden items do not appear in preview.

### FEA-009: Product Services Admin

Owner:

Admin frontend

Depends on:

BE-005

Work:

- Implement product service table.
- Implement create/edit modal.
- Implement enable/disable.
- Implement delete confirmation.
- Implement sorting field.

Acceptance:

- User can manage product services from the edit page.
- Required field errors are shown.

### FEA-010: News Admin

Owner:

Admin frontend

Depends on:

BE-006

Work:

- Implement news table.
- Implement news create/edit form.
- Support Markdown textarea.
- Implement publish/offline status actions.
- Implement delete confirmation.

Acceptance:

- User can create draft news.
- User can publish and unpublish news.
- Public preview only displays published news.

### FEA-011: Cooperation and Contact Tabs

Owner:

Admin frontend

Depends on:

FEA-006

Work:

- Implement cooperation section fields.
- Implement cooperation type list editor.
- Implement process list editor.
- Implement contact fields.
- Add QR code preview.
- Validate email format when provided.

Acceptance:

- Cooperation and contact content saves to SiteConfig.
- Contact information appears in public pages.

### FEA-012: Lead Management

Owner:

Admin frontend

Depends on:

BE-007

Work:

- Implement lead filters.
- Implement lead table.
- Implement detail drawer.
- Implement status actions.

Acceptance:

- User can view submitted leads.
- User can mark lead as contacted, closed, or invalid.

### FEA-013: Preview and Publish UI

Owner:

Admin frontend

Depends on:

BE-009, FEP-001

Work:

- Add open preview action.
- Add publish confirmation.
- Show build history.
- Display build status and logs.

Acceptance:

- Preview opens current saved content.
- Publishing creates a build record.
- Build history updates after publish.

## 5. Public Frontend Tasks

### FEP-001: Corporate Template Data Contract

Owner:

Public frontend

Depends on:

BE-008 or mock data matching BE-008

Work:

- Define TypeScript types for:
  - SiteConfig
  - ProductService
  - News
  - Lead
- Create corporate-site mock data matching the API shape.
- Ensure template components receive data through props.

Acceptance:

- No reusable corporate template component hardcodes Chunchang-specific copy.
- Mock and API response shapes match.

### FEP-002: Corporate Site Layout and Theme

Owner:

Public frontend

Depends on:

FEP-001

Work:

- Implement corporate public layout.
- Apply brand colors:
  - green
  - cream
  - butter-gold accent
- Add desktop navigation.
- Add mobile navigation.
- Add footer.
- Add floating/fixed contact actions.

Acceptance:

- Desktop and mobile layouts are usable.
- Contact actions remain visible and accessible.
- Visual tone is green, healthy, ecological, professional, stable, and approachable.

### FEP-003: Corporate Homepage

Owner:

Public frontend

Depends on:

FEP-001, FEP-002

Route:

```text
/sites/{siteSlug}
```

Work:

- Implement homepage sections:
  - hero
  - advantages
  - product services
  - application scenarios
  - about
  - cooperation
  - latest news
  - contact
- Use public API or mock data.

Acceptance:

- Visitor understands within five seconds that the company focuses on butter/dairy product supply.
- CTA buttons route to products or contact sections.
- Mobile layout has no text overlap.

### FEP-004: Product Services Page

Owner:

Public frontend

Depends on:

BE-008, FEP-002

Route:

```text
/sites/{siteSlug}/products
```

Work:

- Render enabled product services.
- Show image, title, summary, scenario tags, and consult button.
- Add contact CTA section.

Acceptance:

- Disabled services are hidden.
- Consult button routes to contact form.

### FEP-005: About Page

Owner:

Public frontend

Depends on:

FEP-002

Route:

```text
/sites/{siteSlug}/about
```

Work:

- Render about summary and brand values.
- Include company images when configured.
- Include contact CTA.
- Do not show unverified facts unless configured.

Acceptance:

- Page communicates credibility without inventing claims.

### FEP-006: News List and Detail Pages

Owner:

Public frontend

Depends on:

BE-008, FEP-002

Routes:

```text
/sites/{siteSlug}/news
/sites/{siteSlug}/news/{newsSlug}
```

Work:

- Render published news list.
- Add category filter.
- Render news detail by slug.
- Add empty state.

Acceptance:

- Draft/offline news does not appear.
- Missing news slug shows 404 or a clear not-found state.

### FEP-007: Cooperation Page

Owner:

Public frontend

Depends on:

FEP-002, BE-008

Route:

```text
/sites/{siteSlug}/cooperation
```

Work:

- Render cooperation types.
- Render cooperation process.
- Include lead form or direct link to contact page.
- Include phone and WeChat CTA.

Acceptance:

- Visitor can understand available cooperation paths.
- Visitor can submit cooperation intent.

### FEP-008: Contact Page and Lead Form

Owner:

Public frontend

Depends on:

BE-007, FEP-002

Route:

```text
/sites/{siteSlug}/contact
```

Work:

- Render phone, WeChat, QR code, address, email, and working hours.
- Implement lead form:
  - name
  - phone
  - company name
  - cooperation type
  - message
- Validate phone and message as required.
- Submit to public lead API.

Acceptance:

- Successful submission shows `已收到您的咨询，我们会尽快与您联系。`
- Failed submission shows retry guidance.
- Lead appears in dashboard.

## 6. Integration Tasks

### INT-001: Auth and Access Control Pass

Owner:

Full stack

Depends on:

BE-003 through BE-009, FEA pages

Work:

- Verify ADMIN can access all sites.
- Verify USER can access owned sites only.
- Verify public endpoints do not require login.
- Verify admin endpoints require login.

Acceptance:

- Unauthorized admin API calls are rejected.
- USER cannot access another user's site by changing IDs.

### INT-002: Corporate Site End-to-End Flow

Owner:

Full stack

Depends on:

M1-M5 tasks

Work:

- Create a corporate-site site.
- Edit Chunchang config.
- Add product services.
- Submit a public lead.
- Mark lead as contacted.
- Publish site.
- View build history.

Acceptance:

- The full flow can be completed without direct database edits.

### INT-003: Responsive and Visual QA

Owner:

Frontend

Depends on:

FEP pages, FEA pages

Work:

- Test dashboard and public site on desktop.
- Test dashboard and public site on mobile.
- Check text overflow, button wrapping, and contact bar overlap.
- Verify public site visual tone matches requirements.

Acceptance:

- No obvious layout overlap on mobile.
- Contact actions remain usable.
- Public corporate site looks green, healthy, clean, and professional.

### INT-004: Error and Empty State QA

Owner:

Full stack

Depends on:

All MVP tasks

Work:

- Verify loading states.
- Verify empty states.
- Verify save failures.
- Verify lead submit failures.
- Verify publish failure state.

Acceptance:

- Each major user flow has readable failure handling.

## 7. Verification Commands

Run these before considering a milestone complete:

```bash
npm run build:server
npm run build:web
npm run build:all
make -n start
make -n db-migrate
```

When PostgreSQL is running:

```bash
make db-migrate
make db-status
```

If graphify is installed:

```bash
python3 -c "from graphify.watch import _rebuild_code; from pathlib import Path; _rebuild_code(Path('.'))"
```

## 8. Recommended Implementation Order

1. `BE-001` database migrations.
2. `BE-002` corporate template/default data.
3. `BE-003` site API.
4. `BE-004` SiteConfig API.
5. `FEA-001` dashboard shell.
6. `FEA-004` create site flow.
7. `FEA-006` edit shell/save state.
8. `FEA-007` basic info tab.
9. `FEA-008` homepage content tab.
10. `FEP-001` corporate data contract.
11. `FEP-002` corporate layout/theme.
12. `FEP-003` corporate homepage.
13. `BE-007` lead API.
14. `FEA-012` lead management.
15. `FEP-008` contact page and lead form.
16. `BE-005` and `FEA-009` product services.
17. `FEP-004` product services page.
18. `BE-006` and `FEA-010` news.
19. `FEP-006` news pages.
20. `BE-009` and `FEA-013` build records.
21. `INT-001` to `INT-004` integration checks.

## 9. Current First Task

Start with:

```text
BE-001: Align Database Migrations With MVP Schema
```

Reason:

The platform needs stable tables before the admin screens and public APIs can be implemented without rework.

