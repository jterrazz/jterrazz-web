# 05 — Testing

Two vitest projects (`vitest.config.ts`), conventions from `@jterrazz/test` (lint-enforced: Given/Then, pure scenarios, user-facing elements).

| Project   | Where              | What                                                           |
| --------- | ------------------ | -------------------------------------------------------------- |
| `unit`    | `src/**/*.test.ts` | Pure logic as siblings of the source                           |
| `website` | `specs/website/**` | The production build, booted and driven through a real browser |

The website suite rebuilds `.next` only when a source is newer than the build marker, then boots `next start` once for the whole run. One-time setup: `npx playwright install chromium`.

## The journey doctrine

`specs/website/journeys/` walks reader intentions, one file per intention. A journey earns its place only when its failure is **silent** — the page answers 200 while being wrong. Anything that 404s or 500s is already caught by the crawl suite; anything visibly broken is not worth a browser test.

Rules learned the hard way, encoded in the specs:

- **Subjects are derived, never pinned** — `journeys/subjects.ts` picks articles from the repositories, so retitles don't rot the suite.
- **Wait on the destination's description, not its title** — sibling titles render in list cards and footers, so a title is often visible _before_ the click and the capture races the navigation.
- **`PageResult.status` describes the entry document**, not where a scenario navigated to — assert `url`/`content` after in-scenario navigation.
- **Never gate on a third party** — see [03 — Attestation](03-attestation.md).
- Ambiguous element descriptors are refused (W3): scope with `within(navigation(), …)` rather than reaching for `testId()`.

## Surfaces vs journeys

`crawl/` (every sitemap URL loads, every internal link resolves), `surfaces/` (head wiring of an article), `redirects/` (the registry), `conformance/` (reach rule pack) assert the static truth; journeys assert behaviour. Keep new specs in the layer that matches what breaks.
