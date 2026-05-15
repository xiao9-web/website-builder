# Website Builder Platform MVP Requirements

## 1. Product Definition

Website Builder Platform is a multi-site website building platform.

Users can log in to the admin dashboard, create a site, choose a template, edit structured content through forms, preview the result, and publish a site.

The first phase must support two real site goals:

- Shandong Chunchang Food Technology Co., Ltd. corporate website.
- Personal blog, reserved for the next phase after the corporate-site flow is stable.

The platform must not be implemented as a one-off company website. The corporate website is the first real site produced by the platform.

## 2. First Phase Goals

The first phase focuses on the multi-site platform foundation and the corporate website template.

Required first-phase flow:

1. Log in to the admin dashboard.
2. Create a site.
3. Choose the corporate website template.
4. Generate default site configuration.
5. Edit site information and content through dashboard forms.
6. Preview the corporate website.
7. Submit leads from the public website.
8. View and process leads in the dashboard.
9. Create a publish/build record.

The first real site is:

```text
山东春昌食品科技股份有限公司
```

Business goal:

```text
让潜在客户更快了解公司、产品和合作方式，并通过电话、微信、留言咨询建立业务联系。
```

## 3. Target Users

### Platform Users

- Platform administrator.
- Site owner or operator.

### Corporate Website Visitors

- Food processing company buyers.
- Bakery, restaurant, and dessert shop operators.
- Distributors, wholesalers, and channel partners.
- Business customers looking for butter or dairy product supply.
- Customers who saw an ad or heard about the company and need to verify its credibility.

## 4. Roles and Permissions

### ADMIN

ADMIN can:

- Manage all users.
- Manage all sites.
- Manage templates.
- View all leads.
- Publish all sites.

### USER

USER can:

- Create owned sites.
- Edit owned sites.
- Manage content under owned sites.
- View leads for owned sites.
- Publish owned sites.

The first phase does not include custom roles, team collaboration, or fine-grained permission rules.

## 5. Core Objects

### User

Platform user.

### Site

A website instance created by a user.

Examples:

- 山东春昌食品科技股份有限公司官网
- Xiao9 personal blog

### Template

A reusable site type.

First-phase template:

- `corporate-site`

Reserved second-phase template:

- `personal-blog`

### TemplateVersion

Versioned template definition. Template upgrades must not unexpectedly break existing published sites.

### SiteConfig

Structured site configuration.

It stores site-level content such as brand, theme, navigation, hero content, contact information, SEO, cooperation content, and homepage sections.

### SiteMenu

Editable site menu and content column.

Rules:

- The homepage is a system menu and cannot be deleted.
- Non-homepage menus can be created, edited, hidden, sorted, and deleted.
- Menus support at most three levels.
- A menu cannot be moved under itself or under any of its descendant menus.
- Moving a menu must not cause any descendant menu to exceed the three-level limit.
- Articles can be assigned to a non-homepage menu.
- Deleting a menu keeps its articles and clears their menu assignment.
- A menu can be used as a navigation entry even before it has articles.

### ProductService

Corporate website product or service item.

Examples:

- 黄油产品
- 乳制品原料
- 企业采购服务
- 渠道合作

### News

Corporate website dynamic article or menu-scoped article.

Rules:

- Articles can belong to a menu.
- Articles can still have a category such as company news or product knowledge.
- Article publication status remains `DRAFT`, `PUBLISHED`, or `OFFLINE`.

Categories:

- 公司动态
- 产品知识
- 行业资讯

### Lead

Customer inquiry, message, or cooperation intent.

### Build

Publish/build record.

### Media

Image/file resource.

Used for logos, QR codes, hero images, product images, company images, and news covers.

## 6. Information Architecture

### Admin Routes

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

### Public Corporate Website Routes

The public site should be rendered through a site slug so the platform can support multiple sites.

```text
/sites/{siteSlug}
/sites/{siteSlug}/products
/sites/{siteSlug}/about
/sites/{siteSlug}/news
/sites/{siteSlug}/news/{newsSlug}
/sites/{siteSlug}/cooperation
/sites/{siteSlug}/contact
```

## 7. Admin UI Requirements

The dashboard is a work tool. It should be clear, efficient, and restrained.

Recommended dashboard layout:

