import { _ as InvalidContentError, a as stringify, c as buildAttestationMessage, d as SignedAttestation, f as StoredAttestation, g as VerifyResult, h as VerifyOk, i as parse, m as VerifyFail, n as verifyAttestation, o as toStored, p as VerifyError, r as fromStored, s as CreateAttestationInput, t as VerifyInput, v as canonicalize } from "./verify.cjs";
import { a as ArticleSubject, i as ArticleClaims, n as ATTESTATION_PRIMARY_TYPE, o as AttestationMessage, r as ATTESTATION_TYPES_V1, s as NO_PRIOR_ATTESTATION, t as ATTESTATION_DOMAIN_V1 } from "./eip712-schema.cjs";
//#region src/core/sha256.d.ts
/**
 * SHA-256 of bytes, returned as bare hex (no 0x prefix).
 *
 * Uses @noble/hashes — pure JS, sync, audited, runs identically in Node, Bun,
 * Deno, and every modern browser. This is the only hash primitive used by the
 * package, so swapping the implementation here is the single point of change.
 */
declare function sha256Hex(bytes: Uint8Array): string;
//#endregion
//#region src/browser/ens.d.ts
/**
 * Reverse-resolve an Ethereum address to its primary ENS name.
 *
 * Pure display concern — never persisted in the attestation file. The signer
 * lib operates on addresses; this is rendered dynamically by web consumers who
 * want a friendlier label.
 *
 * Returns null on any failure (network, no name set, malformed reply).
 */
declare function resolveEnsName(address: `0x${string}`): Promise<null | string>;
//#endregion
//#region src/browser/types.d.ts
type ProofManifest = {
  schemaVersion: number;
  slug: string;
  content: string;
  attestation: string;
  ots: string;
  /**
   * Optional URL of a server-side OTS verifier. The browser cannot validate
   * OpenTimestamps proofs locally (the lib needs Node `fs` + `crypto`), so
   * publishers expose this endpoint to delegate the Bitcoin check.
   *
   * Returns: { ok: true; bitcoinTime: ISO } | { ok: false; reason; details? }
   */
  otsVerifier?: string;
};
type AuthorshipState = {
  kind: 'failed';
  error: 'fetch' | VerifyError['kind'];
  details?: string;
} | {
  kind: 'fetching';
} | {
  kind: 'idle';
} | {
  kind: 'verified';
  signerAddress: `0x${string}`;
  signerEns?: string;
  signedAt: Date;
} | {
  kind: 'verifying';
};
type DateState = {
  kind: 'failed';
  error: 'digest-mismatch' | 'fetch' | 'invalid-proof';
  details?: string;
} | {
  kind: 'fetching';
} | {
  kind: 'idle';
} | {
  kind: 'pending';
} | {
  kind: 'skipped';
  reason: 'browser-runtime' | 'no-ots-file' | 'opt-out';
} | {
  kind: 'verified';
  bitcoinTime: Date;
} | {
  kind: 'verifying';
};
//#endregion
//#region src/browser/verify-from-url.d.ts
type VerifyFromUrlOptions = {
  /**
   * Skip Bitcoin/OTS verification entirely. Default false — verifyFromUrl
   * lazy-loads `javascript-opentimestamps` (~200kB) and validates the proof
   * against a public Bitcoin block API. Fails open: bundling/polyfill issues
   * fall back to `skipped` rather than throwing.
   */
  skipOts?: boolean;
  /**
   * Custom fetch (useful for tests or proxies). Defaults to global fetch.
   */
  fetchFn?: typeof fetch;
};
type VerifyFromUrlReport = {
  authorship: AuthorshipState;
  date: DateState;
};
/**
 * End-to-end verify a published article from its public URL.
 *
 * Pipeline:
 *  1. Resolve the article URL → manifest URL (`{url}/proof.json`)
 *  2. Fetch manifest, then content (md), attestation (json), ots (bytes)
 *  3. Recompute SHA-256 of canonical content, recover EIP-712 signer
 *  4. Optionally verify the OTS proof (skipped in browser by default)
 *
 * The same call works in Node, Edge runtime, and modern browsers because the
 * underlying primitives (canonicalize, sha256, recoverTypedDataAddress) are all
 * platform-agnostic.
 */
declare function verifyFromUrl(articleUrl: string, opts?: VerifyFromUrlOptions): Promise<VerifyFromUrlReport>;
//#endregion
export { ATTESTATION_DOMAIN_V1, ATTESTATION_PRIMARY_TYPE, ATTESTATION_TYPES_V1, type ArticleClaims, type ArticleSubject, type AttestationMessage, type AuthorshipState, type CreateAttestationInput, type DateState, InvalidContentError, NO_PRIOR_ATTESTATION, type ProofManifest, type SignedAttestation, type StoredAttestation, type VerifyError, type VerifyFail, type VerifyFromUrlOptions, type VerifyFromUrlReport, type VerifyInput, type VerifyOk, type VerifyResult, buildAttestationMessage, canonicalize, fromStored, parse, resolveEnsName, sha256Hex, stringify, toStored, verifyAttestation, verifyFromUrl };
//# sourceMappingURL=browser.d.cts.map