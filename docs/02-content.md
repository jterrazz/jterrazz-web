# 02 — Content

## Source of truth

Articles are authored in the **private** `jterrazz-articles` repo, checked out at `~/Documents/Studio/Article/Atelier`. Only its published subset — `Publications/@jterrazz/` — ever reaches this repo. Drafts, inbox and flows never leave it.

`npm run sync` (`scripts/sync-assets.sh`) refreshes `assets/` from that folder. It resolves the source **before** touching anything and refuses a missing or empty source — the previous one-liner deleted all articles when the library moved. Override the source with `ASSETS_SOURCE`.

## Layout

```
assets/<YYYY-MM-DD Title>/
  en.md                  # signed source — bytes are load-bearing
  fr.md                  # translation (optional)
  en.attestation.json    # EIP-712 signature over en.md   (see 03)
  en.ots                 # OpenTimestamps proof            (see 03)
  assets/                # images referenced by the markdown
```

The article registry (`src/infrastructure/repositories/articles.repository.ts`) maps folders to `publicIndex`, titles, series and categories. Adding an article means syncing the folder **and** registering it there.

## The URL contract

The directory is `assets/`, the public prefix is `/content/*` — on purpose. Those URLs are the articles' `og:image` and the RSS enclosures, served `immutable, max-age=1y`; renaming them would break every shared card, and `/assets/*` belongs to `public/assets`. `content-url.ts` appends a content hash (`?v=`) so only changed files bust.

## Rules that look like bugs

- **Never reformat `assets/`** — the attestation JSONs are signed over their exact bytes; both lint configs ignore the tree for that reason.
- **Untranslated articles canonicalise to English** — serving the fallback under `/fr` with a French canonical would make two URLs compete for one document.
