# Website Builder Platform MVP Data Model

## 1. Status

This is the current MVP data model baseline.

It matches the active Spring Boot + PostgreSQL implementation and the Flyway migrations under:

```text
apps/server/src/main/resources/db/migration
```

Older docs or SQL files that describe MySQL, menu/article CMS tables, or drag-and-drop page schemas are historical references only.

## 2. Entity Overview

| Object | Table | Purpose |
| --- | --- | --- |
| User | `users` | Platform user and owner identity |
| Template | `templates` | Reusable website template |
| TemplateVersion | `template_versions` | Versioned template schema history |
| Site | `sites` | A website instance created from a template |
| SiteConfig | `site_configs` | Site-level structured JSON config |
| ProductService | `product_services` | Corporate products/services |
| News | `news` | Corporate news, product knowledge, industry content |
| Lead | `leads` | Visitor inquiry or cooperation intent |
| Build | `builds` | Publish/build record |
| Media | `media` | Uploaded files and images |

## 3. Relationships

```text
User 1 -> N Site
User 1 -> N Template
Template 1 -> N TemplateVersion
Template 1 -> N Site
Site 1 -> 1 SiteConfig
Site 1 -> N ProductService
Site 1 -> N News
Site 1 -> N Lead
Site 1 -> N Build
User 1 -> N Media
```

## 4. Users

Table:

```text
users
```

Important fields:

| Field | Purpose |
| --- | --- |
| `id` | Primary key |
| `name` | Display name |
| `email` | Login identity |
| `password` | Password hash |
| `role` | `ADMIN`, `DEVELOPER`, `USER` |
| `enabled` | Account active flag |
| `created_at` | Creation time |
| `updated_at` | Update time |

MVP rules:

- `ADMIN` can manage all sites.
- `USER` can manage owned sites.
- Custom roles are out of scope for phase one.

## 5. Templates

Table:

```text
templates
```

Important fields:

| Field | Purpose |
| --- | --- |
| `id` | Primary key |
| `code` | Stable template code, for example `corporate-site` |
| `name` | Human-readable name |
| `description` | Template description |
| `category` | Template grouping, for example `corporate` |
| `thumbnail` | Optional preview image |
| `schema` | JSONB template schema |
| `status` | `DRAFT`, `PUBLISHED`, `ARCHIVED` |
| `current_version` | Current version number |
| `author_id` | Template author |

MVP template codes:

- `corporate-site`: active first-phase template.
- `personal-blog`: reserved for a later phase.

Rules:

- Prefer `code` for stable product logic.
- Use `id` for database relationships.
- A template can evolve through `template_versions`; existing sites should not unexpectedly break.

## 6. Template Versions

Table:

```text
template_versions
```

Important fields:

| Field | Purpose |
| --- | --- |
| `template_id` | Parent template |
| `version` | Version number |
| `schema` | JSONB schema snapshot |
| `changelog` | Human-readable change note |

Rules:

- New template schema changes should create a new version.
- Do not silently mutate the meaning of existing published versions.

## 7. Sites

Table:

```text
sites
```

Important fields:

| Field | Purpose |
| --- | --- |
| `id` | Primary key |
| `name` | Site name |
| `description` | Site description |
| `slug` | Platform public route identifier |
| `domain` | Reserved custom domain |
| `subdomain` | Optional platform subdomain |
| `status` | `DRAFT`, `BUILDING`, `PUBLISHED`, `OFFLINE`, `ERROR` |
| `site_type` | `BLOG`, `CORPORATE`, `PORTFOLIO`, `ECOMMERCE` |
| `owner_id` | Owner user |
| `template_id` | Selected template |
| `published_at` | Publish time |

Slug rules:

- Required for MVP site creation.
- Lowercase letters, numbers, and hyphens only.
- Must start and end with a letter or number.
- Must be unique when present.

Current public route model:

```text
/sites/{siteSlug}
```

## 8. Site Configs

Table:

```text
site_configs
```

Important fields:

| Field | Purpose |
| --- | --- |
| `site_id` | Unique site reference |
| `seo_config` | SEO title, description, keywords |
| `theme_config` | Colors, typography, theme tokens |
| `navigation_config` | Nav items and route labels |
| `custom_config` | Feature toggles and miscellaneous flags |
| `brand_config` | Brand identity and business direction |
| `content_config` | Homepage and site-level content sections |

Rules:

- Site-level, low-volume, structured settings belong here.
- Repeatable content does not belong here when it needs CRUD, sorting, filtering, pagination, or separate public visibility rules.

Keep these as separate tables:

- Products/services.
- News/articles.
- Leads.
- Media files.
- Builds.

## 9. Product Services

Table:

```text
product_services
```

Purpose:

Corporate site product or service cards.

Important fields:

| Field | Purpose |
| --- | --- |
| `site_id` | Owning site |
| `name` | Product/service name |
| `summary` | Required short summary |
| `description` | Longer description |
| `image_url` | Optional image |
| `scenarios` | JSONB usage scenarios |
| `sort_order` | Display order |
| `enabled` | Public visibility flag |

Seeded default Chunchang rows:

- 黄油产品
- 乳制品原料
- 企业采购服务
- 渠道合作

## 10. News

Table:

```text
news
```

Purpose:

Corporate dynamics and educational content.

Categories:

- 公司动态
- 产品知识
- 行业资讯

Statuses:

- `DRAFT`
- `PUBLISHED`
- `OFFLINE`

Rules:

- Public APIs should return only published news.
- Slug must be unique within a site.
- Placeholder seed rows must remain draft until replaced with real content.

## 11. Leads

Table:

```text
leads
```

Purpose:

Visitor inquiry, cooperation intent, or message.

Important fields:

| Field | Purpose |
| --- | --- |
| `site_id` | Target site |
| `name` | Contact name |
| `phone` | Required phone |
| `company_name` | Optional company name |
| `cooperation_type` | Inquiry type |
| `message` | Required message |
| `source_page` | Origin page |
| `status` | Processing status |

Statuses:

- `NEW`
- `CONTACTED`
- `CLOSED`
- `INVALID`

Rules:

- Public lead submission must not require login.
- Dashboard lead management requires site access.
- Public response must not expose admin-only fields.

## 12. Builds

Table:

```text
builds
```

Purpose:

Publish/build history.

Important fields:

| Field | Purpose |
| --- | --- |
| `site_id` | Built site |
| `status` | Build status |
| `output_url` | Output URL or placeholder |
| `build_log` | Build log |
| `duration_ms` | Duration |
| `triggered_by` | Trigger source |
| `created_at` | Start time |
| `completed_at` | End time |

Phase-one rule:

- Build records are enough.
- Real OSS/CDN/custom-domain publishing is out of scope.

## 13. Media

Table:

```text
media
```

Purpose:

Uploaded images and files.

Usage:

- Logo.
- WeChat QR code.
- Hero images.
- Product images.
- Company images.
- News cover images.

## 14. Migration History

| Migration | Purpose |
| --- | --- |
| `V1__init_schema.sql` | Initial users, templates, sites, site configs, builds, media |
| `V2__seed_data.sql` | Default admin and sample templates |
| `V3__align_mvp_schema.sql` | Adds MVP fields and tables |
| `V4__seed_corporate_site.sql` | Seeds corporate-site template and Chunchang defaults |

Rules:

- Do not edit old migrations after they may have run.
- Add new migrations for schema or seed changes.
- Keep Java entities aligned with Flyway schema.
