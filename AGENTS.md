# jterrazz-web — agent brief

Personal site (jterrazz.com): articles, experiments, photographs. Next.js 16 App Router application in the `@jterrazz` stack — knowledge is authored in `docs/`, this file only routes.

## Mental model

- **Hexagonal**: `app/` routes → `presentation/` templates (+ view-models) → `domain/` + `infrastructure/`. Templates render, view-models compute.
- **Content is data**: `assets/` is a synced copy of the published subset of a private notes repo. The markdown bytes are signed — never reformat them.
- **One declaration projects the SEO surface**: `reach.config.ts` → sitemap, robots, llms.txt, feed, identity graph.
- **Specs gate deploys**: unit tests as siblings, the rendered site driven in a real browser under `specs/website/`.

## Routing table

| Working on…                                    | Read                      |
| ---------------------------------------------- | ------------------------- |
| Layers, templates, design system, locales      | `docs/01-architecture.md` |
| `assets/`, sync, the `/content/*` URL contract | `docs/02-content.md`      |
| Signing, proofs, the verify surfaces           | `docs/03-attestation.md`  |
| reach projections, JSON-LD, redirects          | `docs/04-reach-seo.md`    |
| Test layout, journey doctrine, spec pitfalls   | `docs/05-testing.md`      |
| CI/CD, Docker, analytics, environment          | `docs/06-operations.md`   |

## Always

- `typescript fix` before committing; `npm test` runs everything (website suite needs `npx playwright install chromium` once).
- Retitled article → **append** the old slug to `src/config/redirects.ts`, never remove entries.
- New derived page logic goes in a view-model, not a template.
- `assets/` and its attestations are read-only for tooling: lint/format ignore the tree by design.
