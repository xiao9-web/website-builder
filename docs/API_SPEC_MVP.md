# Website Builder Platform MVP API Spec

## 1. Status

This is the current MVP API baseline.

API implementation is still in progress. Sections marked "planned" describe the accepted contract for upcoming tasks.

Current base URL:

```text
/api
```

Response envelope:

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```

Authentication:

- Dashboard APIs require JWT unless explicitly marked public.
- Public site APIs do not require JWT.

Roles:

- `ADMIN`: all sites.
- `USER`: owned sites only.

## 2. Auth API

Implemented under:

```text
/api/auth
```

Use current backend controllers as source of truth for exact auth payloads until this section is expanded.

## 3. Template API

### GET /api/templates

Purpose:

List published templates.

Auth:

Public in current security config.

Query:

| Name | Type | Required | Notes |
| --- | --- | --- | --- |
| `page` | number | no | Default `0` |
| `size` | number | no | Default `20` |
| `category` | string | no | Filter by category |

Response data:

```json
{
  "items": [
    {
      "id": 1,
      "code": "corporate-site",
      "name": "企业官网模板",
      "description": "...",
      "category": "corporate",
      "thumbnail": null,
      "schema": {},
      "status": "PUBLISHED",
      "currentVersion": 1,
      "authorId": 1,
      "authorName": "Admin",
      "createdAt": "...",
      "updatedAt": "..."
    }
  ],
  "page": 0,
  "size": 20,
  "total": 1
}
```

### GET /api/templates/{id}

Purpose:

Get template detail.

Auth:

Public in current security config.

### POST /api/templates

Purpose:

Create template.

Auth:

Authenticated.

### PUT /api/templates/{id}/schema

Purpose:

Update template schema and create a new template version.

Auth:

Authenticated.

### POST /api/templates/{id}/publish

Purpose:

Publish template.

Auth:

Authenticated.

## 4. Site API

Status:

Implemented through BE-003.

### GET /api/sites

Purpose:

List sites visible to the current user.

Auth:

Authenticated.

Access:

- ADMIN: all sites.
- USER: owned sites only.

Query:

| Name | Type | Required | Notes |
| --- | --- | --- | --- |
| `page` | number | no | Default `0` |
| `size` | number | no | Default `20` |

### POST /api/sites

Purpose:

Create a site.

Auth:

Authenticated.

Request:

```json
{
  "name": "山东春昌食品科技股份有限公司官网",
  "description": "企业官网",
  "slug": "chunchang",
  "subdomain": "chunchang",
  "siteType": "CORPORATE",
  "templateId": 1,
  "templateCode": "corporate-site"
}
```

Rules:

- `name` is required.
- `slug` is required in MVP behavior.
- `slug` must be lowercase letters, numbers, and hyphens.
- `slug` must be unique.
- `templateId` or `templateCode` can bind the template.
- If the template code is `corporate-site` or category is `corporate`, backend infers `CORPORATE` when `siteType` is absent.
- Backend creates default `SiteConfig`.

Response:

```json
{
  "id": 1,
  "name": "山东春昌食品科技股份有限公司官网",
  "description": "企业官网",
  "slug": "chunchang",
  "domain": null,
  "subdomain": "chunchang",
  "status": "DRAFT",
  "siteType": "CORPORATE",
  "ownerId": 1,
  "templateId": 1,
  "templateCode": "corporate-site",
  "publishedAt": null,
  "createdAt": "...",
  "updatedAt": "..."
}
```

### GET /api/sites/{siteId}

Purpose:

Get site detail.

Auth:

Authenticated.

Access:

- ADMIN: any site.
- USER: owned site only.

### PUT /api/sites/{siteId}

Purpose:

Update site metadata.

Auth:

Authenticated.

Access:

- ADMIN: any site.
- USER: owned site only.

Request:

```json
{
  "name": "New site name",
  "description": "New description",
  "slug": "new-slug",
  "subdomain": "new-slug",
  "status": "DRAFT"
}
```

Rules:

- If `slug` changes, format and uniqueness are validated.
- If `subdomain` changes, uniqueness is validated.

## 4.x Site Menu API

Status:

Implemented for editable menus and menu-scoped articles.

### GET /api/sites/{siteId}/menus

Purpose:

List editable menus for a site.

Auth:

Authenticated.

Response data:

```json
[
  {
    "id": 1,
    "siteId": 1,
    "parentId": null,
    "label": "首页",
    "slug": "home",
    "menuType": "HOME",
    "level": 1,
    "sortOrder": 0,
    "visible": true,
    "createdAt": "...",
    "updatedAt": "..."
  }
]
```

### POST /api/sites/{siteId}/menus

Purpose:

Create a menu.

Rules:

- `label` is required.
- `slug` is required and unique within the site.
- `parentId` can be null for a first-level menu.
- Menus can have at most three levels.
- Fourth-level creation returns `400`.

Request:

```json
{
  "parentId": null,
  "label": "知识中心",
  "slug": "knowledge-center",
  "sortOrder": 60,
  "visible": true
}
```

### PUT /api/sites/{siteId}/menus/{menuId}

Purpose:

Update menu label, slug, parent, sort order, and visibility.

Rules:

- The homepage menu cannot be assigned a parent.
- The homepage menu slug cannot be changed.
- Menus can have at most three levels.
- A menu cannot be assigned to itself or any descendant menu as parent.
- Updating a menu parent cannot make existing descendants exceed the three-level limit.

### DELETE /api/sites/{siteId}/menus/{menuId}

Purpose:

Delete a non-homepage menu.

Rules:

- Homepage menu cannot be deleted.
- Menus with child menus cannot be deleted until children are deleted.
- Articles under a deleted menu are kept and their menu assignment is cleared.

### DELETE /api/sites/{siteId}

Purpose:

Delete site.

Auth:

Authenticated.

Access:

- ADMIN: any site.
- USER: owned site only.

### POST /api/sites/{siteId}/publish

Purpose:

Trigger publish/build flow.

Auth:

Authenticated.

### POST /api/sites/{siteId}/build

Purpose:

Trigger build directly.

Auth:

Authenticated.

### GET /api/sites/{siteId}/builds/latest

Purpose:

Get latest successful build for a site.

Auth:

Authenticated.

## 5. SiteConfig API

Status:

Planned as BE-004.

### GET /api/sites/{siteId}/config

Purpose:

Load structured config for dashboard edit forms.

Auth:

Authenticated.

Access:

- ADMIN: any site.
- USER: owned site only.

Response:

```json
{
  "siteId": 1,
  "seoConfig": {},
  "themeConfig": {},
  "navigationConfig": {
    "items": []
  },
  "customConfig": {},
  "brandConfig": {},
  "contentConfig": {}
}
```

### PUT /api/sites/{siteId}/config

Purpose:

Save structured config from dashboard edit forms.

Auth:

Authenticated.

Rules:

- Required sections should be validated or filled with defaults:
  - brand
  - hero
  - contact
  - about
  - cooperation
  - seo

## 6. Product Service API

Status:

Implemented in BE-005.

Admin endpoints:

```text
GET /api/sites/{siteId}/products
POST /api/sites/{siteId}/products
PUT /api/sites/{siteId}/products/{productId}
DELETE /api/sites/{siteId}/products/{productId}
PATCH /api/sites/{siteId}/products/{productId}/enabled
```

Rules:

- Scope all records to site.
- Validate required `name` and `summary`.
- `GET` supports optional `enabled=true|false`; omitting `enabled` returns all records for dashboard management.
- Support sort order.
- Returned records are ordered by `sortOrder ASC, createdAt ASC`.

## 7. News API

Status:

Implemented in BE-006.

Admin endpoints:

```text
GET /api/sites/{siteId}/news
POST /api/sites/{siteId}/news
GET /api/sites/{siteId}/news/{newsId}
PUT /api/sites/{siteId}/news/{newsId}
DELETE /api/sites/{siteId}/news/{newsId}
PATCH /api/sites/{siteId}/news/{newsId}/status
```

Rules:

- Slug unique within site.
- `GET` supports optional `status=DRAFT|PUBLISHED|OFFLINE`; omitting `status` returns all records for dashboard management.
- Creating news defaults to `DRAFT` when status is omitted.
- Publishing sets `publishedAt`; moving to `DRAFT` or `OFFLINE` clears `publishedAt`.
- Draft is hidden from public APIs.
- Published is visible.
- Offline is hidden.

## 8. Lead API

Status:

Implemented in BE-007.

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

Public request:

```json
{
  "name": "张三",
  "phone": "13800000000",
  "companyName": "某食品公司",
  "cooperationType": "企业采购",
  "message": "想咨询黄油产品",
  "sourcePage": "/sites/chunchang/contact"
}
```

Rules:

- `phone` is required.
- `message` is required.
- Public submit does not require login.
- Public submit resolves the target site by slug and creates a `NEW` lead.
- Public response returns only a lead id and success message.
- Admin list supports optional `status=NEW|CONTACTED|CLOSED|INVALID`.
- Admin list/detail/status changes require site access.

## 9. Public Site API

Status:

Implemented in BE-008.

Public endpoints:

```text
GET /api/public/sites/{slug}/config
GET /api/public/sites/{slug}/products
GET /api/public/sites/{slug}/news
GET /api/public/sites/{slug}/news/{newsSlug}
POST /api/public/sites/{slug}/leads
```

Rules:

- Return only public-safe fields.
- Products return enabled records only.
- News returns published records only.
- Offline and error sites return not found.
- Leads can be submitted without login.

## 10. Error Behavior

Current business error patterns:

| Scenario | Expected HTTP |
| --- | --- |
| Missing auth | 401 |
| Invalid token | 401 |
| Forbidden site access | 403 |
| Missing resource | 404 |
| Invalid request | 400 |
| Duplicate slug/domain/subdomain | 400 |

Current backend error envelope:

```json
{
  "code": 400,
  "message": "Slug is already in use",
  "data": null
}
```
