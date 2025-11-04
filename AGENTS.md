# Repository Guidelines

This repository hosts a static Linux Cheatsheet built with Astro + TypeScript + Tailwind. Keep edits focused, consistent, and easy to review.

## Project Structure & Module Organization
- Pages: `src/pages/index.astro`, `src/pages/commands/index.astro`, `src/pages/commands/[slug].astro`.
- Content: MDX under `src/content/commands/*.mdx`; schema in `src/content/config.ts` (frontmatter: `title`, optional `description`, `flags`, `examples`, `danger`).
- UI: `src/layouts/BaseLayout.astro`, components in `src/components/*`, client scripts in `src/scripts/*.client.ts`.
- Search: `src/pages/search.json.ts` exposes `{ items }` for FlexSearch.
- Assets & styles: `public/`, `src/styles/*`, tokens in `tailwind.config.cjs`.

## Build, Test, and Development Commands
- `npm run dev` — Start local dev server (http://localhost:4321).
- `npm run build` — Build static site to `dist/`.
- `npm run preview` — Serve the built site locally.
Tip: `npx astro check` can validate TS/content types if installed.

## Coding Style & Naming Conventions
- Indent 2 spaces; single quotes; avoid trailing semicolons (match existing).
- Use the `@` alias for imports from `src/` (see `astro.config.mjs`).
- Components use `PascalCase.astro`; MDX files use command names, e.g. `grep.mdx`.
- Prefer utility-first Tailwind; keep class lists readable and grouped by role.
- Dangerous examples: wrap explanatory notes in `<Danger>` and consider frontmatter `danger: true` on items.
Example frontmatter:
```mdx
---
title: tar
description: 归档与压缩工具
examples:
  - { title: 打包目录, command: "tar -czf out.tgz dir" }
---
```

## Testing Guidelines
- No unit tests currently. Validate via `npm run preview` and exercise:
  - Command pages render; search panel finds items; theme toggle and view transitions behave.
- Keep MDX frontmatter conforming to `src/content/config.ts` (Zod schema).

## Commit & Pull Request Guidelines
- Use Conventional Commits: `feat:`, `fix:`, `docs:`, `refactor:`, `style:`, `chore:`; optional scope like `(commands)` or `(search)`.
- PRs include: clear summary, linked issues (if any), and UI screenshots for visual changes. For new commands, add a screenshot and list key flags covered.
- Follow editorial decisions in `docs/DECISIONS.md` (tone, “危险操作” policy, example structure).

## Security & Configuration Tips
- Do not include secrets or machine-specific paths.
- Prefer safe/dry‑run examples by default; mark destructive commands clearly and avoid `sudo`/`-f` unless essential.
