# 03 — Attestation

Every article carries a cryptographic claim: **who** wrote it (EIP-712 signature over the English source) and **when** (OpenTimestamps anchor in Bitcoin). Built on `@jterrazz/attestation`.

## Signing (operator side)

- `npm run sign:all` — signs every registered article (EIP-712 via browser wallet), writes `en.attestation.json`, queues an OTS stamp.
- `npm run sign:upgrade` — re-checks pending `.ots` proofs (~24h after signing) and attaches the Bitcoin block timestamp.

## Verifying (reader side)

| Surface                            | What it does                                                                |
| ---------------------------------- | --------------------------------------------------------------------------- |
| Badge in the article footer        | Live EIP-712 recovery in the reader's browser, verdict crossfades in        |
| `/articles/<slug>/verify`          | The proof page — both claims explained, ProofCard resolves them live        |
| `/articles/<slug>/proof.json`      | The attestation, canonicalised, for independent verification                |
| `/articles/<slug>/verify-ots.json` | Server-side OTS check against a public Bitcoin block source (1h revalidate) |

## The testing rule

Authorship verification is local and deterministic — specs assert `Verified` outright. The **date** verdict resolves through a third-party Bitcoin source, so specs assert that the claim _explains itself in every state_ and never pin `Anchored`: gating deploys on Esplora's uptime is how CI broke once (`specs/website/journeys/attestation.test.ts` records this).