```text
Left sidebar:
- Dashboard
- Sites
- Templates
- Leads
- Media
- Settings

Top bar:
- Current user
- Create site
- Logout

Main area:
- Page title
- Optional page description
- Primary action
- Table, form, or preview
```

Dashboard colors should be neutral and not tightly coupled to the corporate website brand:

```text
primary: #2563EB
background: #F6F8FB
surface: #FFFFFF
text: #111827
muted: #6B7280
border: #E5E7EB
success: #16A34A
warning: #D97706
danger: #DC2626
```

### 7.1 Dashboard Page

Route:

```text
/dashboard
```

Purpose:

Show site count, recent leads, recent builds, and shortcuts.

Required modules:

- Statistics cards: sites, published sites, new leads, recent builds.
- Quick actions: create site, manage sites, view leads, manage templates.
- Recent sites table.
- Recent leads table.

### 7.x Site Content Management

Route:

```text
/dashboard/sites/{siteId}/content
```

Purpose:

Manage the editable content behind a site.

Required modules:

- Site configuration.
- Editable menu columns.
- Product/service entries.
- Menu-scoped articles.
- Leads.

Menu requirements:

- Show all site menus in sort order.
- Allow creating a first-level menu.
- Allow creating second-level and third-level child menus.
- Reject fourth-level menus.
- Allow editing menu label, slug, parent, sort order, and visibility.
- Reject moving a menu under itself or under any of its descendants.
- Reject moving a menu if any existing descendant would become fourth-level or deeper.
- Do not allow deleting the homepage menu.
- Do not allow assigning the homepage menu as a normal article column.

Article requirements:

- Allow creating an article under a selected menu.
- Allow editing an article's menu assignment.
- Allow creating articles without a menu when needed.
- Allow publishing, offline, draft editing, and deletion.
- Show article menu, category, status, and updated time in the list.

Recent sites columns:

- Site name
- Template
- Status
- Last updated
- Actions

Recent site actions:

- Edit
- Preview
- Publish

Recent leads columns:

- Name
- Phone
- Site
- Cooperation type
- Status
- Submitted at

Empty state:

```text
还没有站点，创建第一个站点开始使用。
```

Primary button:

```text
新建站点
```

### 7.2 Sites List Page

Route:

```text
/dashboard/sites
```

Purpose:

Manage all sites and quickly enter edit, preview, and publish flows.

Header:

- Title: `站点管理`
- Description: `创建和管理你的官网、博客和其他网站。`
- Primary button: `新建站点`

Filters:

- Keyword search
- Template type
- Status
- Created time

Table columns:

- Site name
- Slug
- Template
- Status
- Last updated
- Last published
- Actions

Statuses:

- Draft
- Published
- Offline

Actions:

- Edit
- Preview
- Publish
- More

More menu may reserve:

- Site detail
- Duplicate site
- Offline site
- Delete site

Delete confirmation:

```text
删除后该站点配置、内容和发布记录将不可恢复。确认删除？
```

### 7.3 Create Site Page

Route:

```text
/dashboard/sites/new
```

Purpose:

Create a site by selecting a template.

Layout:

- Left: site information form.
- Right: template selection cards.

Fields:

- Site name, required.
- Description, optional.
- Slug, required, auto-generated from name and manually editable.
- Custom domain, optional, stored only in phase one.
- Template, required.

Slug validation:

- Only lowercase letters, numbers, and hyphens.

Template card: corporate site.

Description:

```text
适合公司介绍、产品服务、合作咨询和获客转化。
```

Tags:

- 企业官网
- 产品服务
- 留言咨询

Button:

```text
选择模板
```

Template card: personal blog.

Phase-one state:

```text
即将支持
```

Button:

```text
暂不可用
```

Submit button:

```text
创建站点
```

On success:

1. Create `Site`.
2. Bind `Template`.
3. Create default `SiteConfig`.
4. Redirect to `/dashboard/sites/{id}/edit`.

Success message:

```text
站点创建成功，正在进入编辑页面。
```

### 7.4 Site Detail Page

Route:

```text
/dashboard/sites/[id]
```

Purpose:

Show site state and quick actions.

Header:

- Site name
- Status tag
- Template name
- Public URL
- Buttons: edit, preview, publish

Info cards:

- Site description
- Slug
- Custom domain
- Created time
- Last updated time
- Last published time

Recent build table:

- Build ID
- Status
- Output URL
- Duration
- Triggered by
- Created time

Recent lead table:

