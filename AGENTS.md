# jterrazz-web

Personal site — [jterrazz.com](https://www.jterrazz.com): articles, experiments, photographs. Next.js 16 App Router on the `@jterrazz` stack. This file is the whole brief: everything below is knowledge you cannot derive from the code alone.

## Architecture

Hexagonal: `app/` (routes only) → `presentation/` (templates + view-models + UI tree) → `domain/` + `infrastructure/` (repositories over `assets/`, SEO builders, analytics).

- **Templates render, view-models compute.** Anything derived — series position, sibling links, reading time — lives in a sibling `*-view-model.ts` builder function so it is exercisable without rendering. References: `article-template-view-model.ts`, `articles-list-template-view-model.ts`.
- **Compose the design system** (`presentation/ui/design-system/`: `Container`, `Section`, `Heading`, `Lead`, `Tag`, `ArrowLink`), not raw Tailwind. Page widths self-declare via `data-shell`; the navbar/footer follow (`--shell-width`, `globals.css`).
- Locales: `en` default (no prefix), `fr` under `/fr` (next-intl).

## Content — the rules that look like bugs

`assets/` is a synced copy of the **published subset** of the private notes repo (`~/Documents/Studio/Article/Atelier/Publications/@jterrazz`). `npm run sync` refreshes it and refuses a missing/empty source. Adding an article = sync the folder **and** register it in `articles.repository.ts`.

- **Never reformat `assets/`** — each `en.attestation.json` is an EIP-712 signature over the exact bytes of `en.md`; both lint configs ignore the tree for that reason. Reformatting invalidates every proof on the site.
- **The directory is `assets/`, the public prefix is `/content/*`** — on purpose. Those URLs are the `og:image` and RSS enclosures, served immutable for a year; `/assets/*` belongs to `public/assets`. See `content-url.ts`.
- **An untranslated article renders under `/fr` but canonicalises to English** — deliberate; the body is the English source either way, so two URLs must not compete for one document.
- **Retitled article → append the old slug to `src/config/redirects.ts`** — the registry is append-only, and each entry is exercised by the redirects spec.

## Attestation

`npm run sign:all` signs (EIP-712, browser wallet) and queues OpenTimestamps stamps; `npm run sign:upgrade` attaches Bitcoin block timestamps ~24h later. Reader-side verification: footer badge (live recovery in-browser), `/articles/<slug>/verify`, `proof.json`, `verify-ots.json` (server-side OTS check, 1h revalidate).

## Testing

Two vitest projects: `unit` (siblings in `src/`) and `website` (`specs/website/` — rebuilds `.next` when stale, boots `next start`, drives a real chromium). One-time: `npx playwright install chromium`.

Journeys (`specs/website/journeys/`) walk reader intentions and earn their place only when failure is **silent** — a 200 that is wrong. Hard-won rules, all encoded in the specs:

- Subjects are derived from the repositories (`journeys/subjects.ts`), never pinned to slugs.
- After a click that navigates, wait on the destination's **description** — titles render in list cards and footers, so waiting on one races the navigation.
- `PageResult.status` describes the **entry** document, not where a scenario navigated; assert `url`/`content` instead.
- Never pin a verdict that resolves through a third party (the Bitcoin date claim) — deploys must not depend on Esplora being up.
- Ambiguous descriptors are refused (W3): scope with `within(navigation(), …)`, don't reach for `testId()`.

## Operations

Push to `main` → shared `jterrazz-actions` validate (`make build/lint/test`) + Docker release (image → `registry.internal.jterrazz.com` over Tailscale → Helm/k3s, manifest `.infrastructure/application.yaml`). The runner copies `.next/standalone` only — Next's file tracing carries `assets/` in. No runtime database; the filesystem baked into the image is the only state.

Analytics: server-side OpenPanel via `@jterrazz/analytics`; the tracking plan is the `WebEvents` interface (`object_action`, snake_case, past tense). No client id → noop adapter.

## Conventions

- `typescript fix` before committing; `npm run lint` is `typescript check` (types + oxlint + oxfmt + knip + spec conventions).
- tsconfig extends the shared preset with three deliberate deltas the preset is behind on (ES2022, bundler resolution, react-jsx).
