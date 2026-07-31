# 06 — Operations

## Pipeline

Push to `main` → `validate.yaml` (shared `jterrazz-actions` validate: `make build/lint/test`, Playwright browsers provisioned) and `build-and-deploy.yaml` (validate again, then `release-docker.yaml`: image → `registry.internal.jterrazz.com` over Tailscale → Helm deploy on k3s, manifest in `.infrastructure/application.yaml`).

`lint` is `typescript check` — types, oxlint, oxfmt, knip and the `@jterrazz/test` conventions in one gate. `typescript fix` before committing.

## Docker specifics

The runner stage copies `.next/standalone` only: Next's file tracing pulls `assets/` in by itself (the `/content/*` route reads it from `process.cwd()` at request time). `.next/cache/images` is pre-created for uid 1000 — without it every image optimisation EACCESes. libvips threads and memory are capped in the manifest (OOM history).

## Analytics

Server-side OpenPanel through `@jterrazz/analytics` (`src/infrastructure/analytics/analytics.ts`). The tracking plan is the `WebEvents` interface — every event is declared there, `object_action` snake_case past tense. Client-side: Vercel Analytics + Speed Insights. No client id configured (local, previews) → the noop adapter, silently.

## Environment

Secrets come from Infisical via the shared workflows; `NEXT_PUBLIC_BASE_URL` overrides the canonical host for previews. There is no runtime database — the site's only state is the filesystem (`assets/`) baked into the image.
