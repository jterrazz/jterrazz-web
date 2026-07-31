# 04 — Reach & SEO

## One declaration, many projections

`reach.config.ts` (`@jterrazz/reach`) declares the site once — canonical host, identity, locales, channels — and projects every surface from it: metadata, the identity graph (JSON-LD `WebSite` + `Person`), `sitemap.xml`, `robots.txt`, `llms.txt`, `feed.xml`. Do not hand-author what it projects; change the declaration.

The canonical host is `www.jterrazz.com` (the apex 301s at the ingress). Naming the apex anywhere would turn every projected URL into a redirect.

## App-specific structured data

`src/infrastructure/seo/json-ld.ts` builds what reach cannot know: `BlogPosting`, breadcrumbs, `CollectionPage`, experiment `SoftwareSourceCode` (+ `LearningResource` for 42 projects). Everything references the canonical Person by `@id` — one entity, site-wide.

## The redirect registry

`src/config/redirects.ts` is the contract: every legacy slug, locale alias and `/go/*` smart link lives there, and `specs/website/redirects/registry.test.ts` exercises each one against the real build. Retitling an article means **appending** its old slug to the legacy list — never removing entries.

`/go/<slug>` device-routes to App Store / Play Store / experiment page, tracks `app_link_opened` server-side, and is hidden from crawlers via the reach `discovery.hidden` list.

## Conformance

`specs/website/conformance/conformance.test.ts` runs the reach rule pack against the rendered site — canonical host, hreflang, single Person, robots/sitemap coherence, console silence. If a projection and the site disagree, this is what fails.