- Name
- Phone
- Cooperation type
- Status
- Submitted at

### 7.5 Site Edit Page

Route:

```text
/dashboard/sites/[id]/edit
```

Purpose:

Main content editing page for the selected template.

Top fixed area:

- Site name
- Status
- Preview button
- Save button
- Publish button

Tabs for the corporate-site template:

- 基础信息
- 首页内容
- 产品服务
- 最近动态
- 合作机会
- 联系方式
- 留言咨询
- 预览发布

Save behavior:

- Show `有未保存修改` when the form changes.
- Show `正在保存...` during save.
- Show `已保存` on success.
- Show the failure reason on failure.
- Confirm navigation when unsaved changes exist.

#### Basic Info Tab

Fields:

- Company name
- Logo upload
- Slogan
- Primary color
- Accent color
- SEO title
- SEO description
- SEO keywords

Logo requirements:

- Supports jpg, png, webp.
- Preview after upload.
- Recommended as a horizontal transparent image.

Color picker:

- Color input.
- Preset swatches.
- Default green and butter-gold swatches.

#### Homepage Content Tab

Hero fields:

- Title
- Subtitle
- Description
- Hero image
- Primary button text
- Primary button action, default: contact section
- Secondary button text
- Secondary button action, default: products section

Advantages list fields:

- Title
- Description
- Icon, optional
- Sort order
- Visible

Default advantages:

- 绿色健康
- 稳定供应
- 专业服务
- 响应及时

Scenario list fields:

- Name
- Description
- Image, optional
- Sort order
- Visible

Default scenarios:

- 烘焙门店
- 餐饮供应
- 食品加工
- 经销渠道
- 企业采购

About summary fields:

- Title
- Summary
- Image

#### Product Services Tab

Header:

- Title: `产品服务`
- Primary button: `新增产品服务`

Table columns:

- Image
- Name
- Summary
- Scenarios
- Status
- Sort order
- Actions

Actions:

- Edit
- Enable/disable
- Delete

Create/edit modal fields:

- Name, required.
- Summary, required.
- Description.
- Image.
- Scenarios, multiple tags.
- Sort order.
- Enabled.

Delete confirmation:

```text
删除后该产品服务将不再展示，确认删除？
```

#### News Tab

Header:

- Title: `最近动态`
- Primary button: `新建动态`

Table columns:

- Title
- Category
- Status
- Published at
- Updated at
- Actions

Actions:

- Edit
- Publish
- Unpublish
- Delete

News form fields:

- Title
- Slug
- Summary
- Category
- Cover image
- Content
- Status
- Published at

Editor:

- Phase one can use Markdown in a textarea.
- Rich text or dedicated Markdown editor is postponed.

Statuses:

- Draft
- Published
- Offline

#### Cooperation Tab

Fields:

- Section title
- Description
- Cooperation type list
- Cooperation process

Cooperation type fields:

- Name
- Description
- Visible
- Sort order

Default cooperation types:

- 产品采购
- 经销合作
- 食品加工合作
- 企业定制咨询
- 区域合作

Process step fields:

- Step name
- Step description, optional
- Sort order

Default process:

- 提交需求
- 沟通产品与合作方式
- 确认方案
- 建立合作

#### Contact Tab

Fields:

- Phone
- WeChat ID
- WeChat QR code upload
- Address
- Email
- Working hours
- Map link

Validation:

- Phone only needs basic length validation in phase one.
- Email must be valid if provided.
- QR code must show preview after upload.

#### Leads Tab

Filters:

- Status
- Cooperation type
- Date range
- Keyword

Table columns:

- Name
- Phone
- Company name
- Cooperation type
- Source page
- Status
- Submitted at
- Actions

Actions:

- View detail
- Mark contacted
- Mark closed
- Mark invalid

Detail drawer fields:

- Name
- Phone
- Company name
- Cooperation type
- Message
- Source page
- Submitted at
- Status
- Processing note, postponed to phase two

Status colors:

- New: blue
- Contacted: yellow
- Closed: green
- Invalid: gray

#### Preview and Publish Tab

Preview module:

- Button: `打开预览`
- Description: `预览会展示当前已保存内容。`

Publish module:

- Button: `发布站点`

Publish confirmation:

```text
发布后，访客将看到最新保存的内容。确认发布？
```

Build table columns:

- Build ID
- Status
- Output URL
- Duration
- Triggered by
- Created time
- Completed time

