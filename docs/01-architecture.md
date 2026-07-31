# 01 — Architecture

A Next.js 16 App Router application in the hexagonal shape every `@jterrazz` app follows: the framework stays at the edge, the middle is plain TypeScript.

## Layers (`src/`)

| Layer             | Role                                                                                                            |
| ----------------- | --------------------------------------------------------------------------------------------------------------- |
| `app/`            | Routes only — pages assemble a template, route handlers serve files/JSON. No business logic.                    |
| `domain/`         | Entities (`Article`, `Experiment`, `Photograph`, `Feature`) and pure utilities. Imports nothing above.          |
| `infrastructure/` | Repositories (in-memory registries over `assets/`), SEO builders, analytics, navigation.                        |
| `presentation/`   | Templates (one per page), view-models, and the UI tree (`design-system` → `atoms` → `molecules` → `organisms`). |

## The template / view-model rule

A template renders; it never computes. Anything derived — series position, sibling links, related articles, reading time — lives in a sibling `*-view-model.ts` so it can be exercised without rendering. `article-template-view-model.ts` and `articles-list-template-view-model.ts` are the references.

## The design system

`presentation/ui/design-system/` is the shared vocabulary (`Container`, `Section`, `Heading`, `Lead`, `Tag`, `ArrowLink`, `DottedGrid`). New components compose these instead of raw Tailwind. Widths are driven by the adaptive shell: pages self-declare via `data-shell` and the navbar/footer follow (`--shell-width` in `globals.css`).

## Locales

`next-intl`, `en` default (no prefix) + `fr` (`/fr`). An article with no French source still renders under `/fr` but canonicalises to the English URL — deliberate, see [02 — Content](02-content.md).
