<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Project workflow

- Use Codex for this project. Do not invoke or install Claude tooling.
- For a new feature, follow PoC (unless the path is already proven), Codex design with a clickable prototype, MVP, then one major feedback fix at a time. State the current step and its exit condition.
- This repository already contains Spec Kit integration in `.specify/`; follow its existing conventions before adding new workflow files.
- Keep `.env`, SQLite data, uploaded media, customer inquiries, private company materials, and credentials out of Git.
- Run `npm run typecheck` and `npm run build` before claiming a code change is ready. Use isolated `verification-*.sqlite` databases for scripts that write test data.
- Publishing code is separate from deployment. Do not claim the public site is live until real company content, filing, HTTPS, server coexistence, and rollback have been verified.