Build statuses:

- Pending
- Building
- Success
- Failed

## 8. Public Corporate Website UI Requirements

The corporate website is a brand and lead-generation website.

Brand tone:

```text
绿色、健康、生态、专业稳重、简洁、亲民。
```

Recommended colors:

```text
primary: #2F7D46
primaryDark: #1F5E35
accent: #D6A84F
cream: #FFF8EA
surface: #F7FAF4
text: #1F2A24
muted: #647067
border: #DDE8D8
```

Content width:

- Max content width: 1200px.
- Mobile horizontal padding: 16px.
- Desktop section vertical spacing: 72px to 96px.
- Mobile section vertical spacing: 40px to 56px.

### 8.1 Navigation

Desktop:

- Left: logo and company name.
- Center: navigation links.
- Right: phone button and WeChat button.

Mobile:

- Logo.
- Menu button.
- Expanded navigation.
- Fixed bottom contact bar.

Navigation links:

- 首页
- 产品服务
- 关于我们
- 最近动态
- 合作机会
- 联系我们

### 8.2 Homepage

Module order:

1. Header/navigation.
2. Hero.
3. Core advantages.
4. Product services.
5. Application scenarios.
6. About company.
7. Cooperation opportunities.
8. Latest news.
9. Contact section.
10. Footer.

Fixed conversion entries:

- Desktop right floating actions: phone, WeChat, message.
- Mobile bottom fixed actions: phone, WeChat, message.

Hero content for Chunchang:

Title:

```text
山东春昌食品科技股份有限公司
```

Subtitle:

```text
专注黄油等乳制品供应，服务食品加工、烘焙餐饮与渠道合作客户
```

Description:

```text
我们坚持绿色、健康、生态的发展理念，围绕黄油及乳制品相关产品，为客户提供稳定、专业、可信赖的食品科技与供应服务。
```

Buttons:

- `立即咨询`
- `查看产品服务`

Hero imagery:

- Butter product close-up.
- Dairy product scene.
- Ecological pasture.
- Clean food production or warehouse scene.

### 8.3 Advantages Section

Title:

```text
为什么选择春昌食品科技
```

Default cards:

- 绿色健康
- 稳定供应
- 专业服务
- 响应及时

Each card contains:

- Icon
- Title
- Description

### 8.4 Product Services Section

Title:

```text
产品与服务
```

Description:

```text
围绕黄油等乳制品相关产品，服务食品加工、烘焙餐饮、经销渠道与企业客户。
```

Default cards:

- 黄油产品
- 乳制品原料
- 企业采购服务
- 渠道合作

Each card contains:

- Image
- Title
- Summary
- Scenario tags
- Button: `咨询该产品`

The consult button scrolls to the contact section or opens the lead form.

### 8.5 Application Scenarios Section

Default scenarios:

- 烘焙门店
- 餐饮供应
- 食品加工
- 经销渠道
- 企业采购

Scenario copy should be short and direct.

### 8.6 About Section

Title:

```text
关于春昌食品科技
```

Default text:

```text
山东春昌食品科技股份有限公司专注于黄油等乳制品相关产品与食品科技服务。公司坚持绿色、健康、生态的发展方向，重视产品品质、客户沟通与长期合作，致力于成为食品加工、烘焙餐饮、渠道客户可信赖的合作伙伴。
```

Do not invent specific founding years, production capacity, certifications, or customer names without verified materials.

### 8.7 Cooperation Section

Title:

```text
合作机会
```

Description:

```text
我们欢迎食品加工企业、烘焙餐饮客户、经销商及区域合作伙伴与春昌食品科技建立联系，共同拓展乳制品产品与市场机会。
```

Default cooperation types:

- 产品采购
- 经销合作
- 食品加工合作
- 定制咨询

Button:

```text
提交合作意向
```

### 8.8 Latest News Section

Title:

```text
最近动态
```

Default categories:

- 公司动态
- 产品知识
- 行业资讯

Placeholder examples:

- 春昌食品科技官网建设启动，进一步提升客户服务效率
- 黄油产品在烘焙与餐饮场景中的常见应用
- 面向企业采购客户的乳制品供应合作说明

### 8.9 Contact Section

Title:

```text
联系春昌食品科技
```

Description:

```text
如果您有产品采购、经销合作、企业定制或业务咨询需求，欢迎通过电话、微信或留言与我们联系。
```

