# Final Launch Checklist

This checklist separates completed local MVP work from the real company materials still required before a public launch.

Current status:

- Local platform MVP: ready for demo.
- Public Chunchang site: ready for local review.
- Real public launch: blocked by company materials and final human approval.

## 1. Code And Local Demo Acceptance

The code side can be considered locally accepted when all items below pass.

| Item | Status | Evidence |
| --- | --- | --- |
| Docker database/cache are running | Ready | `wb-postgres` and `wb-redis` healthy |
| Database migrations are applied | Ready | Flyway schema version `6` |
| Frontend runs locally | Ready | `http://localhost:3000` |
| Backend runs locally | Ready | `http://localhost:8080` |
| Admin login works | Ready | `admin@xiao9.com / admin123` |
| Public Chunchang homepage works | Ready | `/sites/chunchang` returns `200` |
| Public Chunchang news column works | Ready | `/sites/chunchang/news` returns `200` |
| Content management works | Ready | `/dashboard/sites/1/content` returns `200` |
| Build history works | Ready | `/dashboard/sites/1/builds` returns `200` |
| Authenticated site API works | Ready | `GET /api/sites` returns `200` |
| Build trigger works | Ready | `POST /api/sites/1/build` returns `200` |

Detailed local commands are in:

- [LOCAL_DEMO_ACCEPTANCE.md](./LOCAL_DEMO_ACCEPTANCE.md)

## 2. Company Materials Required Before Public Launch

Do not invent any missing company facts.

| Material | Required For | Current Handling |
| --- | --- | --- |
| Logo image | Header and brand trust | URL field exists; fallback text mark is shown |
| Phone number | Fast customer contact | Missing value is marked as pending |
| WeChat / enterprise WeChat | Ad and sales conversion | Missing value is marked as pending |
| WeChat QR code image | Mobile conversion | URL field exists; hidden until configured |
| Company address | Credibility and contact | Missing value is marked as pending |
| Product photos | Product/service cards | URL fields exist; hidden until configured |
| Product specifications | Product detail copy | Must be entered as verified content |
| Certificates / qualifications | Trust proof | Must be entered only after material is provided |
| Cooperation cases | Business credibility | Must be entered only after material is provided |
| Real company news | Public news section | Draft placeholders should be replaced or deleted |

## 3. Admin Data Entry Checklist

Use the dashboard content management page:

```text
http://localhost:3000/dashboard/sites/1/content
```

### Site Configuration

- Company full name is correct.
- Short name is correct.
- Business direction is accurate.
- Brand keywords are accurate.
- Logo image URL is entered if available.
- SEO title and description are reviewed.
- Hero title and subtitle are reviewed.
- About summary is reviewed.
- Cooperation title, description, and items are reviewed.
- Phone number is entered.
- WeChat is entered.
- WeChat QR code URL is entered if available.
- Address is entered.
- Contact notice is reviewed.

### Menus

- Homepage exists and remains system-managed.
- Product/service menu is visible.
- About menu is visible.
- News/menu articles are assigned to the intended columns.
- Cooperation and contact menus are visible.
- Menu hierarchy does not exceed three levels.
- Hidden menus are intentionally hidden.

### Product Services

- Each public product/service has a verified name.
- Each public product/service has a factual summary.
- Descriptions do not claim unsupported certifications, capacity, or customer names.
- Product image URLs are entered where available.
- Enabled products are intended to appear on the public site.

### Articles

- Placeholder draft articles are replaced, deleted, or kept unpublished.
- Published articles have a menu assignment.
- Published articles have a useful summary.
- Published articles have enough body content for a public detail page.
- Cover image URLs are entered where available.
- Article facts are verified by the company owner/operator.

### Leads

- Public lead form is tested.
- Submitted lead appears in the dashboard.
- Lead status can be changed from new to contacted/closed/invalid.

## 4. Public Site Review Checklist

Review:

```text
http://localhost:3000/sites/chunchang
```

Check:

- First viewport clearly identifies 山东春昌食品科技股份有限公司.
- Visual direction feels green, healthy, ecological, professional, stable, simple, and approachable.
- The main CTA leads to contact/inquiry.
- Product/service cards are clear.
- Contact section contains real phone/WeChat/address when available.
- Missing real materials are not disguised as real.
- Mobile bottom action bar does not cover important content.
- News section shows real published content or a clear empty state.
- Menu pages work.
- Article detail pages work for published articles.

## 5. Final Approval Checklist

Before a real public launch, the human owner should confirm:

- Company name is legally correct.
- Phone and WeChat are correct.
- Address is correct.
- Product descriptions are accurate.
- Any certificate/qualification claims are backed by real documents.
- Any cooperation cases are approved for public display.
- No placeholder text remains on public pages unless intentionally used as an empty state.
- No fake founding year, production capacity, customer name, award, or certification is present.
- Build history shows the latest successful build.
- The final public URL is confirmed.

## 6. Current Remaining Work

Technical backlog:

- Optional article preview pane.
- Optional cover-image preview in the dashboard.
- Optional richer article formatting.
- Optional future media library instead of URL-only image entry.

Material backlog:

- Real company logo.
- Phone.
- WeChat / enterprise WeChat.
- QR code.
- Address.
- Product photos.
- Product specifications.
- Certificates.
- Cases.
- Real news.
