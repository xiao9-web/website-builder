# Website Builder Platform MVP SiteConfig Schema

## 1. Status

This is the current structured configuration baseline for the `corporate-site` template.

The first phase uses form-driven configuration, not drag-and-drop editing.

The backend stores site-level structured config in `site_configs` JSONB columns.

## 2. Storage Fields

Table:

```text
site_configs
```

Fields:

| Field | Purpose |
| --- | --- |
| `seo_config` | SEO title, description, keywords |
| `theme_config` | Colors and visual tokens |
| `navigation_config` | Navigation item structure |
| `custom_config` | Feature toggles and miscellaneous settings |
| `brand_config` | Brand identity and company-level facts |
| `content_config` | Homepage and page-section content |

## 3. What Belongs In SiteConfig

Use SiteConfig for:

- Brand name.
- Logo URL.
- Theme colors.
- Navigation.
- Homepage hero copy.
- About summary.
- Cooperation copy.
- Contact placeholders.
- SEO metadata.
- Feature toggles, such as mobile contact bar.

Do not use SiteConfig for:

- Product/service list.
- News list.
- Leads.
- Media records.
- Build history.

Those need separate tables because they require CRUD, sorting, filtering, public visibility rules, or processing state.

## 4. brandConfig

Example:

```json
{
  "companyName": "山东春昌食品科技股份有限公司",
  "shortName": "春昌食品科技",
  "logoUrl": null,
  "brandWords": ["绿色", "健康", "生态", "专业稳重", "简洁", "亲民"],
  "businessDirection": "黄油等乳制品相关产品与食品科技服务"
}
```

Required:

- `companyName`
- `shortName`
- `brandWords`
- `businessDirection`

Allowed to be null until real material is available:

- `logoUrl`

Do not invent:

- Founding year.
- Production capacity.
- Certifications.
- Customer names.
- Awards.

## 5. themeConfig

Example:

```json
{
  "primary": "#2F7D4A",
  "cream": "#FFF8E7",
  "butterGold": "#D9A441",
  "text": "#1F2933",
  "muted": "#64748B"
}
```

Purpose:

- Corporate visual identity.
- Public site theme tokens.
- Dashboard preview styling.

Design direction:

- Green: natural, healthy, ecological.
- Cream white: dairy and approachability.
- Butter gold: product association and CTA accent.
- Dark neutral text: professional stability.

## 6. navigationConfig

Use an object with `items`, not a raw array.

Example:

```json
{
  "items": [
    {"label": "首页", "href": "/"},
    {"label": "产品服务", "href": "/products"},
    {"label": "关于我们", "href": "/about"},
    {"label": "最近动态", "href": "/news"},
    {"label": "合作机会", "href": "/cooperation"},
    {"label": "联系我们", "href": "/contact"}
  ]
}
```

Reason:

- Backend `SiteConfig.navigationConfig` is currently typed as `Map<String, Object>`.
- An object wrapper allows future fields such as `fixed`, `mobileMode`, or `footerItems`.

## 7. seoConfig

Example:

```json
{
  "title": "山东春昌食品科技股份有限公司官网",
  "description": "山东春昌食品科技股份有限公司企业官网，提供黄油等乳制品相关产品、企业采购和渠道合作咨询。",
  "keywords": ["山东春昌食品科技", "黄油", "乳制品", "食品科技", "企业采购", "渠道合作"]
}
```

Required:

- `title`
- `description`

Optional:

- `keywords`

## 8. customConfig

Example:

```json
{
  "mobileContactBar": true,
  "leadEntryPoints": ["phone", "wechat", "message"]
}
```

Purpose:

- Toggles and small settings that do not deserve first-class columns.

Current expected fields:

- `mobileContactBar`: show bottom contact bar on mobile public site.
- `leadEntryPoints`: enabled conversion channels.

## 9. contentConfig

### 9.1 Hero

Example:

```json
{
  "hero": {
    "headline": "绿色健康乳制品供应与合作服务",
    "subheadline": "面向食品加工、烘焙餐饮、经销批发和渠道合作客户，提供黄油等乳制品相关产品与咨询合作服务。",
    "primaryCta": "电话咨询",
    "secondaryCta": "提交合作咨询",
    "imageUrl": null
  }
}
```

Required:

- `headline`
- `subheadline`
- `primaryCta`

Allowed to be null:

- `imageUrl`

### 9.2 Advantages

Example:

```json
{
  "advantages": [
    {
      "title": "聚焦乳制品相关需求",
      "description": "围绕黄油等乳制品场景，帮助客户快速了解产品与合作方式。"
    }
  ]
}
```

Rules:

- Keep copy factual.
- Avoid unsupported claims about production strength, certifications, or customers.

### 9.3 About

Example:

```json
{
  "about": {
    "summary": "山东春昌食品科技股份有限公司专注于黄油等乳制品相关产品与食品科技服务。网站当前内容为 MVP 默认资料，后续应根据企业真实资料补充公司介绍、工厂图片、资质证明和合作案例。",
    "imageUrl": null
  }
}
```

Required:

- `summary`

Allowed to be null:

- `imageUrl`

### 9.4 Cooperation

Example:

```json
{
  "cooperation": {
    "title": "合作机会",
    "description": "欢迎食品加工、烘焙餐饮、经销批发和渠道合作客户留下需求，我们会根据产品、区域和合作方式进一步沟通。",
    "items": ["企业采购", "经销批发", "渠道合作", "产品咨询"]
  }
}
```

Required:

- `title`
- `description`
- `items`

### 9.5 Contact

Example:

```json
{
  "contact": {
    "phone": null,
    "wechat": null,
    "wechatQrUrl": null,
    "address": null,
    "messageEnabled": true,
    "notice": "电话、微信、地址和二维码等待企业真实资料补充。"
  }
}
```

Required:

- `messageEnabled`

Allowed to be null until real material is available:

- `phone`
- `wechat`
- `wechatQrUrl`
- `address`

## 10. BE-004 Validation Target

When implementing `PUT /api/sites/{siteId}/config`, validate or default these sections:

- `brandConfig.companyName`
- `brandConfig.shortName`
- `contentConfig.hero`
- `contentConfig.contact`
- `contentConfig.about`
- `contentConfig.cooperation`
- `seoConfig.title`
- `seoConfig.description`
- `navigationConfig.items`

Validation should reject structurally invalid data, but it should not require real-world materials that may not exist yet, such as logo, QR code, or phone number.

## 11. Frontend Form Mapping

Recommended dashboard edit tabs:

- 基础信息 -> `Site` fields and `brandConfig`
- 首页内容 -> `contentConfig.hero`, `contentConfig.advantages`, `contentConfig.about`
- 产品服务 -> `product_services`
- 最近动态 -> `news`
- 合作机会 -> `contentConfig.cooperation`
- 联系方式 -> `contentConfig.contact`
- 留言咨询 -> `leads`
- 预览发布 -> public preview and build actions

Frontend should submit structured JSON as-is. Backend should validate required sections and preserve unknown fields when possible.