Contact fields:

- Phone
- WeChat QR code
- Address
- Email, optional
- Working hours, optional

Lead form fields:

- Name
- Phone
- Company name
- Cooperation type
- Message

Cooperation types:

- 产品采购
- 经销合作
- 企业定制
- 咨询了解
- 其他

Submit button:

```text
提交咨询
```

Success message:

```text
已收到您的咨询，我们会尽快与您联系。
```

## 9. SiteConfig Structure

Corporate-site default config:

```json
{
  "brand": {
    "companyName": "山东春昌食品科技股份有限公司",
    "logoUrl": "",
    "slogan": "绿色健康的乳制品合作伙伴",
    "primaryColor": "#2F7D46",
    "accentColor": "#D6A84F"
  },
  "hero": {
    "title": "山东春昌食品科技股份有限公司",
    "subtitle": "专注黄油等乳制品供应，服务食品加工、烘焙餐饮与渠道合作客户",
    "description": "我们坚持绿色、健康、生态的发展理念，围绕黄油及乳制品相关产品，为客户提供稳定、专业、可信赖的食品科技与供应服务。",
    "primaryButtonText": "立即咨询",
    "secondaryButtonText": "查看产品服务",
    "imageUrl": ""
  },
  "contact": {
    "phone": "",
    "wechat": "",
    "wechatQrUrl": "",
    "address": "",
    "email": "",
    "workingHours": "周一至周六 8:30-18:00"
  },
  "about": {
    "title": "关于春昌食品科技",
    "summary": "山东春昌食品科技股份有限公司专注于黄油等乳制品相关产品与食品科技服务。",
    "imageUrl": ""
  },
  "cooperation": {
    "title": "合作机会",
    "description": "欢迎食品加工企业、烘焙餐饮客户、经销商及区域合作伙伴与我们建立联系。",
    "process": ["提交需求", "沟通产品与合作方式", "确认方案", "建立合作"]
  },
  "seo": {
    "title": "山东春昌食品科技股份有限公司官网",
    "description": "山东春昌食品科技股份有限公司专注黄油等乳制品供应与食品科技服务。",
    "keywords": ["黄油", "乳制品", "食品科技", "山东春昌食品"]
  }
}
```

Keep frequently edited lists outside `SiteConfig` when they need CRUD, sorting, filtering, or pagination.

Separate tables:

- ProductService
- News
- Lead
- Media

## 10. Database Tables

### sites

```text
id
owner_id
template_id
name
description
slug
domain
status
created_at
updated_at
published_at
```

### templates

```text
id
code
name
description
category
status
current_version
created_at
updated_at
```

### template_versions

```text
id
template_id
version
schema
created_at
```

### site_configs

```text
id
site_id
seo_config
brand_config
theme_config
navigation_config
content_config
custom_config
created_at
updated_at
```

### product_services

```text
id
site_id
name
summary
description
image_url
scenarios
sort_order
enabled
created_at
updated_at
```

### news

```text
id
site_id
title
slug
summary
content
category
cover_image
status
published_at
created_at
updated_at
```

### leads

```text
id
site_id
name
phone
company_name
cooperation_type
message
source_page
status
created_at
updated_at
```

### builds

```text
id
site_id
status
output_url
build_log
duration_ms
triggered_by
created_at
completed_at
```

## 11. API Requirements

### Admin Sites

```text
GET /api/sites
POST /api/sites
GET /api/sites/{siteId}
PUT /api/sites/{siteId}
DELETE /api/sites/{siteId}
```

### Admin Site Config

```text
GET /api/sites/{siteId}/config
PUT /api/sites/{siteId}/config
```

### Admin Product Services

```text
GET /api/sites/{siteId}/products
POST /api/sites/{siteId}/products
PUT /api/sites/{siteId}/products/{productId}
DELETE /api/sites/{siteId}/products/{productId}
PATCH /api/sites/{siteId}/products/{productId}/enabled
```

### Admin News

```text
GET /api/sites/{siteId}/news
POST /api/sites/{siteId}/news
GET /api/sites/{siteId}/news/{newsId}
PUT /api/sites/{siteId}/news/{newsId}
DELETE /api/sites/{siteId}/news/{newsId}
PATCH /api/sites/{siteId}/news/{newsId}/status
```

### Admin Leads

