# Local Demo And Acceptance Guide

This guide describes the current local demo path for the Website Builder MVP.

The current demo target is the Shandong Chunchang Food Technology Co., Ltd. corporate site.

## 1. Local Services

Start PostgreSQL and Redis:

```bash
make dev-up
```

Apply database migrations:

```bash
make db-migrate
```

Start the backend:

```bash
make server-start
```

Start the frontend in a second terminal:

```bash
make web-start
```

Alternative combined command:

```bash
make start
```

## 2. Local URLs

| Area | URL |
| --- | --- |
| Frontend | `http://localhost:3000` |
| Backend API | `http://localhost:8080` |
| Admin login | `http://localhost:3000/login` |
| Public Chunchang site | `http://localhost:3000/sites/chunchang` |
| Public Chunchang news column | `http://localhost:3000/sites/chunchang/news` |
| Dashboard site detail | `http://localhost:3000/dashboard/sites/1` |
| Dashboard content management | `http://localhost:3000/dashboard/sites/1/content` |
| Dashboard build history | `http://localhost:3000/dashboard/sites/1/builds` |

Admin login:

```text
email: admin@xiao9.com
password: admin123
```

## 3. Current Demo Scope

The local MVP currently demonstrates:

- Chinese admin login.
- Site dashboard.
- Public Chinese corporate site for `chunchang`.
- Editable site configuration.
- Editable up-to-three-level menus.
- Menu-scoped articles.
- Product/service management.
- Lead collection from public contact forms.
- Lead status management.
- Publish/build trigger.
- Latest build status.
- Dedicated build-history page.
- Launch-material readiness checklist.
- Real-material URL inputs for logo, WeChat QR code, product images, and article covers.

## 4. Acceptance Checklist

Run these commands before claiming the local demo is healthy:

```bash
npm run lint:web
npm run build:web
npm run build:server
```

When Docker services are running, verify the database:

```bash
make db-status
```

HTTP smoke checks:

```bash
curl -s -o /tmp/wb-home.html -w '%{http_code}\n' http://localhost:3000/
curl -s -o /tmp/wb-login.html -w '%{http_code}\n' http://localhost:3000/login
curl -s -o /tmp/wb-public.html -w '%{http_code}\n' http://localhost:3000/sites/chunchang
curl -s -o /tmp/wb-news.html -w '%{http_code}\n' http://localhost:3000/sites/chunchang/news
curl -s -o /tmp/wb-content.html -w '%{http_code}\n' http://localhost:3000/dashboard/sites/1/content
curl -s -o /tmp/wb-builds.html -w '%{http_code}\n' http://localhost:3000/dashboard/sites/1/builds
curl -s -o /tmp/wb-public-config.json -w '%{http_code}\n' http://localhost:8080/api/public/sites/chunchang/config
```

Expected result for each smoke check:

```text
200
```

Authenticated API smoke:

```bash
TOKEN=$(curl -s -X POST http://localhost:8080/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"admin@xiao9.com","password":"admin123"}' \
  | sed -n 's/.*"access_token":"\([^"]*\)".*/\1/p')

curl -s -o /tmp/wb-sites.json -w '%{http_code}\n' http://localhost:8080/api/sites \
  -H "Authorization: Bearer $TOKEN"

curl -s -o /tmp/wb-site-build.json -w '%{http_code}\n' -X POST http://localhost:8080/api/sites/1/build \
  -H "Authorization: Bearer $TOKEN"
```

Expected result for both authenticated API checks:

```text
200
```

## 5. Important Local Dev Note

Do not run `next build` and keep relying on the same `next dev` process without restarting it.

This project uses `apps/web/.next` for both production build output and development server output. If `npm run build:web` runs while the dev server is already active, the dev server can serve stale chunks and return errors such as:

```text
Cannot find module './138.js'
```

Fix:

```bash
FRONT_PID=$(lsof -tiTCP:3000 -sTCP:LISTEN || true)
if [ -n "$FRONT_PID" ]; then kill $FRONT_PID; fi
rm -rf apps/web/.next
npm run dev:web
```

## 6. Remaining Real-Material Inputs

The product avoids inventing unverified company facts.

Before a real launch, collect and enter:

- real logo image URL
- phone number
- WeChat or enterprise WeChat
- WeChat QR code image URL
- company address
- product photos
- product specifications
- certificates or qualifications
- cooperation cases
- real company news or product knowledge articles

## 7. Known Local Limitation

Graphify refresh is currently blocked on this machine because the local Python environment does not have the `graphify` package installed:

```text
ModuleNotFoundError: No module named 'graphify'
```
