# EAS Article Timestamping

Cryptographically prove article publication dates and authorship using **EAS (Ethereum Attestation Service) on Base L2**.

Each attestation proves:

- **What** — keccak256 hash of the article content
- **When** — immutable block timestamp
- **Who** — your Ethereum wallet signature

## Prerequisites

1. An Ethereum wallet (the signing address becomes your public identity)
2. ~$0.50 ETH on Base L2 (for gas across all 23 articles)
3. Optionally, register `jterrazz.eth` ENS name pointing to the wallet

## EAS Schema

Register once on Base. Schema definition:

```
bytes32 contentHash, string title, uint256 articleIndex, string url
```

| Field          | Purpose                                                                           |
| -------------- | --------------------------------------------------------------------------------- |
| `contentHash`  | `keccak256("en:{en.md}\n---\nfr:{fr.md}")` — raw files, `\r\n` normalized to `\n` |
| `title`        | English article title (human-readable on explorer)                                |
| `articleIndex` | `publicIndex` from article config (stable cross-reference)                        |
| `url`          | Canonical article URL, e.g. `https://jterrazz.com/articles/1-master-memory-...`   |

Contracts on Base:

- EAS: `0x4200000000000000000000000000000000000021`
- SchemaRegistry: `0x4200000000000000000000000000000000000020`
- Explorer: https://base.easscan.org

## Implementation Steps

### 1. Install dependencies

```bash
npm install -D @ethereum-attestation-service/eas-sdk ethers tsx
```

### 2. Environment setup

Create `.env` (never commit):

```
EAS_PRIVATE_KEY=0x...
BASE_RPC_URL=https://mainnet.base.org
```

Add `.env` and `.env.local` to `.gitignore`.

### 3. Add scripts to `package.json`

```json
{
  "eas:register-schema": "tsx scripts/register-schema.ts",
  "eas:timestamp": "tsx scripts/timestamp-articles.ts"
}
```

### 4. Create `scripts/register-schema.ts`

One-time script that registers the schema on Base EAS and outputs the schema UID.

### 5. Create `scripts/timestamp-articles.ts`

Main CLI script that for each published article:

1. Reads raw `en.md` + `fr.md` from `/content/{filename}/`
2. Computes `keccak256` of the concatenated content
3. Creates an EAS attestation (non-revocable, no expiration)
4. Outputs the attestation UID

Should support `--dry-run` to preview without transacting. Skips articles that already have an `attestationUid`.

### 6. Code changes

**Domain** — Add `attestationUid?: string` to:

- `Article` interface in `src/domain/article.ts`
- `RawArticleInput` type
- `createArticle()` factory passthrough

**Infrastructure** — In `src/infrastructure/repositories/articles.repository.ts`:

- Add `attestationUid?: string` to `ArticleConfig` type
- Thread it through `loadArticles()` into `createArticle()`
- After running the script, paste each UID into the corresponding article config entry

**Config** — Add to `src/config/site.ts`:

```typescript
ethereum: {
    walletAddress: '0x...', // your signing wallet
    easExplorerUrl: 'https://base.easscan.org',
},
```

**Presentation** — Thread `attestationUid` through:

- `src/app/[locale]/articles/[slugId]/page.tsx` → pass to template
- `src/presentation/templates/article.template.tsx` → pass to footer
- `src/presentation/ui/organisms/article-footer/article-footer.tsx` → render badge

Badge renders between the author section and the publication date:

```tsx
{
  attestationUid && (
    <a href={`https://base.easscan.org/attestation/view/${attestationUid}`}>
      <IconShieldCheckFilled /> Signed on-chain · 0xabc1...ef23
    </a>
  );
}
```

### 7. Run it

```bash
# 1. Register schema (once)
EAS_PRIVATE_KEY=0x... npm run eas:register-schema
# Copy the output schema UID into scripts/timestamp-articles.ts

# 2. Timestamp all articles
EAS_PRIVATE_KEY=0x... npm run eas:timestamp --dry-run  # preview first
EAS_PRIVATE_KEY=0x... npm run eas:timestamp             # submit for real
# Copy the output UIDs into ARTICLES_CONFIG
```

## Verification

- `npm run build` passes with no type errors
- Article pages show "Signed on-chain" badge linking to base.easscan.org
- Articles without attestation show no badge
- Re-hashing an article's content locally matches the on-chain `contentHash`

## Trust Chain

```
Article markdown
    -> keccak256 hash
        -> EAS attestation signed by 0xYourWallet
            -> 0xYourWallet is jterrazz.eth (optional ENS)
                -> jterrazz.eth linked from jterrazz.com
```