```text
GET /api/sites/{siteId}/leads
GET /api/sites/{siteId}/leads/{leadId}
PATCH /api/sites/{siteId}/leads/{leadId}/status
```

### Admin Builds

```text
POST /api/sites/{siteId}/builds
GET /api/sites/{siteId}/builds
GET /api/sites/{siteId}/builds/{buildId}
```

### Public APIs

```text
GET /api/public/sites/{slug}/config
GET /api/public/sites/{slug}/products
GET /api/public/sites/{slug}/news
GET /api/public/sites/{slug}/news/{newsSlug}
POST /api/public/sites/{slug}/leads
```

## 12. States and Messages

Loading:

```text
正在加载数据...
```

Saving:

```text
正在保存...
```

Save success:

```text
已保存
```

Save failure:

```text
保存失败，请稍后重试
```

Empty list:

```text
暂无数据
```

Lead submitting:

```text
正在提交...
```

Lead submitted:

```text
已收到您的咨询，我们会尽快与您联系。
```

Lead submit failed:

```text
提交失败，请检查网络后重试。
```

Publishing:

```text
正在发布站点...
```

Publish success:

```text
发布成功
```

Publish failed:

```text
发布失败，请查看构建日志。
```

## 13. Development Phases

### Phase 1: Platform Skeleton and Corporate Preview

Goal:

Create a corporate site, edit its config, and preview the homepage.

Tasks:

- Site creation flow.
- Template selection.
- Corporate-site default config.
- SiteConfig edit form.
- Corporate homepage template.
- Preview route.

Acceptance:

- User can create a site.
- User can choose corporate-site template.
- Default Chunchang config is generated.
- User can edit company name, logo, colors, hero copy, and contact info.
- User can open preview.
- Preview page shows Chunchang corporate content.
- Desktop and mobile layouts are usable.

### Phase 2: Lead Generation

Goal:

Visitors can submit leads, and dashboard users can process them.

Tasks:

- Lead table.
- Public lead API.
- Contact form.
- Admin lead list.
- Lead status management.
- Phone and WeChat conversion entries.

Acceptance:

- Visitor can submit name, phone, company, cooperation type, and message.
- Phone and message are required.
- Dashboard can show lead list.
- Dashboard can mark leads as contacted, closed, or invalid.

### Phase 3: Product Services

Goal:

Dashboard users can maintain product/service items and public pages can display them.

Tasks:

- ProductService table.
- Admin CRUD.
- Product/service homepage section.
- Product service page.

Acceptance:

- User can create, edit, delete, enable, disable, and sort services.
- Public site displays enabled services only.
- Product consultation button routes to the contact form.

### Phase 4: News

Goal:

Dashboard users can maintain company news and public pages can display them.

Tasks:

- News table.
- Admin CRUD.
- News list page.
- News detail page.

Acceptance:

- User can create draft news.
- User can publish and unpublish news.
- Public site displays published news only.
- News detail is accessible by slug.

### Phase 5: Build Records

Goal:

The platform has a publish action and build history.

Tasks:

- Build creation.
- Publish status.
- Build records list.
- Public output URL.

Acceptance:

- User can click publish.
- System creates a build record.
- Build status becomes success or failed.
- User can see build history.

### Phase 6: Personal Blog Template

Goal:

Start the personal blog site after corporate-site flow is stable.

Tasks:

- Blog SiteConfig.
- Post table.
- Markdown editing.
- Blog homepage.
- Post list.
- Post detail.

## 14. Out of Scope for Phase One

Do not implement these in the first phase:

- Drag-and-drop editor.
- Online payment.
- Shopping cart.
- Member system.
- Multi-language.
- Online customer service system.
- Complex CRM.
- Complex permissions.
- AI-generated SEO articles.
- Real OSS/CDN publishing.
- Custom domain verification.
- Rich image cropping.
- Team collaboration.

## 15. Development Notes

- Public site content must come from APIs or mock data matching the API shape.
- Do not hardcode Chunchang-specific copy directly inside reusable template components.
- Corporate-site components should accept `siteConfig`, `products`, and `news` as inputs.
- Dashboard forms save structured JSON and records, not HTML blobs.
- Public APIs must not expose admin-only fields.
- Lead API must validate required fields.
- Delete operations require confirmation.
- Mobile contact actions must remain easy to access.
- Do not invent unverified company facts such as founding year, production capacity, certificates, or customer names.
